import React, { useContext } from "react";
import Navbar from "../../components/Tutorials/Navbar";
import SideNav from "@/components/Tutorials/SideNav";
import Profile from "../../components/Tutorials/Profile";
import { LayoutContext } from "@/components/layouts/DashboardLayout";
import BackToStudentDashboard from "@/components/dashboard/BackToStudentDashboard";

function ProfilePage() {
  const isUnifiedLayout = useContext(LayoutContext);

  return (
    <>
      {!isUnifiedLayout && <Navbar />}
      {isUnifiedLayout && <BackToStudentDashboard />}

      <div
        className="flex"
        style={{
          paddingTop: isUnifiedLayout ? "0" : "100px",
          minHeight: "100vh",
        }}
      >
        <SideNav />
        <Profile />
      </div>
    </>
  );
}

export default ProfilePage;