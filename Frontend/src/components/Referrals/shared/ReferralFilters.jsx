import React from "react";
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";

export function ReferralFilters({
  filters = {
    search: "",
    company: "",
    role: "",
    status: "",
    stage: "",
    sortBy: ""
  },
  onFilterChange,
  companies = [],
  roles = []
}) {
  const handleChange = (field, value) => {
    if (onFilterChange) {
      onFilterChange({ ...filters, [field]: value });
    }
  };

  const hasActiveFilters = filters.search || filters.company || filters.role || filters.status || filters.stage || (filters.sortBy && filters.sortBy !== "date-desc");

  const selectStyle = {
    height: "38px", borderRadius: "10px",
    border: "1px solid var(--border-color)",
    background: "var(--card-bg)",
    color: "var(--text-primary)",
    fontSize: "12px", fontWeight: "500",
    padding: "0 10px", outline: "none",
    cursor: "pointer", width: "100%",
    appearance: "none", WebkitAppearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center",
    paddingRight: "30px",
    transition: "border-color 0.15s ease",
  };

  return (
    <div style={{
      background: "var(--card-bg)",
      border: "1px solid var(--border-color)",
      borderRadius: "14px",
      padding: "14px 16px",
      marginBottom: "4px",
    }}>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <SlidersHorizontal size={14} style={{ color: "#6366f1" }} />
          <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-primary)", letterSpacing: "0.01em" }}>
            Filters
          </span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={() => onFilterChange?.({ search: "", company: "", role: "", status: "", stage: "", sortBy: "date-desc" })}
            style={{
              display: "flex", alignItems: "center", gap: "4px",
              fontSize: "11px", fontWeight: "700", color: "#6366f1",
              background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: "8px", padding: "3px 10px", cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,0.14)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(99,102,241,0.07)"}
          >
            <RotateCcw size={10} /> Reset
          </button>
        )}
      </div>

      {/* Filters grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr",
        gap: "10px",
        alignItems: "end",
      }}
        className="referral-filters-grid"
      >
        {/* Search */}
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label style={{ fontSize: "10px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Search
          </label>
          <div style={{ position: "relative" }}>
            <Search size={13} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
            <input
              type="text"
              placeholder="Search keywords, company..."
              value={filters.search}
              onChange={e => handleChange("search", e.target.value)}
              style={{
                ...selectStyle,
                paddingLeft: "32px", paddingRight: "12px",
                backgroundImage: "none",
              }}
              onFocus={e => e.currentTarget.style.borderColor = "#6366f1"}
              onBlur={e => e.currentTarget.style.borderColor = "var(--border-color)"}
            />
          </div>
        </div>

        {/* Company */}
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label style={{ fontSize: "10px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Company
          </label>
          <select
            value={filters.company}
            onChange={e => handleChange("company", e.target.value)}
            style={selectStyle}
            onFocus={e => e.currentTarget.style.borderColor = "#6366f1"}
            onBlur={e => e.currentTarget.style.borderColor = "var(--border-color)"}
          >
            <option value="">All Companies</option>
            {companies.map(co => <option key={co} value={co}>{co}</option>)}
          </select>
        </div>

        {/* Role */}
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label style={{ fontSize: "10px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Role
          </label>
          <select
            value={filters.role}
            onChange={e => handleChange("role", e.target.value)}
            style={selectStyle}
            onFocus={e => e.currentTarget.style.borderColor = "#6366f1"}
            onBlur={e => e.currentTarget.style.borderColor = "var(--border-color)"}
          >
            <option value="">All Roles</option>
            {roles.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        {/* Status */}
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label style={{ fontSize: "10px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Status
          </label>
          <select
            value={filters.status}
            onChange={e => handleChange("status", e.target.value)}
            style={selectStyle}
            onFocus={e => e.currentTarget.style.borderColor = "#6366f1"}
            onBlur={e => e.currentTarget.style.borderColor = "var(--border-color)"}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="referred">Referred</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Stage */}
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label style={{ fontSize: "10px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Stage
          </label>
          <select
            value={filters.stage}
            onChange={e => handleChange("stage", e.target.value)}
            style={selectStyle}
            onFocus={e => e.currentTarget.style.borderColor = "#6366f1"}
            onBlur={e => e.currentTarget.style.borderColor = "var(--border-color)"}
          >
            <option value="">All Stages</option>
            <option value="resume_screen">Resume Screen</option>
            <option value="screening">Screening</option>
            <option value="technical">Technical</option>
            <option value="managerial">Managerial</option>
            <option value="hr">HR Round</option>
            <option value="offered">Offered</option>
          </select>
        </div>

        {/* Sort By */}
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label style={{ fontSize: "10px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Sort By
          </label>
          <select
            value={filters.sortBy || "date-desc"}
            onChange={e => handleChange("sortBy", e.target.value)}
            style={selectStyle}
            onFocus={e => e.currentTarget.style.borderColor = "#6366f1"}
            onBlur={e => e.currentTarget.style.borderColor = "var(--border-color)"}
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="name-asc">Name A–Z</option>
            <option value="name-desc">Name Z–A</option>
          </select>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 1024px) {
          .referral-filters-grid {
            grid-template-columns: 1fr 1fr 1fr !important;
          }
        }
        @media (max-width: 640px) {
          .referral-filters-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 400px) {
          .referral-filters-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
