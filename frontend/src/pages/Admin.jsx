import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { getFromStorage, STORAGE_KEYS } from "../utils/localStorage";

export default function Admin() {
  const [darkMode, setDarkMode] = useState(getFromStorage(STORAGE_KEYS.DARK_MODE, false));
  
  // Mock data for business metrics
  const [metrics, setMetrics] = useState({
    mrr: 45000,
    arr: 540000,
    cac: 350,
    ltv: 2100,
    ltvCacRatio: 6.0,
    churnRate: 3.2,
    nrr: 108,
    totalUsers: 1250,
    activeUsers: 1050,
    usersByTier: {
      freemium: 500,
      partTime: 350,
      standard: 280,
      fullTime: 120
    },
    revenueByTier: {
      freemium: 0,
      partTime: 10500,
      standard: 19600,
      fullTime: 14400
    },
    arpu: 42.5,
    costPerTpu: 0.0002,
    marginByTier: {
      freemium: -2.5,
      partTime: 18.5,
      standard: 52.5,
      fullTime: 90
    },
    paybackPeriod: 5.2,
    projectedMrr: 75000,
    breakEvenDate: "October 2025"
  });
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Format percentage
  const formatPercentage = (value) => {
    return `${value}%`;
  };
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-neutral-900' : 'bg-gray-50'}`}>
      <Header darkMode={darkMode} />
      <Sidebar darkMode={darkMode} />
      <div style={{ paddingLeft: '16rem', paddingTop: '61px' }}>
        <main className="w-full overflow-y-auto p-4">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Admin Dashboard</h1>
              <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Business metrics and unit economics</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Last updated: May 5, 2025</span>
              <button 
                className={`py-2 px-4 rounded-lg ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}
              >
                Export Report
              </button>
            </div>
          </div>
          
          {/* Key Business Metrics */}
          <div className="mb-6">
            <h2 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Key Business Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* MRR Card */}
              <div className={`${darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200'} border rounded-xl shadow-sm p-6`}>
                <div className="flex flex-col">
                  <span className={`text-xs font-semibold uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Monthly Recurring Revenue</span>
                  <div className="mt-1">
                    <h3 className={`text-xl sm:text-2xl font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{formatCurrency(metrics.mrr)}</h3>
                  </div>
                  <div className={`mt-1 inline-flex items-center text-sm ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                    <svg className="size-3 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                    <span>+12.5% from last month</span>
                  </div>
                </div>
              </div>
              
              {/* ARR Card */}
              <div className={`${darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200'} border rounded-xl shadow-sm p-6`}>
                <div className="flex flex-col">
                  <span className={`text-xs font-semibold uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Annual Recurring Revenue</span>
                  <div className="mt-1">
                    <h3 className={`text-xl sm:text-2xl font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{formatCurrency(metrics.arr)}</h3>
                  </div>
                  <div className={`mt-1 inline-flex items-center text-sm ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                    <svg className="size-3 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                    <span>+15.2% from last quarter</span>
                  </div>
                </div>
              </div>
              
              {/* Churn Rate Card */}
              <div className={`${darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200'} border rounded-xl shadow-sm p-6`}>
                <div className="flex flex-col">
                  <span className={`text-xs font-semibold uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Churn Rate</span>
                  <div className="mt-1">
                    <h3 className={`text-xl sm:text-2xl font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{formatPercentage(metrics.churnRate)}</h3>
                  </div>
                  <div className={`mt-1 inline-flex items-center text-sm ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                    <svg className="size-3 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                    <span>-0.8% from last month</span>
                  </div>
                </div>
              </div>
              
              {/* LTV:CAC Card */}
              <div className={`${darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200'} border rounded-xl shadow-sm p-6`}>
                <div className="flex flex-col">
                  <span className={`text-xs font-semibold uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>LTV:CAC Ratio</span>
                  <div className="mt-1">
                    <h3 className={`text-xl sm:text-2xl font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{metrics.ltvCacRatio}x</h3>
                  </div>
                  <div className={`mt-1 inline-flex items-center text-sm ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                    <svg className="size-3 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                    <span>+0.5x from last quarter</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* User Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>User Analytics</h2>
              <div className={`${darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200'} border rounded-xl shadow-sm p-6`}>
                <div className="flex justify-between mb-4">
                  <div>
                    <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Total Users</h3>
                    <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{metrics.totalUsers}</p>
                  </div>
                  <div>
                    <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Active Users</h3>
                    <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{metrics.activeUsers}</p>
                  </div>
                </div>
                
                <h4 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Users by Subscription Tier</h4>
                
                {/* Freemium */}
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Freemium</span>
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{metrics.usersByTier.freemium}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div className="bg-gray-500 h-2 rounded-full" style={{ width: `${(metrics.usersByTier.freemium / metrics.totalUsers) * 100}%` }}></div>
                  </div>
                </div>
                
                {/* Part-Time */}
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Part-Time</span>
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{metrics.usersByTier.partTime}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(metrics.usersByTier.partTime / metrics.totalUsers) * 100}%` }}></div>
                  </div>
                </div>
                
                {/* Standard */}
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Standard</span>
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{metrics.usersByTier.standard}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(metrics.usersByTier.standard / metrics.totalUsers) * 100}%` }}></div>
                  </div>
                </div>
                
                {/* Full-Time */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Full-Time</span>
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{metrics.usersByTier.fullTime}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(metrics.usersByTier.fullTime / metrics.totalUsers) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Revenue Breakdown</h2>
              <div className={`${darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200'} border rounded-xl shadow-sm p-6`}>
                <div className="flex justify-between mb-4">
                  <div>
                    <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Total Monthly Revenue</h3>
                    <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{formatCurrency(metrics.mrr)}</p>
                  </div>
                  <div>
                    <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>ARPU</h3>
                    <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{formatCurrency(metrics.arpu)}</p>
                  </div>
                </div>
                
                <h4 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Revenue by Subscription Tier</h4>
                
                {/* Part-Time */}
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Part-Time</span>
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{formatCurrency(metrics.revenueByTier.partTime)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(metrics.revenueByTier.partTime / metrics.mrr) * 100}%` }}></div>
                  </div>
                </div>
                
                {/* Standard */}
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Standard</span>
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{formatCurrency(metrics.revenueByTier.standard)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(metrics.revenueByTier.standard / metrics.mrr) * 100}%` }}></div>
                  </div>
                </div>
                
                {/* Full-Time */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Full-Time</span>
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{formatCurrency(metrics.revenueByTier.fullTime)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(metrics.revenueByTier.fullTime / metrics.mrr) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Unit Economics */}
          <div className="mb-6">
            <h2 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Unit Economics</h2>
            <div className={`${darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200'} border rounded-xl shadow-sm p-6`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className={`text-lg font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Customer Acquisition</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>CAC</span>
                        <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{formatCurrency(metrics.cac)}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>LTV</span>
                        <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{formatCurrency(metrics.ltv)}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Payback Period</span>
                        <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{metrics.paybackPeriod} months</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className={`text-lg font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Margins by Tier</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Freemium</span>
                        <span className={`text-sm font-medium ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{formatCurrency(metrics.marginByTier.freemium)}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Part-Time</span>
                        <span className={`text-sm font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>{formatCurrency(metrics.marginByTier.partTime)} (62%)</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Standard</span>
                        <span className={`text-sm font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>{formatCurrency(metrics.marginByTier.standard)} (75%)</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Full-Time</span>
                        <span className={`text-sm font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>{formatCurrency(metrics.marginByTier.fullTime)} (80%)</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className={`text-lg font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Forecasting</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Projected MRR (6mo)</span>
                        <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{formatCurrency(metrics.projectedMrr)}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Break-even Date</span>
                        <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{metrics.breakEvenDate}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Cost per TPU</span>
                        <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>${metrics.costPerTpu.toFixed(4)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
