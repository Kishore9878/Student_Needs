import React, { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  MdCheckCircle,
  MdCancel,
  MdWarning,
  MdCalendarToday,
  MdAdd,
  MdEdit,
  MdDelete,
  MdBook,
} from "react-icons/md";
import { Plus, Pencil, Trash2, TrendingUp, AlertTriangle, BookOpen, CheckCircle2, XCircle, BarChart3, Filter, RotateCcw } from "lucide-react";

import { useAuth } from "@/contexts/GlobalAuthContext.jsx";
import API, { ATTENDANCE_PATHS } from "@/services/Attendance/api";
import AttendanceCharts from "@/components/Attendance/AttendanceCharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { getAttendanceStatus } from "@/utils/Attendance/helpers";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  PageLayout,
  PremiumButton,
} from "@/components/dashboard/shared/Primitives";

const MIN_ATTENDANCE = 75;
const todayISO = () => new Date().toISOString().split("T")[0];

const getErrorMessage = (err) =>
  err?.response?.data?.message || err?.message || "Something went wrong";

/* ─── Attendance-scoped inline styles ─── */
const styles = {
  pageWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "32px",
  },
  /* Header */
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "16px",
    flexWrap: "wrap",
    paddingBottom: "28px",
    borderBottom: "1px solid var(--border-color)",
  },
  headerLeft: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  pageTitle: {
    fontSize: "34px",
    fontWeight: "800",
    letterSpacing: "-0.03em",
    lineHeight: "1.1",
    color: "var(--text-primary)",
    margin: 0,
  },
  pageSubtitle: {
    fontSize: "14px",
    color: "var(--text-muted)",
    margin: 0,
    lineHeight: "1.5",
  },
  headerActions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    alignItems: "center",
    flexShrink: 0,
  },
  /* Section */
  sectionLabel: {
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "var(--text-muted)",
    marginBottom: "14px",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "var(--text-primary)",
    letterSpacing: "-0.02em",
  },
  /* Base card */
  card: {
    background: "var(--card-bg)",
    border: "1px solid var(--border-color)",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
    position: "relative",
    overflow: "hidden",
  },
  /* Stat grid */
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
  },
  statCard: {
    background: "var(--card-bg)",
    border: "1px solid var(--border-color)",
    borderRadius: "16px",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
    position: "relative",
    overflow: "hidden",
  },
  statCardHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "12px",
  },
  statLabel: {
    fontSize: "12px",
    fontWeight: "600",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    color: "var(--text-muted)",
    marginBottom: "6px",
  },
  statValue: {
    fontSize: "36px",
    fontWeight: "800",
    letterSpacing: "-0.03em",
    color: "var(--text-primary)",
    lineHeight: "1",
  },
  statSubtext: {
    fontSize: "13px",
    color: "var(--text-muted)",
    marginTop: "4px",
  },
  statIconBadge: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  progressTrack: {
    height: "6px",
    borderRadius: "999px",
    background: "var(--bg-tertiary)",
    overflow: "hidden",
    marginTop: "4px",
  },
  progressFill: {
    height: "100%",
    borderRadius: "999px",
    transition: "width 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
  },
  /* Two-column layout */
  twoColLayout: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
  /* Subject management cards */
  subjectGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "16px",
  },
  subjectCard: {
    background: "var(--card-bg)",
    border: "1px solid var(--border-color)",
    borderRadius: "14px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
    position: "relative",
  },
  /* Table */
  tableWrapper: {
    borderRadius: "12px",
    border: "1px solid var(--border-color)",
    overflow: "hidden",
  },
  /* Filters card */
  filtersRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    alignItems: "flex-end",
  },
  filterGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    flex: "1",
    minWidth: "160px",
  },
  filterLabel: {
    fontSize: "11px",
    fontWeight: "600",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "var(--text-muted)",
  },
  filterSelect: {
    height: "38px",
    padding: "0 10px",
    borderRadius: "8px",
    border: "1px solid var(--border-color)",
    background: "var(--input-bg)",
    color: "var(--text-primary)",
    fontSize: "14px",
    outline: "none",
    width: "100%",
    transition: "border-color 0.15s ease",
  },
  filterInput: {
    height: "38px",
    padding: "0 10px",
    borderRadius: "8px",
    border: "1px solid var(--border-color)",
    background: "var(--input-bg)",
    color: "var(--text-primary)",
    fontSize: "14px",
    outline: "none",
    width: "100%",
    transition: "border-color 0.15s ease",
  },
};

