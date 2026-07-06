import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";
import { useSidebar } from "@/contexts/SidebarContext";
import { useWebSocket } from "@/hooks/useWebSocket.js";
import { chatApi } from "@/services/Referrals/chat.js";
import { opportunitiesApi } from "@/services/Referrals/opportunities.js";
import {
  Briefcase,
  Users,
  FileText,
  MessageSquare,
  Settings,
  ChevronRight,
  ArrowLeft,
  LogOut,
  User,
} from "lucide-react";

const ReferralsSidebar = ({ className }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { isCollapsed, toggleSidebar, closeMobileMenu } = useSidebar();
  const { isConnected, on, off } = useWebSocket();

  const [unreadChatsCount, setUnreadChatsCount] = useState(0);
  const [appliedCount, setAppliedCount] = useState(0);

  const displayName = user?.name || user?.fullName || user?.username || "User";
  const currentRole = (
    user?.role ||
    user?.accountType ||
    "student"
  ).toLowerCase();

  // Fetch unread chats count and listen to WebSocket message events
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    const fetchUnreadCount = async () => {
      try {
        const response = await chatApi.getChats();
        if (response.success && Array.isArray(response.data)) {
          const count = response.data.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0);
          setUnreadChatsCount(count);
        }
      } catch (error) {
        console.error('Error fetching unread chats count:', error);
      }
    };

    fetchUnreadCount();

    const handleNewMessage = () => {
      fetchUnreadCount();
    };

    on('message', handleNewMessage);

    const interval = setInterval(fetchUnreadCount, 10000);

    // Custom event listener for real-time updates from ChatPage
    const handleUnreadCountChange = (e) => {
      if (e.detail && typeof e.detail.count === 'number') {
        setUnreadChatsCount(e.detail.count);
      }
    };
    window.addEventListener("chat_unread_count_changed", handleUnreadCountChange);

    return () => {
      off('message', handleNewMessage);
      clearInterval(interval);
      window.removeEventListener("chat_unread_count_changed", handleUnreadCountChange);
    };
  }, [isConnected, on, off]);

  // Fetch applied jobs count and listen to new applications
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    const fetchAppliedCount = async () => {
      try {
        const response = await opportunitiesApi.getMyApplications();
        if (response.success && response.data) {
          setAppliedCount(response.data.applications?.length || 0);
        }
      } catch (error) {
        console.error('Error fetching applied count:', error);
      }
    };

    fetchAppliedCount();
    const interval = setInterval(fetchAppliedCount, 10000);

    const handleApplied = () => {
      fetchAppliedCount();
    };
    window.addEventListener("opportunity_applied", handleApplied);

    return () => {
      clearInterval(interval);
      window.removeEventListener("opportunity_applied", handleApplied);
    };
  }, []);

  const links = [
    {
      name: "Browse Referrals",
      href: "/referrals/browse-referrals",
      icon: Users,
    },
    {
      name: "Browse Jobs",
      href: "/referrals/browse-jobs",
      icon: Briefcase,
    },
    {
      name: "My Applications",
      href: "/referrals/applied-jobs",
      icon: FileText,
      badge: appliedCount > 0 ? appliedCount : null,
    },
    {
      name: "Chats",
      href: "/referrals/chat",
      icon: MessageSquare,
      badge: unreadChatsCount > 0 ? unreadChatsCount : null,
      badgeColor: "bg-red-500 text-white animate-pulse",
    },
    {
      name: "My Profile",
      href: "/referrals/profile",
      icon: User,
    },
    {
      name: "Settings",
      href: "/student/settings",
      icon: Settings,
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-[var(--card-bg)] select-none sidebar-transition border-r border-[var(--border-color)]",
        isCollapsed ? "px-2.5" : "",
        className
      )}
    >
      {/* Branding Logo & Header */}
      <div className={cn(
        "flex items-center gap-3 h-[72px] border-b border-[var(--border-color)] px-6 shrink-0 mb-4",
        isCollapsed ? "justify-center px-4" : ""
      )}>
        <h1 className="text-base font-bold font-sans tracking-wider text-[var(--text-primary)]">
          {isCollapsed ? (
            <span className="text-[var(--primary)] font-black">R<span className="text-[var(--text-primary)]">e</span></span>
          ) : (
            <span className="text-[var(--primary)]">Referrals</span>
          )}
        </h1>
      </div>

      {/* Navigation Links */}
      <nav className={cn(
        "flex flex-col flex-1 overflow-y-auto overflow-x-hidden px-3 space-y-1.5",
        isCollapsed ? "items-center py-4 gap-3" : ""
      )}>
        {/* Back to Dashboard */}
        <Link
          to="/student/dashboard"
          onClick={closeMobileMenu}
          className={cn(
            "group relative flex items-center transition-all duration-200 cursor-pointer w-full mb-4",
            isCollapsed 
              ? "w-10 h-10 justify-center rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]" 
              : "gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
          )}
        >
          <div className="flex-shrink-0 transition-transform group-hover:-translate-x-0.5 duration-200">
            <ArrowLeft className="w-5 h-5" />
          </div>
          {!isCollapsed && <span>Back to Dashboard</span>}
          {isCollapsed && (
            <div className="absolute left-14 scale-0 rounded-[var(--radius-sm)] px-2 py-1 bg-[var(--card-bg)] text-[var(--text-primary)] border border-[var(--border-color)] text-xs font-semibold shadow-[var(--shadow-md)] transition-all group-hover:scale-100 whitespace-nowrap z-50 pointer-events-none">
              Back to Dashboard
            </div>
          )}
        </Link>

        {links.map((link) => {
          const isActive = location.pathname === link.href;
          const Icon = link.icon;

          return (
            <Link
              key={link.name}
              to={link.href}
              onClick={closeMobileMenu}
              className={cn(
                "group relative flex items-center transition-all duration-200 cursor-pointer w-full",
                isCollapsed 
                  ? "w-10 h-10 justify-center rounded-lg" 
                  : "gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold",
                isActive 
                  ? "bg-[var(--accent)]/[0.08] text-[var(--accent)]" 
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-[3px] bg-[var(--accent)] rounded-r" />
              )}
              <div className={cn("flex-shrink-0 transition-transform group-hover:scale-105 duration-200", isActive ? "text-[var(--accent)]" : "text-[var(--text-muted)] group-hover:text-[var(--text-primary)]")}>
                <Icon className="w-5 h-5" />
              </div>
              {!isCollapsed && <span>{link.name}</span>}
              
              {/* Count Badge */}
              {!isCollapsed && link.badge !== null && link.badge !== undefined && (
                <span className={cn(
                  "ml-auto px-1.5 py-0.5 rounded-full text-xs font-bold shrink-0",
                  link.badgeColor || "bg-[var(--primary)]/20 text-[var(--primary)]"
                )}>
                  {link.badge}
                </span>
              )}

              {/* Collapsed Badge indicator */}
              {isCollapsed && link.badge !== null && link.badge !== undefined && (
                <span className={cn(
                  "absolute top-1 right-1 w-2.5 h-2.5 rounded-full border border-[var(--card-bg)]",
                  link.badgeColor ? "bg-red-500" : "bg-[var(--primary)]"
                )} />
              )}
              
              {/* Tooltip */}
              {isCollapsed && (
                <div className="absolute left-14 scale-0 rounded-[var(--radius-sm)] px-2 py-1 bg-[var(--card-bg)] text-[var(--text-primary)] border border-[var(--border-color)] text-xs font-semibold shadow-[var(--shadow-md)] transition-all group-hover:scale-100 whitespace-nowrap z-50 pointer-events-none">
                  {link.name}
                </div>
              )}
            </Link>
          );
        })}

        {/* Logout */}
        <button
          onClick={() => {
            if (logout) {
              logout();
            } else {
              window.location.href = "/login";
            }
          }}
          className={cn(
            "group relative flex items-center transition-all duration-200 cursor-pointer w-full text-[var(--danger)] hover:bg-[var(--danger)]/10",
            isCollapsed 
              ? "w-10 h-10 justify-center rounded-lg" 
              : "gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold"
          )}
        >
          <div className="flex-shrink-0 transition-transform group-hover:scale-105 duration-200 text-[var(--danger)]">
            <LogOut className="w-5 h-5" />
          </div>
          {!isCollapsed && <span>Logout</span>}
          {isCollapsed && (
            <div className="absolute left-14 scale-0 rounded-[var(--radius-sm)] px-2 py-1 bg-[var(--card-bg)] text-[var(--danger)] border border-[var(--border-color)] text-xs font-semibold shadow-[var(--shadow-md)] transition-all group-hover:scale-100 whitespace-nowrap z-50 pointer-events-none">
              Logout
            </div>
          )}
        </button>
      </nav>

      {/* Bottom Actions */}
      <div className={cn(
        "mt-auto border-t border-[var(--border-color)] shrink-0 flex flex-col p-3 bg-[var(--bg-primary)]/40",
        isCollapsed ? "items-center" : ""
      )}>
        {/* User Card */}
        <div className={cn(
          "flex items-center rounded-lg border border-[var(--border-color)] transition-all duration-200 overflow-hidden bg-[var(--card-bg)] shadow-sm",
          isCollapsed ? "w-10 h-10 justify-center p-0 border-none" : "gap-3 p-2.5 w-full"
        )}>
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--primary)] to-[var(--accent)] border border-[var(--border-color)] overflow-hidden flex items-center justify-center shrink-0 font-bold text-white shadow-sm">
            {user?.profilePic ? (
              <img
                src={user.profilePic}
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs uppercase font-bold">{(displayName)[0].toUpperCase()}</span>
            )}
          </div>
          
          {/* Name & Role */}
          {!isCollapsed && (
            <div className="flex-1 flex items-center justify-between min-w-0 text-left">
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-[var(--text-primary)] truncate">{displayName}</span>
                <span className="text-[10px] text-[var(--text-muted)] capitalize truncate">{currentRole}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0 ml-2" />
            </div>
          )}
        </div>

        {/* Sidebar Collapse Toggle Button */}
        <button
          onClick={toggleSidebar}
          className={cn(
            "group relative flex items-center text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-all duration-200 w-full cursor-pointer mt-2",
            isCollapsed 
              ? "w-10 h-10 justify-center rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]" 
              : "gap-3 px-3 py-2.5 rounded-lg text-xs font-bold"
          )}
          aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <svg
            className={cn("w-5 h-5 shrink-0 transform transition-transform duration-300", isCollapsed ? "rotate-180" : "")}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
          {!isCollapsed && <span className="truncate">Collapse Sidebar</span>}
          {isCollapsed && (
            <div className="absolute left-14 scale-0 rounded-[var(--radius-sm)] px-2 py-1 bg-[var(--card-bg)] text-[var(--text-primary)] border border-[var(--border-color)] text-xs font-semibold shadow-[var(--shadow-md)] transition-all group-hover:scale-100 whitespace-nowrap z-50 pointer-events-none">
              Expand
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default ReferralsSidebar;
