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
  TrendingUp, 
  Plus, 
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  AlertCircle
} from "lucide-react";

import { toast } from "react-hot-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog.jsx";


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
  "Other"
];

function AccountSetting({ mode }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = mode === "expenses-only" ? "expenses" : (searchParams.get("tab") || "profile");
  const role = (user?.role || user?.accountType || "student").toLowerCase();

  // Settings State
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

  // Modals inside settings
  const [isAddBillOpen, setIsAddBillOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  // Quick Add Forms
  const [billForm, setBillForm] = useState({
    billName: "",
    amount: "",
    dueDate: "",
    priority: "Medium",
    isRecurring: false,
    recurringType: "None"
  });

  const [expenseForm, setExpenseForm] = useState({
    amount: "",
    category: "Food",
    date: new Date().toISOString().split("T")[0],
    title: "",
    type: "expense",
    paymentMethod: "UPI",
    note: ""
  });

  useEffect(() => {
    if (role === "student" && activeTab === "expenses") {
      fetchSettings();
      fetchSummary();
    }
  }, [activeTab, role]);

  const fetchSettings = async () => {
    setLoadingSettings(true);
    try {
      const data = await expensesApi.getSettings();
      if (data) {
        // Normalize maps to standard objects
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
      if (data) {
        setSummaryMetrics(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleTabChange = (tabName) => {
    setSearchParams({ tab: tabName });
  };

  const handleSettingsChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedChange = (parent, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleCategoryLimitChange = (category, value) => {
    setSettings((prev) => ({
      ...prev,
      categoryLimits: {
        ...prev.categoryLimits,
        [category]: value === "" ? 0 : Number(value)
      }
    }));
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);

    // Sum limits
    let limitsSum = 0;
    Object.values(settings.categoryLimits).forEach((val) => {
      limitsSum += Number(val || 0);
    });

    if (limitsSum > settings.monthlyBudget && !allowLimitsExceedBudget) {
      toast.error(`Total category limits (₹${limitsSum.toLocaleString()}) exceed monthly budget (₹${settings.monthlyBudget.toLocaleString()}). Adjust limits or check "Allow category limits to exceed monthly budget".`);
      setSavingSettings(false);
      return;
    }

    try {
      const payload = {
        ...settings,
        allowLimitsExceedBudget
      };
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
      const res = await expensesApi.createBill({
        ...billForm,
        amount: Number(billForm.amount)
      });
      if (res.statusCode === 201) {
        toast.success("Bill added successfully!");
        setIsAddBillOpen(false);
        setBillForm({
          billName: "",
          amount: "",
          dueDate: "",
          priority: "Medium",
          isRecurring: false,
          recurringType: "None"
        });
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
      // Find local storage user
      const localUser = JSON.parse(localStorage.getItem("User"));
      const res = await expensesApi.createExpense({
        ...expenseForm,
        userId: localUser?._id,
        amount: Number(expenseForm.amount)
      });
      if (res) {
        toast.success("Expense added successfully!");
        setIsAddExpenseOpen(false);
        setExpenseForm({
          amount: "",
          category: "Food",
          date: new Date().toISOString().split("T")[0],
          title: "",
          type: "expense",
          paymentMethod: "UPI",
          note: ""
        });
        fetchSummary();
      } else {
        toast.error("Failed to add expense");
      }
    } catch (err) {
      toast.error("Failed to add expense.");
    }
  };

  // Roles visible for expenses
  const showExpenseTab = role === "student";

  // getCurrencySymbol is imported from @/utils/formatters
  // It uses Intl.NumberFormat so the symbol is always correctly encoded.

  return (
    <main className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-fade-in-up">
      <style>{`
        .settings-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 36px;
          align-items: stretch;
          width: 100%;
        }
        @media (min-width: 1024px) {
          .settings-grid {
            grid-template-columns: minmax(280px, 0.75fr) minmax(0, 2.25fr);
          }
        }
        .settings-sidebar {
          align-self: stretch;
          height: 100%;
          min-height: 570px;
          border-radius: 18px;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
          overflow: hidden;
          padding-top: 16px;
          padding-bottom: 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .settings-nav-btn {
          height: 70px;
          display: flex;
          align-items: center;
          padding-left: 24px;
          padding-right: 24px;
          gap: 18px;
          width: calc(100% - 24px);
          margin: 0 12px;
          box-sizing: border-box;
          position: relative;
          transition: all 0.2s ease;
          border-radius: 8px;
          color: var(--muted-foreground);
          font-weight: 500;
          text-align: left;
          background: transparent;
          border: none;
          cursor: pointer;
        }
        .settings-nav-btn:hover {
          background: var(--secondary);
          color: var(--foreground);
        }
        .settings-nav-btn.active {
          background: rgba(59, 130, 246, 0.08);
          color: #3b82f6;
          font-weight: 600;
        }
        .settings-nav-btn.active::before {
          content: "";
          position: absolute;
          left: 0;
          top: 10px;
          bottom: 10px;
          width: 3px;
          border-radius: 0 3px 3px 0;
          background: #3b82f6;
        }
        .nav-icon {
          width: 26px;
          height: 26px;
          flex-shrink: 0;
        }
        .notification-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 20px 24px;
          min-height: 88px;
          width: 100%;
          box-sizing: border-box;
          background: var(--surface-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          transition: background-color 150ms ease, border-color 150ms ease;
          cursor: pointer;
        }
        .notification-row:hover {
          background: var(--bg-secondary);
          border-color: var(--accent);
        }
        .dark .notification-row:hover,
        [data-theme="dark"] .notification-row:hover {
          background: var(--card-hover-bg);
        }
      `}</style>


      {/* Title */}
      {mode !== "expenses-only" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-sans text-foreground tracking-tight flex items-center gap-3">
            <span className="text-[var(--primary)]">Settings Panel</span>
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Customize your profile, account preferences, theme options, notifications, and expense budgets.
          </p>
        </div>
      )}

      <div className="settings-grid">
        {/* Navigation Sidebar/Tabs */}
        {mode !== "expenses-only" && (
          <div className="bg-card border border-border settings-sidebar shrink-0 select-none">
            <button
              onClick={() => handleTabChange("profile")}
              className={`settings-nav-btn ${activeTab === "profile" ? "active" : ""}`}
            >
              <User className="nav-icon" />
              <span>Profile Settings</span>
            </button>
            
            <button
              onClick={() => handleTabChange("account")}
              className={`settings-nav-btn ${activeTab === "account" ? "active" : ""}`}
            >
              <SettingsIcon className="nav-icon" />
              <span>Account Preference</span>
            </button>

            <button
              onClick={() => handleTabChange("notifications")}
              className={`settings-nav-btn ${activeTab === "notifications" ? "active" : ""}`}
            >
              <Bell className="nav-icon" />
              <span>Notifications</span>
            </button>

            {showExpenseTab && (
              <button
                onClick={() => handleTabChange("expenses")}
                className={`settings-nav-btn ${activeTab === "expenses" ? "active" : ""}`}
              >
                <Wallet className="nav-icon" />
                <span>💰 Expense Tracker</span>
              </button>
            )}
          </div>
        )}

        {/* Content Section */}
        <div className={mode === "expenses-only" ? "w-full" : "flex-1 w-full min-w-0"}>
          {/* Tab 1: Profile */}
          {activeTab === "profile" && (
            <div className="w-full">
              {role === "student" && <StudentProfileView />}
              {(role === "tutor" || role === "teacher") && <TutorProfileView />}
              {role === "alumni" && <AlumniProfileView />}
            </div>
          )}

          {/* Tab 2: Account */}
          {activeTab === "account" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              <div 
                className="bg-card border border-border" 
                style={{ 
                  padding: "42px 40px", 
                  minHeight: "190px",
                  borderRadius: "18px",
                  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <ThemePreference
                  variant="inline"
                  title="Theme Preference"
                  description="Choose between Light and Dark mode styles. Syncs across the platform."
                />
              </div>

              <div 
                className="bg-card border border-border" 
                style={{ 
                  padding: "48px 40px", 
                  minHeight: "335px",
                  borderRadius: "18px",
                  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h3 className="text-lg font-bold text-foreground" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <ShieldCheck className="text-primary" style={{ width: "30px", height: "30px" }} /> Privacy Preferences
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed" style={{ marginTop: "24px" }}>
                  Configure privacy controls for your profile, referral searchability, and messaging channels.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginTop: "32px" }}>
                  <label className="cursor-pointer" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <input 
                      type="checkbox" 
                      defaultChecked 
                      className="rounded border-border accent-primary" 
                      style={{ width: "24px", height: "24px", cursor: 'pointer' }}
                    />
                    <span className="text-sm font-medium text-foreground">Make my profile visible to verified alumni</span>
                  </label>
                  <label className="cursor-pointer" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <input 
                      type="checkbox" 
                      defaultChecked 
                      className="rounded border-border accent-primary" 
                      style={{ width: "24px", height: "24px", cursor: 'pointer' }}
                    />
                    <span className="text-sm font-medium text-foreground">Allow tutors to view my attendance history before classes</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Notifications */}
          {activeTab === "notifications" && (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div 
                className="bg-card border border-border" 
                style={{ 
                  padding: "36px 40px", 
                  borderRadius: "18px",
                  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  maxWidth: "100%",
                  minWidth: "0",
                  boxSizing: "border-box",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "28px" }}>
                  <h2 className="text-lg font-bold text-foreground" style={{ margin: 0 }}>General Platform Alerts</h2>
                  <p className="text-muted-foreground text-xs" style={{ margin: 0 }}>Select channel notification defaults.</p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <label className="notification-row">
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", minWidth: 0, flex: 1 }}>
                      <h4 className="text-foreground" style={{ fontSize: "18px", fontWeight: 600, margin: 0 }}>Class Booking Confirmations</h4>
                      <p className="text-muted-foreground" style={{ fontSize: "15px", fontWeight: 400, margin: 0 }}>Receive real-time alerts when booking a new tutorial class.</p>
                    </div>
                    <input 
                      type="checkbox" 
                      defaultChecked 
                      className="rounded accent-primary" 
                      style={{ 
                        flexShrink: 0,
                        marginLeft: "24px",
                        width: "24px",
                        height: "24px",
                        cursor: "pointer"
                      }} 
                    />
                  </label>

                  <label className="notification-row">
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", minWidth: 0, flex: 1 }}>
                      <h4 className="text-foreground" style={{ fontSize: "18px", fontWeight: 600, margin: 0 }}>Referral Application Updates</h4>
                      <p className="text-muted-foreground" style={{ fontSize: "15px", fontWeight: 400, margin: 0 }}>Receive notifications when alumni refer you or update job statuses.</p>
                    </div>
                    <input 
                      type="checkbox" 
                      defaultChecked 
                      className="rounded accent-primary" 
                      style={{ 
                        flexShrink: 0,
                        marginLeft: "24px",
                        width: "24px",
                        height: "24px",
                        cursor: "pointer"
                      }} 
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Expense Tracker Settings */}
          {activeTab === "expenses" && showExpenseTab && (
            <div className="space-y-6">
              {loadingSettings ? (
                <div className="glass-panel text-center border border-border rounded-[var(--radius-lg)] bg-card" style={{ padding: '32px 28px' }}>
                  <span className="spinner spinner-lg block mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">Loading expense configuration...</p>
                </div>
              ) : (
                <form onSubmit={handleSaveSettings} className="space-y-6">
                  {/* Overview Dashboard Cards */}
                  {summaryMetrics && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="glass-panel border border-border/60 bg-card rounded-[var(--radius-lg)] relative overflow-hidden flex flex-col justify-between" style={{ padding: '24px 28px' }}>
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Budget Health</span>
                        <div className="mt-3 flex items-baseline gap-2">
                          <span className="text-3xl font-extrabold text-foreground">{summaryMetrics.utilizationPercentage}%</span>
                          <span className="text-xs text-muted-foreground">used</span>
                        </div>
                        <div className="w-full bg-secondary/60 h-2 rounded-full mt-3 overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              summaryMetrics.utilizationPercentage > 90 ? "bg-rose-500" : summaryMetrics.utilizationPercentage > 75 ? "bg-amber-500" : "bg-emerald-500"
                            }`}
                            style={{ width: `${summaryMetrics.utilizationPercentage}%` }}
                          />
                        </div>
                      </div>

                      <div className="glass-panel border border-border/60 bg-card rounded-[var(--radius-lg)] relative overflow-hidden flex flex-col justify-between" style={{ padding: '24px 28px' }}>
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Savings Progress</span>
                        <div className="mt-3 flex items-baseline gap-2">
                          <span className={`text-3xl font-extrabold ${summaryMetrics.currentSavings >= summaryMetrics.savingsGoal ? "text-emerald-500" : "text-foreground"}`}>
                            {getCurrencySymbol(settings.currency)} {summaryMetrics.currentSavings?.toLocaleString() || "0"}
                          </span>
                          <span className="text-xs text-muted-foreground">saved this month</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground/80 mt-3">
                          Goal: {getCurrencySymbol(settings.currency)} {summaryMetrics.savingsGoal?.toLocaleString() || "0"}
                        </p>
                      </div>

                      {/* Quick Actions Card inside settings */}
                      <div className="glass-panel border border-border/60 bg-card rounded-[var(--radius-lg)] relative overflow-hidden flex flex-col justify-between" style={{ padding: '24px 28px' }}>
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">Quick Actions</span>
                        <div className="grid grid-cols-2 gap-2 mt-4">
                          <button
                            type="button"
                            onClick={() => setIsAddExpenseOpen(true)}
                            className="text-xs font-bold py-2 px-3 rounded-[var(--radius-sm)] bg-primary text-primary-foreground hover:bg-primary/95 text-center transition-colors cursor-pointer"
                          >
                            + Add Expense
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsAddBillOpen(true)}
                            className="text-xs font-bold py-2 px-3 rounded-[var(--radius-sm)] bg-secondary text-foreground hover:bg-secondary/80 border border-border text-center transition-colors cursor-pointer"
                          >
                            + Add Bill
                          </button>
                          <button
                            type="button"
                            onClick={() => navigate("/expenses-tracker/bills/history")}
                            className="text-xs font-semibold py-2 px-3 rounded-[var(--radius-sm)] bg-secondary/50 text-muted-foreground hover:text-foreground text-center border border-border transition-colors cursor-pointer col-span-2"
                          >
                            View Bill History
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Budget Configuration Card */}
                  <div className="glass-panel border border-border bg-card rounded-[var(--radius-lg)] space-y-6" style={{ padding: '24px 28px' }}>
                    <h3 className="text-lg font-bold text-foreground">💰 Budget Configuration</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground">Monthly Budget (Required)</label>
                        <input
                          type="number"
                          value={settings.monthlyBudget || ""}
                          onChange={(e) => handleSettingsChange("monthlyBudget", e.target.value === "" ? 0 : Number(e.target.value))}
                          placeholder="Monthly budget amount"
                          className="premium-input text-foreground h-10 w-full"
                          min="0"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground">Weekly Budget</label>
                        <input
                          type="number"
                          value={settings.weeklyBudget || ""}
                          onChange={(e) => handleSettingsChange("weeklyBudget", e.target.value === "" ? 0 : Number(e.target.value))}
                          placeholder="Weekly budget amount"
                          className="premium-input text-foreground h-10 w-full"
                          min="0"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground">Daily Budget</label>
                        <input
                          type="number"
                          value={settings.dailyBudget || ""}
                          onChange={(e) => handleSettingsChange("dailyBudget", e.target.value === "" ? 0 : Number(e.target.value))}
                          placeholder="Daily budget amount"
                          className="premium-input text-foreground h-10 w-full"
                          min="0"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/30">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground">Currency</label>
                        <select
                          value={settings.currency}
                          onChange={(e) => handleSettingsChange("currency", e.target.value)}
                          className="premium-input text-foreground h-10 w-full cursor-pointer appearance-none"
                        >
                          <option value="INR">INR (₹)</option>
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground">Target Monthly Savings</label>
                        <input
                          type="number"
                          value={settings.savingsGoal || ""}
                          onChange={(e) => handleSettingsChange("savingsGoal", e.target.value === "" ? 0 : Number(e.target.value))}
                          placeholder="Monthly target savings"
                          className="premium-input text-foreground h-10 w-full"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Category Limits Card */}
                  <div className="glass-panel border border-border bg-card rounded-[var(--radius-lg)] space-y-6" style={{ padding: '24px 28px' }}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div>
                        <h3 className="text-lg font-bold text-foreground">Spending Limits by Category</h3>
                        <p className="text-muted-foreground text-xs mt-0.5">Control category limits inside monthly budget.</p>
                      </div>
                      <label className="flex items-center gap-2.5 cursor-pointer p-2 rounded-[var(--radius-md)] border border-border bg-secondary/10 shrink-0">
                        <input 
                          type="checkbox"
                          checked={allowLimitsExceedBudget}
                          onChange={(e) => setAllowLimitsExceedBudget(e.target.checked)}
                          className="rounded h-4 w-4 accent-primary" 
                        />
                        <span className="text-xs font-semibold text-foreground">Allow limits to exceed monthly budget</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {STUDENT_CATEGORIES.map((cat) => (
                        <div key={cat} className="space-y-1.5 p-3.5 rounded-[var(--radius-md)] border border-border/50 bg-secondary/15">
                          <label className="text-xs font-bold text-foreground">{cat}</label>
                          <input
                            type="number"
                            value={settings.categoryLimits?.[cat] || ""}
                            onChange={(e) => handleCategoryLimitChange(cat, e.target.value)}
                            placeholder="No Limit set"
                            className="premium-input text-foreground h-9 w-full"
                            min="0"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notification and Alert Toggles */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-panel border border-border bg-card rounded-[var(--radius-lg)] space-y-6" style={{ padding: '24px 28px' }}>
                      <h3 className="text-lg font-bold text-foreground">⚠️ Budget Alert Thresholds</h3>
                      <div className="space-y-4">
                        <label className="flex items-center justify-between p-3 rounded-[var(--radius-md)] border border-border/55 bg-secondary/10 cursor-pointer">
                          <div>
                            <span className="text-sm font-semibold text-foreground">Notify at 50% Used</span>
                            <p className="text-[11px] text-muted-foreground">Alert when monthly expenses hit 50%.</p>
                          </div>
                          <input 
                            type="checkbox"
                            checked={settings.alertThresholds?.fifty ?? true}
                            onChange={(e) => handleNestedChange("alertThresholds", "fifty", e.target.checked)}
                            className="rounded h-4 w-4 accent-primary"
                          />
                        </label>
                        <label className="flex items-center justify-between p-3 rounded-[var(--radius-md)] border border-border/55 bg-secondary/10 cursor-pointer">
                          <div>
                            <span className="text-sm font-semibold text-foreground">Notify at 75% Used</span>
                            <p className="text-[11px] text-muted-foreground">Alert when monthly expenses hit 75%.</p>
                          </div>
                          <input 
                            type="checkbox"
                            checked={settings.alertThresholds?.seventyFive ?? true}
                            onChange={(e) => handleNestedChange("alertThresholds", "seventyFive", e.target.checked)}
                            className="rounded h-4 w-4 accent-primary"
                          />
                        </label>
                        <label className="flex items-center justify-between p-3 rounded-[var(--radius-md)] border border-border/55 bg-secondary/10 cursor-pointer">
                          <div>
                            <span className="text-sm font-semibold text-foreground">Notify at 90% Used</span>
                            <p className="text-[11px] text-muted-foreground">Alert when monthly expenses hit 90%.</p>
                          </div>
                          <input 
                            type="checkbox"
                            checked={settings.alertThresholds?.ninety ?? true}
                            onChange={(e) => handleNestedChange("alertThresholds", "ninety", e.target.checked)}
                            className="rounded h-4 w-4 accent-primary"
                          />
                        </label>
                        <label className="flex items-center justify-between p-3 rounded-[var(--radius-md)] border border-border/55 bg-secondary/10 cursor-pointer">
                          <div>
                            <span className="text-sm font-semibold text-foreground">Notify at 100% Used</span>
                            <p className="text-[11px] text-muted-foreground">Alert when monthly budget limit is fully exhausted.</p>
                          </div>
                          <input 
                            type="checkbox"
                            checked={settings.alertThresholds?.hundred ?? true}
                            onChange={(e) => handleNestedChange("alertThresholds", "hundred", e.target.checked)}
                            className="rounded h-4 w-4 accent-primary"
                          />
                        </label>
                      </div>
                    </div>

                    <div className="glass-panel border border-border bg-card rounded-[var(--radius-lg)] space-y-6" style={{ padding: '24px 28px' }}>
                      <h3 className="text-lg font-bold text-foreground">🔔 Expense Notifications</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <label className="flex items-center justify-between p-3 rounded-[var(--radius-md)] border border-border/55 bg-secondary/10 cursor-pointer">
                          <div>
                            <span className="text-sm font-semibold text-foreground">Email Notifications</span>
                            <p className="text-[11px] text-muted-foreground">Send due bill reminders and warnings to email.</p>
                          </div>
                          <input 
                            type="checkbox"
                            checked={settings.notificationPreferences?.email ?? true}
                            onChange={(e) => handleNestedChange("notificationPreferences", "email", e.target.checked)}
                            className="rounded h-4 w-4 accent-primary"
                          />
                        </label>
                        <label className="flex items-center justify-between p-3 rounded-[var(--radius-md)] border border-border/55 bg-secondary/10 cursor-pointer">
                          <div>
                            <span className="text-sm font-semibold text-foreground">Push Notifications</span>
                            <p className="text-[11px] text-muted-foreground">Receive browser in-app and push notification alerts.</p>
                          </div>
                          <input 
                            type="checkbox"
                            checked={settings.notificationPreferences?.push ?? true}
                            onChange={(e) => handleNestedChange("notificationPreferences", "push", e.target.checked)}
                            className="rounded h-4 w-4 accent-primary"
                          />
                        </label>
                        <label className="flex items-center justify-between p-3 rounded-[var(--radius-md)] border border-border/55 bg-secondary/10 cursor-pointer">
                          <div>
                            <span className="text-sm font-semibold text-foreground">Bill Due Alerts</span>
                            <p className="text-[11px] text-muted-foreground">Alert 2 days, 1 day and morning before due date.</p>
                          </div>
                          <input 
                            type="checkbox"
                            checked={settings.notificationPreferences?.billDueAlerts ?? true}
                            onChange={(e) => handleNestedChange("notificationPreferences", "billDueAlerts", e.target.checked)}
                            className="rounded h-4 w-4 accent-primary"
                          />
                        </label>
                        <label className="flex items-center justify-between p-3 rounded-[var(--radius-md)] border border-border/55 bg-secondary/10 cursor-pointer">
                          <div>
                            <span className="text-sm font-semibold text-foreground">Overdue Alerts</span>
                            <p className="text-[11px] text-muted-foreground">Immediate alerts if bills pass their due date unpaid.</p>
                          </div>
                          <input 
                            type="checkbox"
                            checked={settings.notificationPreferences?.overdueAlerts ?? true}
                            onChange={(e) => handleNestedChange("notificationPreferences", "overdueAlerts", e.target.checked)}
                            className="rounded h-4 w-4 accent-primary"
                          />
                        </label>
                        <label className="flex items-center justify-between p-3 rounded-[var(--radius-md)] border border-border/55 bg-secondary/10 cursor-pointer">
                          <div>
                            <span className="text-sm font-semibold text-foreground">Savings Goal Alerts</span>
                            <p className="text-[11px] text-muted-foreground">Alert when monthly target savings goal is reached.</p>
                          </div>
                          <input 
                            type="checkbox"
                            checked={settings.notificationPreferences?.savingsGoalAlerts ?? true}
                            onChange={(e) => handleNestedChange("notificationPreferences", "savingsGoalAlerts", e.target.checked)}
                            className="rounded h-4 w-4 accent-primary"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      disabled={savingSettings}
                      className="px-8 py-3 rounded-[var(--radius-md)] bg-primary text-primary-foreground hover:bg-primary-hover font-bold shadow-[var(--shadow-sm)] transition-all cursor-pointer flex items-center justify-center min-w-[150px]"
                    >
                      {savingSettings ? (
                        <>
                          <span className="spinner spinner-sm mr-2" />
                          Saving...
                        </>
                      ) : (
                        "Save Settings"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Bill Modal inside Settings */}
      <Dialog open={isAddBillOpen} onOpenChange={setIsAddBillOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Quick Add Bill</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddBill} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Bill Name</label>
              <input
                type="text"
                value={billForm.billName}
                onChange={(e) => setBillForm({ ...billForm, billName: e.target.value })}
                className="premium-input text-foreground h-10 w-full"
                placeholder="e.g. Electricity Bill, Exam Fee"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Amount (₹)</label>
              <input
                type="number"
                value={billForm.amount}
                onChange={(e) => setBillForm({ ...billForm, amount: e.target.value })}
                className="premium-input text-foreground h-10 w-full"
                placeholder="0.00"
                min="0.01"
                step="0.01"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Due Date</label>
              <input
                type="date"
                value={billForm.dueDate}
                onChange={(e) => setBillForm({ ...billForm, dueDate: e.target.value })}
                className="premium-input text-foreground h-10 w-full cursor-pointer"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Priority Level</label>
                <select
                  value={billForm.priority}
                  onChange={(e) => setBillForm({ ...billForm, priority: e.target.value })}
                  className="premium-input text-foreground h-10 w-full cursor-pointer"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Recurring Cycle</label>
                <select
                  value={billForm.recurringType}
                  onChange={(e) => setBillForm({ 
                    ...billForm, 
                    recurringType: e.target.value,
                    isRecurring: e.target.value !== "None"
                  })}
                  className="premium-input text-foreground h-10 w-full cursor-pointer"
                >
                  <option value="None">None</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Semester">Semester (6 Mo.)</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 justify-end pt-4 border-t border-border/20">
              <button
                type="button"
                onClick={() => setIsAddBillOpen(false)}
                className="px-5 py-2.5 rounded-[var(--radius-sm)] border border-border text-foreground hover:bg-secondary transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-[var(--radius-sm)] bg-primary text-primary-foreground hover:bg-primary/95 transition-colors font-bold cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Expense Modal inside Settings */}
      <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Quick Add Expense</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddExpense} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Description / Title</label>
              <input
                type="text"
                value={expenseForm.title}
                onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                className="premium-input text-foreground h-10 w-full"
                placeholder="e.g. Lunch with friends, Books purchase"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Amount (₹)</label>
              <input
                type="number"
                value={expenseForm.amount}
                onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                className="premium-input text-foreground h-10 w-full"
                placeholder="0.00"
                min="0.01"
                step="0.01"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Category</label>
                <select
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                  className="premium-input text-foreground h-10 w-full cursor-pointer"
                >
                  {STUDENT_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Payment Method</label>
                <select
                  value={expenseForm.paymentMethod}
                  onChange={(e) => setExpenseForm({ ...expenseForm, paymentMethod: e.target.value })}
                  className="premium-input text-foreground h-10 w-full cursor-pointer"
                >
                  <option value="UPI">UPI</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Bank">Bank Transfer</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Date</label>
              <input
                type="date"
                value={expenseForm.date}
                onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                className="premium-input text-foreground h-10 w-full cursor-pointer"
                required
              />
            </div>

            <div className="flex gap-4 justify-end pt-4 border-t border-border/20">
              <button
                type="button"
                onClick={() => setIsAddExpenseOpen(false)}
                className="px-5 py-2.5 rounded-[var(--radius-sm)] border border-border text-foreground hover:bg-secondary transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-[var(--radius-sm)] bg-primary text-primary-foreground hover:bg-primary/95 transition-colors font-bold cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}

export default AccountSetting;
