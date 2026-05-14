import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { HiOutlineMenuAlt2, HiOutlineBell, HiOutlineSearch } from 'react-icons/hi';
import { FiLogOut, FiSettings } from 'react-icons/fi';
import { MdCheckCircle, MdWarning, MdInfoOutline } from 'react-icons/md';
import LoadingBar from 'react-top-loading-bar';

const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'warning', title: 'Budget Exceeded', message: 'You have exceeded your monthly Food budget by ₹400.', isRead: false, time: '2h ago', icon: <MdWarning className="text-amber-500" /> },
  { id: 2, type: 'info', title: 'Recurring Due', message: 'Netflix Subscription (₹649) is due tomorrow.', isRead: false, time: '5h ago', icon: <MdInfoOutline className="text-brand-primary" /> },
  { id: 3, type: 'success', title: 'Monthly Report', message: 'Your August financial report is ready to view.', isRead: true, time: '1d ago', icon: <MdCheckCircle className="text-emerald-500" /> },
];

const TopNavbar = ({ setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const ref = useRef(null);
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  // Close dropdown when wildly clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if(!e.target.closest('.notification-container')) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const logoutHandle = async () => {
    try {
      ref.current.staticStart();
      localStorage.removeItem('User');
      toast.success("Logged out successfully");
      ref.current.complete();
      navigate('/login');
    } catch (error) {
      console.log(error.message);
    }
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({...n, isRead: true})));
  };

  const toggleRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? {...n, isRead: !n.isRead} : n));
  };

  const user = JSON.parse(localStorage.getItem('User')) || { username: 'User' };
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="sticky top-0 z-30 flex items-center justify-between h-20 px-4 md:px-8 bg-brand-900/80 backdrop-blur-md border-b border-white/5">
      <LoadingBar color='#6366F1' ref={ref} height={3} />
      
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-slate-400 hover:text-white transition-colors md:hidden focus-animation rounded-lg"
        >
          <HiOutlineMenuAlt2 size={24} />
        </button>
        
        <div className="hidden md:flex items-center bg-brand-800/80 border border-white/10 rounded-xl px-4 py-2 hover:border-brand-primary/50 transition-colors">
          <HiOutlineSearch size={20} className="text-slate-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            className="bg-transparent border-none outline-none text-white placeholder-slate-500 w-64"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        {/* Notification Bell */}
        <div className="relative notification-container">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 transition-colors focus-animation rounded-lg group ${showNotifications ? 'text-white bg-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <HiOutlineBell size={24} className={unreadCount > 0 ? "group-hover:animate-swing" : ""} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 flex h-2 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-accent"></span>
              </span>
            )}
          </button>

          {/* Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 glass-panel border border-white/10 rounded-2xl shadow-xl shadow-black/50 overflow-hidden origin-top-right animate-fade-in-up z-50">
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-brand-800/90">
                <h3 className="font-bold text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs font-semibold text-brand-primary hover:text-indigo-400 transition-colors">Mark all read</button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? notifications.map(notif => (
                  <div 
                    key={notif.id} 
                    className={`p-4 border-b border-white/5 flex gap-4 hover:bg-white/5 transition-colors cursor-pointer ${!notif.isRead ? 'bg-brand-primary/5' : ''}`}
                    onClick={() => toggleRead(notif.id)}
                  >
                    <div className="pt-1">{notif.icon}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`text-sm font-semibold ${!notif.isRead ? 'text-white' : 'text-slate-300'}`}>{notif.title}</h4>
                        <span className="text-[10px] font-medium text-slate-500 whitespace-nowrap">{notif.time}</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{notif.message}</p>
                    </div>
                    {!notif.isRead && <div className="w-2 h-2 rounded-full bg-brand-primary mt-1.5 self-center"></div>}
                  </div>
                )) : (
                  <div className="p-8 text-center text-slate-500 text-sm">No notifications available.</div>
                )}
              </div>
              <div className="p-3 border-t border-white/10 bg-brand-900/50 text-center hover:bg-brand-800 transition-colors cursor-pointer">
                <span className="text-xs font-semibold text-slate-400 hover:text-white transition-colors">View All Settings</span>
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-white/10 hidden sm:block"></div>

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-white">{user.username}</p>
            <Link to="/settings" className="text-xs text-brand-primary hover:underline hover:text-indigo-300 transition-colors">Profile & Settings</Link>
          </div>
          
          <Link to="/settings" className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-brand-primary/20 hover:scale-105 transition-transform duration-200 cursor-pointer border border-white/10">
            {user.username?.charAt(0).toUpperCase() || 'U'}
          </Link>

          <button 
            onClick={logoutHandle}
            className="ml-1 p-2 text-slate-400 hover:text-brand-danger transition-colors focus-animation rounded-lg group hidden sm:block"
            title="Log out"
          >
            <FiLogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;