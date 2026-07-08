import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookPlus,
  CalendarCheck,
  BarChart3,
  Activity
} from "lucide-react";
import { TUTORIAL_PATHS } from "@/utils/tutorialRoutes";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";
import { PageLayout } from "@/components/dashboard/shared/Primitives";

const HUB_ACTIONS = [
  {
    title: "Manage Subjects",
    description: "Add and manage courses you teach (Java, Python, DSA, etc.)",
    to: TUTORIAL_PATHS.tutorManageSubjects,
    icon: BookPlus,
    color: "#6366F1", // Indigo
    bg: "rgba(99,102,241,0.12)"
  },
  {
    title: "Mark Online Attendance",
    description: "Select a subject and mark enrolled students present or absent for a session",
    to: TUTORIAL_PATHS.tutorMarkAttendance,
    icon: CalendarCheck,
    color: "var(--success)",
    bg: "rgba(16,185,129,0.12)"
  },
  {
    title: "Attendance Analytics",
    description: "View detailed attendance reports and student statistics",
    to: TUTORIAL_PATHS.tutorAttendanceAnalytics,
    icon: BarChart3,
    color: "#8B5CF6", // Purple
    bg: "rgba(139,92,246,0.12)"
  },
];

const styles = {
  pageWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "32px",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    paddingBottom: "28px",
    borderBottom: "1px solid var(--border-color)",
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
  card: {
    background: "var(--card-bg)",
    border: "1px solid var(--border-color)",
    borderRadius: "16px",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
    position: "relative",
    height: "100%",
  }
};

export default function AttendanceManagementHub() {
  const { user } = useAuth();
  const isTeacher = ["teacher", "tutor"].includes((user?.role || "").toLowerCase());

  return (
    <PageLayout className="pb-8">
      <div style={styles.pageWrapper}>
        
        {/* Header */}
        <div style={styles.header}>
          <Link
            to="/tutorials/tutor/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontSize: "13px",
              fontWeight: "600",
              color: "var(--text-muted)",
              textDecoration: "none",
              marginBottom: "8px",
            }}
            className="hover:text-primary transition-colors"
          >
            <ArrowLeft size={14} style={{ marginRight: "6px" }} />
            Back to Dashboard
          </Link>
          <h1 style={styles.pageTitle}>Attendance Management</h1>
          <p style={styles.pageSubtitle}>
            Mark attendance for students enrolled through your online tutorial bookings
          </p>
        </div>

        {!isTeacher ? (
          <div style={{ ...styles.card, padding: "48px 24px", alignItems: "center", justifyContent: "center", textAlign: "center", borderColor: "rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.05)" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "var(--danger)", marginBottom: "8px" }}>Access Denied</h3>
            <p style={{ fontSize: "14px", color: "var(--danger)", maxWidth: "300px", opacity: 0.9 }}>
              Attendance Management is for teachers. Contact your administrator.
            </p>
            <Link
              to="/tutorials/home"
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                padding: "0 16px", height: "36px", fontSize: "13px", fontWeight: "600",
                borderRadius: "8px", background: "var(--bg-secondary)", color: "var(--text-primary)",
                border: "1px solid var(--border-color)", marginTop: "24px", textDecoration: "none"
              }}
              className="hover:bg-[var(--bg-secondary)]/80"
            >
              Back to Tutorials
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {HUB_ACTIONS.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link key={index} to={action.to} style={{ textDecoration: "none" }} className="group outline-none block h-full">
                  <div
                    style={styles.card}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
                      e.currentTarget.style.borderColor = action.color;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)";
                      e.currentTarget.style.borderColor = "var(--border-color)";
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
                      <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: action.bg, color: action.color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                        <Icon size={20} />
                      </div>
                      <h3 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "8px" }}>
                        {action.title}
                      </h3>
                      <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.5" }}>
                        {action.description}
                      </p>
                    </div>
                    
                    <div style={{ display: "flex", alignItems: "center", fontSize: "13px", fontWeight: "600", color: "var(--primary)", marginTop: "auto", paddingTop: "16px", borderTop: "1px solid var(--border-color)" }}>
                      Open Module <ArrowRight size={14} style={{ marginLeft: "4px" }} className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </PageLayout>
  );
}

