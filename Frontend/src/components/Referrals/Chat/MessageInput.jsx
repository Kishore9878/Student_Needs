import React, { useState, useRef, useEffect } from "react";
import { Paperclip, Smile, Send, CornerUpLeft, X, Loader2 } from "lucide-react";

const EMOJIS = ["😊", "👍", "💡", "👋", "🎉", "🔥", "🙏", "💻", "✨", "💯", "🤝", "😄"];

export function MessageInput({
  chatId,
  onSendMessage,
  onUploadAttachment,
  onTypingStateChange,
  replyTarget,
  onClearReply
}) {
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Clear input text when chat changes
  useEffect(() => {
    setText("");
    setShowEmojiPicker(false);
  }, [chatId]);

  const handleInputChange = (e) => {
    setText(e.target.value);
    if (chatId) {
      onTypingStateChange(chatId, true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        onTypingStateChange(chatId, false);
      }, 3000);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!text.trim()) return;
    onSendMessage(chatId, text.trim(), replyTarget?._id);
    setText("");
    onClearReply();
    setShowEmojiPicker(false);
    onTypingStateChange(chatId, false);
  };

  const handleAttachmentClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await onUploadAttachment(chatId, file, replyTarget?._id);
      onClearReply();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleInsertEmoji = (emoji) => {
    setText((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const canSend = text.trim().length > 0;

  return (
    <div style={{
      padding: "10px 12px 12px",
      borderTop: "1px solid var(--border-color)",
      background: "var(--card-bg)",
      flexShrink: 0,
    }}>
      {/* Reply Preview */}
      {replyTarget && (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "8px 10px", marginBottom: "8px",
          borderRadius: "8px", background: "rgba(99,102,241,0.06)",
          border: "1px solid rgba(99,102,241,0.15)",
          borderLeft: "3px solid #6366f1",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", minWidth: 0 }}>
            <CornerUpLeft size={12} style={{ color: "#6366f1", flexShrink: 0 }} />
            <span style={{ fontSize: "11px", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              Replying to: <strong style={{ color: "var(--text-primary)" }}>
                {replyTarget.text || (replyTarget.file ? replyTarget.file.name : "deleted message")}
              </strong>
            </span>
          </div>
          <button
            type="button"
            onClick={onClearReply}
            style={{ width: "20px", height: "20px", borderRadius: "50%", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", flexShrink: 0 }}
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Composer bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: "6px",
        background: isFocused ? "rgba(99,102,241,0.04)" : "rgba(0,0,0,0.03)",
        border: `1.5px solid ${isFocused ? "rgba(99,102,241,0.35)" : "var(--border-color)"}`,
        borderRadius: "14px", padding: "0 8px",
        transition: "all 0.15s ease",
      }}>
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          style={{ display: "none" }}
          accept=".png,.jpg,.jpeg,.webp,.pdf,.doc,.docx"
        />

        {/* Attachment */}
        <button
          type="button"
          onClick={handleAttachmentClick}
          disabled={uploading}
          style={{
            width: "34px", height: "34px", borderRadius: "8px",
            background: "none", border: "none", cursor: uploading ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--text-muted)", flexShrink: 0, transition: "color 0.15s ease",
          }}
          title="Add attachment"
          onMouseEnter={e => { if (!uploading) e.currentTarget.style.color = "#6366f1"; }}
          onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
        >
          {uploading
            ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
            : <Paperclip size={16} />
          }
        </button>

        {/* Text input */}
        <input
          type="text"
          value={text}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Type a message... (Enter to send)"
          style={{
            flex: 1, border: "none", background: "transparent",
            fontSize: "13px", color: "var(--text-primary)",
            outline: "none", padding: "10px 4px",
          }}
        />

        {/* Emoji */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            style={{
              width: "34px", height: "34px", borderRadius: "8px",
              background: "none", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: showEmojiPicker ? "#6366f1" : "var(--text-muted)",
              transition: "color 0.15s ease",
            }}
            title="Emojis"
            onMouseEnter={e => e.currentTarget.style.color = "#6366f1"}
            onMouseLeave={e => { if (!showEmojiPicker) e.currentTarget.style.color = "var(--text-muted)"; }}
          >
            <Smile size={16} />
          </button>

          {showEmojiPicker && (
            <div style={{
              position: "absolute", bottom: "44px", right: 0,
              background: "var(--card-bg)", border: "1px solid var(--border-color)",
              borderRadius: "14px", padding: "10px",
              display: "flex", flexWrap: "wrap", gap: "4px",
              maxWidth: "200px", zIndex: 50,
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            }}>
              {EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleInsertEmoji(emoji)}
                  style={{
                    width: "32px", height: "32px", borderRadius: "8px",
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: "16px", transition: "all 0.1s ease",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.08)"; e.currentTarget.style.transform = "scale(1.2)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.transform = "scale(1)"; }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Send button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSend}
          style={{
            width: "34px", height: "34px", borderRadius: "9px",
            background: canSend ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "rgba(0,0,0,0.06)",
            border: "none", cursor: canSend ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: canSend ? "#fff" : "var(--text-muted)",
            flexShrink: 0, transition: "all 0.15s ease",
          }}
          title="Send message"
          onMouseEnter={e => { if (canSend) e.currentTarget.style.opacity = "0.9"; }}
          onMouseLeave={e => { if (canSend) e.currentTarget.style.opacity = "1"; }}
        >
          <Send size={15} />
        </button>
      </div>

      {/* Hint */}
      <p style={{ fontSize: "9px", color: "var(--text-muted)", margin: "5px 0 0 4px", opacity: 0.6 }}>
        Press <strong>Enter</strong> to send · <strong>Shift+Enter</strong> for new line
      </p>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
