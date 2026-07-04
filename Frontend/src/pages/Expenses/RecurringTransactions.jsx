import React, { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Badge } from "../../components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/table";
import { AiOutlineEdit, AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";
import { expensesApi } from "../../services/api/expensesApi";
import { getUserId } from "../../utils/Expenses/authHelper";
import { toast } from "react-hot-toast";
import { getExpenseStatus } from "../../utils/Expenses/helpers";
import { getExpenseCategory } from "../../utils/Expenses/categories";
import ExpenseFilters from "../../components/Expenses/shared/ExpenseFilters";
import { RefreshCw, Repeat, Plus } from "lucide-react";

/* ── Scoped styles ── */
const S = {
  card: {
    background: "var(--card-bg)",
    border: "1px solid var(--border-color)",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
  },
};

function StatusPill({ status }) {
  const map = {
    "Active":   { bg: "rgba(16,185,129,0.12)", color: "var(--success)", border: "rgba(16,185,129,0.25)" },
    "Paused":   { bg: "rgba(245,158,11,0.12)", color: "var(--warning)", border: "rgba(245,158,11,0.25)" },
    "Overdue":  { bg: "rgba(239,68,68,0.12)",  color: "var(--danger)",  border: "rgba(239,68,68,0.25)" },
    "Inactive": { bg: "rgba(100,116,139,0.12)", color: "var(--text-muted)", border: "rgba(100,116,139,0.25)" },
  };
  const t = map[status] || map["Inactive"];
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

const RecurringTransactions = () => {
  const user = JSON.parse(localStorage.getItem("User"));
  const userId = getUserId(user);

  const [recurringData, setRecurringData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    frequency: "Monthly",
    category: "Other",
    nextDate: new Date().toISOString().substring(0, 10),
  });

  const categories = ["Grocery", "Vehicle", "Shopping", "Travel", "Food", "Fun", "Other"];

  const fetchRules = async () => {
    setIsLoading(true);
    try {
      const rules = await expensesApi.getRecurringRules();
      setRecurringData(rules || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const migrateLocalRules = async (rules) => {
    try {
      for (const rule of rules) {
        await expensesApi.createRecurringRule({
          title: rule.title,
          amount: Number(rule.amount),
          frequency: rule.frequency,
          category: rule.category,
          nextDate: rule.nextDate,
          isActive: rule.isActive !== false,
        });
      }
      localStorage.removeItem(`recurring_tx_${userId}`);
    } catch (err) {
      console.error("Migration failed:", err);
    }
  };

  useEffect(() => {
    if (userId) {
      const fetchAndMigrate = async () => {
        try {
          const dbRules = await expensesApi.getRecurringRules();
          const saved = localStorage.getItem(`recurring_tx_${userId}`);
          const localRules = saved ? JSON.parse(saved) : [];
          if (localRules.length > 0 && dbRules.length === 0) {
            await migrateLocalRules(localRules);
            const updatedRules = await expensesApi.getRecurringRules();
            setRecurringData(updatedRules || []);
          } else {
            setRecurringData(dbRules || []);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setIsLoading(false);
        }
      };
      fetchAndMigrate();
    } else {
      setIsLoading(false);
    }
  }, [userId]);

  const handleToggle = async (id, currentActive) => {
    try {
      const res = await expensesApi.updateRecurringRule(id, { isActive: !currentActive });
      if (res.statusCode === 200) {
        toast.success("Rule status updated!");
        fetchRules();
      } else {
        toast.error(res.message || "Failed to update rule status");
      }
    } catch (err) {
      toast.error("Failed to update status.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this recurring rule?")) {
      try {
        const res = await expensesApi.deleteRecurringRule(id);
        if (res.statusCode === 200) {
          toast.success("Recurring rule deleted successfully!");
          fetchRules();
        } else {
          toast.error(res.message || "Failed to delete rule");
        }
      } catch (err) {
        toast.error("Failed to delete rule.");
      }
    }
  };

  const openForm = (tx = null) => {
    if (tx) {
      setEditingId(tx._id);
      setFormData({
        title: tx.title,
        amount: tx.amount,
        frequency: tx.frequency,
        category: tx.category,
        nextDate: new Date(tx.nextDate).toISOString().substring(0, 10),
      });
    } else {
      setEditingId(null);
      setFormData({ title: "", amount: "", frequency: "Monthly", category: "Other", nextDate: new Date().toISOString().substring(0, 10) });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await expensesApi.updateRecurringRule(editingId, {
          title: formData.title,
          amount: Number(formData.amount),
          frequency: formData.frequency,
          category: formData.category,
          nextDate: new Date(formData.nextDate).toISOString(),
        });
        if (res.statusCode === 200) {
          toast.success("Rule updated successfully!");
          setIsModalOpen(false);
          fetchRules();
        } else {
          toast.error(res.message || "Failed to update rule");
        }
      } else {
        const res = await expensesApi.createRecurringRule({
          title: formData.title,
          amount: Number(formData.amount),
          frequency: formData.frequency,
          category: formData.category,
          nextDate: new Date(formData.nextDate).toISOString(),
        });
        if (res.statusCode === 201) {
          toast.success("Recurring rule created successfully!");
          setIsModalOpen(false);
          fetchRules();
        } else {
          toast.error(res.message || "Failed to create rule");
        }
      }
    } catch (err) {
      toast.error("Failed to save recurring rule.");
    }
  };

  const filteredData = useMemo(() => {
    return recurringData.filter(tx => {
      const matchesSearch = tx.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === "" || tx.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [recurringData, searchQuery, filterCategory]);

  const upcomingCards = [...recurringData]
    .filter((tx) => tx.isActive)
    .sort((a, b) => new Date(a.nextDate) - new Date(b.nextDate))
    .slice(0, 3);

  const gradients = [
    ["#7c3aed", "#3b82f6"],
    ["#059669", "#0891b2"],
    ["#ea580c", "#e11d48"],
  ];

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
            Manage your subscriptions and recurring bills effortlessly.
          </p>
        </div>
        <button
          onClick={() => openForm()}
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "0 20px", height: "38px", borderRadius: "10px", border: "none",
            background: "var(--accent)", color: "#fff",
            fontSize: "13px", fontWeight: "700", cursor: "pointer",
            boxShadow: "0 4px 14px rgba(59,130,246,0.3)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(59,130,246,0.4)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(59,130,246,0.3)"; }}
        >
          <Plus size={16} /> New Rule
        </button>
      </div>

      {/* ── Upcoming Subscription Cards ── */}
      <div>
        <p style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "14px" }}>
          Upcoming Payments
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
          {upcomingCards.length === 0 ? (
            <div style={{
              gridColumn: "1 / -1", padding: "40px", textAlign: "center",
              border: "2px dashed var(--border-color)", borderRadius: "14px",
              color: "var(--text-muted)", fontSize: "14px",
            }}>
              <Repeat size={32} style={{ margin: "0 auto 10px", display: "block", opacity: 0.4 }} />
              No active subscriptions upcoming. Create a rule to get started.
            </div>
          ) : upcomingCards.map((card, idx) => {
            const isOverdue = new Date(card.nextDate) < new Date();
            const [from, to] = gradients[idx % gradients.length];
            const catMeta = getExpenseCategory(card.category);
            return (
              <div
                key={card._id}
                style={{
                  position: "relative", overflow: "hidden",
                  borderRadius: "16px", padding: "22px",
                  background: "var(--card-bg)",
                  border: isOverdue ? "1px solid rgba(239,68,68,0.4)" : "1px solid var(--border-color)",
                  boxShadow: isOverdue ? "0 0 20px rgba(239,68,68,0.15)" : "0 1px 3px rgba(0,0,0,0.05)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  cursor: "default",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = isOverdue ? "0 0 20px rgba(239,68,68,0.15)" : "0 1px 3px rgba(0,0,0,0.05)"; }}
              >
                {/* Gradient accent */}
                <div style={{
                  position: "absolute", inset: 0,
                  background: `linear-gradient(135deg, ${from}18, ${to}08)`,
                  pointerEvents: "none",
                }} />
                <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "100px", height: "100px", borderRadius: "50%", background: `${from}12`, filter: "blur(20px)", pointerEvents: "none" }} />

                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", gap: "8px" }}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <h4 style={{ fontSize: "15px", fontWeight: "700", color: "var(--text-primary)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{card.title}</h4>
                      <p style={{ fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginTop: "2px" }}>{catMeta.label}</p>
                    </div>
                    <span style={{ padding: "3px 9px", borderRadius: "999px", fontSize: "10px", fontWeight: "700", background: `${from}15`, color: from, border: `1px solid ${from}30`, flexShrink: 0 }}>
                      {card.frequency}
                    </span>
                  </div>
                  <div>
                    <p style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px" }}>Auto Debit Amount</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "8px" }}>
                      <p style={{ fontSize: "26px", fontWeight: "800", color: "var(--text-primary)", letterSpacing: "-0.02em", margin: 0 }}>
                        ₹ {card.amount.toLocaleString()}
                      </p>
                      <p style={{ fontSize: "12px", fontWeight: "700", color: isOverdue ? "var(--danger)" : from, flexShrink: 0 }}>
                        {isOverdue ? "OVERDUE" : new Date(card.nextDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Active Rules Table ── */}
      <div style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border-color)",
        borderRadius: "16px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        overflow: "hidden",
      }}>
        {/* Table header card */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border-color)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>All Recurring Rules</h3>
            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{filteredData.length} rules</span>
          </div>
          <ExpenseFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterCategory={filterCategory}
            onCategoryChange={setFilterCategory}
            categories={categories}
            className="p-0 border-b-0"
          />
        </div>

        <div style={{ overflowX: "auto", maxHeight: "480px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "640px" }}>
            <thead style={{ position: "sticky", top: 0, zIndex: 10, background: "var(--bg-secondary)", borderBottom: "1px solid var(--border-color)" }}>
              <tr>
                {["Subscription / Bill", "Amount", "Frequency", "Next Date", "Status", "Toggle", "Actions"].map((h, i) => (
                  <th key={h} style={{
                    padding: "12px 16px",
                    textAlign: i >= 2 && i <= 5 ? "center" : i === 6 ? "right" : "left",
                    fontSize: "11px", fontWeight: "700", letterSpacing: "0.07em",
                    textTransform: "uppercase", color: "var(--text-muted)", whiteSpace: "nowrap",
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="7" style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)", fontSize: "14px" }}>
                    Loading rules…
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: "48px 24px", textAlign: "center" }}>
                    <Repeat size={36} style={{ color: "var(--text-muted)", margin: "0 auto 10px", display: "block", opacity: 0.4 }} />
                    <p style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: "500" }}>No recurring rules configured.</p>
                    <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>Click "New Rule" to create your first automated payment.</p>
                  </td>
                </tr>
              ) : filteredData.map((tx, idx) => {
                const statusMeta = getExpenseStatus(null, tx.nextDate, tx.isActive);
                const categoryMeta = getExpenseCategory(tx.category);
                return (
                  <tr
                    key={tx._id}
                    style={{
                      borderBottom: idx < filteredData.length - 1 ? "1px solid var(--border-color)" : "none",
                      background: "var(--card-bg)",
                      transition: "background 0.15s ease",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--bg-secondary)"}
                    onMouseLeave={e => e.currentTarget.style.background = "var(--card-bg)"}
                  >
                    <td style={{ padding: "14px 16px" }}>
                      <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", margin: 0 }}>{tx.title}</p>
                      <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: "2px 0 0" }}>{categoryMeta.label}</p>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: "15px", fontWeight: "700", color: "var(--text-primary)", whiteSpace: "nowrap" }}>
                      ₹ {tx.amount.toLocaleString()}
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "center" }}>
                      <span style={{ padding: "3px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: "600", background: "rgba(59,130,246,0.1)", color: "var(--accent)", border: "1px solid rgba(59,130,246,0.2)" }}>
                        {tx.frequency}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "center", fontSize: "13px", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
                      {new Date(tx.nextDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "center" }}>
                      <StatusPill status={statusMeta.label} />
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "center" }}>
                      <button
                        onClick={() => handleToggle(tx._id, tx.isActive)}
                        style={{
                          position: "relative", display: "inline-flex", alignItems: "center",
                          width: "44px", height: "24px", borderRadius: "999px", border: "none", cursor: "pointer",
                          background: tx.isActive ? "var(--accent)" : "var(--bg-tertiary)",
                          transition: "background 0.2s ease",
                          padding: 0,
                        }}
                      >
                        <span style={{
                          position: "absolute",
                          left: tx.isActive ? "22px" : "2px",
                          width: "20px", height: "20px", borderRadius: "50%",
                          background: "#fff",
                          boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                          transition: "left 0.2s ease",
                        }} />
                      </button>
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "6px" }}>
                        <button
                          onClick={() => openForm(tx)}
                          style={{ width: "30px", height: "30px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text-muted)", transition: "all 0.15s ease" }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.background = "rgba(59,130,246,0.08)"; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "none"; }}
                        >
                          <AiOutlineEdit size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(tx._id)}
                          style={{ width: "30px", height: "30px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text-muted)", transition: "all 0.15s ease" }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--danger)"; e.currentTarget.style.color = "var(--danger)"; e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "none"; }}
                        >
                          <AiOutlineDelete size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Create / Edit Dialog ── */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Recurring Rule" : "New Recurring Rule"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Rule Name / Title</label>
              <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="premium-input w-full" placeholder="Spotify Subs" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Amount (₹)</label>
                <input type="number" required value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className="premium-input text-base w-full" placeholder="119" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Frequency</label>
                <select required value={formData.frequency} onChange={(e) => setFormData({ ...formData, frequency: e.target.value })} className="premium-input text-muted-foreground w-full bg-secondary">
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 z-50 relative">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Next Execution</label>
                <input type="date" required value={formData.nextDate} onChange={(e) => setFormData({ ...formData, nextDate: e.target.value })} className="premium-input w-full bg-secondary" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Category</label>
                <select required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="premium-input text-muted-foreground w-full bg-secondary">
                  {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
                </select>
              </div>
            </div>
            <div className="flex gap-4 justify-end mt-8">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-[var(--radius-md)] border border-border text-foreground font-medium hover:bg-muted/10 transition-colors">Cancel</button>
              <button type="submit" className="px-6 py-2.5 rounded-[var(--radius-md)] bg-[var(--accent)] text-white font-bold hover:opacity-90 transition-all">
                {editingId ? "Save Changes" : "Create Rule"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecurringTransactions;