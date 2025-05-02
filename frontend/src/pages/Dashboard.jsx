import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { saveToStorage, getFromStorage, STORAGE_KEYS } from "../utils/localStorage";
import { getBotCount, getActiveBotCount, getBotsByType } from "../utils/botsData";

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(getFromStorage(STORAGE_KEYS.DARK_MODE, false));
  
  // Toggle dark mode function
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    // Save dark mode preference to localStorage
    saveToStorage(STORAGE_KEYS.DARK_MODE, newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  // Initialize theme from localStorage or default to light mode
  useEffect(() => {
    const savedDarkMode = getFromStorage(STORAGE_KEYS.DARK_MODE, false);
    setDarkMode(savedDarkMode);
    
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const [botCount, setBotCount] = useState(0);
  const [activeBotCount, setActiveBotCount] = useState(0);
  const [botTypes, setBotTypes] = useState({});

  // Load bot statistics
  useEffect(() => {
    const totalBots = getBotCount();
    const activeBots = getActiveBotCount();
    
    // Count bots by type
    const types = {};
    const bots = getBotsByType('support');
    types.support = bots.length;
    types.sales = getBotsByType('sales').length;
    types.content = getBotsByType('content').length;
    
    setBotCount(totalBots);
    setActiveBotCount(activeBots);
    setBotTypes(types);
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-neutral-900' : 'bg-gray-50'}`}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className="flex h-[calc(100vh-61px)]">
        <Sidebar darkMode={darkMode} />
        <main className="flex-1 overflow-y-auto p-4 max-w-[calc(100vw-260px)] ml-auto">
          {/* Dashboard Header */}
          <div className="mb-6">
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Dashboard</h1>
            <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Welcome to your UBOS bot dashboard</p>
          </div>
          
          {/* Bot Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Total Bots Card */}
            <div className={`${darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200'} border rounded-xl shadow-sm p-6`}>
              <div className="flex items-center gap-x-4">
                <div className={`inline-flex justify-center items-center size-[62px] rounded-full ${darkMode ? 'bg-neutral-700' : 'bg-blue-100'}`}>
                  <svg className={`size-6 ${darkMode ? 'text-blue-500' : 'text-blue-600'}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <circle cx="9" cy="9" r="2" />
                    <circle cx="15" cy="9" r="2" />
                    <path d="M6 15h12" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className={`text-xs font-semibold uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Bots</span>
                  <div className="mt-1 flex items-center gap-x-2">
                    <h3 className={`text-xl sm:text-2xl font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{botCount}</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Bots Card */}
            <div className={`${darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200'} border rounded-xl shadow-sm p-6`}>
              <div className="flex items-center gap-x-4">
                <div className={`inline-flex justify-center items-center size-[62px] rounded-full ${darkMode ? 'bg-neutral-700' : 'bg-green-100'}`}>
                  <svg className={`size-6 ${darkMode ? 'text-green-500' : 'text-green-600'}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className={`text-xs font-semibold uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Active Bots</span>
                  <div className="mt-1 flex items-center gap-x-2">
                    <h3 className={`text-xl sm:text-2xl font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{activeBotCount}</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Bot Types Card */}
            <div className={`${darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200'} border rounded-xl shadow-sm p-6`}>
              <div className="flex items-center gap-x-4">
                <div className={`inline-flex justify-center items-center size-[62px] rounded-full ${darkMode ? 'bg-neutral-700' : 'bg-purple-100'}`}>
                  <svg className={`size-6 ${darkMode ? 'text-purple-500' : 'text-purple-600'}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2H2v10h10V2Z" />
                    <path d="M12 12H2v10h10V12Z" />
                    <path d="M22 2h-10v20h10V2Z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className={`text-xs font-semibold uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Bot Categories</span>
                  <div className="mt-1">
                    <h3 className={`text-xl sm:text-2xl font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{Object.keys(botTypes).length}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="mb-6">
            <h2 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Recent Activity</h2>
            <div className={`${darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200'} border rounded-xl shadow-sm p-4`}>
              <div className={`text-center py-10 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <p>Your bot activity will appear here</p>
                <button className={`mt-2 py-2 px-4 rounded-lg ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}>
                  Create New Bot
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 