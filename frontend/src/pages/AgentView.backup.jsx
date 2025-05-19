import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBot } from "../utils/botsData";
import { getFromStorage, saveToStorage, STORAGE_KEYS } from "../utils/localStorage";
import "../components/NovelEditor.css";

// Import tab components
import InstructionsTab from "../components/AgentTabs/InstructionsTab";
import KnowledgeBaseTab from "../components/AgentTabs/KnowledgeBaseTab";
import TriggersTab from "../components/AgentTabs/TriggersTab";
import EscalationsTab from "../components/AgentTabs/EscalationsTab";
import MetadataTab from "../components/AgentTabs/MetadataTab";

// Icons
import { Moon, Sun, ChevronLeft, Edit2, MoreVertical } from "lucide-react";

// Tab configuration
const TABS = [
  { id: 'instructions', label: 'Instructions', icon: '📝' },
  { id: 'knowledge', label: 'Knowledge Base', icon: '📚' },
  { id: 'triggers', label: 'Triggers', icon: '⏰' },
  { id: 'escalations', label: 'Escalations', icon: '⚠️' },
  { id: 'metadata', label: 'Metadata', icon: '⚙️' },
];

// Default editor content
const defaultEditorContent = {
  "type": "doc",
  "content": [
    {
      "type": "heading",
      "attrs": { "level": 2 },
      "content": [{ "type": "text", "text": "Researcher Rachel" }]
    },
    {
      "type": "paragraph",
      "content": [{ "type": "text", "text": "Your name is Rachel, a world-class industry researcher and analyst capable of conducting detailed research on any topic and producing fact-based results." }]
    }
  ]
};

