import React, { useState } from "react";
import { Search, MessagesSquare, Briefcase, FileText, ImageIcon, Users } from "lucide-react";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";
import { cn } from "@/lib/Referrals/utils.js";

export function ConversationList({
  chats,
  activeChatId,
  onSelectChat,
  onlineUsersList
}) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const currentRole = (user?.role || user?.accountType || "student").toLowerCase();

  const filteredChats = chats.filter((chat) => {
    const participant = currentRole === "alumni" ? chat.student : chat.alumni;
    if (!participant) return false;
    const fullName = `${participant.firstName || ""} ${participant.lastName || ""}`.toLowerCase();
    const company = (participant.company || "").toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || company.includes(query);
  });

  const formatTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return date.toLocaleDateString([], { weekday: "short" });
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const renderLastMessage = (msg) => {
    if (!msg) return "No messages yet";
    if (msg.isDeleted) return "This message was deleted";
    if (msg.file) {
      const isImg = msg.file.type?.startsWith("image/");
      return isImg ? "📷 Image" : `📎 ${msg.file.name}`;
    }
    return msg.text || "";
  };

  const totalUnread = chats.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  return (
    <div className="w-full h-full flex flex-col select-none" style={{ background: "var(--card-bg)" }}>

      {/* ── Header ── */}
      <div style={{ padding: "16px 16px 0", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "10px",
              background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.22)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <MessagesSquare size={16} style={{ color: "#6366f1" }} />
            </div>
            <div>
              <h2 style={{ fontSize: "15px", fontWeight: "800", color: "var(--text-primary)", margin: 0, letterSpacing: "-0.01em" }}>
                Messages
              </h2>
              {totalUnread > 0 && (
                <p style={{ fontSize: "10px", color: "var(--text-muted)", margin: 0 }}>
                  {totalUnread} unread
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Search */}
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          background: "rgba(0,0,0,0.04)",
          border: "1px solid var(--border-color)",
          borderRadius: "10px", padding: "0 10px", marginBottom: "12px",
        }}>
          <Search size={14} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              flex: 1, border: "none", background: "transparent",
              fontSize: "13px", color: "var(--text-primary)", outline: "none",
              padding: "9px 0",
            }}
          />
        </div>
      </div>

      {/* ── List ── */}
      <div className="flex-1 overflow-y-auto scrollbar-hide" style={{ padding: "4px 8px 8px" }}>
        {filteredChats.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-muted)" }}>
            <Users size={32} style={{ margin: "0 auto 12px", opacity: 0.35 }} />
            <p style={{ fontSize: "13px", fontWeight: "600", margin: "0 0 4px" }}>No conversations</p>
            <p style={{ fontSize: "11px", margin: 0, opacity: 0.7 }}>
              {searchQuery ? "No results for your search" : "Apply for a referral to start chatting"}
            </p>
          </div>
        ) : (
          filteredChats.map((chat) => {
            const participant = currentRole === "alumni" ? chat.student : chat.alumni;
            if (!participant) return null;

            const isActive = chat._id === activeChatId;
            const hasUnread = chat.unreadCount > 0;
            const isOnline = onlineUsersList?.has?.(participant._id?.toString()) || participant.isOnline;
            const initials = `${participant.firstName?.[0] || ""}${participant.lastName?.[0] || ""}`.toUpperCase();
            const lastMsgText = renderLastMessage(chat.lastMessage);

            return (
              <div
                key={chat._id}
                onClick={() => onSelectChat(chat)}
                className="group"
                style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "10px 10px", borderRadius: "12px", cursor: "pointer",
                  background: isActive ? "rgba(99,102,241,0.08)" : "transparent",
                  border: `1px solid ${isActive ? "rgba(99,102,241,0.2)" : "transparent"}`,
                  marginBottom: "2px", transition: "all 0.15s ease",
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(0,0,0,0.04)"; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
              >
                {/* Avatar */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div style={{
                    width: "44px", height: "44px", borderRadius: "12px",
                    background: isActive
                      ? "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.2))"
                      : "rgba(99,102,241,0.08)",
                    border: `1.5px solid ${isActive ? "rgba(99,102,241,0.3)" : "var(--border-color)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "14px", fontWeight: "800", color: isActive ? "#6366f1" : "var(--text-secondary)",
                    overflow: "hidden", transition: "all 0.15s ease",
                  }}>
                    {participant.image ? (
                      <img src={participant.image} alt={`${participant.firstName}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <span>{initials}</span>
                    )}
                  </div>
                  {isOnline && (
                    <div style={{
                      position: "absolute", bottom: "-1px", right: "-1px",
                      width: "12px", height: "12px", borderRadius: "50%",
                      background: "#10b981", border: "2px solid var(--card-bg)",
                    }} />
                  )}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "4px", marginBottom: "2px" }}>
                    <span style={{
                      fontSize: "13px", fontWeight: hasUnread ? "800" : "600",
                      color: "var(--text-primary)", overflow: "hidden",
                      textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "140px",
                    }}>
                      {participant.firstName} {participant.lastName}
                    </span>
                    <span style={{ fontSize: "10px", color: "var(--text-muted)", flexShrink: 0 }}>
                      {formatTime(chat.lastMessage?.createdAt || chat.updatedAt)}
                    </span>
                  </div>

                  {/* Role/Company subtitle */}
                  <span style={{
                    fontSize: "10px", color: "#6366f1", fontWeight: "600",
                    display: "block", marginBottom: "2px", opacity: 0.85,
                  }}>
                    {currentRole === "student"
                      ? `Alumni${participant.company ? ` · ${participant.company}` : ""}`
                      : `Student${participant.branch ? ` · ${participant.branch}` : ""}`
                    }
                  </span>

                  {/* Last message + unread */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "4px" }}>
                    <p style={{
                      fontSize: "11px", margin: 0,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      color: hasUnread ? "var(--text-primary)" : "var(--text-muted)",
                      fontWeight: hasUnread ? "600" : "400", flex: 1,
                    }}>
                      {lastMsgText}
                    </p>
                    {hasUnread && (
                      <span style={{
                        minWidth: "18px", height: "18px", borderRadius: "999px",
                        background: "#6366f1", color: "#fff",
                        fontSize: "10px", fontWeight: "800",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        padding: "0 4px", flexShrink: 0,
                      }}>
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
