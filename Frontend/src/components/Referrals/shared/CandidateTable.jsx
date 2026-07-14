import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Button } from "@/components/ui/button.jsx";
import { getReferralStatus } from "@/utils/Referrals/helpers.js";
import { getInterviewStage } from "@/utils/Referrals/interviewStages.js";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Briefcase,
  User,
  ExternalLink,
  Inbox
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip.jsx";

export function CandidateTable({
  candidates = [],
  onActionClick,
  actionLabel = "View",
  emptyMessage = "No candidates or applications found"
}) {
  const getStatusIcon = (variant) => {
    switch (variant) {
      case "clock": return <Clock className="w-3 h-3 mr-1" />;
      case "check": return <CheckCircle className="w-3 h-3 mr-1" />;
      case "x": return <XCircle className="w-3 h-3 mr-1" />;
      case "alert": return <AlertCircle className="w-3 h-3 mr-1" />;
      default: return null;
    }
  };

  return (
    <div className="border border-border/50 overflow-hidden bg-card shadow-sm" style={{ borderRadius: "16px", maxHeight: "360px", overflowY: "auto" }}>
      <Table>
        <TableHeader className="sticky top-0 bg-card z-10 border-b border-border/40">
          <TableRow className="border-b border-border/40 hover:bg-transparent bg-slate-50/50 dark:bg-slate-900/30" style={{ height: "60px" }}>
            <TableHead style={{ paddingLeft: "24px", fontSize: "14px", fontWeight: "600", letterSpacing: "0.05em", color: "var(--text-secondary)" }} className="align-middle text-left">
              Candidate
            </TableHead>
            <TableHead style={{ paddingLeft: "16px", paddingRight: "16px", fontSize: "14px", fontWeight: "600", letterSpacing: "0.05em", color: "var(--text-secondary)" }} className="align-middle text-left">
              Company
            </TableHead>
            <TableHead style={{ paddingLeft: "16px", paddingRight: "16px", fontSize: "14px", fontWeight: "600", letterSpacing: "0.05em", color: "var(--text-secondary)" }} className="align-middle text-left">
              Role
            </TableHead>
            <TableHead style={{ paddingLeft: "16px", paddingRight: "16px", fontSize: "14px", fontWeight: "600", letterSpacing: "0.05em", color: "var(--text-secondary)" }} className="align-middle text-left">
              Status
            </TableHead>
            <TableHead style={{ paddingLeft: "16px", paddingRight: "16px", fontSize: "14px", fontWeight: "600", letterSpacing: "0.05em", color: "var(--text-secondary)" }} className="align-middle text-left">
              Interview Stage
            </TableHead>
            <TableHead style={{ paddingRight: "24px", fontSize: "14px", fontWeight: "600", letterSpacing: "0.05em", color: "var(--text-secondary)" }} className="text-right align-middle">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={6} className="p-0">
                <div className="flex flex-col items-center justify-center gap-4 text-center py-10 text-muted-foreground" style={{ minHeight: "220px" }}>
                  <Inbox className="w-10 h-10 text-slate-400 dark:text-slate-500 shrink-0" />
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{emptyMessage}</span>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            candidates?.map((candidate, idx) => {
              const studentName = candidate.studentName || 
                (candidate.student ? `${candidate.student.firstName || ""} ${candidate.student.lastName || ""}` : "") || 
                candidate.name || "Candidate";
              
              const companyName = candidate.company || 
                candidate.companyName || 
                candidate.postedBy?.company || 
                candidate.opportunity?.postedBy?.company || 
                "Unknown Company";

              const roleTitle = candidate.role || 
                candidate.jobTitle || 
                candidate.opportunity?.jobTitle || 
                "Role Not Specified";

              const rawStatus = candidate.status || 
                (candidate.isActive ? "Active" : "Pending");
              
              const statusInfo = getReferralStatus(rawStatus);

              const rawStage = candidate.stage || 
                candidate.interviewStage || 
                "resume_screen";
              
              const stageInfo = getInterviewStage(rawStage);

              return (
                <TableRow
                  key={candidate._id || candidate.id || idx}
                  className="border-b border-border/30 hover:bg-secondary/20 transition-colors"
                  style={{ height: "70px" }}
                >
                  <TableCell className="font-medium text-foreground align-middle text-left" style={{ paddingLeft: "24px" }}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold uppercase flex-shrink-0">
                        {studentName[0] || "C"}
                      </div>
                      <span className="font-semibold text-foreground/90 text-sm truncate max-w-[150px]" title={studentName}>
                        {studentName}
                      </span>
                    </div>
                  </TableCell>
                  
                  <TableCell className="align-middle text-left" style={{ paddingLeft: "16px", paddingRight: "16px" }}>
                    <span className="truncate max-w-[150px] block text-muted-foreground font-medium text-sm" title={companyName}>
                      {companyName}
                    </span>
                  </TableCell>

                  <TableCell className="align-middle text-left" style={{ paddingLeft: "16px", paddingRight: "16px" }}>
                    <span className="truncate max-w-[180px] block font-medium text-foreground/90 text-sm" title={roleTitle}>
                      {roleTitle}
                    </span>
                  </TableCell>

                  <TableCell className="align-middle text-left" style={{ paddingLeft: "16px", paddingRight: "16px" }}>
                    <Badge 
                      variant={statusInfo.badgeVariant} 
                      className="inline-flex items-center capitalize font-semibold tracking-wide text-[10px] px-2 py-0.5 rounded-[var(--radius-sm)]"
                    >
                      {getStatusIcon(statusInfo.iconVariant)}
                      {statusInfo.label}
                    </Badge>
                  </TableCell>

                  <TableCell className="align-middle text-left" style={{ paddingLeft: "16px", paddingRight: "16px" }}>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Badge 
                              variant={stageInfo.badgeVariant} 
                              className="font-medium text-[10px] px-2 py-0.5 rounded-[var(--radius-sm)]"
                            >
                              {stageInfo.label}
                            </Badge>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Interview stage: Step {stageInfo.order} of 6</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>

                  <TableCell className="text-right align-middle" style={{ paddingRight: "24px" }}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs font-semibold hover:bg-primary hover:text-primary-foreground border-border/60"
                      onClick={() => onActionClick && onActionClick(candidate)}
                    >
                      {actionLabel}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
