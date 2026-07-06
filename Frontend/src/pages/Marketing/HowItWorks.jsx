import React, { useEffect, useState } from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const studentJourneySteps = [
  { step: "1", title: "Register Account", desc: "Create a student profile using your verified university email. Sync IT or CS branch details automatically." },
  { step: "2", title: "Find Verified Tutors", desc: "Browse through tutor lists filtered by academic courses. Check profiles of tutors like Dr. Rajesh Kumar." },
  { step: "3", title: "Book Study Session", desc: "Secure dates on the interactive tutor calendar. Manage booking schedules on the dashboard." },
  { step: "4", title: "Attend Classes", desc: "Review materials, chat with tutors in real-time rooms, and ensure logs are updated." },
  { step: "5", title: "Track Progress & Expenses", desc: "Check attendance percentages to keep averages above criteria, and log daily transaction budgets." },
  { step: "6", title: "Connect with Alumni", desc: "Browse the directory to find verifier professionals like Priya Verma at companies like Google or Amazon." },
  { step: "7", title: "Secure Internships & Placements", desc: "Request referrals, upload verified resumes, and accelerate your career path." }
];

const tutorJourneySteps = [
  { step: "1", title: "Register Profile", desc: "Create a tutor profile. Authenticate academic transcripts or expert teaching qualifications." },
  { step: "2", title: "List Subject Areas", desc: "Declare courses and subjects you teach. Sync with college curricula schedules." },
  { step: "3", title: "Define Calendar Availability", desc: "Open slot times for student bookings. Keep schedules organized." },
  { step: "4", title: "Accept Student Bookings", desc: "Manage incoming bookings requests. Coordinate doubts inside chat channels." },
  { step: "5", title: "Teach & Manage Attendance", desc: "Conduct tutoring hours and mark student presence checklists in the tutor portal." }
];

const faqs = [
  { q: "Who can use UniConnect?", a: "UniConnect is designed for university students and verified tutors/alumni. Any student with a valid university email can register and access all modules." },
  { q: "Is attendance tracking automated?", a: "Yes. Attendance is tracked per subject and per session. You receive real-time percentages and alerts if you fall below the minimum threshold." },
  { q: "How are tutors verified?", a: "Tutors upload academic credentials or teaching certifications which are reviewed before their profiles go live. Only verified tutors appear in search results." },
  { q: "Can I track expenses without a budget?", a: "Yes. You can log expenses freely. Setting a monthly budget unlocks prediction features, overage warnings, and savings goal tracking." },
  { q: "How do alumni referrals work?", a: "Alumni post verified job opportunities. Students can request referrals by submitting their resume directly. Alumni review and accept or decline referral requests." },
];

const successStories = [
  { name: "Priya Verma", company: "Google", text: "UniConnect helped me connect with the right alumni and land my dream internship within 3 months of using the referral module." },
  { name: "Arjun Mehta", company: "Amazon", text: "The expense tracker kept me on budget throughout my final year. I tracked over ₹80,000 in expenses and saved 18% compared to the previous year." },
  { name: "Dr. Rajesh Kumar", company: "BITS Pilani", text: "As a tutor, managing availability and bookings used to be chaotic. UniConnect simplified everything — my sessions are now 40% better utilized." },
];

