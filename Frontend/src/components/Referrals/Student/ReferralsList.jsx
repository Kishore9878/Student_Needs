import { useNavigate } from 'react-router-dom';
import {
  Users, CheckCircle, Loader2, Building2, MapPin,
  Calendar, TrendingUp, Briefcase, GraduationCap, Lock,
} from 'lucide-react';

/**
 * ReferralsList Component
 * Displays a grid of referral opportunities posted by alumni (legacy job-object format).
 * @param {Object} props
 * @param {Array} props.jobs - Array of Job objects available for referral
 * @param {Object|null} props.student - Current logged-in student profile
 * @param {string|null} props.isApplying - ID of the job currently being processed
 * @param {Function} props.onApply - Async handler to trigger the referral application
 */
export function ReferralsList({ jobs, student, isApplying, onApply }) {
  const referralJobs = jobs || [];

  if (referralJobs.length === 0) {
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
          <Users size={32} style={{ color: "#6366f1", opacity: 0.8 }} />
        </div>
        <h3 style={{ fontSize: "18px", fontWeight: "800", color: "var(--text-primary)", margin: "0 0 8px", letterSpacing: "-0.01em" }}>
          No Referral Opportunities Yet
        </h3>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0, maxWidth: "300px", marginLeft: "auto", marginRight: "auto", lineHeight: "1.6" }}>
          Referral opportunities will appear here when alumni post them
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
      {referralJobs.map((job) => {
        const hasApplied = student?.appliedJobs?.includes(job.id);
        const canApply = student?.resumeStatus === 'verified';
        const referralCount = job.referred?.length || 0;
        const companyInitials = (job.company || "CO").slice(0, 2).toUpperCase();

        return (
          <div
            key={job.id}
            style={{
              background: "var(--card-bg)", border: "1px solid var(--border-color)",
              borderRadius: "16px", padding: "20px",
              display: "flex", flexDirection: "column",
              transition: "all 0.2s ease",
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
            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "14px" }}>
              <div style={{
                width: "46px", height: "46px", borderRadius: "12px",
                background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))",
                border: "1.5px solid rgba(99,102,241,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "14px", fontWeight: "800", color: "#6366f1", flexShrink: 0,
              }}>
                {companyInitials}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{
                  fontSize: "15px", fontWeight: "800", color: "var(--text-primary)",
                  margin: "0 0 3px", letterSpacing: "-0.01em",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {job.title}
                </h3>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "0 0 6px", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Building2 size={11} /> {job.company}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: "4px",
                    padding: "3px 9px", borderRadius: "999px",
                    background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)",
                    color: "#10b981", fontSize: "10px", fontWeight: "700",
                  }}>
                    <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
                    Referral Available
                  </span>
                  {referralCount > 0 && (
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: "4px",
                      padding: "3px 9px", borderRadius: "999px",
                      background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)",
                      color: "#6366f1", fontSize: "10px", fontWeight: "700",
                    }}>
                      <TrendingUp size={9} /> {referralCount} referred
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Meta info */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" }}>
              {job.location && (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: "4px",
                  padding: "3px 9px", borderRadius: "8px",
                  background: "rgba(0,0,0,0.04)", border: "1px solid var(--border-color)",
                  color: "var(--text-secondary)", fontSize: "10px", fontWeight: "600",
                }}>
                  <MapPin size={9} /> {job.location}
                </span>
              )}
              {job.type && (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: "4px",
                  padding: "3px 9px", borderRadius: "8px",
                  background: "rgba(0,0,0,0.04)", border: "1px solid var(--border-color)",
                  color: "var(--text-secondary)", fontSize: "10px", fontWeight: "600",
                }}>
                  <Briefcase size={9} /> {job.type}
                </span>
              )}
              {job.postedAt && (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: "4px",
                  padding: "3px 9px", borderRadius: "8px",
                  background: "rgba(0,0,0,0.04)", border: "1px solid var(--border-color)",
                  color: "var(--text-muted)", fontSize: "10px", fontWeight: "600",
                }}>
                  <Calendar size={9} /> {new Date(job.postedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              )}
            </div>

            {/* Description */}
            {job.description && (
              <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "0 0 14px", lineHeight: "1.6", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {job.description}
              </p>
            )}

            {/* Action */}
            <div style={{ marginTop: "auto", paddingTop: "14px", borderTop: "1px solid var(--border-color)" }}>
              {hasApplied ? (
                <div style={{
                  height: "38px", borderRadius: "10px",
                  background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                  color: "#10b981", fontSize: "13px", fontWeight: "700",
                }}>
                  <CheckCircle size={14} /> Applied
                </div>
              ) : (
                <>
                  <button
                    onClick={() => canApply ? onApply(job.id) : null}
                    disabled={!canApply || isApplying === job.id}
                    style={{
                      height: "38px", width: "100%", borderRadius: "10px",
                      background: canApply ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "rgba(0,0,0,0.05)",
                      border: canApply ? "none" : "1px solid var(--border-color)",
                      color: canApply ? "#fff" : "var(--text-muted)",
                      fontSize: "13px", fontWeight: "700",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                      cursor: canApply && !isApplying ? "pointer" : "not-allowed",
                      opacity: (!canApply || isApplying === job.id) ? 0.7 : 1,
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={e => { if (canApply && isApplying !== job.id) e.currentTarget.style.opacity = "0.9"; }}
                    onMouseLeave={e => { if (canApply && isApplying !== job.id) e.currentTarget.style.opacity = "1"; }}
                  >
                    {isApplying === job.id ? (
                      <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Applying...</>
                    ) : !canApply ? (
                      <><Lock size={13} /> Resume Not Verified</>
                    ) : (
                      <><GraduationCap size={13} /> Apply for Referral</>
                    )}
                  </button>
                  {!canApply && !hasApplied && (
                    <p style={{ fontSize: "10px", color: "#f59e0b", textAlign: "center", margin: "6px 0 0", fontWeight: "600" }}>
                      ⚠ Your resume must be verified to apply
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        );
      })}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}