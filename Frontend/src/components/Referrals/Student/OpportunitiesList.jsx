import { Button } from "@/components/ui/button.jsx";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Users, CheckCircle, Loader2, Building2, Calendar,
  Briefcase, Target, Eye, MessageSquare, MapPin, Clock,
  GraduationCap, Star, ChevronRight, Zap,
} from 'lucide-react';

function SkillChip({ skill }) {
  return (
    <span style={{
      display: "inline-block", padding: "3px 10px", borderRadius: "999px",
      background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.18)",
      color: "#6366f1", fontSize: "10px", fontWeight: "700",
    }}>
      {skill}
    </span>
  );
}

function StatusPill({ isOpen }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "4px",
      padding: "3px 9px", borderRadius: "999px",
      background: isOpen ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.08)",
      border: `1px solid ${isOpen ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.2)"}`,
      color: isOpen ? "#10b981" : "#ef4444",
      fontSize: "10px", fontWeight: "700",
    }}>
      <span style={{
        width: "5px", height: "5px", borderRadius: "50%",
        background: isOpen ? "#10b981" : "#ef4444",
        display: "inline-block",
      }} />
      {isOpen ? "Open" : "Closed"}
    </span>
  );
}

function SlotsBadge({ referralsLeft }) {
  if (referralsLeft > 0) {
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", gap: "4px",
        padding: "3px 9px", borderRadius: "999px",
        background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)",
        color: "#6366f1", fontSize: "10px", fontWeight: "700",
      }}>
        <Zap size={9} /> {referralsLeft} slot{referralsLeft !== 1 ? "s" : ""} left
      </span>
    );
  }
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "4px",
      padding: "3px 9px", borderRadius: "999px",
      background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)",
      color: "#f59e0b", fontSize: "10px", fontWeight: "700",
    }}>
      Slots Full
    </span>
  );
}

