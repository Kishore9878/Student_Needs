import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Smile, 
  Heart, 
  Lightbulb, 
  Users, 
  Cpu, 
  Database, 
  Shield, 
  Layers, 
  Layout, 
  ArrowRight, 
  CheckCircle2, 
  Milestone 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function About() {
  const [selectedTech, setSelectedTech] = useState("react");

  useEffect(() => {
    document.title = "About UniConnect - Project Showcase & Architecture";
  }, []);

  const techStack = {
    react: {
      name: "React.js & Vite",
      desc: "Powers the client UI layer, featuring modular state management, lazy loading, and reactive component lifecycles.",
      role: "Client-Side SPA Architecture"
    },
    node: {
      name: "Node.js Environment",
      desc: "Executes the backend engine, orchestrating asynchronous requests and handling server-level task runners.",
      role: "Asynchronous Runtime"
    },
    express: {
      name: "Express.js Router",
      desc: "Serves endpoints for Tutor Matching, JWT Session verification, Expense Ledgers, and Contact Message inputs.",
      role: "RESTful HTTP API Router"
    },
    mongodb: {
      name: "MongoDB & Mongoose",
      desc: "Stores student credentials, class attendances, financial trackers, and contact messages in schema-enforced structures.",
      role: "NoSQL Database Storage"
    },
    lenis: {
      name: "Lenis Smooth Scroll",
      desc: "Enforces smooth, inertia-driven page movements across marketing layouts, improving readability and presentation.",
      role: "Web Scrolling Experience"
    },
    framer: {
      name: "Framer Motion",
      desc: "Calculates physics-based animations, page routing transitions, mobile side drawer slides, and interactive previews.",
      role: "Micro-animations Engine"
    }
  };

  return (
    <div className="w-full bg-background py-0">
      <style>{`
        /* Scoped styles for the About page to enforce clean layout and prevent conflicts */
        .about-page-container {
          width: 100%;
          max-width: 1440px;
          margin-left: auto;
          margin-right: auto;
          padding-left: 20px;
          padding-right: 20px;
          box-sizing: border-box;
        }
        @media (min-width: 768px) {
          .about-page-container {
            padding-left: 32px;
            padding-right: 32px;
          }
        }
        @media (min-width: 1200px) {
          .about-page-container {
            padding-left: 48px;
            padding-right: 48px;
          }
        }
        @media (min-width: 1440px) {
          .about-page-container {
            padding-left: 56px;
            padding-right: 56px;
          }
        }

        .about-hero-section,
        .mission-vision-grid,
        .why-uniconnect-section,
        .stack-section,
        .security-section,
        .roadmap-section {
          height: auto !important;
          min-height: 0 !important;
        }

        /* 1. Hero Section */
        .about-hero-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding-top: 0;
          padding-bottom: 0;
        }
        .about-hero-label {
          display: block;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #3b82f6;
          margin-top: 48px;
          margin-bottom: 0;
        }
        .about-hero-heading {
          font-size: clamp(32px, 5vw, 60px);
          font-weight: 700;
          letter-spacing: -0.025em;
          line-height: 1.15;
          margin-top: 14px !important;
          margin-bottom: 48px !important;
        }

        /* 2. Mission & Vision Section */
        .mission-vision-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
          padding-top: 0;
          padding-bottom: 0;
          margin-bottom: 56px !important;
        }
        @media (min-width: 768px) {
          .mission-vision-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            margin-bottom: 72px !important;
          }
        }
        @media (min-width: 1200px) {
          .mission-vision-grid {
            margin-bottom: 88px !important;
          }
        }

        .mission-vision-card {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          box-sizing: border-box;
          padding: 24px !important;
        }
        @media (min-width: 768px) {
          .mission-vision-card {
            padding: 28px 30px !important;
          }
        }
        @media (min-width: 1200px) {
          .mission-vision-card {
            padding: 36px 40px !important;
          }
        }

        .mission-vision-card .card-label {
          display: block;
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px !important;
        }
        .mission-vision-card .card-heading {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 12px !important;
          line-height: 1.25;
        }
        .mission-vision-card .card-desc {
          font-size: 16px;
          line-height: 1.75;
          margin-bottom: 14px !important;
        }
        .mission-vision-card .card-link {
          margin-top: auto;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 700;
          color: #3b82f6;
          user-select: none;
        }

        /* 3. Why UniConnect Section */
        .why-uniconnect-section {
          padding-top: 0 !important;
          padding-bottom: 56px !important;
        }
        @media (min-width: 768px) {
          .why-uniconnect-section {
            padding-bottom: 72px !important;
          }
        }
        @media (min-width: 1200px) {
          .why-uniconnect-section {
            padding-bottom: 96px !important;
          }
        }

        .about-story-section {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
          align-items: center;
        }
        @media (min-width: 1200px) {
          .about-story-section {
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
            column-gap: 64px;
          }
        }

        .about-story-content {
          padding: 0 !important;
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          box-sizing: border-box;
        }

        .about-story-content h2 {
          font-size: clamp(32px, 3vw, 44px) !important;
          font-weight: 700;
          line-height: 1.15 !important;
          letter-spacing: -0.02em !important;
          margin-bottom: 28px !important;
          margin-top: 0 !important;
        }

        .about-story-text {
          display: flex;
          flex-direction: column;
          gap: 0 !important;
        }
        .about-story-text p {
          font-size: 16px !important;
          line-height: 1.75 !important;
        }
        .about-story-text p:first-of-type {
          margin-bottom: 24px !important;
          margin-top: 0 !important;
        }
        .about-story-text p:last-of-type {
          margin-bottom: 32px !important;
          margin-top: 0 !important;
        }

        .about-story-actions {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          margin-top: 36px !important;
        }

        .why-features-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }
        @media (min-width: 640px) {
          .why-features-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        .why-feature-card {
          padding: 28px 30px !important;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }
        .why-feature-card .feature-icon-wrap {
          margin-bottom: 14px !important;
        }
        .why-feature-card h4 {
          font-size: 18px;
          font-weight: 700;
          margin-top: 0 !important;
          margin-bottom: 8px !important;
          line-height: 1.25;
        }
        .why-feature-card p {
          font-size: 15px;
          line-height: 1.625;
          margin: 0 !important;
        }

        /* 4. Interactive Platform Stack */
        .stack-section {
          padding-top: 0 !important;
          padding-bottom: 56px !important;
        }
        @media (min-width: 768px) {
          .stack-section {
            padding-bottom: 72px !important;
          }
        }
        @media (min-width: 1200px) {
          .stack-section {
            padding-bottom: 104px !important;
          }
        }

        .stack-title {
          font-size: clamp(32px, 3vw, 44px) !important;
          font-weight: 700;
          line-height: 1.15 !important;
          letter-spacing: -0.02em !important;
          margin-bottom: 14px !important;
          margin-top: 48px !important;
        }
        @media (min-width: 768px) {
          .stack-title {
            margin-top: 72px !important;
          }
        }
        @media (min-width: 1200px) {
          .stack-title {
            margin-top: 96px !important;
          }
        }

        .stack-desc {
          font-size: 16px !important;
          line-height: 1.625 !important;
          margin-bottom: 48px !important;
          margin-top: 0 !important;
        }

        .tech-stack-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
        }
        @media (min-width: 1200px) {
          .tech-stack-grid {
            grid-template-columns: 380px minmax(0, 1fr);
            gap: 40px;
          }
        }

        .stack-nav {
          display: flex;
          flex-direction: column;
          gap: 14px !important;
        }

        .stack-detail-card {
          padding: 32px !important;
          box-sizing: border-box;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          text-align: left;
        }
        @media (min-width: 1200px) {
          .stack-detail-card {
            padding: 48px 52px !important;
          }
        }

        .stack-detail-role {
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 12px !important;
          display: block;
        }
        .stack-detail-title {
          font-size: clamp(24px, 2.5vw, 32px);
          font-weight: 700;
          margin-bottom: 16px !important;
          margin-top: 0 !important;
        }
        .stack-detail-desc {
          font-size: 16px;
          line-height: 1.75;
          margin-bottom: 24px !important;
          margin-top: 0 !important;
        }

        /* 5. Security & Data Pipelines */
        .security-section {
          padding-top: 0 !important;
          padding-bottom: 56px !important;
        }
        @media (min-width: 768px) {
          .security-section {
            padding-bottom: 72px !important;
          }
        }
        @media (min-width: 1200px) {
          .security-section {
            padding-bottom: 96px !important;
          }
        }

        .security-title {
          font-size: clamp(32px, 3vw, 44px) !important;
          font-weight: 700;
          line-height: 1.15 !important;
          letter-spacing: -0.02em !important;
          text-align: center;
          margin-bottom: 40px !important;
          margin-top: 48px !important;
        }
        @media (min-width: 768px) {
          .security-title {
            margin-top: 72px !important;
          }
        }
        @media (min-width: 1200px) {
          .security-title {
            margin-top: 96px !important;
            margin-bottom: 56px !important;
          }
        }

        .security-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 28px !important;
        }
        @media (min-width: 768px) {
          .security-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (min-width: 1200px) {
          .security-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }

        .security-card {
          padding: 24px !important;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          height: auto;
        }
        @media (min-width: 1200px) {
          .security-card {
            padding: 32px 34px !important;
          }
        }

        .security-card .security-card-icon-wrap {
          margin-bottom: 20px !important;
        }
        .security-card .security-card-title {
          font-size: 18px;
          font-weight: 700;
          margin-top: 0 !important;
          margin-bottom: 0 !important;
          line-height: 1.25;
        }
        .security-card .security-card-desc {
          font-size: 15px;
          line-height: 1.625;
          margin-top: 14px !important;
          margin-bottom: 0 !important;
        }

        /* 6. Development Roadmap */
        .roadmap-section {
          padding-top: 0 !important;
          padding-bottom: 56px !important;
        }
        @media (min-width: 768px) {
          .roadmap-section {
            padding-bottom: 72px !important;
          }
        }
        @media (min-width: 1200px) {
          .roadmap-section {
            padding-bottom: 96px !important;
          }
        }

        .roadmap-title {
          font-size: clamp(32px, 3vw, 44px) !important;
          font-weight: 700;
          line-height: 1.15 !important;
          letter-spacing: -0.02em !important;
          text-align: center;
          margin-bottom: 40px !important;
          margin-top: 48px !important;
        }
        @media (min-width: 768px) {
          .roadmap-title {
            margin-top: 72px !important;
          }
        }
        @media (min-width: 1200px) {
          .roadmap-title {
            margin-top: 96px !important;
            margin-bottom: 56px !important;
          }
        }

        .roadmap-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 28px !important;
        }
        @media (min-width: 768px) {
          .roadmap-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (min-width: 1200px) {
          .roadmap-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }

        .roadmap-card {
          padding: 24px !important;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          height: auto;
        }
        @media (min-width: 1200px) {
          .roadmap-card {
            padding: 36px 34px !important;
          }
        }

        .roadmap-card .roadmap-card-date {
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #3b82f6;
          margin-bottom: 0 !important;
        }
        .roadmap-card .roadmap-card-title {
          font-size: 20px;
          font-weight: 700;
          margin-top: 18px !important;
          margin-bottom: 0 !important;
          line-height: 1.25;
        }
        .roadmap-card .roadmap-card-desc {
          font-size: 15px;
          line-height: 1.625;
          margin-top: 18px !important;
          margin-bottom: 0 !important;
        }
      `}</style>

      <div className="about-page-container flex flex-col gap-0">

        {/* HERO SECTION */}
        <section className="about-hero-section">
          <span className="about-hero-label">
            PROJECT PRESENTATION
          </span>
          <h1 className="about-hero-heading text-slate-900 dark:text-white">
            Unifying Student Operations
          </h1>
        </section>

        {/* MISSION & VISION */}
        <section className="mission-vision-grid">
          {/* Mission Card */}
          <div className="mission-vision-card rounded-2xl border border-slate-200 dark:border-border bg-white dark:bg-background/50 shadow-sm">
            <span className="card-label text-slate-700 dark:text-slate-300">
              Our Mission
            </span>
            <h3 className="card-heading text-slate-900 dark:text-white">
              Empower Academic Term Success
            </h3>
            <p className="card-desc text-slate-600 dark:text-slate-400">
              To consolidate all critical student resources—tutoring rosters, budget calculators, class checklists, and corporate job referral pipelines—into a single high-contrast desktop and mobile environment.
            </p>
            <div className="card-link">
              Verified Success Framework <ArrowRight className="w-4 h-4" />
            </div>
          </div>
          
          {/* Vision Card */}
          <div className="mission-vision-card rounded-2xl border border-slate-200 dark:border-border bg-white dark:bg-background/50 shadow-sm">
            <span className="card-label text-slate-700 dark:text-slate-300">
              Our Vision
            </span>
            <h3 className="card-heading text-slate-900 dark:text-white">
              Bridge the Career Placement Divide
            </h3>
            <p className="card-desc text-slate-600 dark:text-slate-400">
              To build a seamless, community-driven channel where students collaborate with verified alumni mentors to refine resumes, conduct interview pre-screenings, and secure corporate placement.
            </p>
            <div className="card-link">
              Alumni Endorsement Pipelines <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </section>

        {/* WHY UNICONNECT */}
        <section className="why-uniconnect-section">
          <div className="about-story-section">
            <div className="about-story-content">
              <h2 className="text-slate-900 dark:text-white">
                Why UniConnect Was Built
              </h2>
              <div className="about-story-text">
                <p className="text-slate-700 dark:text-slate-300">
                  University academics can be highly overwhelming. Students navigate separate portals for logging attendances, searching tutors, organizing meal plans, and requesting job postings.
                </p>
                <p className="text-slate-700 dark:text-slate-300">
                  UniConnect integrates these operations under a single account. Protected by secure JWT keys, students log financial transactions, match with peer mentors, and check attendance curves on one responsive dashboard.
                </p>
              </div>
              <div className="about-story-actions">
                <Link to="/role-selection" className="uc-btn-primary px-8 h-14 rounded-xl" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  Get Started Now
                </Link>
                <Link to="/features" className="uc-btn-secondary px-8 h-14 rounded-xl" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  Explore All Modules
                </Link>
              </div>
            </div>
            
            <div className="why-features-grid">
              {[
                { icon: Smile, title: "Student-First Design", desc: "No generic templates. Built with a dark-theme adaptive glassmorphic framework." },
                { icon: Heart, title: "Verification Checked", desc: "Tutors verify transcripts; alumni mentors verify email credentials." },
                { icon: Lightbulb, title: "Intelligent Warnings", desc: "Auto triggers alerts when budget drops or attendance curves warning states." },
                { icon: Users, title: "Unified Community", desc: "Fosters long-term networks spanning student juniors, peer tutors, and corporate seniors." }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="why-feature-card rounded-xl border border-slate-200 dark:border-border bg-white dark:bg-background/50 shadow-sm">
                    <div className="feature-icon-wrap w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h4 className="text-slate-900 dark:text-white">
                      {item.title}
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* INTERACTIVE TECH STACK */}
        <section className="stack-section border-t border-slate-200 dark:border-border">
          <div>
            <h2 className="stack-title text-slate-900 dark:text-white">
              Interactive Platform Stack
            </h2>
            <p className="stack-desc text-slate-600 dark:text-slate-400">
              Click a layer to inspect how the technology powers our operations.
            </p>
          </div>

          <div className="tech-stack-grid">
            {/* Tech selector buttons */}
            <div className="stack-nav select-none">
              {Object.keys(techStack).map((key) => (
                <button
                  key={key}
                  onClick={() => setSelectedTech(key)}
                  className={`stack-item ${
                    selectedTech === key
                      ? "stack-item-active"
                      : "stack-item-inactive"
                  }`}
                  type="button"
                >
                  <span className="text-base font-semibold">{techStack[key].name}</span>
                  <ArrowRight className="w-5 h-5 shrink-0" />
                </button>
              ))}
            </div>

            {/* Detail panel */}
            <div className="flex flex-col">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedTech}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="stack-detail-card rounded-2xl border border-slate-200 dark:border-border bg-white dark:bg-background/50 shadow-sm"
                >
                  <div>
                    <span className="stack-detail-role text-blue-500">
                      {techStack[selectedTech].role}
                    </span>
                    <h3 className="stack-detail-title text-slate-900 dark:text-white">
                      {techStack[selectedTech].name}
                    </h3>
                    <p className="stack-detail-desc text-slate-600 dark:text-slate-400">
                      {techStack[selectedTech].desc}
                    </p>
                  </div>
                  <div className="stack-detail-verified text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 shrink-0" /> Architecture Verified &amp; Deployed
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* SECURITY & DATA PIPELINES */}
        <section className="security-section border-t border-slate-200 dark:border-border">
          <h2 className="security-title text-slate-900 dark:text-white">
            Security &amp; Data Pipelines
          </h2>
          <div className="security-grid">
            {[
              { icon: Layout, title: "1. Client UI Layout", desc: "Responsive React layouts rendering dynamic CSS previews and sandboxes." },
              { icon: Shield, title: "2. JWT Authentication", desc: "Auth middleware intercepting API calls and verifying user roles." },
              { icon: Cpu, title: "3. Service Routers", desc: "API handlers query database models and processes calculations." },
              { icon: Database, title: "4. MongoDB Cluster", desc: "Secure schema collection sets validating user documents." }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="security-card rounded-2xl border border-slate-200 dark:border-border bg-white dark:bg-background/50 shadow-sm">
                  <div className="security-card-icon-wrap">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="security-card-title text-slate-900 dark:text-white">
                    {item.title}
                  </h4>
                  <p className="security-card-desc text-slate-600 dark:text-slate-400">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
 
        {/* DEVELOPMENT ROADMAP */}
        <section className="roadmap-section border-t border-slate-200 dark:border-border">
          <h2 className="roadmap-title text-slate-900 dark:text-white">
            Development Roadmap
          </h2>
          <div className="roadmap-grid">
            {[
              { year: "2025 Q1", title: "Project Core Planning", desc: "Created initial system flow charts to replace campus worksheets." },
              { year: "2025 Q3", title: "Private Alpha Launch", desc: "Onboarded initial student cohorts to test calendar slot bookings." },
              { year: "2026 Q1", title: "Version 1.0 Release", desc: "Deployed restful routers, JWT auth, and active alumni directories." },
              { year: "2026 Q2", title: "UX Refactoring v1.2", desc: "Completed premium dashboard previews, mobile navigation slides, and footer forms." }
            ].map((item, idx) => (
              <div key={idx} className="roadmap-card rounded-2xl border border-slate-200 dark:border-border bg-white dark:bg-background/50 shadow-sm">
                <span className="roadmap-card-date text-blue-500">
                  {item.year}
                </span>
                <h4 className="roadmap-card-title text-slate-900 dark:text-white">
                  {item.title}
                </h4>
                <p className="roadmap-card-desc text-slate-600 dark:text-slate-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
