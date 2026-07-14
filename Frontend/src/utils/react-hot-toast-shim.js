import React from 'react';
import { toast as sonnerToast } from 'sonner';
import { showToast } from '../components/Referrals/TransactionToast';
import { X, Check, Info } from 'lucide-react';

// Custom wrapper to bridge react-hot-toast calls to our premium showToast helper
const toast = (message, options) => {
  if (React.isValidElement(message)) {
    return sonnerToast.custom((t) => 
      React.createElement("div", {
        className: "sonner-toast-custom flex items-center pointer-events-auto select-none relative",
        style: { boxSizing: "border-box" }
      },
        React.createElement("div", {
          className: "absolute left-[6px] top-[15%] w-[4px] h-[70%] rounded-full bg-gradient-to-b from-blue-400 to-indigo-500"
        }),
        React.createElement("div", {
          className: "w-12 flex items-center justify-start shrink-0"
        },
          React.createElement("div", {
            className: "w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border border-blue-500/20 flex items-center justify-center relative shadow-inner"
          },
            React.createElement(Info, { className: "w-[22px] h-[22px] text-blue-500 relative z-10" })
          )
        ),
        React.createElement("div", {
          className: "flex-1 flex flex-col justify-center min-w-0 pl-[16px] pr-[40px]"
        }, message),
        React.createElement("button", {
          onClick: () => sonnerToast.dismiss(t),
          className: "absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200 cursor-pointer"
        },
          React.createElement(X, { className: "w-4 h-4" })
        )
      ), 
      options
    );
  }
  return showToast(message, 'info');
};

toast.success = (message, options) => {
  if (React.isValidElement(message)) {
    return sonnerToast.custom((t) => 
      React.createElement("div", {
        className: "sonner-toast-custom flex items-center pointer-events-auto select-none relative",
        style: { boxSizing: "border-box" }
      },
        React.createElement("div", {
          className: "absolute left-[6px] top-[15%] w-[4px] h-[70%] rounded-full bg-gradient-to-b from-emerald-400 to-teal-500"
        }),
        React.createElement("div", {
          className: "w-12 flex items-center justify-start shrink-0"
        },
          React.createElement("div", {
            className: "w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 flex items-center justify-center relative shadow-inner"
          },
            React.createElement(Check, { className: "w-[22px] h-[22px] text-emerald-600 relative z-10" })
          )
        ),
        React.createElement("div", {
          className: "flex-1 flex flex-col justify-center min-w-0 pl-[16px] pr-[40px]"
        }, message),
        React.createElement("button", {
          onClick: () => sonnerToast.dismiss(t),
          className: "absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200 cursor-pointer"
        },
          React.createElement(X, { className: "w-4 h-4" })
        )
      ),
      options
    );
  }
  return showToast({ type: 'success', message });
};

toast.error = (message, options) => {
  if (React.isValidElement(message)) {
    return sonnerToast.custom((t) => 
      React.createElement("div", {
        className: "sonner-toast-custom flex items-center pointer-events-auto select-none relative",
        style: { boxSizing: "border-box" }
      },
        React.createElement("div", {
          className: "absolute left-[6px] top-[15%] w-[4px] h-[70%] rounded-full bg-gradient-to-b from-rose-400 to-red-500"
        }),
        React.createElement("div", {
          className: "w-12 flex items-center justify-start shrink-0"
        },
          React.createElement("div", {
            className: "w-12 h-12 rounded-full bg-gradient-to-br from-rose-500/10 to-red-500/5 border border-rose-500/20 flex items-center justify-center relative shadow-inner"
          },
            React.createElement(X, { className: "w-[22px] h-[22px] text-rose-600 relative z-10" })
          )
        ),
        React.createElement("div", {
          className: "flex-1 flex flex-col justify-center min-w-0 pl-[16px] pr-[40px]"
        }, message),
        React.createElement("button", {
          onClick: () => sonnerToast.dismiss(t),
          className: "absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200 cursor-pointer"
        },
          React.createElement(X, { className: "w-4 h-4" })
        )
      ),
      options
    );
  }
  return showToast({ type: 'error', message });
};

toast.loading = (message, options) => {
  return showToast({ type: 'pending', message });
};

toast.dismiss = (id) => {
  return sonnerToast.dismiss(id);
};

toast.custom = (jsx, options) => {
  return sonnerToast.custom(jsx, options);
};

toast.promise = (promise, msgs, options) => {
  return sonnerToast.promise(promise, msgs);
};

// Export dummy Toaster component for backwards compatibility
export const Toaster = () => null;

export { toast };
export default toast;