export default function AgentView() {
  const { botId } = useParams();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(getFromStorage(STORAGE_KEYS.DARK_MODE, false));
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('instructions');
  const [isSaving, setIsSaving] = useState(false);
  const [editorContent, setEditorContent] = useState(defaultEditorContent);
  const [bot, setBot] = useState(null);
  const [loading, setLoading] = useState(true);
    "type": "doc",
    "content": [
      {
        "type": "heading",
        "attrs": { "level": 2 },
        "content": [{ "type": "text", "text": "Researcher Rachel" }]
      },
      {
        "type": "paragraph",
        "content": [{ "type": "text", "text": "Your name is Rachel, a world-class industry researcher and analyst capable of conducting detailed research on any topic and producing fact-based results." }]
      },
      {
        "type": "heading",
        "attrs": { "level": 3 },
        "content": [{ "type": "text", "text": "Who You Are:" }]
      },
      {
        "type": "orderedList",
        "content": [
          {
            "type": "listItem",
            "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Your name is Rachel, and you are a senior researcher." }] }]
          },
          {
            "type": "listItem",
            "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "You are passionate about your subject and committed to thorough research." }] }]
          }
        ]
      },
      {
        "type": "heading",
        "attrs": { "level": 3 },
        "content": [{ "type": "text", "text": "How You Behave:" }]
      },
      {
        "type": "orderedList",
        "content": [
          {
            "type": "listItem",
            "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "You should conduct comprehensive research to gather as much information as possible about the objective." }] }]
          },
          {
            "type": "listItem",
            "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "If there are URLs of relevant links and articles, you will scrape them to gather more information." }] }]
          },
          {
            "type": "listItem",
            "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "After scraping and searching, consider, \"Are there new aspects I should research and analyze based on the data I've collected to enhance the quality of my research?\" If the answer is yes, continue; however, limit this to no more than three iterations." }] }]
          },
          {
            "type": "listItem",
            "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Avoid fabrications; only present facts and data you have collected." }] }]
          },
          {
            "type": "listItem",
            "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "In your final output, include all reference data and links to support your research." }] }]
          }
        ]
      }
    ]
  });
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('instructions');
  
  // Handle editor content updates
  const handleEditorUpdate = (content) => {
    setEditorContent(content);
    console.log('Content updated:', content);
  };
  
  // Manual save function
  const saveContent = () => {
    setIsSaving(true);
    // Simulate saving to backend
    setTimeout(() => {
      console.log('Content saved manually:', editorContent);
      setIsSaving(false);
    }, 1000);
  };

  // Render the active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'instructions':
        return (
          <InstructionsTab 
            darkMode={darkMode} 
            editorContent={editorContent} 
            onEditorUpdate={handleEditorUpdate} 
          />
        );
      case 'knowledge':
        return <KnowledgeBaseTab darkMode={darkMode} />;
      case 'triggers':
        return <TriggersTab darkMode={darkMode} />;
      case 'escalations':
        return <EscalationsTab darkMode={darkMode} />;
      case 'metadata':
        return <MetadataTab darkMode={darkMode} />;
      default:
        return null;
    }
  };

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

  // Load bot data
  useEffect(() => {
    const botData = getBot(botId);
    
    if (botData) {
      setBot(botData);
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

  return (
    <div className={`flex flex-col w-full h-screen ${darkMode ? 'bg-neutral-900' : 'bg-white'} overflow-hidden`}>
      {/* Header */}
      <header className={`flex items-center justify-between ${darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200'} border-b py-2 px-4`}>
        <div className="flex items-center gap-x-1 grow basis-0">
          <Link 
            to="/my-bots" 
            className={`p-2 rounded-lg ${darkMode ? 'hover:bg-neutral-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'} h-8 w-8 flex items-center justify-center`}
            aria-label="Go back"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="text-xs text-purple-600">R</span>
            </div>
            <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Researcher Rachel</span>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </div>
          <span className="text-gray-500 text-sm">Unsaved</span>
        </div>
        
        <div className="flex flex-row-reverse gap-x-2 grow basis-0 items-center">
          <div className="flex items-center gap-2 ml-2">
            <button 
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-neutral-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              {darkMode ? (
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/>
                  <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>
                </svg>
              ) : (
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
            <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-neutral-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex">
            <button className="px-3 py-1 rounded-lg text-xs font-medium bg-black text-white hover:bg-gray-800 rounded-r-none">
              Publish changes
            </button>
            <button className="p-1 rounded-lg text-xs font-medium bg-black text-white hover:bg-gray-800 rounded-l-none border-l border-gray-700 h-full flex items-center justify-center">
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
          
          <span className="text-sm text-gray-500 hidden md:inline-flex">Versions</span>
          
          <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-neutral-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>
            <Search className="h-4 w-4" />
          </button>
          
          <div className="flex items-center gap-1">
            <button className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium border ${darkMode ? 'border-neutral-700 text-gray-300 hover:bg-neutral-700' : 'border-gray-200 text-gray-700 hover:bg-gray-100'}`}>
              <Settings className="h-4 w-4" />
              Build
            </button>
          </div>
          
          <button className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium border ${darkMode ? 'border-neutral-700 text-gray-300 hover:bg-neutral-700' : 'border-gray-200 text-gray-700 hover:bg-gray-100'}`}>
            <Play className="h-4 w-4" />
            Run
          </button>
        </div>
      </header>
      
      {/* 3-column layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className={`w-64 border-r ${darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200'} overflow-y-auto sticky top-0 h-[calc(100vh-42px)]`}>
          <div className="flex-grow p-4">
            {/* Prompt Section - Active */}
            <div className="mb-4">
              <div className={`flex items-center gap-3 p-3 rounded-lg ${darkMode ? 'bg-indigo-900/20' : 'bg-indigo-50'} cursor-pointer`}>
                <svg className="size-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <div>
                  <h3 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Prompt</h3>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Create guidelines for your agent</p>
                </div>
              </div>
            </div>
            
            {/* Tools Section */}
            <div className="mb-4">
              <div className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 cursor-pointer`}>
                <svg className="size-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                  <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                  <line x1="6" y1="6" x2="6.01" y2="6"></line>
                  <line x1="6" y1="18" x2="6.01" y2="18"></line>
                </svg>
                <div>
                  <h3 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Tools</h3>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Used by agents to complete tasks</p>
                </div>
              </div>
            </div>
            
            {/* Knowledge Section */}
            <div className="mb-4">
              <div className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 cursor-pointer`}>
                <svg className="size-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
                <div>
                  <h3 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Knowledge</h3>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Add your documents and data</p>
                </div>
              </div>
            </div>
            
            {/* Triggers Section */}
            <div className="mb-4">
              <div className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 cursor-pointer`}>
                <svg className="size-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                </svg>
                <div>
                  <h3 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Triggers</h3>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Run tasks on auto-pilot</p>
                </div>
              </div>
            </div>
            
            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-neutral-700 my-4"></div>
            
            {/* Escalations Section */}
            <div className="mb-4">
              <div className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 cursor-pointer`}>
                <svg className="size-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 8v4"></path>
                  <path d="M12 16h.01"></path>
                </svg>
                <div>
                  <h3 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Escalations</h3>
                </div>
              </div>
            </div>
            
            {/* Metadata Section */}
            <div className="mb-4">
              <div className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 cursor-pointer`}>
                <svg className="size-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                  <line x1="7" y1="7" x2="7.01" y2="7"></line>
                </svg>
                <div>
                  <h3 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Metadata</h3>
                </div>
              </div>
            </div>
            
            {/* Variables Section */}
            <div className="mb-4">
              <div className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 cursor-pointer`}>
                <svg className="size-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18"></path>
                  <path d="M7 12h10"></path>
                  <path d="M10 18h4"></path>
                </svg>
                <div>
                  <h3 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Variables</h3>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Section */}
          <div className="mt-auto p-4 border-t border-gray-200 dark:border-neutral-700">
            {/* Advanced Section */}
            <div className="mb-4">
              <div className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 cursor-pointer`}>
                <svg className="size-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
                <div>
                  <h3 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Advanced</h3>
                </div>
              </div>
            </div>
            
            {/* Need help? Section */}
            <div className="mb-2">
              <div className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 cursor-pointer`}>
                <svg className="size-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <div>
                  <h3 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Need help?</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-neutral-900">
            {/* Top bar */}
            <div className="bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 p-4 flex items-center justify-between">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold">{bot?.name || 'Agent'}</h1>
                <div className="ml-4 flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${bot?.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-neutral-800 dark:text-gray-200'}`}>
                    {bot?.status || 'Inactive'}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {activeTab === 'instructions' && (
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={saveContent}
                      disabled={isSaving}
                      className={`px-3 py-1.5 text-sm rounded-md ${darkMode ? 'bg-neutral-700 text-gray-300 hover:bg-neutral-600 disabled:opacity-50' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50'}`}
                    >
                      {isSaving ? 'Saving...' : 'Save Draft'}
                    </button>
                    <button 
                      onClick={saveContent}
                      disabled={isSaving}
                      className={`px-3 py-1.5 text-sm rounded-md ${darkMode ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50' : 'bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50'}`}
                    >
                      Publish
                    </button>
                  </div>
                )}
                <button 
                  onClick={toggleDarkMode}
                  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800"
                  aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {darkMode ? (
                    <Sun className="h-5 w-5 text-yellow-400" />
                  ) : (
                    <Moon className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            
            {/* Main content area */}
            <div className="flex-1 overflow-auto">
              {renderTabContent()}
            </div>
                        <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>Can you research the latest advancements in renewable energy?</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 self-end">
                      <div className={`max-w-[80%] p-3 rounded-lg ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white`}>
                        <p className="text-sm">I'll research the latest advancements in renewable energy for you. Let me gather comprehensive information from reliable sources.</p>
                      </div>
                      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center bg-gray-200">
                        <span className="text-sm">🧠</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
          
          {/* Right Sidebar - Tools */}
          <div className={`w-72 flex-shrink-0 border-l ${darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200'} overflow-y-auto sticky top-0 h-[calc(100vh-42px)]`}>
            {/* Tools Section */}
            <div className="p-4 border-b ${darkMode ? 'border-neutral-700' : 'border-gray-200'}">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Tools</span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>
                <button className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${darkMode ? 'border-neutral-700 text-gray-300 hover:bg-neutral-700' : 'border-gray-200 text-gray-700 hover:bg-gray-100'}`}>
                  <Plus className="h-3 w-3" />
                  Add tool
                </button>
              </div>
              
              <div className="space-y-3">
                {/* Analyze CSV */}
                <div className={`p-2 rounded-md ${darkMode ? 'hover:bg-neutral-700' : 'hover:bg-gray-50'} cursor-pointer`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4 text-gray-600" />
                      <div>
                        <div className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>Analyse CSV</div>
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Analyse CSV data, please be specific about your question
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className={`rounded p-0.5 ${darkMode ? 'bg-neutral-700' : 'bg-gray-100'}`}>
                        <Zap className="h-3 w-3 text-gray-500" />
                      </div>
                      <MoreHorizontal className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
                
                {/* GPT on my files */}
                <div className={`p-2 rounded-md ${darkMode ? 'hover:bg-neutral-700' : 'hover:bg-gray-50'} cursor-pointer`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-gray-600" />
                      <div>
                        <div className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>GPT on my files</div>
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Get your questions answered on any PDF, CSV, or audio file
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className={`rounded p-0.5 ${darkMode ? 'bg-neutral-700' : 'bg-gray-100'}`}>
                        <Zap className="h-3 w-3 text-gray-500" />
                      </div>
                        <div className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>Add conversation metadata</div>
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Every time you run a tool or receive a message, you must...
                        </div>
                      </div>
                    </div>
                    <div className={`text-xs ${darkMode ? 'bg-neutral-700 text-gray-300' : 'bg-gray-100 text-gray-600'} rounded px-1.5 py-0.5`}>Built-in</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Knowledge Section */}
            <div className="p-4 border-b ${darkMode ? 'border-neutral-700' : 'border-gray-200'}">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Knowledge</span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>
                <button className={`p-1 rounded ${darkMode ? 'hover:bg-neutral-700' : 'hover:bg-gray-100'}`}>
                  <Plus className="h-3 w-3 text-gray-500" />
                </button>
              </div>
              
              <div className={`p-3 rounded-md ${darkMode ? 'bg-neutral-700' : 'bg-gray-50'}`}>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Add knowledge to give your agents more customized, context-relevant responses.
                </p>
              </div>
            </div>
            
            {/* Variables Section */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Variables</span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>
                <button className={`p-1 rounded ${darkMode ? 'hover:bg-neutral-700' : 'hover:bg-gray-100'}`}>
                  <Plus className="h-3 w-3 text-gray-500" />
                </button>
              </div>
              
              <div className={`p-3 rounded-md ${darkMode ? 'bg-neutral-700' : 'bg-gray-50'}`}>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Want to reuse values throughout your agent? Turn them into re-usable that you can access with...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

  );
}
