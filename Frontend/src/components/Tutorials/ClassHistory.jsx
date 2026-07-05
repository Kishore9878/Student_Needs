import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";
import ReviewModal from "./ReviewModal";
import { getBookings } from "@/services/api/tutorialsApi.js";
import {
  Calendar, Clock, BookOpen, Star, History,
  Plus, CheckCircle, MessageSquare, GraduationCap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ── Status badge ── */
const CompletedBadge = () => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: "4px",
    padding: "3px 10px", borderRadius: "999px",
    background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)",
    fontSize: "11px", fontWeight: "700", color: "#10b981",
  }}>
    <CheckCircle size={11} /> Completed
  </span>
);

/* ── Initials avatar ── */
const TutorAvatar = ({ name }) => {
  const initials = (name || "T")
    .split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  return (
    <div style={{
      width: "44px", height: "44px", borderRadius: "12px",
      background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))",
      border: "1.5px solid rgba(99,102,241,0.25)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "14px", fontWeight: "800", color: "#6366f1", flexShrink: 0,
    }}>
      {initials}
    </div>
  );
};

/* ── Format date ── */
const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short", month: "short", day: "numeric", year: "numeric",
    });
  } catch { return dateStr; }
};

/* ── History card ── */
const HistoryCard = ({ item, onReview, navigate }) => {
  const [hovered, setHovered] = useState(false);
  const tutorName = item.tutorName || item.tutor || "Tutor";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--card-bg)",
        border: `1px solid ${hovered ? "rgba(99,102,241,0.3)" : "var(--border-color)"}`,
        borderRadius: "16px",
        padding: "18px 20px",
        transition: "all 0.2s ease",
        transform: hovered ? "translateY(-1px)" : "translateY(0)",
        boxShadow: hovered ? "0 6px 20px rgba(99,102,241,0.08)" : "var(--shadow-sm)",
      }}
    >
      <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
        <TutorAvatar name={tutorName} />

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Row 1: name + badge */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>
              {tutorName}
            </h3>
            <CompletedBadge />
          </div>

          {/* Subject */}
          <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "10px" }}>
            <BookOpen size={12} style={{ color: "var(--accent)", flexShrink: 0 }} />
            <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--accent)" }}>
              {item.subject || "General"}
            </span>
          </div>

          {/* Meta */}
          <div style={{
            display: "flex", flexWrap: "wrap", gap: "10px",
            padding: "10px 12px", borderRadius: "10px",
            background: "var(--bg-secondary, rgba(0,0,0,0.03))",
            border: "1px solid var(--border-color)",
            marginBottom: "14px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <Calendar size={11} style={{ color: "var(--text-muted)" }} />
              <span style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: "500" }}>
                {formatDate(item.date)}
              </span>
            </div>
            {item.time && (
              <>
                <div style={{ width: "1px", background: "var(--border-color)" }} />
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <Clock size={11} style={{ color: "var(--text-muted)" }} />
                  <span style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: "500" }}>
                    {item.time}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button
              onClick={() => onReview(item)}
              style={{
                display: "flex", alignItems: "center", gap: "5px",
                padding: "0 13px", height: "32px", borderRadius: "8px",
                background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)",
                color: "#b45309", fontSize: "11px", fontWeight: "700",
                cursor: "pointer", transition: "all 0.15s ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(245,158,11,0.15)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(245,158,11,0.08)"; }}
            >
              <Star size={11} /> Rate & Review
            </button>
            {item.tutorId && (
              <button
                onClick={() => navigate(`/tutorials/chat?tutorId=${item.tutorId}`)}
                style={{
                  display: "flex", alignItems: "center", gap: "5px",
                  padding: "0 13px", height: "32px", borderRadius: "8px",
                  background: "rgba(59,130,246,0.07)", border: "1px solid rgba(59,130,246,0.2)",
                  color: "#3b82f6", fontSize: "11px", fontWeight: "600",
                  cursor: "pointer", transition: "all 0.15s ease",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(59,130,246,0.13)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(59,130,246,0.07)"; }}
              >
                <MessageSquare size={11} /> Message
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   Main Component
══════════════════════════════════════════════════════ */
function ClassHistory() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currTutor, setCurrTutor] = useState({ tutorName: "", subject: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.user) { setLoading(false); return; }

    (async () => {
      try {
        setLoading(true);
        // ✅ Use the same booking endpoint as ManageBookingPage
        const list = await getBookings();

        // ✅ Filter: completed OR in_progress (case-insensitive for robustness)
        const completed = list.filter(b => {
          const s = (b.status || "").toLowerCase();
          return s === "completed" || s === "in_progress";
        });

        // Sort: most recent first
        completed.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setHistory(completed);
      } catch (err) {
        console.error("ClassHistory fetch error:", err);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [auth.user]);

  return (
    <div style={{ width: "100%", maxWidth: "900px", margin: "0 auto", padding: "4px 0 24px" }} role="main">

      {/* ── Page Header ── */}
      <div style={{
        display: "flex", alignItems: "flex-start", justifyContent: "space-between",
        marginBottom: "24px", flexWrap: "wrap", gap: "12px",
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "10px",
              background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <History size={18} style={{ color: "#10b981" }} />
            </div>
            <h1 style={{ fontSize: "22px", fontWeight: "800", color: "var(--text-primary)", margin: 0, letterSpacing: "-0.02em" }}>
              Class History
            </h1>
          </div>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0, paddingLeft: "46px" }}>
            {loading ? "Loading sessions…" : history.length > 0
              ? `${history.length} completed session${history.length !== 1 ? "s" : ""}`
              : "Completed sessions will appear here"}
          </p>
        </div>

        <button
          onClick={() => navigate("/tutorials/find")}
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "0 16px", height: "38px", borderRadius: "10px",
            background: "var(--accent)", color: "#fff",
            border: "none", cursor: "pointer",
            fontSize: "12px", fontWeight: "700",
            boxShadow: "0 4px 12px rgba(59,130,246,0.25)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
        >
          <Plus size={14} /> Book New Session
        </button>
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              height: "120px", borderRadius: "16px",
              background: "var(--card-bg)", border: "1px solid var(--border-color)",
              animation: "pulse 1.5s ease-in-out infinite",
            }} />
          ))}
        </div>
      ) : history.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "60px 24px",
          background: "var(--card-bg)", border: "1px solid var(--border-color)",
          borderRadius: "16px",
        }}>
          <div style={{
            width: "72px", height: "72px", borderRadius: "20px",
            background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
          }}>
            <GraduationCap size={32} style={{ color: "#10b981", opacity: 0.7 }} />
          </div>
          <h2 style={{ fontSize: "18px", fontWeight: "800", color: "var(--text-primary)", margin: "0 0 8px" }}>
            No completed sessions yet
          </h2>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "0 0 20px", lineHeight: "1.5", maxWidth: "300px", marginLeft: "auto", marginRight: "auto" }}>
            Completed tutorial sessions will appear here. Book a session and mark it complete to see your history.
          </p>
          <button
            onClick={() => navigate("/tutorials/find")}
            style={{
              padding: "0 20px", height: "40px", borderRadius: "10px",
              background: "var(--accent)", color: "#fff", border: "none",
              cursor: "pointer", fontSize: "13px", fontWeight: "700",
              boxShadow: "0 4px 12px rgba(59,130,246,0.25)",
            }}
          >
            Find a Tutor
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {history.map((item, idx) => (
            <HistoryCard
              key={item._id || idx}
              item={item}
              navigate={navigate}
              onReview={(i) => { setCurrTutor(i); setModalOpen(true); }}
            />
          ))}
        </div>
      )}

      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>

      {modalOpen && (
        <ReviewModal
          handleModal={() => setModalOpen(false)}
          currTutor={currTutor}
        />
      )}
    </div>
  );
}

export default ClassHistory;
