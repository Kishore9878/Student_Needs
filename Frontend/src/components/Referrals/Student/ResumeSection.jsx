import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { 
  FileText, 
  Upload, 
  Download, 
  Trash2, 
  Loader2, 
  CheckCircle2,
  AlertCircle,
  RefreshCw 
} from 'lucide-react';
import { resumeApi } from '@/services/Referrals/studentProfile.js';
import { showTransactionToast, dismissToast } from '@/components/Referrals/TransactionToast.jsx';

/**
 * ResumeSection Component
 * Handles resume upload, update, download, and deletion.
 * Stores resume as PDF in MongoDB.
 * * @param {Object} props
 * @param {Object} [props.resume] - Resume data from profile (fileName, fileSize, uploadedAt)
 * @param {Function} props.onResumeChange - Callback to refresh profile data after changes
 */
export function ResumeSection({ resume, onResumeChange }) {
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef(null);

  // Check if resume exists
  const hasResume = resume?.fileName && resume?.fileSize;

  /**
   * Handle file selection and upload
   * @param {React.ChangeEvent<HTMLInputElement>} event 
   */
  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      showTransactionToast({
        type: 'error',
        message: 'Please upload a PDF file only',
      });
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      showTransactionToast({
        type: 'error',
        message: 'File size must be less than 5MB',
      });
      return;
    }

    setUploading(true);
    const toastId = showTransactionToast({
      type: 'pending',
      message: hasResume ? 'Updating resume...' : 'Uploading resume...',
    });

    try {
      // Use update API if resume exists, otherwise use upload API
      if (hasResume) {
        await resumeApi.updateResume(file);
      } else {
        await resumeApi.uploadResume(file);
      }

      dismissToast(toastId);
      showTransactionToast({
        type: 'success',
        message: hasResume ? 'Resume updated successfully!' : 'Resume uploaded successfully!',
      });

      // Refresh profile data
      onResumeChange();
    } catch (error) {
      dismissToast(toastId);
      showTransactionToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to upload resume',
      });
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  /**
   * Download resume PDF
   */
  const handleDownload = async () => {
    if (!hasResume) return;

    setDownloading(true);
    const toastId = showTransactionToast({
      type: 'pending',
      message: 'Downloading resume...',
    });

    try {
      const blob = await resumeApi.getResume();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = resume?.fileName || 'resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      dismissToast(toastId);
      showTransactionToast({
        type: 'success',
        message: 'Resume downloaded successfully!',
      });
    } catch (error) {
      dismissToast(toastId);
      showTransactionToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to download resume',
      });
    } finally {
      setDownloading(false);
    }
  };

  /**
   * Delete resume
   */
  const handleDelete = async () => {
    if (!hasResume) return;

    // Confirm deletion
    if (!window.confirm('Are you sure you want to delete your resume?')) {
      return;
    }

    setDeleting(true);
    const toastId = showTransactionToast({
      type: 'pending',
      message: 'Deleting resume...',
    });

    try {
      await resumeApi.deleteResume();

      dismissToast(toastId);
      showTransactionToast({
        type: 'success',
        message: 'Resume deleted successfully!',
      });

      // Refresh profile data
      onResumeChange();
    } catch (error) {
      dismissToast(toastId);
      showTransactionToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to delete resume',
      });
    } finally {
      setDeleting(false);
    }
  };

  /**
   * Format file size for display
   */
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    let unitIndex = 0;
    let size = bytes;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  /**
   * Format date for display
   */
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleFileSelect}
        className="hidden"
        id="resume-upload"
      />

      {/* Top section: Header + Description + Preview */}
      <div>
        {/* Header: Icon, Title, Status badge aligned right */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "38px", height: "38px", borderRadius: "10px",
              background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
            }}>
              <FileText style={{ width: "18px", height: "18px", color: "#6366f1" }} />
            </div>
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>Resume</h3>
          </div>
          {hasResume && (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "4px",
              padding: "4px 10px", borderRadius: "999px",
              background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)",
              color: "#10b981", fontSize: "12px", fontWeight: "600"
            }}>
              <CheckCircle2 style={{ width: "13px", height: "13px" }} /> Uploaded
            </div>
          )}
        </div>

        {/* Description */}
        <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "0 0 16px", lineHeight: "1.5" }}>
          Upload your resume (PDF only, max 5MB)
        </p>

        {/* Content Preview */}
        {hasResume ? (
          <div style={{
            padding: "16px", borderRadius: "14px",
            background: "rgba(99,102,241,0.03)", border: "1px solid rgba(99,102,241,0.12)",
            marginBottom: "16px"
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <FileText style={{ width: "22px", height: "22px", color: "#6366f1", flexShrink: 0, marginTop: "2px" }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-primary)", margin: "0 0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {resume?.fileName}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", fontSize: "12px", color: "var(--text-muted)", fontWeight: "500" }}>
                  <span>{formatFileSize(resume?.fileSize)}</span>
                  {resume?.uploadedAt && <span>• Uploaded: {formatDate(resume.uploadedAt)}</span>}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: "2px dashed var(--border-color)", borderRadius: "14px", padding: "24px 16px",
              textAlign: "center", cursor: "pointer", transition: "all 0.15s ease",
              background: "rgba(0,0,0,0.01)", marginBottom: "16px"
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#6366f1"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border-color)"}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(99,102,241,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
                <Upload style={{ width: "18px", height: "18px", color: "#6366f1" }} />
              </div>
              <div>
                <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", margin: "0 0 2px" }}>Click to upload your resume</p>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>PDF format only (max 5MB)</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom section: Action Buttons in one row on desktop */}
      <div style={{ paddingTop: "8px" }}>
        {hasResume ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={downloading}
              style={{ flex: "1 1 auto", height: "40px", borderRadius: "10px", fontWeight: "600", fontSize: "13px" }}
            >
              {downloading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />} Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              style={{ flex: "1 1 auto", height: "40px", borderRadius: "10px", fontWeight: "600", fontSize: "13px" }}
            >
              {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />} Replace
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
              style={{ flex: "0 0 auto", height: "40px", borderRadius: "10px", fontWeight: "600", fontSize: "13px", background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}
            >
              {deleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-1.5" />} Delete
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            style={{ width: "100%", height: "42px", borderRadius: "10px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontWeight: "600", fontSize: "14px", border: "none" }}
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Resume
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}