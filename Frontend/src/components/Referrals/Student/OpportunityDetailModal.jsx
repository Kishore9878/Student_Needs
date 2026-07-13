import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button.jsx";
import {
  X,
  Building2,
  Calendar,
  Target,
  TrendingUp,
  Users,
  Briefcase,
  CheckCircle,
  Loader2,
  MessageSquare,
} from 'lucide-react';

/**
 * Modal component to display detailed information about a referral opportunity.
 * @param {Object} props
 * @param {Object|null} props.opportunity - The opportunity data object
 * @param {boolean} props.isOpen - Controls the visibility of the modal
 * @param {Function} props.onClose - Function to close the modal
 * @param {Function} props.onApply - Async function to handle the application process
 * @param {boolean} props.isApplying - Loading state indicator for the application process
 * @param {boolean} props.hasApplied - Boolean indicating if the student has already applied
 */
export function OpportunityDetailModal({
  opportunity,
  isOpen,
  onClose,
  onApply,
  isApplying,
  hasApplied,
  chatId,
}) {
  const navigate = useNavigate();
  if (!isOpen || !opportunity) return null;

  const referralsGiven = opportunity.referralsGiven || 0;
  const referralsLeft = (opportunity.numberOfReferrals || 0) - referralsGiven;
  const isOpen_ = opportunity.status === 'Open' || opportunity.isActive;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-background/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-card border border-border rounded-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
          style={{ maxWidth: '850px' }}
        >
          {/* Header */}
          <div 
            className="bg-card flex items-start justify-between border-b border-border/40 z-10"
            style={{
              paddingLeft: '32px',
              paddingRight: '32px',
              paddingTop: '32px',
              paddingBottom: '24px',
            }}
          >
            <div className="flex-1 min-w-0 pr-6">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight leading-tight">
                  {opportunity.jobTitle}
                </h2>
                {isOpen_ ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-success/10 text-success border border-success/20 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-destructive/10 text-destructive border border-destructive/20 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                    Closed
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2.5 text-muted-foreground text-sm font-medium">
                <Building2 className="w-4 h-4 text-muted-foreground/75" />
                <span className="truncate">
                  {opportunity.postedBy?.firstName} {opportunity.postedBy?.lastName} &middot; {opportunity.postedBy?.designation} at <span className="font-semibold text-foreground">{opportunity.postedBy?.company}</span>
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl hover:bg-muted border border-border/30 hover:border-border/60 transition-all text-muted-foreground hover:text-foreground shrink-0 shadow-sm"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content Wrapper (.modal-content) */}
          <div 
            className="modal-content overflow-y-auto flex-grow flex-1 flex flex-col gap-6 bg-muted/5"
            style={{
              paddingLeft: '32px',
              paddingRight: '32px',
              paddingTop: '24px',
              paddingBottom: '24px',
              width: '100%',
            }}
          >
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full justify-center">
              <div 
                className="transition-colors shadow-sm flex flex-col items-center justify-center text-center min-h-[110px]"
                style={{
                  padding: '24px',
                  borderRadius: '16px',
                  border: '1px solid var(--border)',
                  background: 'var(--card)',
                }}
              >
                <Target className="w-5 h-5 text-primary mb-2" />
                <p className="text-[10px] tracking-wider font-bold text-muted-foreground uppercase mb-1">Experience</p>
                <p className="text-base font-extrabold text-foreground leading-tight">{opportunity.experienceLevel}</p>
              </div>
              <div 
                className="transition-colors shadow-sm flex flex-col items-center justify-center text-center min-h-[110px]"
                style={{
                  padding: '24px',
                  borderRadius: '16px',
                  border: '1px solid var(--border)',
                  background: 'var(--card)',
                }}
              >
                <Users className="w-5 h-5 text-primary mb-2" />
                <p className="text-[10px] tracking-wider font-bold text-muted-foreground uppercase mb-1">Referrals</p>
                <p className="text-base font-extrabold text-foreground leading-tight">{referralsGiven}/{opportunity.numberOfReferrals}</p>
              </div>
              <div 
                className="transition-colors shadow-sm flex flex-col items-center justify-center text-center min-h-[110px]"
                style={{
                  padding: '24px',
                  borderRadius: '16px',
                  border: '1px solid var(--border)',
                  background: 'var(--card)',
                }}
              >
                <TrendingUp className="w-5 h-5 text-success mb-2" />
                <p className="text-[10px] tracking-wider font-bold text-muted-foreground uppercase mb-1">Slots Left</p>
                <p className="text-base font-extrabold text-foreground leading-tight">{referralsLeft}</p>
              </div>
              <div 
                className="transition-colors shadow-sm flex flex-col items-center justify-center text-center min-h-[110px]"
                style={{
                  padding: '24px',
                  borderRadius: '16px',
                  border: '1px solid var(--border)',
                  background: 'var(--card)',
                }}
              >
                <Calendar className="w-5 h-5 text-primary mb-2" />
                <p className="text-[10px] tracking-wider font-bold text-muted-foreground uppercase mb-1">Posted</p>
                <p className="text-base font-extrabold text-foreground leading-tight">
                  {new Date(opportunity.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Role Description Card */}
            <div 
              className="section-card shadow-sm flex flex-col gap-4"
              style={{
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid var(--border)',
                background: 'var(--card)',
              }}
            >
              <h3 className="text-base font-bold text-foreground flex items-center gap-2.5">
                📘 Role Description
              </h3>
              <p className="text-foreground/90 whitespace-pre-wrap text-sm" style={{ lineHeight: '1.7' }}>
                {opportunity.roleDescription}
              </p>
            </div>

            {/* Required Skills Tags Card */}
            {opportunity.requiredSkills && opportunity.requiredSkills.length > 0 && (
              <div 
                className="section-card shadow-sm flex flex-col gap-4"
                style={{
                  padding: '24px',
                  borderRadius: '16px',
                  border: '1px solid var(--border)',
                  background: 'var(--card)',
                }}
              >
                <h3 className="text-base font-bold text-foreground flex items-center gap-2.5">
                  ✅ Required Skills
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {opportunity.requiredSkills?.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-primary/5 text-primary border border-primary/15 hover:bg-primary/10 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Referrer/Alumni Card */}
            <div 
              className="section-card shadow-sm flex flex-col gap-4"
              style={{
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid var(--border)',
                background: 'var(--card)',
              }}
            >
              <h3 className="text-base font-bold text-foreground flex items-center gap-2.5">
                👤 About the Referrer
              </h3>
              <div className="flex items-center gap-4">
                <div className="w-[52px] h-[52px] rounded-full bg-primary/10 border border-primary/15 flex items-center justify-center shrink-0 shadow-sm">
                  <span className="text-base font-extrabold text-primary">
                    {opportunity.postedBy?.firstName?.[0]}{opportunity.postedBy?.lastName?.[0]}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-foreground text-base leading-tight">
                    {opportunity.postedBy?.firstName} {opportunity.postedBy?.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1.5 font-medium leading-normal">
                    {opportunity.postedBy?.designation} at <span className="font-semibold text-foreground/80">{opportunity.postedBy?.company}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Action Bar */}
          <div 
            className="bg-card border-t border-border/40 z-10 footer-container"
            style={{
              padding: '24px',
            }}
          >
            {hasApplied ? (
              <div className="flex gap-4 w-full">
                <Button disabled className="flex-1 h-12 bg-success/20 text-success hover:bg-success/20 rounded-xl font-bold flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Already Applied
                </Button>
                <Button
                  onClick={() => {
                    onClose();
                    navigate(`/student/chat?chatId=${chatId || ''}`);
                  }}
                  className="flex-1 h-12 bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl font-bold flex items-center justify-center shadow-sm"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message Alumni
                </Button>
              </div>
            ) : !isOpen_ ? (
              <Button variant="secondary" disabled className="w-full h-12 rounded-xl font-bold flex items-center justify-center">
                <X className="w-4 h-4 mr-2" />
                Opportunity Closed
              </Button>
            ) : referralsLeft === 0 ? (
              <Button variant="secondary" disabled className="w-full h-12 rounded-xl font-bold flex items-center justify-center">
                <Users className="w-4 h-4 mr-2" />
                All Slots Filled
              </Button>
            ) : (
              <Button
                onClick={() => onApply(opportunity._id)}
                disabled={isApplying}
                className="w-full h-12 bg-primary text-background hover:bg-primary/90 rounded-xl font-bold flex items-center justify-center shadow-sm"
              >
                {isApplying ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Applying...
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4 mr-2" />
                    Apply for {opportunity.opportunityType === 'Job' ? 'Job' : 'Referral'}
                  </>
                )}
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}