function OpportunityCard({ opportunity, appliedOpportunities, isApplying, onApply, onViewDetails, canApply, isEligible, onChatClick }) {
  const hasApplied = appliedOpportunities.includes(opportunity._id);
  const referralsGiven = opportunity.referralsGiven || 0;
  const referralsLeft = (opportunity.numberOfReferrals || 0) - referralsGiven;
  const isOpen = opportunity.status === 'Open' || opportunity.isActive;
  const navigate = useNavigate();

  const companyInitials = (opportunity.postedBy?.company || "CO").slice(0, 2).toUpperCase();
  const recruiterInitials = `${opportunity.postedBy?.firstName?.[0] || ""}${opportunity.postedBy?.lastName?.[0] || ""}`.toUpperCase();

  return (
    <div
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border-color)",
        borderRadius: "16px",
        padding: "20px",
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
      {/* ── Header ── */}
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
            {opportunity.jobTitle}
          </h3>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "0 0 6px", display: "flex", alignItems: "center", gap: "4px" }}>
            <Building2 size={11} />
            {opportunity.postedBy?.company || "Company"}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
            <StatusPill isOpen={isOpen} />
            {referralsLeft >= 0 && <SlotsBadge referralsLeft={referralsLeft} />}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1 }}>
        {/* Meta info row */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "10px" }}>
          {opportunity.employmentType && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "4px",
              padding: "3px 9px", borderRadius: "8px",
              background: "rgba(0,0,0,0.04)", border: "1px solid var(--border-color)",
              color: "var(--text-secondary)", fontSize: "10px", fontWeight: "600",
            }}>
              <Briefcase size={9} /> {opportunity.employmentType}
            </span>
          )}
          {opportunity.experienceLevel && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "4px",
              padding: "3px 9px", borderRadius: "8px",
              background: "rgba(0,0,0,0.04)", border: "1px solid var(--border-color)",
              color: "var(--text-secondary)", fontSize: "10px", fontWeight: "600",
            }}>
              <Target size={9} /> {opportunity.experienceLevel}
            </span>
          )}
          {opportunity.location && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "4px",
              padding: "3px 9px", borderRadius: "8px",
              background: "rgba(0,0,0,0.04)", border: "1px solid var(--border-color)",
              color: "var(--text-secondary)", fontSize: "10px", fontWeight: "600",
            }}>
              <MapPin size={9} /> {opportunity.location}
            </span>
          )}
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "4px",
            padding: "3px 9px", borderRadius: "8px",
            background: "rgba(0,0,0,0.04)", border: "1px solid var(--border-color)",
            color: "var(--text-muted)", fontSize: "10px", fontWeight: "600",
          }}>
            <Clock size={9} /> {new Date(opportunity.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        </div>

        {/* Description */}
        {opportunity.roleDescription && (
          <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "0 0 10px", lineHeight: "1.6", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {opportunity.roleDescription}
          </p>
        )}

        {/* Skills */}
        {opportunity.requiredSkills?.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "14px" }}>
            {opportunity.requiredSkills.slice(0, 4).map((skill, i) => (
              <SkillChip key={i} skill={skill} />
            ))}
            {opportunity.requiredSkills.length > 4 && (
              <span style={{ fontSize: "10px", color: "var(--text-muted)", padding: "3px 8px", background: "var(--border-color)", borderRadius: "999px", fontWeight: "600" }}>
                +{opportunity.requiredSkills.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Recruiter Section */}
        {opportunity.postedBy && (
          <div style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "10px 12px", borderRadius: "10px",
            background: "rgba(0,0,0,0.03)", border: "1px solid var(--border-color)",
            marginBottom: "14px",
          }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "9px",
              background: "rgba(99,102,241,0.1)", border: "1.5px solid rgba(99,102,241,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "11px", fontWeight: "800", color: "#6366f1", overflow: "hidden", flexShrink: 0,
            }}>
              {opportunity.postedBy.image
                ? <img src={opportunity.postedBy.image} alt={opportunity.postedBy.firstName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span>{recruiterInitials}</span>
              }
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-primary)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {opportunity.postedBy.firstName} {opportunity.postedBy.lastName}
              </p>
              <p style={{ fontSize: "10px", color: "var(--text-muted)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {opportunity.postedBy.jobTitle || opportunity.postedBy.designation || "Alumni"} · {opportunity.postedBy.company}
              </p>
            </div>
            {opportunity.postedBy.yearsOfExperience != null && (
              <span style={{
                marginLeft: "auto", flexShrink: 0,
                display: "inline-flex", alignItems: "center", gap: "3px",
                fontSize: "10px", color: "#f59e0b", fontWeight: "700",
              }}>
                <Star size={10} fill="#f59e0b" /> {opportunity.postedBy.yearsOfExperience}y exp
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Footer Actions ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", paddingTop: "14px", borderTop: "1px solid var(--border-color)" }}>
        {/* Row 1: View Details + Chat */}
        <div style={{ display: "flex", gap: "6px" }}>
          <button
            onClick={() => onViewDetails(opportunity)}
            style={{
              flex: 1, height: "34px", borderRadius: "9px", cursor: "pointer",
              background: "rgba(0,0,0,0.04)", border: "1px solid var(--border-color)",
              color: "var(--text-secondary)", fontSize: "12px", fontWeight: "600",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "5px",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,0,0,0.07)"; e.currentTarget.style.color = "var(--text-primary)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(0,0,0,0.04)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
          >
            <Eye size={13} /> Details
          </button>
          {isEligible ? (
            <button
              onClick={() => onChatClick(opportunity.postedBy?._id)}
              style={{
                flex: 1, height: "34px", borderRadius: "9px", cursor: "pointer",
                background: "rgba(99,102,241,0.07)", border: "1.5px solid rgba(99,102,241,0.2)",
                color: "#6366f1", fontSize: "12px", fontWeight: "700",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "5px",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,0.14)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(99,102,241,0.07)"}
            >
              <MessageSquare size={13} /> Chat
            </button>
          ) : (
            <button
              onClick={() => onChatClick(opportunity.postedBy?._id)}
              style={{
                flex: 1, height: "34px", borderRadius: "9px", cursor: "pointer",
                background: "rgba(0,0,0,0.03)", border: "1px solid var(--border-color)",
                color: "var(--text-muted)", fontSize: "12px", fontWeight: "600",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "5px",
                opacity: 0.6,
              }}
            >
              🔒 Locked
            </button>
          )}
        </div>

        {/* Row 2: Apply / Applied / Not Available */}
        {hasApplied ? (
          <div style={{
            height: "36px", borderRadius: "10px",
            background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
            color: "#10b981", fontSize: "12px", fontWeight: "700",
          }}>
            <CheckCircle size={14} /> Applied
          </div>
        ) : referralsLeft === 0 || !isOpen ? (
          <div style={{
            height: "36px", borderRadius: "10px",
            background: "rgba(0,0,0,0.04)", border: "1px solid var(--border-color)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
            color: "var(--text-muted)", fontSize: "12px", fontWeight: "600",
          }}>
            <Users size={13} /> Not Available
          </div>
        ) : (
          <button
            onClick={() => navigate(`/student/interview?opportunityId=${opportunity._id}`)}
            disabled={!canApply || isApplying === opportunity._id}
            style={{
              height: "36px", width: "100%", borderRadius: "10px", cursor: canApply ? "pointer" : "not-allowed",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              border: "none", color: "#fff", fontSize: "12px", fontWeight: "700",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
              transition: "all 0.15s ease", opacity: canApply ? 1 : 0.6,
            }}
            onMouseEnter={e => { if (canApply) e.currentTarget.style.opacity = "0.9"; }}
            onMouseLeave={e => { if (canApply) e.currentTarget.style.opacity = "1"; }}
          >
            {isApplying === opportunity._id ? (
              <><Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> Applying...</>
            ) : (
              <><GraduationCap size={13} /> Start Interview</>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export function OpportunitiesList({
  opportunities = [],
  appliedOpportunities = [],
  loading,
  isApplying,
  onApply,
  onViewDetails,
  canApply = true,
  profileStatus
}) {
  const navigate = useNavigate();
  const isEligible = !profileStatus || profileStatus.completeness === 100;

  const handleChatClick = (alumniId) => {
    if (!isEligible) {
      toast.error("Complete the required eligibility criteria before messaging alumni.", {
        description: "Please complete your profile to 100% first.",
        duration: 4000
      });
      return;
    }
    navigate(`/student/chat?userId=${alumniId}`);
  };

  if (loading) {
    return (
      <div style={{
        background: "var(--card-bg)", border: "1px solid var(--border-color)",
        borderRadius: "16px", padding: "48px 24px", textAlign: "center",
      }}>
        <div style={{
          width: "40px", height: "40px", borderRadius: "50%",
          border: "3px solid var(--border-color)", borderTopColor: "#6366f1",
          animation: "spin 0.8s linear infinite", margin: "0 auto 16px",
        }} />
        <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", margin: "0 0 4px" }}>
          Loading Opportunities...
        </p>
        <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>Fetching from your college alumni network</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (opportunities.length === 0) {
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
          No Opportunities Found
        </h3>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "0 0 24px", maxWidth: "320px", marginLeft: "auto", marginRight: "auto", lineHeight: "1.6" }}>
          Referral opportunities from your college alumni will appear here. Check back later or refresh.
        </p>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => window.location.reload()}
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
            Refresh <ChevronRight size={13} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
        gap: "16px",
      }}>
        {opportunities.map((opportunity) => (
          <OpportunityCard
            key={opportunity._id}
            opportunity={opportunity}
            appliedOpportunities={appliedOpportunities}
            isApplying={isApplying}
            onApply={onApply}
            onViewDetails={onViewDetails}
            canApply={canApply}
            isEligible={isEligible}
            onChatClick={handleChatClick}
          />
        ))}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}