export default function HowItWorks() {
  const [journeyMode, setJourneyMode] = useState("student");
  const [activeStep, setActiveStep] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [storyIndex, setStoryIndex] = useState(0);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    document.title = "About How UniConnect Works - Visual Journey";
  }, []);

  useEffect(() => {
    setActiveStep(0);
  }, [journeyMode]);

  const activeSteps = journeyMode === "student" ? studentJourneySteps : tutorJourneySteps;

  return (
    <div className="w-full bg-background" style={{ paddingTop: "56px", paddingBottom: "72px" }}>
      <div className="hiw-page-wrapper px-5 md:px-8 lg:px-10">
        <style>{`
          .hiw-page-wrapper {
            width: 100% !important;
            max-width: 1500px !important;
            margin: 0 auto !important;
            box-sizing: border-box !important;
          }

          .hiw-header-container {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            margin-bottom: 40px !important;
            gap: 12px !important;
            box-sizing: border-box !important;
          }

          .hiw-toggle-container {
            display: inline-flex !important;
            align-items: center !important;
            padding: 4px !important;
            border-radius: 12px !important;
            border: 1px solid var(--border-color, #e2e8f0) !important;
            background-color: var(--secondary, #f1f5f9) !important;
            margin-bottom: 40px !important;
            box-sizing: border-box !important;
          }

          .hiw-toggle-btn {
            padding: 10px 24px !important;
            border-radius: 8px !important;
            font-size: 14px !important;
            font-weight: 600 !important;
            cursor: pointer !important;
            border: none !important;
            transition: all 0.2s ease !important;
            box-sizing: border-box !important;
            text-transform: uppercase !important;
            letter-spacing: 0.05em !important;
          }

          .hiw-toggle-btn.active {
            background-color: var(--primary, #3b82f6) !important;
            color: #ffffff !important;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
          }

          .hiw-toggle-btn.inactive {
            background-color: transparent !important;
            color: var(--text-secondary, #64748b) !important;
          }

          .hiw-toggle-btn.inactive:hover {
            color: var(--text-primary, #0f172a) !important;
          }

          .hiw-grid-layout {
            display: grid !important;
            grid-template-columns: 1fr !important;
            gap: 48px !important;
            align-items: start !important;
            margin-bottom: 64px !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }

          @media (min-width: 1024px) {
            .hiw-grid-layout {
              grid-template-columns: 360px minmax(0, 1fr) !important;
            }
          }

          .hiw-timeline-wrapper {
            position: relative !important;
            padding: 12px 16px !important;
            display: flex !important;
            flex-direction: column !important;
            box-sizing: border-box !important;
          }

          .hiw-timeline-line {
            position: absolute !important;
            left: 32px !important;
            top: 28px !important;
            bottom: 28px !important;
            width: 2px !important;
            background-color: var(--border-color, #e2e8f0) !important;
            z-index: 1 !important;
          }

          .hiw-timeline-item {
            position: relative !important;
            display: flex !important;
            align-items: start !important;
            gap: 20px !important;
            min-height: 88px !important;
            cursor: pointer !important;
            box-sizing: border-box !important;
            z-index: 2 !important;
            transition: opacity 0.2s ease !important;
          }

          .hiw-timeline-badge {
            width: 32px !important;
            height: 32px !important;
            border-radius: 9999px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 14px !important;
            font-weight: 700 !important;
            border: 2px solid var(--border-color, #e2e8f0) !important;
            background-color: var(--card-bg, #ffffff) !important;
            color: var(--text-secondary, #64748b) !important;
            flex-shrink: 0 !important;
            z-index: 3 !important;
            transition: all 0.2s ease !important;
          }

          .hiw-timeline-item.active .hiw-timeline-badge {
            background-color: var(--primary, #3b82f6) !important;
            color: #ffffff !important;
            border-color: var(--primary, #3b82f6) !important;
          }

          .hiw-timeline-title {
            margin: 0 !important;
            padding-top: 4px !important;
            font-size: 14px !important;
            font-weight: 700 !important;
            line-height: 1.3 !important;
            color: var(--text-primary, #0f172a) !important;
            transition: color 0.2s ease !important;
          }

          .hiw-timeline-item.active .hiw-timeline-title {
            color: var(--primary, #3b82f6) !important;
          }

          .hiw-detail-card {
            padding: 32px !important;
            border-radius: 16px !important;
            border: 1px solid var(--border-color, #e2e8f0) !important;
            background-color: var(--card-bg, #ffffff) !important;
            box-shadow: var(--shadow-sm, 0 1px 2px 0 rgba(0, 0, 0, 0.05)) !important;
            min-height: 320px !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            box-sizing: border-box !important;
          }

          .hiw-detail-label {
            font-size: 12px !important;
            font-weight: 700 !important;
            text-transform: uppercase !important;
            letter-spacing: 0.05em !important;
            color: var(--primary, #3b82f6) !important;
            margin-bottom: 12px !important;
            display: inline-block !important;
          }

          .hiw-detail-title {
            font-size: 30px !important;
            font-weight: 800 !important;
            line-height: 1.25 !important;
            color: var(--text-primary, #0f172a) !important;
            margin: 0 0 12px !important;
          }

          .hiw-detail-desc {
            font-size: 16px !important;
            line-height: 1.625 !important;
            color: var(--text-secondary, #475569) !important;
            max-width: 850px !important;
            margin: 0 !important;
          }

          .hiw-detail-footer {
            margin-top: auto !important;
            padding-top: 20px !important;
            border-top: 1px solid var(--border-color, #f1f5f9) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            font-size: 14px !important;
            color: var(--text-secondary, #64748b) !important;
            box-sizing: border-box !important;
          }

          .hiw-detail-status {
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
            font-weight: 600 !important;
          }

          .hiw-secondary-grid {
            display: grid !important;
            grid-template-columns: 1fr !important;
            gap: 24px !important;
            align-items: start !important;
            margin-top: 64px !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }

          @media (min-width: 768px) {
            .hiw-secondary-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
              gap: 24px !important;
            }
          }

          @media (min-width: 1200px) {
            .hiw-secondary-grid {
              grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
              gap: 32px !important;
            }
          }

          .hiw-footer-card {
            padding: 28px 30px !important;
            border-radius: 16px !important;
            border: 1px solid var(--border-color, #e2e8f0) !important;
            background-color: var(--card-bg, #ffffff) !important;
            box-shadow: var(--shadow-sm, 0 1px 2px 0 rgba(0, 0, 0, 0.05)) !important;
            display: flex !important;
            flex-direction: column !important;
            box-sizing: border-box !important;
          }

          /* Accordion FAQs styles */
          .hiw-faq-row {
            border: 1px solid var(--border-color, #e2e8f0) !important;
            border-radius: 12px !important;
            overflow: hidden !important;
            background-color: var(--card-bg, #ffffff) !important;
            margin-bottom: 12px !important;
            width: 100% !important;
          }
          [data-theme="dark"] .hiw-faq-row {
            background-color: rgba(30, 41, 59, 0.4) !important;
            border-color: #334155 !important;
          }
          .hiw-faq-row:last-child {
            margin-bottom: 0 !important;
          }
          
          .hiw-faq-btn {
            width: 100% !important;
            min-height: 52px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            gap: 16px !important;
            padding: 12px 20px !important;
            text-align: left !important;
            background: transparent !important;
            border: none !important;
            outline: none !important;
            cursor: pointer !important;
            overflow: visible !important;
            box-sizing: border-box !important;
            transition: background-color 0.2s ease !important;
          }
          .hiw-faq-btn:hover {
            background-color: rgba(148, 163, 184, 0.08) !important;
          }
          [data-theme="dark"] .hiw-faq-btn:hover {
            background-color: rgba(255, 255, 255, 0.03) !important;
          }
          
          .hiw-faq-question {
            font-size: 16px !important;
            font-weight: 600 !important;
            line-height: 24px !important;
            color: #0f172a !important;
            text-align: left !important;
            flex: 1 !important;
            min-width: 0 !important;
            overflow: visible !important;
            display: block !important;
            margin: 0 !important;
            padding: 0 !important;
            transform: none !important;
          }
          [data-theme="dark"] .hiw-faq-question {
            color: #f8fafc !important;
          }
          
          .hiw-faq-chevron {
            width: 20px !important;
            height: 20px !important;
            flex-shrink: 0 !important;
            color: #64748b !important;
            margin: 0 !important;
            padding: 0 !important;
            transform: none !important;
          }

          /* Testimonial styles */
          .hiw-testimonial-card {
            padding: 24px !important;
            background-color: rgba(248, 250, 252, 0.4) !important;
            border: 1px solid var(--border-color, #e2e8f0) !important;
            border-radius: 12px !important;
            min-height: 260px !important;
            max-height: 320px !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: start !important;
            box-sizing: border-box !important;
          }
          [data-theme="dark"] .hiw-testimonial-card {
            background-color: rgba(30, 41, 59, 0.4) !important;
            border-color: #334155 !important;
          }
          
          .hiw-testimonial-quote {
            font-size: 16px !important;
            font-weight: 400 !important;
            line-height: 28px !important;
            color: #475569 !important;
            font-style: italic !important;
            margin-bottom: 24px !important;
            margin-top: 0 !important;
            padding: 0 !important;
          }
          [data-theme="dark"] .hiw-testimonial-quote {
            color: #cbd5e1 !important;
          }
          
          .hiw-testimonial-author {
            display: flex !important;
            align-items: center !important;
            gap: 12px !important;
            margin-top: auto !important; /* using margin-top auto within flex-col keep it pushed cleanly below quote but strictly inside flex flow */
          }
          
          .hiw-testimonial-avatar {
            width: 48px !important;
            height: 48px !important;
            border-radius: 50% !important;
            background-color: rgba(37, 99, 235, 0.15) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            color: #2563eb !important;
            font-weight: 700 !important;
            font-size: 16px !important;
            flex-shrink: 0 !important;
          }
          
          .hiw-testimonial-info {
            display: flex !important;
            flex-direction: column !important;
            gap: 4px !important;
          }
          
          .hiw-testimonial-name {
            font-size: 16px !important;
            font-weight: 600 !important;
            color: #0f172a !important;
            line-height: 1.2 !important;
            margin: 0 !important;
          }
          [data-theme="dark"] .hiw-testimonial-name {
            color: #f8fafc !important;
          }
          
          .hiw-testimonial-company {
            font-size: 14px !important;
            color: #475569 !important;
            line-height: 1.2 !important;
            margin: 0 !important;
          }
          [data-theme="dark"] .hiw-testimonial-company {
            color: #94a3b8 !important;
          }
          
          .hiw-testimonial-dots {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            gap: 8px !important;
            margin-top: 16px !important;
          }
          
          .hiw-testimonial-dot {
            width: 10px !important;
            height: 10px !important;
            border-radius: 50% !important;
            transition: all 0.2s ease !important;
            border: none !important;
            padding: 0 !important;
            cursor: pointer !important;
          }
        `}</style>

        {/* PAGE HEADER */}
        <div className="hiw-header-container">
          <span className="text-primary font-bold text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
            How It Works
          </span>
          <h1
            className="text-foreground font-extrabold tracking-tight"
            style={{ fontSize: "clamp(28px, 4vw, 46px)", lineHeight: 1.1 }}
          >
            Choose Your Visual Journey
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-[760px] mx-auto">
            UniConnect supports both students aiming for academic success and tutors looking to verify and teach classes.
            Toggle between paths to see step details.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center select-none">
          <div className="hiw-toggle-container">
            <button
              onClick={() => setJourneyMode("student")}
              className={`hiw-toggle-btn ${journeyMode === "student" ? "active" : "inactive"}`}
            >
              Student Pathway
            </button>
            <button
              onClick={() => setJourneyMode("tutor")}
              className={`hiw-toggle-btn ${journeyMode === "tutor" ? "active" : "inactive"}`}
            >
              Tutor Pathway
            </button>
          </div>
        </div>

        {/* Two-column layout: timeline list + detail panel */}
        <div className="hiw-grid-layout">

          {/* LEFT: step index */}
          <div className="hiw-timeline-wrapper">
            <div className="hiw-timeline-line" />
            {activeSteps.map((item, index) => {
              const isActive = index === activeStep;
              return (
                <div
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`hiw-timeline-item ${isActive ? "active" : "opacity-60 hover:opacity-90"}`}
                >
                  <div className="hiw-timeline-badge">
                    {item.step}
                  </div>
                  <h4 className="hiw-timeline-title">
                    {item.title}
                  </h4>
                </div>
              );
            })}
          </div>

          {/* RIGHT: detail panel */}
          <div className="hiw-detail-card">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep + journeyMode}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <span className="hiw-detail-label">
                  Stage {activeSteps[activeStep]?.step} Detail
                </span>
                <h3 className="hiw-detail-title">{activeSteps[activeStep]?.title}</h3>
                <p className="hiw-detail-desc">
                  {activeSteps[activeStep]?.desc}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="hiw-detail-footer select-none">
              <span>Click stages on the left to explore the journey</span>
              <span className="hiw-detail-status">
                <Check className="w-3.5 h-3.5 text-emerald-500" /> Fully Vetted
              </span>
            </div>
          </div>
        </div>

        {/* ── SECONDARY GRID: 4 balanced columns ── */}
        <div className="hiw-secondary-grid">

          {/* Column 1: About UniConnect */}
          <div className="hiw-footer-card">
            <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-3 mb-6">
              <span className="w-1 h-5 bg-primary rounded-full inline-block" />
              About UniConnect
            </h2>
            <div className="flex flex-col gap-5">
              <p className="text-base text-muted-foreground leading-relaxed">
                UniConnect is a unified academic platform built for modern university students and educators. It consolidates attendance management, tutor booking, expense tracking, and alumni networking into a single, cohesive experience.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed">
                Whether you are tracking attendance for 12 subjects, managing a monthly budget, or seeking industry referrals from verified alumni at top companies — UniConnect handles it all in one place.
              </p>
            </div>
            <ul className="space-y-3 mt-6">
              {["Real-time attendance alerts", "Verified tutor profiles", "AI-powered expense prediction", "Alumni referral pipeline"].map((point) => (
                <li key={point} className="flex items-center gap-3 text-base text-muted-foreground">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: FAQs */}
          <div className="hiw-footer-card">
            <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-3 mb-6">
              <span className="w-1 h-5 bg-primary rounded-full inline-block" />
              FAQs
            </h2>
            <div className="flex flex-col">
              {faqs.map((faq, i) => (
                <div key={i} className="hiw-faq-row">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="hiw-faq-btn"
                    data-open={openFaq === i ? "true" : "false"}
                    type="button"
                  >
                    <span className="hiw-faq-question">
                      {faq.q}
                    </span>
                    {openFaq === i
                      ? <ChevronUp className="hiw-faq-chevron" />
                      : <ChevronDown className="hiw-faq-chevron" />
                    }
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-4 text-xs text-muted-foreground leading-relaxed border-t border-border/20 pt-3 bg-secondary/10 font-normal">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Success Stories */}
          <div className="hiw-footer-card">
            <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-3 mb-6">
              <span className="w-1 h-5 bg-primary rounded-full inline-block" />
              Success Stories
            </h2>
            <div className="flex flex-col">
              <AnimatePresence mode="wait">
                <motion.div
                  key={storyIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col"
                >
                  <div className="hiw-testimonial-card">
                    <p className="hiw-testimonial-quote">
                      "{successStories[storyIndex].text}"
                    </p>
                    <div className="hiw-testimonial-author">
                      <div className="hiw-testimonial-avatar">
                        {successStories[storyIndex].name[0]}
                      </div>
                      <div className="hiw-testimonial-info">
                        <p className="hiw-testimonial-name">{successStories[storyIndex].name}</p>
                        <p className="hiw-testimonial-company">{successStories[storyIndex].company}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
              <div className="hiw-testimonial-dots">
                {successStories.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setStoryIndex(i)}
                    className={`hiw-testimonial-dot ${
                      i === storyIndex ? "bg-primary" : "bg-border hover:bg-primary/40"
                    }`}
                    type="button"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Column 4: Quick Contact */}
          <div className="hiw-footer-card">
            <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-3 mb-6">
              <span className="w-1 h-5 bg-primary rounded-full inline-block" />
              Quick Contact
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Have a question about UniConnect? Send us a message and our team will get back to you within 24 hours.
            </p>
            <form
              className="flex flex-col gap-5"
              onSubmit={(e) => {
                e.preventDefault();
                setContactForm({ name: "", email: "", message: "" });
              }}
            >
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-foreground">Your Name</label>
                <input
                  type="text"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  placeholder="e.g. Arjun Mehta"
                  className="premium-input text-base text-foreground w-full px-4 py-3 rounded-xl border border-border"
                  style={{ height: "52px" }}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-foreground">Email Address</label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="you@university.edu"
                  className="premium-input text-base text-foreground w-full px-4 py-3 rounded-xl border border-border"
                  style={{ height: "52px" }}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-foreground">Message</label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="Describe your question or feedback..."
                  className="premium-input text-base text-foreground w-full resize-none p-4 rounded-xl border border-border min-h-[110px]"
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary bg-primary text-white px-4 h-12 rounded-xl hover:bg-primary-hover text-sm font-bold mt-2 transition-all"
              >
                Send Message
              </button>
            </form>
          </div>

        </div>
    </div>
  </div>
  );
}
