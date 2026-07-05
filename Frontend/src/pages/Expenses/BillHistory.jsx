import React, { useEffect, useState, useMemo } from "react";
import { expensesApi } from "../../services/api/expensesApi";
import { MdOutlineFileDownload } from "react-icons/md";
import { toast } from "react-hot-toast";
import { Skeleton } from "../../components/ui/skeleton";
import ExpenseFilters from "../../components/Expenses/shared/ExpenseFilters";
import { getExpenseStatus } from "../../utils/Expenses/helpers";
import { getCurrencySymbol } from "../../utils/formatters";
import { Receipt, Download } from "lucide-react";
import { PremiumButton } from "../../components/dashboard/shared/Primitives";

/* ── Scoped styles ── */
const S = {
  card: {
    background: "var(--card-bg)",
    border: "1px solid var(--border-color)",
    borderRadius: "16px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    overflow: "hidden",
  },
};

/* ── Paid status pill ── */
function PaidPill() {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      padding: "2px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: "600",
      background: "rgba(16,185,129,0.12)", color: "var(--success)",
      border: "1px solid rgba(16,185,129,0.25)",
    }}>
      <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--success)", flexShrink: 0 }} />
      Paid
    </span>
  );
}

/* ── Priority pill ── */
function PriorityPill({ priority }) {
  const map = {
    "Low":      { bg: "rgba(100,116,139,0.1)", color: "var(--text-muted)",  border: "rgba(100,116,139,0.2)" },
    "Medium":   { bg: "rgba(59,130,246,0.1)",  color: "var(--accent)",      border: "rgba(59,130,246,0.2)" },
    "High":     { bg: "rgba(245,158,11,0.1)",  color: "var(--warning)",     border: "rgba(245,158,11,0.2)" },
    "Critical": { bg: "rgba(239,68,68,0.1)",   color: "var(--danger)",      border: "rgba(239,68,68,0.2)" },
  };
  const t = map[priority] || map["Medium"];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      padding: "2px 9px", borderRadius: "999px", fontSize: "11px", fontWeight: "600",
      background: t.bg, color: t.color, border: `1px solid ${t.border}`,
    }}>
      {priority}
    </span>
  );
}

