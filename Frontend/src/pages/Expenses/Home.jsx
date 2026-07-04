import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { expensesApi } from "../../services/api/expensesApi";
import { getUserId } from "../../utils/Expenses/authHelper";
import { getCurrencySymbol } from "../../utils/formatters";

import { CategoryPieChart } from "../../components/Expenses/dashboard/CategoryPieChart";
import MonthlyExpenseChart from "../../components/Expenses/dashboard/MonthlyExpenseChart";
import TransactionsTable from "../../components/Expenses/dashboard/TransactionsTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { MetricCardSkeleton, ChartSkeleton, CardSkeleton } from "../../components/dashboard/shared/Skeleton";
import EmptyState from "../../components/ui/EmptyState";
import {
  MdAdd,
  MdWarning,
  MdOutlineFileDownload,
  MdDelete,
  MdEdit,
  MdCheckCircle,
} from "react-icons/md";
import {
  Wallet,
  TrendingDown,
  PiggyBank,
  AlertTriangle,
  CalendarClock,
  Receipt,
  Plus,
  FileText,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-hot-toast";
import { getExpenseStatus } from "../../utils/Expenses/helpers";

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

/* ── Expense-scoped shared styles ── */
const S = {
  card: {
    background: "var(--card-bg)",
    border: "1px solid var(--border-color)",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
  },
  sectionLabel: {
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "var(--text-muted)",
    marginBottom: "14px",
  },
  statValue: {
    fontSize: "34px",
    fontWeight: "800",
    letterSpacing: "-0.03em",
    color: "var(--text-primary)",
    lineHeight: "1",
  },
  statLabel: {
    fontSize: "12px",
    fontWeight: "600",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    color: "var(--text-muted)",
    marginBottom: "6px",
  },
  progressTrack: {
    height: "6px",
    borderRadius: "999px",
    background: "var(--bg-tertiary)",
    overflow: "hidden",
    marginTop: "12px",
  },
  progressFill: {
    height: "100%",
    borderRadius: "999px",
    transition: "width 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
  },
  iconBadge: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  filterLabel: {
    fontSize: "11px",
    fontWeight: "600",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "var(--text-muted)",
  },
};

/* ── Stat card ── */
function ExpStatCard({ label, value, subtext, icon: Icon, iconBg, iconColor, progressValue, progressColor, isLoading }) {
  const [hov, setHov] = useState(false);
  if (isLoading) return (
    <div style={{ ...S.card, display: "flex", flexDirection: "column", gap: "16px" }}>
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-9 w-32" />
      <Skeleton className="h-2 w-full" />
    </div>
  );
  return (
    <div
      style={{
        ...S.card,
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        transform: hov ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hov ? "0 8px 24px rgba(0,0,0,0.1)" : S.card.boxShadow,
        borderColor: hov ? "var(--accent)" : "var(--border-color)",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <p style={S.statLabel}>{label}</p>
          <p style={S.statValue}>{value}</p>
          {subtext && <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>{subtext}</p>}
        </div>
        <div style={{ ...S.iconBadge, background: iconBg, color: iconColor }}>
          <Icon size={20} />
        </div>
      </div>
      {progressValue !== undefined && (
        <div style={S.progressTrack}>
          <div style={{ ...S.progressFill, width: `${Math.min(progressValue, 100)}%`, background: progressColor }} />
        </div>
      )}
    </div>
  );
}

/* ── Hoverable card wrapper ── */
function ExpCard({ children, style, noHover = false, ...props }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      style={{
        ...S.card,
        ...style,
        transform: !noHover && hov ? "translateY(-2px)" : "translateY(0)",
        boxShadow: !noHover && hov ? "0 8px 24px rgba(0,0,0,0.08)" : S.card.boxShadow,
      }}
      onMouseEnter={!noHover ? () => setHov(true) : undefined}
      onMouseLeave={!noHover ? () => setHov(false) : undefined}
      {...props}
    >
      {children}
    </div>
  );
}

/* ── Status pill (for bills) ── */
function BillStatusPill({ status }) {
  const map = {
    "Paid":       { bg: "rgba(16,185,129,0.12)", color: "var(--success)", border: "rgba(16,185,129,0.25)" },
    "Overdue":    { bg: "rgba(239,68,68,0.12)",  color: "var(--danger)",  border: "rgba(239,68,68,0.25)" },
    "Due Today":  { bg: "rgba(245,158,11,0.12)", color: "var(--warning)", border: "rgba(245,158,11,0.25)" },
    "Active":     { bg: "rgba(59,130,246,0.12)", color: "var(--accent)",  border: "rgba(59,130,246,0.25)" },
  };
  const t = map[status] || map["Active"];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      padding: "2px 9px", borderRadius: "999px", fontSize: "11px", fontWeight: "600",
      background: t.bg, color: t.color, border: `1px solid ${t.border}`,
    }}>
      <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: t.color, flexShrink: 0 }} />
      {status}
    </span>
  );
}

