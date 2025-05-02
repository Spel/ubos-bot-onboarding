import React from "react";

export default function DashboardCards({ darkMode }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {/* Total Users Card */}
      <div className={`flex flex-col border shadow-2xs rounded-xl p-4 md:p-5 ${
        darkMode 
          ? 'bg-neutral-800 border-neutral-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center gap-x-2">
          <p className={`text-xs uppercase ${darkMode ? 'text-neutral-500' : 'text-gray-500'}`}>TOTAL USERS</p>
          <svg className={`size-4 ${darkMode ? 'text-neutral-500' : 'text-gray-400'}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4"/>
            <path d="M12 8h.01"/>
          </svg>
        </div>
        <div className="mt-1 flex items-center gap-x-2">
          <h3 className={`text-xl sm:text-2xl font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>72,540</h3>
          <span className="flex items-center gap-x-1 text-green-500">
            <svg className="inline-block size-4 self-center" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
              <polyline points="16 7 22 7 22 13" />
            </svg>
            <span className="inline-block text-sm">1.7%</span>
          </span>
        </div>
      </div>

      {/* Sessions Card */}
      <div className={`flex flex-col border shadow-2xs rounded-xl p-4 md:p-5 ${
        darkMode 
          ? 'bg-neutral-800 border-neutral-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center gap-x-2">
          <p className={`text-xs uppercase ${darkMode ? 'text-neutral-500' : 'text-gray-500'}`}>SESSIONS</p>
        </div>
        <div className="mt-1 flex items-center gap-x-2">
          <h3 className={`text-xl sm:text-2xl font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>29.4%</h3>
        </div>
      </div>

      {/* Avg. Click Rate Card */}
      <div className={`flex flex-col border shadow-2xs rounded-xl p-4 md:p-5 ${
        darkMode 
          ? 'bg-neutral-800 border-neutral-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center gap-x-2">
          <p className={`text-xs uppercase ${darkMode ? 'text-neutral-500' : 'text-gray-500'}`}>AVG. CLICK RATE</p>
        </div>
        <div className="mt-1 flex items-center gap-x-2">
          <h3 className={`text-xl sm:text-2xl font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>56.8%</h3>
          <span className="flex items-center gap-x-1 text-green-500">
            <svg className="inline-block size-4 self-center" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
              <polyline points="16 7 22 7 22 13" />
            </svg>
            <span className="inline-block text-sm">1.7%</span>
          </span>
        </div>
      </div>

      {/* Pageviews Card */}
      <div className={`flex flex-col border shadow-2xs rounded-xl p-4 md:p-5 ${
        darkMode 
          ? 'bg-neutral-800 border-neutral-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center gap-x-2">
          <p className={`text-xs uppercase ${darkMode ? 'text-neutral-500' : 'text-gray-500'}`}>PAGEVIEWS</p>
        </div>
        <div className="mt-1 flex items-center gap-x-2">
          <h3 className={`text-xl sm:text-2xl font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>92,913</h3>
        </div>
      </div>
    </div>
  );
} 