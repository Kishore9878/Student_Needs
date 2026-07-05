import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PropTypes from "prop-types";
import { Search, Sparkles, BookOpen, Star, Users, Zap } from "lucide-react";

const POPULAR_SUBJECTS = [
  "Mathematics", "Physics", "Chemistry", "English", "Biology",
  "Computer Science", "Economics", "Statistics", "Calculus",
];

const STATS = [
  { icon: Users, value: "500+", label: "Expert Tutors" },
  { icon: BookOpen, value: "120+", label: "Subjects" },
  { icon: Star, value: "4.9★", label: "Avg Rating" },
  { icon: Zap, value: "2hr", label: "Avg Response" },
];

/**
 * Premium hero search component for finding tutors.
 * @param {function} handleSubmit - Search submit handler from parent
 * @param {boolean} notFound - Whether search returned no results
 * @param {boolean} search - Current search state
 * @param {number} page - Current page
 */
function SearchTutor({ notFound, search, handleSubmit, page }) {
  const [searchword, setSearchword] = useState("");
  const [searchParams, setSearchParams] = useSearchParams("");
  const [focused, setFocused] = useState(false);

  const handleChange = (evt) => {
    evt.preventDefault();
    setSearchword(evt.target.value);
    setSearchParams({ query: evt.target.value, page: page });
  };

  useEffect(() => {
    if (!search) {
      setSearchParams("");
    }
  }, [search, setSearchParams]);

  useEffect(() => {
    const keyDownHandler = (evt) => {
      if (evt.key === "Enter") {
        evt.preventDefault();
        handleSubmit(searchword, 0);
      }
    };
    window.addEventListener("keydown", keyDownHandler);
    return () => {
      window.removeEventListener("keydown", keyDownHandler);
    };
  }, [searchword, handleSubmit]);

  const handleClick = (evt) => {
    evt.preventDefault();
    handleSubmit(searchword, 0);
  };

  const handleTagClick = (subject) => {
    setSearchword(subject);
    handleSubmit(subject, 0);
  };

  return (
    <div style={{ width: "100%", maxWidth: "720px", margin: "0 auto", padding: "8px 0 24px" }}>

      {/* ── Hero Header ── */}
      <div style={{
        textAlign: "center",
        marginBottom: "32px",
        padding: "32px 24px 28px",
        background: "linear-gradient(135deg, rgba(59,130,246,0.07) 0%, rgba(139,92,246,0.05) 50%, rgba(16,185,129,0.04) 100%)",
        borderRadius: "20px",
        border: "1px solid var(--border-color)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative blobs */}
        <div style={{
          position: "absolute", top: "-30px", right: "-30px",
          width: "160px", height: "160px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.1), transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "-20px", left: "10%",
          width: "120px", height: "120px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.08), transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          padding: "4px 12px", borderRadius: "999px",
          background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)",
          marginBottom: "14px",
        }}>
          <Sparkles size={12} style={{ color: "#3b82f6" }} />
          <span style={{ fontSize: "11px", fontWeight: "700", color: "#3b82f6", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Tutor Match
          </span>
        </div>

        <h1 style={{
          fontSize: "clamp(24px, 5vw, 36px)", fontWeight: "900",
          color: "var(--text-primary)", margin: "0 0 10px",
          letterSpacing: "-0.03em", lineHeight: "1.1",
        }}>
          Find Your Perfect{" "}
          <span style={{
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>Tutor</span>
        </h1>
        <p style={{
          fontSize: "14px", color: "var(--text-muted)",
          margin: "0 auto", maxWidth: "400px", lineHeight: "1.5",
        }}>
          Search by subject, topic, or skill. Connect with expert tutors ready to help you succeed.
        </p>

        {/* Stats Row */}
        <div style={{
          display: "flex", justifyContent: "center", gap: "24px",
          marginTop: "20px", flexWrap: "wrap",
        }}>
          {STATS.map(({ icon: Icon, value, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Icon size={13} style={{ color: "var(--text-muted)" }} />
              <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-primary)" }}>{value}</span>
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div style={{
        display: "flex", gap: "10px", marginBottom: "16px",
        background: "var(--card-bg)",
        border: `1.5px solid ${focused ? "var(--accent)" : "var(--border-color)"}`,
        borderRadius: "14px",
        padding: "6px 6px 6px 16px",
        boxShadow: focused ? "0 0 0 3px rgba(59,130,246,0.12)" : "var(--shadow-sm)",
        transition: "all 0.2s ease",
      }}>
        <Search size={18} style={{ color: focused ? "var(--accent)" : "var(--text-muted)", flexShrink: 0, alignSelf: "center", transition: "color 0.2s" }} />
        <input
          type="text"
          value={searchword}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="What would you like to work on? (e.g. Calculus, Python…)"
          style={{
            flex: 1, border: "none", background: "transparent",
            fontSize: "14px", fontWeight: "500", color: "var(--text-primary)",
            outline: "none", padding: "6px 0",
          }}
        />
        <button
          type="button"
          aria-label="Search for a tutor"
          onClick={handleClick}
          style={{
            padding: "0 20px", height: "42px", borderRadius: "10px",
            background: "linear-gradient(135deg, #3b82f6, #6366f1)",
            color: "#fff", fontSize: "13px", fontWeight: "700",
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", gap: "6px",
            flexShrink: 0, transition: "all 0.2s ease",
            boxShadow: "0 4px 12px rgba(59,130,246,0.3)",
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
        >
          <Search size={14} />
          Search
        </button>
      </div>

      {/* ── Not Found Alert ── */}
      {notFound && (
        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
          padding: "12px 16px", borderRadius: "10px", marginBottom: "16px",
          background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)",
        }}>
          <span style={{ fontSize: "16px" }}>🔍</span>
          <p style={{ fontSize: "13px", fontWeight: "600", color: "#b45309", margin: 0 }}>
            No tutors found for that search. Try a different keyword or subject.
          </p>
        </div>
      )}

      {/* ── Popular Subject Tags ── */}
      <div>
        <p style={{
          fontSize: "11px", fontWeight: "700", color: "var(--text-muted)",
          letterSpacing: "0.06em", textTransform: "uppercase",
          marginBottom: "10px",
        }}>
          Popular subjects
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {POPULAR_SUBJECTS.map((subject) => (
            <button
              key={subject}
              onClick={() => handleTagClick(subject)}
              style={{
                padding: "5px 13px", borderRadius: "999px",
                background: "var(--card-bg)", border: "1px solid var(--border-color)",
                fontSize: "12px", fontWeight: "600", color: "var(--text-secondary)",
                cursor: "pointer", transition: "all 0.15s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.color = "var(--accent)";
                e.currentTarget.style.background = "rgba(59,130,246,0.06)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "var(--border-color)";
                e.currentTarget.style.color = "var(--text-secondary)";
                e.currentTarget.style.background = "var(--card-bg)";
              }}
            >
              {subject}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

SearchTutor.propTypes = {
  notFound: PropTypes.bool,
  search: PropTypes.bool,
  page: PropTypes.number,
  handleSubmit: PropTypes.func,
};

export default SearchTutor;