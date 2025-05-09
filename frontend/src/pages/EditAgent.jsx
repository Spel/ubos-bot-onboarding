import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getBot, updateBot } from "../utils/botsData";
import { getFromStorage, saveToStorage, STORAGE_KEYS } from "../utils/localStorage";
import { getAllTemplates } from "../utils/templateData";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { GeneralTab, TeamTab, PromptTab, KnowledgeTab, IntegrationsTab, AnalyticsTab, CreatorTab } from '../components/EditAgent';
import AgentCreatorChat from '../components/EditAgent/AgentCreatorChat';

export default function EditAgent() {
  const { botId } = useParams();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(getFromStorage(STORAGE_KEYS.DARK_MODE, false));
  const [activeTab, setActiveTab] = useState('general');
  const [bot, setBot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "support",
    status: "active",
    avatar: "🤖",
    email: "",
    phoneNumber: "",
    whatsApp: "",
    linkedin: "",
    domain: "",
    teamMembers: []
  });
  const [templates, setTemplates] = useState([]);
  const [isCreatorChatOpen, setIsCreatorChatOpen] = useState(false);

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

  // Load bot data and templates
  useEffect(() => {
    const botData = getBot(botId);
    const allTemplates = getAllTemplates();
    
    setTemplates(allTemplates);
    
    if (botData) {
      setBot(botData);
      setFormData({
        name: botData.name || "",
        description: botData.description || "",
        type: botData.type || "support",
        status: botData.status || "active",
        avatar: botData.avatar || "🤖",
        email: botData.email || "",
        phoneNumber: botData.phoneNumber || "",
        whatsApp: botData.whatsApp || "",
        linkedin: botData.linkedin || "",
        domain: botData.domain || `https://agent-${botData.id}.ubos.tech`,
        teamMembers: botData.teamMembers || []
      });
    }
    
    setLoading(false);
  }, [botId]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!bot) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Agent Not Found</h1>
        <p className="mb-6">Sorry, we couldn't find the agent you're looking for.</p>
        <Link 
          to="/my-bots" 
          className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          Back to My Agents
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'general', label: 'General' },
    // { id: 'team', label: 'Team' },
    { id: 'prompt', label: 'Prompt Engineering' },
    { id: 'knowledge', label: 'Knowledge Base' },
    { id: 'integrations', label: 'Integrations' },
    // { id: 'analytics', label: 'Analytics' },
    // { id: 'creator', label: 'Agent Creator' },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-neutral-900' : 'bg-gray-50'}`}>
      {/* Top navigation area */}
      <div className="sticky top-0 z-10">
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      </div>
      <Sidebar darkMode={darkMode} />
      
      {/* Main content area */}
      <div style={{ paddingLeft: '16rem', paddingTop: '61px' }}> 
        <div className="flex">
          {/* Main content area - scrollable */}
          <div className={`transition-all duration-300 ease-in-out ${isCreatorChatOpen ? 'w-[70%]' : 'w-full'}`} style={{ height: 'calc(100vh - 61px)', overflowY: 'auto' }}>
            <main className="p-6">
              {/* Header with title and actions */}
              <div className="mb-6 flex items-center justify-between">
                <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {formData.name}
                </h1>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setIsCreatorChatOpen(!isCreatorChatOpen)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${darkMode 
                      ? (isCreatorChatOpen ? 'bg-green-700 text-white' : 'bg-green-900/30 text-green-300 hover:bg-green-800/50') 
                      : (isCreatorChatOpen ? 'bg-green-600 text-white' : 'bg-green-50 text-green-700 hover:bg-green-100')}`}
                  >
                    <svg className="size-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    {isCreatorChatOpen ? 'Hide Agent Chat' : 'Open Agent Chat'}
                  </button>
                  <Link 
                    to="/my-bots" 
                    className={`inline-flex items-center gap-2 py-2 px-4 rounded-lg ${darkMode ? 'bg-neutral-700 hover:bg-neutral-600 text-neutral-100' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} transition-colors text-sm font-medium`}
                  >
                    <svg className="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    My Agents
                  </Link>
                </div>
              </div>
              
              {/* Tabs */}
              <div className="mb-6 border-b pb-1 flex overflow-x-auto scrollbar-hide">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-4 font-medium text-sm border-b-2 ${activeTab === tab.id
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
                {activeTab === 'general' && (
                  <GeneralTab 
                    darkMode={darkMode} 
                    formData={formData} 
                    setFormData={setFormData}
                    bot={bot}
                    botId={botId}
                  />
                )}
                {activeTab === 'prompt' && (
                  <PromptTab darkMode={darkMode} />
                )}
                {activeTab === 'knowledge' && (
                  <KnowledgeTab darkMode={darkMode} />
                )}
                {activeTab === 'integrations' && (
                  <IntegrationsTab 
                    darkMode={darkMode} 
                    bot={bot} 
                    botId={botId} 
                    formData={formData} 
                    setFormData={setFormData} 
                  />
                )}
                {activeTab === 'analytics' && (
                  <AnalyticsTab darkMode={darkMode} />
                )}
                {activeTab === 'creator' && (
                  <CreatorTab 
                    darkMode={darkMode}
                    formData={formData}
                    setFormData={setFormData}
                    bot={bot}
                    botId={botId}
                  />
                )}
                {activeTab === 'team' && (
                  <TeamTab 
                    darkMode={darkMode}
                    formData={formData}
                    setFormData={setFormData}
                    templates={templates}
                    bot={bot}
                    botId={botId}
                  />
                )}
              </div>
            </main>
          </div>

          {/* Agent Chat Panel */}
          <div className={`w-[30%] transition-all duration-300 ease-in-out ${
            isCreatorChatOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 w-0'
          } border-l ${darkMode ? 'border-neutral-700' : 'border-gray-200'}`}>
            <AgentCreatorChat 
              darkMode={darkMode}
              isOpen={isCreatorChatOpen}
              onClose={() => setIsCreatorChatOpen(false)}
              formData={formData}
              setFormData={setFormData}
              bot={bot}
              botId={botId}
              activeTab={activeTab}
              saveChanges={() => {
                const updatedBot = {
                  ...bot,
                  ...formData
                };
                updateBot(botId, updatedBot);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
