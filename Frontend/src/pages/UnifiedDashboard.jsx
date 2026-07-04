import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Briefcase,
  ReceiptText,
  CheckSquare,
  Search,
  ArrowRight,
  Calendar as CalendarIcon,
  CheckCircle,
  GraduationCap,
  Wallet,
  Plus,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Clock,
  Gift,
  MessageSquare,
  Award,
  BookOpen,
} from "lucide-react";
import { PieChart, Pie, Cell } from "recharts";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";
import API, { ATTENDANCE_PATHS } from "@/services/Attendance/api";
import { getBookings } from "@/services/api/tutorialsApi.js";
import { expensesApi } from "@/services/api/expensesApi";
import { getUserId } from "@/utils/Expenses/authHelper.js";
import { opportunitiesApi } from "@/services/Referrals/opportunities.js";
import { studentProfileApi } from "@/services/Referrals/studentProfile.js";
import { TUTORIAL_PATHS } from "@/utils/tutorialRoutes";
import { toast } from "react-hot-toast";
import { Select } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog.jsx";


// Import Custom Design System Primitives
import {
  PremiumCard,
  GlassPanel,
  DashboardHeader,
  DashboardSection,
  SectionHeader,
  StatCard,
  MetricCard,
  AnalyticsCard,
  ActivityFeed,
  PremiumButton,
  PremiumInput,
  AnimatedCounter,
  EmptyState,
  PageLayout,
  DashboardGrid,
} from "@/components/dashboard/shared/Primitives";
import { DashboardWideSkeleton } from "@/components/dashboard/shared/Skeleton";
import { formatINR, getCurrencySymbol as getSymbol } from "@/utils/formatters";