const Home = () => {
  const navigate = useNavigate();
  const [userdata] = useState(() => JSON.parse(localStorage.getItem("User")));
  const userId = getUserId(userdata);
  const [userexp, setUserexp] = useState([]);
  const [bills, setBills] = useState([]);
  const [summary, setSummary] = useState(null);
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddBillOpen, setIsAddBillOpen] = useState(false);
  const [isEditBillOpen, setIsEditBillOpen] = useState(false);
  const [editingBill, setEditingBill] = useState(null);

  const [expenseForm, setExpenseForm] = useState({
    amount: "",
    category: "Food",
    date: new Date(),
    title: "",
    type: "expense",
    paymentMethod: "UPI",
    note: ""
  });

  const [billForm, setBillForm] = useState({
    billName: "",
    amount: "",
    dueDate: "",
    priority: "Medium",
    isRecurring: false,
    recurringType: "None"
  });

  const loadData = async () => {
    setIsLoading(true);
    if (!userdata) {
      navigate("/expenses-tracker/login");
      return;
    }
    try {
      const [expData, billsData, summaryData, settingsData] = await Promise.all([
        expensesApi.getUserExpenses(userId),
        expensesApi.getBills(),
        expensesApi.getDashboardSummary(),
        expensesApi.getSettings()
      ]);
      setUserexp(expData || []);
      setBills(billsData || []);
      setSummary(summaryData);
      setSettings(settingsData);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    const res = await expensesApi.createExpense({
      ...expenseForm,
      userId,
      amount: Number(expenseForm.amount),
      date: expenseForm.date.toISOString(),
      title: expenseForm.title || expenseForm.category
    });
    if (res) {
      toast.success("Expense added successfully!");
      setIsAddExpenseOpen(false);
      setExpenseForm({ amount: "", category: "Food", date: new Date(), title: "", type: "expense", paymentMethod: "UPI", note: "" });
      loadData();
    }
  };

  const handleAddBill = async (e) => {
    e.preventDefault();
    const res = await expensesApi.createBill({ ...billForm, amount: Number(billForm.amount) });
    if (res.statusCode === 201) {
      toast.success("Bill scheduled successfully!");
      setIsAddBillOpen(false);
      setBillForm({ billName: "", amount: "", dueDate: "", priority: "Medium", isRecurring: false, recurringType: "None" });
      loadData();
    } else {
      toast.error(res.message || "Failed to add bill");
    }
  };

  const handleEditBillSubmit = async (e) => {
    e.preventDefault();
    const res = await expensesApi.updateBill(editingBill._id, {
      billName: editingBill.billName,
      amount: Number(editingBill.amount),
      dueDate: editingBill.dueDate,
      priority: editingBill.priority,
      isRecurring: editingBill.isRecurring,
      recurringType: editingBill.recurringType
    });
    if (res.statusCode === 200) {
      toast.success("Bill updated successfully!");
      setIsEditBillOpen(false);
      setEditingBill(null);
      loadData();
    } else {
      toast.error(res.message || "Failed to update bill");
    }
  };

  const handleDeleteBill = async (id) => {
    if (window.confirm("Are you sure you want to delete this bill?")) {
      const res = await expensesApi.deleteBill(id);
      if (res.statusCode === 200) {
        toast.success("Bill deleted successfully!");
        loadData();
      }
    }
  };

  const handlePayBill = async (id) => {
    const res = await expensesApi.payBill(id);
    if (res.statusCode === 200) {
      toast.success("Bill marked as paid & history updated!");
      loadData();
    } else {
      toast.error(res.message || "Failed to pay bill");
    }
  };

  const currencySymbol = getCurrencySymbol(settings?.currency || "INR");
  const downloadCSV = () => expensesApi.downloadReportCSV();
  const downloadPDF = () => expensesApi.downloadReportPDF();

  const budgetPercentage = summary?.utilizationPercentage || 0;
  const utilizationStatus = getExpenseStatus(budgetPercentage > 90 ? "Critical" : budgetPercentage > 75 ? "High" : "Active");
  const progressColor = budgetPercentage > 90 ? "var(--danger)" : budgetPercentage > 75 ? "var(--warning)" : "var(--success)";
  const spent = summary?.totalSpent || 0;
  const budget = summary?.monthlyBudget || 0;
  const remaining = summary?.remainingBudget || 0;
  const spentPct = budget > 0 ? Math.round((spent / budget) * 100) : 0;

  const inputStyle = {
    height: "38px",
    padding: "0 12px",
    borderRadius: "8px",
    border: "1px solid var(--border-color)",
    background: "var(--input-bg)",
    color: "var(--text-primary)",
    fontSize: "14px",
    outline: "none",
    width: "100%",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px", padding: "32px 24px 80px", maxWidth: "100%" }}>

      {/* ── Header ── */}
      <div style={{
        display: "flex", flexDirection: "row", flexWrap: "wrap",
        alignItems: "flex-start", justifyContent: "space-between",
        gap: "16px", paddingBottom: "28px", borderBottom: "1px solid var(--border-color)"
      }}>
        <div>
          <h1 style={{ fontSize: "34px", fontWeight: "800", letterSpacing: "-0.03em", lineHeight: "1.1", color: "var(--text-primary)", margin: 0 }}>
            Expense Tracker
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: "6px 0 0", lineHeight: "1.5" }}>
            Manage budgets, expenses, recurring bills and financial insights.
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <button
            onClick={() => setIsAddBillOpen(true)}
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "0 16px", height: "36px", borderRadius: "8px",
              border: "1px solid var(--border-color)", background: "var(--card-bg)",
              color: "var(--text-primary)", fontSize: "13px", fontWeight: "600",
              cursor: "pointer", transition: "all 0.15s ease", whiteSpace: "nowrap",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.color = "var(--text-primary)"; }}
          >
            <Plus size={14} /> Add Bill
          </button>
          <button
            onClick={() => setIsAddExpenseOpen(true)}
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "0 16px", height: "36px", borderRadius: "8px",
              border: "none", background: "var(--accent)", color: "#fff",
              fontSize: "13px", fontWeight: "600", cursor: "pointer",
              transition: "all 0.15s ease", whiteSpace: "nowrap",
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <MdAdd size={16} /> Add Expense
          </button>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div>
        <p style={S.sectionLabel}>Overview</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <ExpStatCard
            label="Monthly Budget"
            value={`${currencySymbol} ${budget.toLocaleString()}`}
            subtext="Total limit this month"
            icon={Wallet}
            iconBg="rgba(59,130,246,0.12)"
            iconColor="var(--accent)"
            isLoading={isLoading}
          />
          <ExpStatCard
            label="Spent This Month"
            value={`${currencySymbol} ${spent.toLocaleString()}`}
            subtext={`${spentPct}% of budget used`}
            icon={TrendingDown}
            iconBg={spentPct > 90 ? "rgba(239,68,68,0.12)" : spentPct > 75 ? "rgba(245,158,11,0.12)" : "rgba(16,185,129,0.12)"}
            iconColor={spentPct > 90 ? "var(--danger)" : spentPct > 75 ? "var(--warning)" : "var(--success)"}
            progressValue={spentPct}
            progressColor={progressColor}
            isLoading={isLoading}
          />
          <ExpStatCard
            label="Remaining Budget"
            value={`${currencySymbol} ${remaining.toLocaleString()}`}
            subtext={remaining >= 0 ? "Available to spend" : "Over budget"}
            icon={PiggyBank}
            iconBg={remaining >= 0 ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)"}
            iconColor={remaining >= 0 ? "var(--success)" : "var(--danger)"}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* ── Main Layout: Charts + Bills Panel ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Left: Charts + Transactions */}
        <div className="xl:col-span-2 flex flex-col gap-6">

          {/* Charts row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Monthly Expense Chart — has own internal title */}
            <ExpCard noHover style={{ padding: "0", overflow: "hidden" }}>
              {isLoading ? (
                <div style={{ height: "320px", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
                  <ChartSkeleton />
                </div>
              ) : userexp.length === 0 ? (
                <div style={{ height: "320px", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
                  <EmptyState title="No Trend Data" message="Add transactions to view monthly progress." />
                </div>
              ) : (
                <MonthlyExpenseChart exdata={userexp} />
              )}
            </ExpCard>

            {/* Category Pie Chart — has own internal title */}
            <ExpCard noHover style={{ padding: "0", overflow: "hidden" }}>
              {isLoading ? (
                <div style={{ height: "320px", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
                  <ChartSkeleton />
                </div>
              ) : userexp.length === 0 ? (
                <div style={{ height: "320px", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
                  <EmptyState title="No Breakdown Found" />
                </div>
              ) : (
                <CategoryPieChart exdata={userexp} />
              )}
            </ExpCard>
          </div>

          {/* Transactions Table */}
          <TransactionsTable transactions={userexp} onUpdate={loadData} />
        </div>

        {/* Right: Bills Panel */}
        <div className="xl:col-span-1 flex flex-col gap-5">

          {/* Budget Prediction */}
          {!isLoading && (
            <ExpCard noHover style={{
              borderColor: budgetPercentage > 90 ? "rgba(239,68,68,0.3)" : "var(--border-color)",
              boxShadow: budgetPercentage > 90 ? "0 0 0 1px rgba(239,68,68,0.15)" : S.card.boxShadow,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <div>
                  <p style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "2px" }}>
                    Budget Prediction
                  </p>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Based on month-to-date spending</p>
                </div>
                {budgetPercentage > 90 && <AlertTriangle size={18} style={{ color: "var(--danger)", flexShrink: 0 }} />}
              </div>
              <div style={{ margin: "14px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "6px" }}>
                  <span>Projected: {currencySymbol}{summary?.projectedSpend?.toLocaleString()}</span>
                  <span style={{ color: progressColor }}>{budgetPercentage}% used</span>
                </div>
                <div style={S.progressTrack}>
                  <div style={{ ...S.progressFill, width: `${Math.min(budgetPercentage, 100)}%`, background: progressColor }} />
                </div>
              </div>
              <div style={{
                padding: "10px 12px", borderRadius: "8px", fontSize: "12px",
                background: "var(--bg-secondary)", color: "var(--text-muted)",
                border: "1px solid var(--border-color)",
              }}>
                Expected savings: <strong style={{ color: "var(--text-primary)" }}>
                  {currencySymbol}{Math.max(0, (summary?.savingsGoal || 0) - (summary?.projectedSpend || 0)).toLocaleString()}
                </strong> · Target: <strong style={{ color: "var(--text-primary)" }}>{currencySymbol}{summary?.savingsGoal?.toLocaleString()}</strong>
              </div>
            </ExpCard>
          )}

          {/* Due Today + Overdue mini-cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {[
              { label: "Due Today", value: summary?.dueTodayCount || 0, color: "var(--warning)", bg: "rgba(245,158,11,0.08)", icon: CalendarClock },
              { label: "Overdue Bills", value: summary?.overdueCount || 0, color: "var(--danger)", bg: "rgba(239,68,68,0.08)", icon: AlertTriangle },
            ].map(({ label, value, color, bg, icon: Icon }) => (
              <div key={label} style={{
                ...S.card, padding: "16px", textAlign: "center",
                background: value > 0 ? bg : "var(--card-bg)",
                borderColor: value > 0 ? color.replace("var(--", "rgba(").replace(")", ", 0.25)") : "var(--border-color)",
              }}>
                <Icon size={18} style={{ color, margin: "0 auto 6px", display: "block" }} />
                <p style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "4px" }}>{label}</p>
                <p style={{ fontSize: "28px", fontWeight: "800", color, lineHeight: "1" }}>{isLoading ? "–" : value}</p>
              </div>
            ))}
          </div>

          {/* Active Bills */}
          <ExpCard noHover style={{ padding: "0", flex: "1" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>Active Bills</h3>
              <span style={{
                padding: "2px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: "700",
                background: "rgba(59,130,246,0.1)", color: "var(--accent)",
              }}>
                {bills.length} active
              </span>
            </div>
            <div style={{ padding: "12px", maxHeight: "440px", overflowY: "auto" }}>
              {isLoading ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : bills.length === 0 ? (
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                  <Receipt size={32} style={{ color: "var(--text-muted)", margin: "0 auto 8px", display: "block" }} />
                  <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>No active bills. Add one to stay alerted.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {bills.map((bill) => {
                    const billStatus = getExpenseStatus(bill.status);
                    const billPriority = getExpenseStatus(bill.priority);
                    const isOverdue = bill.status === "Overdue";
                    const isDueToday = bill.status === "Due Today";
                    return (
                      <div
                        key={bill._id}
                        style={{
                          padding: "14px", borderRadius: "12px",
                          border: `1px solid ${isOverdue ? "rgba(239,68,68,0.25)" : isDueToday ? "rgba(245,158,11,0.25)" : "var(--border-color)"}`,
                          background: isOverdue ? "rgba(239,68,68,0.04)" : isDueToday ? "rgba(245,158,11,0.04)" : "var(--bg-secondary)",
                          display: "flex", flexDirection: "column", gap: "10px",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                              <h4 style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>{bill.billName}</h4>
                              {bill.isRecurring && (
                                <span style={{ fontSize: "10px", fontWeight: "600", padding: "1px 6px", borderRadius: "4px", border: "1px solid var(--border-color)", color: "var(--text-muted)" }}>
                                  {bill.recurringType}
                                </span>
                              )}
                            </div>
                            <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                              Due: {new Date(bill.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                          <span style={{ fontSize: "15px", fontWeight: "800", color: "var(--text-primary)", flexShrink: 0 }}>
                            {currencySymbol}{bill.amount.toLocaleString()}
                          </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", paddingTop: "8px", borderTop: "1px solid var(--border-color)" }}>
                          <div style={{ display: "flex", gap: "6px" }}>
                            <BillStatusPill status={bill.priority} />
                            <BillStatusPill status={bill.status} />
                          </div>
                          <div style={{ display: "flex", gap: "6px" }}>
                            <button
                              onClick={() => handlePayBill(bill._id)}
                              style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "4px 10px", borderRadius: "7px", border: "none", background: "rgba(16,185,129,0.15)", color: "var(--success)", fontSize: "11px", fontWeight: "700", cursor: "pointer", transition: "all 0.15s ease" }}
                              onMouseEnter={e => e.currentTarget.style.background = "rgba(16,185,129,0.25)"}
                              onMouseLeave={e => e.currentTarget.style.background = "rgba(16,185,129,0.15)"}
                            >
                              <MdCheckCircle size={12} />
                              {bill.status === "Overdue" ? "Clear" : "Pay"}
                            </button>
                            <button
                              onClick={() => { setEditingBill({ ...bill, dueDate: new Date(bill.dueDate).toISOString().split("T")[0] }); setIsEditBillOpen(true); }}
                              style={{ width: "28px", height: "28px", borderRadius: "7px", border: "1px solid var(--border-color)", background: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text-muted)", transition: "all 0.15s ease" }}
                              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
                              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.color = "var(--text-muted)"; }}
                            >
                              <MdEdit size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteBill(bill._id)}
                              style={{ width: "28px", height: "28px", borderRadius: "7px", border: "1px solid var(--border-color)", background: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text-muted)", transition: "all 0.15s ease" }}
                              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--danger)"; e.currentTarget.style.color = "var(--danger)"; }}
                              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.color = "var(--text-muted)"; }}
                            >
                              <MdDelete size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </ExpCard>

          {/* Monthly Reports */}
          <ExpCard noHover style={{ padding: "16px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <FileText size={16} style={{ color: "var(--text-muted)" }} />
                <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-primary)" }}>Monthly Reports</span>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={downloadCSV}
                  style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "0 12px", height: "32px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--card-bg)", color: "var(--text-primary)", fontSize: "12px", fontWeight: "600", cursor: "pointer", transition: "all 0.15s ease" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.color = "var(--text-primary)"; }}
                >
                  <MdOutlineFileDownload size={14} /> CSV
                </button>
                <button
                  onClick={downloadPDF}
                  style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "0 12px", height: "32px", borderRadius: "8px", border: "none", background: "var(--accent)", color: "#fff", fontSize: "12px", fontWeight: "600", cursor: "pointer", transition: "all 0.15s ease" }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >
                  <MdOutlineFileDownload size={14} /> PDF
                </button>
              </div>
            </div>
          </ExpCard>
        </div>
      </div>

      {/* ── Floating FAB ── */}
      <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 50 }}>
        <button
          onClick={() => setIsAddExpenseOpen(true)}
          title="Quick Add Expense"
          style={{
            width: "56px", height: "56px", borderRadius: "50%", border: "none",
            background: "linear-gradient(135deg, var(--accent), #6366f1)",
            color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 24px rgba(59,130,246,0.35)",
            cursor: "pointer", transition: "all 0.2s ease",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(59,130,246,0.45)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(59,130,246,0.35)"; }}
        >
          <MdAdd size={28} />
        </button>
      </div>

      {/* ── Add Expense Dialog ── */}
      <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Expense</DialogTitle></DialogHeader>
          <form onSubmit={handleAddExpense} className="space-y-4 pt-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Title / Description</label>
              <input type="text" value={expenseForm.title} onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })} className="premium-input text-foreground h-10 w-full" placeholder="e.g. Starbucks Coffee, Reference Book" required />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Amount (₹)</label>
              <input type="number" value={expenseForm.amount} onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })} className="premium-input text-foreground h-10 w-full" placeholder="0.00" min="0.01" step="0.01" required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Category</label>
                <select value={expenseForm.category} onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })} className="premium-input text-foreground h-10 w-full cursor-pointer bg-secondary">
                  {STUDENT_CATEGORIES.map((c) => (<option key={c} value={c} className="bg-[var(--bg-nav-container)] text-[var(--text-primary)]">{c}</option>))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Payment Method</label>
                <select value={expenseForm.paymentMethod} onChange={(e) => setExpenseForm({ ...expenseForm, paymentMethod: e.target.value })} className="premium-input text-foreground h-10 w-full cursor-pointer bg-secondary">
                  <option value="UPI">UPI</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Bank">Bank Transfer</option>
                </select>
              </div>
            </div>
            <div className="space-y-1 flex flex-col items-stretch">
              <label className="text-xs font-semibold text-muted-foreground">Date</label>
              <DatePicker selected={expenseForm.date} onChange={(d) => setExpenseForm({ ...expenseForm, date: d })} className="premium-input w-full cursor-pointer bg-secondary" dateFormat="MMM d, yyyy" required />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Notes (Optional)</label>
              <input type="text" value={expenseForm.note} onChange={(e) => setExpenseForm({ ...expenseForm, note: e.target.value })} className="premium-input text-foreground h-10 w-full" placeholder="Add brief details..." />
            </div>
            <div className="flex gap-4 justify-end pt-4 border-t border-border/20">
              <button type="button" onClick={() => setIsAddExpenseOpen(false)} className="btn btn-secondary border border-border px-4 py-2 rounded-[var(--radius-sm)] text-foreground hover:bg-secondary">Cancel</button>
              <button type="submit" className="btn btn-primary bg-primary text-white px-4 py-2 rounded-[var(--radius-sm)] hover:bg-primary-hover">Confirm</button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Add Bill Dialog ── */}
      <Dialog open={isAddBillOpen} onOpenChange={setIsAddBillOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Schedule New Bill</DialogTitle></DialogHeader>
          <form onSubmit={handleAddBill} className="space-y-4 pt-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Bill Name</label>
              <input type="text" value={billForm.billName} onChange={(e) => setBillForm({ ...billForm, billName: e.target.value })} className="premium-input text-foreground h-10 w-full" placeholder="e.g. Internet Bill, Tuition Payments" required />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Amount (₹)</label>
              <input type="number" value={billForm.amount} onChange={(e) => setBillForm({ ...billForm, amount: e.target.value })} className="premium-input text-foreground h-10 w-full" placeholder="0.00" min="0.01" step="0.01" required />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Due Date</label>
              <input type="date" value={billForm.dueDate} onChange={(e) => setBillForm({ ...billForm, dueDate: e.target.value })} className="premium-input text-foreground h-10 w-full cursor-pointer bg-secondary" required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Priority Level</label>
                <select value={billForm.priority} onChange={(e) => setBillForm({ ...billForm, priority: e.target.value })} className="premium-input text-foreground h-10 w-full cursor-pointer bg-secondary">
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Recurring Frequency</label>
                <select value={billForm.recurringType} onChange={(e) => setBillForm({ ...billForm, recurringType: e.target.value, isRecurring: e.target.value !== "None" })} className="premium-input text-foreground h-10 w-full cursor-pointer bg-secondary">
                  <option value="None">None</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Semester">Semester (6 Mo.)</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4 justify-end pt-4 border-t border-border/20">
              <button type="button" onClick={() => setIsAddBillOpen(false)} className="btn btn-secondary border border-border px-4 py-2 rounded-[var(--radius-sm)] text-foreground hover:bg-secondary">Cancel</button>
              <button type="submit" className="btn btn-primary bg-primary text-white px-4 py-2 rounded-[var(--radius-sm)] hover:bg-primary-hover">Confirm</button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Edit Bill Dialog ── */}
      <Dialog open={isEditBillOpen} onOpenChange={(open) => { setIsEditBillOpen(open); if (!open) setEditingBill(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Bill Details</DialogTitle></DialogHeader>
          {editingBill && (
            <form onSubmit={handleEditBillSubmit} className="space-y-4 pt-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Bill Name</label>
                <input type="text" value={editingBill.billName} onChange={(e) => setEditingBill({ ...editingBill, billName: e.target.value })} className="premium-input text-foreground h-10 w-full" required />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Amount (₹)</label>
                <input type="number" value={editingBill.amount} onChange={(e) => setEditingBill({ ...editingBill, amount: e.target.value })} className="premium-input text-foreground h-10 w-full" min="0.01" step="0.01" required />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Due Date</label>
                <input type="date" value={editingBill.dueDate} onChange={(e) => setEditingBill({ ...editingBill, dueDate: e.target.value })} className="premium-input text-foreground h-10 w-full cursor-pointer bg-secondary" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Priority Level</label>
                  <select value={editingBill.priority} onChange={(e) => setEditingBill({ ...editingBill, priority: e.target.value })} className="premium-input text-foreground h-10 w-full cursor-pointer bg-secondary">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Recurring Frequency</label>
                  <select value={editingBill.recurringType} onChange={(e) => setEditingBill({ ...editingBill, recurringType: e.target.value, isRecurring: e.target.value !== "None" })} className="premium-input text-foreground h-10 w-full cursor-pointer bg-secondary">
                    <option value="None">None</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Semester">Semester (6 Mo.)</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4 justify-end pt-4 border-t border-border/20">
                <button type="button" onClick={() => { setIsEditBillOpen(false); setEditingBill(null); }} className="btn btn-secondary border border-border px-4 py-2 rounded-[var(--radius-sm)] text-foreground hover:bg-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary bg-primary text-white px-4 py-2 rounded-[var(--radius-sm)] hover:bg-primary-hover">Update Bill</button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
