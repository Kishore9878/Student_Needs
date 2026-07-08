import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Calendar, User, Search, Filter, BarChart3, Clock, LineChart, CheckCircle2, XCircle, Users2 } from "lucide-react";
import API, {
  TUTOR_ATTENDANCE_PATHS,
} from "@/services/Attendance/tutorAttendanceApi";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";
import { PremiumCard } from "@/components/dashboard/shared/Primitives";
import { 
  AttendancePageLayout, 
  AttendancePageHeader, 
  AttendanceFilterCard,
  AttendanceStatCard,
  AttendanceSectionCard,
  AttendanceEmptyState
} from "@/components/dashboard/attendance/SharedUI";

const todayISO = () => new Date().toISOString().split("T")[0];
const getDateMonthsBack = (months) => {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return date.toISOString().split("T")[0];
};

const getErrorMessage = (err) =>
  err?.response?.data?.message || err?.message || "Something went wrong";

const formatDateLabel = (value) => {
  if (!value) return "Unknown date";
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function TutorAttendanceAnalytics() {
  const { user } = useAuth();
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [sessionRecords, setSessionRecords] = useState([]);

  const [subject, setSubject] = useState("");
  const [dateFrom, setDateFrom] = useState(getDateMonthsBack(3));
  const [dateTo, setDateTo] = useState(todayISO());
  const [searchStudent, setSearchStudent] = useState("");

  const loadSubjects = useCallback(async () => {
    setLoadingSubjects(true);
    try {
      const res = await API.get(TUTOR_ATTENDANCE_PATHS.tutorSubjects);
      const list = res.data || [];
      setSubjects(list);
      setSubject((prev) => {
        if (prev && list.some((s) => s.subjectName === prev)) return prev;
        return list[0]?.subjectName || "";
      });
    } catch (err) {
      toast.error(getErrorMessage(err));
      setSubjects([]);
      setSubject("");
    } finally {
      setLoadingSubjects(false);
    }
  }, []);

  const loadAnalyticsData = useCallback(async () => {
    if (!subject) {
      setEnrolledStudents([]);
      setSessionRecords([]);
      return;
    }
    setLoadingData(true);
    try {
      const [studentsRes, sessionsRes] = await Promise.all([
        API.get(TUTOR_ATTENDANCE_PATHS.tutorEnrolled, {
          params: { subject },
        }),
        API.get(TUTOR_ATTENDANCE_PATHS.tutorSession, {
          params: { subject },
        }),
      ]);

      setEnrolledStudents(studentsRes.data?.students || []);
      setSessionRecords(sessionsRes.data || []);
    } catch (err) {
      toast.error(getErrorMessage(err));
      setEnrolledStudents([]);
      setSessionRecords([]);
    } finally {
      setLoadingData(false);
    }
  }, [subject]);

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  useEffect(() => {
    loadAnalyticsData();
  }, [loadAnalyticsData]);

  const filteredRecords = useMemo(() => {
    const fromTime = dateFrom ? new Date(`${dateFrom}T00:00:00`).getTime() : null;
    const toTime = dateTo ? new Date(`${dateTo}T23:59:59.999`).getTime() : null;

    return (sessionRecords || []).filter((record) => {
      const recordTime = record.date
        ? new Date(`${record.date}T00:00:00`).getTime()
        : null;
      const isInDateRange =
        recordTime !== null &&
        (fromTime === null || recordTime >= fromTime) &&
        (toTime === null || recordTime <= toTime);
      const studentName = record.studentName || "Student";
      const matchesSearch =
        !searchStudent ||
        studentName.toLowerCase().includes(searchStudent.toLowerCase());
      return isInDateRange && matchesSearch;
    });
  }, [sessionRecords, dateFrom, dateTo, searchStudent]);

  const filteredSummary = useMemo(() => {
    const summaryByStudent = new Map();

    for (const student of enrolledStudents) {
      const name = student.name || "Student";
      if (
        searchStudent &&
        !name.toLowerCase().includes(searchStudent.toLowerCase())
      ) {
        continue;
      }
      summaryByStudent.set(student.studentId, {
        studentId: student.studentId,
        studentName: name,
        totalSessions: 0,
        presentCount: 0,
        absentCount: 0,
      });
    }

    for (const record of filteredRecords) {
      const studentId = String(record.studentId);
      const existing =
        summaryByStudent.get(studentId) || {
          studentId,
          studentName: record.studentName || "Student",
          totalSessions: 0,
          presentCount: 0,
          absentCount: 0,
        };
      existing.totalSessions += 1;
      if (record.status === "present") existing.presentCount += 1;
      if (record.status === "absent") existing.absentCount += 1;
      summaryByStudent.set(studentId, existing);
    }

    return [...summaryByStudent.values()].sort((a, b) =>
      a.studentName.localeCompare(b.studentName),
    );
  }, [enrolledStudents, filteredRecords, searchStudent]);

  const groupedHistory = useMemo(() => {
    const groups = new Map();

    for (const record of filteredRecords) {
      const dateKey = record.date || "unknown-date";
      if (!groups.has(dateKey)) {
        groups.set(dateKey, []);
      }
      groups.get(dateKey).push(record);
    }

    return [...groups.entries()]
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([date, records]) => ({
        date,
        records: records.sort((a, b) => {
          const timeA = a.sessionTime || "";
          const timeB = b.sessionTime || "";
          if (timeA !== timeB) return timeA.localeCompare(timeB);
          return (a.studentName || "").localeCompare(b.studentName || "");
        }),
      }));
  }, [filteredRecords]);

  const getStatusColor = (status) => {
    const normalizedStatus = (status || "").toLowerCase();
    if (normalizedStatus === "present")
      return "badge-success";
    if (normalizedStatus === "absent")
      return "badge-danger";
    return "badge-neutral";
  };

  const getAttendancePercentage = (student) => {
    if (student.totalSessions === 0) return 0;
    return Math.round((student.presentCount / student.totalSessions) * 100);
  };

  const getProgressBarColor = (percentage) => {
    if (percentage >= 75) return "bg-green-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const isTeacher = ["teacher", "tutor"].includes(
    (user?.role || "").toLowerCase(),
  );

  return (
    <AttendancePageLayout>
      <AttendancePageHeader
        title="Attendance Analytics"
        description="View detailed attendance reports for your sessions and students"
        icon={LineChart}
      />

      {!isTeacher ? (
        <PremiumCard className="border-[var(--danger)] bg-[var(--danger-bg)] text-[var(--danger)] p-6">
          <p className="font-bold text-center text-lg">
            Attendance Analytics is for teachers only.
          </p>
        </PremiumCard>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <AttendanceStatCard 
              title="Total Sessions" 
              value={filteredRecords.length} 
              icon={Clock} 
              colorClass="text-blue-600 bg-blue-500/10 dark:text-blue-400"
            />
            <AttendanceStatCard 
              title="Present" 
              value={filteredRecords.filter(r => r.status === 'present').length} 
              icon={CheckCircle2} 
              colorClass="text-green-600 bg-green-500/10 dark:text-green-400"
            />
            <AttendanceStatCard 
              title="Absent" 
              value={filteredRecords.filter(r => r.status === 'absent').length} 
              icon={XCircle} 
              colorClass="text-red-600 bg-red-500/10 dark:text-red-400"
            />
            <AttendanceStatCard 
              title="Students" 
              value={filteredSummary.length} 
              icon={Users2} 
              colorClass="text-purple-600 bg-purple-500/10 dark:text-purple-400"
            />
          </div>

          <AttendanceFilterCard title="Filters" icon={Filter}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={loadingSubjects}
                className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm shadow-sm disabled:opacity-50"
              >
                <option value="">Select a subject...</option>
                {subjects.map((s) => (
                  <option key={s.subjectName} value={s.subjectName}>
                    {s.subjectName}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                From
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                To
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Search Student
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Student name..."
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                  className="w-full h-12 pl-10 pr-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm shadow-sm"
                />
              </div>
            </div>
          </AttendanceFilterCard>

          <AttendanceSectionCard title="Student Summary" icon={BarChart3} noPadding={true}>
            {filteredSummary.length === 0 ? (
              <AttendanceEmptyState
                icon={BarChart3}
                title={loadingData ? "Loading attendance data..." : "No students found"}
                description={loadingData ? "Please wait..." : "No students match your selected filters. Try adjusting the subject or date range."}
              />
            ) : (
              <div className="overflow-x-auto w-full">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/30">
                      <th className="px-6 py-4 text-left font-bold text-foreground">
                        Student
                      </th>
                      <th className="px-6 py-4 text-left font-bold text-foreground">
                        Total Sessions
                      </th>
                      <th className="px-6 py-4 text-left font-bold text-foreground">
                        Present
                      </th>
                      <th className="px-6 py-4 text-left font-bold text-foreground">
                        Absent
                      </th>
                      <th className="px-6 py-4 text-left font-bold text-foreground">
                        Attendance %
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredSummary.map((student) => {
                      const attendancePercentage =
                        getAttendancePercentage(student);
                      return (
                        <tr
                          key={student.studentId}
                          className="transition-colors hover:bg-secondary/10 bg-card"
                        >
                          <td className="px-6 py-4 text-foreground">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)]">
                                <User className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="font-bold text-foreground text-sm">
                                  {student.studentName}
                                </p>
                                <p className="text-xs text-muted-foreground font-medium">
                                  ID: {student.studentId}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-foreground font-medium">
                            {student.totalSessions}
                          </td>
                          <td className="px-6 py-4 text-green-600 dark:text-green-400 font-bold">
                            {student.presentCount}
                          </td>
                          <td className="px-6 py-4 text-red-600 dark:text-red-400 font-bold">
                            {student.absentCount}
                          </td>
                          <td className="px-6 py-4 text-foreground min-w-48">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between gap-3">
                                <span className="text-sm font-bold text-foreground">
                                  {attendancePercentage}%
                                </span>
                              </div>
                              <div className="w-full h-2.5 bg-secondary/50 border border-border/50 rounded-full overflow-hidden shadow-inner">
                                <div
                                  className={`h-full transition-all duration-500 ease-out ${getProgressBarColor(
                                    attendancePercentage,
                                  )}`}
                                  style={{ width: `${attendancePercentage}%` }}
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </AttendanceSectionCard>

          <AttendanceSectionCard title="Session History" icon={Clock} noPadding={true}>
            {groupedHistory.length === 0 ? (
              <AttendanceEmptyState
                icon={Clock}
                title={loadingData ? "Loading session data..." : "No session records found"}
                description={loadingData ? "Please wait..." : "No attendance was marked in the selected date range."}
              />
            ) : (
              <div className="space-y-0 divide-y divide-border/50">
                {groupedHistory.map((group) => (
                  <div key={group.date} className="w-full bg-card">
                    <div className="border-b border-border bg-secondary/10 p-4 sm:p-6">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-bold text-foreground">
                            {formatDateLabel(group.date)}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1 font-medium">
                            {group.records.length} attendance record
                            {group.records.length === 1 ? "" : "s"}
                          </p>
                        </div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-background border border-border shadow-sm rounded-lg text-sm font-bold text-primary">
                          <Calendar className="w-4 h-4" />
                          {group.date}
                        </div>
                      </div>
                    </div>
                    <div className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-border bg-background">
                              <th className="px-6 py-4 text-left font-bold text-foreground">
                                Session Time
                              </th>
                              <th className="px-6 py-4 text-left font-bold text-foreground">
                                Student Name
                              </th>
                              <th className="px-6 py-4 text-left font-bold text-foreground">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {group.records.map((record) => (
                              <tr
                                key={record._id}
                                className="transition-colors hover:bg-secondary/10 bg-card"
                              >
                                <td className="px-6 py-4 text-foreground font-medium">
                                  {record.sessionTime || "N/A"}
                                </td>
                                <td className="px-6 py-4 text-foreground font-bold">
                                  {record.studentName || "Student"}
                                </td>
                                <td className="px-6 py-4">
                                  <Badge
                                    className={`${getStatusColor(
                                      record.status,
                                    )} border-0 font-bold px-3 py-1 text-xs uppercase tracking-wider`}
                                  >
                                    {record.status}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </AttendanceSectionCard>
        </>
      )}
    </AttendancePageLayout>
  );
}
