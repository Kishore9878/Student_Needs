import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, BookPlus, Pencil, Trash2, Library } from "lucide-react";
import API, { TUTOR_ATTENDANCE_PATHS } from "@/services/Attendance/tutorAttendanceApi";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PremiumButton } from "@/components/dashboard/shared/Primitives";
import { 
  AttendancePageLayout, 
  AttendancePageHeader, 
  AttendanceSectionCard,
  AttendanceEmptyState 
} from "@/components/dashboard/attendance/SharedUI";

const getErrorMessage = (err) =>
  err?.response?.data?.message || err?.message || "Something went wrong";

export default function TutorManageSubjects() {
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [modal, setModal] = useState({ open: false, mode: "add", id: null, name: "" });
  const [submitting, setSubmitting] = useState(false);

  const loadSubjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get(TUTOR_ATTENDANCE_PATHS.tutorSubjects);
      setSubjects(res.data || []);
    } catch (err) {
      toast.error(getErrorMessage(err));
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  const saveSubject = async () => {
    const name = modal.name.trim();
    if (!name) {
      toast.error("Subject name is required");
      return;
    }
    setSubmitting(true);
    try {
      if (modal.mode === "add") {
        await API.post(TUTOR_ATTENDANCE_PATHS.tutorSubjects, { subjectName: name });
        toast.success("Subject added");
      } else {
        await API.put(TUTOR_ATTENDANCE_PATHS.tutorSubject(modal.id), {
          subjectName: name,
        });
        toast.success("Subject updated");
      }
      setModal({ open: false, mode: "add", id: null, name: "" });
      await loadSubjects();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const deleteSubject = async (id, name) => {
    if (
      !window.confirm(
        `Delete "${name}"? This is only allowed if no attendance has been recorded for it.`
      )
    ) {
      return;
    }
    try {
      await API.delete(TUTOR_ATTENDANCE_PATHS.tutorSubject(id));
      toast.success("Subject deleted");
      await loadSubjects();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <AttendancePageLayout>
      <AttendancePageHeader
        title="Tutor Subjects"
        description="Add the courses you teach. These subjects are used throughout the attendance system."
        icon={BookPlus}
        action={
          <PremiumButton onClick={() => setModal({ open: true, mode: "add", id: null, name: "" })} className="shadow-md w-full sm:w-auto">
            <BookPlus className="w-4 h-4 mr-2" />
            Add Subject
          </PremiumButton>
        }
      />

      <AttendanceSectionCard 
        title="Your subjects" 
        icon={Library}
        noPadding={true}
      >
        <div className="p-6 border-b border-border/50">
          <p className="text-sm text-muted-foreground">Examples: Java Programming, Web Development, Python, DSA</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <span className="spinner spinner-lg text-primary" />
          </div>
        ) : subjects.length === 0 ? (
          <AttendanceEmptyState
            icon={BookPlus}
            title="No subjects added"
            description="Start by creating your first subject before marking attendance."
            action={
              <PremiumButton onClick={() => setModal({ open: true, mode: "add", id: null, name: "" })}>
                <BookPlus className="w-4 h-4 mr-2" />
                Add Subject
              </PremiumButton>
            }
          />
        ) : (
          <ul className="divide-y divide-border">
            {subjects.map((s) => (
              <li
                key={s._id}
                className="flex items-center justify-between gap-3 px-6 py-4 bg-background hover:bg-secondary/20 transition-colors group"
              >
                <span className="font-semibold text-foreground">{s.subjectName}</span>
                <div className="flex gap-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    className="p-2 rounded-xl bg-card border border-border text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 shadow-sm transition-all"
                    onClick={() =>
                      setModal({
                        open: true,
                        mode: "edit",
                        id: s._id,
                        name: s.subjectName,
                      })
                    }
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="p-2 rounded-xl bg-card border border-border text-muted-foreground hover:text-destructive hover:border-destructive/50 hover:bg-destructive/10 shadow-sm transition-all"
                    onClick={() => deleteSubject(s._id, s.subjectName)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </AttendanceSectionCard>

      <Dialog open={modal.open} onOpenChange={(open) => !open && setModal({ ...modal, open: false })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {modal.mode === "add" ? "Add Subject" : "Edit Subject"}
            </DialogTitle>
          </DialogHeader>
          <input
            type="text"
            className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm shadow-sm"
            placeholder="e.g. Java Programming"
            value={modal.name}
            onChange={(e) => setModal({ ...modal, name: e.target.value })}
          />
          <DialogFooter className="mt-4">
            <PremiumButton variant="outline" onClick={() => setModal({ ...modal, open: false })}>
              Cancel
            </PremiumButton>
            <PremiumButton onClick={saveSubject} disabled={submitting}>
              {submitting ? "Saving…" : "Save Subject"}
            </PremiumButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AttendancePageLayout>
  );
}
