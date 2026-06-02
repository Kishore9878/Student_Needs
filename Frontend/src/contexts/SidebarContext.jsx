import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";

const SidebarContext = createContext(undefined);

export const SidebarProvider = ({ children }) => {
  const [isCollapsed, setIsCollapsedState] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sidebar-collapsed") === "true";
    }
    return false;
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsCollapsedState((prev) => {
      const next = !prev;
      localStorage.setItem("sidebar-collapsed", String(next));
      return next;
    });
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  // Accessibility: Close mobile drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeMobileMenu();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeMobileMenu]);

  const value = useMemo(() => ({
    isCollapsed,
    setIsCollapsed: (collapsed) => {
      setIsCollapsedState(collapsed);
      localStorage.setItem("sidebar-collapsed", String(collapsed));
    },
    toggleSidebar,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu
  }), [isCollapsed, toggleSidebar, isMobileMenuOpen, toggleMobileMenu, closeMobileMenu]);

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};
