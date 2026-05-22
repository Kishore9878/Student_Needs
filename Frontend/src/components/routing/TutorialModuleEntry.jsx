import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";
import DashboardSkeleton from "@/components/ui/DashboardSkeleton";
import { resolveTutorialEntryPath } from "@/utils/tutorialRoutes";

/** Legacy alias: /student/tutorials → module home */
const TutorialModuleEntry = () => {
  const { isAuthenticated, isStudent, isTutor, isLoading, isInitialized, user } =
    useAuth();

  if (!isInitialized || isLoading) {
    return (
      <div className="flex justify-center pt-20">
        <DashboardSkeleton />
      </div>
    );
  }

  const target = resolveTutorialEntryPath({
    isAuthenticated,
    isStudent,
    isTutor,
    role: user?.role || user?.accountType,
  });

  return <Navigate to={target} />;
};

export default TutorialModuleEntry;
