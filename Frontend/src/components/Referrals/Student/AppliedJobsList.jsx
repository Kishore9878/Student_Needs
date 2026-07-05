import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase, Calendar, Building2, User, MessageSquare,
  CheckCircle, Clock, XCircle, TrendingUp, Award, ChevronRight,
  ClipboardList, Loader2
} from "lucide-react";

/* ── Status configuration ── */
const STATUS_CONFIG = {
  pending: { label: "Pending Review", color: "#f59e0b", bg: "rgba(245,158,11,0.10)", icon: Clock },
  shortlisted: { label: "Shortlisted", color: "#3b82f6", bg: "rgba(59,130,246,0.10)", icon: TrendingUp },
  interview: { label: "Interview Scheduled", color: "#8b5cf6", bg: "rgba(139,92,246,0.10)", icon: Award },
  selected: { label: "Selected 🎉", color: "#10b981", bg: "rgba(16,185,129,0.10)", icon: CheckCircle },
  rejected: { label: "Not Selected", color: "#ef4444", bg: "rgba(239,68,68,0.10)", icon: XCircle },
};

function StatusBadgePill({ status = "pending" }) {
  const key = status.toLowerCase();
  const cfg = STATUS_CONFIG[key] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      padding: "4px 10px", borderRadius: "999px",
      background: cfg.bg, border: `1px solid ${cfg.color}33`,
      color: cfg.color, fontSize: "11px", fontWeight: "700",
      whiteSpace: "nowrap",
    }}>
      <Icon size={11} />
      {cfg.label}
    </span>
  );
}

