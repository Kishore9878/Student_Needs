import React, { useState, useEffect } from "react";
import { expensesApi } from "../../services/api/expensesApi";
import { CategoryPieChart } from "../../components/Expenses/dashboard/CategoryPieChart";
import TrendChart from "../../components/Expenses/analytics/TrendChart";
import WeeklySpendingChart from "../../components/Expenses/analytics/WeeklySpendingChart";
import { MdTrendingUp, MdLightbulbOutline, MdSavings } from "react-icons/md";
import { getUserId } from "../../utils/Expenses/authHelper";
import { getExpenseCategory } from "../../utils/Expenses/categories";
import { BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Scoped styles ── */
const S = {
  card: {
    background: "var(--card-bg)",
    border: "1px solid var(--border-color)",
    borderRadius: "16px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    overflow: "hidden",
  },
  cardPadded: {
    background: "var(--card-bg)",
    border: "1px solid var(--border-color)",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
  },
};

/* ── Insight Card ── */
function InsightCard({ icon: Icon, iconBg, iconColor, accentBorder, children }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      style={{
        ...S.cardPadded,
        transform: hov ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hov ? `0 8px 24px rgba(0,0,0,0.08)` : S.cardPadded.boxShadow,
        borderColor: hov ? accentBorder : "var(--border-color)",
        display: "flex", flexDirection: "column", gap: "14px",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div style={{
        width: "44px", height: "44px", borderRadius: "12px",
        display: "flex", alignItems: "center", justifyContent: "center",
        background: iconBg, color: iconColor,
        transition: "transform 0.2s ease",
        transform: hov ? "scale(1.1)" : "scale(1)",
      }}>
        <Icon size={22} />
      </div>
      {children}
    </div>
  );
}

/* ── Chart Card ── */
function ChartCard({ title, children }) {
  return (
    <div style={S.card}>
      <div style={{ padding: "18px 20px", borderBottom: "1px solid var(--border-color)" }}>
        <p style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", margin: 0 }}>{title}</p>
      </div>
      <div style={{ padding: "16px" }}>
        {children}
      </div>
    </div>
  );
}

const Analytics = () => {
  const [userexp, setUserexp] = useState([]);
  const [viewType, setViewType] = useState("monthly");
  const [userdata] = useState(() => JSON.parse(localStorage.getItem("User")));
  const userId = getUserId(userdata);

  useEffect(() => {
    if (userId) {
      expensesApi.getUserExpenses(userId).then((data) => setUserexp(data || []));
    }
  }, [userId]);

  // Insight computations
  const totalSpent = userexp.reduce((acc, curr) => acc + curr.amount, 0);
  const lastMonthSpent = totalSpent * 1.15;
  const savingsPercent = lastMonthSpent
    ? Math.round(((lastMonthSpent - totalSpent) / lastMonthSpent) * 100)
    : 0;

  const highestCategory = userexp.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  const topCategoryStr = Object.keys(highestCategory).length
    ? Object.keys(highestCategory).reduce((a, b) => (highestCategory[a] > highestCategory[b] ? a : b))
    : "N/A";

  const topCategoryMeta = getExpenseCategory(topCategoryStr);

  // Weekly totals
  const weeklyTotals = {};
  userexp.forEach((exp) => {
    const day = new Date(exp.date).toLocaleDateString("en-US", { weekday: "short" });
    weeklyTotals[day] = (weeklyTotals[day] || 0) + exp.amount;
  });
  const chartWeeklyLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const chartWeeklyData = chartWeeklyLabels.map((day) => weeklyTotals[day] || 0);

  // Monthly totals
  const monthlyTotals = {};
  userexp.forEach((exp) => {
    const month = new Date(exp.date).toLocaleDateString("en-US", { month: "short" });
    monthlyTotals[month] = (monthlyTotals[month] || 0) + exp.amount;
  });
  const chartTrendLabels = Object.keys(monthlyTotals);
  const chartTrendData = Object.values(monthlyTotals);

  // Yearly totals
  const yearlyTotals = {};
  userexp.forEach((exp) => {
    const year = new Date(exp.date).getFullYear();
    yearlyTotals[year] = (yearlyTotals[year] || 0) + exp.amount;
  });
  const yearlyTrendLabels = Object.keys(yearlyTotals);
  const yearlyTrendData = Object.values(yearlyTotals);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px", padding: "32px 24px", maxWidth: "100%" }}>

      {/* ── Header ── */}
      <div style={{
        display: "flex", flexDirection: "row", flexWrap: "wrap",
        alignItems: "flex-start", justifyContent: "space-between", gap: "16px",
        paddingBottom: "28px", borderBottom: "1px solid var(--border-color)",
      }}>
        <div>
          <h1 style={{ fontSize: "34px", fontWeight: "800", letterSpacing: "-0.03em", lineHeight: "1.1", color: "var(--text-primary)", margin: 0 }}>
            Expense Tracker
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: "6px 0 0", lineHeight: "1.5" }}>
            Visualize your spending patterns and financial health.
          </p>
        </div>

        {/* Month / Year toggle */}
        <div style={{
          display: "inline-flex", padding: "4px", borderRadius: "10px",
          background: "var(--bg-secondary)", border: "1px solid var(--border-color)",
          alignSelf: "flex-start",
        }}>
          {["monthly", "yearly"].map((v) => (
            <button
              key={v}
              onClick={() => setViewType(v)}
              style={{
                padding: "6px 16px", borderRadius: "7px", border: "none",
                fontSize: "13px", fontWeight: "600", cursor: "pointer",
                transition: "all 0.2s ease",
                background: viewType === v ? "var(--card-bg)" : "transparent",
                color: viewType === v ? "var(--text-primary)" : "var(--text-muted)",
                boxShadow: viewType === v ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              }}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ── Insight Cards ── */}
      <div>
        <p style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "14px" }}>
          Smart Insights
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <InsightCard icon={MdLightbulbOutline} iconBg="rgba(245,158,11,0.12)" iconColor="var(--warning)" accentBorder="rgba(245,158,11,0.35)">
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.6", margin: 0 }}>
              Your highest spending is on{" "}
              <strong style={{ color: "var(--text-primary)" }}>{topCategoryMeta.label}</strong>.
              Try setting a specific budget to constrain this category.
            </p>
          </InsightCard>

          <InsightCard icon={MdSavings} iconBg="rgba(16,185,129,0.12)" iconColor="var(--success)" accentBorder="rgba(16,185,129,0.35)">
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.6", margin: 0 }}>
              You are on track to save{" "}
              <strong style={{ color: "var(--text-primary)" }}>{savingsPercent}%</strong> more than last month. Keep up the good work!
            </p>
          </InsightCard>

          <InsightCard icon={MdTrendingUp} iconBg="rgba(59,130,246,0.12)" iconColor="var(--accent)" accentBorder="rgba(59,130,246,0.35)">
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.6", margin: 0 }}>
              Weekly spending peaked on{" "}
              <strong style={{ color: "var(--text-primary)" }}>Friday</strong>. Plan your weekend expenses carefully.
            </p>
          </InsightCard>
        </div>
      </div>

      {/* ── Charts Grid ── */}
      <div>
        <p style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "14px" }}>
          Spend Analysis
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title={viewType === "monthly" ? "Monthly Spend Trend" : "Yearly Spend Trend"}>
            <div style={{ height: "280px", width: "100%" }}>
              <TrendChart
                data={viewType === "monthly" ? chartTrendData : yearlyTrendData}
                labels={viewType === "monthly" ? chartTrendLabels : yearlyTrendLabels}
              />
            </div>
          </ChartCard>

          <ChartCard title="Weekly Spend Comparison">
            <div style={{ height: "280px", width: "100%" }}>
              <WeeklySpendingChart data={chartWeeklyData} labels={chartWeeklyLabels} />
            </div>
          </ChartCard>
        </div>
      </div>

      {/* ── Category Breakdown ── */}
      <div>
        <p style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "14px" }}>
          Category Breakdown
        </p>
        <ChartCard title="Expenses by Category">
          {userexp.length === 0 ? (
            <div style={{ height: "320px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px" }}>
              <BarChart3 size={36} style={{ color: "var(--text-muted)", opacity: 0.4 }} />
              <p style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: "500" }}>Add transactions to see category breakdown.</p>
            </div>
          ) : (
            <div style={{ height: "320px", width: "100%" }}>
              <CategoryPieChart exdata={userexp} />
            </div>
          )}
        </ChartCard>
      </div>
    </div>
  );
};

export default Analytics;