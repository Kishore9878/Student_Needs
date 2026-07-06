import React from 'react';
import { cn } from '@/lib/Referrals/utils.js';
import { ChevronRight } from 'lucide-react';

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
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl mt-5 mb-6 px-6 shadow-sm flex items-center justify-between relative overflow-hidden">
      <div className="flex items-center flex-1 overflow-x-auto no-scrollbar">
        {tabs.map((tab, idx) => {
          const isActive = activeTab === tab.id;
          return (
            <React.Fragment key={tab.id}>
              <button
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'relative py-4 px-4 text-sm sm:text-base font-semibold transition-colors duration-200 focus:outline-none select-none cursor-pointer',
                  isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                )}
              >
                <span>{tab.label}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-blue-600 dark:bg-blue-500 rounded-t-md" />
                )}
              </button>
              {idx < tabs.length - 1 && (
                <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 mx-2 flex-shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>
      <div className="flex items-center pl-4 text-slate-400 dark:text-slate-500 cursor-pointer hover:text-slate-600 dark:hover:text-slate-350 transition-colors">
        <ChevronRight className="w-5 h-5" />
      </div>
    </div>
  );
}