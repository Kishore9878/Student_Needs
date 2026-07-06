import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Briefcase, 
  ClipboardList, 
  ReceiptText, 
  LayoutDashboard, 
  Users, 
  ArrowRight,
  CheckCircle2,
  Calendar,
  TrendingUp,
  Award,
  CircleDot
} from "lucide-react";
import { motion } from "framer-motion";

/* ── Mockup Frames ───────────────────────────────────────────────────── */

function LaptopFrame({ children }) {
  return (
    <div className="w-full relative group">
      <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-indigo-500/20 to-cyan-500/20 rounded-[var(--radius-lg)] blur-xl opacity-75 group-hover:opacity-100 transition duration-1000" />
      <div className="laptop-mockup relative border border-border/80 rounded-[var(--radius-md)] bg-card shadow-[var(--shadow-lg)] overflow-hidden">
        <div className="bg-muted/60 px-4 py-2 border-b border-border/60 flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
        </div>
        <div className="p-5 text-[10.5px] text-foreground bg-background/50 backdrop-blur">
          {children}
        </div>
      </div>
      <div className="h-2 w-[85%] mx-auto bg-muted rounded-b-xl border-t border-border/40 shadow-[var(--shadow-md)]" />
    </div>
  );
}

function TabletFrame({ children }) {
  return (
    <div className="w-full relative group">
      <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 rounded-[var(--radius-lg)] blur-xl opacity-70 group-hover:opacity-100 transition duration-1000" />
      <div className="tablet-mockup relative border border-border/80 rounded-[var(--radius-lg)] bg-card shadow-[var(--shadow-lg)] overflow-hidden">
        <div className="bg-muted/40 px-4 py-2 border-b border-border/40 flex items-center justify-between">
          <div className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-500/50" />
            <span className="w-2 h-2 rounded-full bg-slate-500/50" />
          </div>
          <span className="text-[8px] font-bold text-muted-foreground">UniConnect Safe Sandbox</span>
        </div>
        <div className="p-4 text-[10px] text-foreground bg-background/40">
          {children}
        </div>
      </div>
    </div>
  );
}

