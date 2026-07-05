import React, { useState } from "react";
import { Search, Archive, ArchiveRestore, Ban, CircleAlert, MoreVertical, MessageSquarePlus, MessagesSquare } from "lucide-react";
import OnlineBadge from "./OnlineBadge.jsx";
import { cn } from "@/lib/utils.js";

export const ChatSidebar = ({
  chats,
  activeChatId,
  onSelectChat,
  onlineUsersList,
  onToggleArchive,
  onToggleBlock,
  onReportChat,
}) => {
  const [search, setSearch] = useState("");
  const [filterTab, setFilterTab] = useState("active");
  const [openMenuId, setOpenMenuId] = useState(null);

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now - date;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays === 0) return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return date.toLocaleDateString([], { weekday: "short" });
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    } catch (_) { return ""; }
  };

  const handleToggleMenu = (e, chatId) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === chatId ? null : chatId);
  };

  // Deduplicate
  const deduplicatedChats = [];
  const seenPartners = new Set();
  chats.forEach((chat) => {
    const partnerId = chat.partner?._id?.toString();
    if (!partnerId) return;
    if (!seenPartners.has(partnerId)) {
      seenPartners.add(partnerId);
      deduplicatedChats.push({ ...chat });
    } else {
      const existing = deduplicatedChats.find(c => c.partner?._id?.toString() === partnerId);
      if (existing) existing.unreadCount += (chat.unreadCount || 0);
    }
  });

  const filteredChats = deduplicatedChats.filter((chat) => {
    const isArchived = !!chat.isArchived;
    const matchesTab = filterTab === "archived" ? isArchived : !isArchived;
    if (!matchesTab) return false;
    const q = search.toLowerCase();
    return (
      chat.partner?.name?.toLowerCase().includes(q) ||
      chat.partner?.email?.toLowerCase().includes(q) ||
      chat.partner?.expertise?.toLowerCase().includes(q)
    );
  });

  filteredChats.sort((a, b) => {
    if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
    if (b.unreadCount > 0 && a.unreadCount === 0) return 1;
    const dateA = a.latestAt ? new Date(a.latestAt).getTime() : 0;
    const dateB = b.latestAt ? new Date(b.latestAt).getTime() : 0;
    return dateB - dateA;
  });

  const totalUnread = deduplicatedChats.filter(c => !c.isArchived).reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  return (
    <div className="w-full h-full flex flex-col select-none relative z-10"
      style={{ background: "var(--card-bg)" }}>

      {/* ── Header ── */}
      <div style={{ padding: "16px 16px 0", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "10px",
              background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <MessagesSquare size={16} style={{ color: "#3b82f6" }} />
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
          background: "var(--bg-secondary, rgba(0,0,0,0.04))",
          border: "1px solid var(--border-color)",
          borderRadius: "10px", padding: "0 10px",
          marginBottom: "12px",
        }}>
          <Search size={14} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1, border: "none", background: "transparent",
              fontSize: "13px", color: "var(--text-primary)", outline: "none",
              padding: "9px 0",
            }}
          />
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: "flex", padding: "0 12px", borderBottom: "1px solid var(--border-color)", flexShrink: 0, gap: "4px" }}>
        {["active", "archived"].map(tab => (
          <button
            key={tab}
            onClick={() => { setFilterTab(tab); setOpenMenuId(null); }}
            style={{
              padding: "8px 12px",
              borderBottom: `2px solid ${filterTab === tab ? "var(--accent)" : "transparent"}`,
              color: filterTab === tab ? "var(--accent)" : "var(--text-muted)",
              background: "none", border: "none",
              borderBottom: `2px solid ${filterTab === tab ? "#3b82f6" : "transparent"}`,
              fontSize: "11px", fontWeight: "700", letterSpacing: "0.04em",
              textTransform: "capitalize", cursor: "pointer",
              transition: "all 0.15s ease",
              color: filterTab === tab ? "#3b82f6" : "var(--text-muted)",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Conversation List ── */}
      <div className="flex-1 overflow-y-auto scrollbar-hide" style={{ padding: "8px" }}>
        {filteredChats.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-muted)" }}>
            <MessageSquarePlus size={32} style={{ margin: "0 auto 12px", opacity: 0.4 }} />
            <p style={{ fontSize: "13px", fontWeight: "600", margin: "0 0 4px" }}>No conversations</p>
            <p style={{ fontSize: "11px", margin: 0, opacity: 0.7 }}>
              {search ? "No results for your search" : "Book a session to start chatting"}
            </p>
          </div>
        ) : (
          filteredChats.map((chat) => {
            const isActive = chat._id === activeChatId;
            const isOnline = onlineUsersList.has(chat.partner?._id?.toString());
            const hasUnread = chat.unreadCount > 0;
            const partnerName = chat.partner?.name ||
              (chat.partner?.role === "student" ? "Unknown Student" : "Unknown Tutor");
            const initials = partnerName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
            const lastMsgText = (() => {
              if (chat.lastMessage?.deleted) return "This message was deleted";
              if (chat.lastMessage?.type === "call" && chat.lastMessage?.metadata) {
                const m = chat.lastMessage.metadata;
                const icon = m.status === "missed" ? "🔴" : (m.callType === "video" ? "📹" : "📞");
                return `${icon} ${chat.lastMessage.text || "Call"}`;
              }
              return chat.lastMessage?.text || chat.lastMessage?.message ||
                (chat.lastMessage?.attachments?.length > 0 ? "📎 Attachment" : "") || "No messages yet";
            })();

            return (
              <div
                key={chat._id}
                onClick={() => { onSelectChat(chat); setOpenMenuId(null); }}
                className="group"
                style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "10px 10px",
                  borderRadius: "12px", cursor: "pointer",
                  background: isActive ? "rgba(59,130,246,0.08)" : "transparent",
                  border: `1px solid ${isActive ? "rgba(59,130,246,0.2)" : "transparent"}`,
                  marginBottom: "2px",
                  transition: "all 0.15s ease",
                  position: "relative",
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = "var(--bg-secondary, rgba(0,0,0,0.04))";
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                {/* Avatar */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div style={{
                    width: "44px", height: "44px", borderRadius: "12px",
                    background: isActive
                      ? "linear-gradient(135deg, rgba(59,130,246,0.25), rgba(99,102,241,0.2))"
                      : "rgba(59,130,246,0.08)",
                    border: `1.5px solid ${isActive ? "rgba(59,130,246,0.3)" : "var(--border-color)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "14px", fontWeight: "800",
                    color: isActive ? "#3b82f6" : "var(--text-secondary)",
                    overflow: "hidden",
                    transition: "all 0.15s ease",
                  }}>
                    {chat.partner?.pic ? (
                      <img
                        src={chat.partner.pic.startsWith("http") ? chat.partner.pic : `http://localhost:8000/uploads/${chat.partner.pic}`}
                        alt={partnerName}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
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
                      textOverflow: "ellipsis", whiteSpace: "nowrap",
                      maxWidth: "140px",
                    }}>
                      {partnerName}
                    </span>
                    <span style={{ fontSize: "10px", color: "var(--text-muted)", flexShrink: 0 }}>
                      {formatTime(chat.lastMessageTime || chat.updatedAt)}
                    </span>
                  </div>

                  <span style={{ fontSize: "10px", color: "#3b82f6", fontWeight: "600", display: "block", marginBottom: "2px", opacity: 0.8 }}>
                    {chat.partner?.role === "tutor" ? "Tutor" : "Student"}{chat.booking?.subject ? ` · ${chat.booking.subject}` : chat.partner?.expertise ? ` · ${chat.partner.expertise}` : ""}
                  </span>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "4px" }}>
                    <p style={{
                      fontSize: "11px", margin: 0,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      color: hasUnread ? "var(--text-primary)" : "var(--text-muted)",
                      fontWeight: hasUnread ? "600" : "400",
                      flex: 1,
                    }}>
                      {lastMsgText}
                    </p>
                    {hasUnread && (
                      <span style={{
                        minWidth: "18px", height: "18px", borderRadius: "999px",
                        background: "#3b82f6", color: "#fff",
                        fontSize: "10px", fontWeight: "800",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        padding: "0 4px", flexShrink: 0,
                        animation: "pulse 2s ease-in-out infinite",
                      }}>
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>

                {/* Context menu trigger */}
                <div
                  style={{ opacity: 0, transition: "opacity 0.15s", flexShrink: 0 }}
                  className="group-hover:opacity-100"
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    onClick={(e) => handleToggleMenu(e, chat._id)}
                    style={{
                      width: "26px", height: "26px", borderRadius: "7px",
                      background: "var(--bg-secondary, rgba(0,0,0,0.06))",
                      border: "1px solid var(--border-color)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", color: "var(--text-muted)",
                    }}
                  >
                    <MoreVertical size={13} />
                  </button>

                  {openMenuId === chat._id && (
                    <div style={{
                      position: "absolute", right: "12px", top: "44px",
                      background: "var(--card-bg)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "10px",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                      zIndex: 50, padding: "4px", minWidth: "150px",
                      animation: "fadeIn 0.1s ease",
                    }}>
                      <button
                        onClick={e => { e.stopPropagation(); onToggleArchive(chat._id, !chat.isArchived); setOpenMenuId(null); }}
                        style={{
                          width: "100%", display: "flex", alignItems: "center", gap: "8px",
                          padding: "7px 10px", borderRadius: "7px", background: "none", border: "none",
                          fontSize: "12px", color: "var(--text-secondary)", cursor: "pointer", textAlign: "left",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-secondary, rgba(0,0,0,0.04))"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "none"; }}
                      >
                        {chat.isArchived
                          ? <><ArchiveRestore size={13} /> Unarchive</>
                          : <><Archive size={13} /> Archive</>}
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); onToggleBlock(chat._id, !chat.isBlocked); setOpenMenuId(null); }}
                        style={{
                          width: "100%", display: "flex", alignItems: "center", gap: "8px",
                          padding: "7px 10px", borderRadius: "7px", background: "none", border: "none",
                          fontSize: "12px", color: "#ef4444", cursor: "pointer", textAlign: "left",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.06)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "none"; }}
                      >
                        <Ban size={13} /> {chat.isBlocked ? "Unblock" : "Block"}
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); onReportChat(chat._id); setOpenMenuId(null); }}
                        style={{
                          width: "100%", display: "flex", alignItems: "center", gap: "8px",
                          padding: "7px 10px", borderRadius: "7px", background: "none", border: "none",
                          fontSize: "12px", color: "#f59e0b", cursor: "pointer", textAlign: "left",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(245,158,11,0.06)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "none"; }}
                      >
                        <CircleAlert size={13} /> Report
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .group:hover .group-hover\\:opacity-100 { opacity: 1 !important; }
      `}</style>
    </div>
  );
};

export default ChatSidebar;
