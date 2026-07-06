import React from 'react';
import { cn } from '@/lib/Referrals/utils.js';

/**
 * Tab navigation for the Alumni Dashboard.
 * @param {Object} props
 * @param {'jobs' | 'candidates' | 'referrals' | 'applications' | 'profile'} props.activeTab - Currently active tab
 * @param {Function} props.setActiveTab - State setter to change the active tab
 */
export function AlumniTabNavigation({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'referrals', label: 'My Referrals' },
    { id: 'jobs', label: 'Posted Jobs' },
    { id: 'applications', label: 'Applications' },
    { id: 'candidates', label: 'Verified Candidates' },
    { id: 'profile', label: 'Profile' },
  ];

  return (
    <div 
      className="w-full border rounded-lg mt-5 mb-6 shadow-sm flex items-center justify-between relative overflow-hidden"
      style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }}
    >
      <div className="flex items-center flex-1 overflow-x-auto no-scrollbar">
        {tabs.map((tab, idx) => {
          const isActive = activeTab === tab.id;
          return (
            <React.Fragment key={tab.id}>
              <button
                onClick={() => setActiveTab(tab.id)}
                className="relative flex-1 text-center text-sm sm:text-base font-semibold transition-all duration-200 focus:outline-none select-none cursor-pointer hover:bg-slate-50"
                style={{ 
                  color: isActive ? '#2563eb' : '#475569',
                  backgroundColor: '#ffffff',
                  paddingTop: '20px',
                  paddingBottom: '20px'
                }}
              >
                <span>{tab.label}</span>
                {isActive && (
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t-sm" 
                    style={{ backgroundColor: '#2563eb' }}
                  />
                )}
              </button>
              {idx < tabs.length - 1 && (
                <div 
                  className="h-6 w-px flex-shrink-0" 
                  style={{ backgroundColor: '#e2e8f0' }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}