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
  Code,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Save,
  Edit2,
} from "lucide-react";
import { githubApi } from "@/services/Referrals/studentProfile.js";
import {
  showTransactionToast,
  dismissToast,
} from "@/components/Referrals/TransactionToast.jsx";

/**
 * @param {Object} props
 * @param {string} [props.githubUrl] - GitHub URL from profile
 * @param {Function} props.onGitHubChange - Callback to refresh profile data after changes
 */
export function GitHubSection({ githubUrl: initialGithubUrl, onGitHubChange }) {
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [githubUrl, setGithubUrl] = useState(initialGithubUrl || "");

  const hasGithubUrl = !!initialGithubUrl;

  useEffect(() => {
    setGithubUrl(initialGithubUrl || "");
  }, [initialGithubUrl]);

  const validateGithubUrl = (url) => {
    const githubPattern =
      /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/i;
    return githubPattern.test(url.trim());
  };

  const handleSave = async () => {
    if (!githubUrl.trim()) {
      showTransactionToast({
        type: "error",
        message: "Please enter a GitHub URL",
      });
      return;
    }

    if (!validateGithubUrl(githubUrl)) {
      showTransactionToast({
        type: "error",
        message:
          "Please enter a valid GitHub profile URL (e.g. github.com/username)",
      });
      return;
    }

    setSaving(true);
    const toastId = showTransactionToast({
      type: "pending",
      message: hasGithubUrl ? "Updating GitHub URL..." : "Adding GitHub URL...",
    });

    try {
      if (hasGithubUrl) {
        await githubApi.updateGithubUrl(githubUrl.trim());
      } else {
        await githubApi.addGithubUrl(githubUrl.trim());
      }

      dismissToast(toastId);
      showTransactionToast({
        type: "success",
        message: hasGithubUrl ? "GitHub URL updated!" : "GitHub URL added!",
      });

      setIsEditing(false);
      onGitHubChange();
    } catch (error) {
      dismissToast(toastId);
      showTransactionToast({
        type: "error",
        message: error.response?.data?.message || "Failed to save GitHub URL",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!hasGithubUrl) return;

    if (!window.confirm("Are you sure you want to remove your GitHub URL?")) {
      return;
    }

    setDeleting(true);
    const toastId = showTransactionToast({
      type: "pending",
      message: "Removing GitHub URL...",
    });

    try {
      await githubApi.deleteGithubUrl();

      dismissToast(toastId);
      showTransactionToast({
        type: "success",
        message: "GitHub URL removed!",
      });

      setGithubUrl("");
      setIsEditing(false);
      onGitHubChange();
    } catch (error) {
      dismissToast(toastId);
      showTransactionToast({
        type: "error",
        message: error.response?.data?.message || "Failed to remove GitHub URL",
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleCancel = () => {
    setGithubUrl(initialGithubUrl || "");
    setIsEditing(false);
  };

  const extractUsername = (url) => {
    if (!url) return "";
    const match = url.match(/github\.com\/([a-zA-Z0-9_-]+)/i);
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
        e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)";
        e.currentTarget.style.boxShadow = "0 6px 20px rgba(99,102,241,0.08)";
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
              background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
            }}>
              <Code style={{ width: "18px", height: "18px", color: "#6366f1" }} />
            </div>
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>GitHub</h3>
          </div>
          {hasGithubUrl && (
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
          Add your GitHub profile for recruiters
        </p>

        {/* Content Preview or Edit Form */}
        {hasGithubUrl && !isEditing ? (
          <div style={{
            padding: "16px", borderRadius: "14px",
            background: "rgba(99,102,241,0.03)", border: "1px solid rgba(99,102,241,0.12)",
            marginBottom: "16px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Code style={{ width: "22px", height: "22px", color: "var(--text-primary)", flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-primary)", margin: "0 0 2px" }}>
                  @{extractUsername(initialGithubUrl)}
                </p>
                <a
                  href={initialGithubUrl.startsWith("http") ? initialGithubUrl : `https://${initialGithubUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: "12px", color: "var(--text-muted)", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: "500" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#6366f1"}
                  onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
                >
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{initialGithubUrl}</span>
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
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/yourusername"
                style={{ flex: "1 1 200px", height: "42px", borderRadius: "10px", border: "1.5px solid var(--border-color)", background: "var(--card-bg)", color: "var(--text-primary)", padding: "0 12px", fontSize: "13px" }}
                onKeyPress={(e) => e.key === "Enter" && handleSave()}
              />
              <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                <Button onClick={handleSave} disabled={saving || !githubUrl.trim()} style={{ height: "42px", padding: "0 18px", borderRadius: "10px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontWeight: "600", fontSize: "13px", border: "none" }}>
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
                Adding your GitHub profile helps recruiters see your projects, contributions, and coding activity.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom section: Action Buttons in one row on desktop */}
      {hasGithubUrl && !isEditing && (
        <div style={{ paddingTop: "8px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(initialGithubUrl.startsWith("http") ? initialGithubUrl : `https://${initialGithubUrl}`, "_blank")}
              style={{ flex: "1 1 auto", height: "40px", borderRadius: "10px", fontWeight: "600", fontSize: "13px", borderColor: "rgba(99,102,241,0.3)", color: "#6366f1", background: "rgba(99,102,241,0.04)" }}
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
