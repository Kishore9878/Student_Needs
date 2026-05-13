import fs from "fs";

import officegen from "officegen";

import {
  createObjectCsvWriter as createCsvWriter,
} from "csv-writer";

import AttendanceModel from "../../models/Attendance/Attendance.js";

import StudentModel from "../../models/Attendance/Student.js";

import { Parser } from "json2csv";

// ✅ MARK ATTENDANCE
export const markAttendance = async (
  req,
  res
) => {
  try {
    const {
      subject,
      attendanceData,
      date,
    } = req.body;

    // ✅ VALIDATION
    if (!subject) {
      return res.status(400).json({
        message: "Subject required",
      });
    }

    if (
      !attendanceData ||
      attendanceData.length === 0
    ) {
      return res.status(400).json({
        message:
          "Attendance required",
      });
    }

    // ✅ DATE
    const attendanceDate =
      date ||
      new Date()
        .toISOString()
        .split("T")[0];

    // ✅ FORMAT DATA
    const attendanceRecords =
      attendanceData.map((item) => ({
        studentId: item.studentId,

        attendance:
          item.attendance,
      }));

    // ✅ UPDATE EXISTING
    // ✅ CREATE IF NOT EXISTS
    await AttendanceModel.findOneAndUpdate(
      {
        date: attendanceDate,

        subject,
      },
      {
        $set: {
          attendanceRecords,
        },
      },
      {
        upsert: true,

        new: true,
      }
    );

    res.status(200).json({
      message:
        "Attendance Updated",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message:
        "Error Updating Attendance",
    });
  }
};

// ✅ DOWNLOAD CSV REPORT
export const downloadAttendance =
  async (req, res) => {
    try {
      const startDate = req.query.start;

      const endDate = req.query.end;

      const attendanceRecords =
        await AttendanceModel.find({
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        }).populate(
          "attendanceRecords.studentId"
        );

      if (attendanceRecords.length === 0) {
        return res.status(404).json({
          message:
            "Attendance data not found",
        });
      }

      const uniqueDates = [
        ...new Set(
          attendanceRecords.map((record) =>
            new Date(record.date)
              .toISOString()
              .split("T")[0]
          )
        ),
      ];

      const studentData = [
        ...new Set(
          attendanceRecords.flatMap((record) =>
            record.attendanceRecords.map(
              (r) => r.studentId
            )
          )
        ),
      ];

      const filteredStudentData =
        studentData.filter(
          (student) => student !== null
        );

      const csvData =
        filteredStudentData.map((student) => {
          const rowData = {
            Name: student.Name,
            YearOfStudy:
              student.Year_of_studying || "",
            Gender: student.Gender || "",
          };

          uniqueDates.forEach((date) => {
            const attendanceRecord =
            attendanceRecords.find(
              (record) =>
                new Date(record.date)
                  .toISOString()
                  .split("T")[0] === date
            );

            if (
              attendanceRecord &&
              attendanceRecord.attendanceRecords
            ) {
              const attendance =
                attendanceRecord.attendanceRecords.find(
                  (r) =>
                    r.studentId &&
                    r.studentId.Name ===
                      student.Name
                );

              rowData[date] = attendance
                ? attendance.attendance
                : "";
            } else {
              rowData[date] = "";
            }
          });

          return rowData;
        });

      const csvHeader = [
        {
          id: "Name",
          title: "Name",
        },

        {
          id: "YearOfStudy",
          title: "Year Of Study",
        },

        {
          id: "Gender",
          title: "Gender",
        },

        ...uniqueDates.map((date) => ({
          id: date,
          title: date,
        })),
      ];

      const csvWriter =
        createCsvWriter({
          path: "attendance.csv",
          header: csvHeader,
        });

      await csvWriter.writeRecords(csvData);

      res.setHeader(
        "Content-Type",
        "text/csv"
      );

      res.setHeader(
        "Content-Disposition",
        "attachment; filename=attendance.csv"
      );

      fs.createReadStream(
        "attendance.csv"
      ).pipe(res);
    } catch (error) {
      console.log(
        "DOWNLOAD ERROR:",
        error
      );

      res.status(500).json({
        error: error.message,
      });
    }
  };


// ✅ DOWNLOAD DOCX
export const downloadTodayAttendance =
  async (req, res) => {
    try {
      const dateParam = req.params.date;

      const attendanceRecord =
        await AttendanceModel.findOne({
          date: new Date(dateParam),
        });

      if (!attendanceRecord) {
        return res.status(404).json({
          message:
            "Attendance data not found",
        });
      }

      const studentDetails =
        await StudentModel.find({
          _id: {
            $in: attendanceRecord.attendanceRecords.map(
              (record) =>
                record.studentId
            ),
          },
        });

      const presentStudents =
        studentDetails.filter(
          (studentDetail) =>
            attendanceRecord.attendanceRecords.some(
              (record) =>
                record.studentId.equals(
                  studentDetail._id
                ) &&
                record.attendance ===
                  "present"
            )
        );

      const docx = officegen("docx");

      const title = docx.createP();

      title.addText(
        `Attendance for ${dateParam}`,
        {
          font_face: "Times New Roman",
          font_size: 14,
          bold: true,
        }
      );

      const table = [
        [
          "S.No",
          "Name",
          "Register Number",
          "Dept",
          "Year",
        ],
      ];

      presentStudents.forEach(
        (student, index) => {
          table.push([
            index + 1,
            student.Name,
            student.Register_number,
            student.Branch_of_studying,
            student.Year_of_studying,
          ]);
        }
      );

      docx.createTable(table);

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );

      res.setHeader(
        "Content-Disposition",
        `attachment; filename=attendance_${dateParam}.docx`
      );

      docx.generate(res);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Error generating document",
      });
    }
  };

  // ✅ GET ALL ATTENDANCE
export const getAttendance = async (
  req,
  res
) => {
  try {
    const attendance =
      await AttendanceModel.find();

    res.status(200).json(attendance);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error fetching attendance",
    });
  }
};

// ✅ GET STUDENT ATTENDANCE
export const getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.user._id; // Assuming user is student

    // Find student document
    const student = await StudentModel.findOne({ userId: studentId });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Get all attendance records
    const attendanceRecords = await AttendanceModel.find();

    // Filter records where student is present
    const studentAttendance = attendanceRecords.map(record => {
      const studentRecord = record.attendanceRecords.find(
        rec => rec.studentId.toString() === student._id.toString()
      );
      return {
        date: record.date,
        subject: record.subject,
        attendance: studentRecord ? studentRecord.attendance : null,
      };
    });

    res.status(200).json(studentAttendance);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error fetching student attendance",
    });
  }
};

// ✅ DELETE STUDENT ATTENDANCE
export const deleteStudentAttendance =
  async (req, res) => {
    try {
      const { register, studentId } =
        req.params;

      let id = studentId;

      // ✅ Find student using register number
      if (register) {
        const student =
          await StudentModel.findOne({
            Register_number: register,
          });

        if (!student) {
          return res.status(404).json({
            message: "Student not found",
          });
        }

        id = student._id;
      }

      // ✅ Remove attendance
      await AttendanceModel.updateMany(
        {},
        {
          $pull: {
            attendanceRecords: {
              studentId: id,
            },
          },
        }
      );

      res.status(200).json({
        message:
          "Attendance deleted successfully",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Error deleting attendance",
      });
    }
  };