import React from "react";
import { ArrowLeft, Download, Globe, Briefcase, GraduationCap } from "lucide-react";

export function ChatHeader({
  participant,
  currentRole,
  isOnline,
  onBack,
  onDownloadResume
}) {
  const initials = `${participant?.firstName?.[0] || ""}${participant?.lastName?.[0] || ""}`.toUpperCase();

  return (
    <div style={{
      height: "64px", padding: "0 16px",
      borderBottom: "1px solid var(--border-color)",
      background: "var(--card-bg)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      flexShrink: 0, gap: "12px",
    }}>
      {/* Left: back + avatar + info */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
        {/* Mobile back */}
        <button
          onClick={onBack}
          style={{
            width: "32px", height: "32px", borderRadius: "8px",
            background: "none", border: "1px solid var(--border-color)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "var(--text-muted)",
            flexShrink: 0,
          }}
          className="md:hidden"
          title="Back"
        >
          <ArrowLeft size={15} />
        </button>

        {/* Avatar */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "11px",
            background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.12))",
            border: "1.5px solid rgba(99,102,241,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "14px", fontWeight: "800", color: "#6366f1", overflow: "hidden",
          }}>
            {participant?.image ? (
              <img src={participant.image} alt={participant.firstName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          {isOnline && (
            <div style={{
              position: "absolute", bottom: "-1px", right: "-1px",
              width: "11px", height: "11px", borderRadius: "50%",
              background: "#10b981", border: "2px solid var(--card-bg)",
            }} />
          )}
        </div>

        {/* Info */}
        <div style={{ minWidth: 0 }}>
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-primary)", margin: "0 0 2px", letterSpacing: "-0.01em" }}>
            {participant?.firstName} {participant?.lastName}
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "3px",
              fontSize: "10px", fontWeight: "600", color: "#6366f1", opacity: 0.85,
            }}>
              {currentRole === "student" ? (
                <>
                  <Briefcase size={9} />
                  {participant?.company || "Alumni"}
                </>
              ) : (
                <>
                  <GraduationCap size={9} />
                  {participant?.branch || "Student"}
                </>
              )}
            </span>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "3px",
              fontSize: "10px", fontWeight: "600",
              color: isOnline ? "#10b981" : "var(--text-muted)",
            }}>
              <span style={{
                width: "5px", height: "5px", borderRadius: "50%",
                background: isOnline ? "#10b981" : "#6b7280",
                display: "inline-block",
              }} />
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>

      {/* Right: actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
        {currentRole === "alumni" ? (
          <>
            <button
              onClick={onDownloadResume}
              style={{
                display: "flex", alignItems: "center", gap: "5px",
                padding: "0 10px", height: "30px", borderRadius: "8px",
                background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.2)",
                color: "#6366f1", fontSize: "11px", fontWeight: "700",
                cursor: "pointer", transition: "all 0.15s ease",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,0.14)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(99,102,241,0.07)"}
            >
              <Download size={12} /> Resume
            </button>
            {participant?.githubUrl && (
              <a
                href={participant.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", gap: "5px",
                  padding: "0 10px", height: "30px", borderRadius: "8px",
                  background: "rgba(0,0,0,0.04)", border: "1px solid var(--border-color)",
                  color: "var(--text-secondary)", fontSize: "11px", fontWeight: "600",
                  textDecoration: "none", transition: "all 0.15s ease",
                }}
              >
                <Globe size={12} /> GitHub
              </a>
            )}
            {participant?.linkedinUrl && (
              <a
                href={participant.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", gap: "5px",
                  padding: "0 10px", height: "30px", borderRadius: "8px",
                  background: "rgba(0,0,0,0.04)", border: "1px solid var(--border-color)",
                  color: "var(--text-secondary)", fontSize: "11px", fontWeight: "600",
                  textDecoration: "none", transition: "all 0.15s ease",
                }}
              >
                <Globe size={12} /> LinkedIn
              </a>
            )}
          </>
        ) : (
          participant?.company && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "4px",
              padding: "0 10px", height: "28px", borderRadius: "8px",
              background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)",
              color: "#6366f1", fontSize: "11px", fontWeight: "700",
            }}>
              <Briefcase size={11} />
              {participant.company}
            </span>
          )
        )}
      </div>
    </div>
  );
}
