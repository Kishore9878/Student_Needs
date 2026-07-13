import express from "express";
import expenseModel from "../models/Expenses/expenseModel.js";
import Booking from "../models/Tutorials/Booking.js";
import GradeModel from "../models/Attendance/GradeModel.js";
import { catchAsync } from "../utils/catchAsync.js";
import { computeActivityStatus } from "../utils/bookingActivityHelper.js";

import mongoose from "mongoose";
import protect from "../middlewares/Attendance/authMiddleware.js";

import Student from "../models/Referrals/StudentModel.js";
import Application from "../models/Referrals/ApplicationModel.js";
import expenseSettingsModel from "../models/Expenses/expenseSettingsModel.js";
import billModel from "../models/Expenses/billModel.js";
import { PersonalAttendanceService } from "../services/PersonalAttendanceService.js";

const router = express.Router();

router.use(protect);

/**
 * GET /api/analytics/student-dashboard
 * Aggregates live data for the student dashboard.
 */
router.get("/student-dashboard", catchAsync(async (req, res) => {
  const userId = req.user._id || req.user.id;

  // 1. Fetch Expenses (group by category for pie chart)
  const expenses = await expenseModel.aggregate([
    { $match: { userId: userId, type: "expense" } },
    { $group: { _id: "$category", totalAmount: { $sum: "$amount" } } },
    { $sort: { totalAmount: -1 } }
  ]);

  const expenseData = expenses.map(e => ({ name: e._id, value: e.totalAmount }));

  // 2. Fetch Recent Bookings for activity logic
  const allBookings = await Booking.find({ userId: userId }).sort({ createdAt: -1 });
  
  // Transform all bookings using the helper for consistency (student perspective)
  const activityTimeline = allBookings.map(b => ({
    id: b._id,
    ...b._doc,
    ...computeActivityStatus(b, true)
  }));

  const upcomingBookings = await Booking.find({ 
    userId: userId, 
    status: { $in: ["Booked", "pending", "upcoming", "scheduled", "accepted"] } 
  }).sort({ date: 1 }).limit(5);

  const upcomingTasks = upcomingBookings.map(b => ({
    id: b._id,
    title: `Class with ${b.tutorName}`,
    subject: b.subject,
    date: b.date,
    time: b.time,
    status: "Pending"
  }));

  // 3. Fetch CGPA Data (Aggregate grades by semester)
  const gradesAggr = await GradeModel.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    { $group: {
        _id: { semester: "$semester", term: "$term" },
        totalGradePoints: { $sum: { $multiply: ["$gradePoint", "$credits"] } },
        totalCredits: { $sum: "$credits" }
    }},
    { $sort: { "_id.semester": 1 } }
  ]);

  const cgpaData = gradesAggr.map(g => ({
    term: g._id.term || `Semester ${g._id.semester}`,
    cgpa: Number((g.totalGradePoints / g.totalCredits).toFixed(2))
  }));

  res.status(200).json({
    success: true,
    data: {
      cgpaData,
      expenseData,
      upcomingTasks,
      activityTimeline
    }
  });
}));

/**
 * GET /api/analytics/tutor-dashboard
 * Aggregates live data for the tutor dashboard.
 */
router.get("/tutor-dashboard", catchAsync(async (req, res) => {
  const tutorId = req.user._id || req.user.id;

  // 1. Fetch Recent Requests (Bookings where status is Pending/Booked)
  const recentBookings = await Booking.find({
    tutorId: tutorId.toString()
  }).sort({ createdAt: -1 }).limit(10).populate("userId");

  const recentRequests = recentBookings.slice(0, 5).map(b => ({
    id: b._id,
    studentName: b.userId?.toString?.().slice(0, 8) || "Student",
    subject: b.subject,
    date: b.date,
    time: b.time,
    status: b.status
  }));

  // 2. Activity Timeline (Shared computed logic for tutor perspective)
  const activityTimeline = recentBookings.map(b => ({
    id: b._id,
    ...b._doc,
    ...computeActivityStatus(b, false)
  }));

  res.status(200).json({
    success: true,
    data: {
      recentRequests,
      activityTimeline
    }
  });
}));

/**
 * GET /api/analytics/dashboard-summary
 * Aggregates all required live data for the student dashboard.
 */
