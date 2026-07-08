import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { getSchedule } from "@/services/api/tutorialsApi.js";
import { toast } from "react-hot-toast";
import { Plus, Trash2, MessageCircle, Link as LinkIcon, Calendar, Clock, Copy, ExternalLink, BookOpen } from "lucide-react";
import {
  PageLayout,
  PremiumButton,
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
  headerActions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    alignItems: "center",
    flexShrink: 0,
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
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    padding: "3px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
  }
};

function TutorSchedulePage() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await getSchedule();
        setSchedule(res.data.data?.schedule || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  const deleteSlot = async (slotId) => {
    if (!window.confirm("Delete this slot? This cannot be undone.")) return;
    try {
      await API.delete(`/tutor/schedule/${slotId}`);
      setSchedule((prev) => prev?.filter((s) => s._id !== slotId));
      toast.success("Slot deleted");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || err.response?.data?.message || "Error deleting slot");
    }
  };

  return (
    <PageLayout className="pb-8">
      <div style={styles.pageWrapper}>
        
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <h1 style={styles.pageTitle}>My Schedule</h1>
            <p style={styles.pageSubtitle}>
              Manage your availability, upcoming classes, and meeting links.
            </p>
          </div>
          <div style={styles.headerActions}>
            <PremiumButton size="sm" onClick={() => navigate("/tutorials/tutor/availability")}>
              <Plus size={16} style={{ marginRight: "6px" }} />
              Add Availability
            </PremiumButton>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", paddingTop: "80px" }}>
            <span className="spinner spinner-lg" />
          </div>
        ) : schedule.length === 0 ? (
          <div 
            style={{ ...styles.card, padding: "48px 24px", alignItems: "center", justifyContent: "center", textAlign: "center" }}
            className="hover:translate-y-0 hover:shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
          >
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(59,130,246,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
              <Calendar size={32} color="var(--primary)" />
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "8px" }}>No slots scheduled</h3>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", maxWidth: "300px" }}>
              You have not set any availability slots. Add availability to allow students to book sessions.
            </p>
            <PremiumButton size="sm" onClick={() => navigate("/tutorials/tutor/availability")} style={{ marginTop: "24px" }}>
              Get Started
            </PremiumButton>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {schedule.map((item, index) => {
              const isBooked = item.bookingCount > 0 || ["Booked", "pending", "accepted", "upcoming", "in_progress"].includes(item.bookingStatus);
              const badgeBg = isBooked ? "rgba(16,185,129,0.12)" : "rgba(245,158,11,0.12)";
              const badgeColor = isBooked ? "var(--success)" : "var(--warning)";
              
              return (
                <div 
                  key={item._id || index}
                  style={styles.card}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
                    e.currentTarget.style.borderColor = isBooked ? "var(--success)" : "var(--warning)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)";
                    e.currentTarget.style.borderColor = "var(--border-color)";
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid var(--border-color)", paddingBottom: "16px", marginBottom: "4px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <BookOpen size={18} color="var(--text-muted)" />
                      </div>
                      <span style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-primary)" }}>
                        {item.subject || item.subjects?.[0] || "General Session"}
                      </span>
                    </div>
                    <span style={{ ...styles.badge, background: badgeBg, color: badgeColor, border: `1px solid ${badgeColor}40` }}>
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: badgeColor, flexShrink: 0 }} />
                      {isBooked ? `${item.bookingCount} enrolled` : "Available"}
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <Calendar size={16} color="var(--text-muted)" />
                      <span style={{ fontSize: "14px", color: "var(--text-primary)", fontWeight: "500" }}>{item.date}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <Clock size={16} color="var(--text-muted)" />
                      <span style={{ fontSize: "14px", color: "var(--text-primary)", fontWeight: "500" }}>{item.time}</span>
                    </div>
                  </div>

                  {isBooked && (
                    <div style={{ marginTop: "8px", paddingTop: "16px", borderTop: "1px dashed var(--border-color)" }}>
                      <p style={{ fontSize: "11px", fontWeight: "600", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "8px", letterSpacing: "0.05em" }}>
                        Meeting Details
                      </p>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <div style={{ position: "relative", flex: 1 }}>
                          <div style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>
                            <LinkIcon size={14} />
                          </div>
                          <input
                            type="text"
                            placeholder="Paste Zoom / Google Meet link"
                            value={item.meetingLink || ""}
                            onChange={(e) => {
                              const updated = [...schedule];
                              updated[index].meetingLink = e.target.value;
                              setSchedule(updated);
                            }}
                            style={{
                              width: "100%",
                              height: "36px",
                              padding: "0 12px 0 34px",
                              borderRadius: "8px",
                              border: "1px solid var(--border-color)",
                              background: "var(--input-bg)",
                              color: "var(--text-primary)",
                              fontSize: "13px",
                              outline: "none",
                              transition: "border-color 0.15s ease",
                            }}
                            onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                            onBlur={(e) => e.target.style.borderColor = "var(--border-color)"}
                          />
                        </div>
                        <PremiumButton
                          variant="outline"
                          size="sm"
                          style={{ height: "36px" }}
                          onClick={async () => {
                            try {
                              await API.post("/tutor/save-link", { slotId: item._id, link: item.meetingLink });
                              toast.success("Link saved");
                            } catch (err) {
                              toast.error("Error saving link");
                            }
                          }}
                        >
                          Save
                        </PremiumButton>
                      </div>

                      {item.meetingLink && (
                        <div style={{ display: "flex", gap: "16px", marginTop: "12px" }}>
                          <a href={item.meetingLink} target="_blank" rel="noreferrer" style={{ fontSize: "13px", fontWeight: "600", color: "var(--primary)", display: "flex", alignItems: "center", gap: "4px", textDecoration: "none" }} className="hover:underline">
                            <ExternalLink size={14} /> Join Class
                          </a>
                          <button onClick={() => { navigator.clipboard.writeText(item.meetingLink); toast.success("Link copied!"); }} style={{ fontSize: "13px", fontWeight: "500", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", cursor: "pointer", padding: 0 }} className="hover:text-foreground transition-colors">
                            <Copy size={14} /> Copy
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <div style={{ display: "flex", gap: "10px", marginTop: "auto", paddingTop: "16px", borderTop: "1px solid var(--border-color)" }}>
                    <PremiumButton
                      variant="outline"
                      size="sm"
                      style={{ flex: 1, borderColor: "rgba(239,68,68,0.3)", color: "var(--danger)" }}
                      onClick={() => deleteSlot(item._id)}
                    >
                      <Trash2 size={14} style={{ marginRight: "6px" }} />
                      Delete
                    </PremiumButton>
                    
                    {item.studentId && (
                      <PremiumButton
                        variant="secondary"
                        size="sm"
                        style={{ flex: 1 }}
                        onClick={() => navigate(`/tutorials/chat?studentId=${item.studentId}`)}
                      >
                        <MessageCircle size={14} style={{ marginRight: "6px" }} />
                        Message
                      </PremiumButton>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PageLayout>
  );
}

export default TutorSchedulePage;

