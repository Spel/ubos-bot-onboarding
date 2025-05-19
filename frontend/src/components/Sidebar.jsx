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
    
    // Navigate to login using React Router's navigate
    // This ensures proper routing with HashRouter
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
          <svg width="17" height="19" viewBox="0 0 17 19" fill="none" ><path d="M16.8817 11.255L14.0684 12.6617L11.2551 11.255L14.0684 9.84839L16.8817 11.255Z" fill="#66CBE2"></path><path d="M14.0683 12.6617C13.5453 13.7063 12.7419 14.5847 11.748 15.1986C10.7541 15.8125 9.60898 16.1376 8.44079 16.1376C7.2726 16.1376 6.12746 15.8125 5.13357 15.1986C4.13969 14.5847 3.33628 13.7063 2.81329 12.6617L5.62662 11.2551C5.88803 11.7776 6.28974 12.217 6.78678 12.5241C7.28381 12.8312 7.85653 12.9939 8.44079 12.9939C9.02505 12.9939 9.59777 12.8312 10.0948 12.5241C10.5918 12.217 10.9936 11.7776 11.255 11.2551L14.0683 12.6617Z" fill="#41B1E5"></path><path d="M5.62665 11.255L2.81332 12.6617L0 11.255L2.81332 9.84839L5.62665 11.255Z" fill="#66CBE2"></path><path d="M16.8816 11.2551C16.8824 11.2613 16.8824 11.2676 16.8816 11.2738C16.5443 13.2675 15.5119 15.0773 13.9674 16.3824C12.423 17.6875 10.4662 18.4036 8.4442 18.4036C6.42216 18.4036 4.46544 17.6875 2.92098 16.3824C1.37652 15.0773 0.344097 13.2675 0.0067749 11.2738C0.00757591 11.2676 0.00757591 11.2613 0.0067749 11.2551L2.8201 12.6617C3.34309 13.7063 4.14649 14.5847 5.14038 15.1986C6.13427 15.8125 7.27941 16.1376 8.4476 16.1376C9.61579 16.1376 10.7609 15.8125 11.7548 15.1986C12.7487 14.5847 13.5521 13.7063 14.0751 12.6617L16.8816 11.2551Z" fill="#5279BC"></path><path d="M14.0684 2.81334V8.44169L11.2551 7.03333V1.40668L14.0684 2.81334Z" fill="#41B1E5"></path><path d="M16.8817 1.40666L14.0684 2.81332L11.2551 1.40666L14.0684 0L16.8817 1.40666Z" fill="#66CBE2"></path><path d="M16.8817 1.40668V7.03333L14.0684 8.44169V2.81334L16.8817 1.40668Z" fill="#5279BC"></path><path d="M5.62665 1.40666L2.81332 2.81332L0 1.40666L2.81332 0L5.62665 1.40666Z" fill="#66CBE2"></path><path d="M2.81332 2.81334V8.44169L0 7.03333V1.40668L2.81332 2.81334Z" fill="#41B1E5"></path><path d="M5.62662 1.40668V7.03333L2.81329 8.44169V2.81334L5.62662 1.40668Z" fill="#5279BC"></path></svg>
            <span className="px-2"> Agentspace</span>
          </Link>
        </div>
        
        {/* UBOS Bots Title */}
      
        {/* Navigation */}
        <nav className="p-3 w-full flex flex-col flex-wrap flex-grow">
          <ul className="space-y-1.5">
            {/* Main Section Header */}
          
            {/* Home */}
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

            {/* Product
            <li>
              <Link 
                to="/product" 
                className={`flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-md ${
                  currentPath === '/product'
                    ? (darkMode ? 'bg-neutral-700 text-white' : 'bg-gray-100 text-blue-600')
                    : (darkMode ? 'text-gray-400 hover:bg-neutral-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600')
                }`}
              >
                <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
                Product
              </Link>
            </li> */}
            
            {/* Dashboard */}
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
                My Agents
              </Link>
            </li>
            
            {/* My Company */}
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
            
            {/* Chat Section Header */}
            <li className="pt-5 pb-2">
              <div className="px-2">
                <h3 className={`text-xs font-semibold uppercase ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Chat</h3>
              </div>
            </li>
            
            {/* HTML Chat */}
            <li>
              <Link 
                to="/chat" 
                className={`flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-md ${
                  currentPath === '/chat' 
                    ? (darkMode ? 'bg-neutral-700 text-white' : 'bg-gray-100 text-blue-600')
                    : (darkMode ? 'text-gray-400 hover:bg-neutral-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600')
                }`}
              >
                <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  <path d="M7 8h10"/>
                  <path d="M7 12h6"/>
                </svg>
                HTML Chat
              </Link>
            </li>
            
            {/* Global Chat */}
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
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Chat
              </Link>
            </li>
            
            {/* Admin Section Header */}
            <li className="pt-5 pb-2">
              <div className="px-2">
                <h3 className={`text-xs font-semibold uppercase ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Administration</h3>
              </div>
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