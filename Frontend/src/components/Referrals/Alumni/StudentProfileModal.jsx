import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button.jsx";
import {
  X,
  User,
  Mail,
  Phone,
  GraduationCap,
  Building2,
  Calendar,
  MapPin,
  Link,
  FileText,
  Star,
  Briefcase,
  Code,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/Referrals/utils.js";
import { applicationsApi } from "@/services/Referrals/application.js";
import { showToast } from "@/components/Referrals/TransactionToast.jsx";
import { useSidebar } from "@/contexts/SidebarContext";

// Helper function to dynamically extract tech tags from project description
const getProjectTechTags = (description) => {
  if (!description) return [];
  const commonTech = [
    "HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Vue", "Angular",
    "Node.js", "Express", "Django", "Flask", "FastAPI", "Spring Boot", "Ruby on Rails",
    "Python", "Java", "C++", "C#", "Rust", "Go", "Kotlin", "Swift", "PHP",
    "MongoDB", "SQL", "MySQL", "PostgreSQL", "SQLite", "Firebase", "Supabase", "Redis",
    "Tailwind", "Bootstrap", "Git", "Docker", "Kubernetes", "AWS", "GCP", "Azure",
    "TensorFlow", "PyTorch", "NumPy", "Pandas"
  ];
  const tags = [];
  const descLower = description.toLowerCase();
  
  commonTech.forEach(tech => {
    if (tech === "C++") {
      if (descLower.includes("c++")) {
        tags.push(tech);
      }
    } else {
      const escaped = tech.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'i');
      if (regex.test(descLower)) {
        tags.push(tech);
      }
    }
  });
  
  return tags;
};

