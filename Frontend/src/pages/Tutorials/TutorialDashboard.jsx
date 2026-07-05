import React from "react";
import { Link } from "react-router-dom";
import {
  Calendar, Clock, MessageSquare, CheckCircle,
  Search, Video, ArrowRight, GraduationCap,
  History, User, TrendingUp, BookOpen, Star,
  Zap, ChevronRight, AlertCircle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { TUTORIAL_PATHS } from "@/utils/tutorialRoutes";
import { useTutorialDashboard } from "@/hooks/useTutorialDashboard";

/* ── Design tokens ── */
const S = {
  card: {
    background: "var(--card-bg)",
    border: "1px solid var(--border-color)",
    borderRadius: "14px",
    padding: "20px 22px",
  },
};

/* ── Metric Card ── */
const MetricCard = ({ title, value, icon: Icon, color, bg, trend }) => (
  <div style={{
    ...S.card,
    display: "flex", flexDirection: "column", gap: "12px",
    transition: "all 0.2s ease",
  }}
    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.07)"; }}
    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
  >
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <p style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-muted)", margin: 0 }}>
        {title}
      </p>
      <div style={{
        width: "34px", height: "34px", borderRadius: "10px",
        background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <Icon size={16} style={{ color }} />
      </div>
    </div>
    <div>
      <p style={{ fontSize: "30px", fontWeight: "800", color: "var(--text-primary)", margin: 0, letterSpacing: "-0.02em", lineHeight: "1" }}>
        {value}
      </p>
      {trend && (
        <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>{trend}</p>
      )}
    </div>
  </div>
);

/* ── Quick Action ── */
const QuickAction = ({ title, icon: Icon, to, color, bg }) => (
  <Link to={to} style={{ textDecoration: "none" }}>
    <div style={{
      background: "var(--card-bg)",
      border: "1px solid var(--border-color)",
      borderRadius: "12px",
      padding: "16px 14px",
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: "8px", textAlign: "center",
      transition: "all 0.2s ease", cursor: "pointer",
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 6px 16px ${color}20`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{
        width: "38px", height: "38px", borderRadius: "10px",
        background: bg, display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon size={18} style={{ color }} />
      </div>
      <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-primary)", lineHeight: "1.2" }}>{title}</span>
    </div>
  </Link>
);

/* ── Status Badge ── */
const StatusBadge = ({ status }) => {
  const s = (status || "pending").toLowerCase();
  const configs = {
    accepted: { bg: "rgba(16,185,129,0.12)", color: "#059669", label: "Accepted" },
    upcoming: { bg: "rgba(59,130,246,0.12)", color: "#2563eb", label: "Upcoming" },
    in_progress: { bg: "rgba(139,92,246,0.12)", color: "#7c3aed", label: "In Progress" },
    completed: { bg: "rgba(16,185,129,0.12)", color: "#059669", label: "Completed" },
    pending: { bg: "rgba(245,158,11,0.12)", color: "#b45309", label: "Pending" },
    cancelled: { bg: "rgba(239,68,68,0.12)", color: "#dc2626", label: "Cancelled" },
    booked: { bg: "rgba(245,158,11,0.12)", color: "#b45309", label: "Booked" },
  };
  const cfg = configs[s] || configs.pending;
  return (
    <span style={{
      fontSize: "10px", fontWeight: "700", padding: "2px 8px",
      borderRadius: "999px", background: cfg.bg, color: cfg.color,
      textTransform: "capitalize", letterSpacing: "0.03em",
    }}>
      {cfg.label}
    </span>
  );
};

/* ── Loading Skeleton ── */
const LoadingSkeleton = () => (
  <div style={{ padding: "24px", maxWidth: "1100px", margin: "0 auto" }}>
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "32px" }}>
      <Skeleton className="h-9 w-64" />
      <Skeleton className="h-5 w-80" />
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "24px" }}>
      {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 w-full rounded-2xl" />)}
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "10px", marginBottom: "32px" }}>
      {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
      <Skeleton className="h-72 w-full rounded-2xl" />
      <Skeleton className="h-72 w-full rounded-2xl" />
    </div>
  </div>
);

/* ── Empty Experience ── */
const EmptyExperience = () => (
  <div style={{
    textAlign: "center", padding: "60px 24px",
    maxWidth: "560px", margin: "0 auto",
    display: "flex", flexDirection: "column", alignItems: "center", gap: "16px",
  }}>
    <div style={{
      width: "80px", height: "80px", borderRadius: "24px",
      background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <GraduationCap size={36} style={{ color: "var(--accent)" }} />
    </div>
    <div>
      <h2 style={{ fontSize: "22px", fontWeight: "800", color: "var(--text-primary)", margin: "0 0 8px", letterSpacing: "-0.01em" }}>
        Start your learning journey
      </h2>
      <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: 0, lineHeight: "1.6" }}>
        You haven't booked any sessions yet. Discover the perfect tutor and kickstart your progress.
      </p>
    </div>
    <div style={{ display: "flex", gap: "10px" }}>
      <Link to={TUTORIAL_PATHS.studentSearch} style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        padding: "0 20px", height: "40px", borderRadius: "10px",
        background: "var(--accent)", color: "#fff",
        fontSize: "13px", fontWeight: "700", textDecoration: "none",
        boxShadow: "0 4px 12px rgba(59,130,246,0.3)",
      }}>
        <Search size={14} /> Find a Tutor
      </Link>
      <Link to="/tutorials/profile" style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        padding: "0 20px", height: "40px", borderRadius: "10px",
        background: "var(--card-bg)", color: "var(--text-primary)",
        border: "1px solid var(--border-color)",
        fontSize: "13px", fontWeight: "600", textDecoration: "none",
      }}>
        Complete Profile
      </Link>
    </div>
  </div>
);

/* ── Main Component ── */
export default function TutorialDashboard() {
  const { metrics, upcomingSessions, recentActivity, bookings, loading } = useTutorialDashboard();

  if (loading) return <LoadingSkeleton />;

  const isEmpty =
    (!bookings || bookings.length === 0) &&
    (!upcomingSessions || upcomingSessions.length === 0) &&
    (!recentActivity || recentActivity.length === 0);

  const METRICS = [
    { title: "Upcoming Bookings", value: metrics.upcomingBookings, icon: Calendar, color: "#3b82f6", bg: "rgba(59,130,246,0.1)", trend: "Next session scheduled" },
    { title: "Completed Classes", value: metrics.completedClasses, icon: CheckCircle, color: "#10b981", bg: "rgba(16,185,129,0.1)", trend: "Classes finished" },
    { title: "Active Chats", value: metrics.activeConversations, icon: MessageSquare, color: "#ec4899", bg: "rgba(236,72,153,0.1)", trend: "Ongoing conversations" },
    { title: "Pending Requests", value: metrics.pendingRequests, icon: Clock, color: "#f59e0b", bg: "rgba(245,158,11,0.1)", trend: "Awaiting confirmation" },
  ];

  const QUICK_ACTIONS = [
    { title: "Find Tutor", icon: Search, to: TUTORIAL_PATHS.studentSearch, color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
    { title: "My Bookings", icon: Calendar, to: "/tutorials/bookings", color: "#8b5cf6", bg: "rgba(139,92,246,0.1)" },
    { title: "Open Chats", icon: MessageSquare, to: "/tutorials/chat", color: "#ec4899", bg: "rgba(236,72,153,0.1)" },
    { title: "Attendance", icon: CheckCircle, to: "/tutorials/online-attendance", color: "#10b981", bg: "rgba(16,185,129,0.1)" },
    { title: "History", icon: History, to: "/tutorials/history", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
    { title: "My Profile", icon: User, to: "/tutorials/profile", color: "#6366f1", bg: "rgba(99,102,241,0.1)" },
  ];

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", paddingBottom: "40px" }}>

      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: "800", color: "var(--text-primary)", margin: "0 0 4px", letterSpacing: "-0.02em" }}>
          Tutorials Dashboard
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: 0 }}>
          Manage tutoring, bookings and learning activity
        </p>
      </div>

      {isEmpty ? (
        <EmptyExperience />
      ) : (
        <>
          {/* Metrics */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "24px" }}
            className="grid-metrics">
            {METRICS.map((m) => (
              <MetricCard key={m.title} {...m} />
            ))}
          </div>

          {/* Quick Actions */}
          <div style={{ marginBottom: "28px" }}>
            <p style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "12px" }}>
              Quick Actions
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "10px" }}
              className="grid-actions">
              {QUICK_ACTIONS.map((a) => (
                <QuickAction key={a.title} {...a} />
              ))}
            </div>
          </div>

          {/* Two-column content */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
            className="grid-main">

            {/* Upcoming Sessions */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                <h2 style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>
                  Upcoming Sessions
                </h2>
                <Link to="/tutorials/bookings" style={{
                  fontSize: "12px", fontWeight: "600", color: "var(--accent)",
                  textDecoration: "none", display: "flex", alignItems: "center", gap: "4px",
                }}>
                  See all <ArrowRight size={12} />
                </Link>
              </div>

              <div style={{ ...S.card, padding: 0, overflow: "hidden" }}>
                {upcomingSessions.length === 0 ? (
                  <div style={{ padding: "40px 24px", textAlign: "center" }}>
                    <BookOpen size={28} style={{ color: "var(--text-muted)", margin: "0 auto 10px", display: "block", opacity: 0.5 }} />
                    <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0 }}>No upcoming sessions</p>
                  </div>
                ) : (
                  <div>
                    {upcomingSessions.slice(0, 5).map((session, i) => (
                      <div
                        key={i}
                        style={{
                          padding: "14px 18px",
                          borderBottom: i < upcomingSessions.slice(0, 5).length - 1 ? "1px solid var(--border-color)" : "none",
                          transition: "background 0.12s ease",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "var(--bg-secondary)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                              <StatusBadge status={session.status} />
                            </div>
                            <p style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-primary)", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {session.subject || "Tutoring Session"}
                            </p>
                            <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>
                              with {session.tutorName || "Tutor"}
                            </p>
                          </div>
                          <div style={{ textAlign: "right", flexShrink: 0 }}>
                            <p style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-primary)", margin: "0 0 2px" }}>{session.date}</p>
                            <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: 0 }}>{session.time}</p>
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                          <Link to="/tutorials/chat" style={{
                            flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                            gap: "4px", height: "30px", borderRadius: "8px",
                            border: "1px solid var(--border-color)", background: "var(--card-bg)",
                            fontSize: "11px", fontWeight: "600", color: "var(--text-primary)",
                            textDecoration: "none", transition: "all 0.15s ease",
                          }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.color = "var(--text-primary)"; }}
                          >
                            <MessageSquare size={11} /> Message
                          </Link>
                          {session.meetingLink && (
                            <button
                              onClick={() => window.open(session.meetingLink, "_blank")}
                              style={{
                                flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                                gap: "4px", height: "30px", borderRadius: "8px",
                                border: "none", background: "var(--accent)", color: "#fff",
                                fontSize: "11px", fontWeight: "700", cursor: "pointer",
                                transition: "opacity 0.15s ease",
                              }}
                              onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                            >
                              <Video size={11} /> Join
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h2 style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-primary)", margin: "0 0 14px" }}>
                Recent Activity
              </h2>

              <div style={{ ...S.card, padding: 0, overflow: "hidden" }}>
                {recentActivity.length === 0 ? (
                  <div style={{ padding: "40px 24px", textAlign: "center" }}>
                    <TrendingUp size={28} style={{ color: "var(--text-muted)", margin: "0 auto 10px", display: "block", opacity: 0.5 }} />
                    <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0 }}>No recent activity</p>
                  </div>
                ) : (
                  <div>
                    {recentActivity.map((activity, i) => (
                      <div
                        key={i}
                        style={{
                          padding: "12px 18px",
                          borderBottom: i < recentActivity.length - 1 ? "1px solid var(--border-color)" : "none",
                          display: "flex", alignItems: "flex-start", gap: "12px",
                          transition: "background 0.12s ease",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "var(--bg-secondary)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        {/* Activity dot */}
                        <div style={{
                          width: "8px", height: "8px", borderRadius: "50%",
                          background: activity.type === "chat" ? "#ec4899" : "var(--accent)",
                          marginTop: "5px", flexShrink: 0,
                        }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-primary)", margin: "0 0 2px" }}>
                            {activity.title}
                          </p>
                          <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {activity.subtitle || activity.desc}
                          </p>
                        </div>
                        <span style={{ fontSize: "11px", color: "var(--text-muted)", flexShrink: 0, paddingTop: "1px" }}>
                          {new Date(activity.timestamp || activity.time).toLocaleDateString(undefined, {
                            month: "short", day: "numeric",
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 1024px) {
          .grid-metrics { grid-template-columns: repeat(2, 1fr) !important; }
          .grid-actions { grid-template-columns: repeat(3, 1fr) !important; }
          .grid-main { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .grid-metrics { grid-template-columns: repeat(2, 1fr) !important; }
          .grid-actions { grid-template-columns: repeat(3, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
