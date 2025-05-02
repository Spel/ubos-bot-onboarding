import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { saveToStorage, getFromStorage, STORAGE_KEYS } from "../utils/localStorage";
import { getBotCount, getActiveBotCount, getBotsByType } from "../utils/botsData";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(getFromStorage(STORAGE_KEYS.DARK_MODE, false));
  const [credits, setCredits] = useState(getFromStorage(STORAGE_KEYS.CREDITS, 2592000)); // Default to 2,592,000 TPU-seconds
  
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

  // Format credits in a readable way
  const formatCredits = (tpuSeconds) => {
    if (tpuSeconds >= 1000000) {
      return `${(tpuSeconds / 1000000).toFixed(2)}M`;
    } else if (tpuSeconds >= 1000) {
      return `${(tpuSeconds / 1000).toFixed(1)}K`;
    }
    return tpuSeconds.toString();
  };

  // Load bot statistics and credits
  useEffect(() => {
    const totalBots = getBotCount();
    const activeBots = getActiveBotCount();
    
    // Count bots by type
    const types = {};
    const bots = getBotsByType('support');
    types.support = bots.length;
    types.sales = getBotsByType('sales').length;
    types.content = getBotsByType('content').length;
    
    // Get credits
    const userCredits = getFromStorage(STORAGE_KEYS.CREDITS, 2592000);
    
    setBotCount(totalBots);
    setActiveBotCount(activeBots);
    setBotTypes(types);
    setCredits(userCredits);
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-neutral-900' : 'bg-gray-50'}`}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <Sidebar darkMode={darkMode} />
      <div style={{ paddingLeft: '16rem', paddingTop: '61px' }}>
        <main className="w-full overflow-y-auto p-4">
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

          {/* Credits Usage Section */}
          <div className="mb-6">
            <h2 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Credits Usage</h2>
            <div className={`${darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200'} border rounded-xl shadow-sm p-6`}>
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>TPU-Seconds Available</span>
                  <span className={`text-sm font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    {formatCredits(credits)} / 2.59M
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-4">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${Math.min(100, (credits / 2592000) * 100)}%` }}
                  ></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-neutral-700' : 'bg-gray-100'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Usage Today</span>
                      <span className={`text-xs font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>2.1K</span>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-1.5 dark:bg-gray-600">
                      <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-neutral-700' : 'bg-gray-100'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>This Week</span>
                      <span className={`text-xs font-medium ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>12.5K</span>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-1.5 dark:bg-gray-600">
                      <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: '35%' }}></div>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-neutral-700' : 'bg-gray-100'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>This Month</span>
                      <span className={`text-xs font-medium ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>86.4K</span>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-1.5 dark:bg-gray-600">
                      <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Link to="#" className={`text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
                    View detailed usage →
                  </Link>
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
                <Link to="/onboarding" className={`inline-block mt-2 py-2 px-4 rounded-lg ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}>
                  Create New Bot
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 