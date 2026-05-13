import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

// ================= CONFIG =================
import { dbconnect } from "./config/Referrals/database.js";
import cloudinary from "./config/Referrals/cloudinary.js";

// ================= ATTENDANCE ROUTES =================
import authRoutes from "./routes/Attendance/authRoutes.js";
import studentRoutes from "./routes/Attendance/studentRoutes.js";
import subjectRoutes from "./routes/Attendance/subjectRoutes.js";
import attendanceRoutes from "./routes/Attendance/attendanceRoutes.js";

// ================= REFERRAL ROUTES =================
import studentAuthRoutes from "./routes/Referrals/StudentAuthRoutes.js";
import profileRoutes from "./routes/Referrals/StudentProfileRoutes.js";
import resumeRoutes from "./routes/Referrals/StudentResumeRoutes.js";
import linkedInRoutes from "./routes/Referrals/StudentLinkedInRoutes.js";
import githubRoutes from "./routes/Referrals/StudentGithubRoutes.js";

import alumniAuthRoutes from "./routes/Referrals/AlumniAuthRoutes.js";
import alumniProfileRoutes from "./routes/Referrals/AlumniProfileRoutes.js";

import opportunityRoutes from "./routes/Referrals/OpportunityRoutes.js";
import applicationRoutes from "./routes/Referrals/ApplicationRoutes.js";
import externalJobRoutes from "./routes/Referrals/ExternalJobRoutes.js";
import interviewRoutes from "./routes/Referrals/InterviewRoutes.js";
import profileAnalysisRoutes from "./routes/Referrals/ProfileAnalysisRoutes.js";

// ================= ENV CONFIG =================
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// ================= MIDDLEWARE =================
app.use(express.json());

app.use(cookieParser());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// ================= CORS =================
const allowedOrigins = [
  // Attendance Frontend
  "http://localhost:3000",
  "https://attendancemonitoringsyst-b1ae8.web.app",
  "https://mern-attendance-app.onrender.com",

  // Referral Frontend
  "http://localhost:8080",
  "http://localhost:8081",
  "http://localhost:5173",
  "http://127.0.0.1:8080",
  "http://127.0.0.1:8081",
  "http://127.0.0.1:5173",
  "http://172.26.38.74:8080",
  "https://next-ref-alumni-connect.vercel.app",
  "https://next-reff-alumni-connect.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS Not Allowed"));
      }
    },
    credentials: true,
  })
);

// ================= HOME ROUTE =================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Unified Student Project API Running 🚀",
    timestamp: new Date().toISOString(),
  });
});

// =====================================================
//                ATTENDANCE MODULE ROUTES
// =====================================================

app.use("/api/auth", authRoutes);

app.use("/api/students", studentRoutes);

app.use("/api/subjects", subjectRoutes);

app.use("/api/attendance", attendanceRoutes);

// =====================================================
//                REFERRAL MODULE ROUTES
// =====================================================

app.use("/api/v1/student", studentAuthRoutes);

app.use("/api/v1/student", profileRoutes);

app.use("/api/v1/student", resumeRoutes);

app.use("/api/v1/student", linkedInRoutes);

app.use("/api/v1/student", githubRoutes);

app.use("/api/v1/alumni", alumniAuthRoutes);

app.use("/api/v1/alumni", alumniProfileRoutes);

app.use("/api/v1", opportunityRoutes);

app.use("/api/v1", applicationRoutes);

app.use("/api/v1/student", externalJobRoutes);

app.use("/api/v1", interviewRoutes);

app.use("/api/v1", profileAnalysisRoutes);

// ================= DATABASE CONNECTION =================

const initializeServer = async () => {
  try {

    // MongoDB Connection
    await dbconnect();

    console.log("✅ Database Connected");

    // Cloudinary
    cloudinary.cloudinaryConnect();

    console.log("✅ Cloudinary Connected");

    // Start Server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {

    console.error("❌ Server Initialization Failed");
    console.error(error.message);

    process.exit(1);
  }
};``

initializeServer();