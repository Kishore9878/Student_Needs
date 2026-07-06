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
    <div className="rounded-[var(--radius-lg)] border border-border/50 overflow-hidden bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border/40 hover:bg-transparent bg-slate-50/50 dark:bg-slate-900/30">
            <TableHead className="font-semibold text-xs tracking-wider uppercase text-muted-foreground pl-7 py-5 align-middle h-14 text-left">
              Candidate
            </TableHead>
            <TableHead className="font-semibold text-xs tracking-wider uppercase text-muted-foreground py-5 align-middle h-14 text-left">
              Company
            </TableHead>
            <TableHead className="font-semibold text-xs tracking-wider uppercase text-muted-foreground py-5 align-middle h-14 text-left">
              Role
            </TableHead>
            <TableHead className="font-semibold text-xs tracking-wider uppercase text-muted-foreground py-5 align-middle h-14 text-left">
              Status
            </TableHead>
            <TableHead className="font-semibold text-xs tracking-wider uppercase text-muted-foreground py-5 align-middle h-14 text-left">
              Interview Stage
            </TableHead>
            <TableHead className="text-right font-semibold text-xs tracking-wider uppercase text-muted-foreground pr-7 py-5 align-middle h-14">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={6} className="p-0">
                <div className="flex flex-col items-center justify-center gap-4 text-center py-10 text-muted-foreground" style={{ minHeight: "170px" }}>
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
                >
                  <TableCell className="font-medium text-foreground py-3 pl-7 align-middle text-left">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold uppercase">
                        {studentName[0] || "C"}
                      </div>
                      <span className="truncate max-w-[150px]" title={studentName}>
                        {studentName}
                      </span>
                    </div>
                  </TableCell>
                  
                  <TableCell className="py-3 align-middle text-muted-foreground font-medium text-sm text-left">
                    <span className="truncate max-w-[150px] block" title={companyName}>
                      {companyName}
                    </span>
                  </TableCell>

                  <TableCell className="py-3 align-middle text-muted-foreground text-sm text-left">
                    <span className="truncate max-w-[180px] block font-medium text-foreground/90" title={roleTitle}>
                      {roleTitle}
                    </span>
                  </TableCell>

                  <TableCell className="py-3 align-middle text-left">
                    <Badge 
                      variant={statusInfo.badgeVariant} 
                      className="inline-flex items-center capitalize font-semibold tracking-wide text-[10px] px-2 py-0.5 rounded-[var(--radius-sm)]"
                    >
                      {getStatusIcon(statusInfo.iconVariant)}
                      {statusInfo.label}
                    </Badge>
                  </TableCell>

                  <TableCell className="py-3 align-middle text-left">
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

                  <TableCell className="text-right py-3 pr-7 align-middle">
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
