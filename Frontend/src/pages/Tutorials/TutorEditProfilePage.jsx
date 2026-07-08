import React from "react";
import TutorProfileView from "@/components/profile/TutorProfileView.jsx";
import { PageLayout } from "@/components/dashboard/shared/Primitives";

function TutorEditProfilePage() {
  return (
    <PageLayout className="pb-8">
      <TutorProfileView />
    </PageLayout>
  );
}

export default TutorEditProfilePage;