export function StudentProfileModal({ 
  isOpen, 
  onClose, 
  student, 
  loading,
  application,
  onShortlist,
  onReject,
  onRefer,
  onApprove
}) {
  const navigate = useNavigate();

  // Retrieve sidebar state dynamically to prevent sidebar overlap
  let isCollapsed = false;
  try {
    const sidebar = useSidebar();
    isCollapsed = sidebar.isCollapsed;
  } catch (e) {
    // context fallback
  }

  if (!isOpen) return null;

  // Refined styles mapping to the new compact specifications
  const headerStyle = {
    paddingTop: "24px",
    paddingLeft: "28px",
    paddingRight: "28px",
    paddingBottom: "20px",
    background: "#ffffff",
    borderBottom: "1px solid #f1f5f9",
    display: "flex",
    position: "relative",
    flexShrink: 0,
  };

  const closeButtonStyle = {
    position: "absolute",
    top: "20px",
    right: "20px",
    zIndex: 10,
    padding: "8px",
    borderRadius: "9999px",
    border: "none",
    background: "#f8fafc",
    color: "#94a3b8",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  };

  const avatarContainerStyle = {
    width: "76px",
    height: "76px",
    borderRadius: "9999px",
    overflow: "hidden",
    flexShrink: 0,
    background: "#f1f5f9",
  };

  const avatarImageStyle = {
    width: "76px",
    height: "76px",
    borderRadius: "9999px",
    objectFit: "cover",
    flexShrink: 0,
    display: "block",
  };

  const avatarPlaceholderStyle = {
    width: "76px",
    height: "76px",
    borderRadius: "9999px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(to bottom right, rgba(99, 102, 241, 0.1), rgba(99, 102, 241, 0.2))",
    color: "#6366f1",
    flexShrink: 0,
  };

  const headerContentWrapperStyle = {
    display: "flex",
    gap: "20px",
    alignItems: "flex-start",
    width: "100%",
  };

  const headerTextContainerStyle = {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minWidth: 0,
  };

  const nameStyle = {
    fontSize: "32px",
    fontWeight: "700",
    color: "#0f172a",
    lineHeight: "1.1",
    marginBottom: "6px",
    letterSpacing: "-0.02em",
  };

  const subtitleStyle = {
    fontSize: "17px",
    fontWeight: "550",
    color: "#64748b",
    lineHeight: "1.4",
  };

  const progressContainerStyle = {
    marginTop: "14px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  };

  const socialLinksContainerStyle = {
    marginTop: "12px",
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
  };

  const contentAreaStyle = {
    flex: 1,
    overflowY: "auto",
    padding: "24px",
    background: "#f8fafc",
  };

  const sectionCardStyle = {
    padding: "20px",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    marginBottom: "20px",
  };

  const sectionTitleStyle = {
    fontSize: "18px",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "18px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const cardRowStyle = {
    paddingTop: "6px",
    paddingBottom: "6px",
  };

  const footerStyle = {
    padding: "20px 28px",
    background: "#ffffff",
    borderTop: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    boxSizing: "border-box",
    flexShrink: 0,
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal-backdrop-custom"
        onClick={onClose}
      >
        <style>{`
          .modal-backdrop-custom {
            position: fixed;
            inset: 0;
            z-index: 50;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px 32px;
            background-color: rgba(15, 23, 42, 0.6);
            backdrop-filter: blur(4px);
            transition: left 0.2s ease;
            left: 0;
          }
          @media (min-width: 1024px) {
            .modal-backdrop-custom {
              left: ${isCollapsed ? "96px" : "284px"} !important;
            }
          }
          .modal-rebuilt-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
          }
          @media (min-width: 1024px) {
            .modal-rebuilt-grid {
              grid-template-columns: 45% 55% !important;
              gap: 32px !important;
            }
          }
          .modal-container-custom {
            width: 95vw;
            max-height: 85vh;
            height: 85vh;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 24px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
            transition: all 0.2s ease;
          }
          @media (min-width: 640px) {
            .modal-container-custom {
              width: 90vw;
              max-height: 82vh;
              height: 82vh;
            }
          }
          @media (min-width: 1024px) {
            .modal-container-custom {
              width: 850px;
              max-height: 82vh;
              height: 82vh;
            }
          }
          @media (min-width: 1280px) {
            .modal-container-custom {
              width: 920px;
              max-height: 82vh;
              height: 82vh;
            }
          }
          .close-btn-hover:hover {
            background-color: #f1f5f9 !important;
            color: #475569 !important;
          }
          .modal-footer-custom {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            padding: 20px 28px !important;
            background-color: #ffffff !important;
            border-top: 1px solid var(--border-color, #e2e8f0) !important;
            flex-shrink: 0;
            width: 100%;
            box-sizing: border-box;
          }
          .modal-footer-group-left {
            display: flex;
            align-items: center;
            gap: 12px;
            flex-wrap: wrap;
          }
          .modal-footer-group-right {
            display: flex;
            align-items: center;
            gap: 12px;
            flex-wrap: wrap;
          }
          .modal-footer-btn {
            height: 42px !important;
            border-radius: 12px !important;
            font-size: 14px !important;
            font-weight: 600 !important;
            padding-left: 18px !important;
            padding-right: 18px !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            white-space: nowrap !important;
            transition: all 0.2s ease !important;
            box-sizing: border-box !important;
          }
          .modal-footer-btn-primary {
            min-width: 150px !important;
          }
          .modal-footer-btn-secondary {
          }
          .modal-footer-btn-message {
            min-width: 165px !important;
            gap: 8px !important;
          }
          .modal-footer-btn-icon {
            width: 18px !important;
            height: 18px !important;
            flex-shrink: 0 !important;
          }
          @media (max-width: 768px) {
            .modal-footer-custom {
              flex-direction: column !important;
              align-items: stretch !important;
              gap: 12px !important;
            }
            .modal-footer-group-left {
              justify-content: center !important;
            }
            .modal-footer-group-right {
              justify-content: center !important;
            }
          }
          @media (max-width: 480px) {
            .modal-footer-group-left {
              flex-direction: column !important;
              align-items: stretch !important;
              width: 100% !important;
            }
            .modal-footer-group-right {
              flex-direction: column !important;
              align-items: stretch !important;
              width: 100% !important;
            }
            .modal-footer-btn {
              width: 100% !important;
            }
          }
        `}</style>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="modal-container-custom"
          onClick={(e) => e.stopPropagation()}
        >
          {loading ? (
            <div className="flex items-center justify-center flex-1">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : student ? (
            <>
              {/* HEADER */}
              <div style={headerStyle}>
                <button
                  onClick={onClose}
                  style={closeButtonStyle}
                  className="close-btn-hover"
                >
                  <X className="w-5 h-5" />
                </button>

                <div style={headerContentWrapperStyle}>
                  {/* Avatar 76px */}
                  <div style={avatarContainerStyle}>
                    {student.image ? (
                      <img
                        src={student.image}
                        alt={`${student.firstName} ${student.lastName}`}
                        style={avatarImageStyle}
                      />
                    ) : (
                      <div style={avatarPlaceholderStyle}>
                        <User className="w-10 h-10" />
                      </div>
                    )}
                  </div>

                  <div style={headerTextContainerStyle}>
                    <h2 style={nameStyle}>
                      {student.firstName} {student.lastName}
                    </h2>
                    <p style={subtitleStyle}>
                      {student.branch || "Student"} • Class of {student.graduationYear || "N/A"}
                    </p>

                    {/* Profile Completeness Progress Bar (14px below subtitle) */}
                    {student.profileCompleteness !== undefined && (
                      <div style={progressContainerStyle}>
                        <div style={{ flex: 1, height: "8px", background: "#f1f5f9", borderRadius: "9999px", overflow: "hidden", maxWidth: "200px" }}>
                          <div
                            style={{
                              height: "100%",
                              width: `${student.profileCompleteness}%`,
                              borderRadius: "9999px",
                              transition: "width 0.3s ease",
                              backgroundColor: student.profileCompleteness >= 80 ? "#10b981" : student.profileCompleteness >= 50 ? "#f59e0b" : "#ef4444",
                            }}
                          />
                        </div>
                        <span style={{ fontSize: "14px", fontWeight: "600", color: "#64748b" }}>
                          {student.profileCompleteness}% complete
                        </span>
                      </div>
                    )}

                    {/* Social Links (12px below progress bar) */}
                    <div style={socialLinksContainerStyle}>
                      {(student.linkedIn?.linkedInUrl || student.linkedinUrl) && (
                        <a
                          href={student.linkedIn?.linkedInUrl || student.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-xs font-semibold hover:bg-blue-100/50 hover:text-blue-700 transition-all duration-200"
                        >
                          <Link className="w-3.5 h-3.5" />
                          LinkedIn
                          <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                        </a>
                      )}
                      {student.githubUrl && (
                        <a
                          href={
                            student.githubUrl.startsWith("http")
                              ? student.githubUrl
                              : `https://github.com/${student.githubUrl}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 text-slate-700 border border-slate-250/80 text-xs font-semibold hover:bg-slate-100 hover:text-slate-900 transition-all duration-200"
                        >
                          <Code className="w-3.5 h-3.5" />
                          GitHub
                          <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                        </a>
                      )}
                      {student.portfolioUrl && (
                        <a
                          href={student.portfolioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs font-semibold hover:bg-emerald-100/50 hover:text-emerald-700 transition-all duration-200"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Portfolio
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* SCROLLABLE CONTENT */}
              <div style={contentAreaStyle}>
                <div className="modal-rebuilt-grid">
                  
                  {/* Left Column (45%) */}
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    
                    {/* Contact Information Card */}
                    <div style={sectionCardStyle}>
                      <h3 style={sectionTitleStyle}>
                        <Mail className="w-5 h-5 text-slate-500" />
                        Contact Information
                      </h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div style={{ ...cardRowStyle, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                          <div style={{ marginBottom: "10px" }}>
                            <Mail className="w-5 h-5 text-slate-500" />
                          </div>
                          <span style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", tracking: "0.05em", marginBottom: "4px" }}>Email</span>
                          <span style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b", wordBreak: "break-all" }}>{student.email}</span>
                        </div>
                        
                        {student.phone && (
                          <div style={{ ...cardRowStyle, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                            <div style={{ marginBottom: "10px" }}>
                              <Phone className="w-5 h-5 text-slate-500" />
                            </div>
                            <span style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", tracking: "0.05em", marginBottom: "4px" }}>Phone</span>
                            <span style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b" }}>{student.phone}</span>
                          </div>
                        )}
                        
                        {(student.city || student.state || student.address) && (
                          <div style={{ ...cardRowStyle, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                            <div style={{ marginBottom: "10px" }}>
                              <MapPin className="w-5 h-5 text-slate-500" />
                            </div>
                            <span style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", tracking: "0.05em", marginBottom: "4px" }}>Location</span>
                            <span style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b" }}>
                              {[student.address, student.city, student.state]
                                .filter(Boolean)
                                .join(", ")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Education Card */}
                    <div style={sectionCardStyle}>
                      <h3 style={sectionTitleStyle}>
                        <GraduationCap className="w-5 h-5 text-slate-500" />
                        Education
                      </h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                        <div style={{ ...cardRowStyle, display: "flex", alignItems: "flex-start", gap: "10px" }}>
                          <Building2 className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <span style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", tracking: "0.05em", marginBottom: "2px" }}>University</span>
                            <p style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b", margin: 0, lineHeight: "1.4" }}>
                              {student.college?.name || "College not specified"}
                            </p>
                          </div>
                        </div>
                        
                        <div style={{ ...cardRowStyle, display: "flex", alignItems: "flex-start", gap: "10px" }}>
                          <GraduationCap className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <span style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", tracking: "0.05em", marginBottom: "2px" }}>Department</span>
                            <p style={{ fontSize: "14px", fontWeight: "600", color: "#334155", margin: 0, lineHeight: "1.4" }}>
                              {student.branch || "Branch not specified"}
                            </p>
                          </div>
                        </div>

                        <div style={{ ...cardRowStyle, display: "flex", alignItems: "flex-start", gap: "10px" }}>
                          <Calendar className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <span style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", tracking: "0.05em", marginBottom: "2px" }}>Expected Graduation</span>
                            <p style={{ fontSize: "14px", fontWeight: "600", color: "#334155", margin: 0, lineHeight: "1.4" }}>
                              {student.graduationYear || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Resume Card */}
                    {student.resume?.fileName && (
                      <div style={sectionCardStyle}>
                        <h3 style={sectionTitleStyle}>
                          <FileText className="w-5 h-5 text-slate-500" />
                          Resume
                        </h3>
                        <div style={{ padding: "20px", borderRadius: "16px", border: "1px solid #e2e8f0", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "16px", minWidth: 0, flex: 1 }}>
                            <div style={{ padding: "12px", borderRadius: "12px", background: "#fef2f2", color: "#ef4444", flexShrink: 0 }}>
                              <FileText className="w-6 h-6" />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                              <span style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={student.resume.fileName}>
                                {student.resume.fileName}
                              </span>
                              {student.resume.fileSize && (
                                <span style={{ fontSize: "12px", fontWeight: "600", color: "#94a3b8" }}>
                                  {(student.resume.fileSize / 1024).toFixed(1)} KB
                                </span>
                              )}
                            </div>
                          </div>
                          <div style={{ marginLeft: "auto", flexShrink: 0 }}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="shadow-sm border-slate-200 hover:bg-slate-100 hover:text-slate-900 font-semibold"
                              onClick={async () => {
                                try {
                                  await applicationsApi.downloadStudentResume(student._id);
                                  showToast({
                                    type: "success",
                                    message: "Resume downloaded!",
                                  });
                                } catch (error) {
                                  showToast({
                                    type: "error",
                                    message: "Failed to download resume",
                                  });
                                }
                              }}
                            >
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Right Column (55%) */}
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    
                    {/* About Card */}
                    {student.bio && (
                      <div style={sectionCardStyle}>
                        <h3 style={sectionTitleStyle}>
                          <User className="w-5 h-5 text-slate-500" />
                          About
                        </h3>
                        <p style={{ fontSize: "14px", color: "#475569", lineHeight: "1.8", maxWidth: "65ch", margin: 0, width: "100%" }}>
                          {student.bio}
                        </p>
                      </div>
                    )}

                    {/* Skills Card */}
                    {student.skills && student.skills.length > 0 && (
                      <div style={sectionCardStyle}>
                        <h3 style={sectionTitleStyle}>
                          <Code className="w-5 h-5 text-slate-500" />
                          Skills
                        </h3>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                          {student.skills.map((skill, index) => (
                            <span
                              key={index}
                              style={{
                                padding: "10px 16px",
                                borderRadius: "9999px",
                                background: "#f8fafc",
                                border: "1px solid #e2e8f0",
                                color: "#334155",
                                fontSize: "14px",
                                fontWeight: "600",
                                cursor: "default",
                              }}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Experience Card */}
                    {student.experience && student.experience.length > 0 && (
                      <div style={sectionCardStyle}>
                        <h3 style={sectionTitleStyle}>
                          <Briefcase className="w-5 h-5 text-slate-500" />
                          Experience
                        </h3>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          {student.experience.map((exp, index) => (
                            <div
                              key={index}
                              style={{
                                padding: "20px",
                                borderRadius: "16px",
                                border: "1px solid #e2e8f0",
                                background: "#f8fafc",
                                marginBottom: index === student.experience.length - 1 ? "0px" : "20px",
                              }}
                            >
                              <h4 style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", margin: 0 }}>
                                {exp.title}
                              </h4>
                              <p style={{ fontSize: "13px", fontWeight: "600", color: "#64748b", marginTop: "4px", marginBottom: 0 }}>
                                {exp.company}
                              </p>
                              {exp.description && (
                                <p
                                  style={{
                                    fontSize: "14px",
                                    color: "#475569",
                                    lineHeight: "1.85",
                                    marginTop: "12px",
                                    marginBottom: 0,
                                    maxWidth: "65ch",
                                    width: "100%",
                                  }}
                                >
                                  {exp.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Projects Card */}
                    {student.projects && student.projects.length > 0 && (
                      <div style={sectionCardStyle}>
                        <h3 style={sectionTitleStyle}>
                          <Star className="w-5 h-5 text-slate-500" />
                          Projects
                        </h3>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          {student.projects.map((project, index) => {
                            const techTags = getProjectTechTags(project.description);
                            return (
                              <div
                                key={index}
                                style={{
                                  padding: "20px",
                                  borderRadius: "16px",
                                  border: "1px solid #e2e8f0",
                                  background: "#f8fafc",
                                  marginBottom: index === student.projects.length - 1 ? "0px" : "20px",
                                }}
                              >
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                  <h4 style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", margin: 0 }}>
                                    {project.title || project.name}
                                  </h4>
                                  {project.link && (
                                    <a
                                      href={project.link.startsWith("http") ? project.link : `https://${project.link}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{ color: "#3b82f6", display: "inline-flex", alignItems: "center" }}
                                    >
                                      <ExternalLink className="w-4 h-4" />
                                    </a>
                                  )}
                                </div>
                                {project.description && (
                                  <p
                                    style={{
                                      fontSize: "14px",
                                      color: "#475569",
                                      lineHeight: "1.85",
                                      marginTop: "12px",
                                      marginBottom: 0,
                                      maxWidth: "65ch",
                                      width: "100%",
                                    }}
                                  >
                                    {project.description}
                                  </p>
                                )}
                                {techTags.length > 0 && (
                                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "18px" }}>
                                    {techTags.map((tech, techIdx) => (
                                      <span
                                        key={techIdx}
                                        style={{
                                          padding: "6px 12px",
                                          borderRadius: "8px",
                                          background: "#ffffff",
                                          border: "1px solid #e2e8f0",
                                          color: "#475569",
                                          fontSize: "12px",
                                          fontWeight: "600",
                                        }}
                                      >
                                        {tech}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  </div>

                </div>
              </div>

              {/* FIXED FOOTER */}
              <div style={footerStyle} className="modal-footer-custom">
                <div className="modal-footer-group-left">
                  {application && application.status === "pending" && onApprove && (
                    <Button
                      onClick={async () => {
                        await onApprove(application._id);
                        onClose();
                      }}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white modal-footer-btn modal-footer-btn-primary"
                    >
                      Approve Candidate
                    </Button>
                  )}
                  {application && application.status === "pending" && onShortlist && (
                    <Button
                      onClick={async () => {
                        await onShortlist(application._id, application.opportunity?._id || application.opportunity);
                        onClose();
                      }}
                      variant="outline"
                      className="modal-footer-btn modal-footer-btn-secondary"
                    >
                      Shortlist
                    </Button>
                  )}
                  {application && (application.status === "pending" || application.status === "shortlisted") && onRefer && (
                    <Button
                      onClick={async () => {
                        await onRefer(application._id, application.opportunity?._id || application.opportunity);
                        onClose();
                      }}
                      className="bg-primary hover:bg-primary/95 text-primary-foreground modal-footer-btn modal-footer-btn-secondary"
                    >
                      Sign & Refer
                    </Button>
                  )}
                  {application && application.status !== "rejected" && onReject && (
                    <Button
                      onClick={async () => {
                        if (window.confirm("Are you sure you want to reject this application?")) {
                          await onReject(application._id, application.opportunity?._id || application.opportunity);
                          onClose();
                        }
                      }}
                      variant="destructive"
                      className="modal-footer-btn modal-footer-btn-secondary"
                    >
                      Reject
                    </Button>
                  )}
                </div>

                <div className="modal-footer-group-right">
                  <Button
                    onClick={() => {
                      onClose();
                      navigate(`/referrals/chat?chatId=${student.chatId || ''}`);
                    }}
                    className="bg-primary text-primary-foreground hover:bg-primary/95 modal-footer-btn modal-footer-btn-message"
                  >
                    <MessageSquare className="modal-footer-btn-icon" />
                    <span>Message Student</span>
                  </Button>
                  <Button variant="outline" onClick={onClose} className="modal-footer-btn modal-footer-btn-secondary">
                    Close
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center flex-1 text-slate-450">
              <p>Student profile not found</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}