import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";
import { ThemePreference } from "@/components/ThemePreference.jsx";
import StudentProfileView from "@/components/profile/StudentProfileView.jsx";
import TutorProfileView from "@/components/profile/TutorProfileView.jsx";
import AlumniProfileView from "@/components/profile/AlumniProfileView.jsx";
import { getCurrencySymbol } from "@/utils/formatters";
import {
  User,
  Settings as SettingsIcon,
  Bell,
  Wallet,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Mail,
  Smartphone,
  Clock,
  Zap,
  Target,
  DollarSign,
  Calendar,
  PiggyBank,
  BarChart3,
  Plus,
  FileText,
  Eye,
  BookOpen,
  Bus,
  Wifi,
  Phone,
  Monitor,
  ShoppingBag,
  Heart,
  MoreHorizontal,
  GraduationCap,
  Home,
  Utensils,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog.jsx";

// ─── Constants ────────────────────────────────────────────────────────────────

const STUDENT_CATEGORIES = [
  "Tuition Fees",
  "Hostel Fees",
  "Mess Fees",
  "Books",
  "Transportation",
  "Internet",
  "Mobile Recharge",
  "Subscriptions",
  "Food",
  "Shopping",
  "Healthcare",
  "Other",
];

const CATEGORY_META = {
  "Tuition Fees":     { icon: GraduationCap, color: "#6366f1", bg: "rgba(99,102,241,0.10)" },
  "Hostel Fees":      { icon: Home,          color: "#8b5cf6", bg: "rgba(139,92,246,0.10)" },
  "Mess Fees":        { icon: Utensils,      color: "#f59e0b", bg: "rgba(245,158,11,0.10)" },
  "Books":            { icon: BookOpen,      color: "#10b981", bg: "rgba(16,185,129,0.10)" },
  "Transportation":   { icon: Bus,           color: "#3b82f6", bg: "rgba(59,130,246,0.10)" },
  "Internet":         { icon: Wifi,          color: "#06b6d4", bg: "rgba(6,182,212,0.10)"  },
  "Mobile Recharge":  { icon: Phone,         color: "#84cc16", bg: "rgba(132,204,22,0.10)" },
  "Subscriptions":    { icon: Monitor,       color: "#a855f7", bg: "rgba(168,85,247,0.10)" },
  "Food":             { icon: Utensils,      color: "#ef4444", bg: "rgba(239,68,68,0.10)"  },
  "Shopping":         { icon: ShoppingBag,   color: "#ec4899", bg: "rgba(236,72,153,0.10)" },
  "Healthcare":       { icon: Heart,         color: "#14b8a6", bg: "rgba(20,184,166,0.10)" },
  "Other":            { icon: MoreHorizontal, color: "#94a3b8", bg: "rgba(148,163,184,0.10)"},
};

// ─── Reusable sub-components ──────────────────────────────────────────────────

/** Premium input styled to match the new design system */
function SettingsInput({ label, required, children, className = "" }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", letterSpacing: "0.01em" }}>
          {label}{required && <span style={{ color: "#ef4444", marginLeft: "2px" }}>*</span>}
        </label>
      )}
      {children}
    </div>
  );
}

const inputStyle = {
  height: "50px",
  borderRadius: "12px",
  border: "1.5px solid var(--border-color)",
  background: "var(--card-bg)",
  color: "var(--text-primary)",
  padding: "0 14px",
  fontSize: "14px",
  fontWeight: "500",
  outline: "none",
  width: "100%",
  transition: "border-color 0.15s ease, box-shadow 0.15s ease",
};

/** Toggle switch component */
function Toggle({ checked, onChange, id }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      id={id}
      onClick={() => onChange(!checked)}
      style={{
        width: "48px", height: "26px", borderRadius: "999px", flexShrink: 0,
        background: checked ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "rgba(0,0,0,0.12)",
        border: "none", cursor: "pointer",
        transition: "background 0.2s ease",
        position: "relative", display: "flex", alignItems: "center",
        padding: "3px",
      }}
    >
      <span style={{
        width: "20px", height: "20px", borderRadius: "50%",
        background: "#fff",
        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
        transform: checked ? "translateX(22px)" : "translateX(0)",
        transition: "transform 0.2s ease",
        display: "block",
      }} />
    </button>
  );
}

