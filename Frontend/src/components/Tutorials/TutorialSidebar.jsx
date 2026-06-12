import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  Search, CalendarClock, History, ClipboardList, 
  MessageSquare, User, Settings, LogOut, ArrowLeft,
  ChevronLeft, ChevronRight, Home, GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/GlobalAuthContext";
import { useSidebar } from "@/contexts/SidebarContext";

const NAV_ITEMS = [
  { label: "Home", path: "/tutorials/home", icon: Home },
  { label: "Find Tutor", path: "/tutorials/find", icon: Search },
  { label: "My Bookings", path: "/tutorials/bookings", icon: CalendarClock },
  { label: "Class History", path: "/tutorials/history", icon: History },
  { label: "Online Attendance", path: "/tutorials/online-attendance", icon: ClipboardList },
  { label: "Tutor Chats", path: "/tutorials/chat", icon: MessageSquare },
  { label: "My Profile", path: "/tutorials/profile", icon: User },
  { label: "Settings", path: "/tutorials/settings", icon: Settings },
];

const TutorialSidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { isCollapsed, setIsCollapsed, closeMobileMenu } = useSidebar();

  return (
    <div className="flex flex-col h-full w-full bg-card">
      {/* Brand / Logo */}
      <div className="h-16 flex items-center px-4 border-b border-border shrink-0">
        <div className="flex items-center gap-3 overflow-hidden w-full">
          <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-sm">
            <GraduationCap className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <span className="font-bold text-lg whitespace-nowrap tracking-tight animate-fade-in">
              UniConnect <span className="text-primary font-black">Tutorials</span>
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 space-y-1 px-3">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={closeMobileMenu}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200
              ${isActive ? "bg-primary text-primary-foreground font-medium shadow-sm" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}
              ${isCollapsed ? "justify-center" : ""}
            `}
            title={isCollapsed ? item.label : undefined}
          >
            <item.icon className={`w-5 h-5 flex-shrink-0 ${isCollapsed ? "mx-auto" : ""}`} />
            {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
          </NavLink>
        ))}
      </div>

      <div className="p-3 border-t space-y-1 shrink-0 bg-card/50">
        <button
          onClick={() => {
            navigate("/student/dashboard");
            closeMobileMenu();
          }}
          className={`flex items-center gap-3 px-3 py-2.5 w-full rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-200 ${isCollapsed ? "justify-center" : ""}`}
          title={isCollapsed ? "Back to Dashboard" : undefined}
        >
          <ArrowLeft className={`w-5 h-5 flex-shrink-0 ${isCollapsed ? "mx-auto" : ""}`} />
          {!isCollapsed && <span className="whitespace-nowrap">Back to Dashboard</span>}
        </button>
        
        <button
          onClick={() => {
            if (logout) {
              logout();
            } else {
              navigate("/login");
            }
          }}
          className={`flex items-center gap-3 px-3 py-2.5 w-full rounded-md text-red-500 hover:bg-red-500/10 transition-all duration-200 ${isCollapsed ? "justify-center" : ""}`}
          title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut className={`w-5 h-5 flex-shrink-0 ${isCollapsed ? "mx-auto" : ""}`} />
          {!isCollapsed && <span className="whitespace-nowrap">Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle (Desktop only) */}
      <div className="hidden md:flex p-2 border-t shrink-0">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full flex justify-center text-muted-foreground hover:bg-secondary"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </Button>
      </div>
    </div>
  );
};

export default TutorialSidebar;
