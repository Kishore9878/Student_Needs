import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search, CalendarClock, User, History,
  ClipboardList, MessageSquare, ArrowRight,
  GraduationCap, Sparkles, BookOpen, Star,
  ChevronRight, Zap,
} from "lucide-react";
import { TUTORIAL_PATHS } from "@/utils/tutorialRoutes";
import { tutorsApiClient } from "@/services/apiClient.js";

const MODULE_ACTIONS = [
  {
    title: "Find a Tutor",
    description: "Search tutors by subject and book a session",
    to: TUTORIAL_PATHS.studentSearch,
    icon: Search,
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.1)",
    badge: "Popular",
  },
  {
    title: "My Bookings",
    description: "View and manage upcoming tutorial bookings",
    to: "/tutorials/bookings",
    icon: CalendarClock,
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.1)",
  },
  {
    title: "Class History",
    description: "Review past tutorial sessions and leave reviews",
    to: "/tutorials/history",
    icon: History,
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
  },
  {
    title: "Online Attendance",
    description: "See tutor-marked attendance for online classes",
    to: TUTORIAL_PATHS.studentOnlineAttendance,
    icon: ClipboardList,
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
  },
  {
    title: "My Profile",
    description: "Update your student profile and preferences",
    to: TUTORIAL_PATHS.studentProfile,
    icon: User,
    color: "#6366f1",
    bg: "rgba(99,102,241,0.1)",
  },
  {
    title: "Tutor Chats",
    description: "Chat with tutors and manage conversations",
    to: "/tutorials/chat",
    icon: MessageSquare,
    color: "#ec4899",
    bg: "rgba(236,72,153,0.1)",
    showBadge: true,
  },
];

const QUICK_STATS = [
  { label: "Expert Tutors", value: "500+", icon: GraduationCap },
  { label: "Subjects Covered", value: "120+", icon: BookOpen },
  { label: "Avg Rating", value: "4.9★", icon: Star },
];

function TutorialsHome() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const { data } = await tutorsApiClient.get("/tutorial-chat/conversations");
        if (data?.success && data?.data) {
          const totalUnread = data.data.reduce((acc, chat) => acc + (chat.unreadCount || 0), 0);
          setUnreadCount(totalUnread);
        }
      } catch (err) {
        console.error("Failed to load chat unreads in dashboard", err);
      }
    };
    fetchUnread();
  }, []);

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", paddingBottom: "40px" }}>

      {/* Hero Section */}
      <div style={{
        background: "linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(139,92,246,0.06) 50%, rgba(16,185,129,0.05) 100%)",
        border: "1px solid var(--border-color)",
        borderRadius: "20px",
        padding: "40px 36px",
        marginBottom: "32px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background decoration */}
        <div style={{
          position: "absolute", top: "-40px", right: "-40px",
          width: "200px", height: "200px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.12), transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "-30px", left: "60%",
          width: "150px", height: "150px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.1), transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
          <div style={{
            width: "52px", height: "52px", borderRadius: "14px",
            background: "linear-gradient(135deg, var(--accent), #6366f1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 20px rgba(59,130,246,0.25)", flexShrink: 0,
          }}>
            <GraduationCap size={26} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: "800", color: "var(--text-primary)", margin: 0, letterSpacing: "-0.02em" }}>
              Tutor Match
            </h1>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: "2px 0 0", fontWeight: "500" }}>
              Find tutors, manage bookings, and track your learning
            </p>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginTop: "24px" }}>
          {QUICK_STATS.map(({ label, value, icon: Icon }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{
                width: "30px", height: "30px", borderRadius: "8px",
                background: "var(--card-bg)", border: "1px solid var(--border-color)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <Icon size={14} style={{ color: "var(--accent)" }} />
              </div>
              <div>
                <p style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>{value}</p>
                <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: 0 }}>{label}</p>
              </div>
            </div>
          ))}

          {/* CTA */}
          <Link
            to={TUTORIAL_PATHS.studentSearch}
            style={{
              marginLeft: "auto",
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "0 20px", height: "40px", borderRadius: "10px",
              background: "var(--accent)", color: "#fff",
              fontSize: "13px", fontWeight: "700", textDecoration: "none",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 12px rgba(59,130,246,0.3)",
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <Zap size={14} />
            Find a Tutor
          </Link>
        </div>
      </div>

      {/* Module Cards Grid */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <Sparkles size={16} style={{ color: "var(--text-muted)" }} />
          <h2 style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-muted)", letterSpacing: "0.07em", textTransform: "uppercase", margin: 0 }}>
            Quick Access
          </h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "12px",
        }}>
          {MODULE_ACTIONS.map((action) => {
            const Icon = action.icon;
            const isChat = action.title === "Tutor Chats";
            return (
              <Link
                key={action.title}
                to={action.to}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    background: "var(--card-bg)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "14px",
                    padding: "18px 20px",
                    display: "flex", alignItems: "center", gap: "14px",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                    position: "relative",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = action.color;
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = `0 8px 24px ${action.color}18`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "var(--border-color)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Icon */}
                  <div style={{
                    width: "44px", height: "44px", borderRadius: "12px",
                    background: action.bg, display: "flex",
                    alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <Icon size={20} style={{ color: action.color }} />
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                      <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-primary)" }}>
                        {action.title}
                      </span>
                      {action.badge && (
                        <span style={{
                          fontSize: "9px", fontWeight: "700", padding: "1px 7px",
                          borderRadius: "999px", background: `${action.color}20`, color: action.color,
                          textTransform: "uppercase", letterSpacing: "0.05em",
                        }}>
                          {action.badge}
                        </span>
                      )}
                      {isChat && unreadCount > 0 && (
                        <span style={{
                          minWidth: "18px", height: "18px", padding: "0 5px",
                          borderRadius: "999px", background: "#ec4899",
                          color: "#fff", fontSize: "10px", fontWeight: "800",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0, lineHeight: "1.4" }}>
                      {action.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ChevronRight size={16} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer links */}
      <div style={{ display: "flex", gap: "20px", alignItems: "center", paddingTop: "12px", borderTop: "1px solid var(--border-color)" }}>
        <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>
          New to Tutor Match?
        </p>
        <Link
          to={TUTORIAL_PATHS.landing}
          style={{ fontSize: "12px", color: "var(--accent)", textDecoration: "none", fontWeight: "600" }}
        >
          View module info →
        </Link>
        <Link
          to={TUTORIAL_PATHS.studentLogin}
          style={{ fontSize: "12px", color: "var(--accent)", textDecoration: "none", fontWeight: "600" }}
        >
          Tutorials login →
        </Link>
      </div>
    </div>
  );
}

export default TutorialsHome;
