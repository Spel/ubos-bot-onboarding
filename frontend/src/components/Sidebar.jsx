import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getFromStorage, saveToStorage, clearAuthData, STORAGE_KEYS } from "../utils/localStorage";

export default function Sidebar({ darkMode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const userEmail = getFromStorage(STORAGE_KEYS.USER_EMAIL, 'user@example.com');
  const tpuSeconds = getFromStorage(STORAGE_KEYS.CREDITS, 2592000); // Default to 2,592,000 TPU-seconds (720 hours)
  const usedTpuSeconds = Math.round(tpuSeconds * 0.67); // 67% used
  const remainingTpuSeconds = tpuSeconds - usedTpuSeconds;
  
  // Convert TPU seconds to hours
  const tpuHours = Math.round(tpuSeconds / 3600);
  const usedTpuHours = Math.round(usedTpuSeconds / 3600);

  // Format credits in a readable way
  const formatCredits = (tpuSeconds) => {
    if (tpuSeconds >= 1000000) {
      return `${(tpuSeconds / 1000000).toFixed(2)}M`;
    } else if (tpuSeconds >= 1000) {
      return `${(tpuSeconds / 1000).toFixed(1)}K`;
    }
    return tpuSeconds.toString();
  };
  
  // Format hours in a readable way
  const formatHours = (hours) => {
    if (hours >= 1000) {
      return `${(hours / 1000).toFixed(1)}K`;
    }
    return hours.toString();
  };
  
  // Handle logout
  const handleLogout = () => {
    // Clear all authentication data using the utility function
    clearAuthData();
    
    // Use window.location.href for a full page reload and navigation
    window.location.href = '/login';
  };

  return (
    <aside className={`hidden lg:flex flex-col w-64 h-screen border-e fixed left-0 top-0 bottom-0 z-50 ${
      darkMode 
        ? 'bg-neutral-900 border-neutral-800' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex flex-col h-full overflow-y-auto">
        {/* Logo */}
        <div className="px-6 pt-6 pb-4 flex items-center">
          <Link to="/" className={`flex items-center gap-1 text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="14" cy="14" r="5" className="fill-blue-600" />
            </svg>
            <span>UBOS</span>
          </Link>
        </div>
        
        {/* UBOS Bots Title */}
        <div className="px-6 pb-4">
          <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>UBOS Bots</h2>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>AI Bot Management</p>
        </div>
        
        {/* Navigation */}
        <nav className="p-3 w-full flex flex-col flex-wrap flex-grow">
          <ul className="space-y-1.5">
            {/* Dashboard */}
            <li>
              <Link 
                to="/dashboard" 
                className={`flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-md ${
                  currentPath === '/dashboard' || currentPath === '/' 
                    ? (darkMode ? 'bg-neutral-700 text-white' : 'bg-gray-100 text-blue-600')
                    : (darkMode ? 'text-gray-400 hover:bg-neutral-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600')
                }`}
              >
                <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="7" height="9" x="3" y="3" rx="1"></rect>
                  <rect width="7" height="5" x="14" y="3" rx="1"></rect>
                  <rect width="7" height="9" x="14" y="12" rx="1"></rect>
                  <rect width="7" height="5" x="3" y="16" rx="1"></rect>
                </svg>
                Dashboard
              </Link>
            </li>
            
            {/* Templates */}
            <li>
              <Link 
                to="/templates" 
                className={`flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-md ${
                  currentPath === '/templates' 
                    ? (darkMode ? 'bg-neutral-700 text-white' : 'bg-gray-100 text-blue-600')
                    : (darkMode ? 'text-gray-400 hover:bg-neutral-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600')
                }`}
              >
                <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Templates
              </Link>
            </li>
            
            {/* My Bots */}
            <li>
              <Link 
                to="/my-bots" 
                className={`flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-md ${
                  currentPath === '/my-bots' 
                    ? (darkMode ? 'bg-neutral-700 text-white' : 'bg-gray-100 text-blue-600')
                    : (darkMode ? 'text-gray-400 hover:bg-neutral-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600')
                }`}
              >
                <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <circle cx="9" cy="9" r="2" />
                  <circle cx="15" cy="9" r="2" />
                  <path d="M6 15h12" />
                </svg>
                My Bots
              </Link>
            </li>
            
            {/* Admin */}
            <li>
              <Link 
                to="/admin" 
                className={`flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-md ${
                  currentPath === '/admin' 
                    ? (darkMode ? 'bg-neutral-700 text-white' : 'bg-gray-100 text-blue-600')
                    : (darkMode ? 'text-gray-400 hover:bg-neutral-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600')
                }`}
              >
                <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                Admin
              </Link>
            </li>
          </ul>
        </nav>
        
        {/* User section at bottom */}
        <div className="mt-auto p-3">
          {/* Subscription upgrade button */}
          <Link 
            to="/subscription-plans" 
            className={`flex items-center justify-center gap-x-2 py-2 px-4 mb-3 rounded-lg ${
              darkMode 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            } transition-colors`}
          >
            <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
            Upgrade Plan
          </Link>
          
          {/* Credits indicator */}
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-neutral-800' : 'bg-gray-100'} mb-3`}>
            <div className="flex items-center justify-between mb-1">
              <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Agent Hours Used</span>
              <span className={`text-xs font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                {formatHours(usedTpuHours)} / {formatHours(tpuHours)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${Math.min(100, (usedTpuSeconds / tpuSeconds) * 100)}%` }}
              ></div>
            </div>
          </div>
          
          {/* User profile */}
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-neutral-800' : 'bg-gray-100'} mb-3`}>
            <div className="flex items-center gap-3">
              <div className={`size-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-blue-600' : 'bg-blue-100'}`}>
                <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-blue-600'}`}>
                  {userEmail.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {userEmail}
                </p>
              </div>
            </div>
          </div>
          
          {/* Logout button */}
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg ${
              darkMode ? 'text-red-400 hover:bg-neutral-800' : 'text-red-600 hover:bg-gray-100'
            }`}
          >
            <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
} 