import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getFromStorage, saveToStorage, clearAuthData, STORAGE_KEYS } from "../utils/localStorage";

export default function Sidebar({ darkMode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [isCreatorMode, setIsCreatorMode] = useState(getFromStorage(STORAGE_KEYS.USER_MODE, 'user') === 'creator');
  const userEmail = getFromStorage(STORAGE_KEYS.USER_EMAIL, 'user@example.com');
  const tpuSeconds = getFromStorage(STORAGE_KEYS.CREDITS, 2592000);
  const usedTpuSeconds = Math.round(tpuSeconds * 0.67);
  const remainingTpuSeconds = tpuSeconds - usedTpuSeconds;
  const tpuHours = Math.round(tpuSeconds / 3600);
  const usedTpuHours = Math.round(usedTpuSeconds / 3600);

  // Toggle between user and creator modes
  const toggleMode = () => {
    const newMode = !isCreatorMode;
    setIsCreatorMode(newMode);
    saveToStorage(STORAGE_KEYS.USER_MODE, newMode ? 'creator' : 'user');
  };

  // Format helpers
  const formatCredits = (tpuSeconds) => {
    if (tpuSeconds >= 1000000) return `${(tpuSeconds / 1000000).toFixed(2)}M`;
    if (tpuSeconds >= 1000) return `${(tpuSeconds / 1000).toFixed(1)}K`;
    return tpuSeconds.toString();
  };
  
  const formatHours = (hours) => {
    if (hours >= 1000) return `${(hours / 1000).toFixed(1)}K`;
    return hours.toString();
  };
  
  const handleLogout = () => {
    clearAuthData();
    navigate('/login');
  };

  return (
    <div className={`hidden lg:flex flex-col w-64 h-screen border-e fixed left-0 top-0 bottom-0 z-50 bg-white border-gray-200 ${darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-gray-200'} border-r`}>
      <div className="flex flex-col h-full overflow-y-auto">
        {/* Logo */}
        <div className="px-6 pt-6 pb-4 flex items-center">
          <Link to="/" className={`flex items-center gap-1 text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          <svg width="17" height="19" viewBox="0 0 17 19" fill="none" style={{width: '25px', height: '25px'}}><path d="M16.8817 11.255L14.0684 12.6617L11.2551 11.255L14.0684 9.84839L16.8817 11.255Z" fill="#66CBE2"></path><path d="M14.0683 12.6617C13.5453 13.7063 12.7419 14.5847 11.748 15.1986C10.7541 15.8125 9.60898 16.1376 8.44079 16.1376C7.2726 16.1376 6.12746 15.8125 5.13357 15.1986C4.13969 14.5847 3.33628 13.7063 2.81329 12.6617L5.62662 11.2551C5.88803 11.7776 6.28974 12.217 6.78678 12.5241C7.28381 12.8312 7.85653 12.9939 8.44079 12.9939C9.02505 12.9939 9.59777 12.8312 10.0948 12.5241C10.5918 12.217 10.9936 11.7776 11.255 11.2551L14.0683 12.6617Z" fill="#41B1E5"></path><path d="M5.62665 11.255L2.81332 12.6617L0 11.255L2.81332 9.84839L5.62665 11.255Z" fill="#66CBE2"></path><path d="M16.8816 11.2551C16.8824 11.2613 16.8824 11.2676 16.8816 11.2738C16.5443 13.2675 15.5119 15.0773 13.9674 16.3824C12.423 17.6875 10.4662 18.4036 8.4442 18.4036C6.42216 18.4036 4.46544 17.6875 2.92098 16.3824C1.37652 15.0773 0.344097 13.2675 0.0067749 11.2738C0.00757591 11.2676 0.00757591 11.2613 0.0067749 11.2551L2.8201 12.6617C3.34309 13.7063 4.14649 14.5847 5.14038 15.1986C6.13427 15.8125 7.27941 16.1376 8.4476 16.1376C9.61579 16.1376 10.7609 15.8125 11.7548 15.1986C12.7487 14.5847 13.5521 13.7063 14.0751 12.6617L16.8816 11.2551Z" fill="#5279BC"></path><path d="M14.0684 2.81334V8.44169L11.2551 7.03333V1.40668L14.0684 2.81334Z" fill="#41B1E5"></path><path d="M16.8817 1.40666L14.0684 2.81332L11.2551 1.40666L14.0684 0L16.8817 1.40666Z" fill="#66CBE2"></path><path d="M16.8817 1.40668V7.03333L14.0684 8.44169V2.81334L16.8817 1.40668Z" fill="#5279BC"></path><path d="M5.62665 1.40666L2.81332 2.81332L0 1.40666L2.81332 0L5.62665 1.40666Z" fill="#66CBE2"></path><path d="M2.81332 2.81334V8.44169L0 7.03333V1.40668L2.81332 2.81334Z" fill="#41B1E5"></path><path d="M5.62662 1.40668V7.03333L2.81329 8.44169V2.81334L5.62662 1.40668Z" fill="#5279BC"></path></svg>
            <span className="px-2">Agentspace</span>
          </Link>
        </div>

        {/* Mode Toggle Switch */}
        <div className="px-3 py-2">
          <div className="flex p-[2px] rounded-lg bg-gray-100 dark:bg-neutral-800" style={{ minHeight: '34px' }}>
            <button
              onClick={() => isCreatorMode && toggleMode()}
              className={`relative flex-1 flex items-center justify-center gap-1.5 rounded-md text-xs font-medium transition-all duration-300 ${
                !isCreatorMode 
                  ? 'bg-white dark:bg-neutral-700 text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
              }`}
              style={{ height: '30px' }}
            >
              <svg className="size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.5 12C17.5 13.3807 16.3807 14.5 15 14.5C13.6193 14.5 12.5 13.3807 12.5 12C12.5 10.6193 13.6193 9.5 15 9.5C16.3807 9.5 17.5 10.6193 17.5 12Z"/>
                <path d="M15 5.5V3"/>
                <path d="M15 21V18.5"/>
                <path d="M19.6642 7.33579L21.4853 5.51472"/>
                <path d="M8.51472 18.4853L10.3358 16.6642"/>
                <path d="M21.5 12H19"/>
                <path d="M11 12H8.5"/>
                <path d="M19.6642 16.6642L21.4853 18.4853"/>
                <path d="M8.51472 5.51472L10.3358 7.33579"/>
              </svg>
              User
            </button>

            <button
              onClick={() => !isCreatorMode && toggleMode()}
              className={`relative flex-1 flex items-center justify-center gap-1.5 rounded-md text-xs font-medium transition-all duration-300 ${
                isCreatorMode 
                  ? 'bg-white dark:bg-neutral-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
              }`}
              style={{ height: '30px' }}
            >
              <svg className="size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 3H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z" />
                <path d="M12 11h.01" />
                <path d="M12 8h.01" />
                <path d="M12 14h.01" />
                <path d="M12 17h.01" />
              </svg>
              Creator
            </button>
          </div>
        </div>

        <div className={`mx-4 mb-2 border-b ${darkMode ? 'border-neutral-800' : 'border-gray-200'}`}></div>
        
        {/* Navigation */}
        <nav className="p-3 w-full flex flex-col flex-wrap flex-grow">
          <ul className="space-y-1.5">
            {/* Common menu items for both modes */}
            <li>
              <Link 
                to="/home" 
                className={`flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-md ${
                  currentPath === '/home' || currentPath === '/' 
                    ? (darkMode ? 'bg-neutral-700 text-white' : 'bg-gray-100 text-blue-600')
                    : (darkMode ? 'text-gray-400 hover:bg-neutral-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600')
                }`}
              >
                <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                Home
              </Link>
            </li>

            {/* Chat - Available in both modes */}
            <li>
              <Link 
                to="/global-chat" 
                className={`flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-md ${
                  currentPath === '/global-chat' 
                    ? (darkMode ? 'bg-neutral-700 text-white' : 'bg-gray-100 text-blue-600')
                    : (darkMode ? 'text-gray-400 hover:bg-neutral-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600')
                }`}
              >
                <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"/>
                  <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/>
                </svg>
                Chat
              </Link>
            </li>

            {/* Marketplace - Available in both modes */}
            <li>
              <Link 
                to="/marketplace" 
                className={`flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-md ${
                  currentPath === '/marketplace' 
                    ? (darkMode ? 'bg-neutral-700 text-white' : 'bg-gray-100 text-blue-600')
                    : (darkMode ? 'text-gray-400 hover:bg-neutral-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600')
                }`}
              >
                <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path>
                  <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"></path>
                  <path d="M12 3v6"></path>
                </svg>
                Marketplace
              </Link>
            </li>

            {/* Creator mode specific items */}
            {isCreatorMode && (
              <>
                <li className="pt-5 pb-2">
                  <div className="px-2">
                    <h3 className={`text-xs font-semibold uppercase ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Agent Management</h3>
                  </div>
                </li>
                <li>
                  <Link 
                    to="/dashboard" 
                    className={`flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-md ${
                      currentPath === '/dashboard' 
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
                    My Agents
                  </Link>
                </li>

              
                <li>
                  <Link 
                    to="/company-management" 
                    className={`flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-md ${
                      currentPath === '/company-management' 
                        ? (darkMode ? 'bg-neutral-700 text-white' : 'bg-gray-100 text-blue-600')
                        : (darkMode ? 'text-gray-400 hover:bg-neutral-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600')
                    }`}
                  >
                    <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <path d="M9 22V12h6v10"></path>
                    </svg>
                    My Company
                  </Link>
                </li>
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

       

                <li className="pt-5 pb-2">
                  <div className="px-2">
                    <h3 className={`text-xs font-semibold uppercase ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Administration</h3>
                  </div>
                </li>
                <li>
                  <Link 
                    to="/admin" 
                    className={`flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-md ${
                      currentPath === '/admin' 
                        ? (darkMode ? 'bg-neutral-700 text-white' : 'bg-gray-100 text-blue-600')
                        : (darkMode ? 'text-gray-400 hover:bg-neutral-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600')
                    }`}
                  >
                   <svg class="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    Admin
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
        
        {/* User section at bottom */}
        <div className="mt-auto p-3">


          {/* Credits indicator */}
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-neutral-800' : 'bg-gray-50'} mb-3`}>
            <div className="mb-1">
              <span className={`text-xs font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                FREE PLAN
              </span>
            </div>
            
            <div className="flex items-center gap-1 mb-1">
              <svg className="size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              <span className={`text-xs font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Credits</span>
              <span className={`text-xs font-medium ml-auto ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                {formatCredits(remainingTpuSeconds)}/{formatCredits(tpuSeconds)}
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700 mb-1">
              <div 
                className="bg-green-500 h-1.5 rounded-full" 
                style={{ width: `${Math.min(100, (usedTpuSeconds / tpuSeconds) * 100)}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <span className={`text-[10px] ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Resets monthly
              </span>
              <Link 
                to="/subscription-plans"
                className={`text-[10px] ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
              >
                Manage plan →
              </Link>
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
    </div>
  );
}