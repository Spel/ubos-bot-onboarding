import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { getFromStorage, saveToStorage, STORAGE_KEYS } from "../utils/localStorage";
import { getBots, getBotsByType } from "../utils/botsData";

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(getFromStorage(STORAGE_KEYS.DARK_MODE, false));
  const [searchQuery, setSearchQuery] = useState("");
  const [userEmail, setUserEmail] = useState(getFromStorage(STORAGE_KEYS.USER_EMAIL, "user@example.com"));
  const [userName, setUserName] = useState("User");
  const [recentBots, setRecentBots] = useState([]);
  const [availableAgents, setAvailableAgents] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  
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

  // Extract first name from email for personalized greeting
  useEffect(() => {
    if (userEmail) {
      const emailName = userEmail.split('@')[0];
      // Capitalize first letter and use as name
      const formattedName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
      setUserName(formattedName);
    }
  }, [userEmail]);

  // Load available agents
  useEffect(() => {
    // Get all bots and sort by last used
    const allBots = getBots();
    const sortedBots = [...allBots].sort((a, b) => 
      (b.lastUsed || 0) - (a.lastUsed || 0)
    );
    setRecentBots(sortedBots.slice(0, 3));
    setAvailableAgents([
      {
        id: "research-agent",
        name: "Research Assistant",
        description: "Helps with deep research and information gathering",
        icon: "📚",
        color: "teal"
      },
      {
        id: "idea-agent",
        name: "Idea Generator",
        description: "Helps brainstorm and generate creative ideas",
        icon: "💡",
        color: "blue"
      },
      {
        id: "data-agent",
        name: "Data Scientist",
        description: "Analyzes data and provides insights",
        icon: "📊",
        color: "pink"
      },
      {
        id: "writing-agent",
        name: "Content Writer",
        description: "Creates high-quality written content",
        icon: "✍️",
        color: "purple"
      }
    ]);
    
    // Check if we have an initial message from navigation
    if (location.state?.initialMessage) {
      setSearchQuery(location.state.initialMessage);
      // Clear the state to prevent it from persisting on refresh
      window.history.replaceState({}, document.title);
    }
    
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [location]);


  // Handle search/chat input submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Add user message
      const userMessage = {
        id: Date.now(),
        text: searchQuery,
        sender: "user",
        timestamp: new Date().toISOString(),
      };
      
      setMessages([...messages, userMessage]);
      setSearchQuery("");
      
      // Simulate agent typing
      setIsTyping(true);
      
      // Simulate agent response after a delay
      setTimeout(() => {
        const botResponse = {
          id: Date.now() + 1,
          text: `I'm your AI assistant. I can help you with "${searchQuery}". What specific information are you looking for?`,
          sender: "agent",
          timestamp: new Date().toISOString(),
        };
        
        setMessages(prevMessages => [...prevMessages, botResponse]);
        setIsTyping(false);
        
        // Scroll to bottom
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 1500);
    }
  };
  
  // Handle file upload
  const handleFileUpload = () => {
    fileInputRef.current.click();
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Add file message
      const fileMessage = {
        id: Date.now(),
        text: `Uploaded file: ${file.name}`,
        sender: "user",
        isFile: true,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        timestamp: new Date().toISOString(),
      };
      
      setMessages([...messages, fileMessage]);
      
      // Simulate agent typing
      setIsTyping(true);
      
      // Simulate agent response after a delay
      setTimeout(() => {
        const botResponse = {
          id: Date.now() + 1,
          text: `I've received your file "${file.name}". Would you like me to analyze its contents?`,
          sender: "agent",
          timestamp: new Date().toISOString(),
        };
        
        setMessages(prevMessages => [...prevMessages, botResponse]);
        setIsTyping(false);
        
        // Scroll to bottom
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 1500);
    }
  };

  // Handle quick action buttons
  const handleQuickAction = (action) => {
    let message = "";
    
    switch (action) {
      case 'analyze-data':
        message = "I need to analyze some data";
        break;
      case 'draft-email':
        message = "Help me draft an email";
        break;
      case 'generate-image':
        message = "Generate an image of";
        break;
      default:
        message = "Hello, I need assistance";
    }
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      text: message,
      sender: "user",
      timestamp: new Date().toISOString(),
    };
    
    setMessages([...messages, userMessage]);
    
    // Simulate agent typing
    setIsTyping(true);
    
    // Simulate agent response after a delay
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: `I can help you with "${message}". What specific details would you like to include?`,
        sender: "agent",
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prevMessages => [...prevMessages, botResponse]);
      setIsTyping(false);
      
      // Scroll to bottom
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 1500);
  };
  
  // Handle agent selection
  const handleAgentSelect = (agent) => {
    // Add user message selecting the agent
    const userMessage = {
      id: Date.now(),
      text: `I'd like to work with the ${agent.name}`,
      sender: "user",
      timestamp: new Date().toISOString(),
    };
    
    setMessages([...messages, userMessage]);
    
    // Simulate agent typing
    setIsTyping(true);
    
    // Simulate agent response after a delay
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: `Hi, I'm the ${agent.name}. ${agent.description}. How can I assist you today?`,
        sender: "agent",
        agent: agent,
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prevMessages => [...prevMessages, botResponse]);
      setIsTyping(false);
      
      // Scroll to bottom
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 1500);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-neutral-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      {/* Sidebar */}
      <Sidebar darkMode={darkMode} />
      
      {/* Main Content - Using the same inline style approach as Dashboard */}
      <div style={{ paddingLeft: '16rem', paddingTop: '61px' }}>
        <main className="w-full overflow-y-auto p-4 md:p-6 max-w-6xl mx-auto">
          {/* Greeting Section */}
          <div className="text-center mb-6">
            <h1 className="text-5xl font-bold mb-3">
              Hello, <span className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{userName}</span>
            </h1>
            <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              How can I assist you today?
            </p>
          </div>
          
          {/* Chat Input - Clean Design */}
          <div className="mt-10 max-w-2xl w-full mx-auto px-4 sm:px-6 lg:px-8 mb-8">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search content or ask questions"
                className={`p-3 sm:p-4 block w-full border rounded-full sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none ${darkMode ? 'bg-neutral-900 border-neutral-700 text-neutral-400 placeholder-neutral-500 focus:ring-neutral-600' : 'border-gray-200 text-gray-800 placeholder-gray-500'}`}
              />
              <div className="absolute top-1/2 end-2 -translate-y-1/2 flex">
                {/* Send Message Button */}
                <button 
                  type="submit"
                  disabled={!searchQuery.trim()}
                  className={`size-10 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent ${!searchQuery.trim() ? 
                    (darkMode ? 'text-neutral-600 pointer-events-none' : 'text-gray-300 pointer-events-none') : 
                    (darkMode ? 'text-blue-400 hover:text-blue-300 focus:text-blue-300' : 'text-blue-500 hover:text-blue-600 focus:text-blue-600')}`}
                >
                  <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
                
                {/* Upload Button */}
                <button 
                  type="button"
                  onClick={handleFileUpload}
                  className={`size-10 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent ${darkMode ? 'text-neutral-400 hover:text-white focus:text-white' : 'text-gray-500 hover:text-gray-800 focus:text-gray-800'}`}
                >
                  <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
                    <path d="M12 12v9"/>
                    <path d="m16 16-4-4-4 4"/>
                  </svg>
                </button>
                
                {/* Microphone Button */}
                <button 
                  type="button"
                  className={`size-10 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent ${darkMode ? 'text-neutral-400 bg-neutral-800 hover:text-white focus:text-white' : 'text-gray-500 bg-gray-100 hover:text-gray-800 focus:text-gray-800'}`}
                >
                  <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                    <line x1="12" x2="12" y1="19" y2="22"/>
                  </svg>
                </button>
              </div>
              
              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </form>
          </div>
          
          {/* Available Agents */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Available Agents
              </h2>
              <Link 
                to="/templates"
                className={`text-sm font-medium flex items-center gap-1 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
              >
                See More Agents
                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {availableAgents.map(agent => (
                <div 
                  key={agent.id}
                  onClick={() => handleAgentSelect(agent)}
                  className={`cursor-pointer p-4 rounded-xl border transition-all transform hover:-translate-y-1 hover:shadow-md ${darkMode ? 
                    `bg-${agent.color}-900/20 border-${agent.color}-900/30 hover:bg-${agent.color}-900/30` : 
                    `bg-${agent.color}-50 border-${agent.color}-100 hover:bg-${agent.color}-100`
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`text-2xl p-2 rounded-lg ${darkMode ? `bg-${agent.color}-900/30` : `bg-${agent.color}-100`}`}>
                      {agent.icon}
                    </div>
                    <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{agent.name}</h3>
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {agent.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Quick Prompts */}
          <div className="mb-12">
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Ready-to-Use Prompts
            </h2>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => handleQuickAction('analyze-data')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full ${darkMode ? 'bg-teal-900/30 text-teal-300 hover:bg-teal-900/50' : 'bg-teal-100 text-teal-700 hover:bg-teal-200'} transition-colors`}
              >
                <div className={`flex items-center justify-center w-6 h-6 rounded-full ${darkMode ? 'bg-teal-800' : 'bg-teal-200'}`}>
                  <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path>
                    <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4"></path>
                    <path d="M12 12v5"></path>
                    <path d="M8 12v5"></path>
                    <path d="M16 12v5"></path>
                  </svg>
                </div>
                Analyze data
              </button>
              
              <button 
                onClick={() => handleQuickAction('draft-email')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full ${darkMode ? 'bg-blue-900/30 text-blue-300 hover:bg-blue-900/50' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'} transition-colors`}
              >
                <div className={`flex items-center justify-center w-6 h-6 rounded-full ${darkMode ? 'bg-blue-800' : 'bg-blue-200'}`}>
                  <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                Draft email
              </button>
              
              <button 
                onClick={() => handleQuickAction('generate-image')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full ${darkMode ? 'bg-pink-900/30 text-pink-300 hover:bg-pink-900/50' : 'bg-pink-100 text-pink-700 hover:bg-pink-200'} transition-colors`}
              >
                <div className={`flex items-center justify-center w-6 h-6 rounded-full ${darkMode ? 'bg-pink-800' : 'bg-pink-200'}`}>
                  <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                </div>
                Generate image
              </button>
              
              <Link 
                to="/templates"
                className={`flex items-center gap-2 px-4 py-2 rounded-full ${darkMode ? 'bg-purple-900/30 text-purple-300 hover:bg-purple-900/50' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'} transition-colors`}
              >
                <div className={`flex items-center justify-center w-6 h-6 rounded-full ${darkMode ? 'bg-purple-800' : 'bg-purple-200'}`}>
                  <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z"></path>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                    <path d="M9 9h.01"></path>
                    <path d="M15 9h.01"></path>
                  </svg>
                </div>
                More prompts
              </Link>
            </div>
          </div>
          
         
          
          {/* Action Buttons Section */}
          <div className="mb-12">
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* Create New Agent */}
              <Link 
                to="/create-agent"
                className={`flex flex-col items-center justify-center p-6 rounded-xl border transition-all transform hover:-translate-y-1 hover:shadow-md ${darkMode ? 
                  'bg-blue-900/20 border-blue-900/30 hover:bg-blue-900/30' : 
                  'bg-blue-50 border-blue-100 hover:bg-blue-100'
                }`}
              >
                <div className={`text-2xl p-3 rounded-full mb-3 ${darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-600'}`}>
                  <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14"></path>
                    <path d="M5 12h14"></path>
                  </svg>
                </div>
                <h3 className={`font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Create New Agent</h3>
                <p className={`text-xs text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Build a custom AI agent for your specific needs
                </p>
              </Link>
              
              {/* Connect Integration */}
              <Link 
                to="/integrations"
                className={`flex flex-col items-center justify-center p-6 rounded-xl border transition-all transform hover:-translate-y-1 hover:shadow-md ${darkMode ? 
                  'bg-purple-900/20 border-purple-900/30 hover:bg-purple-900/30' : 
                  'bg-purple-50 border-purple-100 hover:bg-purple-100'
                }`}
              >
                <div className={`text-2xl p-3 rounded-full mb-3 ${darkMode ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-100 text-purple-600'}`}>
                  <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                  </svg>
                </div>
                <h3 className={`font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Connect Integration</h3>
                <p className={`text-xs text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  WhatsApp, Telegram, website, email, and more
                </p>
              </Link>
              
              {/* Connect Data */}
              <Link 
                to="/data-sources"
                className={`flex flex-col items-center justify-center p-6 rounded-xl border transition-all transform hover:-translate-y-1 hover:shadow-md ${darkMode ? 
                  'bg-green-900/20 border-green-900/30 hover:bg-green-900/30' : 
                  'bg-green-50 border-green-100 hover:bg-green-100'
                }`}
              >
                <div className={`text-2xl p-3 rounded-full mb-3 ${darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-600'}`}>
                  <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    <line x1="9" y1="10" x2="15" y2="10"></line>
                    <line x1="12" y1="7" x2="12" y2="13"></line>
                  </svg>
                </div>
                <h3 className={`font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Connect Data</h3>
                <p className={`text-xs text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Connect to CRM, ERP, and other data sources
                </p>
              </Link>
              
              {/* Upload Knowledge */}
              <Link 
                to="/knowledge-base"
                className={`flex flex-col items-center justify-center p-6 rounded-xl border transition-all transform hover:-translate-y-1 hover:shadow-md ${darkMode ? 
                  'bg-amber-900/20 border-amber-900/30 hover:bg-amber-900/30' : 
                  'bg-amber-50 border-amber-100 hover:bg-amber-100'
                }`}
              >
                <div className={`text-2xl p-3 rounded-full mb-3 ${darkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-600'}`}>
                  <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="12" y1="18" x2="12" y2="12"></line>
                    <line x1="9" y1="15" x2="15" y2="15"></line>
                  </svg>
                </div>
                <h3 className={`font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Upload Knowledge</h3>
                <p className={`text-xs text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Add files to your agent's knowledge base
                </p>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
