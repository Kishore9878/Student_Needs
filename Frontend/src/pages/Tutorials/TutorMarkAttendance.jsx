import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, CalendarCheck, Check, X, ClipboardCheck, Users, Filter, BookOpen } from "lucide-react";
import API, {
  TUTOR_ATTENDANCE_PATHS,
} from "@/services/Attendance/tutorAttendanceApi";
import { PremiumButton } from "@/components/dashboard/shared/Primitives";
import { 
  AttendancePageLayout, 
  AttendancePageHeader, 
  AttendanceSectionCard,
  AttendanceEmptyState,
  AttendanceAlert,
  AttendanceFilterCard
} from "@/components/dashboard/attendance/SharedUI";

const todayISO = () => new Date().toISOString().split("T")[0];

const normalizeDate = (value) => {
  if (!value) return value;
  if (/^\d{2}-\d{2}-\d{4}$/.test(value)) {
    const [dd, mm, yyyy] = value.split("-");
    return `${yyyy}-${mm}-${dd}`;
  }
  return value;
};

const getErrorMessage = (err) =>
  err?.response?.data?.message || err?.message || "Something went wrong";

export default function TutorMarkAttendance() {
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState(todayISO());
  const [sessionTime, setSessionTime] = useState("");
  const [marks, setMarks] = useState({});

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

  const loadStudents = useCallback(async () => {
    if (!subject) {
      setStudents([]);
      return;
    }
    setLoadingStudents(true);
    try {
      const res = await API.get(TUTOR_ATTENDANCE_PATHS.tutorEnrolled, {
        params: { subject },
      });
      setStudents(res.data?.students || []);
    } catch (err) {
      toast.error(getErrorMessage(err));
      setStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  }, [subject]);

  const loadExistingMarks = useCallback(async () => {
    if (!subject || !date) return;
    try {
      const params = { date: normalizeDate(date), subject };
      const trimmedSessionTime = sessionTime.trim();
      if (trimmedSessionTime) {
        params.sessionTime = trimmedSessionTime;
      }
      const res = await API.get(TUTOR_ATTENDANCE_PATHS.tutorSession, {
        params,
      });
      const next = {};
      for (const row of res.data || []) {
        next[String(row.studentId)] = row.status;
      }
      setMarks(next);
    } catch {
      setMarks({});
    }
  }, [date, subject, sessionTime]);

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  useEffect(() => {
    loadExistingMarks();
  }, [loadExistingMarks]);

  const filteredStudents = useMemo(() => students, [students]);

  const setStatus = (studentId, status) => {
    setMarks((prev) => ({ ...prev, [studentId]: status }));
  };

  const submitAttendance = async () => {
    if (!subject) {
      toast.error("Select a subject");
      return;
    }
    const records = filteredStudents
      .map((s) => {
        const rawStatus = marks[s.studentId];
        return {
          studentId: s.studentId,
          status: rawStatus || null,
        };
      })
      .filter((r) => r.status);

    if (records.length === 0) {
      toast.error("Mark at least one student as present or absent");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        date: normalizeDate(date),
        subject,
        records,
      };
      const trimmedSessionTime = sessionTime.trim();
      if (trimmedSessionTime) {
        payload.sessionTime = trimmedSessionTime;
      }

      await API.post(TUTOR_ATTENDANCE_PATHS.tutorSession, payload);
      toast.success("Online class attendance saved");
      await loadExistingMarks();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const markedCount = filteredStudents.filter((s) => marks[s.studentId]).length;
  const loading = loadingSubjects || loadingStudents;

  return (
    <AttendancePageLayout>
      <AttendancePageHeader
        title="Mark Online Class Attendance"
        description="Select a subject you teach, then mark students who booked that course."
        icon={ClipboardCheck}
      />

      {subjects.length === 0 && !loadingSubjects && (
        <AttendanceAlert
          title="Add subjects before marking attendance"
          description={
            <span>
              You haven't added any subjects yet.{" "}
              <Link
                to="/tutorials/attendance/subjects"
                className="underline font-semibold hover:text-amber-800 dark:hover:text-amber-300 transition-colors"
              >
                Click here
              </Link>{" "}
              to add them.
            </span>
          }
          type="warning"
        />
      )}

      <AttendanceFilterCard title="Session details" icon={Filter}>
        <div>
          <label className="text-sm font-medium mb-1.5 block text-foreground">
            Course / Subject
          </label>
          <select
            className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm shadow-sm disabled:opacity-50"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={subjects.length === 0}
          >
            <option value="">Select subject</option>
            {subjects.map((s) => (
              <option key={s._id} value={s.subjectName}>
                {s.subjectName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block text-foreground">Date</label>
          <input
            type="date"
            className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm shadow-sm"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block text-foreground">
            Session time (optional)
          </label>
          <input
            type="text"
            placeholder="e.g. 10:00 AM"
            className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm shadow-sm"
            value={sessionTime}
            onChange={(e) => setSessionTime(e.target.value)}
          />
        </div>
      </AttendanceFilterCard>

      <AttendanceSectionCard 
        title="Enrolled students" 
        icon={Users}
        noPadding={true}
        action={
          <PremiumButton
            onClick={submitAttendance}
            disabled={saving || loading || !subject || subjects.length === 0}
            className="shadow-md w-full sm:w-auto"
          >
            <CalendarCheck className="w-4 h-4 mr-2" />
            {saving ? "Saving…" : "Save attendance"}
          </PremiumButton>
        }
      >
        <div className="p-6 border-b border-border/50 bg-secondary/10">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{markedCount}</span> of <span className="font-semibold text-foreground">{filteredStudents.length}</span> marked · students with bookings for this subject
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <span className="spinner spinner-lg text-primary" />
          </div>
        ) : !subject ? (
          <AttendanceEmptyState
            icon={BookOpen}
            title="Select a subject"
            description="Choose a subject from the session details above to load enrolled students."
          />
        ) : filteredStudents.length === 0 ? (
          <AttendanceEmptyState
            icon={Users}
            title="No students found"
            description="No students have booked this subject yet. They will appear here once they book a class with you for this course."
          />
        ) : (
          <div className="divide-y divide-border">
            {filteredStudents.map((student) => {
              const status = marks[student.studentId];
              return (
                <div
                  key={student.studentId}
                  className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 bg-background hover:bg-secondary/20 transition-colors"
                >
                  <div>
                    <p className="font-bold text-foreground">{student.name}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {student.bookingCount} booking(s)
                    </p>
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      className={`h-10 px-4 rounded-xl border text-sm font-semibold flex items-center justify-center transition-all flex-1 sm:flex-auto ${
                        status === "present"
                          ? "bg-green-500/10 text-green-600 border-green-500/30 ring-2 ring-green-500/20"
                          : "bg-background text-muted-foreground border-border hover:bg-green-500/5 hover:border-green-500/30 hover:text-green-600"
                      }`}
                      onClick={() => setStatus(student.studentId, "present")}
                    >
                      <Check className="w-4 h-4 mr-1.5" />
                      Present
                    </button>
                    <button
                      type="button"
                      className={`h-10 px-4 rounded-xl border text-sm font-semibold flex items-center justify-center transition-all flex-1 sm:flex-auto ${
                        status === "absent"
                          ? "bg-red-500/10 text-red-600 border-red-500/30 ring-2 ring-red-500/20"
                          : "bg-background text-muted-foreground border-border hover:bg-red-500/5 hover:border-red-500/30 hover:text-red-600"
                      }`}
                      onClick={() => setStatus(student.studentId, "absent")}
                    >
                      <X className="w-4 h-4 mr-1.5" />
                      Absent
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </AttendanceSectionCard>
    </AttendancePageLayout>
  );
}
