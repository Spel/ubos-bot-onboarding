import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
import { 
  Moon, 
  Sun, 
  ChevronLeft, 
  ChevronDown, 
  ChevronRight,
  Plus,
  MessageSquare,
  FileText,
  Zap,
  Bell,
  Cpu,
  Settings,
  Search,
  MoreVertical,
  Edit2,
  Play,
  Pause,
  Trash2,
  Copy,
  ExternalLink,
  User,
  Users,
  CreditCard,
  BarChart2,
  PieChart,
  LineChart,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Tag,
  Mail,
  Phone,
  MapPin,
  Link2,
  Image,
  File,
  Folder,
  FolderPlus,
  FilePlus,
  FileText as FileTextIcon,
  FileCode,
  FileArchive,
  FileImage,
  FileVideo,
  FileAudio,
  FileSpreadsheet,
  FileJson,
  FileX,
  FileCheck,
  FileDigit,
  FileDown,
  FileInput,
  FileOutput,
  FileSearch,
  FileType,
  FileUp,
  FileWarning,
  FileMinus,
  FilePlus2,
  FileQuestion,
  FileSymlink,
  FileTerminal,
  FileUnknown,
  FileVolume2,
  FolderMinus,
  FolderPlus as FolderPlusIcon,
  FolderSearch,
  FolderX,
  FolderInput,
  FolderOutput,
  FolderTree,
  FolderKanban,
  FolderHeart,
  FolderKey,
  FolderLock,
  FolderOpen,
  FolderPlus2,
  FolderRoot,
  FolderSymlink,
  FolderSync,
  FolderUp,
  FolderCheck,
  FolderClock,
  FolderCog,
  FolderDown,
  FolderEdit,
  FolderGit2,
  FolderGit,
  FolderMinus2,
  FolderPlus2 as FolderPlus2Icon,
  FolderSearch2,
  FolderX2,
  Folder as FolderIcon
} from "lucide-react";

// Tab configuration
const TABS = [
  { id: 'instructions', label: 'Instructions', icon: <FileText size={16} /> },
  { id: 'knowledge', label: 'Knowledge Base', icon: <FolderIcon size={16} /> },
  { id: 'triggers', label: 'Triggers', icon: <Zap size={16} /> },
  { id: 'escalations', label: 'Escalations', icon: <AlertCircle size={16} /> },
  { id: 'metadata', label: 'Metadata', icon: <Settings size={16} /> },
];

