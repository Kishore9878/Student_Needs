import React, { Suspense } from "react";
import GlobalProtectedRoute from "@/components/GlobalProtectedRoute.jsx";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import DashboardSkeleton from "@/components/ui/DashboardSkeleton";

const Dashboard = React.lazy(() => import("@/pages/Attendance/Dashboard"));

const WithLayout = ({ title, children }) => (
  <DashboardLayout pageTitle={title}>{children}</DashboardLayout>
);

/** Teacher-only: /attendance/dashboard. Students use /student/attendance. */
const AttendanceDashboardRoute = () => (
  <GlobalProtectedRoute allowedRoles={["teacher"]}>
    <WithLayout title="Dashboard">
      <Suspense fallback={<DashboardSkeleton />}>
        <Dashboard />
      </Suspense>
    </WithLayout>
  </GlobalProtectedRoute>
);

export default AttendanceDashboardRoute;
