import React from "react";
import { Search } from "lucide-react";
import { PremiumInput } from "@/components/ui/input.jsx";
import { Select } from "@/components/ui/select.jsx";

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
  roles = [],
  borderless = false
}) {
  const handleChange = (field, value) => {
    if (onFilterChange) {
      onFilterChange({
        ...filters,
        [field]: value
      });
    }
  };

  const containerClass = borderless
    ? "w-full flex flex-col gap-6"
    : "bg-card/40 border border-border/40 p-4 rounded-[var(--radius-lg)] space-y-4 shadow-sm w-full";

  return (
    <div className={containerClass}>
      {/* Filters Grid */}
      <div className="pending-applications-filter-grid items-end">
        {/* Search */}
        <div className="flex flex-col gap-2.5 min-w-0 w-full">
          <label className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase px-1">
            Search
          </label>
          <PremiumInput
            placeholder="Search keywords, candidate or company..."
            leftIcon={Search}
            value={filters.search}
            onChange={(e) => handleChange("search", e.target.value)}
            className="h-14 pr-[18px] text-sm bg-background border-border/50 rounded-[var(--radius-md)] w-full"
          />
        </div>

        {/* Company Filter */}
        <div className="flex flex-col gap-2.5 min-w-0 w-full">
          <label className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase px-1">
            Company
          </label>
          <Select
            value={filters.company}
            onChange={(e) => handleChange("company", e.target.value)}
            className="h-14 pl-[18px] pr-10 text-sm bg-background border-border/50 rounded-[var(--radius-md)] w-full"
          >
            <option value="">All Companies</option>
            {companies?.map((co) => (
              <option key={co} value={co}>
                {co}
              </option>
            ))}
          </Select>
        </div>

        {/* Role Filter */}
        <div className="flex flex-col gap-2.5 min-w-0 w-full">
          <label className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase px-1">
            Role
          </label>
          <Select
            value={filters.role}
            onChange={(e) => handleChange("role", e.target.value)}
            className="h-14 pl-[18px] pr-10 text-sm bg-background border-border/50 rounded-[var(--radius-md)] w-full"
          >
            <option value="">All Roles</option>
            {roles?.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>
        </div>

        {/* Status Filter */}
        <div className="flex flex-col gap-2.5 min-w-0 w-full">
          <label className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase px-1">
            Status
          </label>
          <Select
            value={filters.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="h-14 pl-[18px] pr-10 text-sm bg-background border-border/50 rounded-[var(--radius-md)] w-full"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="referred">Referred</option>
            <option value="rejected">Rejected</option>
          </Select>
        </div>
      </div>

      {/* Sorting & Additional controls */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-border/30 mt-4 mb-6 w-full flex-wrap sm:flex-nowrap">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
            Sort By
          </span>
          <div className="w-[220px] max-w-full min-w-0">
            <Select
              value={filters.sortBy}
              onChange={(e) => handleChange("sortBy", e.target.value)}
              className="h-12 text-xs font-semibold pl-[18px] pr-10 rounded-[var(--radius-md)] border-border/50 bg-background w-full"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="name-asc">Candidate A-Z</option>
              <option value="name-desc">Candidate Z-A</option>
            </Select>
          </div>
        </div>

        {/* Clear Filters Button */}
        {(filters.search || filters.company || filters.role || filters.status || filters.stage || filters.sortBy) && (
          <button
            onClick={() => {
              if (onFilterChange) {
                onFilterChange({
                  search: "",
                  company: "",
                  role: "",
                  status: "",
                  stage: "",
                  sortBy: ""
                });
              }
            }}
            className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
}
