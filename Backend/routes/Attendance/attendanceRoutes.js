import express from "express";
import protect from "../../middlewares/Attendance/authMiddleware.js";
import { allowTeacher, allowStudent } from "../../middlewares/Attendance/roleMiddleware.js";

import {
  markAttendance,
  downloadAttendance,
  downloadTodayAttendance,
  getAttendance,
  getStudentAttendance,
  deleteStudentAttendance,
} from "../../controllers/Attendance/attendanceController.js";

const router = express.Router();


// ✅ GET ATTENDANCE
router.get(
  "/attendance",
  protect,
  allowTeacher,
  getAttendance
);

// ✅ GET STUDENT ATTENDANCE
router.get(
  "/attendance/student",
  protect,
  allowStudent,
  getStudentAttendance
);


// ✅ MARK ATTENDANCE
router.post(
  "/attendance",
  protect,
  allowTeacher,
  markAttendance
);


// ✅ DOWNLOAD CSV
router.get(
  "/data/download",
  protect,
  allowTeacher,
  downloadAttendance
);


// ✅ DOWNLOAD TODAY DOCX
router.get(
  "/attendanceToday/:date",
  protect,
  allowTeacher,
  downloadTodayAttendance
);

// ✅ DELETE STUDENT ATTENDANCE
router.delete(
  "/attendance/:studentId",
  protect,
  allowTeacher,
  deleteStudentAttendance
);

// ✅ DELETE ATTENDANCE USING REGISTER NUMBER
router.delete(
  "/attendance/student/:register",
  protect,
  allowTeacher,
  deleteStudentAttendance
);

export default router;