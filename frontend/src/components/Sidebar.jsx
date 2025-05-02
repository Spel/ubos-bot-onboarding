import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getFromStorage, saveToStorage, STORAGE_KEYS } from "../utils/localStorage";

export default function Sidebar({ darkMode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const userEmail = getFromStorage(STORAGE_KEYS.USER_EMAIL, 'user@example.com');
  const credits = getFromStorage(STORAGE_KEYS.CREDITS, 2592000); // Default to 2,592,000 TPU-seconds

  // Format credits in a readable way
  const formatCredits = (tpuSeconds) => {
    if (tpuSeconds >= 1000000) {
      return `${(tpuSeconds / 1000000).toFixed(2)}M`;
    } else if (tpuSeconds >= 1000) {
      return `${(tpuSeconds / 1000).toFixed(1)}K`;
    }
    return tpuSeconds.toString();
  };
  
  // Handle logout
  const handleLogout = () => {
    // Clear authentication state
    saveToStorage(STORAGE_KEYS.IS_AUTHENTICATED, false);
    saveToStorage(STORAGE_KEYS.USER_EMAIL, '');
    
    // Redirect to login page
    navigate('/login');
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
          <ul className="flex flex-col space-y-1">
            {/* Dashboard */}
            <li>
              <Link 
                to="/dashboard" 
                className={`flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg ${
                  currentPath === '/dashboard' || currentPath === '/' 
                    ? (darkMode ? 'bg-neutral-800 text-white' : 'bg-gray-100 text-gray-800')
                    : (darkMode ? 'text-neutral-400 hover:bg-neutral-800' : 'text-gray-700 hover:bg-gray-100')
                }`}
              >
                <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                Dashboard
              </Link>
            </li>
            
            {/* My Bots */}
            <li>
              <Link 
                to="/my-bots" 
                className={`flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg ${
                  currentPath === '/my-bots' 
                    ? (darkMode ? 'bg-neutral-800 text-white' : 'bg-gray-100 text-gray-800')
                    : (darkMode ? 'text-neutral-400 hover:bg-neutral-800' : 'text-gray-700 hover:bg-gray-100')
                }`}
              >
                <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <circle cx="15.5" cy="8.5" r="1.5" />
                  <path d="M8.5 13.5c0 1.5 1.5 3 3.5 3s3.5-1.5 3.5-3" />
                </svg>
                My Bots
              </Link>
            </li>
          </ul>
        </nav>
        
        {/* User section at bottom */}
        <div className="mt-auto p-3">
          {/* Credits indicator */}
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-neutral-800' : 'bg-gray-100'} mb-3`}>
            <div className="flex items-center justify-between mb-1">
              <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>TPU Credits</span>
              <span className={`text-xs font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                {formatCredits(credits)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${Math.min(100, (credits / 2592000) * 100)}%` }}
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