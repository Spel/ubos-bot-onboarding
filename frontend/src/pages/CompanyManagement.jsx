import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getFromStorage, saveToStorage, STORAGE_KEYS } from "../utils/localStorage";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

// Import company management tab components
import { 
  ProfileTab, 
  TeamTab, 
  ServicesTab, 
  APISettingsTab, 
  PublishingTab 
} from '../components/CompanyManagement';

export default function CompanyManagement() {
  const [darkMode, setDarkMode] = useState(getFromStorage(STORAGE_KEYS.DARK_MODE, false));
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [companyData, setCompanyData] = useState({
    name: "",
    logo: "🏢",
    description: "",
    publicUrl: "",
    teamMembers: [],
    services: [],
    apiKeys: [],
    webhookEndpoints: [],
    a2aEnabled: false,
    isPublic: false
  });

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

  // Load company data if exists
  useEffect(() => {
    const savedCompanyData = getFromStorage(STORAGE_KEYS.COMPANY_DATA, null);
    
    if (savedCompanyData) {
      setCompanyData(savedCompanyData);
    }
    
    setLoading(false);
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Company Profile' },
    { id: 'team', label: 'Agent Team' },
    { id: 'services', label: 'Services' },
    { id: 'api', label: 'API & A2A Settings' },
    { id: 'publishing', label: 'Publishing' },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-neutral-900' : 'bg-gray-50'}`}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <Sidebar darkMode={darkMode} />
      
      {/* Main content area */}
      <div style={{ paddingLeft: '16rem', paddingTop: '61px' }}>
        {/* Main content */}
        <div className="w-full">
          <main className="p-6">
            {/* Header with title and actions */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {companyData.name || "My Company"}
                </h1>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    // Save current company data
                    saveToStorage(STORAGE_KEYS.COMPANY_DATA, companyData);
                  }}
                  className={`py-2 px-4 rounded-lg ${
                    darkMode 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  } transition-colors text-sm font-medium`}
                >
                  Save Changes
                </button>
                {companyData.isPublic && (
                  <Link 
                    to={`/company/${companyData.publicUrl}`} 
                    target="_blank"
                    className={`py-2 px-4 rounded-lg ${
                      darkMode 
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    } transition-colors text-sm font-medium`}
                  >
                    View Public Page
                  </Link>
                )}
              </div>
            </div>
            
            {/* Tabs */}
            <div className="mb-6 border-b pb-1 flex overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-4 font-medium text-sm border-b-2 ${
                    activeTab === tab.id
                      ? (darkMode ? 'border-blue-500 text-blue-400' : 'border-blue-600 text-blue-600')
                      : (darkMode ? 'border-transparent text-gray-400 hover:text-gray-300' : 'border-transparent text-gray-500 hover:text-gray-700')
                  } transition-colors`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            {/* Tab Content */}
            <div>
              {activeTab === 'profile' && (
                <ProfileTab 
                  darkMode={darkMode} 
                  companyData={companyData} 
                  setCompanyData={setCompanyData}
                />
              )}
              {activeTab === 'team' && (
                <TeamTab 
                  darkMode={darkMode} 
                  companyData={companyData} 
                  setCompanyData={setCompanyData}
                />
              )}
              {activeTab === 'services' && (
                <ServicesTab 
                  darkMode={darkMode} 
                  companyData={companyData} 
                  setCompanyData={setCompanyData}
                />
              )}
              {activeTab === 'api' && (
                <APISettingsTab 
                  darkMode={darkMode} 
                  companyData={companyData} 
                  setCompanyData={setCompanyData}
                />
              )}
              {activeTab === 'publishing' && (
                <PublishingTab 
                  darkMode={darkMode} 
                  companyData={companyData} 
                  setCompanyData={setCompanyData}
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
