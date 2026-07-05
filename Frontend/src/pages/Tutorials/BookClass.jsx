import React, { useContext, useEffect, useState, useRef } from "react";
import Navbar from "../../components/Tutorials/Navbar";
import { LayoutContext } from "@/components/layouts/DashboardLayout";
import TutorInfo from "../../components/Tutorials/TutorInfo";
import { useNavigate, useSearchParams } from "react-router-dom";
import BookModal from "../../components/Tutorials/BookModal";
import { dateHelper } from "../../utils/Tutorials/bookDates";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";
import API, { getTutorAvailability, BASE_URL } from "@/services/api/tutorialsApi.js";
import {
  Search, Sparkles, Users, BookOpen, Star, Zap,
  GraduationCap, ChevronLeft, ChevronRight,
  MessageSquare, Eye, Calendar, MapPin, Briefcase,
  AlertCircle, X, Loader2, DollarSign,
} from "lucide-react";
import defaultAvatar from "../../assets/images/bulb2.png";

// ── Design tokens ──────────────────────────────────────
const POPULAR_SUBJECTS = [
  "Mathematics", "Physics", "Chemistry", "English",
  "Biology", "Computer Science", "DBMS", "AI", "Python",
  "Java", "Data Structures", "Calculus", "Statistics",
];

const STATS = [
  { icon: Users, value: "500+", label: "Expert Tutors" },
  { icon: BookOpen, value: "120+", label: "Subjects" },
  { icon: Star, value: "4.9★", label: "Avg Rating" },
  { icon: Zap, value: "2hr", label: "Avg Response" },
];

// ── Star renderer ───────────────────────────────────────
const StarRow = ({ count }) => (
  <div style={{ display: "flex", gap: "2px" }}>
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        size={13}
        style={{
          color: i <= count ? "#f59e0b" : "var(--border-color)",
          fill: i <= count ? "#f59e0b" : "none",
        }}
      />
    ))}
  </div>
);