// Sample bot data
const sampleBot = {
  id: '1',
  name: 'Researcher Rachel',
  description: 'A research assistant that helps with in-depth analysis',
  status: 'active',
  createdAt: '2023-05-15T10:30:00Z',
  updatedAt: '2023-05-20T14:45:00Z',
  model: 'gpt-4',
  temperature: 0.7,
  maxTokens: 2000,
  isPublic: false,
  tags: ['research', 'analysis', 'academic']
};

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
  
  // State management
  const [darkMode, setDarkMode] = useState(getFromStorage(STORAGE_KEYS.DARK_MODE, false));
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('instructions');
  const [isSaving, setIsSaving] = useState(false);
  const [editorContent, setEditorContent] = useState(defaultEditorContent);
  const [bot, setBot] = useState(sampleBot);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample agents list
  const [agents, setAgents] = useState([
    { id: '1', name: 'Researcher Rachel', description: 'Research assistant', isActive: true },
    { id: '2', name: 'Customer Support Bot', description: 'Handles customer queries', isActive: false },
    { id: '3', name: 'Sales Assistant', description: 'Helps with sales inquiries', isActive: false },
  ]);
  
  // Filter agents based on search query
  const filteredAgents = agents.filter(agent => 
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };
  
  // Toggle agent active state
  const toggleAgentActive = (agentId) => {
    setAgents(agents.map(agent => ({
      ...agent,
      isActive: agent.id === agentId
    })));
  };
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    saveToStorage(STORAGE_KEYS.DARK_MODE, newDarkMode);
  };
  
  // Handle editor content updates
  const handleEditorUpdate = (content) => {
    setEditorContent(content);
  };
  
  // Save content
  const saveContent = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Content saved:", editorContent);
      setIsSaving(false);
    }, 1000);
  };

  // Load bot data
  useEffect(() => {
    const loadBot = async () => {
      try {
        const botData = await getBot(botId);
        setBot(prev => ({
          ...prev,
          ...botData,
          name: botData?.name || 'Researcher Rachel',
          description: botData?.description || 'A research assistant that helps with in-depth analysis'
        }));
        setLoading(false);
      } catch (error) {
        console.error("Error loading bot:", error);
        setLoading(false);
      }
    };

    loadBot();
  }, [botId]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!bot) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Agent not found</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className={`flex h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
      {/* Left Sidebar */}
      <div className="w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold">Agents</h1>
            <button 
              onClick={() => navigate(-1)}
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ChevronLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          
          {/* Search */}
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search agents..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Agents List */}
        <div className="flex-1 overflow-y-auto">
          {filteredAgents.map((agent) => (
            <div 
              key={agent.id}
              className={`p-4 border-b border-gray-200 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
                agent.isActive ? 'bg-blue-50 dark:bg-blue-900/30' : ''
              }`}
              onClick={() => toggleAgentActive(agent.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-md flex items-center justify-center ${
                    agent.isActive 
                      ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}>
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">{agent.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{agent.description}</p>
                  </div>
                </div>
                {agent.isActive && (
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* New Agent Button */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors">
            <Plus className="h-4 w-4" />
            New Agent
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">{bot?.name || 'Untitled Agent'}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {bot?.description || 'No description provided'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={saveContent}
                disabled={isSaving}
                className="px-3 py-1.5 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button 
                onClick={toggleDarkMode}
                className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="mt-4 flex space-x-1 border-b border-gray-200 dark:border-gray-800">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  {tab.icon}
                  {tab.label}
                </div>
              </button>
            ))}
          </div>
        </header>
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
          {activeTab === 'instructions' && (
            <InstructionsTab 
              content={editorContent} 
              onUpdate={handleEditorUpdate} 
              darkMode={darkMode}
            />
          )}
          {activeTab === 'knowledge' && <KnowledgeBaseTab darkMode={darkMode} />}
          {activeTab === 'triggers' && <TriggersTab darkMode={darkMode} />}
          {activeTab === 'escalations' && <EscalationsTab darkMode={darkMode} />}
          {activeTab === 'metadata' && <MetadataTab bot={bot} darkMode={darkMode} />}
        </div>
      </div>
      
      {/* Right Sidebar - Tools & Variables */}
      <div className="w-80 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 overflow-y-auto">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">TOOLS & VARIABLES</h3>
        
        <div className="space-y-6">
          {/* Web Search Tool */}
          <div>
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">BROWSING</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">Web Search</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
          
          {/* Code Interpreter */}
          <div>
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">CODE INTERPRETER</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                <div className="flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">Code Interpreter</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
          
          {/* Variables */}
          <div>
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">VARIABLES</h4>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">API Key</span>
                  <button className="text-xs text-blue-500 hover:text-blue-600">Edit</button>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">••••••••••••••••••••••••••••••••</div>
              </div>
              
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Base URL</span>
                  <button className="text-xs text-blue-500 hover:text-blue-600">Edit</button>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">https://api.example.com/v1</div>
              </div>
            </div>
          </div>
          
          {/* Model Settings */}
          <div>
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">MODEL</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Model</label>
                <select 
                  className="w-full p-2 text-sm border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={bot?.model || 'gpt-4'}
                  onChange={(e) => setBot(prev => ({ ...prev, model: e.target.value }))}
                >
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="claude-2">Claude 2</option>
                </select>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Temperature: {bot?.temperature || 0.7}</label>
                  <span className="text-xs text-gray-500">{bot?.temperature || 0.7}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.1" 
                  value={bot?.temperature || 0.7}
                  onChange={(e) => setBot(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Precise</span>
                  <span>Creative</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
