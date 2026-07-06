import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  BookOpen, 
  Briefcase, 
  ClipboardList, 
  GraduationCap, 
  DollarSign, 
  Calendar, 
  AlertCircle, 
  CheckCircle,
  LayoutDashboard,
  Users
} from "lucide-react";
import { useCountUp } from "@/pages/UnifiedFlow.jsx";
import { motion } from "framer-motion";

export default function Home() {
  const [statsActive, setStatsActive] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    document.title = "UniConnect - All-in-One Student Operating System";
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsActive(true);
        }
      },
      { threshold: 0.15 }
    );
    const currentStatsRef = statsRef.current;
    if (currentStatsRef) observer.observe(currentStatsRef);

    return () => {
      if (currentStatsRef) observer.unobserve(currentStatsRef);
    };
  }, []);

  const studentsCount = useCountUp(10000, statsActive);
  const tutorsCount = useCountUp(500, statsActive);
  const sessionsCount = useCountUp(25000, statsActive);
  const referralsCount = useCountUp(1000, statsActive);

  return (
    <div className="flex flex-col items-center">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="w-full uc-modern-container" style={{ paddingTop: "56px", paddingBottom: "56px" }}>
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-16 items-center w-full">

          {/* LEFT: Copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="text-left flex flex-col gap-6"
          >
            <h1 className="uc-hero-title" style={{ fontSize: "clamp(32px, 5vw, 64px)", lineHeight: 1.08, fontWeight: 800, letterSpacing: "-0.03em" }}>
              The Operating System for Modern{" "}
              <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                Student Success
              </span>
            </h1>
            <p style={{ fontSize: "17px", lineHeight: 1.65, color: "var(--text-secondary)", maxWidth: "520px" }}>
              Manage academics, tutoring, attendance, finances, and career opportunities from one unified platform.
            </p>
            <div className="flex flex-wrap gap-3 select-none">
              <Link
                className="uc-btn-primary px-7 py-3.5 rounded-[var(--radius-md)] text-sm font-bold flex items-center gap-1.5 hover:scale-105 transition-all duration-300"
                to="/role-selection"
              >
                Get Started &rarr;
              </Link>
              <Link
                className="uc-btn-secondary px-7 py-3.5 rounded-[var(--radius-md)] text-sm font-bold transition-all duration-300 flex items-center gap-2"
                to="/features"
              >
                <svg className="w-4 h-4 text-current" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
                </svg>
                Watch Demo
              </Link>
            </div>
          </motion.div>

          {/* RIGHT: Dashboard preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65 }}
            className="w-full flex items-center justify-end min-w-0"
            aria-hidden="true"
          >
            <div 
              className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[20px] shadow-2xl relative overflow-hidden backdrop-blur-md"
              style={{
                width: 'min(100%, 580px)',
                maxWidth: '580px',
                height: '468px',
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box',
              }}
            >
              <style>{`
                .mock-db-header {
                  height: 44px !important;
                  display: flex !important;
                  align-items: center !important;
                  justify-content: space-between !important;
                  border-bottom: 1px solid var(--border-color) !important;
                  padding-left: 16px !important;
                  padding-right: 16px !important;
                  width: 100% !important;
                  box-sizing: border-box !important;
                }
                .mock-db-header-title {
                  font-size: 11px !important;
                  font-weight: 700 !important;
                  letter-spacing: 0.08em !important;
                  color: var(--text-secondary) !important;
                  text-transform: uppercase !important;
                }

                .mock-db-content {
                  display: flex !important;
                  flex-direction: column !important;
                  gap: 10px !important;
                  padding-left: 16px !important;
                  padding-right: 16px !important;
                  padding-top: 12px !important;
                  padding-bottom: 16px !important;
                  box-sizing: border-box !important;
                  width: 100% !important;
                }

                .mock-db-grid-2 {
                  display: grid !important;
                  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                  gap: 12px !important;
                  width: 100% !important;
                }
                @media (max-width: 639px) {
                  .mock-db-grid-2 {
                    grid-template-columns: 1fr !important;
                    gap: 10px !important;
                  }
                }

                .mock-db-card {
                  border-radius: 12px !important;
                  border: 1px solid rgba(148, 163, 184, 0.18) !important;
                  background-color: var(--bg-surface-1, white) !important;
                  min-width: 0 !important;
                  box-sizing: border-box !important;
                  width: 100% !important;
                }

                .mock-profile-card {
                  display: flex !important;
                  align-items: center !important;
                  gap: 12px !important;
                  padding: 12px 16px !important;
                  height: 86px !important;
                }

                .mock-attendance-card {
                  display: flex !important;
                  align-items: center !important;
                  justify-content: space-between !important;
                  padding: 12px 16px !important;
                  height: 86px !important;
                }

                .mock-budget-card {
                  display: flex !important;
                  flex-direction: column !important;
                  gap: 8px !important;
                  padding: 12px 16px !important;
                  height: 112px !important;
                }

                .mock-session-card {
                  display: flex !important;
                  align-items: center !important;
                  gap: 12px !important;
                  padding: 12px 16px !important;
                  height: 82px !important;
                }

                .mock-icon-wrapper-40 {
                  width: 40px !important;
                  height: 40px !important;
                  display: flex !important;
                  align-items: center !important;
                  justify-content: center !important;
                  border-radius: 8px !important;
                  flex-shrink: 0 !important;
                }
              `}</style>

              {/* Window bar */}
              <div className="mock-db-header">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-rose-500/80" />
                  <div className="w-2 h-2 rounded-full bg-amber-500/80" />
                  <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
                </div>
                <span className="mock-db-header-title">Live Dashboard</span>
              </div>

              {/* Dashboard Content */}
              <div className="mock-db-content">
                {/* Student Profile & Attendance Row */}
                <div className="mock-db-grid-2">
                  {/* Profile Card */}
                  <div className="mock-db-card mock-profile-card">
                    <div className="w-12 h-12 rounded-full bg-[var(--accent)] text-white flex items-center justify-center font-black shrink-0 text-md">
                      V
                    </div>
                    <div className="text-left min-w-0">
                      <h4 className="text-[15px] font-bold text-[var(--text-primary)] truncate">Vagmin</h4>
                      <p className="text-[12px] text-[var(--text-secondary)] truncate font-medium mt-0.5">CS Junior • GPA 3.82</p>
                    </div>
                  </div>

                  {/* Attendance Card */}
                  <div className="mock-db-card mock-attendance-card">
                    <div className="text-left flex flex-col gap-1">
                      <h4 className="text-[10px] uppercase tracking-wider font-bold text-[var(--text-secondary)]">Attendance</h4>
                      <p className="text-[20px] font-black text-emerald-500">94.2% Rate</p>
                    </div>
                    <div className="w-9 h-9 relative flex items-center justify-center shrink-0 ml-3">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15" stroke="currentColor" className="text-[var(--border-color)]" strokeWidth="3.5" fill="transparent" />
                        <circle cx="18" cy="18" r="15" stroke="currentColor" className="text-emerald-500" strokeWidth="3.5" strokeDasharray={94} strokeDashoffset={6} fill="transparent" />
                      </svg>
                      <span className="absolute text-[10px] font-bold text-emerald-500">94%</span>
                    </div>
                  </div>
                </div>

                {/* Budget Card */}
                <div className="mock-db-card mock-budget-card">
                  <div className="flex justify-between items-center">
                    <div className="text-left">
                      <h4 className="text-[10px] uppercase tracking-wider font-bold text-[var(--text-secondary)]">Monthly Budget</h4>
                      <p className="text-[16px] font-black text-[var(--text-primary)] mt-0.5">₹428.50 / ₹600.00</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/20">
                      Within Limit
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[var(--border-color)] rounded-full overflow-hidden flex my-0.5">
                    <div className="h-full bg-indigo-500" style={{ width: "45%" }} />
                    <div className="h-full bg-purple-500" style={{ width: "22%" }} />
                    <div className="h-full bg-cyan-400" style={{ width: "8%" }} />
                  </div>
                  <div className="flex justify-between items-center gap-3 pt-0.5 text-[12px] text-[var(--text-secondary)]">
                    <span className="inline-flex items-center gap-1">🍔 Food: ₹210</span>
                    <span className="inline-flex items-center gap-1">📚 Books: ₹120</span>
                    <span className="inline-flex items-center gap-1">🚇 Transit: ₹48</span>
                  </div>
                </div>

                {/* Tutor Booking */}
                <div className="mock-db-card mock-session-card">
                  <div className="mock-icon-wrapper-40 bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="text-left flex-grow min-w-0 flex flex-col gap-0.5">
                    <h4 className="text-[10px] uppercase tracking-wider font-bold text-[var(--text-secondary)]">Next Tutor Session</h4>
                    <p className="text-[14px] font-bold text-[var(--text-primary)] truncate">CS-301 Algorithms with Dr. Marcus</p>
                    <p className="text-[12px] text-indigo-500 font-semibold">Today at 4:30 PM (Online Match)</p>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 bg-indigo-500/15 text-indigo-500 rounded font-bold uppercase tracking-wider border border-indigo-500/20 shrink-0 ml-auto">
                    UPCOMING
                  </span>
                </div>

                {/* Referral */}
                <div className="mock-db-card mock-session-card">
                  <div className="mock-icon-wrapper-40 bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div className="text-left flex-grow min-w-0 flex flex-col gap-0.5">
                    <h4 className="text-[10px] uppercase tracking-wider font-bold text-[var(--text-secondary)]">Referrals &amp; Jobs</h4>
                    <p className="text-[14px] font-bold text-[var(--text-primary)] truncate">Stripe Intern Referral Approved</p>
                    <p className="text-[12px] text-cyan-500 font-semibold">Referred by Priya S. (Alumni '23)</p>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 bg-cyan-500/15 text-cyan-400 rounded-full font-bold uppercase tracking-wider border border-cyan-500/20 shrink-0 ml-auto animate-pulse">
                    Matched
                  </span>
                </div>
              </div>

              <div className="absolute -inset-px rounded-[20px] border border-[var(--border-color)] pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── LOGO STRIP ───────────────────────────────────────────────── */}
      <section className="trusted-organizations-section">
        <style>{`
          .trusted-organizations-section {
              width: 100% !important;
              height: auto !important;
              min-height: auto !important;
              overflow: visible !important;
              padding: 36px 64px 40px !important;
              box-sizing: border-box !important;
              background-color: var(--card-bg) !important;
              border-top: 1px solid var(--border-color) !important;
              display: block !important;
          }

          .trusted-organizations-container {
              width: 100% !important;
              max-width: 1440px !important;
              margin: 0 auto !important;
              display: flex !important;
              flex-direction: column !important;
              align-items: stretch !important;
          }

          .trusted-organizations-heading {
              margin: 0 0 28px !important;
              padding: 0 !important;
              text-align: center !important;
              text-transform: uppercase !important;
              letter-spacing: 0.2em !important;
              font-size: 10px !important;
              font-weight: 600 !important;
              color: var(--text-secondary) !important;
              display: block !important;
          }

          .trusted-organizations-grid {
              display: grid !important;
              grid-template-columns: repeat(6, minmax(0, 1fr)) !important;
              align-items: center !important;
              width: 100% !important;
              gap: 32px !important;
          }

          .trusted-organization-item {
              min-height: 48px !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              opacity: 0.6 !important;
              transition: opacity 0.3s ease !important;
              color: #94a3b8 !important; /* Muted slate/gray */
              font-size: 18px !important;
              font-weight: 600 !important;
              line-height: 1.3 !important;
              text-decoration: none !important;
          }

          .trusted-organization-item:hover {
              opacity: 1 !important;
          }

          .mit-item {
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              gap: 10px !important;
              font-weight: 800 !important;
              letter-spacing: -0.04em !important;
          }

          .mit-bars {
              display: flex !important;
              gap: 2px !important;
              flex-shrink: 0 !important;
          }

          .mit-bar {
              width: 5px !important;
              height: 20px !important;
              background-color: currentColor !important;
          }

          @media (max-width: 1023px) {
              .trusted-organizations-grid {
                  grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
                  row-gap: 24px !important;
                  column-gap: 32px !important;
              }
              .trusted-organizations-section {
                  padding: 36px 32px 40px !important;
              }
          }
          @media (max-width: 639px) {
              .trusted-organizations-grid {
                  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                  row-gap: 20px !important;
                  column-gap: 24px !important;
              }
              .trusted-organizations-section {
                  padding: 36px 20px 40px !important;
              }
          }
        `}</style>
        <div className="trusted-organizations-container">
          <p className="trusted-organizations-heading">
            TRUSTED BY UNIVERSITIES &amp; ORGANIZATIONS
          </p>
          <div className="trusted-organizations-grid">
            <div className="trusted-organization-item font-serif">Stanford</div>
            <div className="trusted-organization-item mit-item">
              <div className="mit-bars">
                <div className="mit-bar" />
                <div className="mit-bar" />
                <div className="mit-bar" />
              </div>
              mit
            </div>
            <div className="trusted-organization-item font-sans">Google</div>
            <div className="trusted-organization-item font-sans italic">stripe</div>
            <div className="trusted-organization-item font-sans">amazon</div>
            <div className="trusted-organization-item font-mono font-bold tracking-[0.2em]">VERITEX</div>
          </div>
        </div>
      </section>

      {/* ── PLATFORM HIGHLIGHTS ──────────────────────────────────────── */}
      <section className="platform-overview-section">
        <style>{`
          .platform-overview-section {
              width: 100% !important;
              height: auto !important;
              min-height: auto !important;
              overflow: visible !important;
              padding: 48px 48px !important;
              box-sizing: border-box !important;
              display: block !important;
              background-color: transparent !important;
          }

          .platform-overview-container {
              width: 100% !important;
              max-width: 1440px !important;
              margin: 0 auto !important;
              display: flex !important;
              flex-direction: column !important;
              align-items: stretch !important;
          }

          .platform-heading-block {
              display: flex !important;
              flex-direction: column !important;
              align-items: center !important;
              text-align: center !important;
          }

          .platform-overview-label {
              margin: 0 !important;
              font-size: 12px !important;
              font-weight: 700 !important;
              text-transform: uppercase !important;
              letter-spacing: 0.05em !important;
              color: var(--accent) !important;
              display: block !important;
          }

          .platform-overview-title {
              margin: 14px 0 0 !important;
              font-size: 42px !important;
              font-weight: 800 !important;
              color: var(--text-primary) !important;
              letter-spacing: -0.025em !important;
              line-height: 1.15 !important;
          }

          .platform-overview-description {
              margin: 18px auto 0 !important;
              max-width: 850px !important;
              font-size: 15px !important;
              color: var(--text-secondary) !important;
              line-height: 1.6 !important;
          }

          .workflow-wrapper {
              position: relative !important;
              width: 100% !important;
              max-width: 1100px !important;
              margin: 48px auto 0 !important;
          }

          .workflow-grid {
              position: relative !important;
              z-index: 10 !important;
              display: grid !important;
              grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
              gap: 40px !important;
              width: 100% !important;
          }

          .workflow-item {
              display: flex !important;
              flex-direction: column !important;
              align-items: center !important;
              text-align: center !important;
              min-width: 0 !important;
              text-decoration: none !important;
          }

          .workflow-icon-wrapper {
              width: 68px !important;
              height: 68px !important;
              flex: 0 0 68px !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              border-radius: 9999px !important;
              background: var(--card-bg, #ffffff) !important;
              border: 2px solid var(--border-color) !important;
              color: var(--accent) !important;
              position: relative !important;
              z-index: 10 !important;
              transition: all 0.3s ease !important;
          }

          .workflow-icon-wrapper svg,
          .workflow-icon-wrapper > svg {
              width: 26px !important;
              height: 26px !important;
          }

          .workflow-item:hover .workflow-icon-wrapper {
              border-color: var(--accent) !important;
              box-shadow: var(--shadow-glow) !important;
          }

          .workflow-item-title {
              margin: 14px 0 0 !important;
              font-size: 18px !important;
              font-weight: 700 !important;
              line-height: 1.25 !important;
              color: var(--text-primary) !important;
              transition: color 0.3s ease !important;
          }

          .workflow-item:hover .workflow-item-title {
              color: var(--accent) !important;
          }

          .workflow-item-description {
              margin: 4px 0 0 !important;
              font-size: 15px !important;
              color: var(--text-secondary) !important;
              line-height: 1.4 !important;
              max-width: 160px !important;
          }

          .workflow-connector-line {
              position: absolute !important;
              top: 34px !important;
              left: 10% !important;
              right: 10% !important;
              border-top: 2px dashed var(--border-color) !important;
              z-index: 0 !important;
          }

          .workflow-link-row {
              width: 100% !important;
              margin-top: 36px !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
          }

          @media (max-width: 1023px) {
              .workflow-grid {
                  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                  gap: 28px !important;
              }
              .workflow-connector-line {
                  display: none !important;
              }
              .platform-overview-section {
                  padding: 48px 32px !important;
              }
          }
          @media (max-width: 639px) {
              .workflow-grid {
                  grid-template-columns: 1fr !important;
                  gap: 24px !important;
              }
              .platform-overview-section {
                  padding: 48px 24px !important;
              }
          }
        `}</style>
        <div className="platform-overview-container">
          <div className="platform-heading-block">
            <span className="platform-overview-label">Platform Overview</span>
            <h2 className="platform-overview-title">Everything You Need in One Place</h2>
            <p className="platform-overview-description">
              A unified student journey designed to support you from class registration to graduation and career placement.
            </p>
          </div>

          <div className="workflow-wrapper">
            <div className="workflow-connector-line" />
            
            <div className="workflow-grid">
              {[
                { to: "/features/tutorials", Icon: BookOpen, label: "Tutorials", sub: "Book Sessions" },
                { to: "/features/attendance", Icon: CheckCircle, label: "Attendance", sub: "Track Limits" },
                { to: "/features/expenses", Icon: DollarSign, label: "Expenses", sub: "Manage Budget" },
                { to: "/features/referrals", Icon: Briefcase, label: "Referrals", sub: "Find Opportunities" },
                { to: "/features/alumni", Icon: GraduationCap, label: "Alumni Hub", sub: "Stay Connected" },
              ].map(({ to, Icon, label, sub }) => (
                <Link key={to} to={to} className="workflow-item">
                  <div className="workflow-icon-wrapper">
                    <Icon className="w-[26px] h-[26px]" />
                  </div>
                  <h4 className="workflow-item-title">
                    {label}
                  </h4>
                  <p className="workflow-item-description">
                    {sub}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <div className="workflow-link-row">
            <Link to="/how-it-works" className="text-[var(--accent)] hover:text-[var(--accent-hover)] font-semibold inline-flex items-center gap-1.5 text-sm transition-colors">
              Learn more about the full workflow <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CORE MODULES (FEATURES PREVIEW) ─────────────────────────── */}
      <section className="w-full bg-[var(--bg-secondary)]/30 border-y border-[var(--border-color)]" style={{ padding: "60px 0" }}>
        <style>{`
          .core-modules-header {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            margin-bottom: 0 !important;
          }
          .core-modules-header span {
            margin: 0 !important;
            display: block !important;
          }
          .core-modules-header h2 {
            margin: 14px 0 0 !important;
            display: block !important;
          }
          .core-modules-header p {
            margin: 12px auto 0 !important;
            display: block !important;
          }

          .uc-core-modules-grid {
            display: grid !important;
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
            gap: 28px !important;
            width: 100% !important;
            margin-top: 40px !important;
          }
          @media (max-width: 1023px) {
            .uc-core-modules-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }
          }
          @media (max-width: 639px) {
            .uc-core-modules-grid {
              grid-template-columns: 1fr !important;
              gap: 22px !important;
            }
          }

          .uc-core-module-card {
            display: flex !important;
            flex-direction: column !important;
            min-height: 250px !important;
            height: 100% !important;
            background-color: var(--card-bg, white) !important;
            border: 1px solid rgba(148, 163, 184, 0.18) !important;
            border-radius: 18px !important;
            box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05) !important;
            box-sizing: border-box !important;
            text-align: left !important;
            transition: transform 200ms ease, box-shadow 200ms ease !important;
            position: relative !important;
            overflow: hidden !important;
          }

          /* Responsive padding */
          @media (min-width: 1024px) {
            .uc-core-module-card {
              padding: 28px 28px 26px 28px !important;
            }
          }
          @media (max-width: 1023px) {
            .uc-core-module-card {
              padding: 24px !important;
            }
          }

          .uc-core-module-card:hover {
            transform: translateY(-4px) !important;
            box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08) !important;
          }

          .uc-core-module-icon-wrapper {
            width: 56px !important;
            height: 56px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            border-radius: 14px !important;
            margin-bottom: 18px !important;
            flex-shrink: 0 !important;
          }

          .uc-core-module-card h3 {
            margin-top: 0 !important;
            margin-bottom: 10px !important;
            font-size: 22px !important;
            font-weight: 700 !important;
            line-height: 1.3 !important;
            color: var(--text-primary) !important;
          }

          .uc-core-module-card p {
            font-size: 16px !important;
            line-height: 1.6 !important;
            color: var(--text-secondary) !important;
            margin-bottom: 0 !important;
            width: 100% !important;
            min-width: 0 !important;
          }

          .uc-core-module-learn-more {
            margin-top: auto !important;
            padding-top: 20px !important;
            display: inline-flex !important;
            align-items: center !important;
            font-size: 14px !important;
            font-weight: 600 !important;
            color: var(--accent) !important;
            text-decoration: none !important;
            transition: color 150ms ease !important;
          }
          .uc-core-module-learn-more:hover {
            color: var(--accent-hover) !important;
            text-decoration: underline !important;
          }
        `}</style>
        <div className="uc-modern-container">
          <div className="core-modules-header">
            <span className="text-xs text-[var(--accent)] font-bold uppercase tracking-wider">Core Modules</span>
            <h2 className="uc-section-heading">Built for Every Part of Student Life</h2>
            <p style={{ maxWidth: "600px", margin: "0 auto", fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Discover how our core sub-modules integrate cleanly under the unified dashboard.
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
            className="uc-core-modules-grid"
          >
            {[
              {
                color: "indigo",
                Icon: BookOpen,
                title: "Tutorial Matchmaking",
                desc: "Connect with vetted student tutors and request bookings instantly with integrated calendar syncing.",
                to: "/features/tutorials",
              },
              {
                color: "cyan",
                Icon: Briefcase,
                title: "Job Referrals",
                desc: "Accelerate your career search with exclusive job boards powered by verified alumni networks.",
                to: "/features/referrals",
              },
              {
                color: "emerald",
                Icon: LayoutDashboard,
                title: "Attendance & Budget",
                desc: "Monitor your attendance limits and track monthly expenses with beautiful interactive charts.",
                to: "/features/attendance",
              },
            ].map(({ color, Icon, title, desc, to }) => (
              <motion.div
                key={to}
                variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
                className="uc-core-module-card"
              >
                <div>
                  <div className={`uc-core-module-icon-wrapper bg-${color}-500/10 text-${color}-500 border border-${color}-500/20 shadow-[var(--shadow-sm)]`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
                <Link to={to} className="uc-core-module-learn-more">
                  Learn more &rarr;
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── STATISTICS ───────────────────────────────────────────────── */}
      <section ref={statsRef} className="statistics-section">
        <style>{`
          .statistics-section {
              width: 100% !important;
              padding: 52px 48px !important;
              box-sizing: border-box !important;
              display: flex !important;
              justify-content: center !important;
          }

          .statistics-card {
              width: 100% !important;
              max-width: 1440px !important;
              margin: 0 auto !important;
              padding: 32px 24px !important;
              height: auto !important;
              min-height: 220px !important;
              background-color: var(--card-bg) !important;
              border: 1px solid var(--border-color) !important;
              border-radius: var(--radius-xl) !important;
              box-shadow: var(--shadow-md) !important;
              backdrop-filter: blur(12px) !important;
              box-sizing: border-box !important;
              display: block !important;
          }

          .statistics-grid {
              display: grid !important;
              grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
              width: 100% !important;
              height: auto !important;
          }

          .stat-item {
              min-height: 156px !important;
              padding: 16px 24px !important;
              display: flex !important;
              flex-direction: column !important;
              align-items: center !important;
              justify-content: center !important;
              text-align: center !important;
              box-sizing: border-box !important;
              position: relative !important;
          }

          .stat-icon {
              width: 56px !important;
              height: 56px !important;
              flex-shrink: 0 !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              border-radius: 9999px !important;
              margin-bottom: 18px !important;
          }

          .stat-number {
              margin: 0 !important;
              font-size: 36px !important;
              font-weight: 800 !important;
              color: var(--text-primary) !important;
              line-height: 1 !important;
          }

          .stat-label {
              margin-top: 10px !important;
              font-size: 11px !important;
              font-weight: 600 !important;
              color: var(--text-secondary) !important;
              line-height: 1.3 !important;
              text-transform: uppercase !important;
              letter-spacing: 0.05em !important;
              display: block !important;
          }

          .stat-item:not(:last-child)::after {
              content: "" !important;
              position: absolute !important;
              right: 0 !important;
              top: 15% !important;
              height: 70% !important;
              width: 1px !important;
              background: var(--border-color) !important;
          }

          @media (max-width: 1023px) {
              .statistics-section {
                  padding: 36px 32px !important;
              }
              .statistics-grid {
                  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                  row-gap: 24px !important;
              }
              .stat-item {
                  min-height: 140px !important;
              }
              .stat-item::after {
                  display: none !important;
              }
          }

          @media (max-width: 639px) {
              .statistics-section {
                  padding: 24px 20px !important;
              }
              .statistics-grid {
                  grid-template-columns: 1fr !important;
                  row-gap: 20px !important;
              }
              .stat-item {
                  min-height: auto !important;
                  padding: 12px 16px !important;
              }
              .stat-item:not(:last-child) {
                  border-bottom: 1px solid var(--border-color) !important;
              }
          }
        `}</style>
        <div className="statistics-card">
          <div className="statistics-grid">
            {[
              { Icon: Users, value: `${studentsCount.toLocaleString()}+`, label: "Active Students" },
              { Icon: GraduationCap, value: `${tutorsCount.toLocaleString()}+`, label: "Certified Tutors" },
              { Icon: BookOpen, value: `${sessionsCount.toLocaleString()}+`, label: "Sessions Completed" },
              { Icon: Briefcase, value: `${referralsCount.toLocaleString()}+`, label: "Job Referrals" },
            ].map(({ Icon, value, label }) => (
              <div key={label} className="stat-item">
                <div className="stat-icon bg-[var(--accent)]/10 text-[var(--accent)]">
                  <Icon className="w-6 h-6" />
                </div>
                <strong className="stat-number">{value}</strong>
                <span className="stat-label">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="w-full max-w-[1440px] mx-auto px-5 md:px-8 lg:px-10" style={{ paddingTop: "24px", paddingBottom: "48px" }}>
        <div 
          className="premium-cta-banner text-center rounded-[var(--radius-xl)] relative overflow-hidden shadow-[var(--shadow-lg)] flex flex-col items-center justify-center"
          style={{ paddingTop: "48px", paddingBottom: "48px", paddingLeft: "32px", paddingRight: "32px" }}
        >
          <div className="cta-blobs-container">
            <div className="cta-blob cta-blob-1" />
            <div className="cta-blob cta-blob-2" />
            <div className="cta-blob cta-blob-3" />
          </div>
          <div className="relative z-10 flex flex-col items-center" style={{ maxWidth: "680px", margin: "0 auto" }}>
            <h2 className="uc-section-heading text-white" style={{ marginBottom: "16px" }}>Ready to Upgrade Your Student Experience?</h2>
            <p className="text-white/80 text-base leading-relaxed" style={{ maxWidth: "520px", marginBottom: "32px" }}>
              Join the platform that thousands of university students use daily to manage their entire academic lifecycle.
            </p>
            <div className="flex justify-center gap-4 select-none flex-wrap">
              <Link className="uc-btn-primary px-8 py-3.5 rounded-[var(--radius-md)] text-sm font-bold flex items-center gap-1.5 hover:scale-105 transition-all duration-300" to="/role-selection">
                Get Started Now &rarr;
              </Link>
              <Link className="uc-btn-secondary px-8 py-3.5 text-white border border-white/20 rounded-[var(--radius-md)] text-sm font-bold hover:bg-white/10 transition-all duration-300" to="/features">
                Explore Features
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
