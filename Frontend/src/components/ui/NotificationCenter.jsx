import React, { useState, useEffect, useRef } from "react";
import { Bell, Check, Loader2 } from "lucide-react";
import { apiClient } from "@/services/apiClient";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useNavigate } from "react-router-dom";

export const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { isConnected, on } = useWebSocket();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/api/notifications?limit=10");
      if (res.data?.success) {
        setNotifications(res.data.data.notifications);
        setUnreadCount(res.data.data.unreadCount);
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Listen to real-time incoming notifications
    on("notification", (newNotification) => {
      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    // Polling fallback every 3 minutes if WebSocket is disconnected and tab is visible
    let interval;
    if (!isConnected) {
      interval = setInterval(() => {
        if (document.visibilityState === 'visible') {
          fetchNotifications();
        }
      }, 180000);
    }
    
    return () => clearInterval(interval);
  }, [isConnected]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id, link) => {
    try {
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      
      await apiClient.put(`/api/notifications/${id}/read`);
      
      if (link) {
        setIsOpen(false);
        navigate(link);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      await apiClient.put("/api/notifications/read-all");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full text-muted-foreground hover:bg-secondary relative transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-[var(--shadow-sm)] animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div style={{
          position: "absolute", right: 0, top: "40px",
          width: "360px",
          background: "var(--card-bg)",
          border: "1px solid var(--border-color)",
          borderRadius: "16px",
          boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
          overflow: "hidden", zIndex: 50,
          display: "flex", flexDirection: "column",
          animation: "fadeIn 0.2s ease"
        }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "16px", borderBottom: "1px solid var(--border-color)",
            background: "var(--bg-secondary, rgba(0,0,0,0.02))"
          }}>
            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "var(--text-primary)", margin: 0, letterSpacing: "-0.01em" }}>Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                style={{
                  fontSize: "12px", display: "flex", alignItems: "center", gap: "4px",
                  color: "#3b82f6", background: "none", border: "none", cursor: "pointer", fontWeight: "600"
                }}
              >
                <Check size={14} /> Mark all read
              </button>
            )}
          </div>

          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            {loading && notifications.length === 0 ? (
              <div style={{ display: "flex", alignItems: "center", justifyCenter: "center", padding: "40px" }}>
                <Loader2 size={24} style={{ animation: "spin 1s linear infinite", color: "var(--text-muted)", margin: "0 auto" }} />
              </div>
            ) : notifications.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", textAlign: "center", color: "var(--text-muted)" }}>
                <Bell size={32} style={{ marginBottom: "8px", opacity: 0.2 }} />
                <p style={{ fontSize: "13px", margin: 0, fontWeight: "500" }}>No new notifications</p>
              </div>
            ) : (
              <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {notifications.map((notif) => (
                  <li
                    key={notif._id}
                    onClick={() => handleMarkAsRead(notif._id, notif.link)}
                    style={{
                      padding: "16px", cursor: "pointer",
                      borderBottom: "1px solid var(--border-color)",
                      background: !notif.isRead ? "rgba(59,130,246,0.04)" : "transparent",
                      transition: "background 0.15s ease",
                      display: "flex", gap: "12px", alignItems: "flex-start"
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = !notif.isRead ? "rgba(59,130,246,0.08)" : "var(--bg-secondary, rgba(0,0,0,0.02))"}
                    onMouseLeave={e => e.currentTarget.style.background = !notif.isRead ? "rgba(59,130,246,0.04)" : "transparent"}
                  >
                    {!notif.isRead ? (
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#3b82f6", marginTop: "6px", flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: "8px", height: "8px", flexShrink: 0 }} />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontSize: "13.5px", fontWeight: !notif.isRead ? "700" : "600",
                        color: !notif.isRead ? "var(--text-primary)" : "var(--text-secondary)",
                        margin: "0 0 4px", lineHeight: "1.3"
                      }}>
                        {notif.title}
                      </p>
                      <p style={{ fontSize: "12.5px", color: "var(--text-muted)", margin: "0 0 8px", lineHeight: "1.4" }}>
                        {notif.message}
                      </p>
                      <p style={{ fontSize: "10.5px", color: "var(--text-muted)", margin: 0, opacity: 0.8, fontWeight: "500" }}>
                        {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div style={{ padding: "12px", borderTop: "1px solid var(--border-color)", background: "var(--bg-secondary, rgba(0,0,0,0.02))", textAlign: "center" }}>
            <button 
              style={{ fontSize: "12px", color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", fontWeight: "600" }}
              onClick={() => setIsOpen(false)}
              onMouseEnter={e => e.currentTarget.style.color = "var(--text-primary)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
