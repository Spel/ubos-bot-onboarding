import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getFromStorage, saveToStorage, STORAGE_KEYS } from "../utils/localStorage";
import { SidebarInset } from "../components/ui/sidebar";

// Import company management tab components
import { 
  ProfileTab, 
  TeamTab, 
  ServicesTab, 
  APISettingsTab, 
  PublishingTab 
} from '../components/CompanyManagement';

export default function CompanyManagement() {
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
    <div className="flex min-h-screen bg-gray-50 dark:bg-neutral-900">
      <SidebarInset>
        <main className="flex-1 p-6">
          {/* Header with title and actions */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {companyData.name || "My Company"}
              </h1>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  // Save current company data
                  saveToStorage(STORAGE_KEYS.COMPANY_DATA, companyData);
                }}
                className="py-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-colors text-sm font-medium"
              >
                Save Changes
              </button>
              {companyData.isPublic && (
                <Link 
                  to={`/company/${companyData.publicUrl}`} 
                  target="_blank"
                  className="py-2 px-4 rounded-lg bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white transition-colors text-sm font-medium"
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
                className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
            
          {/* Tab Content */}
          <div>
            {activeTab === 'profile' && (
              <ProfileTab 
                companyData={companyData} 
                setCompanyData={setCompanyData}
              />
            )}
            {activeTab === 'team' && (
              <TeamTab 
                companyData={companyData} 
                setCompanyData={setCompanyData}
              />
            )}
            {activeTab === 'services' && (
              <ServicesTab 
                companyData={companyData} 
                setCompanyData={setCompanyData}
              />
            )}
            {activeTab === 'api' && (
              <APISettingsTab 
                companyData={companyData} 
                setCompanyData={setCompanyData}
              />
            )}
            {activeTab === 'publishing' && (
              <PublishingTab 
                companyData={companyData} 
                setCompanyData={setCompanyData}
              />
            )}
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}
