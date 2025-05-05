import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { saveToStorage, getFromStorage, STORAGE_KEYS } from "../utils/localStorage";
import { getBotCount, getActiveBotCount, getBotsByType, getBots } from "../utils/botsData";
import { Link, useLocation } from "react-router-dom";

export default function Dashboard() {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(getFromStorage(STORAGE_KEYS.DARK_MODE, false));
  const [tpuSeconds, setTpuSeconds] = useState(getFromStorage(STORAGE_KEYS.CREDITS, 2592000)); // Default to 2,592,000 TPU-seconds (720 hours)
  const [usedTpuSeconds, setUsedTpuSeconds] = useState(0);
  const [remainingTpuSeconds, setRemainingTpuSeconds] = useState(0);
  const [tpuHours, setTpuHours] = useState(0);
  const [usedTpuHours, setUsedTpuHours] = useState(0);
  
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
  
  const [botCount, setBotCount] = useState(0);
  const [activeBotCount, setActiveBotCount] = useState(0);
  const [botTypes, setBotTypes] = useState({});
  const [topBots, setTopBots] = useState([]);

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

  // Check if we're coming from onboarding to ensure proper navigation
  useEffect(() => {
    // If we have the fromOnboarding state, ensure we're authenticated
    if (location.state?.fromOnboarding) {
      // Ensure authentication is properly set
      saveToStorage(STORAGE_KEYS.IS_AUTHENTICATED, true);
      console.log('Coming from onboarding, authentication confirmed');
    }
  }, [location]);

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
    
    // Get credits and calculate usage (67% used)
    const userTpuSeconds = getFromStorage(STORAGE_KEYS.CREDITS, 2592000);
    const usedTpuSecs = Math.round(userTpuSeconds * 0.67);
    const remainingTpuSecs = userTpuSeconds - usedTpuSecs;
    
    // Convert to hours
    const totalHours = Math.round(userTpuSeconds / 3600);
    const usedHours = Math.round(usedTpuSecs / 3600);
    
    // Get top 3 most active bots
    const allBots = getBots();
    const sortedBots = [...allBots].sort((a, b) => (b.executionCount || 0) - (a.executionCount || 0));
    const top3Bots = sortedBots.slice(0, 3);
    
    setBotCount(totalBots);
    setActiveBotCount(activeBots);
    setBotTypes(types);
    setTpuSeconds(userTpuSeconds);
    setUsedTpuSeconds(usedTpuSecs);
    setRemainingTpuSeconds(remainingTpuSecs);
    setTpuHours(totalHours);
    setUsedTpuHours(usedHours);
    setTopBots(top3Bots);
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

          {/* Bot Statistics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-6">
           
            
            <div>
              <h2 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Most Active Agents</h2>
              <div className={`${darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200'} border rounded-xl shadow-sm p-6`}>
                {topBots.length > 0 ? (
                  <div className="space-y-4">
                    {topBots.map(bot => (
                      <div key={bot.id} className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-neutral-700' : 'bg-gray-50'}`}>
                        <div className="flex items-center">
                          <div className={`text-2xl mr-3 p-2 rounded-lg ${darkMode ? 'bg-neutral-600' : 'bg-gray-100'}`}>{bot.avatar}</div>
                          <div>
                            <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{bot.name}</h3>
                            <div className="flex items-center">
                              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {bot.executionCount} executions
                              </span>
                              <span className="mx-2 text-gray-400">•</span>
                              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {bot.type}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className={`text-sm font-semibold ${
                          bot.type === 'support' 
                            ? (darkMode ? 'text-blue-400' : 'text-blue-600')
                            : bot.type === 'sales'
                              ? (darkMode ? 'text-green-400' : 'text-green-600')
                              : (darkMode ? 'text-purple-400' : 'text-purple-600')
                        }`}>
                          {bot.averageTpuConsumption} TPU
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <p>No active agents yet</p>
                  </div>
                )}
                
                <div className="mt-6 flex justify-end">
                  <Link to="/my-bots" className={`text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
                    Manage agents →
                  </Link>
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
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Agent Hours Used</span>
                  <span className={`text-sm font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    {formatHours(usedTpuHours)} / {formatHours(tpuHours)} hours
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-1">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${Math.min(100, (usedTpuSeconds / tpuSeconds) * 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <span>TPU-Seconds: {formatCredits(usedTpuSeconds)} / {formatCredits(tpuSeconds)}</span>
                  <span>{Math.round((usedTpuSeconds / tpuSeconds) * 100)}% used</span>
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
                      <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Usage This Week</span>
                      <span className={`text-xs font-medium ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>14.5K</span>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-1.5 dark:bg-gray-600">
                      <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-neutral-700' : 'bg-gray-100'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Usage This Month</span>
                      <span className={`text-xs font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>67.3K</span>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-1.5 dark:bg-gray-600">
                      <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '67%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Agent TPU Consumption Section */}
          <div className="mb-6">
            <h2 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Agent TPU Consumption</h2>
            <div className={`${darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200'} border rounded-xl shadow-sm p-6`}>
              <div className="flex justify-between items-center mb-4">
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Each agent type has a different average TPU consumption per execution batch:
                </p>
                <div className={`text-xs font-medium px-3 py-1 rounded-lg ${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
                  Based on real usage data
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-lg border ${darkMode ? 'bg-neutral-700 border-neutral-600' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`text-2xl p-2 rounded-lg ${darkMode ? 'bg-neutral-600' : 'bg-gray-100'}`}>🤖</div>
                    <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Customer Support</h3>
                  </div>
                  <div className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Handles customer inquiries and support requests
                  </div>
                  <div className={`w-full bg-gray-200 rounded-full h-2 dark:bg-gray-600 mb-2`}>
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '38%' }}></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <svg className="size-4 mr-1.5 text-blue-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      </svg>
                      <span className={`text-sm font-semibold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        270 TPU
                      </span>
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      ~4.5 min/execution
                    </div>
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg border ${darkMode ? 'bg-neutral-700 border-neutral-600' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`text-2xl p-2 rounded-lg ${darkMode ? 'bg-neutral-600' : 'bg-gray-100'}`}>🤑</div>
                    <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Finance & Sales</h3>
                  </div>
                  <div className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Helps with product recommendations and sales
                  </div>
                  <div className={`w-full bg-gray-200 rounded-full h-2 dark:bg-gray-600 mb-2`}>
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '64%' }}></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <svg className="size-4 mr-1.5 text-green-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      </svg>
                      <span className={`text-sm font-semibold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                        450 TPU
                      </span>
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      ~7.5 min/execution
                    </div>
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg border ${darkMode ? 'bg-neutral-700 border-neutral-600' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`text-2xl p-2 rounded-lg ${darkMode ? 'bg-neutral-600' : 'bg-gray-100'}`}>✍️</div>
                    <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Marketing & Content</h3>
                  </div>
                  <div className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Generates media content and marketing materials
                  </div>
                  <div className={`w-full bg-gray-200 rounded-full h-2 dark:bg-gray-600 mb-2`}>
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <svg className="size-4 mr-1.5 text-purple-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      </svg>
                      <span className={`text-sm font-semibold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                        700 TPU
                      </span>
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      ~11.7 min/execution
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                <h4 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  How to optimize your TPU usage:
                </h4>
                <ul className={`text-xs space-y-1 list-disc pl-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <li>Configure agents with specific, focused tasks instead of broad responsibilities</li>
                  <li>Use content templates when possible to reduce generation time</li>
                  <li>Schedule batch operations during off-peak hours</li>
                  <li>Monitor usage patterns to identify optimization opportunities</li>
                </ul>
              </div>
              
              <div className={`mt-4 flex items-center justify-between`}>
                <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                  * TPU consumption is based on real usage data and may vary depending on specific tasks and complexity.
                </div>
                <Link to="/subscription-plans" className={`text-xs font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
                  Upgrade for more TPU credits →
                </Link>
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