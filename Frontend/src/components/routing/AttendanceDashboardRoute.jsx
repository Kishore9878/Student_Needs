import React, { Suspense } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import DashboardSkeleton from "@/components/ui/DashboardSkeleton";

const Dashboard = React.lazy(() => import("@/pages/Attendance/Dashboard"));
const StudentDashboard = React.lazy(
  () => import("@/pages/Attendance/StudentDashboard"),
);

const WithLayout = ({ title, children }) => (
  <DashboardLayout pageTitle={title}>{children}</DashboardLayout>
);

/**
 * /attendance/dashboard — role-based (teacher vs student), no replace redirects.
 */
const AttendanceDashboardRoute = () => {
  const { loading, user } = useAuth();
  const role = (user?.role || user?.accountType || "").toLowerCase();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <DashboardSkeleton />
      </div>
    );
  }

  if (role === "teacher") {
    return (
      <WithLayout title="Dashboard">
        <Suspense fallback={<DashboardSkeleton />}>
          <Dashboard />
        </Suspense>
      </WithLayout>
    );
  }

  if (role === "student") {
    return (
      <WithLayout title="Attendance">
        <Suspense fallback={<DashboardSkeleton />}>
          <StudentDashboard />
        </Suspense>
      </WithLayout>
    );
  }

  return <Navigate to="/role-selection" />;
};

export default AttendanceDashboardRoute;