router.get("/dashboard-summary", protect, catchAsync(async (req, res) => {
  const userId = req.user._id || req.user.id;

  // 1. Attendance stats
  let attendanceStats = { percentage: 0, total: 0, present: 0, absent: 0, list: [] };
  try {
    const stats = await PersonalAttendanceService.getStats(req.user);
    const list = await PersonalAttendanceService.getStudentAttendanceList(req.user);
    if (stats && stats.overall) {
      attendanceStats = {
        percentage: stats.overall.percentage || 0,
        total: stats.overall.total || 0,
        present: stats.overall.present || 0,
        absent: stats.overall.absent || 0,
        list: list || []
      };
    }
  } catch (err) {
    console.error("Error fetching attendance stats for dashboard summary:", err);
  }

  // 2. Expenses summary & current month list
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const endOfMonth = new Date(startOfMonth);
  endOfMonth.setMonth(endOfMonth.getMonth() + 1);

  let expenseSummary = {
    monthlyBudget: 0,
    totalSpent: 0,
    remainingBudget: 0,
    currency: "INR",
    hasBudget: false
  };
  let expensesList = [];

  try {
    const settings = await expenseSettingsModel.findOne({ userId }) || {
      monthlyBudget: 0,
      savingsGoal: 0,
      currency: "INR",
    };

    const monthlyExpenses = await expenseModel.find({
      userId,
      date: { $gte: startOfMonth, $lt: endOfMonth },
    }).sort({ date: -1 });

    expensesList = monthlyExpenses;

    let totalSpent = 0;
    monthlyExpenses.forEach((exp) => {
      if (exp.type === "expense") {
        totalSpent += exp.amount;
      }
    });

    expenseSummary = {
      monthlyBudget: settings.monthlyBudget,
      totalSpent,
      remainingBudget: settings.monthlyBudget - totalSpent,
      currency: settings.currency,
      hasBudget: settings.monthlyBudget > 0
    };
  } catch (err) {
    console.error("Error fetching expenses stats for dashboard summary:", err);
  }

  // 3. Profile completeness (dynamic based on requested 8 fields)
  let profile = { completeness: 0, remainingFields: [] };
  try {
    const student = await Student.findById(userId);
    if (student) {
      const fields = [
        { name: "Name", isCompleted: !!(student.firstName || student.lastName) },
        { name: "Email", isCompleted: !!student.email },
        { name: "Phone", isCompleted: !!student.phoneNumber },
        { name: "Profile Photo", isCompleted: !!student.image },
        { name: "Department", isCompleted: !!student.branch },
        { name: "Year", isCompleted: !!student.graduationYear },
        { name: "Skills", isCompleted: !!(student.skills && student.skills.length > 0) },
        { name: "Bio", isCompleted: !!student.bio },
      ];
      const completedCount = fields.filter(f => f.isCompleted).length;
      const totalCount = fields.length;
      const completeness = Math.round((completedCount / totalCount) * 100);
      const missing = fields.filter(f => !f.isCompleted).map(f => f.name);

      profile = {
        completeness,
        remainingFields: missing
      };
    }
  } catch (err) {
    console.error("Error fetching profile stats for dashboard summary:", err);
  }

  // 4. Referrals made
  let referrals = { total: 0 };
  try {
    const apps = await Application.find({ student: userId })
      .populate({
        path: "opportunity",
        select: "opportunityType"
      });
    const referralApps = apps.filter(app => app.opportunity && app.opportunity.opportunityType === "Referral");
    referrals = {
      total: referralApps.length
    };
  } catch (err) {
    console.error("Error fetching referrals stats for dashboard summary:", err);
  }

  // 5. Bookings
  let bookings = [];
  try {
    bookings = await Booking.find({ userId }).sort({ date: -1 });
  } catch (err) {
    console.error("Error fetching bookings for dashboard summary:", err);
  }

  // 6. Fetch Bills (for calendar due dates)
  let bills = [];
  try {
    bills = await billModel.find({ userId, status: { $ne: "Paid" } });
  } catch (err) {
    console.error("Error fetching bills for dashboard summary:", err);
  }

  res.status(200).json({
    success: true,
    data: {
      attendance: attendanceStats,
      expenses: {
        ...expenseSummary,
        list: expensesList
      },
      profile,
      referrals,
      bookings,
      bills
    }
  });
}));

export default router;