function TutorRosterMockup() {
  return (
    <div className="sandbox-mockup-wrapper">
      <style>{`
        .sandbox-mockup-wrapper {
          width: 100% !important;
          max-width: 580px !important;
          margin: 0 auto !important;
          position: relative !important;
          box-sizing: border-box !important;
        }
        .sandbox-outer-card {
          position: relative !important;
          border: 1px solid var(--border-color, rgba(226, 232, 240, 0.8)) !important;
          border-radius: 18px !important;
          background-color: var(--card-bg, #ffffff) !important;
          box-shadow: var(--shadow-md) !important;
          padding: 12px !important;
          box-sizing: border-box !important;
          height: auto !important;
          min-height: fit-content !important;
          overflow: hidden !important;
        }
        @media (min-width: 768px) {
          .sandbox-outer-card {
            padding: 16px !important;
            border-radius: 24px !important;
          }
        }
        .sandbox-inner-dashboard {
          border-radius: 12px !important;
          overflow: hidden !important;
          background-color: rgba(15, 23, 42, 0.05) !important;
          border: 1px solid rgba(226, 232, 240, 0.6) !important;
          box-sizing: border-box !important;
        }
        [data-theme="dark"] .sandbox-inner-dashboard {
          background-color: rgba(15, 23, 42, 0.5) !important;
          border-color: rgba(255, 255, 255, 0.08) !important;
        }
        .sandbox-browser-header {
          background-color: rgba(15, 23, 42, 0.08) !important;
          padding: 8px 12px !important;
          border-bottom: 1px solid rgba(226, 232, 240, 0.4) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          box-sizing: border-box !important;
          height: 36px !important;
        }
        [data-theme="dark"] .sandbox-browser-header {
          background-color: rgba(15, 23, 42, 0.4) !important;
          border-bottom-color: rgba(255, 255, 255, 0.08) !important;
        }
        .sandbox-dots {
          display: flex !important;
          gap: 6px !important;
          align-items: center !important;
        }
        .sandbox-dot {
          width: 8px !important;
          height: 8px !important;
          border-radius: 50% !important;
          display: inline-block !important;
        }
        .sandbox-dot-red { background-color: #ef4444 !important; }
        .sandbox-dot-yellow { background-color: #f59e0b !important; }
        .sandbox-dot-green { background-color: #10b981 !important; }
        
        .sandbox-header-title {
          font-size: 11px !important;
          font-weight: 600 !important;
          color: var(--text-secondary, #64748b) !important;
          margin: 0 !important;
          padding-right: 2px !important;
        }
        .sandbox-roster-header {
          padding: 10px 14px !important;
          border-bottom: 1px solid rgba(226, 232, 240, 0.3) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          gap: 16px !important;
          box-sizing: border-box !important;
        }
        [data-theme="dark"] .sandbox-roster-header {
          border-bottom-color: rgba(255, 255, 255, 0.05) !important;
        }
        .sandbox-roster-title {
          font-size: 16px !important;
          font-weight: 700 !important;
          color: var(--text-primary, #0f172a) !important;
          margin: 0 !important;
        }
        .sandbox-filter-btn {
          font-size: 12px !important;
          font-weight: 600 !important;
          color: var(--primary, #3b82f6) !important;
          cursor: pointer !important;
          white-space: nowrap !important;
        }
        .sandbox-tutor-row {
          padding: 10px 14px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          gap: 12px !important;
          box-sizing: border-box !important;
          border-bottom: 1px solid rgba(226, 232, 240, 0.3) !important;
        }
        [data-theme="dark"] .sandbox-tutor-row {
          border-bottom-color: rgba(255, 255, 255, 0.05) !important;
        }
        .sandbox-tutor-row:last-child {
          border-bottom: none !important;
        }
        .sandbox-tutor-left {
          display: flex !important;
          align-items: center !important;
          gap: 12px !important;
          min-width: 0 !important;
        }
        .sandbox-tutor-avatar {
          width: 40px !important;
          height: 40px !important;
          border-radius: 50% !important;
          background-color: rgba(59, 130, 246, 0.15) !important;
          color: var(--primary, #3b82f6) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-weight: 700 !important;
          font-size: 14px !important;
          flex-shrink: 0 !important;
        }
        .sandbox-tutor-details {
          display: flex !important;
          flex-direction: column !important;
          gap: 2px !important;
          text-align: left !important;
        }
        .sandbox-tutor-name {
          font-size: 14px !important;
          font-weight: 600 !important;
          line-height: 1.25 !important;
          color: var(--text-primary, #0f172a) !important;
        }
        .sandbox-tutor-sub {
          font-size: 11px !important;
          color: var(--text-secondary, #64748b) !important;
          line-height: 1.4 !important;
          margin-top: 1px !important;
        }
        .sandbox-tutor-right {
          display: flex !important;
          flex-direction: column !important;
          align-items: flex-end !important;
          justify-content: center !important;
          gap: 2px !important;
          min-width: 80px !important;
          flex-shrink: 0 !important;
        }
        .sandbox-tutor-price {
          font-size: 14px !important;
          font-weight: 700 !important;
          color: #10b981 !important;
        }
        .sandbox-tutor-rating {
          font-size: 12px !important;
          font-weight: 500 !important;
          color: #f59e0b !important;
        }
        .sandbox-next-session {
          margin: 12px 14px 14px 14px !important;
          padding: 10px 12px !important;
          border-radius: 8px !important;
          background-color: var(--bg-surface-3, rgba(15, 23, 42, 0.05)) !important;
          border: 1px solid rgba(226, 232, 240, 0.5) !important;
          display: flex !important;
          align-items: flex-start !important;
          gap: 10px !important;
          text-align: left !important;
          box-sizing: border-box !important;
        }
        [data-theme="dark"] .sandbox-next-session {
          background-color: rgba(255, 255, 255, 0.03) !important;
          border-color: rgba(255, 255, 255, 0.08) !important;
        }
        .sandbox-next-title {
          font-size: 14px !important;
          font-weight: 600 !important;
          color: var(--text-primary, #0f172a) !important;
          line-height: 1.25 !important;
        }
        .sandbox-next-link {
          font-size: 11px !important;
          color: var(--text-secondary, #64748b) !important;
          line-height: 1.4 !important;
          margin-top: 1px !important;
          padding-bottom: 2px !important;
        }
      `}</style>
      
      <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 rounded-[var(--radius-lg)] blur-xl opacity-70 group-hover:opacity-100 transition duration-1000" />
      
      {/* Outer Card Wrapper */}
      <div className="sandbox-outer-card">
        
        {/* Inner Dashboard Container */}
        <div className="sandbox-inner-dashboard">
          
          {/* Top Browser Bar */}
          <div className="sandbox-browser-header">
            {/* Browser dots */}
            <div className="sandbox-dots">
              <span className="sandbox-dot sandbox-dot-red" />
              <span className="sandbox-dot sandbox-dot-yellow" />
              <span className="sandbox-dot sandbox-dot-green" />
            </div>
            {/* Safe Sandbox label */}
            <span className="sandbox-header-title">UniConnect Safe Sandbox</span>
          </div>

          {/* Content area */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            
            {/* Roster Header */}
            <div className="sandbox-roster-header">
              <span className="sandbox-roster-title">Verified Tutor Roster</span>
              <span className="sandbox-filter-btn">Filter By Subject</span>
            </div>

            {/* Roster list */}
            <div>
              {[
                { name: "Dr. Marcus Aurelius", sub: "CS-301 Data Algorithms", rating: "5.0 ★", price: "$25/hr" },
                { name: "Sarah Chen", sub: "React & Frontend Architecture", rating: "4.9 ★", price: "$30/hr" }
              ].map((tutor, i) => (
                <div key={i} className="sandbox-tutor-row">
                  {/* Left Column: Avatar + Name / Subject */}
                  <div className="sandbox-tutor-left">
                    <span className="sandbox-tutor-avatar">
                      {tutor.name.startsWith("Dr. ") ? tutor.name[4] : tutor.name[0]}
                    </span>
                    <div className="sandbox-tutor-details">
                      <div className="sandbox-tutor-name">{tutor.name}</div>
                      <div className="sandbox-tutor-sub">{tutor.sub}</div>
                    </div>
                  </div>
                  
                  {/* Right Column: Price + Rating */}
                  <div className="sandbox-tutor-right">
                    <div className="sandbox-tutor-price">{tutor.price}</div>
                    <div className="sandbox-tutor-rating">{tutor.rating}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Next Session Panel */}
            <div className="sandbox-next-session">
              <Calendar style={{ width: "24px", height: "24px", color: "var(--primary, #3b82f6)", flexShrink: 0, marginTop: "2px" }} />
              <div>
                <div className="sandbox-next-title">Next Session: Today 4:30 PM</div>
                <div className="sandbox-next-link">Room Link: meet.uniconnect.edu/cs301-marcus</div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

function ReferralMatchFeedMockup() {
  return (
    <div className="mobile-preview-wrapper">
      <style>{`
        .mobile-preview-wrapper {
          width: 100% !important;
          max-width: 420px !important;
          margin: 0 auto !important;
          position: relative !important;
          box-sizing: border-box !important;
        }
        .mobile-outer-frame {
          position: relative !important;
          background-color: var(--device-frame-bg, #f1f5f9) !important;
          border: 1px solid var(--border-color, rgba(226, 232, 240, 0.8)) !important;
          border-radius: 32px !important;
          padding: 12px !important;
          box-sizing: border-box !important;
          box-shadow: var(--shadow-lg) !important;
          height: auto !important;
          min-height: 0 !important;
          overflow: hidden !important;
        }
        [data-theme="dark"] .mobile-outer-frame {
          background-color: #1e293b !important;
          border-color: rgba(255, 255, 255, 0.08) !important;
        }
        @media (min-width: 768px) {
          .mobile-outer-frame {
            padding: 16px !important;
          }
        }
        .mobile-inner-screen {
          background-color: var(--card-bg, #ffffff) !important;
          border-radius: 26px !important;
          overflow: hidden !important;
          border: 1px solid rgba(226, 232, 240, 0.6) !important;
          box-sizing: border-box !important;
          position: relative !important;
          height: auto !important;
          min-height: 0 !important;
          padding-bottom: 24px !important;
        }
        [data-theme="dark"] .mobile-inner-screen {
          background-color: rgba(15, 23, 42, 0.4) !important;
          border-color: rgba(255, 255, 255, 0.08) !important;
        }
        .mobile-top-notch {
          width: 112px !important;
          height: 24px !important;
          background-color: #0f172a !important;
          border-radius: 0 0 16px 16px !important;
          position: absolute !important;
          top: 0 !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          z-index: 20 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        .mobile-notch-dot {
          width: 8px !important;
          height: 8px !important;
          border-radius: 50% !important;
          background-color: #1e293b !important;
        }
        .mobile-header {
          padding: 48px 20px 16px 20px !important;
          border-bottom: 1px solid rgba(226, 232, 240, 0.8) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          gap: 16px !important;
          box-sizing: border-box !important;
        }
        [data-theme="dark"] .mobile-header {
          border-bottom-color: rgba(255, 255, 255, 0.08) !important;
        }
        .mobile-header-title {
          font-size: 18px !important;
          font-weight: 700 !important;
          color: var(--text-primary, #0f172a) !important;
          margin: 0 !important;
          line-height: 1.25 !important;
        }
        .mobile-active-badge {
          font-size: 14px !important;
          font-weight: 600 !important;
          color: var(--primary, #3b82f6) !important;
          background-color: rgba(59, 130, 246, 0.1) !important;
          padding: 4px 8px !important;
          border-radius: 9999px !important;
          flex-shrink: 0 !important;
          line-height: 1 !important;
        }
        .mobile-referral-row {
          padding: 16px 20px !important;
          border-bottom: 1px solid rgba(226, 232, 240, 0.5) !important;
          box-sizing: border-box !important;
        }
        [data-theme="dark"] .mobile-referral-row {
          border-bottom-color: rgba(255, 255, 255, 0.05) !important;
        }
        .mobile-referral-row:last-child {
          border-bottom: none !important;
        }
        .mobile-row-top {
          display: flex !important;
          justify-content: space-between !important;
          align-items: flex-start !important;
          gap: 16px !important;
        }
        .mobile-company-info {
          display: flex !important;
          flex-direction: column !important;
          text-align: left !important;
        }
        .mobile-company-name {
          font-size: 18px !important;
          font-weight: 700 !important;
          color: var(--text-primary, #0f172a) !important;
          line-height: 1.25 !important;
        }
        .mobile-job-title {
          font-size: 14px !important;
          color: var(--text-secondary, #64748b) !important;
          margin-top: 4px !important;
          line-height: 1.25 !important;
        }
        .mobile-date {
          font-size: 14px !important;
          color: var(--text-secondary, #64748b) !important;
          flex-shrink: 0 !important;
        }
        .mobile-row-bottom {
          margin-top: 16px !important;
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          gap: 16px !important;
        }
        .mobile-status {
          font-size: 14px !important;
          font-weight: 600 !important;
          color: #06b6d4 !important;
          text-align: left !important;
        }
        .mobile-track-btn {
          font-size: 14px !important;
          font-weight: 600 !important;
          color: var(--text-primary, #0f172a) !important;
          background-color: rgba(15, 23, 42, 0.05) !important;
          border: 1px solid rgba(15, 23, 42, 0.1) !important;
          padding: 6px 12px !important;
          border-radius: 8px !important;
          cursor: pointer !important;
          white-space: nowrap !important;
        }
        [data-theme="dark"] .mobile-track-btn {
          color: var(--text-primary, #f8fafc) !important;
          background-color: rgba(255, 255, 255, 0.05) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
        }
      `}</style>

      <div className="absolute -inset-2 bg-gradient-to-r from-rose-500/20 to-amber-500/20 rounded-[var(--radius-lg)] blur-xl opacity-75 group-hover:opacity-100 transition duration-1000" />
      
      {/* Outer Device Frame */}
      <div className="mobile-outer-frame">
        
        {/* Inner Screen */}
        <div className="mobile-inner-screen">
          
          {/* Top Notch */}
          <div className="mobile-top-notch">
            <span className="mobile-notch-dot" />
          </div>

          {/* Header */}
          <div className="mobile-header">
            <span className="mobile-header-title">Referral Match Feed</span>
            <span className="mobile-active-badge">3 Active</span>
          </div>

          {/* Referral Rows */}
          <div>
            {[
              { company: "Stripe", title: "Software Engineer Intern", status: "Referral Approved", date: "Just now" },
              { company: "Google", title: "Associate Product PM", status: "Submitted to Portal", date: "3d ago" }
            ].map((job, i) => (
              <div key={i} className="mobile-referral-row">
                
                {/* Row Top: Company / Job Title & Timestamp */}
                <div className="mobile-row-top">
                  <div className="mobile-company-info">
                    <span className="mobile-company-name">{job.company}</span>
                    <span className="mobile-job-title">{job.title}</span>
                  </div>
                  <span className="mobile-date">{job.date}</span>
                </div>

                {/* Row Bottom: Status & Track Button */}
                <div className="mobile-row-bottom">
                  <span className="mobile-status">{job.status}</span>
                  <span className="mobile-track-btn">Track</span>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}

/* ── Preview Components ──────────────────────────────────────────────── */

const TutorialsPreview = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center border-b border-border/60 pb-2">
      <span className="font-bold text-foreground">Verified Tutor Roster</span>
      <span className="text-[9px] text-primary font-bold">Filter By Subject</span>
    </div>
    <div className="space-y-2">
      {[
        { name: "Dr. Marcus Aurelius", sub: "CS-301 Data Algorithms", rating: "5.0 ★", price: "$25/hr" },
        { name: "Sarah Chen", sub: "React & Frontend Architecture", rating: "4.9 ★", price: "$30/hr" }
      ].map((tutor, i) => (
        <div key={i} className="p-2.5 bg-card/65 border border-border rounded-[var(--radius-sm)] flex items-center justify-between shadow-[var(--shadow-sm)]">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-[8px]">{tutor.name[4]}</span>
            <div className="text-left">
              <div className="font-bold text-[9.5px] text-foreground">{tutor.name}</div>
              <div className="text-[8px] text-muted-foreground">{tutor.sub}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-[9px] text-emerald-500">{tutor.price}</div>
            <div className="text-[8px] text-amber-500 font-semibold">{tutor.rating}</div>
          </div>
        </div>
      ))}
    </div>
    <div className="p-3 bg-secondary/35 border border-border rounded-[var(--radius-md)] text-left">
      <div className="font-bold text-[9px] mb-1 text-foreground">📅 Next Session: Today 4:30 PM</div>
      <div className="text-[8.5px] text-muted-foreground">Room Link: meet.uniconnect.edu/cs301-marcus</div>
    </div>
  </div>
);



function BudgetTrackerMockup() {
  return (
    <div className="budget-preview-wrapper">
      <style>{`
        .budget-preview-wrapper {
          width: 100% !important;
          max-width: 600px !important;
          margin: 0 auto !important;
          position: relative !important;
          box-sizing: border-box !important;
        }
        .budget-glow-container {
          width: 100% !important;
          max-width: 600px !important;
          margin: 0 auto !important;
          position: relative !important;
          padding: 32px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          box-sizing: border-box !important;
        }
        @media (min-width: 768px) {
          .budget-glow-container {
            padding: 40px !important;
          }
        }
        .budget-outer-card {
          position: relative !important;
          border: 1px solid var(--border-color, rgba(226, 232, 240, 0.8)) !important;
          border-radius: 24px !important;
          background-color: var(--card-bg, #ffffff) !important;
          box-shadow: var(--shadow-lg) !important;
          padding: 16px !important;
          box-sizing: border-box !important;
          height: auto !important;
          min-height: fit-content !important;
          width: 100% !important;
          overflow: hidden !important;
        }
        @media (min-width: 768px) {
          .budget-outer-card {
            padding: 20px !important;
          }
        }
        .budget-inner-dashboard {
          border-radius: 16px !important;
          overflow: hidden !important;
          background-color: rgba(15, 23, 42, 0.05) !important;
          border: 1px solid rgba(226, 232, 240, 0.6) !important;
          box-sizing: border-box !important;
        }
        [data-theme="dark"] .budget-inner-dashboard {
          background-color: rgba(15, 23, 42, 0.5) !important;
          border-color: rgba(255, 255, 255, 0.08) !important;
        }
        .budget-browser-header {
          background-color: rgba(15, 23, 42, 0.08) !important;
          padding: 12px 20px !important;
          border-bottom: 1px solid rgba(226, 232, 240, 0.4) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          box-sizing: border-box !important;
          height: 44px !important;
        }
        [data-theme="dark"] .budget-browser-header {
          background-color: rgba(15, 23, 42, 0.4) !important;
          border-bottom-color: rgba(255, 255, 255, 0.08) !important;
        }
        .budget-dots {
          display: flex !important;
          gap: 6px !important;
          align-items: center !important;
        }
        .budget-dot {
          width: 8px !important;
          height: 8px !important;
          border-radius: 50% !important;
          display: inline-block !important;
        }
        .budget-dot-1 { background-color: rgba(148, 163, 184, 0.5) !important; }
        .budget-dot-2 { background-color: rgba(148, 163, 184, 0.5) !important; }
        
        .budget-header-title {
          font-size: 11px !important;
          font-weight: 700 !important;
          color: var(--text-secondary, #64748b) !important;
          margin: 0 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
        }
        .budget-header {
          padding: 16px 20px !important;
          border-bottom: 1px solid rgba(226, 232, 240, 0.5) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          gap: 16px !important;
          box-sizing: border-box !important;
        }
        [data-theme="dark"] .budget-header {
          border-bottom-color: rgba(255, 255, 255, 0.08) !important;
        }
        .budget-title {
          font-size: 16px !important;
          font-weight: 700 !important;
          color: var(--text-primary, #0f172a) !important;
          margin: 0 !important;
        }
        .budget-value {
          font-size: 16px !important;
          font-weight: 600 !important;
          color: #ef4444 !important;
        }
        .budget-remaining-card {
          margin: 16px 20px !important;
          padding: 20px 24px !important;
          background-color: var(--card-bg, #ffffff) !important;
          border: 1px solid rgba(226, 232, 240, 0.8) !important;
          border-radius: 12px !important;
          text-align: center !important;
          box-shadow: var(--shadow-sm) !important;
        }
        [data-theme="dark"] .budget-remaining-card {
          background-color: rgba(15, 23, 42, 0.4) !important;
          border-color: rgba(255, 255, 255, 0.05) !important;
        }
        .budget-remaining-label {
          font-size: 12px !important;
          font-weight: 600 !important;
          color: var(--text-secondary, #64748b) !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
        }
        .budget-remaining-amount {
          font-size: 24px !important;
          font-weight: 700 !important;
          color: var(--text-primary, #0f172a) !important;
          margin-top: 4px !important;
        }
        .budget-progress-container {
          margin: 12px 20px 12px 20px !important;
          box-sizing: border-box !important;
        }
        .budget-progress-bar {
          width: 100% !important;
          height: 8px !important;
          background-color: rgba(226, 232, 240, 0.8) !important;
          border-radius: 9999px !important;
          overflow: hidden !important;
          display: flex !important;
        }
        [data-theme="dark"] .budget-progress-bar {
          background-color: rgba(255, 255, 255, 0.1) !important;
        }
        .budget-progress-fill {
          height: 100% !important;
          background-color: #ef4444 !important;
        }
        .budget-row {
          padding: 16px 20px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          gap: 24px !important;
          box-sizing: border-box !important;
          border-bottom: 1px solid rgba(226, 232, 240, 0.5) !important;
        }
        [data-theme="dark"] .budget-row {
          border-bottom-color: rgba(255, 255, 255, 0.05) !important;
        }
        .budget-row:last-child {
          border-bottom: none !important;
        }
        .budget-row-left {
          display: flex !important;
          flex-direction: column !important;
          text-align: left !important;
        }
        .budget-item-name {
          font-size: 16px !important;
          font-weight: 600 !important;
          color: var(--text-primary, #0f172a) !important;
        }
        .budget-item-date {
          font-size: 14px !important;
          color: var(--text-secondary, #64748b) !important;
          margin-top: 4px !important;
        }
        .budget-item-val {
          font-size: 16px !important;
          font-weight: 600 !important;
          color: #ef4444 !important;
        }
      `}</style>

      <div className="budget-glow-container">
        {/* Outer Card Wrapper */}
        <div className="budget-outer-card">
          
          {/* Inner Screen */}
          <div className="budget-inner-dashboard">
            
            {/* Top Browser Bar */}
            <div className="budget-browser-header">
              <div className="budget-dots">
                <span className="budget-dot budget-dot-1" />
                <span className="budget-dot budget-dot-2" />
              </div>
              <span className="budget-header-title">UniConnect Safe Sandbox</span>
            </div>

            {/* Header */}
            <div className="budget-header">
              <span className="budget-title">Budget Tracker</span>
              <span className="budget-value">-$240 / $500</span>
            </div>

            {/* Remaining Card */}
            <div className="budget-remaining-card">
              <div className="budget-remaining-label">Monthly Remaining</div>
              <div className="budget-remaining-amount">$260.00</div>
            </div>

            {/* Progress Bar */}
            <div className="budget-progress-container">
              <div className="budget-progress-bar">
                <div className="budget-progress-fill" style={{ width: "48%" }} />
              </div>
            </div>

            {/* Rows */}
            <div>
              {[
                { label: "Starbucks Cafe (Food)", val: "-$5.80", date: "Today 1:15 PM" },
                { label: "Uber Ride (Transit)", val: "-$14.20", date: "Yesterday" }
              ].map((t, i) => (
                <div key={i} className="budget-row">
                  <div className="budget-row-left">
                    <span className="budget-item-name">{t.label}</span>
                    <span className="budget-item-date">{t.date}</span>
                  </div>
                  <span className="budget-item-val">{t.val}</span>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

function AttendanceMatrixMockup() {
  return (
    <div className="matrix-preview-wrapper">
      <style>{`
        .matrix-preview-wrapper {
          width: 100% !important;
          max-width: 600px !important;
          margin: 0 auto !important;
          position: relative !important;
          box-sizing: border-box !important;
        }
        .matrix-glow-container {
          width: 100% !important;
          max-width: 600px !important;
          margin: 0 auto !important;
          position: relative !important;
          padding: 32px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          box-sizing: border-box !important;
        }
        @media (min-width: 768px) {
          .matrix-glow-container {
            padding: 40px !important;
          }
        }
        .matrix-outer-card {
          position: relative !important;
          border: 1px solid var(--border-color, rgba(226, 232, 240, 0.8)) !important;
          border-radius: 24px !important;
          background-color: var(--card-bg, #ffffff) !important;
          box-shadow: var(--shadow-lg) !important;
          padding: 16px !important;
          box-sizing: border-box !important;
          height: auto !important;
          min-height: fit-content !important;
          width: 100% !important;
          overflow: hidden !important;
        }
        @media (min-width: 768px) {
          .matrix-outer-card {
            padding: 20px !important;
          }
        }
        .matrix-inner-dashboard {
          border-radius: 16px !important;
          overflow: hidden !important;
          background-color: rgba(15, 23, 42, 0.05) !important;
          border: 1px solid rgba(226, 232, 240, 0.6) !important;
          box-sizing: border-box !important;
        }
        [data-theme="dark"] .matrix-inner-dashboard {
          background-color: rgba(15, 23, 42, 0.5) !important;
          border-color: rgba(255, 255, 255, 0.08) !important;
        }
        .matrix-browser-header {
          background-color: rgba(15, 23, 42, 0.08) !important;
          padding: 12px 20px !important;
          border-bottom: 1px solid rgba(226, 232, 240, 0.4) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          box-sizing: border-box !important;
          height: 44px !important;
        }
        [data-theme="dark"] .matrix-browser-header {
          background-color: rgba(15, 23, 42, 0.4) !important;
          border-bottom-color: rgba(255, 255, 255, 0.08) !important;
        }
        .matrix-dots {
          display: flex !important;
          gap: 6px !important;
          align-items: center !important;
        }
        .matrix-dot {
          width: 8px !important;
          height: 8px !important;
          border-radius: 50% !important;
          display: inline-block !important;
        }
        .matrix-dot-1 { background-color: rgba(148, 163, 184, 0.5) !important; }
        .matrix-dot-2 { background-color: rgba(148, 163, 184, 0.5) !important; }
        
        .matrix-header-title {
          font-size: 11px !important;
          font-weight: 700 !important;
          color: var(--text-secondary, #64748b) !important;
          margin: 0 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
        }
        .matrix-header {
          padding: 16px 20px !important;
          border-bottom: 1px solid rgba(226, 232, 240, 0.5) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          gap: 16px !important;
          box-sizing: border-box !important;
        }
        [data-theme="dark"] .matrix-header {
          border-bottom-color: rgba(255, 255, 255, 0.08) !important;
        }
        .matrix-title {
          font-size: 18px !important;
          font-weight: 700 !important;
          color: var(--text-primary, #0f172a) !important;
          margin: 0 !important;
        }
        .matrix-safe-badge {
          font-size: 12px !important;
          font-weight: 700 !important;
          color: #10b981 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
        }
        .matrix-row {
          padding: 16px 20px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          gap: 24px !important;
          box-sizing: border-box !important;
          border-bottom: 1px solid rgba(226, 232, 240, 0.5) !important;
        }
        [data-theme="dark"] .matrix-row {
          border-bottom-color: rgba(255, 255, 255, 0.05) !important;
        }
        .matrix-row:last-child {
          border-bottom: none !important;
        }
        .matrix-row-left {
          display: flex !important;
          flex-direction: column !important;
          text-align: left !important;
        }
        .matrix-course-name {
          font-size: 16px !important;
          font-weight: 600 !important;
          color: var(--text-primary, #0f172a) !important;
        }
        .matrix-course-desc {
          font-size: 14px !important;
          color: var(--text-secondary, #64748b) !important;
          margin-top: 4px !important;
        }
        .matrix-row-right {
          display: flex !important;
          flex-direction: column !important;
          align-items: flex-end !important;
          text-align: right !important;
        }
        .matrix-rate {
          font-size: 18px !important;
          font-weight: 700 !important;
        }
        .matrix-status {
          font-size: 12px !important;
          color: var(--text-secondary, #64748b) !important;
          margin-top: 4px !important;
        }
      `}</style>

      <div className="matrix-glow-container">
        {/* Outer Card Wrapper */}
        <div className="matrix-outer-card">
          
          {/* Inner Screen */}
          <div className="matrix-inner-dashboard">
            
            {/* Top Browser Bar */}
            <div className="matrix-browser-header">
              <div className="matrix-dots">
                <span className="matrix-dot matrix-dot-1" />
                <span className="matrix-dot matrix-dot-2" />
              </div>
              <span className="matrix-header-title">UniConnect Safe Sandbox</span>
            </div>

            {/* Matrix Header */}
            <div className="matrix-header">
              <span className="matrix-title">Class Attendance Matrix</span>
              <span className="matrix-safe-badge">Safe</span>
            </div>

            {/* Rows */}
            <div>
              {[
                { course: "CS 301 (Algorithms)", attended: "19/20 lectures", rate: "95.0%", status: "Good Status", color: "#10b981" },
                { course: "MATH 310 (Probability)", attended: "14/18 lectures", rate: "77.7%", status: "Warning Status", color: "#f59e0b" }
              ].map((c, i) => (
                <div key={i} className="matrix-row">
                  <div className="matrix-row-left">
                    <span className="matrix-course-name">{c.course}</span>
                    <span className="matrix-course-desc">Attended: {c.attended}</span>
                  </div>
                  <div className="matrix-row-right">
                    <span className="matrix-rate" style={{ color: c.color }}>{c.rate}</span>
                    <span className="matrix-status">{c.status}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

const AlumniPreview = () => (
  <div className="space-y-3 text-left">
    <div className="flex justify-between items-center border-b border-border/60 pb-2">
      <span className="font-bold text-foreground">Verified Alumni Directory</span>
      <span className="text-[8px] text-muted-foreground">512 Mentors Active</span>
    </div>
    <div className="grid grid-cols-2 gap-2">
      {[
        { name: "Marcus Aurelius", role: "Staff Eng @ Linear", batch: "'18" },
        { name: "Diana Prince", role: "Product Manager @ Stripe", batch: "'20" }
      ].map((alumnus, i) => (
        <div key={i} className="p-2 bg-card border border-border rounded-[var(--radius-sm)] shadow-[var(--shadow-sm)] space-y-1">
          <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-[8px]">{alumnus.name[0]}</span>
          <div>
            <div className="font-bold text-[8.5px] text-foreground truncate">{alumnus.name}</div>
            <div className="text-[7.5px] text-muted-foreground truncate">{alumnus.role}</div>
            <div className="text-[6.5px] text-muted-foreground">Class of {alumnus.batch}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

function CentralDashboardMockup() {
  return (
    <div className="dashboard-preview-wrapper">
      <style>{`
        .dashboard-preview-wrapper {
          width: 100% !important;
          max-width: 650px !important;
          margin: 0 auto !important;
          position: relative !important;
          box-sizing: border-box !important;
        }
        .dashboard-glow-container {
          width: 100% !important;
          max-width: 650px !important;
          margin: 0 auto !important;
          position: relative !important;
          padding: 24px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          box-sizing: border-box !important;
        }
        @media (min-width: 768px) {
          .dashboard-glow-container {
            padding: 32px !important;
          }
        }
        .dashboard-browser-card {
          width: 100% !important;
          border: 1px solid var(--border-color, rgba(226, 232, 240, 0.8)) !important;
          border-radius: 24px !important;
          background-color: var(--card-bg, #ffffff) !important;
          box-shadow: var(--shadow-lg) !important;
          overflow: hidden !important;
          display: flex !important;
          flex-direction: column !important;
          box-sizing: border-box !important;
          min-height: 360px !important;
          height: auto !important;
        }
        .dashboard-browser-header {
          background-color: rgba(15, 23, 42, 0.04) !important;
          padding: 12px 20px !important;
          border-bottom: 1px solid rgba(226, 232, 240, 0.6) !important;
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
          box-sizing: border-box !important;
        }
        [data-theme="dark"] .dashboard-browser-header {
          background-color: rgba(15, 23, 42, 0.4) !important;
          border-bottom-color: rgba(255, 255, 255, 0.08) !important;
        }
        .dashboard-dot {
          width: 10px !important;
          height: 10px !important;
          border-radius: 50% !important;
          display: inline-block !important;
        }
        .dashboard-dot-red { background-color: rgba(239, 68, 68, 0.7) !important; }
        .dashboard-dot-yellow { background-color: rgba(245, 158, 11, 0.7) !important; }
        .dashboard-dot-green { background-color: rgba(16, 185, 129, 0.7) !important; }
        
        .dashboard-internal-content {
          padding: 24px !important;
          box-sizing: border-box !important;
          display: flex !important;
          flex-direction: column !important;
          flex-grow: 1 !important;
        }
        .dashboard-header-row {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          gap: 16px !important;
          margin-bottom: 20px !important;
          box-sizing: border-box !important;
        }
        .dashboard-header-left {
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
        }
        .dashboard-avatar-badge {
          width: 24px !important;
          height: 24px !important;
          border-radius: 50% !important;
          background-color: var(--primary, #6366f1) !important;
          color: white !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 10px !important;
          font-weight: 900 !important;
        }
        .dashboard-header-title {
          font-size: 16px !important;
          font-weight: 700 !important;
          color: var(--text-primary, #0f172a) !important;
        }
        .dashboard-header-right {
          font-size: 14px !important;
          color: var(--text-secondary, #64748b) !important;
        }
        .dashboard-metrics-grid {
          display: grid !important;
          grid-template-columns: repeat(3, 1fr) !important;
          gap: 16px !important;
          width: 100% !important;
        }
        .dashboard-metric-card {
          padding: 16px !important;
          border-radius: 12px !important;
          border: 1px solid var(--border-color, #e2e8f0) !important;
          background-color: var(--card-bg, #ffffff) !important;
          text-align: center !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
          box-sizing: border-box !important;
          height: 100% !important;
        }
        [data-theme="dark"] .dashboard-metric-card {
          background-color: rgba(15, 23, 42, 0.2) !important;
        }
        .dashboard-metric-label {
          font-size: 12px !important;
          font-weight: 600 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
          color: var(--text-secondary, #64748b) !important;
        }
        .dashboard-metric-value {
          font-size: 18px !important;
          font-weight: 700 !important;
          color: var(--text-primary, #0f172a) !important;
          margin-top: 4px !important;
        }
        .dashboard-referral-area {
          margin-top: 16px !important;
          padding: 16px !important;
          border-radius: 12px !important;
          border: 1px solid var(--border-color, #e2e8f0) !important;
          background-color: rgba(15, 23, 42, 0.02) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          gap: 16px !important;
          box-sizing: border-box !important;
        }
        [data-theme="dark"] .dashboard-referral-area {
          background-color: rgba(255, 255, 255, 0.02) !important;
        }
        .dashboard-referral-left {
          display: flex !important;
          flex-direction: column !important;
          text-align: left !important;
        }
        .dashboard-referral-title {
          font-size: 14px !important;
          font-weight: 700 !important;
          color: var(--text-primary, #0f172a) !important;
        }
        .dashboard-referral-desc {
          font-size: 12px !important;
          color: var(--text-secondary, #64748b) !important;
          margin-top: 4px !important;
        }
        .dashboard-passed-badge {
          font-size: 12px !important;
          font-weight: 900 !important;
          color: #10b981 !important;
          background-color: rgba(16, 185, 129, 0.1) !important;
          border: 1px solid rgba(16, 185, 129, 0.2) !important;
          padding: 6px 12px !important;
          border-radius: 6px !important;
          text-transform: uppercase !important;
        }
      `}</style>
      
      <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-indigo-500/20 to-cyan-500/20 rounded-[var(--radius-lg)] blur-xl opacity-75" />

      <div className="dashboard-glow-container">
        {/* Browser Card */}
        <div className="dashboard-browser-card">
          
          {/* Top Browser Bar */}
          <div className="dashboard-browser-header">
            <span className="dashboard-dot dashboard-dot-red" />
            <span className="dashboard-dot dashboard-dot-yellow" />
            <span className="dashboard-dot dashboard-dot-green" />
          </div>

          {/* Internal Content */}
          <div className="dashboard-internal-content">
            
            {/* Header Row */}
            <div className="dashboard-header-row">
              <div className="dashboard-header-left">
                <span className="dashboard-avatar-badge">U</span>
                <span className="dashboard-header-title">Student Workspace</span>
              </div>
              <span className="dashboard-header-right">Alex Rivera (CS)</span>
            </div>

            {/* Metrics Grid */}
            <div className="dashboard-metrics-grid">
              <div className="dashboard-metric-card">
                <span className="dashboard-metric-label">Tutorials</span>
                <span className="dashboard-metric-value">2 Booked</span>
              </div>
              <div className="dashboard-metric-card">
                <span className="dashboard-metric-label">Attendance</span>
                <span className="dashboard-metric-value" style={{ color: "#10b981" }}>94.2%</span>
              </div>
              <div className="dashboard-metric-card">
                <span className="dashboard-metric-label">Finances</span>
                <span className="dashboard-metric-value">$260 Left</span>
              </div>
            </div>

            {/* Referral Status Area */}
            <div className="dashboard-referral-area">
              <div className="dashboard-referral-left">
                <span className="dashboard-referral-title">Google PM Referral Approved</span>
                <span className="dashboard-referral-desc">Resume verified. Waiting for scheduler contact.</span>
              </div>
              <span className="dashboard-passed-badge">Passed</span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

/* ── Shared section styles ───────────────────────────────────────────── */
const sectionGrid = "grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full";
const textCol = "flex flex-col gap-5";
const featureHeading = "text-3xl md:text-4xl font-black text-foreground tracking-tight leading-tight";
const featureDesc = "text-sm text-muted-foreground leading-relaxed";

/* ── Page ────────────────────────────────────────────────────────────── */
export default function Features() {
  useEffect(() => {
    document.title = "UniConnect Features - Full Module Overview";
  }, []);

  return (
    <div className="w-full uc-modern-container" style={{ paddingTop: "52px", paddingBottom: "72px" }}>

      {/* PAGE HEADER */}
      <div className="text-center mb-14" style={{ maxWidth: "780px", margin: "0 auto 56px" }}>
        <span className="text-primary font-extrabold text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
          Modular Capabilities
        </span>
        <h1 className="mt-4 mb-4" style={{ fontSize: "clamp(28px, 4.5vw, 52px)", fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.1, color: "var(--text-heading)" }}>
          Modern Solutions for Student Operations
        </h1>
        <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.65, maxWidth: "600px", margin: "0 auto" }}>
          UniConnect replaces fragmented tools with a single premium software ecosystem. Explore the detailed sub-modules below.
        </p>
      </div>

      <div className="flex flex-col gap-0">
        <style>{`
          .tutorial-feature-section {
            display: grid !important;
            grid-template-columns: 1fr !important;
            align-items: center !important;
            gap: 48px !important;
            min-height: 0 !important;
            height: auto !important;
          }
          @media (min-width: 1024px) {
            .tutorial-feature-section {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
              column-gap: 80px !important;
              margin-bottom: 30px !important;
            }
          }
          .referral-feature-section {
            display: grid !important;
            grid-template-columns: 1fr !important;
            align-items: center !important;
            gap: 48px !important;
            min-height: 0 !important;
            height: auto !important;
          }
          @media (min-width: 1024px) {
            .referral-feature-section {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
              column-gap: 80px !important;
              margin-top: 30px !important;
            }
          }
          .feature-section-divider {
            width: 100% !important;
            height: 1px !important;
            background: rgba(148, 163, 184, 0.18) !important;
            margin: 24px 0 !important;
          }
          @media (min-width: 1024px) {
            .feature-section-divider {
              margin: 48px 0 !important;
            }
          }
        `}</style>

        {/* ── 1. TUTORIALS ──────────────────────────────────────────── */}
        <section className="tutorial-feature-section pt-10 md:pt-12 lg:pt-16 pb-10 md:pb-12 lg:pb-16">
          <div className={textCol}>
            <div className="w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center shadow-[var(--shadow-sm)] text-[var(--primary)] bg-[var(--primary)]/10 border border-[var(--primary)]/20">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className={featureHeading}>Academic Match &amp; Tutorials</h2>
            <p className={featureDesc}>
              Connect with top-performing student tutors at your university. Schedule calendar slots, access online code sandbox classrooms, and complete bookings securely in seconds.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-0 list-none">
              {["Search tutors by specific course codes", "Instant live calendar slot scheduler", "Built-in chat window and document sharing", "Synchronized course study logs"].map((b, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--primary)] shrink-0" />{b}
                </li>
              ))}
            </ul>
            <div>
              <Link to="/features/tutorials" className="uc-btn-primary inline-flex items-center gap-1.5">
                Deep-Dive into Tutorials <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
          <TutorRosterMockup />
        </section>

        <div className="feature-section-divider" />

        {/* ── 2. REFERRALS ──────────────────────────────────────────── */}
        <section className="referral-feature-section pt-10 md:pt-12 lg:pt-16 pb-10 md:pb-12 lg:pb-16">
          <div className="lg:order-first">
            <ReferralMatchFeedMockup />
          </div>
          <div className={textCol}>
            <div className="w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center shadow-[var(--shadow-sm)] text-cyan-400 bg-cyan-400/10 border border-cyan-400/20">
              <Briefcase className="w-6 h-6" />
            </div>
            <h2 className={featureHeading}>Alumni Referral Network</h2>
            <p className={featureDesc}>
              Accelerate your corporate internship search. Access exclusive job boards powered by verified alumni working at top tech and finance institutions.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-0 list-none">
              {["Direct pipeline referral requests", "Resume evaluation from alumni verifiers", "Private verifier message channels", "Real-time interview pipeline tracking"].map((b, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />{b}
                </li>
              ))}
            </ul>
            <div>
              <Link to="/features/referrals" className="uc-btn-primary bg-gradient-to-r from-cyan-500 to-indigo-500 inline-flex items-center gap-1.5">
                Explore Referral Systems <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        <div className="h-px bg-border/40" />

        {/* ── 3. ATTENDANCE ─────────────────────────────────────────── */}
        <section className="attendance-tracker-section">
          <style>{`
            .attendance-tracker-section {
              width: 100% !important;
              max-width: 1400px !important;
              margin: 0 auto !important;
              padding: 40px 24px !important;
              box-sizing: border-box !important;
              display: grid !important;
              grid-template-columns: 1fr !important;
              gap: 40px !important;
              align-items: center !important;
              min-height: 0 !important;
              height: auto !important;
            }
            @media (min-width: 768px) {
              .attendance-tracker-section {
                padding: 48px 32px !important;
                gap: 48px !important;
              }
            }
            @media (min-width: 1024px) {
              .attendance-tracker-section {
                padding: 64px 48px !important;
                grid-template-columns: 1fr 0.9fr !important;
                gap: 64px !important;
              }
            }
            .attendance-left-container {
              max-width: 680px !important;
              width: 100% !important;
              display: flex !important;
              flex-direction: column !important;
              box-sizing: border-box !important;
              text-align: left !important;
            }
            @media (min-width: 1024px) {
              .attendance-left-container {
                padding-right: 16px !important;
              }
            }
            .attendance-icon-wrapper {
              width: 56px !important;
              height: 56px !important;
              border-radius: 12px !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              box-shadow: var(--shadow-sm) !important;
              color: #10b981 !important;
              background-color: rgba(16, 185, 129, 0.1) !important;
              border: 1px solid rgba(16, 185, 129, 0.2) !important;
              margin-bottom: 24px !important;
            }
            .attendance-heading {
              font-size: 36px !important;
              font-weight: 800 !important;
              line-height: 1.15 !important;
              letter-spacing: -0.025em !important;
              color: var(--text-primary, #0f172a) !important;
              margin: 0 0 20px 0 !important;
            }
            @media (min-width: 1024px) {
              .attendance-heading {
                font-size: 48px !important;
              }
            }
            .attendance-desc {
              font-size: 18px !important;
              line-height: 2rem !important;
              color: var(--text-secondary, #64748b) !important;
              max-width: 650px !important;
              margin: 0 0 32px 0 !important;
            }
            .attendance-grid {
              display: grid !important;
              grid-template-columns: 1fr !important;
              gap: 16px !important;
              margin-bottom: 32px !important;
            }
            @media (min-width: 640px) {
              .attendance-grid {
                grid-template-columns: 1fr 1fr !important;
              }
            }
            .attendance-card {
              padding: 20px !important;
              border-radius: 12px !important;
              border: 1px solid var(--border-color, #e2e8f0) !important;
              background-color: var(--card-bg, #ffffff) !important;
              display: flex !important;
              flex-direction: column !important;
              box-sizing: border-box !important;
            }
            .attendance-card-header {
              display: flex !important;
              align-items: center !important;
              gap: 8px !important;
            }
            .attendance-card-title {
              font-size: 16px !important;
              font-weight: 600 !important;
              line-height: 1.25 !important;
              color: var(--text-primary, #0f172a) !important;
            }
            .attendance-card-desc {
              font-size: 14px !important;
              line-height: 1.5rem !important;
              color: var(--text-secondary, #64748b) !important;
              margin-top: 8px !important;
              text-align: left !important;
            }
            .attendance-cta-btn {
              display: inline-flex !important;
              align-items: center !important;
              gap: 12px !important;
              padding: 16px 28px !important;
              border-radius: 9999px !important;
              font-weight: 600 !important;
              font-size: 16px !important;
              margin-top: 32px !important;
              align-self: flex-start !important;
              background: linear-gradient(135deg, #10b981, #14b8a6) !important;
              color: white !important;
              transition: all 0.2s ease !important;
            }
            .attendance-cta-btn:hover {
              opacity: 0.95 !important;
              transform: translateY(-1px) !important;
            }
          `}</style>

          {/* Left Column */}
          <div className="attendance-left-container">
            <div className="attendance-icon-wrapper">
              <ClipboardList style={{ width: "24px", height: "24px" }} />
            </div>
            <h2 className="attendance-heading">Class Attendance Tracker</h2>
            <p className="attendance-desc">
              Never get locked out of credits. Monitor your university attendance requirements automatically, log classes with a single tap, and sync lists with tutor classrooms.
            </p>
            
            <div className="attendance-grid">
              {[
                { title: "⚠️ 75% Credit Limit Warning", desc: "Triggers automatic warning notifications as attendance drops below required margins." },
                { title: "🔄 Attendance Sync", desc: "Tutor bookings automatically update attendance states in the central dashboard databases." },
                { title: "📊 Automated Reports", desc: "Download formal PDF report tables representing class logs for university verifications." },
                { title: "🏫 Multi-Class Support", desc: "Manage complex block structures and laboratory schedules under one dashboard." }
              ].map((card, i) => (
                <div key={i} className="attendance-card">
                  <div className="attendance-card-header">
                    <span className="attendance-card-title">{card.title}</span>
                  </div>
                  <p className="attendance-card-desc">{card.desc}</p>
                </div>
              ))}
            </div>

            <div>
              <Link to="/features/attendance" className="attendance-cta-btn">
                Launch Attendance Module <ArrowRight style={{ width: "14px", height: "14px" }} />
              </Link>
            </div>
          </div>

          {/* Right Column: High Fidelity Large Attendance Matrix Preview */}
          <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <AttendanceMatrixMockup />
          </div>
        </section>

        <div className="h-px bg-border/40" />

        {/* ── 4. EXPENSES ───────────────────────────────────────────── */}
        <section className="expenses-budgeting-section">
          <style>{`
            .expenses-budgeting-section {
              width: 100% !important;
              max-width: 1400px !important;
              margin: 0 auto !important;
              padding: 40px 24px !important;
              box-sizing: border-box !important;
              display: grid !important;
              grid-template-columns: 1fr !important;
              gap: 40px !important;
              align-items: center !important;
              min-height: 0 !important;
              height: auto !important;
            }
            @media (min-width: 768px) {
              .expenses-budgeting-section {
                padding: 48px 32px !important;
                gap: 48px !important;
              }
            }
            @media (min-width: 1024px) {
              .expenses-budgeting-section {
                padding: 64px 48px !important;
                grid-template-columns: 1fr 0.9fr !important;
                gap: 64px !important;
              }
            }
            .expenses-left-container {
              max-width: 700px !important;
              width: 100% !important;
              display: flex !important;
              flex-direction: column !important;
              box-sizing: border-box !important;
              text-align: left !important;
            }
            @media (min-width: 1024px) {
              .expenses-left-container {
                padding-right: 16px !important;
              }
            }
            .expenses-icon-wrapper {
              width: 56px !important;
              height: 56px !important;
              border-radius: 12px !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              box-shadow: var(--shadow-sm) !important;
              color: #f43f5e !important;
              background-color: rgba(244, 63, 94, 0.1) !important;
              border: 1px solid rgba(244, 63, 94, 0.2) !important;
              margin-bottom: 24px !important;
            }
            .expenses-heading {
              font-size: 36px !important;
              font-weight: 800 !important;
              line-height: 1.15 !important;
              letter-spacing: -0.025em !important;
              color: var(--text-primary, #0f172a) !important;
              margin: 0 0 20px 0 !important;
            }
            @media (min-width: 1024px) {
              .expenses-heading {
                font-size: 48px !important;
              }
            }
            .expenses-desc {
              font-size: 18px !important;
              line-height: 2rem !important;
              color: var(--text-secondary, #64748b) !important;
              max-width: 680px !important;
              margin: 0 0 32px 0 !important;
            }
            .expenses-grid {
              display: grid !important;
              grid-template-columns: 1fr !important;
              gap: 16px !important;
              margin-bottom: 32px !important;
              width: 100% !important;
            }
            @media (min-width: 768px) {
              .expenses-grid {
                grid-template-columns: repeat(3, 1fr) !important;
              }
            }
            .expenses-card {
              padding: 20px !important;
              border-radius: 12px !important;
              border: 1px solid var(--border-color, #e2e8f0) !important;
              background-color: var(--card-bg, #ffffff) !important;
              display: flex !important;
              flex-direction: column !important;
              box-sizing: border-box !important;
              height: 100% !important;
            }
            .expenses-card-header {
              display: flex !important;
              align-items: center !important;
              gap: 8px !important;
            }
            .expenses-card-title {
              font-size: 16px !important;
              font-weight: 600 !important;
              line-height: 1.25 !important;
              color: var(--text-primary, #0f172a) !important;
            }
            .expenses-card-desc {
              font-size: 14px !important;
              line-height: 1.5rem !important;
              color: var(--text-secondary, #64748b) !important;
              margin-top: 8px !important;
              text-align: left !important;
            }
            .expenses-cta-btn {
              display: inline-flex !important;
              align-items: center !important;
              gap: 12px !important;
              padding: 16px 28px !important;
              border-radius: 9999px !important;
              font-weight: 600 !important;
              font-size: 16px !important;
              margin-top: 32px !important;
              align-self: flex-start !important;
              background: linear-gradient(135deg, #rose-500, #amber-500) !important;
              background-color: #f43f5e !important;
              color: white !important;
              transition: all 0.2s ease !important;
            }
            .expenses-cta-btn:hover {
              opacity: 0.95 !important;
              transform: translateY(-1px) !important;
            }
          `}</style>

          {/* Left Column */}
          <div className="expenses-left-container">
            <div className="expenses-icon-wrapper">
              <ReceiptText style={{ width: "24px", height: "24px" }} />
            </div>
            <h2 className="expenses-heading">Smart Expenses &amp; Budgeting</h2>
            <p className="expenses-desc">
              Control your academic term spending. Map out student category budgets, set strict limits, and visualize remaining allocations using responsive, real-time charts.
            </p>
            
            <div className="expenses-grid">
              {[
                { title: "💰 Spend Logs", desc: "Log expenses instantly on-the-go categorized by Food, Books, Transit." },
                { title: "📊 Analytics", desc: "Responsive category breakdowns showing monthly trends and budget variances." },
                { title: "🔔 Limit Alerts", desc: "Receive push notices as specific categories approach customized caps." }
              ].map((card, i) => (
                <div key={i} className="expenses-card">
                  <div className="expenses-card-header">
                    <span className="expenses-card-title">{card.title}</span>
                  </div>
                  <p className="expenses-card-desc">{card.desc}</p>
                </div>
              ))}
            </div>

            <div>
              <Link to="/features/expenses" className="expenses-cta-btn bg-gradient-to-r from-rose-500 to-amber-500">
                Explore Expenses System <ArrowRight style={{ width: "14px", height: "14px" }} />
              </Link>
            </div>
          </div>

          {/* Right Column: High Fidelity Budget Tracker Preview */}
          <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <BudgetTrackerMockup />
          </div>
        </section>

        <div className="h-px bg-border/40" />

        {/* ── 5. ALUMNI ─────────────────────────────────────────────── */}
        <section className="alumni-mentorship-section">
          <style>{`
            .alumni-mentorship-section {
              width: 100% !important;
              max-width: 1180px !important;
              margin: 0 auto !important;
              padding: 40px 24px !important; /* py-10 px-6 */
              box-sizing: border-box !important;
              display: grid !important;
              grid-template-columns: 1fr !important;
              gap: 32px !important; /* gap-8 */
              align-items: center !important;
              min-height: 0 !important;
              height: auto !important;
            }
            @media (min-width: 768px) {
              .alumni-mentorship-section {
                padding: 48px 32px !important; /* md:py-12 lg:px-8 */
                gap: 32px !important;
              }
            }
            @media (min-width: 1024px) {
              .alumni-mentorship-section {
                padding: 64px 32px !important; /* lg:py-16 lg:px-8 */
                grid-template-columns: 0.9fr 1.1fr !important;
                gap: 32px !important;
              }
            }
            .alumni-left-container {
              max-width: 500px !important;
              width: 100% !important;
              display: flex !important;
              flex-direction: column !important;
              box-sizing: border-box !important;
              text-align: left !important;
            }
            .alumni-icon-wrapper {
              width: 40px !important;
              height: 40px !important;
              border-radius: 10px !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              box-shadow: var(--shadow-sm) !important;
              color: #f59e0b !important;
              background-color: rgba(245, 158, 11, 0.1) !important;
              border: 1px solid rgba(245, 158, 11, 0.2) !important;
              margin-bottom: 16px !important; /* mb-4 */
            }
            .alumni-heading {
              font-size: 30px !important; /* text-3xl */
              font-weight: 700 !important;
              line-height: 1.08 !important;
              letter-spacing: -0.025em !important;
              color: var(--text-primary, #0f172a) !important;
              margin: 0 0 20px 0 !important;
            }
            @media (min-width: 768px) {
              .alumni-heading {
                font-size: 36px !important; /* md:text-4xl */
              }
            }
            @media (min-width: 1024px) {
              .alumni-heading {
                font-size: 38px !important; /* lg:text-[38px] */
              }
            }
            .alumni-desc {
              font-size: 16px !important; /* text-base */
              line-height: 28px !important; /* leading-7 */
              color: var(--text-secondary, #64748b) !important;
              max-width: 500px !important;
              margin: 0 0 24px 0 !important;
            }
            .alumni-cta-btn {
              display: inline-flex !important;
              align-items: center !important;
              gap: 12px !important;
              padding: 10px 20px !important; /* py-2.5 px-5 */
              border-radius: 9999px !important;
              font-weight: 600 !important;
              font-size: 16px !important; /* text-base */
              margin-top: 24px !important; /* mt-6 */
              align-self: flex-start !important;
              background: linear-gradient(135deg, #f59e0b, #e11d48) !important;
              color: white !important;
              transition: all 0.2s ease !important;
            }
            .alumni-cta-btn:hover {
              opacity: 0.95 !important;
              transform: translateY(-1px) !important;
            }
            
            /* Workflow Styles */
            .workflow-container {
              position: relative !important;
              width: 100% !important;
              max-width: 580px !important;
              margin-left: auto !important;
              display: flex !important;
              flex-direction: column !important;
              gap: 12px !important; /* gap-3 */
              box-sizing: border-box !important;
              align-self: center !important;
            }
            .workflow-connector-line {
              position: absolute !important;
              top: 26px !important;
              bottom: 26px !important;
              left: 32px !important; /* aligned to w-6 indicator center */
              width: 1px !important;
              border-left: 1px dashed var(--border-color, #e2e8f0) !important;
              z-index: 1 !important;
            }
            .workflow-step-card {
              position: relative !important;
              display: flex !important;
              align-items: start !important;
              gap: 12px !important; /* gap-3 */
              padding: 14px 20px !important; /* py-3.5 px-5 */
              border-radius: 12px !important; /* rounded-xl */
              border: 1px solid var(--border-color, #e2e8f0) !important;
              background-color: var(--card-bg, #ffffff) !important;
              box-sizing: border-box !important;
              z-index: 2 !important;
            }
            .workflow-step-indicator {
              width: 24px !important; /* w-6 */
              height: 24px !important; /* h-6 */
              flex-shrink: 0 !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              position: relative !important;
              z-index: 3 !important;
            }
            .workflow-step-dot-outer {
              width: 10px !important;
              height: 10px !important;
              border-radius: 50% !important;
              background-color: var(--card-bg, #ffffff) !important;
              border: 2px solid var(--primary, #6366f1) !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
            }
            .workflow-step-dot-inner {
              width: 3px !important;
              height: 3px !important;
              border-radius: 50% !important;
              background-color: var(--primary, #6366f1) !important;
              display: block !important;
              box-sizing: border-box !important;
            }
            .workflow-step-content {
              display: flex !important;
              flex-direction: column !important;
              text-align: left !important;
            }
            .workflow-step-header {
              display: flex !important;
              align-items: center !important;
              gap: 12px !important;
            }
            .workflow-step-num {
              font-size: 12px !important; /* text-xs */
              line-height: 1 !important; /* leading-none */
              font-weight: 700 !important;
              color: var(--primary, #6366f1) !important;
              letter-spacing: 0.05em !important;
            }
            .workflow-step-title {
              font-size: 16px !important; /* text-base */
              font-weight: 600 !important;
              line-height: 1.25 !important;
              color: var(--text-primary, #0f172a) !important;
            }
            .workflow-step-desc {
              font-size: 14px !important; /* text-sm */
              line-height: 24px !important; /* leading-6 */
              color: var(--text-secondary, #64748b) !important;
              margin-top: 6px !important; /* mt-1.5 */
            }
          `}</style>

          {/* Left Column */}
          <div className="alumni-left-container">
            <div className="alumni-icon-wrapper">
              <Users style={{ width: "20px", height: "20px" }} />
            </div>
            <h2 className="alumni-heading">Alumni Network Mentorship</h2>
            <p className="alumni-desc">
              Bridge the divide between university and high-paying careers. Match with verified alumni mentors for one-on-one resume consults, mock interviews, and direct corporate refer pathways.
            </p>
            <div>
              <Link to="/features/alumni" className="alumni-cta-btn bg-gradient-to-r from-amber-500 to-rose-500">
                Access Alumni Network <ArrowRight style={{ width: "14px", height: "14px" }} />
              </Link>
            </div>
          </div>

          {/* Right Column: Workflow Steps */}
          <div className="workflow-container">
            {/* Timeline Connector Line */}
            <div className="workflow-connector-line" />

            {[
              { step: "01", title: "Complete Verified Profile", desc: "Provide academic transcripts, verified Github profile links, and highlight technical projects." },
              { step: "02", title: "Search Verified Alumni Directory", desc: "Filter mentors by corporate companies (e.g. Stripe, Linear, Vercel) and graduation years." },
              { step: "03", title: "Schedule Consultation Session", desc: "Send direct chat requests for resume review, career mapping, or mock interview questions." },
              { step: "04", title: "Approve Corporate Referrals", desc: "Once a mentor validates your skills, get submitted to the company's internal fast-track hiring portals." }
            ].map((node, i) => (
              <div key={i} className="workflow-step-card">
                <div className="workflow-step-indicator">
                  <div className="workflow-step-dot-outer">
                    <span className="workflow-step-dot-inner" />
                  </div>
                </div>
                <div className="workflow-step-content">
                  <div className="workflow-step-header">
                    <span className="workflow-step-num">{node.step}</span>
                    <h4 className="workflow-step-title">{node.title}</h4>
                  </div>
                  <p className="workflow-step-desc">{node.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="h-px bg-border/40" />

        {/* ── 6. DASHBOARD ──────────────────────────────────────────── */}
        <section className="central-dashboard-section">
          <style>{`
            .central-dashboard-section {
              width: 100% !important;
              max-width: 1400px !important;
              margin: 0 auto !important;
              padding: 40px 24px !important;
              box-sizing: border-box !important;
              display: grid !important;
              grid-template-columns: 1fr !important;
              gap: 40px !important;
              align-items: center !important;
              min-height: 0 !important;
              height: auto !important;
            }
            @media (min-width: 768px) {
              .central-dashboard-section {
                padding: 48px 32px !important;
                gap: 48px !important;
              }
            }
            @media (min-width: 1024px) {
              .central-dashboard-section {
                padding: 64px 48px !important;
                grid-template-columns: 1fr 1fr !important;
                gap: 64px !important;
              }
            }
            .dashboard-left-col {
              width: 100% !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
            }
            .dashboard-right-container {
              max-width: 650px !important;
              width: 100% !important;
              display: flex !important;
              flex-direction: column !important;
              box-sizing: border-box !important;
              text-align: left !important;
            }
            .dashboard-icon-wrapper {
              width: 56px !important;
              height: 56px !important;
              border-radius: 12px !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              box-shadow: var(--shadow-sm) !important;
              color: var(--primary, #6366f1) !important;
              background-color: rgba(99, 102, 241, 0.1) !important;
              border: 1px solid rgba(99, 102, 241, 0.2) !important;
              margin-bottom: 24px !important;
            }
            .dashboard-heading {
              font-size: 36px !important;
              font-weight: 800 !important;
              line-height: 1.15 !important;
              letter-spacing: -0.025em !important;
              color: var(--text-primary, #0f172a) !important;
              margin: 0 0 20px 0 !important;
            }
            @media (min-width: 1024px) {
              .dashboard-heading {
                font-size: 48px !important;
              }
            }
            .dashboard-desc {
              font-size: 18px !important;
              line-height: 2rem !important;
              color: var(--text-secondary, #64748b) !important;
              max-width: 650px !important;
              margin: 0 0 28px 0 !important;
            }
            .dashboard-features-grid {
              display: grid !important;
              grid-template-columns: 1fr !important;
              gap: 16px !important;
              margin-bottom: 32px !important;
              width: 100% !important;
            }
            @media (min-width: 768px) {
              .dashboard-features-grid {
                grid-template-columns: 1fr 1fr !important;
                column-gap: 40px !important;
                row-gap: 16px !important;
              }
            }
            .dashboard-feature-item {
              display: flex !important;
              align-items: start !important;
              gap: 12px !important;
            }
            .dashboard-feature-icon {
              color: var(--primary, #6366f1) !important;
              margin-top: 4px !important;
              flex-shrink: 0 !important;
            }
            .dashboard-feature-text {
              font-size: 16px !important;
              line-height: 24px !important;
              color: var(--text-secondary, #64748b) !important;
              text-align: left !important;
            }
            .dashboard-cta-btn {
              display: inline-flex !important;
              align-items: center !important;
              gap: 12px !important;
              padding: 16px 28px !important;
              border-radius: 9999px !important;
              font-weight: 600 !important;
              font-size: 16px !important;
              margin-top: 32px !important;
              align-self: flex-start !important;
              background: linear-gradient(135deg, #8b5cf6, #6366f1) !important;
              color: white !important;
              transition: all 0.2s ease !important;
            }
            .dashboard-cta-btn:hover {
              opacity: 0.95 !important;
              transform: translateY(-1px) !important;
            }
          `}</style>

          {/* Left Column: Dashboard Mockup */}
          <div className="dashboard-left-col">
            <CentralDashboardMockup />
          </div>

          {/* Right Column */}
          <div className="dashboard-right-container">
            <div className="dashboard-icon-wrapper">
              <LayoutDashboard style={{ width: "24px", height: "24px" }} />
            </div>
            <h2 className="dashboard-heading">Central Student Dashboard</h2>
            <p className="dashboard-desc">
              Your academic operations command center. View upcoming tutor sessions, tracking statistics, remaining monthly budget metrics, and refer statuses on a single responsive screen.
            </p>
            
            <div className="dashboard-features-grid">
              {["Unified interface for all sub-modules", "Class list and tutor room links", "Instant system notifications feed", "Theme adaptive design systems"].map((b, i) => (
                <div key={i} className="dashboard-feature-item">
                  <CheckCircle2 className="dashboard-feature-icon" style={{ width: "16px", height: "16px" }} />
                  <span className="dashboard-feature-text">{b}</span>
                </div>
              ))}
            </div>

            <div>
              <Link to="/features/dashboard" className="dashboard-cta-btn">
                Deep-Dive into Dashboard <ArrowRight style={{ width: "14px", height: "14px" }} />
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
