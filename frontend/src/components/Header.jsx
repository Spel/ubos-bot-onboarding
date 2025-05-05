import React from "react";
import { Link } from "react-router-dom";

export default function Header({ darkMode, toggleDarkMode }) {
  return (
    <header className={`fixed top-0 right-0 flex flex-wrap md:justify-start md:flex-nowrap z-40 border-b py-2.5 lg:ml-64 ${
      darkMode 
        ? 'bg-neutral-900 border-neutral-800 text-white' 
        : 'bg-white border-gray-200 text-gray-800'
    }`} style={{ width: 'calc(100% - 16rem)' }}>
      <nav className="px-4 sm:px-6 flex basis-full items-center w-full mx-auto">
        <div className="me-5 lg:me-0 lg:hidden flex items-center">
          {/* Mobile Logo */}
          <a className={`flex items-center gap-1 text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`} href="#">
            <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="14" cy="14" r="5" className="fill-blue-600" />
            </svg>
            <span>preline</span>
          </a>
        </div>
        <div className="w-full flex items-center justify-end ms-auto md:justify-between gap-x-1 md:gap-x-3">
          <div className="hidden md:block flex-1 max-w-md">
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-3.5">
                <svg className={`shrink-0 size-4 ${darkMode ? 'text-neutral-400' : 'text-gray-400'}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
              <input 
                type="text" 
                className={`py-2 ps-10 pe-16 block w-full rounded-lg text-sm focus:outline-hidden ${
                  darkMode 
                    ? 'bg-neutral-800 border-neutral-700 text-neutral-300 focus:border-neutral-600 focus:ring-neutral-600' 
                    : 'bg-white border-gray-200 text-gray-800 focus:border-blue-500 focus:ring-blue-500'
                }`} 
                placeholder="Search" 
              />
              <div className="absolute inset-y-0 end-0 flex items-center pe-3">
                <span className={`text-xs py-0.5 px-1.5 rounded ${
                  darkMode 
                    ? 'text-neutral-400 bg-neutral-700' 
                    : 'text-gray-500 bg-gray-100'
                }`}>⌘ /</span>
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center justify-end gap-2">
            {/* Subscription Plans Link */}
            <Link 
              to="/subscription-plans"
              className={`py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent ${
                darkMode 
                  ? 'text-neutral-300 hover:bg-neutral-800 focus:bg-neutral-800' 
                  : 'text-gray-700 hover:bg-gray-100 focus:bg-gray-100'
              }`}
            >
              <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 10c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2" />
                <path d="M10 16c-1.1 0-2-.9-2-2v-4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2" />
                <rect x="14" y="14" width="8" height="8" rx="2" />
              </svg>
              Subscription Plans
            </Link>
            
            {/* Theme Toggle Button */}
            <button 
              type="button" 
              onClick={toggleDarkMode}
              className={`size-9 relative inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent ${
                darkMode 
                  ? 'text-neutral-300 hover:bg-neutral-800 focus:bg-neutral-800' 
                  : 'text-gray-700 hover:bg-gray-100 focus:bg-gray-100'
              }`}
            >
              {darkMode ? (
                <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2" />
                  <path d="M12 21v2" />
                  <path d="M4.22 4.22l1.42 1.42" />
                  <path d="M18.36 18.36l1.42 1.42" />
                  <path d="M1 12h2" />
                  <path d="M21 12h2" />
                  <path d="M4.22 19.78l1.42-1.42" />
                  <path d="M18.36 5.64l1.42-1.42" />
                </svg>
              ) : (
                <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              )}
              <span className="sr-only">Toggle theme</span>
            </button>
            
            {/* Notification Icon */}
            <button type="button" className={`size-9 relative inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent ${
              darkMode 
                ? 'text-neutral-300 hover:bg-neutral-800 focus:bg-neutral-800' 
                : 'text-gray-700 hover:bg-gray-100 focus:bg-gray-100'
            }`}>
              <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
              <span className="sr-only">Notifications</span>
            </button>
            
            {/* Avatar */}
            <div className="relative inline-flex">
              <button type="button" className="size-9 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none" aria-haspopup="menu" aria-expanded="false" aria-label="Dropdown">
                <img className="shrink-0 size-9 rounded-full" src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80" alt="Avatar" />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
} 