import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Explicit return to unified student dashboard (preserves browser history).
 */
const BackToStudentDashboard = ({ className, label = "Back to Dashboard" }) => (
  <Link
    to="/student/dashboard"
    className={cn(
      "inline-flex items-center gap-2 text-sm font-medium text-muted-foreground",
      "hover:text-primary transition-colors mb-4",
      className,
    )}
  >
    <ArrowLeft className="w-4 h-4" />
    {label}
  </Link>
);

export default BackToStudentDashboard;