const BillHistory = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [settings, setSettings] = useState(null);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const [historyData, settingsData] = await Promise.all([
        expensesApi.getBillHistory(),
        expensesApi.getSettings()
      ]);
      setHistory(historyData || []);
      setSettings(settingsData);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load bill history");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadHistory(); }, []);

  const currencySymbol = getCurrencySymbol(settings?.currency || "INR");

  const uniqueMonths = useMemo(() => {
    const months = new Set();
    history.forEach(item => {
      if (item.paidDate) {
        const date = new Date(item.paidDate);
        const monthName = date.toLocaleString("en-US", { month: "long", year: "numeric" });
        months.add(monthName);
      }
    });
    return Array.from(months);
  }, [history]);

  const filteredHistory = useMemo(() => {
    return history.filter(item => {
      const matchesSearch = item.billName.toLowerCase().includes(search.toLowerCase());
      let matchesMonth = true;
      if (selectedMonth !== "" && item.paidDate) {
        const date = new Date(item.paidDate);
        const monthName = date.toLocaleString("en-US", { month: "long", year: "numeric" });
        matchesMonth = monthName === selectedMonth;
      }
      return matchesSearch && matchesMonth;
    });
  }, [history, search, selectedMonth]);

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
            Browse cleared bill payments, analyze billing logs, and export reports.
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignSelf: "flex-start" }}>
          <button
            onClick={() => expensesApi.downloadReportCSV()}
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "0 14px", height: "36px", borderRadius: "8px",
              border: "1px solid var(--border-color)", background: "var(--card-bg)",
              color: "var(--text-primary)", fontSize: "13px", fontWeight: "600",
              cursor: "pointer", transition: "all 0.15s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.color = "var(--text-primary)"; }}
          >
            <MdOutlineFileDownload size={15} /> Export CSV
          </button>
          <button
            onClick={() => expensesApi.downloadReportPDF()}
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "0 14px", height: "36px", borderRadius: "8px",
              border: "none", background: "var(--accent)", color: "#fff",
              fontSize: "13px", fontWeight: "600", cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            <MdOutlineFileDownload size={15} /> Export PDF
          </button>
        </div>
      </div>

      {/* ── Section Title ── */}
      <div>
        <p style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "14px" }}>
          Bill Payment History
        </p>

        {/* Filter card */}
        <div style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border-color)",
          borderRadius: "12px",
          padding: "16px 20px",
          marginBottom: "16px",
        }}>
          <ExpenseFilters
            searchQuery={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search by bill name..."
            filterCategory={selectedMonth}
            onCategoryChange={setSelectedMonth}
            categories={uniqueMonths}
            className="p-0 border-b-0"
          />
        </div>

        {/* Data table */}
        <div style={S.card}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
            <thead style={{ position: "sticky", top: 0, zIndex: 10, background: "var(--bg-secondary)", borderBottom: "1px solid var(--border-color)" }}>
              <tr>
                {[
                  { label: "Bill Name", align: "left" },
                  { label: "Amount", align: "left" },
                  { label: "Due Date", align: "left" },
                  { label: "Paid Date", align: "left" },
                  { label: "Priority", align: "left" },
                  { label: "Status", align: "right" },
                ].map(({ label, align }) => (
                  <th key={label} style={{
                    padding: "12px 18px", textAlign: align,
                    fontSize: "11px", fontWeight: "700",
                    letterSpacing: "0.07em", textTransform: "uppercase",
                    color: "var(--text-muted)", whiteSpace: "nowrap",
                  }}>
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" style={{ padding: "32px 24px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </td>
                </tr>
              ) : filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: "72px 24px", textAlign: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                      <div style={{
                        width: "60px", height: "60px", borderRadius: "18px",
                        background: "var(--bg-secondary)", border: "1px solid var(--border-color)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                      }}>
                        <Receipt size={26} style={{ color: "var(--text-muted)", opacity: 0.7 }} />
                      </div>
                      <div>
                        <p style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-primary)", margin: "0 0 4px" }}>
                          No bill history found
                        </p>
                        <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0, lineHeight: "1.5" }}>
                          {search || selectedMonth
                            ? "Try adjusting your filters to see results."
                            : "Paid bills will appear here once you clear them."}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : filteredHistory.map((item, idx) => (
                <tr
                  key={item._id}
                  style={{
                    borderBottom: idx < filteredHistory.length - 1 ? "1px solid var(--border-color)" : "none",
                    background: "var(--card-bg)",
                    transition: "background 0.15s ease",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--bg-secondary)"}
                  onMouseLeave={e => e.currentTarget.style.background = "var(--card-bg)"}
                >
                  <td style={{ padding: "14px 18px", fontSize: "14px", fontWeight: "700", color: "var(--text-primary)" }}>
                    {item.billName}
                  </td>
                  <td style={{ padding: "14px 18px", fontSize: "15px", fontWeight: "800", color: "var(--text-primary)", whiteSpace: "nowrap" }}>
                    {currencySymbol}{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: "14px 18px", fontSize: "12px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                    {new Date(item.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td style={{ padding: "14px 18px", fontSize: "12px", fontWeight: "600", color: "var(--success)", whiteSpace: "nowrap" }}>
                    {item.paidDate
                      ? new Date(item.paidDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
                      : "N/A"}
                  </td>
                  <td style={{ padding: "14px 18px" }}>
                    <PriorityPill priority={item.priority} />
                  </td>
                  <td style={{ padding: "14px 18px", textAlign: "right" }}>
                    <PaidPill />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary footer */}
        {filteredHistory.length > 0 && (
          <div style={{ marginTop: "12px", fontSize: "13px", color: "var(--text-muted)", textAlign: "right" }}>
            Showing <strong style={{ color: "var(--text-primary)" }}>{filteredHistory.length}</strong> of <strong style={{ color: "var(--text-primary)" }}>{history.length}</strong> bill records
          </div>
        )}
      </div>
    </div>
  );
};

export default BillHistory;
