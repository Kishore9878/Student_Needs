import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import { Navigate } from 'react-router-dom';

const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  if (!localStorage.getItem("User")) {
    return <Navigate to='/expenses-tracker/login' />;
  }

  return (
    <div className="expenses-layout font-inter">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <main className="expenses-main">
        <TopNavbar setIsSidebarOpen={setIsSidebarOpen} />
        
        <div className="expenses-content scroll-smooth">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
