import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ darkMode }) {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside className={`hidden lg:block w-64 h-full border-e sticky top-0 z-40 ${
      darkMode 
        ? 'bg-neutral-900 border-neutral-800' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex flex-col h-full">
        <div className="px-6 pt-4 pb-4 flex items-center">
          <Link to="/" className={`flex items-center gap-1 text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="14" cy="14" r="5" className="fill-blue-600" />
            </svg>
            <span>UBOS</span>
          </Link>
        </div>
        
        <nav className="p-3 w-full flex flex-col flex-wrap overflow-y-auto">
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
      </div>
    </aside>
  );
} 