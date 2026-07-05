import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  BookOpen, CalendarDays, GraduationCap, Info,
  ChevronDown, ChevronUp, TrendingUp, CheckCircle, XCircle,
} from "lucide-react";
import API, { TUTOR_ATTENDANCE_PATHS } from "@/services/Attendance/tutorAttendanceApi";

const getErrorMessage = (err) =>
  err?.response?.data?.message || err?.message || "Something went wrong";

/* ── Status Badge ── */
const StatusBadge = ({ status }) => {
  const isPresent = status === "present";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "4px",
      padding: "2px 9px", borderRadius: "999px",
      background: isPresent ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
      color: isPresent ? "#059669" : "#dc2626",
      fontSize: "10px", fontWeight: "700",
    }}>
      {isPresent
        ? <CheckCircle size={10} />
        : <XCircle size={10} />
      }
      {isPresent ? "Present" : "Absent"}
    </span>
  );
};

/* ── Progress Bar ── */
const ProgressBar = ({ percentage, color = "#3b82f6" }) => {
  const pct = Math.min(100, Math.max(0, percentage || 0));
  const barColor = pct >= 75 ? "#10b981" : pct >= 50 ? "#f59e0b" : "#ef4444";
  return (
    <div style={{ width: "100%" }}>
      <div style={{
        height: "6px", borderRadius: "999px",
        background: "var(--border-color)", overflow: "hidden",
      }}>
        <div style={{
          height: "100%", borderRadius: "999px",
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${barColor}CC, ${barColor})`,
          transition: "width 0.6s ease",
        }} />
      </div>
    </div>
  );
};

/* ── Metric Summary Card ── */
const SummaryCard = ({ icon: Icon, title, value, color, bg, subtitle }) => (
  <div style={{
    background: "var(--card-bg)", border: "1px solid var(--border-color)",
    borderRadius: "16px", padding: "20px 22px",
    display: "flex", flexDirection: "column", gap: "10px",
    transition: "all 0.2s ease",
  }}
    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.07)"; }}
    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
  >
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <p style={{
        fontSize: "11px", fontWeight: "700", letterSpacing: "0.05em",
        textTransform: "uppercase", color: "var(--text-muted)", margin: 0,
      }}>{title}</p>
      <div style={{
        width: "34px", height: "34px", borderRadius: "10px",
        background: bg, display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon size={16} style={{ color }} />
      </div>
    </div>
    <p style={{
      fontSize: "32px", fontWeight: "800", color: "var(--text-primary)",
      margin: 0, letterSpacing: "-0.02em", lineHeight: "1",
    }}>{value}</p>
    {subtitle && (
      <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: 0 }}>{subtitle}</p>
    )}
  </div>
);

/* ── Course Card ── */
const CourseCard = ({ course, isOpen, onToggle }) => {
  const key = `${course.tutorId}-${course.courseName}`;
  const pct = course.attendancePercentage || 0;
  const statusColor = pct >= 75 ? "#10b981" : pct >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div style={{
      background: "var(--card-bg)", border: "1px solid var(--border-color)",
      borderRadius: "16px", overflow: "hidden",
      transition: "all 0.2s ease",
      boxShadow: isOpen ? "0 8px 24px rgba(0,0,0,0.06)" : "none",
    }}>
      {/* Card Header */}
      <div
        style={{
          padding: "18px 20px", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
        }}
        onClick={onToggle}
        onMouseEnter={e => e.currentTarget.style.background = "var(--bg-secondary, rgba(0,0,0,0.02))"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      >
        {/* Left */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "10px",
              background: `${statusColor}18`, border: `1px solid ${statusColor}30`,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <BookOpen size={15} style={{ color: statusColor }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <h3 style={{
                fontSize: "14px", fontWeight: "700", color: "var(--text-primary)",
                margin: "0 0 1px",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {course.courseName}
              </h3>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>
                Tutor: {course.tutorName}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ paddingLeft: "46px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
              <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: 0 }}>
                {course.classesAttended} of {course.totalClasses} classes attended
              </p>
              <span style={{
                fontSize: "11px", fontWeight: "700", color: statusColor,
              }}>{pct}%</span>
            </div>
            <ProgressBar percentage={pct} />
          </div>
        </div>

        {/* Toggle icon */}
        <div style={{
          width: "28px", height: "28px", borderRadius: "8px",
          background: "var(--border-color)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          transition: "all 0.2s ease",
        }}>
          {isOpen
            ? <ChevronUp size={14} style={{ color: "var(--text-muted)" }} />
            : <ChevronDown size={14} style={{ color: "var(--text-muted)" }} />
          }
        </div>
      </div>

      {/* Expanded history */}
      {isOpen && (
        <div style={{
          borderTop: "1px solid var(--border-color)",
          background: "var(--bg-secondary, rgba(0,0,0,0.015))",
          padding: "0",
        }}>
          <p style={{
            fontSize: "10px", fontWeight: "700", color: "var(--text-muted)",
            letterSpacing: "0.06em", textTransform: "uppercase",
            padding: "12px 20px 8px",
          }}>
            Attendance History
          </p>
          <div style={{ borderRadius: "0 0 16px 16px", overflow: "hidden" }}>
            {course.history.map((row, i) => (
              <div
                key={row.id}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 20px",
                  borderBottom: i < course.history.length - 1 ? "1px solid var(--border-color)" : "none",
                  transition: "background 0.12s ease",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--card-bg)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <CalendarDays size={13} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                  <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                    {row.date}
                    {row.sessionTime ? (
                      <span style={{ color: "var(--text-muted)", marginLeft: "6px" }}>· {row.sessionTime}</span>
                    ) : null}
                  </span>
                </div>
                <StatusBadge status={row.status} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Loading Skeleton ── */
const LoadingSkeleton = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{
          height: "110px", borderRadius: "16px",
          background: "var(--card-bg)", border: "1px solid var(--border-color)",
          animation: "pulse 1.5s ease-in-out infinite",
        }} />
      ))}
    </div>
    {[1, 2].map(i => (
      <div key={i} style={{
        height: "90px", borderRadius: "16px",
        background: "var(--card-bg)", border: "1px solid var(--border-color)",
        animation: "pulse 1.5s ease-in-out infinite",
      }} />
    ))}
  </div>
);

/* ── Main Component ── */
export default function OnlineAttendanceView() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [expandedCourse, setExpandedCourse] = useState(null);

  const loadSummary = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get(TUTOR_ATTENDANCE_PATHS.studentSummary);
      setSummary(res.data);
    } catch (err) {
      toast.error(getErrorMessage(err));
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  const overall = summary?.overall || {
    totalClasses: 0,
    classesAttended: 0,
    attendancePercentage: 0,
  };
  const courses = summary?.courses || [];

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", paddingBottom: "32px" }}>


      {/* ── Page Header ── */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "12px",
            background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <TrendingUp size={20} style={{ color: "#3b82f6" }} />
          </div>
          <div>
            <h1 style={{
              fontSize: "22px", fontWeight: "800", color: "var(--text-primary)",
              margin: 0, letterSpacing: "-0.02em",
            }}>
              Online Attendance
            </h1>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0 }}>
              Tutor-marked attendance for your online tutorial sessions
            </p>
          </div>
        </div>
      </div>

      {/* ── Info Banner ── */}
      <div style={{
        display: "flex", alignItems: "flex-start", gap: "12px",
        padding: "14px 18px", borderRadius: "12px", marginBottom: "24px",
        background: "rgba(59,130,246,0.07)", border: "1px solid rgba(59,130,246,0.2)",
      }}>
        <Info size={16} style={{ color: "#3b82f6", flexShrink: 0, marginTop: "1px" }} />
        <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0, lineHeight: "1.5" }}>
          College attendance is tracked separately on{" "}
          <a href="/student/attendance" style={{ color: "var(--accent)", fontWeight: "600" }}>
            My Attendance
          </a>
          . This page shows only online tutorial sessions marked by your tutor.
        </p>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <>
          {/* ── Overall Summary Cards ── */}
          <div style={{ marginBottom: "28px" }}>
            <p style={{
              fontSize: "11px", fontWeight: "700", letterSpacing: "0.07em",
              textTransform: "uppercase", color: "var(--text-muted)",
              marginBottom: "12px",
            }}>
              Overall Summary
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}
              className="attendance-metrics-grid">
              <SummaryCard
                icon={CalendarDays}
                title="Total Classes"
                value={overall.totalClasses}
                color="#3b82f6"
                bg="rgba(59,130,246,0.1)"
                subtitle="Online tutorial sessions"
              />
              <SummaryCard
                icon={GraduationCap}
                title="Classes Attended"
                value={overall.classesAttended}
                color="#10b981"
                bg="rgba(16,185,129,0.1)"
                subtitle="Sessions marked present"
              />
              <SummaryCard
                icon={BookOpen}
                title="Attendance Rate"
                value={`${overall.attendancePercentage}%`}
                color={overall.attendancePercentage >= 75 ? "#10b981" : overall.attendancePercentage >= 50 ? "#f59e0b" : "#ef4444"}
                bg={overall.attendancePercentage >= 75 ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)"}
                subtitle={overall.attendancePercentage >= 75 ? "✓ Good standing" : "Needs improvement"}
              />
            </div>

            {/* Overall progress bar */}
            {overall.totalClasses > 0 && (
              <div style={{
                background: "var(--card-bg)", border: "1px solid var(--border-color)",
                borderRadius: "12px", padding: "16px 20px", marginTop: "14px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <p style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-secondary)", margin: 0 }}>
                    Overall attendance progress
                  </p>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-primary)" }}>
                    {overall.classesAttended}/{overall.totalClasses}
                  </span>
                </div>
                <ProgressBar percentage={overall.attendancePercentage} />
              </div>
            )}
          </div>

          {/* ── Courses ── */}
          <div>
            <p style={{
              fontSize: "11px", fontWeight: "700", letterSpacing: "0.07em",
              textTransform: "uppercase", color: "var(--text-muted)",
              marginBottom: "12px",
            }}>
              By Course
            </p>

            {courses.length === 0 ? (
              <div style={{
                textAlign: "center", padding: "48px 24px",
                background: "var(--card-bg)", border: "1px solid var(--border-color)",
                borderRadius: "16px",
              }}>
                <div style={{
                  width: "64px", height: "64px", borderRadius: "18px",
                  background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 14px",
                }}>
                  <BookOpen size={28} style={{ color: "#3b82f6", opacity: 0.6 }} />
                </div>
                <p style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-primary)", margin: "0 0 6px" }}>
                  No attendance records yet
                </p>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0, lineHeight: "1.5" }}>
                  Records appear after your tutor marks attendance for a session.
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {courses.map((course) => {
                  const key = `${course.tutorId}-${course.courseName}`;
                  return (
                    <CourseCard
                      key={key}
                      course={course}
                      isOpen={expandedCourse === key}
                      onToggle={() => setExpandedCourse(expandedCourse === key ? null : key)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      <style>{`
        @media (max-width: 640px) {
          .attendance-metrics-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 900px) {
          .attendance-metrics-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
