import React, { useEffect, useState } from "react";
import API from "@/services/api/tutorialsApi.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { CheckCircle2, XCircle, Calendar, Clock, User, Link as LinkIcon, Inbox } from "lucide-react";
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

const getDynamicStatus = (b) => {
  if (["upcoming", "accepted", "pending", "Booked"].includes(b.status)) {
    if (b.date && b.time) {
      const bookingDateTime = new Date(`${b.date}T${b.time}`);
      if (bookingDateTime < new Date()) {
        return "Missed";
      }
    }
  }
  return b.status;
};

function TutorAcceptPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [linkInputs, setLinkInputs] = useState({});
  const [editingLink, setEditingLink] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await API.get("/booking/for-tutor");
        setBookings(res.data.bookings || []);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/booking/${id}/status`, { status });

      setBookings((prev) =>
        prev?.map((b) =>
          b._id === id ? { ...b, status } : b
        )
      );
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  const publishMeetingLink = async (id, link) => {
    if (!link || !link.trim().startsWith("http")) {
      toast.error("Please enter a valid HTTP/HTTPS URL");
      return;
    }
    try {
      const res = await API.patch(`/booking/${id}/meeting-link`, { meetingLink: link });
      setBookings((prev) =>
        prev?.map((b) => (b._id === id ? { ...b, ...res.data.booking } : b))
      );
      setEditingLink((prev) => ({ ...prev, [id]: false }));
      toast.success("Meeting link published!");
    } catch (err) {
      console.error("Publish link failed:", err);
      toast.error(err.response?.data?.msg || "Failed to publish link");
    }
  };

  return (
    <PageLayout className="pb-8">
      <div style={styles.pageWrapper}>
        
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <h1 style={styles.pageTitle}>Student Requests</h1>
            <p style={styles.pageSubtitle}>
              Review, accept, or decline booking requests from students.
            </p>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", paddingTop: "80px" }}>
            <span className="spinner spinner-lg" />
          </div>
        ) : bookings.length === 0 ? (
          <div 
            style={{ ...styles.card, padding: "48px 24px", alignItems: "center", justifyContent: "center", textAlign: "center" }}
            className="hover:translate-y-0 hover:shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
          >
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(245,158,11,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
              <Inbox size={32} color="var(--warning)" />
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "8px" }}>No pending requests</h3>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", maxWidth: "300px" }}>
              You don't have any student booking requests at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.map((bookingRaw) => {
              const dynamicStatus = getDynamicStatus(bookingRaw);
              const b = { ...bookingRaw, status: dynamicStatus };
              let badgeBg, badgeColor;
              if (b.status === "Booked" || b.status === "pending") {
                badgeBg = "rgba(245,158,11,0.12)";
                badgeColor = "var(--warning)";
              } else if (b.status === "upcoming" || b.status === "accepted") {
                badgeBg = "rgba(59,130,246,0.12)";
                badgeColor = "var(--primary)";
              } else if (b.status === "in_progress") {
                badgeBg = "rgba(16,185,129,0.12)";
                badgeColor = "var(--success)";
              } else if (b.status === "Completed" || b.status === "completed") {
                badgeBg = "rgba(16,185,129,0.12)";
                badgeColor = "var(--success)";
              } else if (b.status === "Missed") {
                badgeBg = "rgba(107,114,128,0.12)";
                badgeColor = "#6b7280";
              } else {
                badgeBg = "rgba(239,68,68,0.12)";
                badgeColor = "var(--danger)";
              }

              return (
                <div
                  key={b._id}
                  style={styles.card}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
                    e.currentTarget.style.borderColor = badgeColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)";
                    e.currentTarget.style.borderColor = "var(--border-color)";
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid var(--border-color)", paddingBottom: "16px", marginBottom: "4px" }}>
                    <span style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-primary)" }}>
                      {b.subject}
                    </span>
                    <span style={{ ...styles.badge, background: badgeBg, color: badgeColor, border: `1px solid ${badgeColor}40` }}>
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: badgeColor, flexShrink: 0 }} />
                      {b.status}
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <Calendar size={16} color="var(--text-muted)" />
                      <span style={{ fontSize: "14px", color: "var(--text-primary)", fontWeight: "500" }}>{b.date}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <Clock size={16} color="var(--text-muted)" />
                      <span style={{ fontSize: "14px", color: "var(--text-primary)", fontWeight: "500" }}>{b.time}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <User size={16} color="var(--text-muted)" />
                      <span style={{ fontSize: "14px", color: "var(--text-primary)", fontWeight: "500" }}>Student ID: {b.userId}</span>
                    </div>
                  </div>

                  {(b.status === "Booked" || b.status === "pending") && (
                    <div style={{ display: "flex", gap: "10px", marginTop: "auto", paddingTop: "16px", borderTop: "1px solid var(--border-color)" }}>
                      <PremiumButton size="sm" style={{ flex: 1, backgroundColor: "var(--success)", borderColor: "var(--success)" }} onClick={() => updateStatus(b._id, "upcoming")}>
                        <CheckCircle2 size={16} style={{ marginRight: "6px" }} />
                        Accept
                      </PremiumButton>
                      <PremiumButton size="sm" variant="outline" style={{ flex: 1, borderColor: "rgba(239,68,68,0.3)", color: "var(--danger)" }} onClick={() => updateStatus(b._id, "declined")}>
                        <XCircle size={16} style={{ marginRight: "6px" }} />
                        Decline
                      </PremiumButton>
                    </div>
                  )}

                  {(b.status === "upcoming" || b.status === "accepted") && (
                    <div style={{ marginTop: "auto", paddingTop: "16px", borderTop: "1px dashed var(--border-color)" }}>
                      <p style={{ fontSize: "11px", fontWeight: "600", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "8px", letterSpacing: "0.05em" }}>
                        Meeting Details
                      </p>
                      
                      {b.meetingLinkPublished && !editingLink[b._id] ? (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", background: "var(--bg-secondary)", padding: "10px 12px", borderRadius: "8px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", overflow: "hidden" }}>
                            <CheckCircle2 size={16} style={{ color: "var(--success)", flexShrink: 0 }} />
                            <a href={b.meetingLink} target="_blank" rel="noreferrer" style={{ fontSize: "13px", fontWeight: "500", color: "var(--primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} className="hover:underline">
                              {b.meetingLink}
                            </a>
                          </div>
                          <PremiumButton size="sm" variant="outline" style={{ height: "28px", padding: "0 10px", fontSize: "12px", flexShrink: 0 }} onClick={() => {
                            setLinkInputs(prev => ({ ...prev, [b._id]: b.meetingLink }));
                            setEditingLink(prev => ({ ...prev, [b._id]: true }));
                          }}>
                            Edit
                          </PremiumButton>
                        </div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <div style={{ position: "relative", flex: 1 }}>
                              <div style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>
                                <LinkIcon size={14} />
                              </div>
                              <input
                                type="url"
                                placeholder="https://meet.google.com/..."
                                value={linkInputs[b._id] !== undefined ? linkInputs[b._id] : (b.meetingLink || "")}
                                onChange={(e) => setLinkInputs(prev => ({ ...prev, [b._id]: e.target.value }))}
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
                          </div>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <PremiumButton
                              size="sm"
                              style={{ height: "32px", flex: 1 }}
                              onClick={() => publishMeetingLink(b._id, linkInputs[b._id] !== undefined ? linkInputs[b._id] : b.meetingLink)}
                            >
                              {b.meetingLinkPublished ? "Update Link" : "Publish Link"}
                            </PremiumButton>
                            {b.meetingLinkPublished && (
                              <PremiumButton size="sm" variant="outline" style={{ height: "32px", flex: 1 }} onClick={() => setEditingLink(prev => ({ ...prev, [b._id]: false }))}>
                                Cancel
                              </PremiumButton>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PageLayout>
  );
}

export default TutorAcceptPage;
