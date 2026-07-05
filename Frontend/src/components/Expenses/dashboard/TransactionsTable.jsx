import React, { useState, useMemo } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import {
  MdRestaurant,
  MdDirectionsCar,
  MdShoppingBag,
  MdMenuBook,
  MdWifi,
  MdHome,
  MdCategory,
  MdShoppingCart,
  MdSportsEsports,
  MdLocalHospital,
  MdPhoneAndroid,
} from "react-icons/md";
import { Search, Calendar } from "lucide-react";
import { expensesApi } from "../../../services/api/expensesApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../ui/table";
import { getExpenseCategory } from "../../../utils/Expenses/categories";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

/* ── Category icon map ── */
const CATEGORY_META = {
  grocery:        { Icon: MdShoppingCart, bg: "rgba(245,158,11,0.15)", color: "#d97706" },
  food:           { Icon: MdRestaurant,   bg: "rgba(16,185,129,0.15)", color: "#059669" },
  "mess fees":    { Icon: MdRestaurant,   bg: "rgba(16,185,129,0.15)", color: "#059669" },
  vehicle:        { Icon: MdDirectionsCar, bg: "rgba(59,130,246,0.15)", color: "#2563eb" },
  travel:         { Icon: MdDirectionsCar, bg: "rgba(59,130,246,0.15)", color: "#2563eb" },
  transportation: { Icon: MdDirectionsCar, bg: "rgba(99,102,241,0.15)", color: "#6366f1" },
  shopping:       { Icon: MdShoppingBag,  bg: "rgba(245,158,11,0.15)", color: "#b45309" },
  fun:            { Icon: MdSportsEsports, bg: "rgba(139,92,246,0.15)", color: "#7c3aed" },
  books:          { Icon: MdMenuBook,     bg: "rgba(59,130,246,0.15)", color: "#1d4ed8" },
  "tuition fees": { Icon: MdMenuBook,     bg: "rgba(59,130,246,0.15)", color: "#1d4ed8" },
  healthcare:     { Icon: MdLocalHospital, bg: "rgba(239,68,68,0.15)", color: "#dc2626" },
  internet:       { Icon: MdWifi,         bg: "rgba(99,102,241,0.15)", color: "#7c3aed" },
  "mobile recharge": { Icon: MdPhoneAndroid, bg: "rgba(99,102,241,0.15)", color: "#6366f1" },
  subscriptions:  { Icon: MdWifi,         bg: "rgba(99,102,241,0.15)", color: "#7c3aed" },
  "hostel fees":  { Icon: MdHome,         bg: "rgba(100,116,139,0.15)", color: "#475569" },
};

function getCategoryMeta(category = "") {
  return CATEGORY_META[(category || "").toLowerCase()] || { Icon: MdCategory, bg: "rgba(100,116,139,0.15)", color: "#64748b" };
}

/* ── Scoped filter input style ── */
const filterInputStyle = {
  height: "38px",
  padding: "0 12px",
  borderRadius: "9px",
  border: "1px solid var(--border-color)",
  background: "var(--card-bg)",
  color: "var(--text-primary)",
  fontSize: "13px",
  fontWeight: "500",
  outline: "none",
  cursor: "pointer",
  transition: "border-color 0.15s ease",
};

