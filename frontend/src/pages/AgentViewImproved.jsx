import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { getBot } from "../utils/botsData";
import { getFromStorage, STORAGE_KEYS } from "../utils/localStorage";
import {
  FileSpreadsheet, Zap, MessageSquare, Globe, Info, Code,
  MoreHorizontal, Upload, Play, Search, Plus,
  ChevronDown, HelpCircle
} from "lucide-react";
import { Button } from "../components/ui/button";
import { AgentViewHeaderBar } from "../components/ui/AgentViewHeaderBar";
import { AgentViewSidebar } from "../components/ui/AgentViewSidebar";
import { PromptSection } from "../components/AgentView/PromptSection";
import { KnowledgeSection } from "../components/AgentView/KnowledgeSection";
import { DefaultSection } from "../components/AgentView/DefaultSection";
import { GeneralSettingsSection } from "../components/AgentView/GeneralSettingsSection";
import { AdvancedSettingsSection } from "../components/AgentView/AdvancedSettingsSection";

export default function AgentView() {
  const { botId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(getFromStorage(STORAGE_KEYS.DARK_MODE, false));
  const [bot, setBot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(true);
  const [activeTab, setActiveTab] = useState('add-existing');

  // Get initial active section from URL or default to 'general'
  const initialSection = new URLSearchParams(location.search).get('section') || 'general';
  const [activeSection, setActiveSection] = useState(initialSection);

  // Update URL when active section changes
  const handleSectionChange = (section) => {
    setActiveSection(section);
    navigate(`/agent/${botId}?section=${section}`, { replace: true });
  };

  // Mock user data instead of using auth context
  const user = { name: 'User' };
  
  // A/B Testing controls
  const [showABPanel, setShowABPanel] = useState(false);
  
  // Function to switch to original version
  const switchToOriginal = () => {
    navigate(`/agent-original/${botId}`);
  };
  
  // Knowledge items
  const [knowledgeItems, setKnowledgeItems] = useState([
    { name: 'kj', status: 'active', type: 'Tool' }
  ]);

  // Load bot data
  useEffect(() => {
    const botData = getBot(botId);
    setBot(botData);
    setLoading(false);
  }, [botId]);
  
  // File upload handlers
  const handleFileUpload = (e) => {
    // Handle file upload logic
    console.log('File upload:', e.target.files);
    // Add logic to process the file and update knowledge items
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    console.log('Files dropped:', files);
    // Process dropped files
  };

  // Update useEffect to handle URL changes
  useEffect(() => {
    const section = new URLSearchParams(location.search).get('section');
    if (section && section !== activeSection) {
      setActiveSection(section);
    }
  }, [location]);

  // Show loading state
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-neutral-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show not found if bot doesn't exist
  if (!bot) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 text-center ${darkMode ? 'bg-neutral-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
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

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'general':
        return <GeneralSettingsSection darkMode={darkMode} bot={bot} />;
      case 'prompt':
        return <PromptSection darkMode={darkMode} bot={bot} />;
      case 'knowledge':
        return <KnowledgeSection darkMode={darkMode} bot={bot} botId={botId} />;
      case 'advanced':
        return <AdvancedSettingsSection darkMode={darkMode} bot={bot} />;
      default:
        return (
          <DefaultSection 
            darkMode={darkMode} 
            sectionName={activeSection}
            onBackClick={() => setActiveSection('knowledge')} 
          />
        );
    }
  };

  return (
    <div className={`flex flex-col h-screen ${darkMode ? 'bg-neutral-900 text-white' : 'bg-white text-gray-800'}`}>
      <AgentViewHeaderBar 
        darkMode={darkMode}
        saved={saved}
        setSaved={setSaved}
        user={user}
      />
      
      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        <AgentViewSidebar 
          darkMode={darkMode}
          activeSection={activeSection}
          setActiveSection={handleSectionChange}
        />

        {/* Main content area with improved styling */}
        <div className={`flex-1 overflow-y-auto min-w-0 ${darkMode ? 'bg-neutral-800' : 'bg-gray-100'}`}>
          <div className="h-full max-w-[1200px] mx-auto p-8">
            {renderActiveSection()}
          </div>
        </div>

        {/* Right sidebar
        <div className={`w-72 border-l overflow-y-auto ${darkMode ? 'border-neutral-800 bg-neutral-900' : 'border-gray-200 bg-white'} shadow-md`}>
          <div className={`p-4 border-b ${darkMode ? 'border-neutral-800' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1">
                <span className="font-medium">Tools</span>
                <ChevronDown className="h-4 w-4" />
              </div>
              <Button size="sm" variant="outline" className={`h-7 gap-1 ${darkMode ? 'border-gray-700 text-gray-300' : ''}`}>
                <Plus className="h-3 w-3" />
                Add tool
              </Button>
            </div>

            <div className="space-y-3">
              <div className={`flex items-center justify-between p-2 rounded-md ${darkMode ? 'hover:bg-neutral-800' : 'hover:bg-gray-50'}`}>
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <div>
                    <div className="font-medium text-sm">Analyse CSV</div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Analyse CSV data, please be specific about your question
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`rounded p-0.5 ${darkMode ? 'bg-neutral-700' : 'bg-gray-100'}`}>
                    <Zap className="h-3 w-3" />
                  </div>
                  <MoreHorizontal className={`h-4 w-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
              </div>

              <div className={`flex items-center justify-between p-2 rounded-md ${darkMode ? 'hover:bg-neutral-800' : 'hover:bg-gray-50'}`}>
                <div className="flex items-center gap-2">
                  <MessageSquare className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <div>
                    <div className="font-medium text-sm">GPT on my files</div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Get your questions answered on any PDF, CSV, or audio file
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`rounded p-0.5 ${darkMode ? 'bg-neutral-700' : 'bg-gray-100'}`}>
                    <Zap className="h-3 w-3" />
                  </div>
                  <MoreHorizontal className={`h-4 w-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
              </div>

              <div className={`flex items-center justify-between p-2 rounded-md ${darkMode ? 'hover:bg-neutral-800' : 'hover:bg-gray-50'}`}>
                <div className="flex items-center gap-2">
                  <MessageSquare className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <div>
                    <div className="font-medium text-sm">Summarize meeting transcript</div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Summarize a meeting transcript to get the most accurate...
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`rounded p-0.5 ${darkMode ? 'bg-neutral-700' : 'bg-gray-100'}`}>
                    <Zap className="h-3 w-3" />
                  </div>
                  <MoreHorizontal className={`h-4 w-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
              </div>

              <div className={`flex items-center justify-between p-2 rounded-md ${darkMode ? 'hover:bg-neutral-800' : 'hover:bg-gray-50'}`}>
                <div className="flex items-center gap-2">
                  <Search className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <div>
                    <div className="font-medium text-sm">Google Search</div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Search the internet for the latest information about a topic
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`rounded p-0.5 ${darkMode ? 'bg-neutral-700' : 'bg-gray-100'}`}>
                    <Zap className="h-3 w-3" />
                  </div>
                  <MoreHorizontal className={`h-4 w-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
              </div>

              <div className={`flex items-center justify-between p-2 rounded-md ${darkMode ? 'hover:bg-neutral-800' : 'hover:bg-gray-50'}`}>
                <div className="flex items-center gap-2">
                  <Globe className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <div>
                    <div className="font-medium text-sm">Scrape & summarize website</div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Scrape website content via URL, do NOT make up URLs
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`rounded p-0.5 ${darkMode ? 'bg-neutral-700' : 'bg-gray-100'}`}>
                    <Zap className="h-3 w-3" />
                  </div>
                  <MoreHorizontal className={`h-4 w-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
              </div>

              <div className={`flex items-center justify-between p-2 rounded-md ${darkMode ? 'hover:bg-neutral-800' : 'hover:bg-gray-50'}`}>
                <div className="flex items-center gap-2">
                  <Info className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <div>
                    <div className="font-medium text-sm">Add conversation metadata</div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Every time you run a tool or receive a message, you must...
                    </div>
                  </div>
                </div>
                <div className={`text-xs ${darkMode ? 'bg-neutral-700 text-gray-300' : 'bg-gray-100'} rounded px-1.5 py-0.5`}>Built-in</div>
              </div>

              <div className={`flex items-center justify-between p-2 rounded-md ${darkMode ? 'hover:bg-neutral-800' : 'hover:bg-gray-50'}`}>
                <div className="flex items-center gap-2">
                  <Code className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <div>
                    <div className="font-medium text-sm">kj</div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Use this to retrieve knowledge from "kj"
                    </div>
                  </div>
                </div>
                <div className={`text-xs ${darkMode ? 'bg-neutral-700 text-gray-300' : 'bg-gray-100'} rounded px-1.5 py-0.5`}>Built-in</div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
      
      {/* Compact A/B Testing Button */}
      <button 
        onClick={() => setShowABPanel(!showABPanel)}
        className="fixed bottom-6 left-4 bg-gray-800 hover:bg-gray-900 text-gray-100 p-2 rounded-full shadow-md z-50 transition-all duration-200 hover:scale-110 hover:shadow-lg border border-gray-700/50"
        title="A/B Testing Controls"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9"></path>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
        </svg>
      </button>
      
      {/* A/B Testing Panel */}
      {showABPanel && (
        <div className="fixed bottom-16 left-4 bg-gray-900 text-gray-100 p-3 rounded-lg shadow-2xl z-50 text-sm border border-gray-700 backdrop-blur-sm" style={{ width: '280px' }}>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">A/B Testing Controls</h3>
            <button 
              onClick={() => setShowABPanel(false)}
              className="text-gray-400 hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div className="mb-3 p-2 bg-gray-800 rounded border border-gray-700">
            <div className="mb-1">Current version:</div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <strong>Improved Version</strong>
            </div>
          </div>
          
          <div className="space-y-2">
            <button 
              onClick={switchToOriginal}
              className="w-full bg-blue-700 hover:bg-blue-800 text-gray-100 py-2 px-3 rounded text-sm flex items-center justify-center gap-2 border border-blue-600/50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 2v6h-6"></path>
                <path d="M3 12a9 9 0 0 1 15-6.7l3-3"></path>
                <path d="M3 22v-6h6"></path>
                <path d="M21 12a9 9 0 0 1-15 6.7l-3 3"></path>
              </svg>
              Switch to Original Version
            </button>
          </div>
          
          <div className="mt-3 text-xs text-gray-400">
            You are currently viewing the improved version.
          </div>
        </div>
      )}
    </div>
  );
}