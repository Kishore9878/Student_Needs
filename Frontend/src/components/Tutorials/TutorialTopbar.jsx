import React from "react";
import { Link } from "react-router-dom";
import { Menu, ArrowLeft, LogOut } from "lucide-react";
import { NotificationCenter } from "@/components/ui/NotificationCenter.jsx";
import { ThemeToggle } from "@/components/ThemeToggle.jsx";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";
import { useSidebar } from "@/contexts/SidebarContext";
import { useLocation } from "react-router-dom";

/* ── Page-title map ── */
const TITLE_MAP = {
  "/tutorials/home":               "Tutorials",
  "/tutorials/find":               "Find a Tutor",
  "/tutorials/bookings":           "My Bookings",
  "/tutorials/history":            "Class History",
  "/tutorials/online-attendance":  "Online Attendance",
  "/tutorials/chat":               "Tutor Chats",
  "/tutorials/profile":            "My Profile",
  "/tutorials/profile/editProfile":"Edit Profile",
  "/tutorials/settings":           "Settings",
};

const getPageTitle = (pathname) => {
  if (TITLE_MAP[pathname]) return TITLE_MAP[pathname];
  if (pathname.startsWith("/tutorials/chat"))    return "Tutor Chats";
  if (pathname.startsWith("/tutorials/profile")) return "My Profile";
  return "Tutorials";
};

const TutorialTopbar = () => {
  const { toggleSidebar, toggleMobileMenu } = useSidebar();
  const { user, logout } = useAuth();
  const location = useLocation();

  const pageTitle = getPageTitle(location.pathname);

  const handleHamburgerClick = () => {
    if (window.innerWidth < 1024) {
      toggleMobileMenu();
    } else {
      toggleSidebar();
    }
  };

  return (
    <div className="sticky top-0 z-30 flex items-center justify-between h-[72px] px-6 bg-[var(--card-bg)]/80 backdrop-blur-md border-b border-[var(--border-color)]">

      {/* ── LEFT: hamburger + back + page title ── */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Hamburger */}
        <button
          onClick={handleHamburgerClick}
          className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors rounded-[var(--radius-sm)] shrink-0 cursor-pointer"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5 text-foreground" />
        </button>

        {/* Back to Dashboard */}
        <Link
          to="/student/dashboard"
          className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-sm)] text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors text-sm font-medium shrink-0"
          aria-label="Back to Dashboard"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back to Dashboard</span>
        </Link>

        {/* Page title */}
        <h1 className="text-lg font-sans font-semibold text-foreground tracking-tight truncate">
          {pageTitle}
        </h1>
      </div>

      {/* ── RIGHT: theme + notifications + user ── */}
      <div className="flex items-center gap-4">
        {/* Theme toggle */}
        <ThemeToggle className="border-border/60" />

        {/* Notifications */}
        <div className="relative notification-container flex items-center justify-center">
          <NotificationCenter />
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-border/20 hidden sm:block" />

        {/* User profile */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-xs font-bold text-foreground">
              {user?.name || user?.username || "Student"}
            </p>
            <Link
              to="/tutorials/settings"
              className="text-[10px] font-semibold text-[var(--primary)] hover:underline transition-colors"
            >
              Profile &amp; Settings
            </Link>
          </div>

          {/* Avatar */}
          <Link
            to="/tutorials/settings"
            className="w-10 h-10 rounded-[var(--radius-sm)] bg-gradient-to-tr from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-white font-bold text-lg shadow-[var(--shadow-lg)] shadow-[var(--primary)]/20 hover:scale-105 transition-transform duration-200 cursor-pointer border border-[var(--border-color)] shrink-0"
          >
            {(
              user?.name?.charAt(0) ||
              user?.username?.charAt(0) ||
              user?.fullName?.charAt(0) ||
              "S"
            ).toUpperCase()}
          </Link>

          {/* Logout */}
          <button
            onClick={() => logout()}
            className="ml-1 p-2 text-muted-foreground hover:text-[var(--danger,#ef4444)] transition-colors rounded-[var(--radius-sm)] group hidden sm:block cursor-pointer"
            title="Log out"
            aria-label="Log out"
          >
            <LogOut className="w-[22px] h-[22px] group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorialTopbar;
