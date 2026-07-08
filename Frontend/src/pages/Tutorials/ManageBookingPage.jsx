import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { getBookings } from "@/services/api/tutorialsApi.js";
import Navbar from "../../components/Tutorials/Navbar";
import { LayoutContext } from "@/components/layouts/DashboardLayout";
import {
  Calendar, Clock, BookOpen, MessageSquare,
  Video, XCircle, ChevronRight, GraduationCap,
  Loader2, Plus, CheckCircle, AlertCircle, Timer,
} from "lucide-react";

/* ══════════════════════════════════════════════════════
   Helpers
══════════════════════════════════════════════════════ */
const normalizeStatus = (status, date, time) => {
  if (!status) return "pending";
  const s = status.toLowerCase();
  if (s === "cancelled" || s === "canceled") return "cancelled";
  if (s === "completed" || s === "in_progress") return "completed";
  if (s === "missed") return "missed";
  
  if (["upcoming", "accepted", "pending", "booked"].includes(s)) {
    if (date && time) {
      const bookingDateTime = new Date(`${date}T${time}`);
      if (bookingDateTime < new Date()) {
        return "missed";
      }
    }
  }

  if (s === "upcoming" || s === "accepted") return "upcoming";
  // fallback: if date is future → upcoming, else completed
  if (date && new Date(date) >= new Date()) return "upcoming";
  return "pending";
};

const STATUS_CONFIG = {
  upcoming:  { label: "Upcoming",  color: "#3b82f6", bg: "rgba(59,130,246,0.1)",  border: "rgba(59,130,246,0.25)", icon: Timer },
  pending:   { label: "Pending",   color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)", icon: AlertCircle },
  completed: { label: "Completed", color: "#10b981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.25)", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "#ef4444", bg: "rgba(239,68,68,0.1)",  border: "rgba(239,68,68,0.2)",  icon: XCircle },
  missed:    { label: "Missed",    color: "#6b7280", bg: "rgba(107,114,128,0.1)", border: "rgba(107,114,128,0.25)", icon: AlertCircle },
};

const getInitials = (name = "") =>
  name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "T";

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short", month: "short", day: "numeric", year: "numeric",
    });
  } catch { return dateStr; }
};

/* ── Status Badge ── */
const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      padding: "3px 10px", borderRadius: "999px",
      background: cfg.bg, border: `1px solid ${cfg.border}`,
      fontSize: "11px", fontWeight: "700", color: cfg.color,
    }}>
      <Icon size={11} />
      {cfg.label}
    </span>
  );
};

/* ── Avatar ── */
const TutorAvatar = ({ name, color = "#3b82f6" }) => (
  <div style={{
    width: "52px", height: "52px", borderRadius: "14px",
    background: `linear-gradient(135deg, ${color}22, ${color}44)`,
    border: `1.5px solid ${color}33`,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "16px", fontWeight: "800", color, flexShrink: 0,
  }}>
    {getInitials(name)}
  </div>
);

