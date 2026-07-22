import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ApplicantStatusIndicator } from "./ApplicantStatusIndicator";
import { EmptyState } from "../shared/EmptyState";
import { Briefcase, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";

export const InteractiveJobsTable = React.memo(({ 
  jobs = [], 
  onRowClick, 
  onActionClick, 
  actionLabel = "View",
  emptyTitle = "No Jobs Found",
  emptyDescription = "There are currently no job postings to display.",
  emptyIcon: EmptyIcon = Briefcase
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const sortedJobs = useMemo(() => {
    let sortableJobs = [...jobs];
    if (sortConfig.key !== null) {
      sortableJobs.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableJobs;
  }, [jobs, sortConfig]);

  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedJobs.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedJobs, currentPage]);

  const totalPages = Math.ceil(jobs.length / itemsPerPage);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  if (!jobs || jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-6 w-full flex-1 bg-transparent">
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center text-blue-600 shadow-sm shrink-0 border mb-4"
          style={{ backgroundColor: 'rgba(239, 246, 255, 0.5)', borderColor: '#dbeafe' }}
        >
          <EmptyIcon className="w-6 h-6" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
          {emptyTitle}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mx-auto w-[320px] sm:w-[450px] max-w-full">
          {emptyDescription}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border border-border overflow-x-auto table-responsive" style={{ borderRadius: "16px" }}>
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/40 hover:bg-transparent" style={{ height: "60px" }}>
              <TableHead style={{ paddingLeft: "24px", fontSize: "14px", fontWeight: "600", letterSpacing: "0.05em", color: "var(--text-secondary)" }}>
                <Button variant="ghost" onClick={() => requestSort('title')} className="-ml-4 h-8 data-[state=open]:bg-accent font-semibold" style={{ fontSize: "14px", letterSpacing: "0.05em" }}>
                  Job Title <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead style={{ paddingLeft: "16px", paddingRight: "16px", fontSize: "14px", fontWeight: "600", letterSpacing: "0.05em", color: "var(--text-secondary)" }}>Company</TableHead>
              <TableHead style={{ paddingLeft: "16px", paddingRight: "16px", fontSize: "14px", fontWeight: "600", letterSpacing: "0.05em", color: "var(--text-secondary)" }}>Location</TableHead>
              <TableHead style={{ paddingLeft: "16px", paddingRight: "16px", fontSize: "14px", fontWeight: "600", letterSpacing: "0.05em", color: "var(--text-secondary)" }}>
                <Button variant="ghost" onClick={() => requestSort('applicants')} className="-ml-4 h-8 font-semibold" style={{ fontSize: "14px", letterSpacing: "0.05em" }}>
                  Applicants <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead style={{ paddingLeft: "16px", paddingRight: "16px", fontSize: "14px", fontWeight: "600", letterSpacing: "0.05em", color: "var(--text-secondary)" }}>Status</TableHead>
              <TableHead className="text-right" style={{ paddingRight: "24px", fontSize: "14px", fontWeight: "600", letterSpacing: "0.05em", color: "var(--text-secondary)" }}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedJobs?.map((job) => (
              <TableRow 
                key={job.id || job._id}
                className="border-b border-border/30 cursor-pointer hover:bg-secondary/40"
                style={{ height: "70px" }}
                onClick={() => onRowClick && onRowClick(job)}
              >
                <TableCell className="font-medium text-foreground" style={{ paddingLeft: "24px" }}>{job.title || job.jobTitle}</TableCell>
                <TableCell style={{ paddingLeft: "16px", paddingRight: "16px" }}>{job.company || job.postedBy?.company || "Unknown"}</TableCell>
                <TableCell style={{ paddingLeft: "16px", paddingRight: "16px" }}>{job.location || job.experienceLevel || "Remote"}</TableCell>
                <TableCell style={{ paddingLeft: "16px", paddingRight: "16px" }}>{job.applicants || job.referralsGiven || 0}</TableCell>
                <TableCell style={{ paddingLeft: "16px", paddingRight: "16px" }}>
                  <ApplicantStatusIndicator status={job.status || (job.isActive ? "Active" : "Closed")} />
                </TableCell>
                <TableCell className="text-right" style={{ paddingRight: "24px" }}>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8 text-xs font-semibold hover:bg-primary hover:text-primary-foreground border-border/60"
                    onClick={(e) => {
                      e.stopPropagation();
                      onActionClick && onActionClick(job);
                    }}
                  >
                    {actionLabel}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, jobs.length)} of {jobs.length} entries
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
});