/* ─── Stat Card component ─── */
function AttendanceStatCard({ title, value, subtext, iconBg, iconColor, icon: Icon, progressValue, progressColor }) {
  return (
    <div
      style={styles.statCard}
      className="attn-stat-card"
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
        e.currentTarget.style.borderColor = "var(--accent)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)";
        e.currentTarget.style.borderColor = "var(--border-color)";
      }}
    >
      <div style={styles.statCardHeader}>
        <div>
          <p style={styles.statLabel}>{title}</p>
          <p style={styles.statValue}>{value}</p>
          {subtext && <p style={styles.statSubtext}>{subtext}</p>}
        </div>
        <div style={{ ...styles.statIconBadge, background: iconBg, color: iconColor }}>
          <Icon size={20} />
        </div>
      </div>
      {progressValue !== undefined && (
        <div>
          <div style={styles.progressTrack}>
            <div
              style={{
                ...styles.progressFill,
                width: `${Math.min(progressValue, 100)}%`,
                background: progressColor || "var(--accent)",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Section header ─── */
function SectionHeader({ title, description, action }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "16px" }}>
      <div>
        <h2 style={styles.sectionTitle}>{title}</h2>
        {description && <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "4px" }}>{description}</p>}
      </div>
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </div>
  );
}

/* ─── Premium card wrapper ─── */
function AttnCard({ children, style, hoverEffect = true, ...props }) {
  return (
    <div
      style={{ ...styles.card, ...style }}
      onMouseEnter={hoverEffect ? e => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
      } : undefined}
      onMouseLeave={hoverEffect ? e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)";
      } : undefined}
      {...props}
    >
      {children}
    </div>
  );
}

/* ─── Status Badge ─── */
function StatusBadge({ status }) {
  const isPresent = status === "present";
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "5px",
      padding: "3px 10px",
      borderRadius: "999px",
      fontSize: "12px",
      fontWeight: "600",
      background: isPresent ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
      color: isPresent ? "var(--success)" : "var(--danger)",
      border: `1px solid ${isPresent ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)"}`,
    }}>
      <span style={{
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        background: isPresent ? "var(--success)" : "var(--danger)",
        flexShrink: 0,
      }} />
      {status}
    </span>
  );
}

