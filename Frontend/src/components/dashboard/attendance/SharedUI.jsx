import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { PageLayout, PremiumCard } from "@/components/dashboard/shared/Primitives";

export function AttendancePageLayout({ children, className = "" }) {
  return (
    <PageLayout className={`pb-12 ${className}`}>
      <div className="max-w-[1200px] mx-auto w-full space-y-6">
        {children}
      </div>
    </PageLayout>
  );
}

export function AttendancePageHeader({ 
  icon: Icon, 
  title, 
  description, 
  backLink = "/tutorials/attendance", 
  backText = "Back to Attendance Hub", 
  action 
}) {
  return (
    <div className="pt-6 pb-8">
      <Link
        to={backLink}
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        {backText}
      </Link>
      
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex items-start gap-4 max-w-[650px]">
          {Icon && (
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 hidden sm:flex">
              <Icon className="w-6 h-6" />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="text-muted-foreground mt-2 text-base">
              {description}
            </p>
          </div>
        </div>
        
        {action && (
          <div className="shrink-0 w-full md:w-auto">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}

export function AttendanceSectionCard({ title, icon: Icon, children, className = "", action, noPadding = false }) {
  return (
    <PremiumCard className={`${noPadding ? 'p-0' : 'p-6'} ${className}`}>
      {(title || action) && (
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${noPadding ? 'p-6 border-b border-border/50 bg-secondary/10' : 'mb-6'}`}>
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Icon className="w-5 h-5" />
              </div>
            )}
            {title && (
              <h3 className="text-xl font-bold text-foreground">{title}</h3>
            )}
          </div>
          {action && (
            <div className="shrink-0 w-full sm:w-auto">
              {action}
            </div>
          )}
        </div>
      )}
      {children}
    </PremiumCard>
  );
}

export function AttendanceFilterCard({ title, icon: Icon, children }) {
  return (
    <PremiumCard className="p-6">
      {(title || Icon) && (
        <div className="flex items-center gap-3 mb-6">
          {Icon && (
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Icon className="w-5 h-5" />
            </div>
          )}
          {title && (
            <div>
              <h3 className="text-xl font-bold text-foreground">{title}</h3>
            </div>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-secondary/10 p-5 rounded-2xl border border-border/50">
        {children}
      </div>
    </PremiumCard>
  );
}

export function AttendanceStatCard({ title, value, icon: Icon, colorClass = "text-primary bg-primary/10" }) {
  return (
    <PremiumCard className="p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
      {Icon && (
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
      <div>
        <p className="text-sm font-semibold text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold text-foreground mt-0.5">{value}</p>
      </div>
    </PremiumCard>
  );
}

export function AttendanceEmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="w-full flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl border border-dashed border-border bg-secondary/5">
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center text-muted-foreground mb-4">
          <Icon className="w-8 h-8" />
        </div>
      )}
      <h3 className="text-lg font-bold text-foreground mb-2 whitespace-nowrap">{title}</h3>
      <p className="text-muted-foreground mb-6 min-w-[250px] max-w-[400px] whitespace-normal">{description}</p>
      {action && <div className="w-full sm:w-auto">{action}</div>}
    </div>
  );
}

export function AttendanceAlert({ title, description, icon: Icon = AlertCircle, action, type = "warning" }) {
  const styles = {
    warning: "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400",
    info: "bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400",
    error: "bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400",
    success: "bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400"
  };

  return (
    <div className={`mt-4 p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${styles[type]}`}>
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 shrink-0 mt-0.5 sm:mt-0" />
        <div>
          <h4 className="font-semibold text-sm">{title}</h4>
          {description && (
            <div className="text-sm opacity-90 mt-0.5">
              {description}
            </div>
          )}
        </div>
      </div>
      {action && (
        <div className="shrink-0 w-full sm:w-auto">
          {action}
        </div>
      )}
    </div>
  );
}