/* ── Booking Card ── */
const BookingCard = ({ booking, onCancel, onMessage, onJoin }) => {
  const [hovered, setHovered] = useState(false);
  const status = normalizeStatus(booking.status, booking.date, booking.time);
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const canCancel  = ["upcoming", "pending"].includes(status);
  const canJoin    = (status === "upcoming" || booking.status === "in_progress") && booking.meetingLinkPublished && booking.meetingLink;
  const hasNoLink  = (status === "upcoming" || booking.status === "in_progress") && !booking.meetingLink;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--card-bg)",
        border: `1px solid ${hovered ? cfg.border : "var(--border-color)"}`,
        borderRadius: "16px",
        padding: "20px 22px",
        transition: "all 0.2s ease",
        transform: hovered ? "translateY(-1px)" : "translateY(0)",
        boxShadow: hovered ? `0 8px 24px ${cfg.color}12` : "var(--shadow-sm)",
      }}
    >
      {/* ── Card Top ── */}
      <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", marginBottom: "16px" }}>
        <TutorAvatar name={booking.tutorName} color={cfg.color} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", flexWrap: "wrap", marginBottom: "4px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>
              {booking.tutorName || "Tutor"}
            </h3>
            <StatusBadge status={status} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <BookOpen size={12} style={{ color: "var(--accent)", flexShrink: 0 }} />
            <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--accent)" }}>
              {booking.subject || "General"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Meta row ── */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: "10px",
        padding: "12px 14px", borderRadius: "10px",
        background: "var(--bg-secondary, rgba(0,0,0,0.03))",
        border: "1px solid var(--border-color)",
        marginBottom: "16px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <Calendar size={12} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
          <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: "500" }}>
            {formatDate(booking.date)}
          </span>
        </div>
        <div style={{ width: "1px", background: "var(--border-color)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <Clock size={12} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
          <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: "500" }}>
            {booking.time || "TBD"}
          </span>
        </div>
      </div>

      {/* ── Meeting link status ── */}
      {hasNoLink && status === "upcoming" && (
        <div style={{
          display: "flex", alignItems: "center", gap: "6px",
          padding: "8px 12px", borderRadius: "8px",
          background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.2)",
          marginBottom: "14px",
        }}>
          <AlertCircle size={12} style={{ color: "#f59e0b", flexShrink: 0 }} />
          <span style={{ fontSize: "11px", color: "#b45309", fontWeight: "600" }}>
            Waiting for tutor to publish meeting link
          </span>
        </div>
      )}

      {/* ── Actions ── */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {canJoin && (
          <button
            onClick={() => onJoin(booking)}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "0 16px", height: "36px", borderRadius: "10px",
              background: "linear-gradient(135deg, #10b981, #059669)",
              color: "#fff", border: "none", cursor: "pointer",
              fontSize: "12px", fontWeight: "700",
              boxShadow: "0 4px 12px rgba(16,185,129,0.25)",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <Video size={13} /> Join Session
          </button>
        )}

        {canCancel && (
          <button
            onClick={() => onMessage(booking.tutorId)}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "0 14px", height: "36px", borderRadius: "10px",
              background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)",
              color: "#3b82f6", cursor: "pointer",
              fontSize: "12px", fontWeight: "600", transition: "all 0.15s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(59,130,246,0.14)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(59,130,246,0.08)"; }}
          >
            <MessageSquare size={13} /> Message
          </button>
        )}

        {canCancel && (
          <button
            onClick={() => onCancel(booking._id)}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "0 14px", height: "36px", borderRadius: "10px",
              background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)",
              color: "#ef4444", cursor: "pointer",
              fontSize: "12px", fontWeight: "600", transition: "all 0.15s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.13)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.07)"; }}
          >
            <XCircle size={13} /> Cancel
          </button>
        )}
      </div>
    </div>
  );
};

/* ── Empty State ── */
const EmptyBookings = ({ onFind }) => (
  <div style={{
    textAlign: "center", padding: "56px 24px",
    background: "var(--card-bg)", border: "1px solid var(--border-color)",
    borderRadius: "20px",
  }}>
    <div style={{
      width: "72px", height: "72px", borderRadius: "20px",
      background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)",
      display: "flex", alignItems: "center", justifyContent: "center",
      margin: "0 auto 16px",
    }}>
      <GraduationCap size={32} style={{ color: "#3b82f6", opacity: 0.7 }} />
    </div>
    <h3 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-primary)", margin: "0 0 8px" }}>
      No bookings yet
    </h3>
    <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "0 0 24px", maxWidth: "300px", marginLeft: "auto", marginRight: "auto", lineHeight: "1.5" }}>
      Find a tutor and book your first session to get started.
    </p>
    <button
      onClick={onFind}
      style={{
        display: "inline-flex", alignItems: "center", gap: "7px",
        padding: "0 22px", height: "40px", borderRadius: "10px",
        background: "linear-gradient(135deg, #3b82f6, #6366f1)",
        color: "#fff", border: "none", cursor: "pointer",
        fontSize: "13px", fontWeight: "700",
        boxShadow: "0 4px 12px rgba(59,130,246,0.3)",
      }}
    >
      <Plus size={15} /> Find a Tutor
    </button>
  </div>
);