const StudentDashboard = () => {
  const { user, isInitialized } = useAuth();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [stats, setStats] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [records, setRecords] = useState([]);
  const [filterSubject, setFilterSubject] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");

  const [subjectModal, setSubjectModal] = useState({ open: false, mode: "add", id: null, name: "" });
  const [markModal, setMarkModal] = useState({
    open: false,
    subjectId: "",
    date: todayISO(),
    status: "present",
  });
  const [editRecordModal, setEditRecordModal] = useState({
    open: false,
    id: null,
    subjectId: "",
    date: "",
    status: "present",
  });
  const [submitting, setSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    if (!isInitialized || !user) return;

    setLoading(true);
    setLoadError(null);
    try {
      const params = {};
      if (filterSubject) params.subjectId = filterSubject;
      if (filterFrom) params.from = filterFrom;
      if (filterTo) params.to = filterTo;

      const statsParams = {};
      if (filterSubject) statsParams.subjectId = filterSubject;

      const [statsRes, subjectsRes, recordsRes] = await Promise.all([
        API.get(ATTENDANCE_PATHS.stats, { params: statsParams }),
        API.get(ATTENDANCE_PATHS.subjects),
        API.get(ATTENDANCE_PATHS.records, { params }),
      ]);
      setStats(statsRes.data);
      setSubjects(subjectsRes.data || []);
      setRecords(recordsRes.data || []);
    } catch (err) {
      const message = getErrorMessage(err);
      setLoadError(message);
      toast.error(message);
      setStats(null);
      setSubjects([]);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [filterSubject, filterFrom, filterTo, isInitialized, user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const overall = stats?.overall || { total: 0, present: 0, absent: 0, percentage: 0 };
  const lowAttendance = stats?.lowAttendanceSubjects || [];
  const timeline = stats?.timeline || [];

  const subjectProgress = useMemo(() => {
    const statsById = new Map(
      (stats?.bySubject || []).map((s) => [String(s.subjectId), s]),
    );
    return subjects.map((sub) => {
      const sid = String(sub._id);
      const row = statsById.get(sid);
      return {
        subjectId: sid,
        subjectName: sub.subjectName,
        total: row?.total ?? 0,
        present: row?.present ?? 0,
        absent: row?.absent ?? 0,
        percentage: row?.percentage ?? 0,
        presentDays: row?.present ?? 0,
      };
    });
  }, [subjects, stats?.bySubject]);

  const initials = useMemo(() => {
    if (!user?.name) return "S";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [user?.name]);

  const openAddSubject = () =>
    setSubjectModal({ open: true, mode: "add", id: null, name: "" });
  const openEditSubject = (s) =>
    setSubjectModal({ open: true, mode: "edit", id: s._id, name: s.subjectName });

  const saveSubject = async () => {
    const name = subjectModal.name.trim();
    if (!name) {
      toast.error("Subject name is required");
      return;
    }
    setSubmitting(true);
    try {
      if (subjectModal.mode === "add") {
        await API.post(ATTENDANCE_PATHS.subjects, { subjectName: name });
        toast.success("Subject added");
      } else {
        await API.put(ATTENDANCE_PATHS.subject(subjectModal.id), { subjectName: name });
        toast.success("Subject updated");
      }
      setSubjectModal({ open: false, mode: "add", id: null, name: "" });
      await loadData();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const deleteSubject = async (id) => {
    if (!window.confirm("Delete this subject and all its attendance records?")) return;
    try {
      await API.delete(ATTENDANCE_PATHS.subject(id));
      toast.success("Subject deleted");
      await loadData();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const markAttendance = async () => {
    if (!markModal.subjectId) {
      toast.error("Select a subject");
      return;
    }
    setSubmitting(true);
    try {
      await API.post(ATTENDANCE_PATHS.records, {
        subjectId: markModal.subjectId,
        date: markModal.date,
        status: markModal.status,
      });
      toast.success("Attendance marked");
      setMarkModal({ open: false, subjectId: "", date: todayISO(), status: "present" });
      await loadData();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const openEditRecord = (r) =>
    setEditRecordModal({
      open: true,
      id: r._id || r.id,
      subjectId: r.subjectId?._id || r.subjectId || "",
      date: r.date,
      status: r.status || r.attendance || "present",
    });

  const saveRecord = async () => {
    setSubmitting(true);
    try {
      await API.put(ATTENDANCE_PATHS.record(editRecordModal.id), {
        subjectId: editRecordModal.subjectId,
        date: editRecordModal.date,
        status: editRecordModal.status,
      });
      toast.success("Record updated");
      setEditRecordModal({ open: false, id: null, subjectId: "", date: "", status: "present" });
      await loadData();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const deleteRecord = async (id) => {
    if (!window.confirm("Delete this attendance record?")) return;
    try {
      await API.delete(ATTENDANCE_PATHS.record(id));
      toast.success("Record deleted");
      await loadData();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const resetFilters = () => {
    setFilterSubject("");
    setFilterFrom("");
    setFilterTo("");
  };

  if (!isInitialized || (loading && !stats && !loadError)) {
    return (
      <div style={{ display: "flex", justifyContent: "center", paddingTop: "80px" }}>
        <span className="spinner spinner-lg" />
      </div>
    );
  }

  const attendancePct = overall.percentage || 0;
  const overallStatus = getAttendanceStatus(attendancePct);

  return (
    <PageLayout className="pb-8">
      <div style={styles.pageWrapper}>

        {/* ── Error Banner ── */}
        {loadError && (
          <div style={{
            padding: "14px 18px",
            borderRadius: "12px",
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
            color: "var(--danger)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}>
            <span style={{ fontSize: "14px" }}>{loadError}</span>
            <PremiumButton variant="outline" size="sm" onClick={loadData}>Retry</PremiumButton>
          </div>
        )}

        {/* ── Header ── */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <h1 style={styles.pageTitle}>Attendance Dashboard</h1>
            <p style={styles.pageSubtitle}>
              Track attendance, monitor progress, and manage your academic records.
            </p>
          </div>
          <div style={styles.headerActions}>
            <PremiumButton variant="outline" size="sm" onClick={openAddSubject}>
              <Plus size={15} style={{ marginRight: "6px" }} />
              Add Subject
            </PremiumButton>
            <PremiumButton
              size="sm"
              onClick={() => setMarkModal({ open: true, subjectId: "", date: todayISO(), status: "present" })}
              disabled={subjects.length === 0}
            >
              <MdAdd size={16} style={{ marginRight: "4px" }} />
              Mark Attendance
            </PremiumButton>
          </div>
        </div>

        {/* ── Low Attendance Warning ── */}
        {lowAttendance.length > 0 && (
          <div style={{
            padding: "14px 18px",
            borderRadius: "12px",
            background: "rgba(245,158,11,0.08)",
            border: "1px solid rgba(245,158,11,0.25)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}>
            <AlertTriangle size={18} style={{ color: "var(--warning)", flexShrink: 0 }} />
            <span style={{ fontSize: "14px", fontWeight: "500", color: "var(--text-primary)" }}>
              <span style={{ color: "var(--warning)", fontWeight: "700" }}>Low attendance (&lt; {MIN_ATTENDANCE}%): </span>
              {lowAttendance.map((s) => `${s.subjectName} (${s.percentage}%)`).join(", ")}
            </span>
          </div>
        )}

        {/* ── Overview Stats ── */}
        <div>
          <p style={styles.sectionLabel}>Overview</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <AttendanceStatCard
              title="Overall Attendance"
              value={`${attendancePct}%`}
              subtext="Across all subjects"
              icon={BookOpen}
              iconBg={overallStatus.badgeClass.includes("emerald") ? "rgba(16,185,129,0.12)" : overallStatus.badgeClass.includes("amber") ? "rgba(245,158,11,0.12)" : "rgba(239,68,68,0.12)"}
              iconColor={overallStatus.badgeClass.includes("emerald") ? "var(--success)" : overallStatus.badgeClass.includes("amber") ? "var(--warning)" : "var(--danger)"}
              progressValue={attendancePct}
              progressColor={overallStatus.progressColor.replace("bg-", "").includes("emerald") ? "var(--success)" : overallStatus.progressColor.includes("amber") ? "var(--warning)" : "var(--danger)"}
            />
            <AttendanceStatCard
              title="Classes Attended"
              value={overall.present}
              subtext="Present"
              icon={CheckCircle2}
              iconBg="rgba(16,185,129,0.12)"
              iconColor="var(--success)"
              progressValue={overall.total > 0 ? Math.round((overall.present / overall.total) * 100) : 0}
              progressColor="var(--success)"
            />
            <AttendanceStatCard
              title="Classes Missed"
              value={overall.absent}
              subtext="Absent"
              icon={XCircle}
              iconBg="rgba(239,68,68,0.12)"
              iconColor="var(--danger)"
              progressValue={overall.total > 0 ? Math.round((overall.absent / overall.total) * 100) : 0}
              progressColor="var(--danger)"
            />
            <AttendanceStatCard
              title="Total Classes"
              value={overall.total}
              subtext="All subjects"
              icon={MdCalendarToday}
              iconBg="rgba(59,130,246,0.12)"
              iconColor="var(--accent)"
            />
          </div>
        </div>

        {/* ── Analytics ── */}
        <div>
          <SectionHeader
            title="Analytics"
            description="Visual breakdown of your attendance data"
          />
          <AttnCard hoverEffect={false} style={{ padding: "28px" }}>
            <AttendanceCharts
              bySubject={subjectProgress}
              timeline={timeline}
              filterSubjectId={filterSubject}
            />
          </AttnCard>
        </div>

        {/* ── Two column: Subject Progress + Subject Management ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "24px",
          alignItems: "start",
        }}>

          {/* Subject Progress */}
          {subjectProgress.length > 0 && (
            <div>
              <SectionHeader
                title="Subject Progress"
                description="Per-subject attendance breakdown"
              />
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {subjectProgress.map((s) => {
                  const pct = s.percentage;
                  const status = getAttendanceStatus(pct);
                  const fillColor = pct >= 75 ? "var(--success)" : pct >= 60 ? "var(--warning)" : "var(--danger)";
                  const badgeBg = pct >= 75 ? "rgba(16,185,129,0.12)" : pct >= 60 ? "rgba(245,158,11,0.12)" : "rgba(239,68,68,0.12)";
                  const badgeColor = pct >= 75 ? "var(--success)" : pct >= 60 ? "var(--warning)" : "var(--danger)";
                  return (
                    <div
                      key={s.subjectId}
                      style={{
                        ...styles.card,
                        padding: "18px 20px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = "translateY(-1px)";
                        e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.08)";
                        e.currentTarget.style.borderColor = "var(--accent)";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)";
                        e.currentTarget.style.borderColor = "var(--border-color)";
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontWeight: "600", fontSize: "14px", color: "var(--text-primary)" }}>
                          {s.subjectName}
                        </span>
                        <span style={{
                          padding: "2px 10px",
                          borderRadius: "999px",
                          fontSize: "12px",
                          fontWeight: "700",
                          background: badgeBg,
                          color: badgeColor,
                        }}>
                          {pct}%
                        </span>
                      </div>
                      <div style={styles.progressTrack}>
                        <div style={{ ...styles.progressFill, width: `${Math.min(pct, 100)}%`, background: fillColor }} />
                      </div>
                      <div style={{ display: "flex", gap: "16px" }}>
                        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                          <span style={{ fontWeight: "600", color: "var(--success)" }}>{s.present}</span> present
                        </span>
                        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                          <span style={{ fontWeight: "600", color: "var(--danger)" }}>{s.absent}</span> absent
                        </span>
                        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                          <span style={{ fontWeight: "600", color: "var(--text-primary)" }}>{s.total}</span> total
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Subject Management */}
          <div>
            <SectionHeader
              title="My Subjects"
              description="Add, edit, or remove subjects"
              action={
                <PremiumButton variant="outline" size="sm" onClick={openAddSubject}>
                  <Plus size={14} style={{ marginRight: "5px" }} />
                  Add
                </PremiumButton>
              }
            />
            {subjects.length === 0 ? (
              <AttnCard hoverEffect={false}>
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                  <BookOpen size={36} style={{ color: "var(--text-muted)", margin: "0 auto 12px", display: "block" }} />
                  <p style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: "500" }}>No subjects yet</p>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
                    Add your first subject to start tracking.
                  </p>
                </div>
              </AttnCard>
            ) : (
              <div style={styles.subjectGrid}>
                {subjects.map((s) => {
                  const subStats = subjectProgress.find(sp => sp.subjectId === String(s._id));
                  const pct = subStats?.percentage ?? 0;
                  const fillColor = pct >= 75 ? "var(--success)" : pct >= 60 ? "var(--warning)" : "var(--danger)";
                  const badgeBg = pct >= 75 ? "rgba(16,185,129,0.12)" : pct >= 60 ? "rgba(245,158,11,0.12)" : "rgba(239,68,68,0.12)";
                  const badgeColor = pct >= 75 ? "var(--success)" : pct >= 60 ? "var(--warning)" : "var(--danger)";
                  return (
                    <div
                      key={s._id}
                      style={styles.subjectCard}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
                        e.currentTarget.style.borderColor = "var(--accent)";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.borderColor = "var(--border-color)";
                      }}
                    >
                      {/* Name + % */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                        <span style={{ fontWeight: "700", fontSize: "15px", color: "var(--text-primary)", lineHeight: "1.3" }}>
                          {s.subjectName}
                        </span>
                        <span style={{
                          padding: "2px 10px",
                          borderRadius: "999px",
                          fontSize: "12px",
                          fontWeight: "700",
                          background: badgeBg,
                          color: badgeColor,
                          flexShrink: 0,
                        }}>
                          {pct}%
                        </span>
                      </div>

                      {/* Stats row */}
                      {subStats && (
                        <div style={{ display: "flex", gap: "12px" }}>
                          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                            <span style={{ fontWeight: "600", color: "var(--success)" }}>{subStats.present}</span> present
                          </span>
                          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                            <span style={{ fontWeight: "600", color: "var(--danger)" }}>{subStats.absent}</span> absent
                          </span>
                        </div>
                      )}

                      {/* Progress bar */}
                      <div style={styles.progressTrack}>
                        <div style={{ ...styles.progressFill, width: `${Math.min(pct, 100)}%`, background: fillColor }} />
                      </div>

                      {/* Actions */}
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px" }}>
                        <button
                          onClick={() => openEditSubject(s)}
                          aria-label="Edit subject"
                          style={{
                            background: "none",
                            border: "1px solid var(--border-color)",
                            borderRadius: "8px",
                            padding: "5px 8px",
                            cursor: "pointer",
                            color: "var(--text-muted)",
                            display: "flex",
                            alignItems: "center",
                            transition: "all 0.15s ease",
                          }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.color = "var(--text-muted)"; }}
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => deleteSubject(s._id)}
                          aria-label="Delete subject"
                          style={{
                            background: "none",
                            border: "1px solid var(--border-color)",
                            borderRadius: "8px",
                            padding: "5px 8px",
                            cursor: "pointer",
                            color: "var(--text-muted)",
                            display: "flex",
                            alignItems: "center",
                            transition: "all 0.15s ease",
                          }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--danger)"; e.currentTarget.style.color = "var(--danger)"; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.color = "var(--text-muted)"; }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Attendance History ── */}
        <div>
          <SectionHeader
            title="Attendance History"
            description="Filter, edit, or delete your attendance records"
          />

          {/* Filters Card */}
          <AttnCard hoverEffect={false} style={{ marginBottom: "16px", padding: "20px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
              <Filter size={14} style={{ color: "var(--text-muted)" }} />
              <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                Filters
              </span>
            </div>
            <div style={styles.filtersRow}>
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Subject</label>
                <select
                  style={styles.filterSelect}
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  onFocus={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.outline = "2px solid rgba(59,130,246,0.2)"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.outline = "none"; }}
                >
                  <option value="">All subjects</option>
                  {subjects.map((s) => (
                    <option key={s._id} value={s._id}>{s.subjectName}</option>
                  ))}
                </select>
              </div>
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>From Date</label>
                <input
                  type="date"
                  style={styles.filterInput}
                  value={filterFrom}
                  onChange={(e) => setFilterFrom(e.target.value)}
                  onFocus={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.outline = "2px solid rgba(59,130,246,0.2)"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.outline = "none"; }}
                />
              </div>
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>To Date</label>
                <input
                  type="date"
                  style={styles.filterInput}
                  value={filterTo}
                  onChange={(e) => setFilterTo(e.target.value)}
                  onFocus={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.outline = "2px solid rgba(59,130,246,0.2)"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.outline = "none"; }}
                />
              </div>
              <div style={{ display: "flex", gap: "8px", alignItems: "flex-end", paddingBottom: "0" }}>
                <PremiumButton size="sm" onClick={loadData}>
                  Apply
                </PremiumButton>
                <PremiumButton variant="outline" size="sm" onClick={resetFilters}>
                  <RotateCcw size={13} style={{ marginRight: "5px" }} />
                  Reset
                </PremiumButton>
              </div>
            </div>
          </AttnCard>

          {/* History Table */}
          {records.length === 0 ? (
            <AttnCard hoverEffect={false}>
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <MdCalendarToday size={40} style={{ color: "var(--text-muted)", margin: "0 auto 12px", display: "block" }} />
                <p style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: "500" }}>No records found</p>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
                  Mark attendance or adjust your filters to see records.
                </p>
              </div>
            </AttnCard>
          ) : (
            <div style={{
              borderRadius: "14px",
              border: "1px solid var(--border-color)",
              overflow: "hidden",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}>
              <div style={{ overflowX: "auto", overflowY: "auto", maxHeight: "480px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "480px" }}>
                  <thead style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    background: "var(--bg-secondary)",
                    borderBottom: "1px solid var(--border-color)",
                  }}>
                    <tr>
                      {["Date", "Subject", "Status", "Actions"].map((h, i) => (
                        <th
                          key={h}
                          style={{
                            padding: "12px 16px",
                            textAlign: i === 3 ? "right" : "left",
                            fontSize: "11px",
                            fontWeight: "700",
                            letterSpacing: "0.07em",
                            textTransform: "uppercase",
                            color: "var(--text-muted)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((r, idx) => (
                      <tr
                        key={r._id || r.id}
                        style={{
                          borderBottom: idx < records.length - 1 ? "1px solid var(--border-color)" : "none",
                          background: "var(--card-bg)",
                          transition: "background 0.15s ease",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-secondary)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "var(--card-bg)"; }}
                      >
                        <td style={{ padding: "14px 16px", fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", whiteSpace: "nowrap" }}>
                          {r.date}
                        </td>
                        <td style={{ padding: "14px 16px", fontSize: "14px", color: "var(--text-secondary)" }}>
                          {r.subjectName || r.subject}
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <StatusBadge status={r.status || r.attendance} />
                        </td>
                        <td style={{ padding: "14px 16px", textAlign: "right" }}>
                          <div style={{ display: "inline-flex", gap: "6px", justifyContent: "flex-end" }}>
                            <button
                              onClick={() => openEditRecord(r)}
                              aria-label="Edit record"
                              style={{
                                background: "none",
                                border: "1px solid var(--border-color)",
                                borderRadius: "7px",
                                padding: "5px 8px",
                                cursor: "pointer",
                                color: "var(--text-muted)",
                                display: "flex",
                                alignItems: "center",
                                transition: "all 0.15s ease",
                              }}
                              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
                              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.color = "var(--text-muted)"; }}
                            >
                              <MdEdit size={15} />
                            </button>
                            <button
                              onClick={() => deleteRecord(r._id || r.id)}
                              aria-label="Delete record"
                              style={{
                                background: "none",
                                border: "1px solid var(--border-color)",
                                borderRadius: "7px",
                                padding: "5px 8px",
                                cursor: "pointer",
                                color: "var(--text-muted)",
                                display: "flex",
                                alignItems: "center",
                                transition: "all 0.15s ease",
                              }}
                              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--danger)"; e.currentTarget.style.color = "var(--danger)"; }}
                              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.color = "var(--text-muted)"; }}
                            >
                              <MdDelete size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* ── Modals ── */}

      {/* Add / Edit Subject */}
      <Dialog
        open={subjectModal.open}
        onOpenChange={(open) => !open && setSubjectModal((m) => ({ ...m, open: false }))}
      >
        <DialogContent className="sm:max-w-[425px] p-lg">
          <DialogHeader>
            <DialogTitle className="font-sans text-lg font-bold">
              {subjectModal.mode === "add" ? "Add subject" : "Edit subject"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-muted)", display: "block", marginBottom: "8px" }}>
              Subject Name
            </label>
            <input
              className="form-input"
              placeholder="e.g. Mathematics, Physics…"
              value={subjectModal.name}
              onChange={(e) => setSubjectModal((m) => ({ ...m, name: e.target.value }))}
              onKeyDown={(e) => e.key === "Enter" && saveSubject()}
            />
          </div>
          <DialogFooter className="gap-2">
            <PremiumButton variant="outline" size="sm" onClick={() => setSubjectModal((m) => ({ ...m, open: false }))}>
              Cancel
            </PremiumButton>
            <PremiumButton size="sm" onClick={saveSubject} disabled={submitting}>
              {submitting ? "Saving…" : "Save"}
            </PremiumButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mark Attendance */}
      <Dialog
        open={markModal.open}
        onOpenChange={(open) => !open && setMarkModal((m) => ({ ...m, open: false }))}
      >
        <DialogContent className="sm:max-w-[450px] p-lg">
          <DialogHeader>
            <DialogTitle className="font-sans text-lg font-bold">Mark attendance</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block text-muted-foreground">Subject</label>
              <select
                className="form-select"
                value={markModal.subjectId}
                onChange={(e) => setMarkModal((m) => ({ ...m, subjectId: e.target.value }))}
              >
                <option value="">Select subject</option>
                {subjects.map((s) => (
                  <option key={s._id} value={s._id}>{s.subjectName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block text-muted-foreground">Date</label>
              <input
                type="date"
                className="form-input"
                value={markModal.date}
                onChange={(e) => setMarkModal((m) => ({ ...m, date: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block text-muted-foreground">Status</label>
              <div className="flex gap-2">
                <PremiumButton
                  type="button"
                  variant={markModal.status === "present" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setMarkModal((m) => ({ ...m, status: "present" }))}
                >
                  Present
                </PremiumButton>
                <PremiumButton
                  type="button"
                  variant={markModal.status === "absent" ? "destructive" : "outline"}
                  className="flex-1"
                  onClick={() => setMarkModal((m) => ({ ...m, status: "absent" }))}
                >
                  Absent
                </PremiumButton>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <PremiumButton variant="outline" size="sm" onClick={() => setMarkModal((m) => ({ ...m, open: false }))}>
              Cancel
            </PremiumButton>
            <PremiumButton size="sm" onClick={markAttendance} disabled={submitting}>
              {submitting ? "Saving…" : "Mark"}
            </PremiumButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Record */}
      <Dialog
        open={editRecordModal.open}
        onOpenChange={(open) => !open && setEditRecordModal((m) => ({ ...m, open: false }))}
      >
        <DialogContent className="sm:max-w-[450px] p-lg">
          <DialogHeader>
            <DialogTitle className="font-sans text-lg font-bold">Edit attendance</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block text-muted-foreground">Subject</label>
              <select
                className="form-select"
                value={editRecordModal.subjectId}
                onChange={(e) => setEditRecordModal((m) => ({ ...m, subjectId: e.target.value }))}
              >
                {subjects.map((s) => (
                  <option key={s._id} value={s._id}>{s.subjectName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block text-muted-foreground">Date</label>
              <input
                type="date"
                className="form-input"
                value={editRecordModal.date}
                onChange={(e) => setEditRecordModal((m) => ({ ...m, date: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block text-muted-foreground">Status</label>
              <div className="flex gap-2">
                <PremiumButton
                  type="button"
                  variant={editRecordModal.status === "present" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setEditRecordModal((m) => ({ ...m, status: "present" }))}
                >
                  Present
                </PremiumButton>
                <PremiumButton
                  type="button"
                  variant={editRecordModal.status === "absent" ? "destructive" : "outline"}
                  className="flex-1"
                  onClick={() => setEditRecordModal((m) => ({ ...m, status: "absent" }))}
                >
                  Absent
                </PremiumButton>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <PremiumButton
              variant="outline"
              size="sm"
              onClick={() => setEditRecordModal((m) => ({ ...m, open: false }))}
            >
              Cancel
            </PremiumButton>
            <PremiumButton size="sm" onClick={saveRecord} disabled={submitting}>
              {submitting ? "Saving…" : "Update"}
            </PremiumButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default StudentDashboard;
