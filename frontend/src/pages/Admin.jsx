import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { getFromStorage, saveToStorage, STORAGE_KEYS } from "../utils/localStorage";
import OpenWebUIUserTable from "../components/OpenWebUIUserTable";
import OpenWebUIUserModal from "../components/OpenWebUIUserModal";
import OpenWebUIUserEditModal from "../components/OpenWebUIUserEditModal";
import OpenWebUILoginModal from "../components/OpenWebUILoginModal";
import { testConnection, isAuthenticated, clearAuthToken, getAuthToken } from "../utils/openWebUIApi";

export default function Admin() {
  const [darkMode, setDarkMode] = useState(getFromStorage(STORAGE_KEYS.DARK_MODE, false));
  
  // OpenWebUI API configuration state
  const [openWebUIApiConfig, setOpenWebUIApiConfig] = useState({
    baseUrl: getFromStorage(STORAGE_KEYS.OPEN_WEBUI_BASE_URL, "http://localhost:8081"),
    apiPath: getFromStorage(STORAGE_KEYS.OPEN_WEBUI_API_PATH, "/api/v1"),
  });
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);
  
  // OpenWebUI authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(null);
  
  // OpenWebUI modals state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Check authentication status on mount and when API config changes
  useEffect(() => {
    checkAuthStatus();
  }, [openWebUIApiConfig]);
  
  // Check if user is authenticated with OpenWebUI
  const checkAuthStatus = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        setIsAuthenticated(false);
        return;
      }
      
      const authStatus = await isAuthenticated();
      setIsAuthenticated(authStatus);
      setAuthError(null);
    } catch (err) {
      console.error("Auth check failed:", err);
      setIsAuthenticated(false);
      setAuthError(err.message);
    }
  };
  
  // Handle API config changes
  const handleApiConfigChange = (e) => {
    const { name, value } = e.target;
    setOpenWebUIApiConfig(prev => {
      const updated = { ...prev, [name]: value };
      // Save to localStorage
      if (name === "baseUrl") {
        saveToStorage(STORAGE_KEYS.OPEN_WEBUI_BASE_URL, value);
      } else if (name === "apiPath") {
        saveToStorage(STORAGE_KEYS.OPEN_WEBUI_API_PATH, value);
      }
      return updated;
    });
  };
  
  // Test connection to OpenWebUI API
  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus(null);
    
    try {
      const result = await testConnection(openWebUIApiConfig.baseUrl, openWebUIApiConfig.apiPath);
      setConnectionStatus({ success: true, message: "Connection successful!" });
    } catch (err) {
      console.error("Connection test failed:", err);
      setConnectionStatus({ success: false, message: err.message || "Connection failed" });
    } finally {
      setIsTestingConnection(false);
    }
  };
  
  // Handle successful login
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setAuthError(null);
    setIsLoginModalOpen(false);
  };
  
  // Handle logout
  const handleLogout = () => {
    clearAuthToken();
    setIsAuthenticated(false);
  };
  
  // Handle user edit
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };
  
  // Handle user creation success
  const handleUserCreated = () => {
    // Refresh user table (handled by child component)
  };
  
  // Handle user edit success
  const handleUserEdited = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
    // Refresh user table (handled by child component)
  };
  
  // Mock data for business metrics
  const [metrics, setMetrics] = useState({
    mrr: 45000,
    arr: 540000,
    cac: 350,
    ltv: 2100,
    ltvCacRatio: 6.0,
    churnRate: 3.2,
    nrr: 108,
    expansionRevenue: 4500,
    contractionRevenue: 1200,
    totalUsers: 1250,
    activeUsers: 1050,
    newUsersThisMonth: 85,
    churnedUsersThisMonth: 32,
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
    breakEvenDate: "October 2025",
    grossMargin: 68,
    netMargin: 22,
    cashBurn: 65000,
    runway: 14,
    acquisitionChannels: {
      organic: 35,
      paid: 28,
      referral: 22,
      partnership: 15
    },
    conversionRates: {
      visitToSignup: 3.2,
      signupToActive: 65,
      freeToPartTime: 12.5,
      partTimeToStandard: 18,
      standardToFullTime: 8
    },
    userLifecycle: {
      averageDaysToConversion: 14,
      averageDaysToChurn: 120,
      averageSessionsPerWeek: 4.5
    },
    // TPU usage analysis data
    tpuUsage: {
      totalMonthly: 1850000,
      averagePerUser: 1480,
      byTier: {
        freemium: 450,
        partTime: 1200,
        standard: 2100,
        fullTime: 3500
      },
      costEfficiency: {
        freemium: 0.09,  // $ per 1000 TPU
        partTime: 0.025,
        standard: 0.017,
        fullTime: 0.011
      },
      utilizationRate: {
        freemium: 45,  // % of allocated TPU used
        partTime: 60,
        standard: 70,
        fullTime: 78
      },
      growthRate: 18.5, // % MoM growth in TPU usage
      costTrend: -5.2   // % MoM reduction in TPU cost
    },
    // Time series data for charts
    timeSeriesData: {
      months: ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'],
      mrr: [28000, 31000, 34500, 38000, 41500, 45000],
      users: [780, 850, 920, 1050, 1180, 1250],
      tpuUsage: [950000, 1100000, 1300000, 1450000, 1650000, 1850000],
      churnRate: [4.8, 4.5, 4.1, 3.8, 3.5, 3.2],
      cac: [420, 405, 390, 375, 360, 350],
      ltv: [1600, 1700, 1800, 1900, 2000, 2100]
    }
  });
  
  // Mock user data
  const [users, setUsers] = useState([
    { id: 1, name: "John Smith", email: "john@example.com", plan: "Full-Time", mrr: 120, status: "active", joinDate: "2024-12-15", lastActive: "2025-05-04", tpuUsage: 82 },
    { id: 2, name: "Sarah Johnson", email: "sarah@example.com", plan: "Standard", mrr: 70, status: "active", joinDate: "2025-01-22", lastActive: "2025-05-05", tpuUsage: 65 },
    { id: 3, name: "Michael Brown", email: "michael@example.com", plan: "Part-Time", mrr: 30, status: "active", joinDate: "2025-02-10", lastActive: "2025-05-01", tpuUsage: 28 },
    { id: 4, name: "Emily Davis", email: "emily@example.com", plan: "Freemium", mrr: 0, status: "active", joinDate: "2025-03-05", lastActive: "2025-05-03", tpuUsage: 12 },
    { id: 5, name: "David Wilson", email: "david@example.com", plan: "Standard", mrr: 70, status: "active", joinDate: "2025-01-18", lastActive: "2025-05-02", tpuUsage: 58 },
    { id: 6, name: "Jessica Taylor", email: "jessica@example.com", plan: "Part-Time", mrr: 30, status: "at_risk", joinDate: "2025-02-28", lastActive: "2025-04-20", tpuUsage: 15 },
    { id: 7, name: "Robert Martinez", email: "robert@example.com", plan: "Full-Time", mrr: 120, status: "active", joinDate: "2024-11-30", lastActive: "2025-05-04", tpuUsage: 90 },
    { id: 8, name: "Lisa Anderson", email: "lisa@example.com", plan: "Freemium", mrr: 0, status: "churned", joinDate: "2025-03-15", lastActive: "2025-04-10", tpuUsage: 5 }
  ]);
  
  // Filter states for user table
  const [userFilter, setUserFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
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
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };
  
  // Filter users based on current filter and search term
  const filteredUsers = users.filter(user => {
    // Apply status filter
    if (userFilter !== "all" && user.status !== userFilter) {
      return false;
    }
    
    // Apply search filter
    if (searchTerm && !user.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !user.email.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
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
                    <span>+15.2% YoY</span>
                  </div>
                </div>
              </div>
              
              {/* Churn Rate Card */}
              <div className={`${darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200'} border rounded-xl shadow-sm p-6`}>
                <div className="flex flex-col">
                  <span className={`text-xs font-semibold uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Monthly Churn Rate</span>
                  <div className="mt-1">
                    <h3 className={`text-xl sm:text-2xl font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{formatPercentage(metrics.churnRate)}</h3>
                  </div>
                  <div className={`mt-1 inline-flex items-center text-sm ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                    <svg className="size-3 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                    <span>-0.5% from last month</span>
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
                    <span>+0.8x from last quarter</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Revenue Breakdown & User Growth */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Revenue Breakdown */}
            <div className={`${darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200'} border rounded-xl shadow-sm p-6`}>
              <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Revenue Breakdown</h2>
              
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>New MRR</span>
                  <span className={`text-sm font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>{formatCurrency(metrics.newUsersThisMonth * metrics.arpu)}</span>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Expansion MRR</span>
                  <span className={`text-sm font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>{formatCurrency(metrics.expansionRevenue)}</span>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Contraction MRR</span>
                  <span className={`text-sm font-medium ${darkMode ? 'text-red-400' : 'text-red-600'}`}>-{formatCurrency(metrics.contractionRevenue)}</span>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Churned MRR</span>
                  <span className={`text-sm font-medium ${darkMode ? 'text-red-400' : 'text-red-600'}`}>-{formatCurrency(metrics.churnedUsersThisMonth * metrics.arpu)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Net MRR Growth</span>
                  <span className={`text-sm font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>{formatCurrency(metrics.newUsersThisMonth * metrics.arpu + metrics.expansionRevenue - metrics.contractionRevenue - metrics.churnedUsersThisMonth * metrics.arpu)}</span>
                </div>
              </div>
              
              <h3 className={`text-md font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Revenue by Plan</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Freemium</span>
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{formatCurrency(metrics.revenueByTier.freemium)} (0%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Part-Time</span>
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{formatCurrency(metrics.revenueByTier.partTime)} (23.7%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '23.7%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Standard</span>
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{formatCurrency(metrics.revenueByTier.standard)} (44.1%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '44.1%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Full-Time</span>
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{formatCurrency(metrics.revenueByTier.fullTime)} (32.2%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '32.2%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* User Growth */}
            <div className={`${darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200'} border rounded-xl shadow-sm p-6`}>
              <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>User Growth</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-neutral-700' : 'bg-gray-100'}`}>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Total Users</div>
                  <div className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{metrics.totalUsers}</div>
                  <div className={`text-xs ${darkMode ? 'text-green-400' : 'text-green-600'} mt-1`}>+7.2% from last month</div>
                </div>
                
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-neutral-700' : 'bg-gray-100'}`}>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Active Users</div>
                  <div className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{metrics.activeUsers}</div>
                  <div className={`text-xs ${darkMode ? 'text-green-400' : 'text-green-600'} mt-1`}>+5.8% from last month</div>
                </div>
                
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-neutral-700' : 'bg-gray-100'}`}>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>New Users</div>
                  <div className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{metrics.newUsersThisMonth}</div>
                  <div className={`text-xs ${darkMode ? 'text-green-400' : 'text-green-600'} mt-1`}>+12.3% from last month</div>
                </div>
                
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-neutral-700' : 'bg-gray-100'}`}>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Churned Users</div>
                  <div className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{metrics.churnedUsersThisMonth}</div>
                  <div className={`text-xs ${darkMode ? 'text-green-400' : 'text-green-600'} mt-1`}>-15% from last month</div>
                </div>
              </div>
              
              <h3 className={`text-md font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Users by Plan</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Freemium</span>
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{metrics.usersByTier.freemium} ({Math.round(metrics.usersByTier.freemium / metrics.totalUsers * 100)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.round(metrics.usersByTier.freemium / metrics.totalUsers * 100)}%` }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Part-Time</span>
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{metrics.usersByTier.partTime} ({Math.round(metrics.usersByTier.partTime / metrics.totalUsers * 100)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.round(metrics.usersByTier.partTime / metrics.totalUsers * 100)}%` }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Standard</span>
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{metrics.usersByTier.standard} ({Math.round(metrics.usersByTier.standard / metrics.totalUsers * 100)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.round(metrics.usersByTier.standard / metrics.totalUsers * 100)}%` }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Full-Time</span>
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{metrics.usersByTier.fullTime} ({Math.round(metrics.usersByTier.fullTime / metrics.totalUsers * 100)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.round(metrics.usersByTier.fullTime / metrics.totalUsers * 100)}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* TPU Usage Analysis */}
          <div className="mb-6">
            <h2 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>TPU Usage Analysis</h2>
            <div className={`${darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200'} border rounded-xl shadow-sm p-6`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* TPU Usage Overview */}
                <div>
                  <h3 className={`text-md font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>TPU Usage Overview</h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-neutral-700' : 'bg-gray-100'}`}>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Total Monthly TPU</div>
                      <div className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{new Intl.NumberFormat().format(metrics.tpuUsage.totalMonthly)}</div>
                      <div className={`text-xs ${darkMode ? 'text-green-400' : 'text-green-600'} mt-1`}>+{metrics.tpuUsage.growthRate}% MoM</div>
                    </div>
                    
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-neutral-700' : 'bg-gray-100'}`}>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Avg. TPU per User</div>
                      <div className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{new Intl.NumberFormat().format(metrics.tpuUsage.averagePerUser)}</div>
                      <div className={`text-xs ${darkMode ? 'text-green-400' : 'text-green-600'} mt-1`}>+8.2% MoM</div>
                    </div>
                  </div>
                  
                  <h4 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>TPU Usage by Plan</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Freemium</span>
                        <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{new Intl.NumberFormat().format(metrics.tpuUsage.byTier.freemium)} TPU</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div 
                          className="bg-gray-500 h-2 rounded-full" 
                          style={{ width: `${(metrics.tpuUsage.byTier.freemium / metrics.tpuUsage.byTier.fullTime) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Part-Time</span>
                        <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{new Intl.NumberFormat().format(metrics.tpuUsage.byTier.partTime)} TPU</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${(metrics.tpuUsage.byTier.partTime / metrics.tpuUsage.byTier.fullTime) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Standard</span>
                        <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{new Intl.NumberFormat().format(metrics.tpuUsage.byTier.standard)} TPU</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${(metrics.tpuUsage.byTier.standard / metrics.tpuUsage.byTier.fullTime) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Full-Time</span>
                        <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{new Intl.NumberFormat().format(metrics.tpuUsage.byTier.fullTime)} TPU</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div 
                          className="bg-purple-500 h-2 rounded-full" 
                          style={{ width: '100%' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Cost Efficiency Metrics */}
                <div>
                  <h3 className={`text-md font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Cost Efficiency Metrics</h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-neutral-700' : 'bg-gray-100'}`}>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Cost per TPU</div>
                      <div className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>${metrics.costPerTpu.toFixed(4)}</div>
                      <div className={`text-xs ${darkMode ? 'text-green-400' : 'text-green-600'} mt-1`}>{metrics.tpuUsage.costTrend}% MoM</div>
                    </div>
                    
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-neutral-700' : 'bg-gray-100'}`}>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Avg. Utilization</div>
                      <div className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {Math.round((metrics.tpuUsage.utilizationRate.freemium * metrics.usersByTier.freemium +
                          metrics.tpuUsage.utilizationRate.partTime * metrics.usersByTier.partTime +
                          metrics.tpuUsage.utilizationRate.standard * metrics.usersByTier.standard +
                          metrics.tpuUsage.utilizationRate.fullTime * metrics.usersByTier.fullTime) / metrics.totalUsers)}%
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-green-400' : 'text-green-600'} mt-1`}>+3.5% MoM</div>
                    </div>
                  </div>
                  
                  <h4 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Cost per 1000 TPU by Plan</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Freemium</span>
                        <span className={`text-sm font-medium ${darkMode ? 'text-red-400' : 'text-red-600'}`}>${metrics.tpuUsage.costEfficiency.freemium.toFixed(3)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div 
                          className="bg-red-500 h-2 rounded-full" 
                          style={{ width: `${(metrics.tpuUsage.costEfficiency.freemium / 0.1) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Part-Time</span>
                        <span className={`text-sm font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>${metrics.tpuUsage.costEfficiency.partTime.toFixed(3)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${(metrics.tpuUsage.costEfficiency.partTime / 0.1) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Standard</span>
                        <span className={`text-sm font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>${metrics.tpuUsage.costEfficiency.standard.toFixed(3)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${(metrics.tpuUsage.costEfficiency.standard / 0.1) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Full-Time</span>
                        <span className={`text-sm font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>${metrics.tpuUsage.costEfficiency.fullTime.toFixed(3)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${(metrics.tpuUsage.costEfficiency.fullTime / 0.1) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <h4 className={`text-sm font-medium mt-4 mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Utilization Rate by Plan</h4>
                  
                  <div className="grid grid-cols-4 gap-2">
                    <div className="text-center">
                      <div className={`inline-flex items-center justify-center size-12 rounded-full ${darkMode ? 'bg-neutral-700' : 'bg-gray-100'}`}>
                        <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{metrics.tpuUsage.utilizationRate.freemium}%</span>
                      </div>
                      <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Free</div>
                    </div>
                    <div className="text-center">
                      <div className={`inline-flex items-center justify-center size-12 rounded-full ${darkMode ? 'bg-neutral-700' : 'bg-gray-100'}`}>
                        <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{metrics.tpuUsage.utilizationRate.partTime}%</span>
                      </div>
                      <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Part</div>
                    </div>
                    <div className="text-center">
                      <div className={`inline-flex items-center justify-center size-12 rounded-full ${darkMode ? 'bg-neutral-700' : 'bg-gray-100'}`}>
                        <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{metrics.tpuUsage.utilizationRate.standard}%</span>
                      </div>
                      <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Std</div>
                    </div>
                    <div className="text-center">
                      <div className={`inline-flex items-center justify-center size-12 rounded-full ${darkMode ? 'bg-neutral-700' : 'bg-gray-100'}`}>
                        <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{metrics.tpuUsage.utilizationRate.fullTime}%</span>
                      </div>
                      <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Full</div>
                    </div>
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
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>LTV:CAC Ratio</span>
                        <span className={`text-sm font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>{metrics.ltvCacRatio}x</span>
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
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Gross Margin</span>
                        <span className={`text-sm font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>{formatPercentage(metrics.grossMargin)}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Net Margin</span>
                        <span className={`text-sm font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>{formatPercentage(metrics.netMargin)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Time Series Analysis */}
          <div className="mb-6">
            <h2 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Key Metrics Over Time</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* MRR Growth */}
              <div className={`${darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200'} border rounded-xl shadow-sm p-6`}>
                <h3 className={`text-md font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>MRR Growth</h3>
                <div className="flex items-end h-40 gap-4">
                  {metrics.timeSeriesData.mrr.map((value, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className={`w-full ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} rounded-t-sm`}
                        style={{ 
                          height: `${(value / Math.max(...metrics.timeSeriesData.mrr)) * 100}%`,
                          minHeight: '4px'
                        }}
                      ></div>
                      <span className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{metrics.timeSeriesData.months[index]}</span>
                      <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>${(value / 1000).toFixed(0)}k</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* User Growth */}
              <div className={`${darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200'} border rounded-xl shadow-sm p-6`}>
                <h3 className={`text-md font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>User Growth</h3>
                <div className="flex items-end h-40 gap-4">
                  {metrics.timeSeriesData.users.map((value, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className={`w-full ${darkMode ? 'bg-green-600' : 'bg-green-500'} rounded-t-sm`}
                        style={{ 
                          height: `${(value / Math.max(...metrics.timeSeriesData.users)) * 100}%`,
                          minHeight: '4px'
                        }}
                      ></div>
                      <span className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{metrics.timeSeriesData.months[index]}</span>
                      <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* TPU Usage Growth */}
              <div className={`${darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200'} border rounded-xl shadow-sm p-6`}>
                <h3 className={`text-md font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>TPU Usage (thousands)</h3>
                <div className="flex items-end h-40 gap-4">
                  {metrics.timeSeriesData.tpuUsage.map((value, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className={`w-full ${darkMode ? 'bg-purple-600' : 'bg-purple-500'} rounded-t-sm`}
                        style={{ 
                          height: `${(value / Math.max(...metrics.timeSeriesData.tpuUsage)) * 100}%`,
                          minHeight: '4px'
                        }}
                      ></div>
                      <span className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{metrics.timeSeriesData.months[index]}</span>
                      <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{(value / 1000).toFixed(0)}k</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Churn Rate Trend */}
              <div className={`${darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200'} border rounded-xl shadow-sm p-6`}>
                <h3 className={`text-md font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Churn Rate (%)</h3>
                <div className="flex items-end h-40 gap-4">
                  {metrics.timeSeriesData.churnRate.map((value, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className={`w-full ${darkMode ? 'bg-red-600' : 'bg-red-500'} rounded-t-sm`}
                        style={{ 
                          height: `${(value / Math.max(...metrics.timeSeriesData.churnRate)) * 100}%`,
                          minHeight: '4px'
                        }}
                      ></div>
                      <span className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{metrics.timeSeriesData.months[index]}</span>
                      <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{value.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* User Management */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>User Management</h2>
              <div className="flex items-center space-x-2">
                <div className={`relative ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg className="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    className={`py-2 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-neutral-700 text-white' : 'bg-white text-gray-900'}`}
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className={`py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-neutral-700 text-white' : 'bg-white text-gray-900'}`}
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                >
                  <option value="all">All Users</option>
                  <option value="active">Active</option>
                  <option value="at_risk">At Risk</option>
                  <option value="churned">Churned</option>
                </select>
              </div>
            </div>
            
            <div className={`${darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200'} border rounded-xl shadow-sm overflow-hidden`}>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className={darkMode ? 'bg-neutral-700' : 'bg-gray-50'}>
                    <tr>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>User</th>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Plan</th>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>MRR</th>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Status</th>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Join Date</th>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Last Active</th>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>TPU Usage</th>
                      <th scope="col" className={`px-6 py-3 text-right text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y divide-gray-200 dark:divide-gray-700 ${darkMode ? 'bg-neutral-800' : 'bg-white'}`}>
                    {filteredUsers.map(user => (
                      <tr key={user.id} className={darkMode ? 'hover:bg-neutral-700' : 'hover:bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`flex-shrink-0 size-10 rounded-full flex items-center justify-center ${darkMode ? 'bg-blue-600' : 'bg-blue-100'}`}>
                              <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-blue-600'}`}>
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</div>
                              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.plan === 'Full-Time' 
                              ? (darkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800') 
                              : user.plan === 'Standard'
                                ? (darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800')
                                : user.plan === 'Part-Time'
                                  ? (darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800')
                                  : (darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800')
                          }`}>
                            {user.plan}
                          </span>
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {formatCurrency(user.mrr)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.status === 'active' 
                              ? (darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800') 
                              : user.status === 'at_risk'
                                ? (darkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800')
                                : (darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800')
                          }`}>
                            {user.status === 'active' ? 'Active' : user.status === 'at_risk' ? 'At Risk' : 'Churned'}
                          </span>
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                          {formatDate(user.joinDate)}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                          {formatDate(user.lastActive)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 mr-2" style={{ width: '100px' }}>
                              <div 
                                className={`h-2 rounded-full ${
                                  user.tpuUsage > 75 
                                    ? 'bg-green-500' 
                                    : user.tpuUsage > 25 
                                      ? 'bg-blue-500' 
                                      : 'bg-gray-500'
                                }`} 
                                style={{ width: `${user.tpuUsage}%` }}
                              ></div>
                            </div>
                            <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>{user.tpuUsage}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className={`text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3`}>
                            View
                          </button>
                          <button className={`text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300`}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredUsers.length === 0 && (
                <div className={`py-8 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  No users found matching your criteria
                </div>
              )}
            </div>
          </div>
          
          {/* OpenWebUI User Management */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Open WebUI User Management</h2>
              <div className="flex items-center space-x-2">
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => setIsUserModalOpen(true)}
                      className={`py-2 px-4 rounded-lg ${darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white transition-colors`}
                    >
                      Create User
                    </button>
                    <button
                      onClick={handleLogout}
                      className={`py-2 px-4 rounded-lg ${darkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white transition-colors`}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className={`py-2 px-4 rounded-lg ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}
                  >
                    Login to Open WebUI
                  </button>
                )}
              </div>
            </div>
            
            {/* API Configuration */}
            <div className={`${darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200'} border rounded-xl shadow-sm p-6 mb-4`}>
              <h3 className={`text-md font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>API Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Base URL
                  </label>
                  <input
                    type="text"
                    name="baseUrl"
                    value={openWebUIApiConfig.baseUrl}
                    onChange={handleApiConfigChange}
                    className={`w-full py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-neutral-700 text-white' : 'bg-white text-gray-900'} border ${darkMode ? 'border-neutral-600' : 'border-gray-300'}`}
                    placeholder="http://localhost:8081"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    API Path
                  </label>
                  <input
                    type="text"
                    name="apiPath"
                    value={openWebUIApiConfig.apiPath}
                    onChange={handleApiConfigChange}
                    className={`w-full py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-neutral-700 text-white' : 'bg-white text-gray-900'} border ${darkMode ? 'border-neutral-600' : 'border-gray-300'}`}
                    placeholder="/api/v1"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleTestConnection}
                    disabled={isTestingConnection}
                    className={`py-2 px-4 rounded-lg ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors ${isTestingConnection ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isTestingConnection ? 'Testing...' : 'Test Connection'}
                  </button>
                </div>
              </div>
              
              {/* Connection status message */}
              {connectionStatus && (
                <div className={`mt-4 p-3 rounded-lg ${connectionStatus.success ? (darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800') : (darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800')}`}>
                  {connectionStatus.message}
                </div>
              )}
              
              {/* Auth error message */}
              {authError && (
                <div className={`mt-4 p-3 rounded-lg ${darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'}`}>
                  Authentication error: {authError}
                </div>
              )}
            </div>
            
            {/* User table */}
            {isAuthenticated ? (
              <OpenWebUIUserTable 
                darkMode={darkMode}
                onEditUser={handleEditUser}
                onUserDeleted={() => {}}
                onError={(error) => setAuthError(error)}
                onLoginRequired={() => setIsLoginModalOpen(true)}
              />
            ) : (
              <div className={`${darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200'} border rounded-xl shadow-sm p-6 text-center`}>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                  Please login to Open WebUI to manage users
                </p>
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className={`py-2 px-4 rounded-lg ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}
                >
                  Login
                </button>
              </div>
            )}
          </div>
          
          {/* OpenWebUI Login Modal */}
          <OpenWebUILoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            darkMode={darkMode}
            onSuccess={handleLoginSuccess}
          />
          
          {/* OpenWebUI User Create Modal */}
          <OpenWebUIUserModal
            isOpen={isUserModalOpen}
            onClose={() => setIsUserModalOpen(false)}
            darkMode={darkMode}
            onSuccess={handleUserCreated}
          />
          
          {/* OpenWebUI User Edit Modal */}
          <OpenWebUIUserEditModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedUser(null);
            }}
            darkMode={darkMode}
            user={selectedUser}
            onSuccess={handleUserEdited}
          />
        </main>
      </div>
    </div>
  );
}
