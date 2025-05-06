import React, { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { getFromStorage, saveToStorage, STORAGE_KEYS } from "../utils/localStorage";
import { getBots } from "../utils/botsData";

export default function GlobalChat() {
  const [darkMode, setDarkMode] = useState(getFromStorage(STORAGE_KEYS.DARK_MODE, false));
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [availableAgents, setAvailableAgents] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
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

  // Load available agents
  useEffect(() => {
    const bots = getBots();
    setAvailableAgents(bots);
    
    // Select the first agent by default if available
    if (bots.length > 0 && !selectedAgent) {
      setSelectedAgent(bots[0]);
    }
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (inputMessage.trim() === "" || !selectedAgent) return;
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date().toISOString(),
    };
    
    setMessages([...messages, userMessage]);
    setInputMessage("");
    
    // Simulate agent typing
    setIsTyping(true);
    
    // Simulate agent response after a delay
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: `This is a simulated response from ${selectedAgent.name}. In a real implementation, this would be connected to your agent's API.`,
        sender: "agent",
        agent: selectedAgent,
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prevMessages => [...prevMessages, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  // Handle agent selection
  const handleAgentChange = (e) => {
    const agentId = e.target.value;
    const agent = availableAgents.find(agent => agent.id === agentId);
    setSelectedAgent(agent);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-neutral-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      {/* Sidebar */}
      <Sidebar darkMode={darkMode} />
      
      {/* Main Content */}
      <div className="lg:pl-64 pt-16">
        <main className="p-4 md:p-6 max-w-6xl mx-auto">
          <div className="flex flex-col h-[calc(100vh-8rem)]">
            {/* Chat Header */}
            <div className={`p-4 border-b ${darkMode ? 'border-neutral-700' : 'border-gray-200'} flex justify-between items-center`}>
              <h1 className="text-xl font-semibold">Chat with Your Agents</h1>
              
              {/* Agent Selector */}
              <div className="flex items-center">
                <label htmlFor="agent-select" className={`mr-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Select Agent:
                </label>
                <select
                  id="agent-select"
                  value={selectedAgent?.id || ""}
                  onChange={handleAgentChange}
                  className={`rounded-md border ${
                    darkMode 
                      ? 'bg-neutral-800 border-neutral-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } py-1.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  {availableAgents.length === 0 ? (
                    <option value="" disabled>No agents available</option>
                  ) : (
                    availableAgents.map(agent => (
                      <option key={agent.id} value={agent.id}>
                        {agent.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>
            
            {/* Messages Container */}
            <div className={`flex-1 overflow-y-auto p-4 ${darkMode ? 'bg-neutral-800' : 'bg-gray-50'}`}>
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center">
                  <div className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <svg className="w-16 h-16 mx-auto mb-4 opacity-50" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <p className="text-lg font-medium">No messages yet</p>
                    <p className="mt-1">Select an agent and start chatting!</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map(message => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.sender === 'user' 
                            ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white') 
                            : (darkMode ? 'bg-neutral-700 text-white' : 'bg-white text-gray-900 border border-gray-200')
                        }`}
                      >
                        {message.sender === 'agent' && (
                          <div className="text-xs font-medium mb-1">
                            {message.agent?.name || 'Agent'}
                          </div>
                        )}
                        <p>{message.text}</p>
                        <div className={`text-xs mt-1 text-right ${
                          message.sender === 'user' 
                            ? 'text-blue-200' 
                            : (darkMode ? 'text-gray-400' : 'text-gray-500')
                        }`}>
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Typing indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className={`rounded-lg px-4 py-2 ${
                        darkMode ? 'bg-neutral-700' : 'bg-white border border-gray-200'
                      }`}>
                        <div className="flex space-x-1">
                          <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-gray-400' : 'bg-gray-600'} animate-bounce`} style={{ animationDelay: '0ms' }}></div>
                          <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-gray-400' : 'bg-gray-600'} animate-bounce`} style={{ animationDelay: '150ms' }}></div>
                          <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-gray-400' : 'bg-gray-600'} animate-bounce`} style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
            
            {/* Message Input */}
            <form onSubmit={handleSendMessage} className={`p-4 border-t ${darkMode ? 'border-neutral-700' : 'border-gray-200'}`}>
              <div className="flex items-center">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  className={`flex-1 rounded-l-lg border-y border-l py-2 px-4 focus:outline-none ${
                    darkMode 
                      ? 'bg-neutral-700 border-neutral-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  disabled={!selectedAgent}
                />
                <button
                  type="submit"
                  disabled={!selectedAgent || inputMessage.trim() === ""}
                  className={`rounded-r-lg border-y border-r py-2 px-4 ${
                    !selectedAgent || inputMessage.trim() === ""
                      ? (darkMode ? 'bg-neutral-600 border-neutral-600 text-gray-400' : 'bg-gray-200 border-gray-300 text-gray-500')
                      : (darkMode ? 'bg-blue-600 hover:bg-blue-700 border-blue-600 text-white' : 'bg-blue-500 hover:bg-blue-600 border-blue-500 text-white')
                  } transition-colors`}
                >
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
              {!selectedAgent && (
                <p className={`mt-2 text-sm ${darkMode ? 'text-red-400' : 'text-red-500'}`}>
                  Please select an agent to start chatting
                </p>
              )}
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