/* ══════════════════════════════════════════════════════
   Page
══════════════════════════════════════════════════════ */
function ManageBookingPage() {
  const isUnifiedLayout = useContext(LayoutContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const fetchedRef = useRef(false);

  // ── Fetch ──
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    (async () => {
      try {
        const list = await getBookings();
        const sorted = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setBookings(sorted);
      } catch {
        setBookings([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Cancel ──
  const cancelBooking = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await API.patch(`/booking/${id}/cancel`);
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: "Cancelled" } : b));
    } catch (err) {
      console.error(err);
      alert("Error cancelling booking ❌");
    }
  };

  // ── Join ──
  const joinSession = async (booking) => {
    if (booking.status === "upcoming") {
      try {
        await API.patch(`/booking/${booking._id}/status`, { status: "in_progress" });
        setBookings(prev => prev.map(b => b._id === booking._id ? { ...b, status: "in_progress" } : b));
      } catch (err) {
        console.error("Failed to update status:", err);
      }
    }
    window.open(booking.meetingLink, "_blank");
  };

  // ── Counts ──
  const upcomingCount  = bookings.filter(b => normalizeStatus(b.status, b.date, b.time) === "upcoming").length;
  const completedCount = bookings.filter(b => normalizeStatus(b.status, b.date, b.time) === "completed").length;
  const cancelledCount = bookings.filter(b => normalizeStatus(b.status, b.date, b.time) === "cancelled").length;
  const missedCount    = bookings.filter(b => normalizeStatus(b.status, b.date, b.time) === "missed").length;

  return (
    <>
      {!isUnifiedLayout && <Navbar />}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "4px 0 32px" }}>

        {/* ── Page Header ── */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: "800", color: "var(--text-primary)", margin: "0 0 4px", letterSpacing: "-0.02em" }}>
              My Bookings
            </h1>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0 }}>
              Manage your scheduled tutorial sessions
            </p>
          </div>
          <button
            onClick={() => navigate("/tutorials/find")}
            style={{
              display: "flex", alignItems: "center", gap: "7px",
              padding: "0 18px", height: "40px", borderRadius: "10px",
              background: "linear-gradient(135deg, #3b82f6, #6366f1)",
              color: "#fff", border: "none", cursor: "pointer",
              fontSize: "13px", fontWeight: "700",
              boxShadow: "0 4px 12px rgba(59,130,246,0.25)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <Plus size={15} /> Book New Session
          </button>
        </div>

        {/* ── Summary Row ── */}
        {!loading && bookings.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "24px" }}
            className="bookings-summary-grid">
            {[
              { label: "Upcoming",  count: upcomingCount,  color: "#3b82f6", bg: "rgba(59,130,246,0.08)",  border: "rgba(59,130,246,0.2)"  },
              { label: "Completed", count: completedCount, color: "#10b981", bg: "rgba(16,185,129,0.08)",  border: "rgba(16,185,129,0.2)"  },
              { label: "Cancelled", count: cancelledCount, color: "#ef4444", bg: "rgba(239,68,68,0.06)",   border: "rgba(239,68,68,0.15)"  },
              { label: "Missed",    count: missedCount,    color: "#6b7280", bg: "rgba(107,114,128,0.08)", border: "rgba(107,114,128,0.2)" },
            ].map(({ label, count, color, bg, border }) => (
              <div key={label} style={{
                background: "var(--card-bg)", border: "1px solid var(--border-color)",
                borderRadius: "12px", padding: "14px 18px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <p style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", margin: 0 }}>{label}</p>
                <span style={{
                  padding: "2px 10px", borderRadius: "999px",
                  background: bg, border: `1px solid ${border}`,
                  fontSize: "13px", fontWeight: "800", color,
                }}>{count}</span>
              </div>
            ))}
          </div>
        )}

        {/* ── Content ── */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{
                height: "160px", borderRadius: "16px",
                background: "var(--card-bg)", border: "1px solid var(--border-color)",
                animation: "pulse 1.5s ease-in-out infinite",
              }} />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <EmptyBookings onFind={() => navigate("/tutorials/find")} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {bookings.map(b => (
              <BookingCard
                key={b._id}
                booking={b}
                onCancel={cancelBooking}
                onMessage={tutorId => navigate(`/tutorials/chat?tutorId=${tutorId}`)}
                onJoin={joinSession}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @media (max-width: 500px) {
          .bookings-summary-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}

export default ManageBookingPage;