const TransactionsTable = ({ transactions, onUpdate }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDate, setFilterDate] = useState(null);
  const [sortBy, setSortBy] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);
  const [editForm, setEditForm] = useState({ amount: "", category: "", date: "" });

  const categories = ["Grocery", "Vehicle", "Shopping", "Travel", "Food", "Fun", "Other"];

  const processedData = useMemo(() => {
    let result = transactions ? [...transactions] : [];
    if (searchQuery) {
      result = result.filter(
        (tx) =>
          tx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tx.amount.toString().includes(searchQuery)
      );
    }
    if (filterCategory) result = result.filter((tx) => tx.category === filterCategory);
    if (filterDate) {
      const targetDate = filterDate.toLocaleDateString();
      result = result.filter((tx) => new Date(tx.date).toLocaleDateString() === targetDate);
    }
    result.sort((a, b) => {
      switch (sortBy) {
        case "latest":  return new Date(b.date) - new Date(a.date);
        case "oldest":  return new Date(a.date) - new Date(b.date);
        case "highest": return b.amount - a.amount;
        case "lowest":  return a.amount - b.amount;
        default: return 0;
      }
    });
    return result;
  }, [transactions, searchQuery, filterCategory, filterDate, sortBy]);

  const totalPages = Math.ceil(processedData.length / itemsPerPage);
  const paginatedData = processedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openDeleteModal = (tx) => { setSelectedTx(tx); setIsDeleteModalOpen(true); };
  const confirmDelete = async () => {
    if (selectedTx) {
      await expensesApi.deleteExpense({ expenseId: selectedTx._id, userId: selectedTx.userId });
      if (onUpdate) onUpdate();
    }
    setIsDeleteModalOpen(false);
    setSelectedTx(null);
  };

  const openEditModal = (tx) => {
    setSelectedTx(tx);
    setEditForm({ amount: tx.amount, category: tx.category, date: new Date(tx.date) });
    setIsEditModalOpen(true);
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (selectedTx) {
      await expensesApi.deleteExpense({ expenseId: selectedTx._id, userId: selectedTx.userId });
      await expensesApi.createExpense({
        userId: selectedTx.userId,
        category: editForm.category,
        date: editForm.date,
        amount: Number(editForm.amount),
      });
      if (onUpdate) onUpdate();
    }
    setIsEditModalOpen(false);
    setSelectedTx(null);
  };

  const formatDate = (dateStr) => {
    const date = new Date(Date.parse(dateStr));
    return date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      background: "var(--card-bg)", border: "1px solid var(--border-color)",
      borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      overflow: "hidden",
    }}>
      {/* ── Header + Filters ── */}
      <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid var(--border-color)" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-primary)", margin: "0 0 14px", letterSpacing: "-0.01em" }}>
          All Transactions
        </h3>

        {/* Filter row */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          {/* Search */}
          <div style={{ position: "relative", flex: "1 1 220px", minWidth: "180px" }}>
            <Search style={{ position: "absolute", left: "11px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", width: "15px", height: "15px", pointerEvents: "none", flexShrink: 0 }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search by category or merchant..."
              style={{
                ...filterInputStyle,
                paddingLeft: "34px",
                width: "100%",
                cursor: "text",
              }}
              onFocus={e => e.currentTarget.style.borderColor = "var(--accent)"}
              onBlur={e => e.currentTarget.style.borderColor = "var(--border-color)"}
            />
          </div>

          {/* Category dropdown */}
          <select
            value={filterCategory}
            onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}
            style={{ ...filterInputStyle, paddingRight: "8px", flexShrink: 0 }}
            onFocus={e => e.currentTarget.style.borderColor = "var(--accent)"}
            onBlur={e => e.currentTarget.style.borderColor = "var(--border-color)"}
          >
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Date filter */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <Calendar style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", width: "14px", height: "14px", pointerEvents: "none", zIndex: 1 }} />
            <DatePicker
              selected={filterDate}
              onChange={(d) => { setFilterDate(d); setCurrentPage(1); }}
              isClearable
              placeholderText="Filter by Date"
              className="expense-date-filter"
              wrapperClassName="expense-date-wrapper"
              popperPlacement="bottom-start"
            />
          </div>

          {/* Sort dropdown */}
          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
            style={{ ...filterInputStyle, paddingRight: "8px", flexShrink: 0 }}
            onFocus={e => e.currentTarget.style.borderColor = "var(--accent)"}
            onBlur={e => e.currentTarget.style.borderColor = "var(--border-color)"}
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="highest">Highest Amount</option>
            <option value="lowest">Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* ── Table ── */}
      <div style={{ overflowX: "auto", flex: 1, minHeight: "280px" }}>
        <Table style={{ minWidth: "520px" }}>
          <TableHeader>
            <TableRow style={{ background: "var(--bg-secondary)" }}>
              <TableHead style={{ padding: "12px 20px", fontSize: "11px", fontWeight: "700", letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-muted)" }}>Category</TableHead>
              <TableHead style={{ padding: "12px 20px", fontSize: "11px", fontWeight: "700", letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-muted)" }}>Date</TableHead>
              <TableHead style={{ padding: "12px 20px", fontSize: "11px", fontWeight: "700", letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-muted)", textAlign: "right" }}>Amount</TableHead>
              <TableHead style={{ padding: "12px 20px", fontSize: "11px", fontWeight: "700", letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-muted)", textAlign: "center" }}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((exp) => {
                const { Icon, bg, color } = getCategoryMeta(exp.category);
                return (
                  <TableRow
                    key={exp._id}
                    className="group"
                    style={{ borderBottom: "1px solid var(--border-color)", transition: "background 0.12s ease" }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--bg-secondary)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <TableCell style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        {/* Colored icon badge */}
                        <div style={{
                          width: "36px", height: "36px", borderRadius: "10px",
                          background: bg, color, display: "flex",
                          alignItems: "center", justifyContent: "center", flexShrink: 0,
                        }}>
                          <Icon size={18} />
                        </div>
                        <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)" }}>
                          {exp.category}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell style={{ padding: "14px 20px", fontSize: "13px", color: "var(--text-muted)" }}>
                      {formatDate(exp.date)}
                    </TableCell>
                    <TableCell style={{ padding: "14px 20px", textAlign: "right" }}>
                      <span style={{ fontSize: "15px", fontWeight: "700", color: "var(--text-primary)" }}>
                        ₹ {exp.amount.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell style={{ padding: "14px 20px", textAlign: "center" }}>
                      <div style={{ display: "flex", justifyContent: "center", gap: "6px" }}>
                        <button
                          onClick={() => openEditModal(exp)}
                          style={{
                            width: "30px", height: "30px", borderRadius: "8px",
                            border: "1px solid var(--border-color)", background: "none",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            cursor: "pointer", color: "var(--text-muted)", transition: "all 0.15s ease",
                          }}
                          title="Edit"
                          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.background = "rgba(59,130,246,0.08)"; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "none"; }}
                        >
                          <AiOutlineEdit size={15} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(exp)}
                          style={{
                            width: "30px", height: "30px", borderRadius: "8px",
                            border: "1px solid var(--border-color)", background: "none",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            cursor: "pointer", color: "var(--text-muted)", transition: "all 0.15s ease",
                          }}
                          title="Delete"
                          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--danger)"; e.currentTarget.style.color = "var(--danger)"; e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "none"; }}
                        >
                          <AiOutlineDelete size={15} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan="4" style={{ padding: "48px 24px", textAlign: "center", color: "var(--text-muted)", fontSize: "14px" }}>
                  No transactions found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Pagination ── */}
      {totalPages >= 1 && processedData.length > 0 && (
        <div style={{
          padding: "14px 20px",
          borderTop: "1px solid var(--border-color)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: "var(--bg-secondary)",
        }}>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0 }}>
            Showing{" "}
            <strong style={{ color: "var(--text-primary)" }}>{(currentPage - 1) * itemsPerPage + 1}</strong>
            {" "}to{" "}
            <strong style={{ color: "var(--text-primary)" }}>{Math.min(currentPage * itemsPerPage, processedData.length)}</strong>
            {" "}of{" "}
            <strong style={{ color: "var(--text-primary)" }}>{processedData.length}</strong>
            {" "}results
          </p>
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{
                padding: "0 14px", height: "32px", borderRadius: "8px",
                border: "1px solid var(--border-color)", background: "var(--card-bg)",
                fontSize: "12px", fontWeight: "600", color: "var(--text-primary)",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                opacity: currentPage === 1 ? 0.4 : 1,
                transition: "all 0.15s ease",
              }}
            >
              Previous
            </button>
            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                style={{
                  width: "32px", height: "32px", borderRadius: "8px",
                  border: "1px solid var(--border-color)",
                  background: page === currentPage ? "var(--accent)" : "var(--card-bg)",
                  color: page === currentPage ? "#fff" : "var(--text-primary)",
                  fontSize: "12px", fontWeight: "700", cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{
                padding: "0 14px", height: "32px", borderRadius: "8px",
                border: "1px solid var(--border-color)", background: "var(--card-bg)",
                fontSize: "12px", fontWeight: "600", color: "var(--text-primary)",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                opacity: currentPage === totalPages ? 0.4 : 1,
                transition: "all 0.15s ease",
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* ── Delete Dialog ── */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Confirm Deletion</DialogTitle></DialogHeader>
          <div className="text-foreground pt-4">
            <p className="mb-6">
              Are you sure you want to delete this <strong>{selectedTx?.category}</strong> expense of{" "}
              <strong>₹ {selectedTx?.amount.toLocaleString()}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-4 justify-end">
              <button onClick={() => setIsDeleteModalOpen(false)} className="px-5 py-2 rounded-[var(--radius-sm)] border border-border text-foreground font-medium hover:bg-secondary transition-colors">Cancel</button>
              <button onClick={confirmDelete} className="px-5 py-2 rounded-[var(--radius-sm)] bg-destructive text-destructive-foreground font-bold hover:bg-destructive/90 transition-all">Delete Expense</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Edit Dialog ── */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Transaction</DialogTitle></DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-5 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Amount (₹)</label>
              <input type="number" value={editForm.amount} onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })} className="premium-input text-lg w-full" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Category</label>
              <select value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} className="premium-input text-foreground cursor-pointer bg-secondary w-full" required>
                {categories.map((c) => <option key={c} value={c} className="bg-[var(--bg-nav-container)] text-[var(--text-primary)]">{c}</option>)}
              </select>
            </div>
            <div className="space-y-2 flex flex-col items-stretch">
              <label className="text-sm font-medium text-foreground">Date</label>
              <DatePicker selected={editForm.date} onChange={(date) => setEditForm({ ...editForm, date })} className="premium-input w-full cursor-pointer inline-block bg-secondary" dateFormat="MMM d, yyyy" required />
            </div>
            <div className="flex gap-4 justify-end mt-6">
              <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-5 py-2 rounded-[var(--radius-sm)] border border-border text-foreground font-medium hover:bg-secondary transition-colors">Cancel</button>
              <button type="submit" className="px-5 py-2 rounded-[var(--radius-sm)] bg-primary text-primary-foreground font-bold hover:bg-primary-hover transition-all">Save Changes</button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Scoped styles for DatePicker ── */}
      <style>{`
        .expense-date-filter {
          height: 38px !important;
          padding: 0 12px 0 34px !important;
          border-radius: 9px !important;
          border: 1px solid var(--border-color) !important;
          background: var(--card-bg) !important;
          color: var(--text-primary) !important;
          font-size: 13px !important;
          font-weight: 500 !important;
          outline: none !important;
          cursor: pointer !important;
          min-width: 140px !important;
          transition: border-color 0.15s ease !important;
        }
        .expense-date-filter:focus {
          border-color: var(--accent) !important;
        }
        .expense-date-wrapper { display: block !important; }
      `}</style>
    </div>
  );
};

export default TransactionsTable;
