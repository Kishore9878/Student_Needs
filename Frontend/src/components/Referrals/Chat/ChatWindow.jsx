import React, { useEffect, useRef } from "react";
import { MessageSquareDashed } from "lucide-react";
import { MessageBubble } from "./MessageBubble.jsx";
import { MessageSkeleton } from "./ChatSkeleton.jsx";
import { ChatHeader } from "./ChatHeader.jsx";
import { MessageInput } from "./MessageInput.jsx";
import { TypingIndicator } from "./TypingIndicator.jsx";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";
import { applicationsApi } from "@/services/Referrals/application.js";

export function ChatWindow({
  chat,
  messages,
  loadingMessages,
  onSendMessage,
  onUploadAttachment,
  onEditMessage,
  onDeleteMessage,
  onMarkRead,
  isTyping,
  otherUserTyping,
  onBack,
  onTypingStateChange,
  onOpenAttachment
}) {
  const { user } = useAuth();
  const [replyTarget, setReplyTarget] = React.useState(null);

  const messagesEndRef = useRef(null);
  const feedContainerRef = useRef(null);

  const currentRole = (user?.role || user?.accountType || "student").toLowerCase();
  const participant = currentRole === "alumni" ? chat?.student : chat?.alumni;
  const isOnline = chat?.student?.isOnline || chat?.alumni?.isOnline;

  useEffect(() => {
    scrollToBottom();
    if (chat?._id) onMarkRead(chat._id);
  }, [messages?.length, chat?._id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDownloadResume = () => {
    if (currentRole === "alumni" && chat?.student?._id) {
      applicationsApi.downloadStudentResume(chat.student._id);
    }
  };

  if (!chat) {
    return (
      <div style={{
        flex: 1, height: "100%", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", textAlign: "center",
        padding: "40px 32px",
        background: "rgba(99,102,241,0.02)",
      }}>
        {/* Icon */}
        <div style={{
          width: "80px", height: "80px", borderRadius: "24px",
          background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.1))",
          border: "1.5px solid rgba(99,102,241,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: "20px",
          boxShadow: "0 8px 24px rgba(99,102,241,0.12)",
        }}>
          <MessageSquareDashed size={36} style={{ color: "#6366f1", opacity: 0.8 }} />
        </div>
        <h3 style={{ fontSize: "18px", fontWeight: "800", color: "var(--text-primary)", margin: "0 0 8px", letterSpacing: "-0.02em" }}>
          Select a conversation
        </h3>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "0 0 24px", maxWidth: "260px", lineHeight: "1.6" }}>
          Choose a contact from the left panel to view your referral conversation.
        </p>
        {/* Feature pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
          {["💬 Direct messaging", "📎 File sharing", "✏️ Edit messages", "🔔 Real-time updates"].map(f => (
            <span key={f} style={{
              padding: "5px 12px", borderRadius: "999px",
              background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.15)",
              fontSize: "11px", fontWeight: "600", color: "#6366f1",
            }}>{f}</span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, height: "100%", display: "flex", flexDirection: "column", background: "var(--card-bg)" }}>
      {/* Chat Header */}
      <ChatHeader
        participant={participant}
        currentRole={currentRole}
        isOnline={isOnline}
        onBack={onBack}
        onDownloadResume={handleDownloadResume}
      />

      {/* Message Feed */}
      <div
        ref={feedContainerRef}
        className="flex-1 overflow-y-auto scrollbar-hide"
        style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "2px" }}
      >
        {loadingMessages && messages.length === 0 ? (
          <MessageSkeleton />
        ) : messages.length === 0 ? (
          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            textAlign: "center", padding: "40px 20px", opacity: 0.65,
          }}>
            <MessageSquareDashed size={36} style={{ marginBottom: "12px", color: "var(--text-muted)" }} />
            <p style={{ fontSize: "14px", fontWeight: "600", margin: "0 0 4px", color: "var(--text-primary)" }}>No messages yet</p>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>Start the conversation about your referral request.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {[...messages].reverse().map((msg) => (
              <MessageBubble
                key={msg._id}
                message={msg}
                onReply={setReplyTarget}
                onEdit={onEditMessage}
                onDelete={onDeleteMessage}
                onOpenAttachment={onOpenAttachment}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Typing Indicator */}
      <TypingIndicator otherUserTyping={otherUserTyping} participantName={participant?.firstName} />

      {/* Message Input */}
      <MessageInput
        chatId={chat._id}
        onSendMessage={onSendMessage}
        onUploadAttachment={onUploadAttachment}
        onTypingStateChange={onTypingStateChange}
        replyTarget={replyTarget}
        onClearReply={() => setReplyTarget(null)}
      />
    </div>
  );
}