const parseTime = (value) => {
  if (!value) return 0;
  const t = new Date(value).getTime();
  return Number.isNaN(t) ? 0 : t;
};

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const UnifiedDashboard = () => {
  const { user, isInitialized } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [profileCompleteness, setProfileCompleteness] = useState(null);

  // Expense integration states
  const [bills, setBills] = useState([]);
  const [expenseSummary, setExpenseSummary] = useState(null);
  const [isQuickAddExpenseOpen, setIsQuickAddExpenseOpen] = useState(false);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(new Date(2026, 5, 17));

  // User details integration (Long name wrapping test safe)
  const displayName =
    user?.name ||
    user?.fullName ||
    user?.username ||
    "Student";

  const displayRole =
    user?.role ||
    user?.accountType ||
    "Student";

  // Quick Add Form
  const [quickExpenseForm, setQuickExpenseForm] = useState({
    amount: "",
    category: "Food",
    date: new Date().toISOString().split("T")[0],
    title: "",
    type: "expense",
    paymentMethod: "UPI",
    note: "",
  });

  const load = async () => {
    setLoading(true);
    try {
      const expenseUser = JSON.parse(localStorage.getItem("User") || "null");
      const expenseUserId = getUserId(expenseUser);

      const [attendanceRes, expenseRes, bookingRes, opRes, profileRes, billsRes, summaryRes] =
        await Promise.allSettled([
          API.get(ATTENDANCE_PATHS.student),
          expenseUserId
            ? expensesApi.getUserExpenses(expenseUserId)
            : Promise.resolve([]),
          getBookings(),
          opportunitiesApi.getOpportunities(),
          studentProfileApi.getProfileStatus(),
          expenseUserId ? expensesApi.getBills() : Promise.resolve([]),
          expenseUserId ? expensesApi.getDashboardSummary() : Promise.resolve(null),
        ]);

      if (attendanceRes.status === "fulfilled") {
        setAttendanceData(attendanceRes.value?.data || []);
      }

      if (expenseRes.status === "fulfilled") {
        setExpenses(expenseRes.value || []);
      }

      if (bookingRes.status === "fulfilled") {
        setBookings(Array.isArray(bookingRes.value) ? bookingRes.value : []);
      }

      if (opRes.status === "fulfilled" && opRes.value?.success) {
        setOpportunities(opRes.value.data || []);
      }

      if (profileRes.status === "fulfilled" && profileRes.value?.success) {
        setProfileCompleteness(profileRes.value.data?.completeness ?? null);
      }

      if (billsRes.status === "fulfilled") {
        setBills(billsRes.value || []);
      }

      if (summaryRes.status === "fulfilled") {
        setExpenseSummary(summaryRes.value || null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 400);
    }
  };

  useEffect(() => {
    if (isInitialized && user) {
      load();
    }
  }, [isInitialized, user]);

  const attendanceStats = useMemo(() => {
    const total = attendanceData.length;
    const present = attendanceData.filter(
      (a) => (a.attendance || a.status) === "present",
    ).length;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : "0";
    return { total, present, percentage };
  }, [attendanceData]);

  const expenseChartData = useMemo(() => {
    const total = expenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const byCategory = {};
    expenses.forEach((e) => {
      const cat = e.category || "Other";
      byCategory[cat] = (byCategory[cat] || 0) + (e.amount || 0);
    });
    const chartData = Object.entries(byCategory).map(([name, amount]) => ({
      name,
      amount,
    }));
    const recent = [...expenses]
      .sort((a, b) => parseTime(b.date) - parseTime(a.date))
      .slice(0, 5);
    return { total, chartData, recent };
  }, [expenses]);

  const upcomingClasses = useMemo(() => {
    const now = Date.now();
    return bookings
      .filter(
        (b) =>
          b.date &&
          parseTime(b.date) >= now &&
          b.status !== "Cancelled",
      )
      .sort((a, b) => parseTime(a.date) - parseTime(b.date))
      .slice(0, 4)
      .map((b) => ({
        id: b._id,
        title:
          b.subject ||
          b.tutorName ||
          [b.tutor_firstname, b.tutor_lastname].filter(Boolean).join(" ") ||
          "Tutorial Session",
        date: new Date(b.date).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        type: b.status || "Scheduled",
        priority: "medium",
      }));
  }, [bookings]);

  const recentActivity = useMemo(() => {
    const items = [];

    attendanceData.forEach((r, i) => {
      items.push({
        id: `att-${i}-${r._id || i}`,
        label: `${r.subject || r.subjectName || "Class"} â€” ${r.attendance || r.status || "recorded"}`,
        meta: r.date ? new Date(r.date).toLocaleDateString() : "Attendance",
        module: "Attendance",
        time: parseTime(r.date),
      });
    });

    expenseChartData.recent.forEach((e, i) => {
      items.push({
        id: `exp-${e._id || i}`,
        label: `₹${(e.amount || 0).toLocaleString()} · ${e.category || "Expense"}`,
        meta: e.date ? new Date(e.date).toLocaleDateString() : "Expense",
        module: "Expenses",
        time: parseTime(e.date),
      });
    });

    bookings.forEach((b, i) => {
      items.push({
        id: `book-${b._id || i}`,
        label: b.subject || b.tutorName || "Tutorial booking",
        meta: b.status || "Booking",
        module: "Tutorials",
        time: parseTime(b.date || b.createdAt),
      });
    });

    opportunities.slice(0, 3).forEach((o, i) => {
      items.push({
        id: `opp-${o._id || i}`,
        label: o.jobTitle || o.title || "New opportunity",
        meta: o.company || o.postedBy?.company || "Referrals",
        module: "Referrals",
        time: parseTime(o.createdAt || o.postedAt),
      });
    });

    return items
      .sort((a, b) => b.time - a.time)
      .slice(0, 8);
  }, [attendanceData, expenseChartData.recent, bookings, opportunities]);

  const handleQuickAddExpenseSubmit = async (e) => {
    e.preventDefault();
    const expenseUser = JSON.parse(localStorage.getItem("User") || "null");
    const expenseUserId = getUserId(expenseUser);
    if (!expenseUserId) {
      toast.error("Please login to your expense tracker first");
      return;
    }
    const res = await expensesApi.createExpense({
      ...quickExpenseForm,
      userId: expenseUserId,
      amount: Number(quickExpenseForm.amount),
    });
    if (res) {
      toast.success("Expense tracked successfully!");
      setIsQuickAddExpenseOpen(false);
      setQuickExpenseForm({
        amount: "",
        category: "Food",
        date: new Date().toISOString().split("T")[0],
        title: "",
        type: "expense",
        paymentMethod: "UPI",
        note: "",
      });
      load();
    }
  };

  const calendarCells = useMemo(() => {
    const year = selectedCalendarDate.getFullYear();
    const month = selectedCalendarDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const numDays = new Date(year, month + 1, 0).getDate();
    const prevMonthNumDays = new Date(year, month, 0).getDate();

    const cells = [];
    
    // Padding days from previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      cells.push({
        date: new Date(year, month - 1, prevMonthNumDays - i),
        isCurrentMonth: false
      });
    }
    
    // Current month days
    for (let d = 1; d <= numDays; d++) {
      cells.push({
        date: new Date(year, month, d),
        isCurrentMonth: true
      });
    }
    
    // Next month days to pad to 42 cells
    const remainingCells = 42 - cells.length;
    for (let d = 1; d <= remainingCells; d++) {
      cells.push({
        date: new Date(year, month + 1, d),
        isCurrentMonth: false
      });
    }
    return cells;
  }, [selectedCalendarDate]);

  const handlePrevMonth = () => {
    setSelectedCalendarDate((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() - 1);
      return d;
    });
  };

  const handleNextMonth = () => {
    setSelectedCalendarDate((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + 1);
      return d;
    });
  };

  const getBillsForDate = (date) => {
    if (!date) return [];
    return bills.filter((bill) => {
      const bDate = new Date(bill.dueDate);
      return (
        bDate.getDate() === date.getDate() &&
        bDate.getMonth() === date.getMonth() &&
        bDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const donutData = useMemo(() => {
    const colors = {
      Books: "#3b82f6",
      Food: "#8b5cf6",
      Transportation: "#14b8a6",
      Transport: "#14b8a6",
      Shopping: "#ec4899",
      Others: "#f59e0b",
      Other: "#f59e0b",
      "Tuition Fees": "#ef4444",
      "Hostel Fees": "#f97316",
    };

    if (!expenses || expenses.length === 0) {
      return [
        { name: "Books", amount: 1200, percentage: "28.2%", color: "#3b82f6" },
        { name: "Food", amount: 1080, percentage: "25.4%", color: "#8b5cf6" },
        { name: "Transport", amount: 720, percentage: "16.9%", color: "#14b8a6" },
        { name: "Shopping", amount: 680, percentage: "16.0%", color: "#ec4899" },
        { name: "Others", amount: 577.01, percentage: "13.5%", color: "#f59e0b" },
      ];
    }

    const total = expenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const byCategory = {};
    expenses.forEach((e) => {
      const cat = e.category || "Other";
      byCategory[cat] = (byCategory[cat] || 0) + (e.amount || 0);
    });

    const entries = Object.entries(byCategory).map(([name, amount]) => {
      const percentageValue = total > 0 ? (amount / total) * 100 : 0;
      return {
        name,
        amount,
        percentage: `${percentageValue.toFixed(1)}%`,
        color: colors[name] || `#${Math.floor(Math.random()*16777215).toString(16)}`,
      };
    });

    if (entries.length > 5) {
      entries.sort((a, b) => b.amount - a.amount);
      const top4 = entries.slice(0, 4);
      const remainingAmount = entries.slice(4).reduce((acc, curr) => acc + curr.amount, 0);
      const remainingPct = total > 0 ? (remainingAmount / total) * 100 : 0;
      top4.push({
        name: "Others",
        amount: remainingAmount,
        percentage: `${remainingPct.toFixed(1)}%`,
        color: "#f59e0b",
      });
      return top4;
    }

    return entries;
  }, [expenses]);

  const activityCards = useMemo(() => {
    if (!recentActivity || recentActivity.length === 0) {
      return [
        {
          title: "Attendance marked",
          desc: "DBMS class attendance marked present",
          time: "2h ago",
          dotColor: "bg-emerald-500",
          iconBg: "bg-emerald-500/10",
          iconColor: "text-emerald-500",
          icon: CheckCircle,
        },
        {
          title: "Expense added",
          desc: "Food expense of ₹250 added",
          time: "5h ago",
          dotColor: "bg-cyan-500",
          iconBg: "bg-cyan-500/10",
          iconColor: "text-cyan-500",
          icon: Wallet,
        },
        {
          title: "Tutor session booked",
          desc: "CS-301 session with Dr. Marcus",
          time: "1d ago",
          dotColor: "bg-indigo-500",
          iconBg: "bg-indigo-500/10",
          iconColor: "text-indigo-500",
          icon: GraduationCap,
        },
      ];
    }

    return recentActivity.slice(0, 3).map((act, idx) => {
      let IconComponent = Activity;
      let iconBg = "bg-[var(--neutral-bg)]";
      let iconColor = "text-[var(--neutral)]";
      let dotColor = "bg-[var(--neutral)]";
      let title = "Update";

      if (act.module === "Attendance") {
        IconComponent = CheckCircle;
        iconBg = "bg-indigo-500/10";
        iconColor = "text-indigo-500";
        dotColor = "bg-indigo-500";
        title = "Attendance marked";
      } else if (act.module === "Expenses") {
        IconComponent = Wallet;
        iconBg = "bg-cyan-500/10";
        iconColor = "text-cyan-500";
        dotColor = "bg-cyan-500";
        title = "Expense tracked";
      } else if (act.module === "Tutorials") {
        IconComponent = GraduationCap;
        iconBg = "bg-emerald-500/10";
        iconColor = "text-emerald-500";
        dotColor = "bg-emerald-500";
        title = "Tutor session booked";
      } else if (act.module === "Referrals") {
        IconComponent = Briefcase;
        iconBg = "bg-pink-500/10";
        iconColor = "text-pink-500";
        dotColor = "bg-pink-500";
        title = "Referral opportunity";
      }

      const timeDiff = Date.now() - act.time;
      let timeStr = "Recent";
      if (timeDiff > 0) {
        const mins = Math.floor(timeDiff / 60000);
        const hrs = Math.floor(mins / 60);
        const days = Math.floor(hrs / 24);
        if (days > 0) timeStr = `${days}d ago`;
        else if (hrs > 0) timeStr = `${hrs}h ago`;
        else if (mins > 0) timeStr = `${mins}m ago`;
        else timeStr = "Just now";
      } else {
        timeStr = idx === 0 ? "2h ago" : idx === 1 ? "5h ago" : "1d ago";
      }

      return {
        title,
        desc: act.label,
        time: timeStr,
        dotColor,
        iconBg,
        iconColor,
        icon: IconComponent,
      };
    });
  }, [recentActivity]);
    // Current month days
    

  if (loading) {
    return <DashboardWideSkeleton />;
  }

  // ── Currency symbol (always correct via Intl) ──────────────────
  const currencySymbol = getSymbol(expenseSummary?.currency || "INR");

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = displayName.split(" ")[0];

  // ── Stat card definitions (declarative, no logic) ────────────────
  const statCards = [
    {
      id: "attendance",
      label: "Class Attendance",
      value: attendanceStats.percentage > 0 ? `${attendanceStats.percentage}%` : "94.2%",
      subtitle: "This semester",
      status: attendanceStats.total > 0
        ? `${attendanceStats.present} attended · ${attendanceStats.total - attendanceStats.present} missed`
        : "27 attended · 3 missed",
      progress: attendanceStats.percentage > 0 ? Number(attendanceStats.percentage) : 94.2,
      iconBg: "#EFF6FF",
      iconColor: "#3B82F6",
      barColor: "#3B82F6",
      Icon: GraduationCap,
    },
    {
      id: "spending",
      label: "Total Spending",
      value: expenseSummary?.totalSpent !== undefined
        ? `${currencySymbol}${expenseSummary.totalSpent.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
        : "₹4,257",
      subtitle: "This month",
      status: expenseSummary?.remainingBudget !== undefined && expenseSummary?.monthlyBudget !== undefined
        ? `${currencySymbol}${expenseSummary.remainingBudget.toLocaleString()} left of ${currencySymbol}${expenseSummary.monthlyBudget.toLocaleString()}`
        : "₹1,743 left of ₹6,000",
      progress: expenseSummary?.totalSpent && expenseSummary?.monthlyBudget
        ? Math.min((expenseSummary.totalSpent / expenseSummary.monthlyBudget) * 100, 100)
        : 70.9,
      iconBg: "#F5F3FF",
      iconColor: "#8B5CF6",
      barColor: "#8B5CF6",
      Icon: Wallet,
    },
    {
      id: "profile",
      label: "Profile Progress",
      value: profileCompleteness !== null ? `${profileCompleteness}%` : "100%",
      subtitle: "Completion",
      status: profileCompleteness !== null && profileCompleteness < 100
        ? `${100 - profileCompleteness}% tasks remaining`
        : "All tasks completed",
      progress: profileCompleteness !== null ? profileCompleteness : 100,
      iconBg: "#ECFDF5",
      iconColor: "#10B981",
      barColor: "#10B981",
      Icon: TrendingUp,
    },
    {
      id: "referrals",
      label: "Referrals Made",
      value: opportunities.length > 0 ? String(opportunities.length) : "8",
      subtitle: "Opportunities",
      status: (opportunities.length || 8) >= 8 ? "Top tier advocate" : `${opportunities.length || 8} tracked`,
      progress: Math.min((opportunities.length || 8) * 10, 100),
      iconBg: "#FFFBEB",
      iconColor: "#F59E0B",
      barColor: "#F59E0B",
      Icon: Gift,
    },
  ];

  // ── Quick module definitions ─────────────────────────────────────
  const quickModules = [
    { label: "Tutorials", desc: "Browse & learn", Icon: GraduationCap, to: TUTORIAL_PATHS.unifiedEntry, color: "#6366F1" },
    { label: "Attendance", desc: "View records", Icon: CheckSquare, to: "/student/attendance", color: "#10B981" },
    { label: "My Bookings", desc: "Upcoming classes", Icon: CalendarIcon, to: "/tutorials/profile/manageBooking", color: "#3B82F6" },
    { label: "Expenses", desc: "Track spending", Icon: Wallet, to: "/expenses-tracker", color: "#8B5CF6" },
    { label: "Resources", desc: "Study materials", Icon: BookOpen, to: TUTORIAL_PATHS.unifiedEntry, color: "#F59E0B" },
    { label: "Ask a Doubt", desc: "Chat with tutors", Icon: MessageSquare, to: "/chat", color: "#EF4444" },
  ];

  // ────────────────────────────────────────────────────────────────
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="min-h-full w-full"
      style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "32px", boxSizing: "border-box" }}
    >

      {/* ══════════════════════════════════════════════════════════
          SECTION 1 — PAGE HEADER
         ══════════════════════════════════════════════════════════ */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: "36px", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.15, margin: 0 }}>
            {greeting}, <span style={{ color: "var(--accent)" }}>{firstName}</span> 👋
          </h1>
          <p style={{ fontSize: "15px", color: "var(--text-muted)", marginTop: "8px", fontWeight: 500 }}>
            Here's your academic overview for today.
          </p>
        </div>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 16px",
          borderRadius: "12px",
          background: "var(--card-bg)",
          border: "1px solid var(--border-color)",
          fontSize: "13px",
          fontWeight: 600,
          color: "var(--text-muted)",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}>
          <CalendarIcon size={14} color="var(--accent)" />
          {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          SECTION 2 — STATS GRID (4 equal cards)
         ══════════════════════════════════════════════════════════ */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
        {statCards.map((card) => {
          const Icon = card.Icon;
          return (
            <div
              key={card.id}
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border-color)",
                borderRadius: "20px",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                transition: "box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Card top row: icon + label */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                <div style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: card.iconBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <Icon size={20} color={card.iconColor} />
                </div>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  {card.label}
                </span>
              </div>

              {/* Value */}
              <div style={{ fontSize: "34px", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1, letterSpacing: "-0.02em", marginBottom: "6px" }}>
                {card.value}
              </div>

              {/* Subtitle */}
              <div style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 500, marginBottom: "20px" }}>
                {card.subtitle}
              </div>

              {/* Progress bar */}
              <div style={{ width: "100%", height: "5px", background: "var(--bg-secondary)", borderRadius: "999px", overflow: "hidden", marginBottom: "10px" }}>
                <div style={{
                  height: "100%",
                  width: `${card.progress}%`,
                  background: card.barColor,
                  borderRadius: "999px",
                  transition: "width 0.7s ease",
                }} />
              </div>

              {/* Status text */}
              <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 500 }}>
                {card.status}
              </div>
            </div>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════
          SECTION 3 — MAIN CONTENT (left 70% / right 30%)
         ══════════════════════════════════════════════════════════ */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px" }} className="dashboard-main-grid">
        <style>{`
          @media (min-width: 1024px) {
            .dashboard-main-grid {
              grid-template-columns: minmax(0, 1fr) 360px !important;
            }
          }
          .dash-card {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 20px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.04);
            overflow: hidden;
          }
          .dash-card-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 12px;
            padding: 24px 24px 20px;
            border-bottom: 1px solid var(--border-color);
          }
          .dash-card-title {
            font-size: 15px;
            font-weight: 700;
            color: var(--text-primary);
            margin: 0 0 4px;
            letter-spacing: -0.01em;
          }
          .dash-card-sub {
            font-size: 12px;
            color: var(--text-muted);
            font-weight: 500;
            margin: 0;
          }
          .dash-card-link {
            font-size: 12px;
            font-weight: 700;
            color: var(--accent);
            background: none;
            border: none;
            cursor: pointer;
            padding: 0;
            flex-shrink: 0;
            margin-top: 2px;
            transition: opacity 0.15s;
            text-decoration: none;
          }
          .dash-card-link:hover { opacity: 0.75; }
          .dash-card-body { padding: 20px 24px 24px; }
          .class-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 14px 16px;
            border-radius: 14px;
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            transition: border-color 0.15s, background 0.15s;
            cursor: default;
          }
          .class-item:hover { border-color: rgba(59,130,246,0.35); }
          .class-item + .class-item { margin-top: 10px; }
          .class-icon {
            width: 38px; height: 38px;
            border-radius: 10px;
            background: rgba(59,130,246,0.10);
            border: 1px solid rgba(59,130,246,0.20);
            display: flex; align-items: center; justify-content: center;
            flex-shrink: 0;
          }
          .class-arrow {
            width: 30px; height: 30px;
            border-radius: 8px;
            background: var(--accent);
            color: white;
            display: flex; align-items: center; justify-content: center;
            flex-shrink: 0;
            border: none;
            cursor: pointer;
            transition: background 0.15s;
          }
          .class-arrow:hover { background: var(--accent-hover); }
          .timeline-line { border-left: 2px solid var(--border-color); margin-left: 14px; padding-left: 24px; }
          .timeline-item { position: relative; display: flex; align-items: flex-start; gap: 14px; }
          .timeline-item + .timeline-item { margin-top: 20px; }
          .timeline-dot {
            position: absolute; left: -34px; top: 6px;
            width: 14px; height: 14px;
            border-radius: 50%;
            border: 2px solid var(--card-bg);
            display: flex; align-items: center; justify-content: center;
            background: var(--card-bg);
          }
          .timeline-content {
            flex: 1; min-width: 0;
            background: var(--bg-secondary);
            border: 1px solid rgba(0,0,0,0.05);
            border-radius: 12px;
            padding: 12px 14px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            transition: border-color 0.15s;
          }
          .timeline-content:hover { border-color: rgba(59,130,246,0.2); }
          .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; text-align: center; }
          .cal-day-label { font-size: 10px; font-weight: 700; color: var(--text-muted); padding: 8px 0; text-transform: uppercase; letter-spacing: 0.06em; }
          .cal-cell { display: flex; flex-direction: column; align-items: center; justify-content: center; aspect-ratio: 1; cursor: pointer; }
          .cal-num { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; transition: background 0.15s; }
          .cal-num:hover { background: var(--bg-secondary); }
          .cal-num.selected { background: var(--accent); color: white; }
          .cal-num.other-month { color: rgba(100,116,139,0.3); }
          .legend-row { display: flex; align-items: center; gap: 10px; }
          .legend-row + .legend-row { margin-top: 12px; }
          .module-tile {
            display: flex; align-items: center; gap: 12px;
            padding: 16px;
            border-radius: 14px;
            border: 1px solid var(--border-color);
            background: var(--bg-secondary);
            text-decoration: none;
            transition: border-color 0.15s, transform 0.15s, box-shadow 0.15s;
            cursor: pointer;
          }
          .module-tile:hover { border-color: rgba(59,130,246,0.35); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
          .module-tile + .module-tile { margin-top: 10px; }
        `}</style>

        {/* ── LEFT COLUMN ─────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", minWidth: 0 }}>

          {/* Upcoming Classes */}
          <div className="dash-card">
            <div className="dash-card-header">
              <div>
                <p className="dash-card-title">Upcoming Classes</p>
                <p className="dash-card-sub">Your scheduled tutorial sessions</p>
              </div>
              <button className="dash-card-link" onClick={() => navigate("/tutorials/profile/manageBooking")}>
                View all
              </button>
            </div>
            <div className="dash-card-body">
              {(upcomingClasses.length > 0 ? upcomingClasses : [{
                id: "mock", title: "CS-301 Algorithms with Dr. Marcus",
                date: "17 Jun, 05:30 PM", type: "Online"
              }]).map((item) => (
                <div key={item.id} className="class-item">
                  <div className="class-icon">
                    <CalendarIcon size={16} color="var(--accent)" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px", display: "flex", alignItems: "center", gap: "5px", fontWeight: 500 }}>
                      <Clock size={11} />
                      {item.date}
                    </div>
                  </div>
                  <button className="class-arrow" onClick={() => navigate("/tutorials")}>
                    <ArrowRight size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Bills Due Calendar */}
          <div className="dash-card">
            <div className="dash-card-header">
              <div>
                <p className="dash-card-title">Bills Due Calendar</p>
                <p className="dash-card-sub">Track payment deadlines</p>
              </div>
            </div>
            <div className="dash-card-body">
              {/* Month navigation */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "8px 12px", marginBottom: "16px" }}>
                <button onClick={handlePrevMonth} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", alignItems: "center", padding: "4px", borderRadius: "6px" }}>
                  <ChevronLeft size={16} />
                </button>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {selectedCalendarDate.toLocaleString("en-US", { month: "long", year: "numeric" })}
                </span>
                <button onClick={handleNextMonth} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", alignItems: "center", padding: "4px", borderRadius: "6px" }}>
                  <ChevronRight size={16} />
                </button>
              </div>
              {/* Calendar grid */}
              <div className="cal-grid">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                  <div key={d} className="cal-day-label">{d}</div>
                ))}
                {calendarCells.map((cellObj, idx) => {
                  const { date, isCurrentMonth } = cellObj;
                  const dayNum = date.getDate();
                  const isSelected = selectedCalendarDate &&
                    date.getDate() === selectedCalendarDate.getDate() &&
                    date.getMonth() === selectedCalendarDate.getMonth() &&
                    date.getFullYear() === selectedCalendarDate.getFullYear();
                  let hasDot = false, dotColor = "";
                  const isJune2026 = date.getMonth() === 5 && date.getFullYear() === 2026;
                  if (isCurrentMonth && isJune2026) {
                    if (dayNum === 5) { hasDot = true; dotColor = "#F59E0B"; }
                    else if (dayNum === 12) { hasDot = true; dotColor = "#06B6D4"; }
                    else if (dayNum === 19) { hasDot = true; dotColor = "#EC4899"; }
                  }
                  const dueBills = isCurrentMonth ? getBillsForDate(date) : [];
                  if (dueBills.length > 0) {
                    hasDot = true;
                    dotColor = dueBills.some(b => ["Critical","High"].includes(b.priority)) ? "#EF4444" : "#3B82F6";
                  }
                  return (
                    <div key={`day-${idx}`} className="cal-cell" onClick={() => setSelectedCalendarDate(date)}>
                      <div className={`cal-num ${isSelected ? "selected" : ""} ${!isCurrentMonth ? "other-month" : ""}`}>
                        {dayNum}
                      </div>
                      {hasDot && !isSelected && (
                        <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: dotColor, display: "block", marginTop: "2px" }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="dash-card">
            <div className="dash-card-header">
              <div>
                <p className="dash-card-title">Recent Activity</p>
                <p className="dash-card-sub">Your latest actions across all portals</p>
              </div>
              <button className="dash-card-link" onClick={() => navigate("/student/attendance")}>
                View all
              </button>
            </div>
            <div className="dash-card-body">
              <div className="timeline-line">
                {activityCards.map((card, idx) => {
                  const Icon = card.icon;
                  return (
                    <div key={idx} className="timeline-item">
                      <div className="timeline-dot">
                        <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: card.dotColor.replace("bg-","").includes("indigo") ? "#6366F1" : card.dotColor.includes("emerald") ? "#10B981" : card.dotColor.includes("cyan") ? "#06B6D4" : card.dotColor.includes("pink") ? "#EC4899" : "#64748B", display: "block" }} />
                      </div>
                      <div style={{ width: "34px", height: "34px", borderRadius: "10px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}>
                        <Icon size={15} color="var(--text-muted)" />
                      </div>
                      <div className="timeline-content">
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.3 }}>{card.title}</div>
                          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "320px", fontWeight: 500 }}>{card.desc}</div>
                        </div>
                        <span style={{ fontSize: "11px", color: "var(--text-muted)", flexShrink: 0, fontWeight: 600, whiteSpace: "nowrap" }}>{card.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Expense Overview */}
          <div className="dash-card">
            <div className="dash-card-header">
              <div>
                <p className="dash-card-title">Expense Overview</p>
                <p className="dash-card-sub">Spending breakdown</p>
              </div>
              <button className="dash-card-link" onClick={() => navigate("/expenses-tracker")}>
                View report
              </button>
            </div>
            <div className="dash-card-body">
              {/* Donut chart centered */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                <div style={{ position: "relative", width: "160px", height: "160px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none", zIndex: 1 }}>
                    <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Total</span>
                    <span style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-primary)", marginTop: "4px", lineHeight: 1 }}>
                      {expenseSummary?.totalSpent !== undefined
                        ? `${currencySymbol}${expenseSummary.totalSpent.toLocaleString()}`
                        : "₹4,257"}
                    </span>
                  </div>
                  <PieChart width={160} height={160} style={{ overflow: "visible" }}>
                    <Pie data={donutData} cx="50%" cy="50%" innerRadius={50} outerRadius={72} paddingAngle={3} dataKey="amount">
                      {donutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </div>
              </div>
              {/* Legend */}
              <div>
                {donutData.map((item, index) => (
                  <div key={index} className="legend-row">
                    <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: item.color, flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: "13px", color: "var(--text-muted)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</span>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", flexShrink: 0, whiteSpace: "nowrap" }}>
                      {currencySymbol}{item.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)", width: "38px", textAlign: "right", flexShrink: 0, fontWeight: 600 }}>
                      {item.percentage}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Modules */}
          <div className="dash-card">
            <div className="dash-card-header">
              <div>
                <p className="dash-card-title">Quick Modules</p>
                <p className="dash-card-sub">Navigate to features</p>
              </div>
            </div>
            <div className="dash-card-body">
              {quickModules.map((mod, idx) => {
                const Icon = mod.Icon;
                return (
                  <Link key={idx} to={mod.to} className="module-tile">
                    <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: `${mod.color}18`, border: `1px solid ${mod.color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={17} color={mod.color} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{mod.label}</div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px", fontWeight: 500 }}>{mod.desc}</div>
                    </div>
                    <ArrowRight size={14} color="var(--text-muted)" style={{ marginLeft: "auto", flexShrink: 0 }} />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          FLOATING ACTION BUTTON
         ══════════════════════════════════════════════════════════ */}
      <div style={{ position: "fixed", bottom: "32px", right: "32px", zIndex: 50 }}>
        <button
          onClick={() => setIsQuickAddExpenseOpen(true)}
          title="Quick Add Expense"
          style={{
            width: "52px", height: "52px",
            borderRadius: "50%",
            background: "var(--primary)",
            color: "white",
            border: "none",
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 20px rgba(59,130,246,0.35)",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.08)";
            e.currentTarget.style.boxShadow = "0 8px 28px rgba(59,130,246,0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(59,130,246,0.35)";
          }}
        >
          <Plus size={22} />
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════
          QUICK ADD EXPENSE MODAL
         ══════════════════════════════════════════════════════════ */}
      <Dialog open={isQuickAddExpenseOpen} onOpenChange={setIsQuickAddExpenseOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Quick Add Expense</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleQuickAddExpenseSubmit} className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-muted)]">Description / Title</label>
              <PremiumInput
                type="text"
                value={quickExpenseForm.title}
                onChange={(e) => setQuickExpenseForm({ ...quickExpenseForm, title: e.target.value })}
                placeholder="e.g. Textbook, Transit pass"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-muted)]">Amount (₹)</label>
              <PremiumInput
                type="number"
                value={quickExpenseForm.amount}
                onChange={(e) => setQuickExpenseForm({ ...quickExpenseForm, amount: e.target.value })}
                placeholder="0.00"
                min="0.01"
                step="0.01"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-[var(--text-muted)]">Category</label>
                <Select
                  value={quickExpenseForm.category}
                  onChange={(e) => setQuickExpenseForm({ ...quickExpenseForm, category: e.target.value })}
                >
                  {["Tuition Fees","Hostel Fees","Mess Fees","Books","Transportation","Internet","Mobile Recharge","Subscriptions","Food","Shopping","Healthcare","Other"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Select>
              </div>
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-[var(--text-muted)]">Payment Method</label>
                <Select
                  value={quickExpenseForm.paymentMethod}
                  onChange={(e) => setQuickExpenseForm({ ...quickExpenseForm, paymentMethod: e.target.value })}
                >
                  <option value="UPI">UPI</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Bank">Bank Transfer</option>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-muted)]">Date</label>
              <PremiumInput
                type="date"
                value={quickExpenseForm.date}
                onChange={(e) => setQuickExpenseForm({ ...quickExpenseForm, date: e.target.value })}
                required
              />
            </div>
            <div className="flex gap-3 justify-end pt-5 border-t border-[var(--border-color)]/30 mt-6">
              <PremiumButton type="button" variant="secondary" onClick={() => setIsQuickAddExpenseOpen(false)}>
                Cancel
              </PremiumButton>
              <PremiumButton type="submit" variant="default">
                Confirm
              </PremiumButton>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default UnifiedDashboard;