// ── Modern Tutor Result Card ───────────────────────────
const TutorCard = ({ tutor, onViewProfile, onMessage }) => {
  const tutorName =
    tutor.name ||
    `${tutor.first_name || tutor.fName || ""} ${tutor.last_name || tutor.lName || ""}`.trim() ||
    "Unknown Tutor";

  const initials = tutorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const subjects = Array.isArray(tutor.subjects)
    ? tutor.subjects.slice(0, 3)
    : tutor.expertise
    ? [tutor.expertise]
    : [];

  const skills = Array.isArray(tutor.skills) ? tutor.skills.slice(0, 4) : [];
  const stars = tutor.stars || tutor.rating || 0;
  const ratings = tutor.numRatings || tutor.num_of_ratings || tutor.numRatings || 0;
  const experience = tutor.experience || null;
  const location = tutor.location || null;
  const bio = tutor.bio || null;
  const hourlyRate = tutor.hourlyRate || null;
  const availableDays = Array.isArray(tutor.availableDays)
    ? tutor.availableDays.slice(0, 3).join(", ")
    : null;

  const picSrc = tutor.profilePic || tutor.pic || tutor.image
    ? (tutor.profilePic || tutor.pic || tutor.image).startsWith("http")
      ? (tutor.profilePic || tutor.pic || tutor.image)
      : `${BASE_URL}/uploads/${tutor.profilePic || tutor.pic || tutor.image}`
    : null;

  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        background: "var(--card-bg)",
        border: `1px solid ${hovered ? "rgba(59,130,246,0.35)" : "var(--border-color)"}`,
        borderRadius: "16px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        transition: "all 0.2s ease",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 8px 24px rgba(59,130,246,0.1)"
          : "var(--shadow-sm)",
        cursor: "pointer",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onViewProfile(tutor)}
    >
      {/* ── Header: Avatar + Name + Stars ── */}
      <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
        {/* Avatar */}
        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "14px",
            overflow: "hidden",
            flexShrink: 0,
            border: "2px solid var(--border-color)",
          }}
        >
          {picSrc && !imgError ? (
            <img
              src={picSrc}
              alt={tutorName}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                fontWeight: "800",
                color: "#fff",
              }}
            >
              {initials}
            </div>
          )}
        </div>

        {/* Name + stars + meta */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              fontSize: "15px",
              fontWeight: "700",
              color: "var(--text-primary)",
              margin: "0 0 3px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {tutorName}
          </h3>

          {/* Stars */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
            <StarRow count={stars} />
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              {stars > 0 ? `${stars}.0` : "—"} ({ratings})
            </span>
          </div>

          {/* Meta pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {experience && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "3px",
                  fontSize: "10px",
                  fontWeight: "600",
                  color: "var(--text-muted)",
                  background: "var(--bg-secondary, rgba(0,0,0,0.04))",
                  padding: "2px 7px",
                  borderRadius: "6px",
                }}
              >
                <Briefcase size={9} /> {experience}
              </span>
            )}
            {location && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "3px",
                  fontSize: "10px",
                  fontWeight: "600",
                  color: "var(--text-muted)",
                  background: "var(--bg-secondary, rgba(0,0,0,0.04))",
                  padding: "2px 7px",
                  borderRadius: "6px",
                }}
              >
                <MapPin size={9} /> {location}
              </span>
            )}
            {hourlyRate && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "3px",
                  fontSize: "10px",
                  fontWeight: "700",
                  color: "#10b981",
                  background: "rgba(16,185,129,0.08)",
                  padding: "2px 7px",
                  borderRadius: "6px",
                }}
              >
                <DollarSign size={9} /> ₹{hourlyRate}/hr
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Bio ── */}
      {bio && (
        <p
          style={{
            fontSize: "12px",
            color: "var(--text-secondary)",
            lineHeight: "1.5",
            margin: 0,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {bio}
        </p>
      )}

      {/* ── Subject chips ── */}
      {subjects.length > 0 && (
        <div>
          <p
            style={{
              fontSize: "10px",
              fontWeight: "700",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              margin: "0 0 6px",
            }}
          >
            Subjects
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
            {subjects.map((s) => (
              <span
                key={s}
                style={{
                  padding: "3px 9px",
                  borderRadius: "999px",
                  background: "rgba(59,130,246,0.08)",
                  border: "1px solid rgba(59,130,246,0.18)",
                  fontSize: "11px",
                  fontWeight: "600",
                  color: "#3b82f6",
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Skills ── */}
      {skills.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
          {skills.map((sk) => (
            <span
              key={sk}
              style={{
                padding: "2px 8px",
                borderRadius: "6px",
                background: "var(--bg-secondary, rgba(0,0,0,0.04))",
                border: "1px solid var(--border-color)",
                fontSize: "10px",
                fontWeight: "600",
                color: "var(--text-secondary)",
              }}
            >
              {sk}
            </span>
          ))}
        </div>
      )}

      {/* ── Availability ── */}
      {availableDays && (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Calendar size={12} style={{ color: "#10b981", flexShrink: 0 }} />
          <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
            Available: {availableDays}
          </span>
        </div>
      )}

      {/* ── Action Buttons ── */}
      <div
        style={{ display: "flex", gap: "8px", marginTop: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => onViewProfile(tutor)}
          style={{
            flex: 1,
            height: "36px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #3b82f6, #6366f1)",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "700",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
        >
          <Eye size={13} /> View Profile
        </button>
        <button
          onClick={() => onMessage(tutor._id)}
          style={{
            height: "36px",
            padding: "0 14px",
            borderRadius: "10px",
            background: "var(--card-bg)",
            color: "var(--text-secondary)",
            border: "1px solid var(--border-color)",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--accent)";
            e.currentTarget.style.color = "var(--accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border-color)";
            e.currentTarget.style.color = "var(--text-secondary)";
          }}
        >
          <MessageSquare size={13} /> Message
        </button>
      </div>
    </div>
  );
};

// ── Empty State ────────────────────────────────────────
const EmptyState = ({ query }) => (
  <div
    style={{
      textAlign: "center",
      padding: "48px 24px",
      background: "var(--card-bg)",
      border: "1px solid var(--border-color)",
      borderRadius: "16px",
      gridColumn: "1 / -1",
    }}
  >
    <div
      style={{
        width: "64px",
        height: "64px",
        borderRadius: "18px",
        background: "rgba(245,158,11,0.08)",
        border: "1px solid rgba(245,158,11,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 14px",
      }}
    >
      <AlertCircle size={28} style={{ color: "#f59e0b", opacity: 0.7 }} />
    </div>
    <p
      style={{
        fontSize: "16px",
        fontWeight: "700",
        color: "var(--text-primary)",
        margin: "0 0 6px",
      }}
    >
      No tutors found{query ? ` for "${query}"` : ""}
    </p>
    <p
      style={{
        fontSize: "13px",
        color: "var(--text-muted)",
        margin: 0,
        lineHeight: "1.5",
      }}
    >
      Try a different subject or keyword. You can also browse by clicking a popular subject below.
    </p>
  </div>
);

// ── Loading Skeleton ────────────────────────────────────
const CardSkeleton = () => (
  <div
    style={{
      background: "var(--card-bg)",
      border: "1px solid var(--border-color)",
      borderRadius: "16px",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      animation: "pulse 1.5s ease-in-out infinite",
    }}
  >
    <div style={{ display: "flex", gap: "12px" }}>
      <div
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "14px",
          background: "var(--border-color)",
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px", paddingTop: "4px" }}>
        <div style={{ height: "14px", background: "var(--border-color)", borderRadius: "6px", width: "60%" }} />
        <div style={{ height: "10px", background: "var(--border-color)", borderRadius: "6px", width: "40%" }} />
      </div>
    </div>
    <div style={{ height: "10px", background: "var(--border-color)", borderRadius: "6px" }} />
    <div style={{ height: "10px", background: "var(--border-color)", borderRadius: "6px", width: "80%" }} />
    <div style={{ display: "flex", gap: "6px" }}>
      {[1, 2, 3].map((i) => (
        <div key={i} style={{ height: "22px", width: "60px", background: "var(--border-color)", borderRadius: "999px" }} />
      ))}
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════
//  Main BookClass page — single-page search experience
// ═══════════════════════════════════════════════════════
function BookClass() {
  const isUnifiedLayout = useContext(LayoutContext);
  const { user, isAuthenticated, isLoading, isInitialized } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams("");

  // ── Search state ──
  const [searchword, setSearchword] = useState("");
  const [activeQuery, setActiveQuery] = useState("");   // committed query (after Search click)
  const [searchData, setSearchData] = useState([]);
  const [searchSize, setSearchSize] = useState(0);
  const [page, setPage] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const resultsRef = useRef(null);

  // ── Tutor detail state ──
  const [tutorProfile, setTutorProfile] = useState(null);   // null = show list
  const [availability, setAvailability] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [bookDates, setBookDates] = useState(dateHelper(4));
  const [bookClassMap, setBookClassMap] = useState(new Map());

  // ── URL-param driven search (from topbar search bar) ──
  useEffect(() => {
    const q = searchParams.get("query");
    if (q && q !== activeQuery) {
      setSearchword(q);
      handleSubmit(q, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // ── Fetch schedule ──
  useEffect(() => {
    if (!user || !isAuthenticated) return;
    const fetchSchedule = async () => {
      try {
        const { data: resSchedule } = await API.get("/tutor/schedule");
        if (resSchedule.data?.schedule) {
          const tempMap = new Map();
          resSchedule.data.schedule.forEach((item) =>
            tempMap.set(`${item.date} ${item.time}`, item)
          );
          setBookClassMap(tempMap);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchSchedule();
  }, [user, isAuthenticated]);

  // ── Fetch availability when tutor selected ──
  useEffect(() => {
    if (!tutorProfile?._id) return;
    const fetchAvailability = async () => {
      try {
        const res = await getTutorAvailability(tutorProfile._id);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const slots = (res.data.schedule || []).filter((s) => new Date(s.date) >= today);
        setAvailability(slots);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAvailability();
  }, [tutorProfile]);

  // ── Regenerate book dates when modal opens ──
  useEffect(() => {
    if (tutorProfile && modalIsOpen) {
      setBookDates([...new Set(dateHelper(4))]);
    }
  }, [modalIsOpen, tutorProfile]);

  // ── Core search ──
  const handleSubmit = async (word, pg = 0) => {
    const trimmed = (word || "").trim();
    if (!trimmed) return;

    setIsSearching(true);
    setHasSearched(true);
    setActiveQuery(trimmed);
    setPage(pg);
    setTutorProfile(null); // reset to list view

    try {
      const { data } = await API.get(`/tutors?query=${encodeURIComponent(trimmed)}&page=${pg}`);
      setSearchData(Array.isArray(data.data) ? data.data : []);
      setSearchSize(data.numbers || 0);

      // Scroll to results section
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      console.error(err);
      setSearchData([]);
      setSearchSize(0);
    } finally {
      setIsSearching(false);
    }
  };

  const choosePage = (cmd) => {
    const next = cmd === "next" ? page + 1 : page - 1;
    if (next >= 0) handleSubmit(activeQuery, next);
  };

  // ── Booking handlers ──
  const handleModal = () => setModalIsOpen((v) => !v);

  const addClass = (date, time) => {
    if (bookClassMap.has(`${date} ${time}`)) {
      alert("Schedule Conflict ❌");
      return;
    }
    const tempMap = new Map(bookClassMap);
    tempMap.set(`${date} ${time}`, {
      date, time,
      tutor: tutorProfile.first_name || tutorProfile.fName,
      tutor_lastname: tutorProfile.last_name || tutorProfile.lName,
      subject: tutorProfile.subjects,
      tutor_ID: tutorProfile._id,
    });
    setBookClassMap(tempMap);
  };

  const removeClass = (date, time) => {
    const tempMap = new Map(bookClassMap);
    tempMap.delete(`${date} ${time}`);
    setBookClassMap(tempMap);
  };

  const confirmClasses = async (selectedSlot) => {
    if (!user) return alert("Login required ❌");
    if (!selectedSlot) return alert("Please select a time slot first.");

    const tutorId = tutorProfile?._id;
    const tutorName = `${tutorProfile?.fName || tutorProfile?.name || tutorProfile?.first_name || "Tutor"} ${tutorProfile?.lName || tutorProfile?.last_name || ""}`.trim();
    const subject =
      selectedSlot.subject ||
      (Array.isArray(tutorProfile?.subjects) && tutorProfile.subjects.length > 0
        ? tutorProfile.subjects[0]
        : tutorProfile?.subjects) ||
      tutorProfile?.expertise ||
      "General";

    try {
      const res = await API.post("/booking", {
        tutorId, tutorName,
        studentId: user?.id || user?._id,
        slotId: selectedSlot._id,
        subject,
        date: selectedSlot.date,
        time: selectedSlot.time,
      });

      if (res.data.msg === "Booking created" || res.data.msg === "Booking successful") {
        alert("Booking confirmed! ✅");
        setModalIsOpen(false);
        navigate("/tutorials/bookings");
      } else {
        alert(res.data.msg || "Booking failed ❌");
      }
    } catch (err) {
      console.error("Booking error:", err);
      if (err.response?.status === 409) {
        alert("You already booked this slot. Please choose another available slot.");
        return;
      }
      alert(err.response?.data?.msg || err.message || "Booking failed ❌");
    }
  };

  if (!isInitialized || isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "300px" }}>
        <Loader2 size={28} style={{ color: "var(--accent)", animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  // ── Tutor detail view (replaces results section when a card is clicked) ──
  if (tutorProfile) {
    return (
      <div style={{ minHeight: "100%" }}>
        {!isUnifiedLayout && <Navbar />}
        <div style={{ padding: "0" }}>
          <TutorInfo
            tutorProfile={tutorProfile}
            returnToSearch={() => setTutorProfile(null)}
            handleModal={handleModal}
          />
          {modalIsOpen && (
            <BookModal
              open={modalIsOpen}
              handleModal={handleModal}
              addClass={addClass}
              removeClass={removeClass}
              confirmClasses={confirmClasses}
              tutorProfile={tutorProfile}
              bookDates={bookDates}
              bookClassMap={bookClassMap}
              availability={availability}
            />
          )}
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ── Main single-page view ──
  return (
    <div style={{ minHeight: "100%" }}>
      {!isUnifiedLayout && <Navbar />}

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "4px 0 32px" }}>

        {/* ══ HERO BANNER ══ */}
        <div style={{
          textAlign: "center",
          marginBottom: "24px",
          padding: "32px 24px 28px",
          background: "linear-gradient(135deg, rgba(59,130,246,0.07) 0%, rgba(139,92,246,0.05) 50%, rgba(16,185,129,0.04) 100%)",
          borderRadius: "20px",
          border: "1px solid var(--border-color)",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Decorative blobs */}
          <div style={{ position: "absolute", top: "-30px", right: "-30px", width: "160px", height: "160px", borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.1), transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "-20px", left: "10%", width: "120px", height: "120px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.08), transparent 70%)", pointerEvents: "none" }} />

          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 12px", borderRadius: "999px", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", marginBottom: "14px" }}>
            <Sparkles size={12} style={{ color: "#3b82f6" }} />
            <span style={{ fontSize: "11px", fontWeight: "700", color: "#3b82f6", letterSpacing: "0.05em", textTransform: "uppercase" }}>Tutor Match</span>
          </div>

          <h1 style={{ fontSize: "clamp(22px, 4vw, 32px)", fontWeight: "900", color: "var(--text-primary)", margin: "0 0 10px", letterSpacing: "-0.03em", lineHeight: "1.1" }}>
            Find Your Perfect{" "}
            <span style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Tutor
            </span>
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: "0 auto", maxWidth: "400px", lineHeight: "1.5" }}>
            Search by subject, topic, or skill. Results appear right below — no page change.
          </p>

          {/* Stats Row */}
          <div style={{ display: "flex", justifyContent: "center", gap: "24px", marginTop: "20px", flexWrap: "wrap" }}>
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Icon size={13} style={{ color: "var(--text-muted)" }} />
                <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-primary)" }}>{value}</span>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ══ SEARCH BAR ══ */}
        <div style={{
          display: "flex", gap: "10px", marginBottom: "16px",
          background: "var(--card-bg)",
          border: `1.5px solid ${searchFocused ? "var(--accent)" : "var(--border-color)"}`,
          borderRadius: "14px",
          padding: "6px 6px 6px 16px",
          boxShadow: searchFocused ? "0 0 0 3px rgba(59,130,246,0.12)" : "var(--shadow-sm)",
          transition: "all 0.2s ease",
        }}>
          {isSearching
            ? <Loader2 size={18} style={{ color: "var(--accent)", flexShrink: 0, alignSelf: "center", animation: "spin 1s linear infinite" }} />
            : <Search size={18} style={{ color: searchFocused ? "var(--accent)" : "var(--text-muted)", flexShrink: 0, alignSelf: "center", transition: "color 0.2s" }} />
          }
          <input
            type="text"
            value={searchword}
            onChange={(e) => setSearchword(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSubmit(searchword, 0); } }}
            placeholder="Search subjects, tutor names, skills… (e.g. DBMS, Python, Bindu)"
            style={{ flex: 1, border: "none", background: "transparent", fontSize: "14px", fontWeight: "500", color: "var(--text-primary)", outline: "none", padding: "6px 0" }}
          />
          {searchword && (
            <button
              onClick={() => { setSearchword(""); setHasSearched(false); setActiveQuery(""); setSearchData([]); }}
              style={{ background: "none", border: "none", cursor: "pointer", padding: "0 6px", alignSelf: "center", color: "var(--text-muted)" }}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
          <button
            type="button"
            onClick={() => handleSubmit(searchword, 0)}
            disabled={isSearching || !searchword.trim()}
            style={{
              padding: "0 20px", height: "42px", borderRadius: "10px",
              background: searchword.trim()
                ? "linear-gradient(135deg, #3b82f6, #6366f1)"
                : "var(--border-color)",
              color: searchword.trim() ? "#fff" : "var(--text-muted)",
              fontSize: "13px", fontWeight: "700",
              border: "none", cursor: searchword.trim() ? "pointer" : "default",
              display: "flex", alignItems: "center", gap: "6px",
              flexShrink: 0, transition: "all 0.2s ease",
              boxShadow: searchword.trim() ? "0 4px 12px rgba(59,130,246,0.3)" : "none",
            }}
          >
            <Search size={14} /> Search
          </button>
        </div>

        {/* ══ POPULAR SUBJECT TAGS ══ */}
        <div style={{ marginBottom: "28px" }}>
          <p style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "10px" }}>
            Popular subjects
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {POPULAR_SUBJECTS.map((subject) => (
              <button
                key={subject}
                onClick={() => { setSearchword(subject); handleSubmit(subject, 0); }}
                style={{
                  padding: "5px 13px", borderRadius: "999px",
                  background: activeQuery?.toLowerCase() === subject.toLowerCase()
                    ? "rgba(59,130,246,0.12)"
                    : "var(--card-bg)",
                  border: activeQuery?.toLowerCase() === subject.toLowerCase()
                    ? "1px solid rgba(59,130,246,0.4)"
                    : "1px solid var(--border-color)",
                  fontSize: "12px", fontWeight: "600",
                  color: activeQuery?.toLowerCase() === subject.toLowerCase()
                    ? "var(--accent)"
                    : "var(--text-secondary)",
                  cursor: "pointer", transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  if (activeQuery?.toLowerCase() !== subject.toLowerCase()) {
                    e.currentTarget.style.borderColor = "var(--accent)";
                    e.currentTarget.style.color = "var(--accent)";
                    e.currentTarget.style.background = "rgba(59,130,246,0.06)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeQuery?.toLowerCase() !== subject.toLowerCase()) {
                    e.currentTarget.style.borderColor = "var(--border-color)";
                    e.currentTarget.style.color = "var(--text-secondary)";
                    e.currentTarget.style.background = "var(--card-bg)";
                  }
                }}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>

        {/* ══ RESULTS SECTION ══ */}
        <div ref={resultsRef}>
          {/* Results header */}
          {hasSearched && !isSearching && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", paddingBottom: "12px", borderTop: "1px solid var(--border-color)", paddingTop: "20px" }}>
              <div>
                <p style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", margin: "0 0 3px" }}>
                  Search Results
                </p>
                <p style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>
                  {searchData.length > 0
                    ? `${searchSize || searchData.length} tutor${(searchSize || searchData.length) !== 1 ? "s" : ""} found for "${activeQuery}"`
                    : `No tutors found for "${activeQuery}"`}
                </p>
              </div>
              <button
                onClick={() => { setHasSearched(false); setActiveQuery(""); setSearchword(""); setSearchData([]); }}
                style={{ background: "none", border: "1px solid var(--border-color)", borderRadius: "8px", cursor: "pointer", padding: "6px 12px", fontSize: "12px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px", transition: "all 0.15s ease" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.color = "var(--text-muted)"; }}
              >
                <X size={12} /> Clear
              </button>
            </div>
          )}

          {/* Loading skeletons */}
          {isSearching && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
              {[1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}
            </div>
          )}

          {/* Results grid */}
          {!isSearching && hasSearched && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
              {searchData.length === 0
                ? <EmptyState query={activeQuery} />
                : searchData.map((tutor) => (
                  <TutorCard
                    key={tutor._id}
                    tutor={tutor}
                    onViewProfile={(t) => {
                      setTutorProfile(t);
                      setSearchParams({ tutorId: t._id });
                    }}
                    onMessage={(id) => navigate(`/tutorials/chat?tutorId=${id}`)}
                  />
                ))
              }
            </div>
          )}

          {/* Pagination */}
          {!isSearching && hasSearched && searchData.length > 0 && (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "12px", marginTop: "24px" }}>
              <button
                onClick={() => choosePage("prev")}
                disabled={page === 0}
                style={{
                  display: "flex", alignItems: "center", gap: "4px",
                  padding: "0 16px", height: "36px", borderRadius: "10px",
                  background: "var(--card-bg)", border: "1px solid var(--border-color)",
                  color: page === 0 ? "var(--text-muted)" : "var(--text-primary)",
                  fontSize: "12px", fontWeight: "600", cursor: page === 0 ? "default" : "pointer",
                  opacity: page === 0 ? 0.5 : 1, transition: "all 0.15s ease",
                }}
              >
                <ChevronLeft size={14} /> Previous
              </button>
              <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600" }}>
                Page {page + 1}
              </span>
              <button
                onClick={() => choosePage("next")}
                disabled={searchData.length < 18}
                style={{
                  display: "flex", alignItems: "center", gap: "4px",
                  padding: "0 16px", height: "36px", borderRadius: "10px",
                  background: "var(--card-bg)", border: "1px solid var(--border-color)",
                  color: "var(--text-primary)",
                  fontSize: "12px", fontWeight: "600", cursor: searchData.length < 18 ? "default" : "pointer",
                  opacity: searchData.length < 18 ? 0.5 : 1, transition: "all 0.15s ease",
                }}
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          )}

          {/* No search yet — "Featured" placeholder */}
          {!hasSearched && !isSearching && (
            <div style={{
              textAlign: "center", padding: "36px 24px",
              background: "var(--card-bg)", border: "1px solid var(--border-color)",
              borderRadius: "16px", borderTop: "1px solid var(--border-color)",
            }}>
              <div style={{
                width: "56px", height: "56px", borderRadius: "16px",
                background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 12px",
              }}>
                <GraduationCap size={24} style={{ color: "#3b82f6", opacity: 0.7 }} />
              </div>
              <p style={{ fontSize: "15px", fontWeight: "700", color: "var(--text-primary)", margin: "0 0 6px" }}>
                Ready to find your tutor?
              </p>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0 }}>
                Type a subject above or click a popular tag to start browsing.
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </div>
  );
}

export default BookClass;
