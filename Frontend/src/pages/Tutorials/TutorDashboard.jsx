import React, { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTutorProfile } from "@/services/api/tutorialsApi.js";
import { apiClient, tutorsApiClient } from "@/services/apiClient";
import { useWebSocket } from "@/hooks/useWebSocket";
import { Calendar, User, BookOpen, Inbox, MessageSquare, Activity, ChevronRight } from "lucide-react";
import { toast } from "sonner";

import {
  PageLayout,
  PremiumButton,
  ActivityFeed,
} from "@/components/dashboard/shared/Primitives";

const styles = {
  pageWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "32px",
  },
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
  sectionLabel: {
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "var(--text-muted)",
    marginBottom: "14px",
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
    overflow: "hidden",
  },
  cardHeader: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  iconBadge: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cardTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "var(--text-primary)",
    letterSpacing: "-0.01em",
  },
  cardSubtitle: {
    fontSize: "13px",
    color: "var(--text-muted)",
    lineHeight: "1.4",
    flexGrow: 1,
  },
};

function TutorActionCard({ title, description, icon: Icon, iconBg, iconColor, onClick, buttonText, badgeCount }) {
  return (
    <div
      style={styles.card}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
        e.currentTarget.style.borderColor = iconColor;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)";
        e.currentTarget.style.borderColor = "var(--border-color)";
      }}
    >
      <div style={styles.cardHeader}>
        <div style={{ ...styles.iconBadge, background: iconBg, color: iconColor, position: "relative" }}>
          <Icon size={20} />
          {badgeCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 h-4 min-w-[16px] px-1 flex items-center justify-center text-[9px] font-bold text-white bg-primary rounded-full animate-pulse shadow-sm">
              {badgeCount}
            </span>
          )}
        </div>
        <div>
          <h3 style={styles.cardTitle}>{title}</h3>
          <p style={styles.cardSubtitle}>{description}</p>
        </div>
      </div>
      <div style={{ marginTop: "auto", paddingTop: "8px" }}>
        <PremiumButton 
          variant={badgeCount > 0 ? "default" : "outline"} 
          size="sm" 
          className="w-full" 
          onClick={onClick}
        >
          {buttonText}
        </PremiumButton>
      </div>
    </div>
  );
}

function TutorDashboard() {
  const navigate = useNavigate();

  const { on, off } = useWebSocket();
  const [analytics, setAnalytics] = useState({ recentRequests: [], activityTimeline: [] });
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await apiClient.get("/api/analytics/tutor-dashboard");
      if (res.data?.success) {
        setAnalytics(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch tutor analytics", err);
    }
  }, []);

  const fetchUnread = useCallback(async () => {
    try {
      const { data } = await tutorsApiClient.get("/tutorial-chat/conversations");
      if (data?.success && data?.data) {
        const totalUnread = data.data.reduce((acc, chat) => {
          return acc + (chat.unreadCount || 0);
        }, 0);
        setUnreadCount(totalUnread);
      }
    } catch (err) {
      console.error("Failed to load chat unreads in tutor dashboard", err);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
    fetchUnread();
  }, [fetchAnalytics, fetchUnread]);

  useEffect(() => {
    const handler = () => {
      fetchAnalytics();
      fetchUnread();
    };
    on("dashboard_refresh", handler);
    return () => {
      if (off) off("dashboard_refresh", handler);
    };
  }, [on, off, fetchAnalytics, fetchUnread]);

  const activities = analytics.activityTimeline.map((item, i) => {
    let dotColor = "bg-[var(--neutral)]";
    let iconBg = "bg-[var(--neutral-bg)]";
    let iconColor = "text-[var(--neutral)]";
    let IconComponent = Activity;
    
    if (item.action?.includes("booking") || item.action?.includes("class")) {
      dotColor = "bg-indigo-500";
      iconBg = "bg-indigo-500/10";
      iconColor = "text-indigo-500";
      IconComponent = BookOpen;
    } else if (item.action?.includes("chat") || item.action?.includes("message")) {
      dotColor = "bg-pink-500";
      iconBg = "bg-pink-500/10";
      iconColor = "text-pink-500";
      IconComponent = MessageSquare;
    } else {
      dotColor = "bg-emerald-500";
      iconBg = "bg-emerald-500/10";
      iconColor = "text-emerald-500";
      IconComponent = User;
    }
    
    return {
      title: item.action || "Activity",
      desc: item.details || "New activity recorded",
      time: item.time ? new Date(item.time).toLocaleDateString() : "Recently",
      dotColor,
      iconBg,
      iconColor,
      icon: IconComponent
    };
  });

  return (
    <PageLayout className="pb-8">
      <div style={styles.pageWrapper}>
        
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <h1 style={styles.pageTitle}>Tutor Dashboard</h1>
            <p style={styles.pageSubtitle}>Manage your teaching schedule, students, and chat messages.</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }} className="lg:grid-cols-3">
          
          {/* Main Actions */}
          <div className="lg:col-span-2">
            <p style={styles.sectionLabel}>Quick Actions</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <TutorActionCard
                title="Availability"
                description="Set your working hours and days"
                icon={Calendar}
                iconBg="rgba(59,130,246,0.12)"
                iconColor="var(--primary)"
                onClick={() => navigate("/tutorials/tutor/availability")}
                buttonText="Set Availability"
              />
              <TutorActionCard
                title="Profile"
                description="View and update your public tutor profile"
                icon={User}
                iconBg="rgba(139,92,246,0.12)"
                iconColor="#8B5CF6"
                onClick={() => navigate("/tutorials/tutor/editProfile")}
                buttonText="View Profile"
              />
              <TutorActionCard
                title="Schedule"
                description="Check your upcoming classes and bookings"
                icon={BookOpen}
                iconBg="rgba(16,185,129,0.12)"
                iconColor="var(--success)"
                onClick={() => navigate("/tutorials/tutor/schedule")}
                buttonText="View Schedule"
              />
              <TutorActionCard
                title="Manage Requests"
                description="Accept or decline new student requests"
                icon={Inbox}
                iconBg="rgba(245,158,11,0.12)"
                iconColor="var(--warning)"
                onClick={() => navigate("/tutorials/tutor/accept")}
                buttonText="View All Requests"
              />
              <TutorActionCard
                title="Attendance Hub"
                description="Manage students, subjects, and attendance"
                icon={Activity}
                iconBg="rgba(99,102,241,0.12)"
                iconColor="#6366F1"
                onClick={() => navigate("/tutorials/attendance")}
                buttonText="Open Hub"
              />
              <TutorActionCard
                title="Chat / Messages"
                description="Chat with your students in real-time"
                icon={MessageSquare}
                iconBg="rgba(236,72,153,0.12)"
                iconColor="#EC4899"
                onClick={() => navigate("/tutorials/chat")}
                buttonText="Open Chat Room"
                badgeCount={unreadCount}
              />
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="lg:col-span-1">
            <p style={styles.sectionLabel}>Recent Activity</p>
            <div style={{ ...styles.card, padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={styles.cardTitle}>Timeline</h3>
                <span style={{ fontSize: "12px", color: "var(--text-muted)", cursor: "pointer" }} className="hover:text-primary transition-colors">
                  View All
                </span>
              </div>
              {activities.length > 0 ? (
                <ActivityFeed activities={activities.slice(0, 5)} />
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 0", gap: "12px" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Activity size={24} style={{ color: "var(--text-muted)" }} />
                  </div>
                  <p style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: "500" }}>No recent activity</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </PageLayout>
  );
}

export default TutorDashboard;

