import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import {
  Globe,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Save,
  Edit2,
} from "lucide-react";
import { linkedInApi } from "@/services/Referrals/studentProfile.js";
import {
  showTransactionToast,
  dismissToast,
} from "@/components/Referrals/TransactionToast.jsx";

/**
 * @param {Object} props
 * @param {string} [props.linkedinUrl] - LinkedIn URL from profile
 * @param {Function} props.onLinkedInChange - Callback to refresh profile data after changes
 */
export function LinkedInSection({ linkedinUrl: initialLinkedinUrl, onLinkedInChange }) {
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [linkedinUrl, setLinkedinUrl] = useState(initialLinkedinUrl || "");

  const hasLinkedinUrl = !!initialLinkedinUrl;

  useEffect(() => {
    setLinkedinUrl(initialLinkedinUrl || "");
  }, [initialLinkedinUrl]);

  const validateLinkedInUrl = (url) => {
    const pattern =
      /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/i;
    return pattern.test(url.trim());
  };

  const handleSave = async () => {
    if (!linkedinUrl.trim()) {
      showTransactionToast({
        type: "error",
        message: "Please enter a LinkedIn profile URL",
      });
      return;
    }

    if (!validateLinkedInUrl(linkedinUrl)) {
      showTransactionToast({
        type: "error",
        message:
          "Please enter a valid LinkedIn profile URL (e.g. linkedin.com/in/username)",
      });
      return;
    }

    setSaving(true);
    const toastId = showTransactionToast({
      type: "pending",
      message: hasLinkedinUrl ? "Updating LinkedIn URL..." : "Adding LinkedIn URL...",
    });

    try {
      if (hasLinkedinUrl) {
        await linkedInApi.updateLinkedInUrl(linkedinUrl.trim());
      } else {
        await linkedInApi.addLinkedInUrl(linkedinUrl.trim());
      }

      dismissToast(toastId);
      showTransactionToast({
        type: "success",
        message: hasLinkedinUrl ? "LinkedIn URL updated!" : "LinkedIn URL added!",
      });

      setIsEditing(false);
      onLinkedInChange();
    } catch (error) {
      dismissToast(toastId);
      showTransactionToast({
        type: "error",
        message: error.response?.data?.message || "Failed to save LinkedIn URL",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!hasLinkedinUrl) return;

    if (!window.confirm("Are you sure you want to remove your LinkedIn URL?")) {
      return;
    }

    setDeleting(true);
    const toastId = showTransactionToast({
      type: "pending",
      message: "Removing LinkedIn URL...",
    });

    try {
      await linkedInApi.deleteLinkedInUrl();

      dismissToast(toastId);
      showTransactionToast({
        type: "success",
        message: "LinkedIn URL removed!",
      });

      setLinkedinUrl("");
      setIsEditing(false);
      onLinkedInChange();
    } catch (error) {
      dismissToast(toastId);
      showTransactionToast({
        type: "error",
        message: error.response?.data?.message || "Failed to remove LinkedIn URL",
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleCancel = () => {
    setLinkedinUrl(initialLinkedinUrl || "");
    setIsEditing(false);
  };

  const extractUsername = (url) => {
    if (!url) return "";
    const match = url.match(/linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
    return match ? match[1] : url;
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "var(--card-bg)",
        border: "1px solid var(--border-color)",
        borderRadius: "20px",
        padding: "24px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        transition: "all 0.15s ease",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "rgba(10,102,194,0.3)";
        e.currentTarget.style.boxShadow = "0 6px 20px rgba(10,102,194,0.08)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "var(--border-color)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
        e.currentTarget.style.transform = "none";
      }}
    >
      {/* Top section: Header + Description + Preview/Input */}
      <div>
        {/* Header: Icon, Title, Status badge aligned right */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "38px", height: "38px", borderRadius: "10px",
              background: "rgba(10,102,194,0.1)", border: "1px solid rgba(10,102,194,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
            }}>
              <Globe style={{ width: "18px", height: "18px", color: "#0A66C2" }} />
            </div>
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>LinkedIn</h3>
          </div>
          {hasLinkedinUrl && (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "4px",
              padding: "4px 10px", borderRadius: "999px",
              background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)",
              color: "#10b981", fontSize: "12px", fontWeight: "600"
            }}>
              <CheckCircle2 style={{ width: "13px", height: "13px" }} /> Added
            </div>
          )}
        </div>

        {/* Description */}
        <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "0 0 16px", lineHeight: "1.5" }}>
          Add your LinkedIn profile for recruiters
        </p>

        {/* Content Preview or Edit Form */}
        {hasLinkedinUrl && !isEditing ? (
          <div style={{
            padding: "16px", borderRadius: "14px",
            background: "rgba(10,102,194,0.03)", border: "1px solid rgba(10,102,194,0.12)",
            marginBottom: "16px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Globe style={{ width: "22px", height: "22px", color: "#0A66C2", flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-primary)", margin: "0 0 2px" }}>
                  @{extractUsername(initialLinkedinUrl)}
                </p>
                <a
                  href={initialLinkedinUrl.startsWith("http") ? initialLinkedinUrl : `https://${initialLinkedinUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: "12px", color: "#0A66C2", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: "500" }}
                  onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                  onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
                >
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{initialLinkedinUrl}</span>
                  <ExternalLink size={11} style={{ flexShrink: 0 }} />
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "12px" }}>
              <Input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                style={{ flex: "1 1 200px", height: "42px", borderRadius: "10px", border: "1.5px solid var(--border-color)", background: "var(--card-bg)", color: "var(--text-primary)", padding: "0 12px", fontSize: "13px" }}
                onKeyPress={(e) => e.key === "Enter" && handleSave()}
              />
              <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                <Button onClick={handleSave} disabled={saving || !linkedinUrl.trim()} style={{ height: "42px", padding: "0 18px", borderRadius: "10px", background: "linear-gradient(135deg, #0A66C2, #004182)", color: "#fff", fontWeight: "600", fontSize: "13px", border: "none" }}>
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-1.5" />} Save
                </Button>
                {isEditing && (
                  <Button variant="outline" onClick={handleCancel} style={{ height: "42px", padding: "0 14px", borderRadius: "10px", fontWeight: "600", fontSize: "13px" }}>
                    Cancel
                  </Button>
                )}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.4" }}>
              <AlertCircle style={{ width: "15px", height: "15px", marginTop: "1px", flexShrink: 0, color: "var(--text-muted)" }} />
              <p style={{ margin: 0 }}>
                Linking your LinkedIn profile helps recruiters learn more about your professional background and accomplishments.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom section: Action Buttons in one row on desktop */}
      {hasLinkedinUrl && !isEditing && (
        <div style={{ paddingTop: "8px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(initialLinkedinUrl.startsWith("http") ? initialLinkedinUrl : `https://${initialLinkedinUrl}`, "_blank")}
              style={{ flex: "1 1 auto", height: "40px", borderRadius: "10px", fontWeight: "600", fontSize: "13px", borderColor: "rgba(10,102,194,0.3)", color: "#0A66C2", background: "rgba(10,102,194,0.04)" }}
            >
              <ExternalLink className="w-4 h-4 mr-2" /> View
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              style={{ flex: "1 1 auto", height: "40px", borderRadius: "10px", fontWeight: "600", fontSize: "13px" }}
            >
              <Edit2 className="w-4 h-4 mr-2" /> Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
              style={{ flex: "0 0 auto", height: "40px", borderRadius: "10px", fontWeight: "600", fontSize: "13px", background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}
            >
              {deleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-1.5" />} Remove
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