/** A single toggle-row used in notification / preference cards */
function ToggleRow({ label, desc, checked, onChange, id }) {
  return (
    <label
      htmlFor={id}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 16px", borderRadius: "12px",
        border: "1px solid var(--border-color)",
        cursor: "pointer", transition: "background 0.15s ease", gap: "16px",
      }}
      onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,0.03)"}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
    >
      <div>
        <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", margin: 0 }}>{label}</p>
        {desc && <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "2px 0 0", lineHeight: "1.4" }}>{desc}</p>}
      </div>
      <Toggle checked={checked} onChange={onChange} id={id} />
    </label>
  );
}

/** Settings card wrapper */
function SettingsCard({ children, style = {} }) {
  return (
    <div style={{
      background: "var(--card-bg)",
      border: "1px solid var(--border-color)",
      borderRadius: "20px",
      padding: "28px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      ...style,
    }}>
      {children}
    </div>
  );
}

/** Settings card section header */
function CardHeader({ icon: Icon, color = "#6366f1", title, subtitle, action }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px", gap: "12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{
          width: "40px", height: "40px", borderRadius: "12px",
          background: `${color}18`, border: `1.5px solid ${color}30`,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Icon size={18} style={{ color }} />
        </div>
        <div>
          <h3 style={{ fontSize: "17px", fontWeight: "700", color: "var(--text-primary)", margin: 0, letterSpacing: "-0.01em" }}>{title}</h3>
          {subtitle && <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "2px 0 0", lineHeight: "1.4" }}>{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

function AccountSetting({ mode }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = mode === "expenses-only" ? "expenses" : (searchParams.get("tab") || "profile");
  const role = (user?.role || user?.accountType || "student").toLowerCase();

  // ── Settings State (unchanged) ──
  const [settings, setSettings] = useState({
    monthlyBudget: 0,
    weeklyBudget: 0,
    dailyBudget: 0,
    currency: "INR",
    savingsGoal: 0,
    categoryLimits: {},
    notificationPreferences: {
      budgetAlerts: true,
      billDueAlerts: true,
      overdueAlerts: true,
      savingsGoalAlerts: true,
      email: true,
      push: true
    },
    alertThresholds: {
      fifty: true,
      seventyFive: true,
      ninety: true,
      hundred: true
    }
  });

  const [allowLimitsExceedBudget, setAllowLimitsExceedBudget] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [summaryMetrics, setSummaryMetrics] = useState(null);

  // Modals
  const [isAddBillOpen, setIsAddBillOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  const [billForm, setBillForm] = useState({
    billName: "", amount: "", dueDate: "",
    priority: "Medium", isRecurring: false, recurringType: "None"
  });

  const [expenseForm, setExpenseForm] = useState({
    amount: "", category: "Food",
    date: new Date().toISOString().split("T")[0],
    title: "", type: "expense", paymentMethod: "UPI", note: ""
  });

  useEffect(() => {
    if (role === "student" && activeTab === "expenses") {
      fetchSettings();
      fetchSummary();
    }
  }, [activeTab, role]);

  // ── Data handlers (all unchanged) ──
  const fetchSettings = async () => {
    setLoadingSettings(true);
    try {
      const data = await expensesApi.getSettings();
      if (data) {
        const categoryLimits = data.categoryLimits || {};
        setSettings({
          ...data,
          categoryLimits: categoryLimits instanceof Map ? Object.fromEntries(categoryLimits) : categoryLimits
        });
      }
    } catch (e) {
      console.error("Failed to load settings:", e);
    } finally {
      setLoadingSettings(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const data = await expensesApi.getDashboardSummary();
      if (data) setSummaryMetrics(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleTabChange = (tabName) => setSearchParams({ tab: tabName });

  const handleSettingsChange = (field, value) =>
    setSettings(prev => ({ ...prev, [field]: value }));

  const handleNestedChange = (parent, field, value) =>
    setSettings(prev => ({ ...prev, [parent]: { ...prev[parent], [field]: value } }));

  const handleCategoryLimitChange = (category, value) =>
    setSettings(prev => ({
      ...prev,
      categoryLimits: { ...prev.categoryLimits, [category]: value === "" ? 0 : Number(value) }
    }));

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    let limitsSum = 0;
    Object.values(settings.categoryLimits).forEach(val => { limitsSum += Number(val || 0); });

    if (limitsSum > settings.monthlyBudget && !allowLimitsExceedBudget) {
      toast.error(`Total category limits (₹${limitsSum.toLocaleString()}) exceed monthly budget (₹${settings.monthlyBudget.toLocaleString()}). Adjust limits or enable "Allow limits to exceed budget".`);
      setSavingSettings(false);
      return;
    }

    try {
      const payload = { ...settings, allowLimitsExceedBudget };
      const res = await expensesApi.updateSettings(payload);
      if (res.statusCode === 200) {
        toast.success("Expense settings saved successfully!");
        fetchSettings();
        fetchSummary();
      } else {
        toast.error(res.message || "Failed to save settings");
      }
    } catch (err) {
      toast.error("An error occurred while saving settings.");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleAddBill = async (e) => {
    e.preventDefault();
    try {
      const res = await expensesApi.createBill({ ...billForm, amount: Number(billForm.amount) });
      if (res.statusCode === 201) {
        toast.success("Bill added successfully!");
        setIsAddBillOpen(false);
        setBillForm({ billName: "", amount: "", dueDate: "", priority: "Medium", isRecurring: false, recurringType: "None" });
        fetchSummary();
      } else {
        toast.error(res.message || "Failed to add bill");
      }
    } catch (err) {
      toast.error("Failed to add bill.");
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      const localUser = JSON.parse(localStorage.getItem("User"));
      const res = await expensesApi.createExpense({ ...expenseForm, userId: localUser?._id, amount: Number(expenseForm.amount) });
      if (res) {
        toast.success("Expense added successfully!");
        setIsAddExpenseOpen(false);
        setExpenseForm({ amount: "", category: "Food", date: new Date().toISOString().split("T")[0], title: "", type: "expense", paymentMethod: "UPI", note: "" });
        fetchSummary();
      } else {
        toast.error("Failed to add expense");
      }
    } catch (err) {
      toast.error("Failed to add expense.");
    }
  };

  const showExpenseTab = role === "student";

  // ── Navigation items ──
  const NAV_ITEMS = [
    { id: "profile",       label: "Profile Settings",    icon: User,        desc: "Your personal info" },
    { id: "account",       label: "Account Preference",  icon: SettingsIcon, desc: "Theme & privacy" },
    { id: "notifications", label: "Notifications",        icon: Bell,         desc: "Alerts & updates" },
    ...(showExpenseTab ? [{ id: "expenses", label: "Expense Tracker", icon: Wallet, desc: "Budget & limits" }] : []),
  ];

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <main style={{ width: "100%", maxWidth: "1280px", margin: "0 auto", padding: "32px 24px" }}>

      {/* Page header */}
      {mode !== "expenses-only" && (
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "800", color: "var(--text-primary)", margin: "0 0 6px", letterSpacing: "-0.025em", lineHeight: 1.2 }}>
            Settings
          </h1>
          <p style={{ fontSize: "15px", color: "var(--text-muted)", margin: 0 }}>
            Manage your profile, account preferences, notifications, and budget settings.
          </p>
        </div>
      )}

      <div style={{
        display: "grid",
        gridTemplateColumns: mode === "expenses-only" ? "1fr" : "280px 1fr",
        gap: "28px",
        alignItems: "start",
      }}
        className="settings-layout-grid"
      >

        {/* ── Left navigation ── */}
        {mode !== "expenses-only" && (
          <div style={{ position: "sticky", top: "88px" }}>
            <SettingsCard style={{ padding: "16px" }}>
              <p style={{ fontSize: "10px", fontWeight: "700", color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", padding: "8px 12px 12px", margin: 0 }}>
                Preferences
              </p>
              <nav style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {NAV_ITEMS.map(item => {
                  const isActive = activeTab === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id)}
                      style={{
                        display: "flex", alignItems: "center", gap: "12px",
                        width: "100%", padding: "12px 14px", borderRadius: "12px",
                        border: "none", cursor: "pointer", textAlign: "left",
                        transition: "all 0.15s ease",
                        background: isActive
                          ? "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.10))"
                          : "transparent",
                      }}
                      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(0,0,0,0.04)"; }}
                      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                    >
                      <div style={{
                        width: "34px", height: "34px", borderRadius: "9px", flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: isActive ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "rgba(0,0,0,0.06)",
                        transition: "background 0.15s ease",
                      }}>
                        <Icon size={15} style={{ color: isActive ? "#fff" : "var(--text-muted)" }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          fontSize: "13px", fontWeight: isActive ? "700" : "600",
                          color: isActive ? "#6366f1" : "var(--text-primary)",
                          margin: 0, lineHeight: 1.3,
                        }}>
                          {item.label}
                        </p>
                        <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: 0, lineHeight: 1.3 }}>{item.desc}</p>
                      </div>
                      {isActive && (
                        <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#6366f1", flexShrink: 0 }} />
                      )}
                    </button>
                  );
                })}
              </nav>
            </SettingsCard>
          </div>
        )}

        {/* ── Right content ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", minWidth: 0 }}>

          {/* ── Tab: Profile ── */}
          {activeTab === "profile" && (
            <SettingsCard>
              <CardHeader icon={User} title="Profile Settings" subtitle="Update your personal information and display preferences" />
              {role === "student"  && <StudentProfileView />}
              {(role === "tutor" || role === "teacher") && <TutorProfileView />}
              {role === "alumni"  && <AlumniProfileView />}
            </SettingsCard>
          )}

          {/* ── Tab: Account ── */}
          {activeTab === "account" && (
            <>
              <SettingsCard>
                <CardHeader icon={SettingsIcon} title="Theme Preference" subtitle="Choose your display mode. Syncs across the entire platform." />
                <ThemePreference
                  variant="inline"
                  title="Theme Preference"
                  description="Choose between Light and Dark mode styles. Syncs across the platform."
                />
              </SettingsCard>

              <SettingsCard>
                <CardHeader icon={ShieldCheck} color="#10b981" title="Privacy Preferences" subtitle="Control who can see your profile and how you appear across the platform." />
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <ToggleRow
                    id="priv-alumni"
                    label="Visible to verified alumni"
                    desc="Allow verified alumni to discover your profile and reach out for referrals."
                    checked={true}
                    onChange={() => {}}
                  />
                  <ToggleRow
                    id="priv-tutor"
                    label="Share attendance history with tutors"
                    desc="Allow tutors to view your attendance record before scheduling classes."
                    checked={true}
                    onChange={() => {}}
                  />
                </div>
              </SettingsCard>
            </>
          )}

          {/* ── Tab: Notifications ── */}
          {activeTab === "notifications" && (
            <SettingsCard>
              <CardHeader icon={Bell} color="#f59e0b" title="Platform Notifications" subtitle="Choose which alerts you receive and through which channels." />
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <ToggleRow
                  id="notif-booking"
                  label="Class Booking Confirmations"
                  desc="Get real-time alerts when you book or are confirmed for a tutorial class."
                  checked={true}
                  onChange={() => {}}
                />
                <ToggleRow
                  id="notif-referral"
                  label="Referral Application Updates"
                  desc="Be notified when alumni update your referral status or post new opportunities."
                  checked={true}
                  onChange={() => {}}
                />
              </div>
            </SettingsCard>
          )}

          {/* ── Tab: Expenses ── */}
          {activeTab === "expenses" && showExpenseTab && (
            loadingSettings ? (
              <SettingsCard>
                <div style={{ padding: "48px", textAlign: "center" }}>
                  <div style={{
                    width: "48px", height: "48px", borderRadius: "50%",
                    border: "3px solid rgba(99,102,241,0.2)",
                    borderTop: "3px solid #6366f1",
                    animation: "spin 0.8s linear infinite",
                    margin: "0 auto 16px",
                  }} />
                  <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: 0 }}>Loading expense configuration...</p>
                </div>
              </SettingsCard>
            ) : (
              <form onSubmit={handleSaveSettings} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

                {/* Overview metrics */}
                {summaryMetrics && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }} className="metrics-grid">
                    {/* Budget health */}
                    <SettingsCard style={{ padding: "20px" }}>
                      <p style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 10px" }}>Budget Health</p>
                      <p style={{ fontSize: "30px", fontWeight: "800", color: "var(--text-primary)", margin: "0 0 2px", letterSpacing: "-0.03em" }}>
                        {summaryMetrics.utilizationPercentage}%
                      </p>
                      <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "0 0 10px" }}>used this month</p>
                      <div style={{ height: "6px", background: "rgba(0,0,0,0.07)", borderRadius: "999px", overflow: "hidden" }}>
                        <div style={{
                          height: "100%", borderRadius: "999px", transition: "width 0.5s ease",
                          width: `${Math.min(summaryMetrics.utilizationPercentage, 100)}%`,
                          background: summaryMetrics.utilizationPercentage > 90 ? "#ef4444" : summaryMetrics.utilizationPercentage > 75 ? "#f59e0b" : "#10b981",
                        }} />
                      </div>
                    </SettingsCard>

                    {/* Savings progress */}
                    <SettingsCard style={{ padding: "20px" }}>
                      <p style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 10px" }}>Savings Progress</p>
                      <p style={{
                        fontSize: "26px", fontWeight: "800", margin: "0 0 2px", letterSpacing: "-0.03em",
                        color: summaryMetrics.currentSavings >= summaryMetrics.savingsGoal ? "#10b981" : "var(--text-primary)"
                      }}>
                        {getCurrencySymbol(settings.currency)}{summaryMetrics.currentSavings?.toLocaleString() || "0"}
                      </p>
                      <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>
                        Goal: {getCurrencySymbol(settings.currency)}{summaryMetrics.savingsGoal?.toLocaleString() || "0"}
                      </p>
                    </SettingsCard>

                    {/* Quick actions */}
                    <SettingsCard style={{ padding: "20px" }}>
                      <p style={{ fontSize: "11px", fontWeight: "700", color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 12px" }}>Quick Actions</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <button
                          type="button" onClick={() => setIsAddExpenseOpen(true)}
                          style={{
                            height: "36px", borderRadius: "10px", border: "none", cursor: "pointer",
                            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                            color: "#fff", fontSize: "12px", fontWeight: "700",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                            transition: "opacity 0.15s ease",
                          }}
                          onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                        >
                          <Plus size={13} /> Add Expense
                        </button>
                        <button
                          type="button" onClick={() => setIsAddBillOpen(true)}
                          style={{
                            height: "36px", borderRadius: "10px", cursor: "pointer",
                            background: "transparent", border: "1.5px solid var(--border-color)",
                            color: "var(--text-primary)", fontSize: "12px", fontWeight: "700",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                            transition: "all 0.15s ease",
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,0.06)"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        >
                          <Plus size={13} /> Add Bill
                        </button>
                        <button
                          type="button" onClick={() => navigate("/expenses-tracker/bills/history")}
                          style={{
                            height: "32px", borderRadius: "9px", cursor: "pointer",
                            background: "transparent", border: "none",
                            color: "#6366f1", fontSize: "12px", fontWeight: "600",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: "5px",
                          }}
                        >
                          <Eye size={12} /> View Bill History
                        </button>
                      </div>
                    </SettingsCard>
                  </div>
                )}

                {/* Budget Configuration */}
                <SettingsCard>
                  <CardHeader icon={DollarSign} title="Budget Configuration" subtitle="Set your monthly, weekly, and daily spending limits." />
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }} className="budget-grid-3">
                      <SettingsInput label="Monthly Budget" required>
                        <input
                          type="number"
                          value={settings.monthlyBudget || ""}
                          onChange={e => handleSettingsChange("monthlyBudget", e.target.value === "" ? 0 : Number(e.target.value))}
                          placeholder="e.g. 15000"
                          style={inputStyle}
                          min="0" required
                          onFocus={e => { e.target.style.borderColor = "#6366f1"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.10)"; }}
                          onBlur={e => { e.target.style.borderColor = "var(--border-color)"; e.target.style.boxShadow = "none"; }}
                        />
                      </SettingsInput>
                      <SettingsInput label="Weekly Budget">
                        <input
                          type="number"
                          value={settings.weeklyBudget || ""}
                          onChange={e => handleSettingsChange("weeklyBudget", e.target.value === "" ? 0 : Number(e.target.value))}
                          placeholder="e.g. 3500"
                          style={inputStyle} min="0"
                          onFocus={e => { e.target.style.borderColor = "#6366f1"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.10)"; }}
                          onBlur={e => { e.target.style.borderColor = "var(--border-color)"; e.target.style.boxShadow = "none"; }}
                        />
                      </SettingsInput>
                      <SettingsInput label="Daily Budget">
                        <input
                          type="number"
                          value={settings.dailyBudget || ""}
                          onChange={e => handleSettingsChange("dailyBudget", e.target.value === "" ? 0 : Number(e.target.value))}
                          placeholder="e.g. 500"
                          style={inputStyle} min="0"
                          onFocus={e => { e.target.style.borderColor = "#6366f1"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.10)"; }}
                          onBlur={e => { e.target.style.borderColor = "var(--border-color)"; e.target.style.boxShadow = "none"; }}
                        />
                      </SettingsInput>
                    </div>

                    <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }} className="budget-grid-2">
                      <SettingsInput label="Currency">
                        <select
                          value={settings.currency}
                          onChange={e => handleSettingsChange("currency", e.target.value)}
                          style={{ ...inputStyle, cursor: "pointer", appearance: "none",
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                            backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: "40px",
                          }}
                          onFocus={e => { e.target.style.borderColor = "#6366f1"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.10)"; }}
                          onBlur={e => { e.target.style.borderColor = "var(--border-color)"; e.target.style.boxShadow = "none"; }}
                        >
                          <option value="INR">INR (₹)</option>
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                        </select>
                      </SettingsInput>
                      <SettingsInput label="Target Monthly Savings">
                        <input
                          type="number"
                          value={settings.savingsGoal || ""}
                          onChange={e => handleSettingsChange("savingsGoal", e.target.value === "" ? 0 : Number(e.target.value))}
                          placeholder="e.g. 3000"
                          style={inputStyle} min="0"
                          onFocus={e => { e.target.style.borderColor = "#6366f1"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.10)"; }}
                          onBlur={e => { e.target.style.borderColor = "var(--border-color)"; e.target.style.boxShadow = "none"; }}
                        />
                      </SettingsInput>
                    </div>
                  </div>
                </SettingsCard>

                {/* Category Limits */}
                <SettingsCard>
                  <CardHeader
                    icon={BarChart3}
                    color="#8b5cf6"
                    title="Spending Limits by Category"
                    subtitle="Set monthly caps for each expense category. Leave blank for no limit."
                  />
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "16px" }} className="cat-grid">
                    {STUDENT_CATEGORIES.map(cat => {
                      const meta = CATEGORY_META[cat] || { icon: MoreHorizontal, color: "#94a3b8", bg: "rgba(148,163,184,0.10)" };
                      const CatIcon = meta.icon;
                      const value = settings.categoryLimits?.[cat];
                      return (
                        <div
                          key={cat}
                          style={{
                            padding: "14px", borderRadius: "14px",
                            border: "1.5px solid var(--border-color)",
                            background: "var(--card-bg)",
                            transition: "all 0.15s ease",
                            cursor: "default",
                          }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = meta.color + "40"; e.currentTarget.style.boxShadow = `0 4px 12px ${meta.color}18`; e.currentTarget.style.transform = "translateY(-1px)"; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                            <div style={{
                              width: "28px", height: "28px", borderRadius: "8px",
                              background: meta.bg, border: `1px solid ${meta.color}30`,
                              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                            }}>
                              <CatIcon size={13} style={{ color: meta.color }} />
                            </div>
                            <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-primary)", lineHeight: 1.2 }}>{cat}</span>
                          </div>
                          <input
                            type="number"
                            value={value || ""}
                            onChange={e => handleCategoryLimitChange(cat, e.target.value)}
                            placeholder="No limit"
                            min="0"
                            style={{
                              height: "38px", width: "100%",
                              borderRadius: "9px", border: "1px solid var(--border-color)",
                              background: "rgba(0,0,0,0.03)", color: "var(--text-primary)",
                              padding: "0 10px", fontSize: "13px", fontWeight: "500",
                              outline: "none", transition: "border-color 0.15s ease",
                            }}
                            onFocus={e => e.target.style.borderColor = meta.color}
                            onBlur={e => e.target.style.borderColor = "var(--border-color)"}
                          />
                        </div>
                      );
                    })}
                  </div>
                </SettingsCard>

                {/* Budget Preferences — Allow exceed toggle */}
                <SettingsCard>
                  <CardHeader icon={AlertTriangle} color="#f59e0b" title="Budget Preferences" subtitle="Configure how the platform enforces your spending rules." />
                  <ToggleRow
                    id="allow-exceed"
                    label="Allow category limits to exceed monthly budget"
                    desc="When enabled, the sum of individual category limits can be greater than your total monthly budget without triggering a validation error."
                    checked={allowLimitsExceedBudget}
                    onChange={v => setAllowLimitsExceedBudget(v)}
                  />
                </SettingsCard>

                {/* Alert Thresholds */}
                <SettingsCard>
                  <CardHeader icon={Zap} color="#ef4444" title="Budget Alert Thresholds" subtitle="Get notified as your monthly spending reaches key milestones." />
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <ToggleRow
                      id="alert-50"
                      label="Alert at 50% used"
                      desc="Receive a notification when monthly expenses reach 50% of budget."
                      checked={settings.alertThresholds?.fifty ?? true}
                      onChange={v => handleNestedChange("alertThresholds", "fifty", v)}
                    />
                    <ToggleRow
                      id="alert-75"
                      label="Alert at 75% used"
                      desc="Receive a notification when monthly expenses reach 75% of budget."
                      checked={settings.alertThresholds?.seventyFive ?? true}
                      onChange={v => handleNestedChange("alertThresholds", "seventyFive", v)}
                    />
                    <ToggleRow
                      id="alert-90"
                      label="Alert at 90% used"
                      desc="Receive a notification when monthly expenses reach 90% of budget."
                      checked={settings.alertThresholds?.ninety ?? true}
                      onChange={v => handleNestedChange("alertThresholds", "ninety", v)}
                    />
                    <ToggleRow
                      id="alert-100"
                      label="Alert at 100% — budget exhausted"
                      desc="Immediate alert when your monthly budget limit is fully consumed."
                      checked={settings.alertThresholds?.hundred ?? true}
                      onChange={v => handleNestedChange("alertThresholds", "hundred", v)}
                    />
                  </div>
                </SettingsCard>

                {/* Expense Notifications */}
                <SettingsCard>
                  <CardHeader icon={Bell} color="#6366f1" title="Expense Notifications" subtitle="Choose which notification channels are active for expense alerts." />
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <ToggleRow
                      id="notif-email"
                      label="Email Notifications"
                      desc="Send bill due reminders and budget warnings to your registered email address."
                      checked={settings.notificationPreferences?.email ?? true}
                      onChange={v => handleNestedChange("notificationPreferences", "email", v)}
                    />
                    <ToggleRow
                      id="notif-push"
                      label="Push Notifications"
                      desc="Receive browser and in-app push alerts for all expense events."
                      checked={settings.notificationPreferences?.push ?? true}
                      onChange={v => handleNestedChange("notificationPreferences", "push", v)}
                    />
                    <ToggleRow
                      id="notif-billdue"
                      label="Bill Due Alerts"
                      desc="Get reminded 2 days, 1 day, and on the morning of each bill's due date."
                      checked={settings.notificationPreferences?.billDueAlerts ?? true}
                      onChange={v => handleNestedChange("notificationPreferences", "billDueAlerts", v)}
                    />
                    <ToggleRow
                      id="notif-overdue"
                      label="Overdue Bill Alerts"
                      desc="Receive an immediate alert if a bill passes its due date without payment."
                      checked={settings.notificationPreferences?.overdueAlerts ?? true}
                      onChange={v => handleNestedChange("notificationPreferences", "overdueAlerts", v)}
                    />
                    <ToggleRow
                      id="notif-savings"
                      label="Savings Goal Reached"
                      desc="Be notified when your current savings hit your monthly savings target."
                      checked={settings.notificationPreferences?.savingsGoalAlerts ?? true}
                      onChange={v => handleNestedChange("notificationPreferences", "savingsGoalAlerts", v)}
                    />
                  </div>
                </SettingsCard>

                {/* Save button */}
                <div style={{ display: "flex", justifyContent: "flex-end", paddingBottom: "8px" }}>
                  <button
                    type="submit"
                    disabled={savingSettings}
                    style={{
                      height: "50px", padding: "0 36px", borderRadius: "14px", border: "none",
                      background: savingSettings ? "rgba(99,102,241,0.5)" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                      color: "#fff", fontSize: "14px", fontWeight: "700",
                      cursor: savingSettings ? "not-allowed" : "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                      boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
                      transition: "all 0.15s ease", letterSpacing: "0.01em",
                      minWidth: "160px",
                    }}
                    onMouseEnter={e => { if (!savingSettings) e.currentTarget.style.boxShadow = "0 6px 20px rgba(99,102,241,0.5)"; }}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = "0 4px 14px rgba(99,102,241,0.35)"}
                  >
                    {savingSettings ? (
                      <>
                        <span style={{ width: "16px", height: "16px", borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
                        Saving…
                      </>
                    ) : (
                      "Save Settings"
                    )}
                  </button>
                </div>
              </form>
            )
          )}
        </div>
      </div>

      {/* ── Responsive styles ── */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 1024px) {
          .settings-layout-grid {
            grid-template-columns: 1fr !important;
          }
          .settings-layout-grid > div:first-child {
            position: static !important;
          }
          .settings-layout-grid > div:first-child nav {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .metrics-grid { grid-template-columns: 1fr !important; }
          .budget-grid-3 { grid-template-columns: 1fr !important; }
          .budget-grid-2 { grid-template-columns: 1fr !important; }
          .cat-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .settings-layout-grid > div:first-child nav {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .cat-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── Add Bill Modal (unchanged) ── */}
      <Dialog open={isAddBillOpen} onOpenChange={setIsAddBillOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader><DialogTitle>Quick Add Bill</DialogTitle></DialogHeader>
          <form onSubmit={handleAddBill} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Bill Name</label>
              <input type="text" value={billForm.billName} onChange={e => setBillForm({ ...billForm, billName: e.target.value })}
                className="premium-input text-foreground h-10 w-full" placeholder="e.g. Electricity Bill, Exam Fee" required />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Amount (₹)</label>
              <input type="number" value={billForm.amount} onChange={e => setBillForm({ ...billForm, amount: e.target.value })}
                className="premium-input text-foreground h-10 w-full" placeholder="0.00" min="0.01" step="0.01" required />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Due Date</label>
              <input type="date" value={billForm.dueDate} onChange={e => setBillForm({ ...billForm, dueDate: e.target.value })}
                className="premium-input text-foreground h-10 w-full cursor-pointer" required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Priority Level</label>
                <select value={billForm.priority} onChange={e => setBillForm({ ...billForm, priority: e.target.value })}
                  className="premium-input text-foreground h-10 w-full cursor-pointer">
                  <option value="Low">Low</option><option value="Medium">Medium</option>
                  <option value="High">High</option><option value="Critical">Critical</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Recurring Cycle</label>
                <select value={billForm.recurringType}
                  onChange={e => setBillForm({ ...billForm, recurringType: e.target.value, isRecurring: e.target.value !== "None" })}
                  className="premium-input text-foreground h-10 w-full cursor-pointer">
                  <option value="None">None</option><option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option><option value="Semester">Semester (6 Mo.)</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4 justify-end pt-4 border-t border-border/20">
              <button type="button" onClick={() => setIsAddBillOpen(false)}
                className="px-5 py-2.5 rounded-[var(--radius-sm)] border border-border text-foreground hover:bg-secondary transition-colors cursor-pointer">Cancel</button>
              <button type="submit"
                className="px-5 py-2.5 rounded-[var(--radius-sm)] bg-primary text-primary-foreground hover:bg-primary/95 transition-colors font-bold cursor-pointer">Confirm</button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Add Expense Modal (unchanged) ── */}
      <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader><DialogTitle>Quick Add Expense</DialogTitle></DialogHeader>
          <form onSubmit={handleAddExpense} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Description / Title</label>
              <input type="text" value={expenseForm.title} onChange={e => setExpenseForm({ ...expenseForm, title: e.target.value })}
                className="premium-input text-foreground h-10 w-full" placeholder="e.g. Lunch with friends, Books purchase" required />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Amount (₹)</label>
              <input type="number" value={expenseForm.amount} onChange={e => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                className="premium-input text-foreground h-10 w-full" placeholder="0.00" min="0.01" step="0.01" required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Category</label>
                <select value={expenseForm.category} onChange={e => setExpenseForm({ ...expenseForm, category: e.target.value })}
                  className="premium-input text-foreground h-10 w-full cursor-pointer">
                  {STUDENT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Payment Method</label>
                <select value={expenseForm.paymentMethod} onChange={e => setExpenseForm({ ...expenseForm, paymentMethod: e.target.value })}
                  className="premium-input text-foreground h-10 w-full cursor-pointer">
                  <option value="UPI">UPI</option><option value="Cash">Cash</option>
                  <option value="Card">Card</option><option value="Bank">Bank Transfer</option>
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Date</label>
              <input type="date" value={expenseForm.date} onChange={e => setExpenseForm({ ...expenseForm, date: e.target.value })}
                className="premium-input text-foreground h-10 w-full cursor-pointer" required />
            </div>
            <div className="flex gap-4 justify-end pt-4 border-t border-border/20">
              <button type="button" onClick={() => setIsAddExpenseOpen(false)}
                className="px-5 py-2.5 rounded-[var(--radius-sm)] border border-border text-foreground hover:bg-secondary transition-colors cursor-pointer">Cancel</button>
              <button type="submit"
                className="px-5 py-2.5 rounded-[var(--radius-sm)] bg-primary text-primary-foreground hover:bg-primary/95 transition-colors font-bold cursor-pointer">Confirm</button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}

export default AccountSetting;
