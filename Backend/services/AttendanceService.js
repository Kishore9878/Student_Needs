import mongoose from "mongoose";
import AttendanceModel from "../models/Attendance/Attendance.js";
import StudentModel from "../models/Attendance/Student.js";
import { AppError } from "../utils/AppError.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export class AttendanceService {
  
  static async getAllAttendance() {
    return await AttendanceModel.find();
  }

  static async getStudentAttendance(user) {
    const userId = user?._id || user?.id || user;
    const email = typeof user?.email === "string" ? user.email.trim() : "";

    const lookup = [];
    if (userId) lookup.push({ userId });
    if (email) {
      lookup.push(
        { Email_id: email },
        { Email_id: new RegExp(`^${escapeRegex(email)}$`, "i") },
        { Register_number: email }
      );
    }

    const student = lookup.length > 0
      ? await StudentModel.findOne({ $or: lookup })
      : null;

    if (!student) {
      return [];
    }

    const attendanceRecords = await AttendanceModel.find();
    
    return attendanceRecords.map(record => {
      const studentRecord = record.attendanceRecords.find(
        rec => rec.studentId.toString() === student._id.toString()
      );
      if (!studentRecord) return null;
      return {
        id: record._id,
        date: record.date,
        subject: record.subject,
        attendance: studentRecord.attendance,
      };
    }).filter(Boolean);
  }

  static async markAttendance({ subject, attendanceData, date }) {
    const attendanceDate = date || new Date().toISOString().split("T")[0];
    const attendanceRecords = attendanceData.map((item) => ({
      studentId: item.studentId,
      attendance: item.attendance,
    }));

    const attendance = await AttendanceModel.findOneAndUpdate(
      { date: attendanceDate, subject },
      { $set: { attendanceRecords } },
      { upsert: true, new: true }
    );
    
    return { message: "Attendance Updated", attendance };
  }

  static async deleteStudentAttendance({ register, studentId }) {
    let id = studentId;

    if (register) {
      const student = await StudentModel.findOne({ Register_number: register });
      if (!student) {
        throw new AppError("Student not found", 404);
      }
      id = student._id;
    }

    await AttendanceModel.updateMany(
      {},
      {
        $pull: {
          attendanceRecords: { studentId: id },
        },
      }
    );
    
    return { message: "Attendance deleted successfully" };
  }

  static async getAttendanceForDateRange(startDate, endDate) {
    const attendanceRecords = await AttendanceModel.find({
      date: { $gte: startDate, $lte: endDate },
    }).populate("attendanceRecords.studentId");

    if (attendanceRecords.length === 0) {
      throw new AppError("Attendance data not found", 404);
    }

    return attendanceRecords;
  }

  static async getAttendanceForDate(dateParam) {
    const attendanceRecord = await AttendanceModel.findOne({
      date: dateParam,
    });

    if (!attendanceRecord) {
      throw new AppError("Attendance data not found", 404);
    }

    return attendanceRecord;
  }
}
