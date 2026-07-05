import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Calendar, BookOpen, Edit3, CalendarCheck, AlertCircle, User, MapPin } from "lucide-react";
import bulb2 from "../../assets/images/bulb2.png";
import API, { BASE_URL } from "@/services/api/tutorialsApi.js";

/**
 * Premium Profile component — displays student profile with card layout, schedule pills, and action buttons.
 */
function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    username: "",
    fName: "",
    lName: "",
    email: "",
    subjects: "",
    location: "",
  });

  const [preferredSchedule, setPreferredSchedule] = useState([]);
  const [pic, setPic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExistData = async () => {
      setLoading(true);
      try {
        const { data } = await API.get("/profile");

        if (data.user) {
          const profileInDB = data.user.profile || {};

          const profileData = {
            username: profileInDB.displayName || "",
            fName: profileInDB.fName || "",
            lName: profileInDB.lName || "",
            email: profileInDB.email || "",
            subjects: profileInDB.subjects || "",
            location: profileInDB.location || "",
          };

          setProfile(profileData);
          setPreferredSchedule(data.user.schedule || []);
          setPic(data.user.pic ? `${BASE_URL}/uploads/${data.user.pic}` : null);
        }
      } catch (err) {
        console.error("❌ Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExistData();
  }, []);

  const displayName = profile.username || (profile.fName && profile.lName ? `${profile.fName} ${profile.lName}` : null);
  const initials = displayName
    ? displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "ST";

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "900px", margin: "0 auto", padding: "4px 0" }}>
        {[1, 2].map(i => (
          <div key={i} style={{
            height: "160px", borderRadius: "16px",
            background: "var(--card-bg)", border: "1px solid var(--border-color)",
            animation: "pulse 1.5s ease-in-out infinite",
          }} />
        ))}
      </div>
    );
  }

  return (
    <main style={{ width: "100%", maxWidth: "900px", margin: "0 auto", padding: "4px 0 24px" }}>

      {/* ── Profile Hero Card ── */}
      <div style={{
        background: "var(--card-bg)", border: "1px solid var(--border-color)",
        borderRadius: "20px", overflow: "hidden",
        boxShadow: "var(--shadow-sm)", marginBottom: "16px",
      }}>
        {/* Banner */}
        <div style={{
          height: "100px",
          background: "linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(139,92,246,0.12) 50%, rgba(16,185,129,0.08) 100%)",
          position: "relative",
        }}>
          <div style={{
            position: "absolute", top: "16px", right: "16px",
            display: "flex", gap: "8px",
          }}>
            <button
              onClick={() => navigate("/tutorials/profile/editProfile")}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "0 14px", height: "34px", borderRadius: "8px",
                background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.25)",
                color: "#fff", fontSize: "12px", fontWeight: "700",
                cursor: "pointer", transition: "all 0.2s ease",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
            >
              <Edit3 size={13} /> Edit Profile
            </button>
          </div>
        </div>

        {/* Avatar + Info */}
        <div style={{ padding: "0 24px 24px", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "18px", marginBottom: "16px" }}>
            {/* Avatar */}
            <div style={{
              width: "84px", height: "84px", borderRadius: "50%",
              border: "4px solid var(--card-bg)",
              background: "var(--card-bg)",
              marginTop: "-42px", flexShrink: 0,
              overflow: "hidden",
              boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
            }}>
              {pic ? (
                <img src={pic} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{
                  width: "100%", height: "100%",
                  background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "24px", fontWeight: "800", color: "#fff",
                }}>
                  {initials}
                </div>
              )}
            </div>

            {/* Name */}
            <div style={{ paddingBottom: "4px" }}>
              <h1 style={{
                fontSize: "20px", fontWeight: "800", color: "var(--text-primary)",
                margin: "0 0 2px", letterSpacing: "-0.02em",
              }}>
                {displayName || "Your Profile"}
              </h1>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>
                Student · Tutor Match Platform
              </p>
            </div>
          </div>

          {/* Info grid */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "12px",
          }}>
            {profile.email && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{
                  width: "30px", height: "30px", borderRadius: "8px",
                  background: "rgba(59,130,246,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Mail size={13} style={{ color: "#3b82f6" }} />
                </div>
                <div>
                  <p style={{ fontSize: "10px", fontWeight: "600", color: "var(--text-muted)", margin: 0, textTransform: "uppercase", letterSpacing: "0.04em" }}>Email</p>
                  <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: 0 }}>{profile.email}</p>
                </div>
              </div>
            )}

            {profile.subjects && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{
                  width: "30px", height: "30px", borderRadius: "8px",
                  background: "rgba(16,185,129,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <BookOpen size={13} style={{ color: "#10b981" }} />
                </div>
                <div>
                  <p style={{ fontSize: "10px", fontWeight: "600", color: "var(--text-muted)", margin: 0, textTransform: "uppercase", letterSpacing: "0.04em" }}>Subjects</p>
                  <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: 0 }}>{profile.subjects}</p>
                </div>
              </div>
            )}

            {profile.location && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{
                  width: "30px", height: "30px", borderRadius: "8px",
                  background: "rgba(245,158,11,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <MapPin size={13} style={{ color: "#f59e0b" }} />
                </div>
                <div>
                  <p style={{ fontSize: "10px", fontWeight: "600", color: "var(--text-muted)", margin: 0, textTransform: "uppercase", letterSpacing: "0.04em" }}>Location</p>
                  <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: 0 }}>{profile.location}</p>
                </div>
              </div>
            )}

            {!profile.email && !profile.subjects && !profile.location && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <AlertCircle size={14} style={{ color: "#f59e0b" }} />
                <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>
                  Complete your profile to get started.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Two-column Lower Row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "16px" }}
        className="profile-lower-grid">

        {/* Preferred Schedule */}
        <div style={{
          background: "var(--card-bg)", border: "1px solid var(--border-color)",
          borderRadius: "16px", padding: "20px", boxShadow: "var(--shadow-sm)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <Calendar size={15} style={{ color: "var(--accent)" }} />
            <h2 style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>
              Preferred Schedule
            </h2>
          </div>
          {preferredSchedule.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {preferredSchedule.map((slot, i) => (
                <span key={i} style={{
                  padding: "5px 12px", borderRadius: "999px",
                  background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)",
                  fontSize: "12px", fontWeight: "600", color: "#3b82f6",
                }}>
                  {slot}
                </span>
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <AlertCircle size={13} style={{ color: "var(--text-muted)" }} />
              <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>
                No schedule set.{" "}
                <button
                  onClick={() => navigate("/tutorials/profile/editProfile")}
                  style={{ color: "var(--accent)", fontWeight: "600", background: "none", border: "none", cursor: "pointer", fontSize: "12px" }}
                >
                  Add in Edit Profile →
                </button>
              </p>
            </div>
          )}
        </div>

        {/* Cancellation Policy card */}
        <div style={{
          background: "var(--card-bg)", border: "1px solid var(--border-color)",
          borderRadius: "16px", padding: "20px",
          boxShadow: "var(--shadow-sm)", width: "240px",
        }}
          className="profile-policy-card"
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <CalendarCheck size={15} style={{ color: "#f59e0b" }} />
            <h2 style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>
              Cancellation Policy
            </h2>
          </div>
          <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: "1.5", margin: "0 0 14px" }}>
            Lesson cancellation requires at least <strong>1 hour notice</strong> before the scheduled session.
          </p>
          <Link
            to="/tutorials/book"
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "0 12px", height: "32px", borderRadius: "8px",
              background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)",
              color: "var(--accent)", fontSize: "11px", fontWeight: "700",
              textDecoration: "none", transition: "all 0.15s ease",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(59,130,246,0.15)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(59,130,246,0.1)"}
          >
            Book a Trial Session
          </Link>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div style={{
        display: "flex", gap: "10px", marginTop: "16px", flexWrap: "wrap",
      }}>
        <button
          onClick={() => navigate("/tutorials/bookings")}
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "0 18px", height: "40px", borderRadius: "10px",
            background: "var(--accent)", color: "#fff",
            border: "none", cursor: "pointer",
            fontSize: "13px", fontWeight: "700",
            boxShadow: "0 4px 12px rgba(59,130,246,0.25)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
        >
          <BookOpen size={14} /> View My Bookings
        </button>

        <button
          onClick={() => navigate("/tutorials/profile/editProfile")}
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "0 18px", height: "40px", borderRadius: "10px",
            background: "var(--card-bg)", color: "var(--text-primary)",
            border: "1px solid var(--border-color)", cursor: "pointer",
            fontSize: "13px", fontWeight: "600",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.color = "var(--text-primary)"; }}
        >
          <Edit3 size={14} /> Edit Profile
        </button>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .profile-lower-grid { grid-template-columns: 1fr !important; }
          .profile-policy-card { width: 100% !important; }
        }
      `}</style>
    </main>
  );
}

export default Profile;
