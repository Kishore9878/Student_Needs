import React from 'react';
import { toast } from 'sonner';
import { Check, X, AlertTriangle, Info, Loader2 } from 'lucide-react';

// Track the last success toast to prevent duplicate stacking
let lastSuccessToastId = null;

/**
 * showToast Utility
 * Renders a custom styled, accessible, and high-contrast toast notification using Sonner.
 * Handles both signature formats:
 *   - showToast(message, type)
 *   - showToast({ type, message, description })
 */
export function showToast(param1, param2) {
  let type = 'info';
  let title = '';
  let desc = '';
  let action = null;

  if (param1 && typeof param1 === 'object') {
    type = param1.type || 'info';
    desc = param1.description || '';
    action = param1.action || null;
    
    if (param1.title) {
      title = param1.title;
    } else if (param1.message) {
      const msg = param1.message;
      const isTitleLike = 
        msg.toLowerCase().includes("successfully") || 
        msg.toLowerCase().includes("success") || 
        msg.toLowerCase().includes("sent") ||
        desc !== '';

      if (isTitleLike) {
        title = msg;
      } else {
        const isLogin = 
          msg.toLowerCase().includes("welcome") || 
          msg.toLowerCase().includes("login") || 
          msg.toLowerCase().includes("logged") || 
          msg.toLowerCase().includes("authenticate") ||
          msg.toLowerCase().includes("parameters") ||
          window.location.pathname.includes("social-success") ||
          window.location.pathname.includes("login");
        
        const isLogout = 
          msg.toLowerCase().includes("logout") || 
          msg.toLowerCase().includes("logged out");

        if (isLogin) {
          title = type === 'success' ? 'Login Successful' : 'Login Failed';
          desc = msg;
        } else if (isLogout) {
          title = 'Logout Successful';
          desc = msg;
        } else {
          title = type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Notification';
          desc = msg;
        }
      }
    }
  } else if (typeof param1 === 'string') {
    type = param2 || 'info';
    const msg = param1;

    const isTitleLike = 
      msg.toLowerCase().includes("successfully") || 
      msg.toLowerCase().includes("success") || 
      msg.toLowerCase().includes("sent");

    if (isTitleLike) {
      title = msg;
      desc = '';
    } else {
      const isLogin = 
        msg.toLowerCase().includes("welcome") || 
        msg.toLowerCase().includes("login") || 
        msg.toLowerCase().includes("logged") || 
        msg.toLowerCase().includes("authenticate") || 
        msg.toLowerCase().includes("parameters") ||
        window.location.pathname.includes("social-success") ||
        window.location.pathname.includes("login");

      const isLogout = 
        msg.toLowerCase().includes("logout") || 
        msg.toLowerCase().includes("logged out");

      if (isLogin) {
        title = type === 'success' ? 'Login Successful' : 'Login Failed';
        desc = msg;
      } else if (isLogout) {
        title = 'Logout Successful';
        desc = msg;
      } else {
        title = type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Notification';
        desc = msg;
      }
    }
  }

  // Prevent multiple success toasts from stacking on top of each other
  if (type === 'success' && lastSuccessToastId !== null) {
    toast.dismiss(lastSuccessToastId);
  }

  // Render custom premium toast notification using toast.custom
  const toastId = toast.custom((t) => {
    let Icon = Info;
    let iconColorClass = "text-primary";
    let iconBgGradientClass = "from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10";
    let iconBorderClass = "border-primary/20 dark:border-primary/30";
    let indicatorGradientClass = "bg-gradient-to-b from-blue-400 to-indigo-500";
    
    if (type === 'success') {
      Icon = Check;
      iconColorClass = "text-emerald-600 dark:text-emerald-400";
      iconBgGradientClass = "from-emerald-500/10 to-teal-500/5 dark:from-emerald-500/20 dark:to-teal-500/10";
      iconBorderClass = "border-emerald-500/20 dark:border-emerald-400/30";
      indicatorGradientClass = "bg-gradient-to-b from-emerald-400 to-teal-500";
    } else if (type === 'error') {
      Icon = X;
      iconColorClass = "text-rose-600 dark:text-rose-400";
      iconBgGradientClass = "from-rose-500/10 to-red-500/5 dark:from-rose-500/20 dark:to-red-500/10";
      iconBorderClass = "border-rose-500/20 dark:border-rose-400/30";
      indicatorGradientClass = "bg-gradient-to-b from-rose-400 to-red-500";
    } else if (type === 'warning') {
      Icon = AlertTriangle;
      iconColorClass = "text-amber-600 dark:text-amber-400";
      iconBgGradientClass = "from-amber-500/10 to-orange-500/5 dark:from-amber-500/20 dark:to-orange-500/10";
      iconBorderClass = "border-amber-500/20 dark:border-amber-400/30";
      indicatorGradientClass = "bg-gradient-to-b from-amber-400 to-orange-500";
    } else if (type === 'pending') {
      Icon = Loader2;
      iconColorClass = "text-blue-500 animate-spin";
      iconBgGradientClass = "from-blue-500/10 to-indigo-500/5 dark:from-blue-500/20 dark:to-indigo-500/10";
      iconBorderClass = "border-blue-500/20 dark:border-blue-400/30";
      indicatorGradientClass = "bg-gradient-to-b from-blue-400 to-indigo-500";
    }

    return (
      <div 
        className="sonner-toast-custom flex items-center pointer-events-auto select-none relative"
        style={{ boxSizing: "border-box" }}
      >
        {/* Left Vertical Status Indicator */}
        <div className={`absolute left-[6px] top-[15%] w-[4px] h-[70%] rounded-full ${indicatorGradientClass}`} />

        {/* Column 1: Premium Icon container (48px fixed width, centered) */}
        <div className="w-12 flex items-center justify-start shrink-0">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${iconBgGradientClass} border ${iconBorderClass} flex items-center justify-center relative shadow-inner`}>
            {/* Subtle glow layer */}
            <div className="absolute inset-0 rounded-full bg-white/10 dark:bg-white/5 opacity-50 blur-[2px]" />
            <Icon className={`w-[22px] h-[22px] ${iconColorClass} relative z-10`} />
          </div>
        </div>

        {/* Column 2: Title + Message (flex-1) */}
        <div className="flex-1 flex flex-col justify-center min-w-0 pl-[16px] pr-[40px]">
          <h4 className="text-[17px] font-bold tracking-tight leading-tight text-slate-900 dark:text-slate-100">
            {title}
          </h4>
          {desc && (
            <p className="text-[14px] font-medium leading-[1.5] mt-1.5 break-words text-slate-500 dark:text-slate-400">
              {desc}
            </p>
          )}
          {action && (
            <button
              onClick={() => {
                toast.dismiss(t);
                action.onClick();
              }}
              className="mt-2.5 px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold rounded-[var(--radius-sm)] shadow-[var(--shadow-sm)] transition-all text-center flex items-center justify-center gap-1.5 w-full sm:w-auto self-start cursor-pointer font-medium"
            >
              {action.label}
            </button>
          )}
        </div>

        {/* Close Button: Positioned absolutely at top-4 right-4 */}
        <button 
          onClick={() => toast.dismiss(t)} 
          className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all duration-200 focus:outline-none cursor-pointer"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }, {
    duration: type === 'pending' ? Infinity : 5000
  });

  if (type === 'success') {
    lastSuccessToastId = toastId;
  }

  return toastId;
}

/**
 * dismissToast
 * Removes a toast by ID from queue.
 */
export function dismissToast(toastId) {
  toast.dismiss(toastId);
}

/**
 * showTransactionToast
 * Alias for backward compatibility.
 */
export function showTransactionToast({ type, message }) {
  return showToast({ type, message });
}