function StageSteps({ stage = "applied" }) {
  const stages = ["applied", "shortlisted", "interview", "offered"];
  const currentIdx = stages.indexOf(stage.toLowerCase());
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      {stages.map((s, i) => {
        const done = i <= currentIdx;
        return (
          <React.Fragment key={s}>
            <div style={{
              width: "22px", height: "22px", borderRadius: "50%",
              background: done ? "#6366f1" : "var(--border-color)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, transition: "all 0.2s ease",
            }}>
              {done ? (
                <CheckCircle size={11} style={{ color: "#fff" }} />
              ) : (
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--text-muted)", display: "block" }} />
              )}
            </div>
            {i < stages.length - 1 && (
              <div style={{
                flex: 1, height: "2px", borderRadius: "1px",
                background: i < currentIdx ? "#6366f1" : "var(--border-color)",
                minWidth: "16px", maxWidth: "32px",
                transition: "all 0.2s ease",
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function ApplicationCard({ app, onChat }) {
  const company = app.opportunity?.postedBy?.company || app.alumni?.company || "Unknown Company";
  const role = app.opportunity?.jobTitle || "Role Specified";
  const recruiterName = `${app.opportunity?.postedBy?.firstName || ""} ${app.opportunity?.postedBy?.lastName || ""}`.trim() || "Alumni";
  const recruiterImage = app.opportunity?.postedBy?.image;
  const recruiterInitials = `${app.opportunity?.postedBy?.firstName?.[0] || ""}${app.opportunity?.postedBy?.lastName?.[0] || ""}`.toUpperCase() || "A";
  const appliedDate = app.createdAt ? new Date(app.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "N/A";
  const stage = app.stage || app.interviewStage || "applied";
  const status = app.status || "pending";
  const companyInitials = company.slice(0, 2).toUpperCase();

  return (
    <div style={{
      background: "var(--card-bg)",
      border: "1px solid var(--border-color)",
      borderRadius: "16px",
      padding: "20px",
      transition: "all 0.2s ease",
      position: "relative",
      overflow: "hidden",
    }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.07)";
        e.currentTarget.style.borderColor = "rgba(99,102,241,0.25)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = "var(--border-color)";
        e.currentTarget.style.transform = "none";
      }}
    >
      {/* Top: company logo + info + status */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: "16px" }}>
        {/* Company Logo/Avatar */}
        <div style={{
          width: "48px", height: "48px", borderRadius: "12px",
          background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))",
          border: "1.5px solid rgba(99,102,241,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "16px", fontWeight: "800", color: "#6366f1",
          flexShrink: 0,
        }}>
          {companyInitials}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            fontSize: "15px", fontWeight: "800", color: "var(--text-primary)",
            margin: "0 0 3px", letterSpacing: "-0.01em",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {role}
          </h3>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "0 0 8px", display: "flex", alignItems: "center", gap: "5px" }}>
            <Building2 size={11} /> {company}
          </p>
          <StatusBadgePill status={status} />
        </div>

        {/* Applied Date */}
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <p style={{ fontSize: "10px", color: "var(--text-muted)", margin: "0 0 2px" }}>Applied</p>
          <p style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-primary)", margin: 0 }}>
            {appliedDate}
          </p>
        </div>
      </div>

      {/* Interview Stage Progress */}
      <div style={{
        background: "rgba(0,0,0,0.03)", border: "1px solid var(--border-color)",
        borderRadius: "10px", padding: "12px 14px", marginBottom: "14px",
      }}>
        <p style={{ fontSize: "10px", fontWeight: "700", color: "var(--text-muted)", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Application Progress
        </p>
        <StageSteps stage={stage} />
        <p style={{ fontSize: "10px", color: "#6366f1", fontWeight: "600", margin: "6px 0 0", textTransform: "capitalize" }}>
          Current: {stage.replace(/-/g, " ")}
        </p>
      </div>

      {/* Recruiter + Actions */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
        {/* Recruiter */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            width: "28px", height: "28px", borderRadius: "50%",
            background: "rgba(99,102,241,0.1)",
            border: "1px solid rgba(99,102,241,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "10px", fontWeight: "800", color: "#6366f1", overflow: "hidden",
          }}>
            {recruiterImage
              ? <img src={recruiterImage} alt={recruiterName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <span>{recruiterInitials}</span>
            }
          </div>
          <div>
            <p style={{ fontSize: "10px", color: "var(--text-muted)", margin: 0 }}>Recruiter</p>
            <p style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>{recruiterName}</p>
          </div>
        </div>

        {/* Chat button */}
        {app.chatId && (
          <button
            onClick={() => onChat(app.chatId)}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "0 14px", height: "34px", borderRadius: "10px",
              background: "rgba(99,102,241,0.07)", border: "1.5px solid rgba(99,102,241,0.2)",
              color: "#6366f1", fontSize: "12px", fontWeight: "700",
              cursor: "pointer", transition: "all 0.15s ease",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,0.14)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(99,102,241,0.07)"}
          >
            <MessageSquare size={13} /> Message
          </button>
        )}
      </div>
    </div>
  );
}

export function AppliedJobsList({ applications = [], loading }) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div style={{
        background: "var(--card-bg)", border: "1px solid var(--border-color)",
        borderRadius: "16px", padding: "48px 24px", textAlign: "center",
      }}>
        <Loader2 size={32} style={{ color: "#6366f1", margin: "0 auto 12px", animation: "spin 1s linear infinite" }} />
        <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", margin: "0 0 4px" }}>
          Loading Applications...
        </p>
        <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>Fetching your referral applications</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div style={{
        background: "var(--card-bg)", border: "1px solid var(--border-color)",
        borderRadius: "16px", padding: "64px 32px", textAlign: "center",
      }}>
        <div style={{
          width: "72px", height: "72px", borderRadius: "20px",
          background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.1))",
          border: "1.5px solid rgba(99,102,241,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px",
        }}>
          <ClipboardList size={32} style={{ color: "#6366f1", opacity: 0.8 }} />
        </div>
        <h3 style={{ fontSize: "18px", fontWeight: "800", color: "var(--text-primary)", margin: "0 0 8px", letterSpacing: "-0.01em" }}>
          No Applications Yet
        </h3>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "0 0 24px", maxWidth: "320px", marginLeft: "auto", marginRight: "auto", lineHeight: "1.6" }}>
          You haven't applied to any referral opportunities. Browse available openings and connect with alumni.
        </p>
        <button
          onClick={() => navigate("/referrals/browse-referrals")}
          style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "0 20px", height: "40px", borderRadius: "12px",
            background: "rgba(99,102,241,0.08)", border: "1.5px solid rgba(99,102,241,0.25)",
            color: "#6366f1", fontSize: "13px", fontWeight: "700",
            cursor: "pointer", transition: "all 0.15s ease",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,0.14)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(99,102,241,0.08)"}
        >
          <Briefcase size={14} /> Browse Referrals <ChevronRight size={13} />
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "16px" }}>
      {applications.map((app, i) => (
        <ApplicationCard
          key={app._id || i}
          app={app}
          onChat={(chatId) => navigate(`/referrals/chat?chatId=${chatId}`)}
        />
      ))}
    </div>
  );
}