import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/dashboard/shared/Primitives";
import { Plus, X, Calendar, Clock, BookOpen, Check } from "lucide-react";
import studyImg from "../../assets/images/study2.jpg";
import { saveTutorAvailability } from "@/services/api/tutorialsApi.js";

function TutorAvailability() {
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [subjectInput, setSubjectInput] = useState("");

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [slots, setSlots] = useState([]);

  // ✅ Add Subject
  const addSubject = () => {
    if (subjectInput.trim() === "") return;
    if (!subjects.includes(subjectInput)) setSubjects([...subjects, subjectInput]);
    setSubjectInput("");
  };

  // ❌ Remove Subject
  const removeSubject = (sub) => {
    setSubjects(subjects?.filter((s) => s !== sub));
  };

  // ✅ Add Slot
  const addSlot = () => {
    if (!date || !time) {
      alert("Select date and time ❌");
      return;
    }
    const newSlot = `${date} - ${time}`;
    setSlots([...slots, newSlot]);
    setDate("");
    setTime("");
  };

  // ❌ Remove Slot
  const removeSlot = (slot) => {
    setSlots(slots?.filter((s) => s !== slot));
  };

  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (subjects.length === 0 || slots.length === 0) {
      alert("Add at least one subject and time slot ❌");
      return;
    }
    try {
      await saveTutorAvailability({ subjects, timeSlots: slots });
      alert("Availability saved ✅");
      navigate("/tutorials/tutor/schedule");
    } catch (err) {
      console.error(err);
      alert("Error saving data ❌");
    }
  };

  return (
    <PageLayout className="pb-8">
      <div className="flex flex-col lg:flex-row items-start justify-center gap-12 max-w-6xl mx-auto px-4 py-12">
        {/* LEFT SUMMARY */}
        <div className="w-full lg:w-[40%] flex flex-col items-center text-center lg:sticky lg:top-8 lg:pt-8">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            Set Your Availability
          </h2>
          <p className="text-muted-foreground mb-8 max-w-[300px]">
            Define the subjects you can teach and when you are available for bookings.
          </p>

          <img 
            src={studyImg} 
            alt="study" 
            className="w-[280px] md:w-[360px] max-w-full rounded-[var(--radius-xl)] shadow-2xl hover:scale-105 transition-transform duration-500 ease-out border border-white/10"
          />
        </div>

        {/* RIGHT STEPPER CARD */}
        <div className="w-full lg:w-[60%] flex justify-center">
          <div 
            className="w-full max-w-[600px] bg-card border border-border shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            style={{ padding: '32px', borderRadius: '20px' }}
          >
            <form onSubmit={handleSubmit} className="relative">
              
              {/* Vertical Connector Line */}
              <div className="absolute left-[39px] top-6 bottom-12 w-0.5 bg-border/60 z-0 hidden sm:block"></div>

              <div className="flex flex-col gap-10">
                
                {/* STEP 1: Add Subjects */}
                <div className="flex flex-col sm:flex-row gap-6 relative z-10">
                  <div className="sm:w-[80px] shrink-0 flex justify-start sm:justify-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shadow-[0_0_0_8px_var(--card-bg)]">
                      <BookOpen className="w-5 h-5" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-foreground truncate mb-2">Add Subjects</h3>
                    <p className="text-sm text-muted-foreground mb-5 max-w-[400px]">Specify what you can teach</p>
                    
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                      <input
                        type="text"
                        placeholder="e.g. Java, AI, React..."
                        value={subjectInput}
                        onChange={(e) => setSubjectInput(e.target.value)}
                        className="flex-1 h-12 px-4 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm shadow-sm"
                      />
                      <button 
                        type="button" 
                        onClick={addSubject} 
                        className="h-12 px-6 bg-secondary/30 border border-border rounded-xl font-semibold text-foreground shadow-sm flex items-center justify-center hover:bg-secondary/50 transition-colors whitespace-nowrap"
                      >
                        <Plus className="w-4 h-4 mr-2" /> Add
                      </button>
                    </div>

                    {subjects.length > 0 && (
                      <div className="flex flex-wrap gap-3 p-4 rounded-xl bg-secondary/10 border border-border/50">
                        {subjects.map((sub, index) => (
                          <span 
                            key={index} 
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-background border border-border text-foreground shadow-sm rounded-lg text-sm font-medium hover:border-primary/50 transition-colors"
                          >
                            {sub}
                            <button 
                              type="button" 
                              onClick={() => removeSubject(sub)}
                              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md p-1 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* STEP 2: Add Time Slot */}
                <div className="flex flex-col sm:flex-row gap-6 relative z-10">
                  <div className="sm:w-[80px] shrink-0 flex justify-start sm:justify-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shadow-[0_0_0_8px_var(--card-bg)]">
                      <Calendar className="w-5 h-5" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-foreground truncate mb-2">Add Time Slot</h3>
                    <p className="text-sm text-muted-foreground mb-5 max-w-[400px]">Choose your available hours</p>
                    
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                      {(() => {
                        const today = new Date().toISOString().split("T")[0];
                        return (
                          <input
                            type="date"
                            min={today}
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="flex-1 h-12 px-4 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm shadow-sm"
                          />
                        );
                      })()}

                      <div className="flex flex-1 gap-4">
                        <input
                          type="time"
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm shadow-sm"
                        />
                      </div>
                    </div>

                    <button 
                      type="button" 
                      onClick={addSlot} 
                      className="w-full h-12 bg-secondary/30 border border-border rounded-xl font-semibold text-foreground shadow-sm flex items-center justify-center hover:bg-secondary/50 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add Time Slot
                    </button>

                    {slots.length > 0 && (
                      <div className="flex flex-wrap gap-3 p-4 mt-4 rounded-xl bg-secondary/10 border border-border/50">
                        {slots.map((slot, index) => (
                          <span 
                            key={index} 
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-background border border-border text-foreground shadow-sm rounded-lg text-sm font-medium hover:border-primary/50 transition-colors"
                          >
                            <Clock className="w-3.5 h-3.5 text-primary" />
                            {slot}
                            <button 
                              type="button" 
                              onClick={() => removeSlot(slot)}
                              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md p-1 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* STEP 3: Review & Save */}
                <div className="flex flex-col sm:flex-row gap-6 relative z-10">
                  <div className="sm:w-[80px] shrink-0 flex justify-start sm:justify-center">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-[0_0_0_8px_var(--card-bg)] relative z-20">
                      <Check className="w-5 h-5" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-foreground truncate mb-5 mt-2.5">Review & Save</h3>
                    <button 
                      type="submit" 
                      className="w-full h-14 bg-[var(--primary)] text-primary-foreground rounded-xl font-bold text-lg shadow-[0_4px_14px_0_rgb(0,118,255,0.39)] hover:bg-[var(--primary)]/90 hover:shadow-[0_6px_20px_rgba(0,118,255,0.23)] hover:scale-[1.01] transition-all duration-200"
                    >
                      Save Availability
                    </button>
                  </div>
                </div>

              </div>
            </form>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export default TutorAvailability;
