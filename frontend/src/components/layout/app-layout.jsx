import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { getFromStorage, saveToStorage, STORAGE_KEYS } from "../../utils/localStorage";
import { SidebarProvider, SidebarInset } from "../ui/sidebar";
import { AppSidebar } from "../sidebar/app-sidebar";

/**
 * Main application layout with sidebar
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 */
export function AppLayout({ children }) {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(getFromStorage(STORAGE_KEYS.DARK_MODE, false));
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const userEmail = getFromStorage(STORAGE_KEYS.USER_EMAIL, null);
    const email = getFromStorage(STORAGE_KEYS.EMAIL, null);
    const isAuthenticated = getFromStorage(STORAGE_KEYS.IS_AUTHENTICATED, false);
    
    const loggedIn = !!(userEmail || email || isAuthenticated);
    setIsLoggedIn(loggedIn);
  }, [location.pathname]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    saveToStorage(STORAGE_KEYS.DARK_MODE, newDarkMode);
    
    // Apply dark mode to body
    if (newDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  };

  // Handle logout
  const handleLogout = () => {
    // Use the existing clearAuthData function from the current sidebar
    if (typeof window !== 'undefined') {
      const { clearAuthData } = require('../../utils/localStorage');
      clearAuthData();
      window.location.href = '/login';
    }
  };

  // Apply dark mode on initial load
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  // Don't show sidebar for login, onboarding, and product landing pages
  const noSidebarRoutes = ['/login', '/onboarding', '/product', '/agentviewimproved', '/agent'];
  const showSidebar = isLoggedIn && !noSidebarRoutes.some(route => location.pathname.toLowerCase().startsWith(route));

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-neutral-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {showSidebar ? (
        <SidebarProvider defaultOpen={true}>
          <AppSidebar 
            darkMode={darkMode}
            onToggleDarkMode={toggleDarkMode}
            onLogout={handleLogout}
          />
          <SidebarInset className="flex flex-col min-h-screen">
            <div className="relative flex min-h-svh flex-1 flex-col bg-background peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow ">
              {children || <Outlet />}
            </div>
          </SidebarInset>
        </SidebarProvider>
      ) : (
        <main className="min-h-screen">
          {children || <Outlet />}
        </main>
      )}
    </div>
  );
}
