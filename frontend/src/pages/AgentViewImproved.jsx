import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getBot } from "../utils/botsData";
import { getFromStorage, STORAGE_KEYS } from "../utils/localStorage";
import {
  ChevronLeft,
  Play,
  Hammer,
  Search,
  FileText,
  Zap,
  ArrowUpRight,
  Settings,
  HelpCircle,
  ChevronDown,
  Plus,
  FileSpreadsheet,
  MessageSquare,
  Globe,
  Info,
  Code,
  MoreHorizontal,
  Upload
} from "lucide-react";
import { Button } from "../components/ui/button";

export default function AgentView() {
  const { botId } = useParams();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(getFromStorage(STORAGE_KEYS.DARK_MODE, false));
  const [bot, setBot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(true);
  const [activeTab, setActiveTab] = useState('add-existing');
  const [activeSection, setActiveSection] = useState('knowledge');
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

  return (
    <div className={`flex flex-col h-screen ${darkMode ? 'bg-neutral-900 text-white' : 'bg-white text-gray-800'}`}>
      {/* Header */}
      <header className={`flex items-center justify-between px-4 py-2 border-b ${darkMode ? 'border-neutral-800' : 'border-gray-200'}`}>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => navigate('/my-bots')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full ${darkMode ? 'bg-purple-800' : 'bg-purple-100'} flex items-center justify-center`}>
              <span className={`text-xs ${darkMode ? 'text-purple-200' : 'text-purple-600'}`}>
                {bot.name ? bot.name.charAt(0).toUpperCase() : 'B'}
              </span>
            </div>
            <span className="font-medium">{bot.name || 'Bot'}</span>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </div>
          <span className={`text-sm ${saved ? 'text-green-500' : 'text-gray-500'}`}>
            {saved ? 'Saved' : 'Unsaved'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Play className="h-4 w-4" />
            Run
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Hammer className="h-4 w-4" />
            Build
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Search className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-500">Versions</span>
          <Button 
            variant="default" 
            size="sm" 
            className={`${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-black hover:bg-gray-800'} text-white`}
            onClick={() => setSaved(true)}
          >
            Publish changes
          </Button>
          <div className="ml-2 flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className={`h-6 w-6 rounded-full ${darkMode ? 'bg-blue-800' : 'bg-blue-100'} flex items-center justify-center`}>
                <span className={`text-xs ${darkMode ? 'text-blue-200' : 'text-blue-600'}`}>
                  {user?.name?.charAt(0) || "U"}
                </span>
              </div>
              <span className="text-sm hidden md:inline">{user?.name}</span>
            </div>
            <Button variant="ghost" size="sm">
              Sign out
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <div className={`w-64 border-r overflow-y-auto ${darkMode ? 'border-neutral-800 bg-neutral-900' : 'border-gray-200 bg-white'}`}>
          <div 
            className={`p-4 border-b ${activeSection === 'prompt' ? (darkMode ? 'bg-neutral-800' : 'bg-gray-100') : ''} ${darkMode ? 'border-neutral-800' : 'border-gray-200'}`}
            onClick={() => setActiveSection('prompt')}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-5 h-5 rounded ${darkMode ? 'bg-purple-800' : 'bg-purple-100'} flex items-center justify-center`}>
                <span className={`text-xs ${darkMode ? 'text-purple-200' : 'text-purple-600'}`}>P</span>
              </div>
              <span className="font-medium">Prompt</span>
            </div>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} pl-7`}>Create guidelines for your agent</p>
          </div>

          <div 
            className={`p-4 border-b ${activeSection === 'tools' ? (darkMode ? 'bg-neutral-800' : 'bg-gray-100') : ''} ${darkMode ? 'border-neutral-800' : 'border-gray-200'}`}
            onClick={() => setActiveSection('tools')}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-5 h-5 rounded ${darkMode ? 'bg-neutral-800' : 'bg-gray-100'} flex items-center justify-center`}>
                <Settings className={`h-3 w-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </div>
              <span className="font-medium">Tools</span>
            </div>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} pl-7`}>Used by agents to complete tasks</p>
          </div>

          <div 
            className={`p-4 border-b ${activeSection === 'knowledge' ? (darkMode ? 'bg-neutral-800' : 'bg-gray-100') : ''} ${darkMode ? 'border-neutral-800' : 'border-gray-200'}`}
            onClick={() => setActiveSection('knowledge')}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-5 h-5 rounded ${darkMode ? 'bg-neutral-800' : 'bg-gray-100'} flex items-center justify-center`}>
                <FileText className={`h-3 w-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </div>
              <span className="font-medium">Knowledge</span>
            </div>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} pl-7`}>Add your documents and data</p>
          </div>

          <div 
            className={`p-4 border-b ${activeSection === 'triggers' ? (darkMode ? 'bg-neutral-800' : 'bg-gray-100') : ''} ${darkMode ? 'border-neutral-800' : 'border-gray-200'}`}
            onClick={() => setActiveSection('triggers')}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-5 h-5 rounded ${darkMode ? 'bg-neutral-800' : 'bg-gray-100'} flex items-center justify-center`}>
                <Zap className={`h-3 w-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </div>
              <span className="font-medium">Triggers</span>
            </div>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} pl-7`}>Run tasks on auto-pilot</p>
          </div>

          <div 
            className={`p-4 border-b ${activeSection === 'escalations' ? (darkMode ? 'bg-neutral-800' : 'bg-gray-100') : ''} ${darkMode ? 'border-neutral-800' : 'border-gray-200'}`}
            onClick={() => setActiveSection('escalations')}
          >
            <div className="flex items-center gap-2">
              <div className={`w-5 h-5 rounded ${darkMode ? 'bg-neutral-800' : 'bg-gray-100'} flex items-center justify-center`}>
                <ArrowUpRight className={`h-3 w-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </div>
              <span className="font-medium">Escalations</span>
            </div>
          </div>

          <div 
            className={`p-4 border-b ${activeSection === 'metadata' ? (darkMode ? 'bg-neutral-800' : 'bg-gray-100') : ''} ${darkMode ? 'border-neutral-800' : 'border-gray-200'}`}
            onClick={() => setActiveSection('metadata')}
          >
            <div className="flex items-center gap-2">
              <div className={`w-5 h-5 rounded ${darkMode ? 'bg-neutral-800' : 'bg-gray-100'} flex items-center justify-center`}>
                <Info className={`h-3 w-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </div>
              <span className="font-medium">Metadata</span>
            </div>
          </div>

          <div 
            className={`p-4 border-b ${activeSection === 'variables' ? (darkMode ? 'bg-neutral-800' : 'bg-gray-100') : ''} ${darkMode ? 'border-neutral-800' : 'border-gray-200'}`}
            onClick={() => setActiveSection('variables')}
          >
            <div className="flex items-center gap-2">
              <div className={`w-5 h-5 rounded ${darkMode ? 'bg-neutral-800' : 'bg-gray-100'} flex items-center justify-center`}>
                <Code className={`h-3 w-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </div>
              <span className="font-medium">Variables</span>
            </div>
          </div>

          <div 
            className={`p-4 border-b ${activeSection === 'advanced' ? (darkMode ? 'bg-neutral-800' : 'bg-gray-100') : ''} ${darkMode ? 'border-neutral-800' : 'border-gray-200'}`}
            onClick={() => setActiveSection('advanced')}
          >
            <div className="flex items-center gap-2">
              <div className={`w-5 h-5 rounded ${darkMode ? 'bg-neutral-800' : 'bg-gray-100'} flex items-center justify-center`}>
                <Settings className={`h-3 w-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </div>
              <span className="font-medium">Advanced</span>
            </div>
          </div>

          <div 
            className={`p-4 ${activeSection === 'help' ? (darkMode ? 'bg-neutral-800' : 'bg-gray-100') : ''}`}
            onClick={() => setActiveSection('help')}
          >
            <div className="flex items-center gap-2">
              <div className={`w-5 h-5 rounded ${darkMode ? 'bg-neutral-800' : 'bg-gray-100'} flex items-center justify-center`}>
                <HelpCircle className={`h-3 w-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </div>
              <span className="font-medium">Need help?</span>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className={`flex-1 overflow-y-auto p-6 ${darkMode ? 'bg-neutral-900' : 'bg-white'}`}>
          {activeSection === 'knowledge' && (
            <div className="max-w-4xl mx-auto">
              {/* Knowledge Section Title */}
              <div className="mb-6">
                <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Knowledge
                </h1>
                <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Enable your agents to provide more customized, relevant responses.
                </p>
              </div>
              
              {/* File Upload Section */}
              <div 
                className={`border-2 border-dashed rounded-xl p-8 mb-6 flex flex-col items-center justify-center
                  ${darkMode ? 'border-gray-700 bg-neutral-800' : 'border-gray-300 bg-white'}`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className={`p-4 rounded-full mb-2 ${darkMode ? 'bg-neutral-700' : 'bg-gray-100'}`}>
                  <Upload className={`h-8 w-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                </div>
                <div className="text-center">
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Drag & Drop or <span className="text-blue-500 cursor-pointer">Choose File</span> to upload
                  </p>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Supported formats: .csv, .xlsx, .pptx, .pdf, .txt
                  </p>
                  <input type="file" className="hidden" onChange={handleFileUpload} />
                </div>
              </div>
              
              {/* Tabs Section */}
              <div className="mb-4">
                <div className={`flex border-b space-x-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <button 
                    onClick={() => setActiveTab('add-existing')} 
                    className={`py-2 px-4 ${activeTab === 'add-existing' ? 
                      'border-b-2 border-blue-500 text-blue-500 font-medium' : 
                      darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                  >
                    Add existing knowledge
                  </button>
                  <button 
                    onClick={() => setActiveTab('add-website')} 
                    className={`py-2 px-4 ${activeTab === 'add-website' ? 
                      'border-b-2 border-blue-500 text-blue-500 font-medium' : 
                      darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                  >
                    Add website
                  </button>
                  <button 
                    onClick={() => setActiveTab('blank-table')} 
                    className={`py-2 px-4 ${activeTab === 'blank-table' ? 
                      'border-b-2 border-blue-500 text-blue-500 font-medium' : 
                      darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                  >
                    Blank table
                  </button>
                  <button 
                    onClick={() => setActiveTab('add-text')} 
                    className={`py-2 px-4 ${activeTab === 'add-text' ? 
                      'border-b-2 border-blue-500 text-blue-500 font-medium' : 
                      darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                  >
                    Add markdown/plain text
                  </button>
                </div>
              </div>
              
              {/* Current Knowledge Section */}
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-neutral-800' : 'bg-white'} ${darkMode ? '' : 'shadow-sm'}`}>
                <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Current knowledge
                </h2>
                
                <table className="w-full">
                  <thead>
                    <tr className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      <th className="text-left py-2 px-4 font-medium">Name</th>
                      <th className="text-left py-2 px-4 font-medium">Status</th>
                      <th className="text-left py-2 px-4 font-medium">Type</th>
                      <th className="py-2 px-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {knowledgeItems.map((item, index) => (
                      <tr key={index} className={`${darkMode ? 'text-white' : 'text-gray-800'} border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <td className="py-3 px-4">{item.name}</td>
                        <td className="py-3 px-4">
                          <span className="flex items-center">
                            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                            Active
                          </span>
                        </td>
                        <td className="py-3 px-4">{item.type}</td>
                        <td className="py-3 px-4 text-right">
                          <button className="text-gray-500 hover:text-gray-700">
                            <MoreHorizontal className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add prompting section for when no knowledge exists */}
              {knowledgeItems.length === 0 && (
                <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-blue-900/20 text-blue-100' : 'bg-blue-50 text-blue-800'}`}>
                  <p className="font-medium">No knowledge items yet</p>
                  <p className="text-sm mt-1">Add knowledge items to improve your agent's responses.</p>
                </div>
              )}
            </div>
          )}

          {activeSection === 'prompt' && (
            <div className="max-w-3xl mx-auto">
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-12 h-12 rounded-full ${darkMode ? 'bg-purple-800' : 'bg-purple-100'} flex items-center justify-center`}>
                  <span className={`text-xl ${darkMode ? 'text-purple-200' : 'text-purple-600'}`}>👩‍🔬</span>
                </div>
                <div className="flex-1">
                  <h1 className={`text-xl font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{bot.name || 'Agent'}</h1>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Give this agent a short description...</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Cost-optimized Model - Pick for me</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Your name is {bot.name || 'Agent'}, a world-class industry researcher and analyst capable of conducting detailed
                  research on any topic and producing fact-based results.
                </p>

                <div>
                  <h2 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Who You Are:</h2>
                  <ol className={`list-decimal pl-6 space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <li>Your name is {bot.name || 'Agent'}, and you are a senior researcher.</li>
                    <li>You are passionate about your subject and committed to thorough research.</li>
                  </ol>
                </div>

                <div>
                  <h2 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>How You Behave:</h2>
                  <ol className={`list-decimal pl-6 space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <li>
                      You should conduct comprehensive research to gather as much information as possible about the
                      objective.
                    </li>
                    <li>
                      If there are URLs of relevant links and articles, you will scrape them to gather more information.
                    </li>
                    <li>
                      After scraping and searching, consider, "Are there new aspects I should research and scrape based on
                      the data I've collected to enhance the quality of my research?" If the answer is yes, continue;
                      however, limit this to no more than 5 iterations.
                    </li>
                    <li>Avoid fabrications; only present facts and data you have collected.</li>
                    <li>In your final output, include all reference data and links to support your research.</li>
                  </ol>
                </div>

                <div className={`bg-green-50 border border-green-200 rounded-md p-3 ${darkMode ? 'text-green-100 bg-green-900/20 border-green-800' : 'text-green-700'}`}>
                  {"{{_knowledge.k}}"}
                </div>
              </div>

              <div className={`mt-8 flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <Play className="h-4 w-4" />
                <span>Run task</span>
                <div className="ml-auto flex items-center gap-1">
                  <HelpCircle className="h-4 w-4" />
                  <span>Use / menu to reference tools</span>
                </div>
              </div>
            </div>
          )}

          {activeSection !== 'knowledge' && activeSection !== 'prompt' && (
            <div className="flex flex-col items-center justify-center h-full">
              <div className={`p-6 max-w-md rounded-xl text-center ${darkMode ? 'bg-neutral-800' : 'bg-gray-50'}`}>
                <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Configuration
                </h2>
                <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  This section is under development. Please check back later.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveSection('knowledge')}
                  className={darkMode ? 'border-gray-600 text-gray-300' : ''}
                >
                  Back to Knowledge
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className={`w-72 border-l overflow-y-auto ${darkMode ? 'border-neutral-800 bg-neutral-900' : 'border-gray-200 bg-white'}`}>
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

          <div className={`p-4 border-b ${darkMode ? 'border-neutral-800' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1">
                <span className="font-medium">Knowledge</span>
                <ChevronDown className="h-4 w-4" />
              </div>
              <Button size="sm" variant="ghost" className="h-7">
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            <div className={`rounded-md p-3 text-sm ${darkMode ? 'bg-neutral-800 text-gray-300' : 'bg-gray-50 text-gray-600'}`}>
              Add knowledge to give your agents more customized, context-relevant responses.
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1">
                <span className="font-medium">Variables</span>
                <ChevronDown className="h-4 w-4" />
              </div>
              <Button size="sm" variant="ghost" className="h-7">
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Want to reuse values throughout your agent? Turn them into variables that you can access with...
            </div>
          </div>
        </div>
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
