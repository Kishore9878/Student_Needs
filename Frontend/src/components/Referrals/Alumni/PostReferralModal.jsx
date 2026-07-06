import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Loader2 } from 'lucide-react';

/**
 * Modal component for alumni to post new referral opportunities.
 * @param {Object} props
 * @param {boolean} props.showModal - Visibility state
 * @param {Function} props.onClose - Close handler
 * @param {Object} props.referralForm - Form data state
 * @param {Function} props.setReferralForm - Form data setter
 * @param {Function} props.onSubmit - Async submission handler
 * @param {boolean} props.isCreating - Loading state for the submit button
 */
export function PostReferralModal({
  showModal,
  onClose,
  referralForm,
  setReferralForm,
  onSubmit,
  isCreating,
}) {
  return (
    <AnimatePresence>
      {showModal && (
        <>
          <style>{`
            .post-job-modal-card {
              width: 100% !important;
              max-width: 760px !important;
              max-height: calc(100vh - 48px) !important;
              background-color: var(--bg-surface-1) !important;
              border-radius: 16px !important;
              border: 1px solid var(--border-subtle, var(--border-color)) !important;
              box-shadow: 0 20px 50px rgba(15, 23, 42, 0.14) !important;
              box-sizing: border-box !important;
              display: flex !important;
              flex-direction: column !important;
              overflow-y: auto !important;
              margin: auto !important;
            }

            /* Responsive padding */
            @media (min-width: 1024px) {
              .post-job-modal-card {
                padding: 28px 32px 32px 32px !important;
              }
            }
            @media (min-width: 640px) and (max-width: 1023px) {
              .post-job-modal-card {
                padding: 24px !important;
              }
            }
            @media (max-width: 639px) {
              .post-job-modal-card {
                padding: 20px 16px !important;
              }
            }

            .post-job-modal-header {
              display: flex !important;
              align-items: center !important;
              justify-content: space-between !important;
              margin-bottom: 28px !important;
              width: 100% !important;
            }
            .post-job-modal-header h2 {
              margin: 0 !important;
              font-size: 24px !important;
              font-weight: 700 !important;
              line-height: 1.25 !important;
              color: var(--text-primary) !important;
            }
            .post-job-modal-close-btn {
              width: 36px !important;
              height: 36px !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              border-radius: 8px !important;
              border: 1px solid var(--border-subtle, var(--border-color)) !important;
              background-color: transparent !important;
              color: var(--text-secondary) !important;
              cursor: pointer !important;
              transition: all 0.2s ease !important;
            }
            .post-job-modal-close-btn:hover {
              background-color: var(--bg-surface-3) !important;
              color: var(--text-primary) !important;
            }

            .post-job-form {
              display: flex !important;
              flex-direction: column !important;
              gap: 22px !important;
              width: 100% !important;
            }
            .post-job-form-group {
              display: flex !important;
              flex-direction: column !important;
              gap: 8px !important;
              width: 100% !important;
            }
            .post-job-form-group label {
              font-size: 14px !important;
              font-weight: 600 !important;
              line-height: 1.4 !important;
              color: var(--text-primary) !important;
              margin-bottom: 0 !important;
            }

            .post-job-row {
              display: grid !important;
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
              gap: 20px !important;
              width: 100% !important;
            }
            @media (max-width: 639px) {
              .post-job-row {
                grid-template-columns: 1fr !important;
                gap: 22px !important;
              }
            }

            .post-job-input,
            .post-job-select {
              height: 48px !important;
              padding-left: 16px !important;
              padding-right: 16px !important;
              border-radius: 10px !important;
              font-size: 15px !important;
              border: 1px solid var(--border-subtle, var(--border-color)) !important;
              background-color: var(--input-bg, var(--bg-surface-1)) !important;
              color: var(--text-primary) !important;
              width: 100% !important;
              box-sizing: border-box !important;
              outline: none !important;
              transition: border-color 0.2s ease, box-shadow 0.2s ease !important;
            }
            .post-job-input:focus,
            .post-job-select:focus {
              border-color: var(--accent) !important;
              box-shadow: 0 0 0 3px var(--focus-ring) !important;
            }

            .post-job-textarea {
              min-height: 110px !important;
              max-height: 160px !important;
              padding: 14px 16px !important;
              border-radius: 10px !important;
              font-size: 15px !important;
              border: 1px solid var(--border-subtle, var(--border-color)) !important;
              background-color: var(--input-bg, var(--bg-surface-1)) !important;
              color: var(--text-primary) !important;
              width: 100% !important;
              box-sizing: border-box !important;
              resize: vertical !important;
              outline: none !important;
              transition: border-color 0.2s ease, box-shadow 0.2s ease !important;
            }
            .post-job-textarea:focus {
              border-color: var(--accent) !important;
              box-shadow: 0 0 0 3px var(--focus-ring) !important;
            }

            .post-job-info-msg {
              padding: 14px 16px !important;
              margin-top: 2px !important;
              border-radius: 10px !important;
              background-color: rgba(59, 130, 246, 0.05) !important;
              border: 1px solid rgba(59, 130, 246, 0.2) !important;
              color: var(--text-secondary) !important;
              font-size: 13.5px !important;
              line-height: 1.5 !important;
              width: 100% !important;
              box-sizing: border-box !important;
            }
            .post-job-info-msg strong {
              color: var(--text-primary) !important;
            }

            .post-job-btn {
              width: 100% !important;
              height: 50px !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              gap: 10px !important;
              border-radius: 10px !important;
              font-size: 16px !important;
              font-weight: 600 !important;
              margin-top: 2px !important;
              background-color: var(--accent) !important;
              color: white !important;
              border: none !important;
              cursor: pointer !important;
              transition: all 0.2s ease !important;
            }
            .post-job-btn:hover {
              background-color: var(--accent-hover) !important;
            }
            .post-job-btn:disabled {
              opacity: 0.6 !important;
              cursor: not-allowed !important;
            }
          `}</style>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.3)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              zIndex: 9999,
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="post-job-modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="post-job-modal-header">
                <h2>Post Referral Opportunity</h2>
                <button type="button" onClick={onClose} className="post-job-modal-close-btn">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Container */}
              <form onSubmit={(e) => e.preventDefault()} className="post-job-form">
                
                {/* Position Title */}
                <div className="post-job-form-group">
                  <label htmlFor="ref-title">Position Title</label>
                  <input
                    id="ref-title"
                    type="text"
                    value={referralForm.title}
                    onChange={(e) => setReferralForm({ ...referralForm, title: e.target.value })}
                    placeholder="Senior Software Engineer"
                    className="post-job-input"
                  />
                </div>

                {/* Company & Location Row */}
                <div className="post-job-row">
                  <div className="post-job-form-group">
                    <label htmlFor="ref-company">Company</label>
                    <input
                      id="ref-company"
                      type="text"
                      value={referralForm.company}
                      onChange={(e) => setReferralForm({ ...referralForm, company: e.target.value })}
                      placeholder="Tech Corp"
                      className="post-job-input"
                    />
                  </div>
                  <div className="post-job-form-group">
                    <label htmlFor="ref-location">Location</label>
                    <input
                      id="ref-location"
                      type="text"
                      value={referralForm.location}
                      onChange={(e) => setReferralForm({ ...referralForm, location: e.target.value })}
                      placeholder="San Francisco, CA"
                      className="post-job-input"
                    />
                  </div>
                </div>

                {/* Employment Type */}
                <div className="post-job-form-group">
                  <label htmlFor="ref-type">Employment Type</label>
                  <select
                    id="ref-type"
                    value={referralForm.type}
                    onChange={(e) =>
                      setReferralForm({ ...referralForm, type: e.target.value })
                    }
                    className="post-job-select"
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="internship">Internship</option>
                    <option value="contract">Contract</option>
                  </select>
                </div>

                {/* Number of Positions */}
                <div className="post-job-form-group">
                  <label htmlFor="ref-vacancy">Number of Positions</label>
                  <input
                    id="ref-vacancy"
                    type="number"
                    min="1"
                    value={referralForm.vacancy}
                    onChange={(e) => setReferralForm({ ...referralForm, vacancy: e.target.value })}
                    placeholder="e.g., 3"
                    className="post-job-input"
                  />
                </div>

                {/* Description */}
                <div className="post-job-form-group">
                  <label htmlFor="ref-description">Description</label>
                  <textarea
                    id="ref-description"
                    value={referralForm.description}
                    onChange={(e) => setReferralForm({ ...referralForm, description: e.target.value })}
                    placeholder="Describe the opportunity and your connection..."
                    className="post-job-textarea"
                  />
                </div>

                {/* Requirements */}
                <div className="post-job-form-group">
                  <label htmlFor="ref-requirements">Requirements (one per line)</label>
                  <textarea
                    id="ref-requirements"
                    value={referralForm.requirements}
                    onChange={(e) => setReferralForm({ ...referralForm, requirements: e.target.value })}
                    placeholder="5+ years experience&#10;Master's degree preferred&#10;Strong leadership skills"
                    className="post-job-textarea"
                  />
                </div>

                {/* Informational Message */}
                <div className="post-job-info-msg">
                  <strong>Referral Posting:</strong> Your referral will be saved to the database. If wallet is connected, it will also be recorded on Aptos blockchain.
                </div>

                {/* Submit Button */}
                <button
                  type="button"
                  className="post-job-btn"
                  onClick={onSubmit}
                  disabled={!referralForm.title || !referralForm.company || isCreating}
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Posting Referral...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Post Referral
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}