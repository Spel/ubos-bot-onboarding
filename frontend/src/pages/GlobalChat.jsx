import React, { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { getFromStorage, saveToStorage, STORAGE_KEYS } from "../utils/localStorage";
import { getUserProfile } from "../utils/userStorage";
import { executeBot } from "../utils/botStorage";
import { addRecentActivity } from "../utils/metricStorage";

export default function GlobalChat() {
  const [darkMode, setDarkMode] = useState(getFromStorage(STORAGE_KEYS.DARK_MODE, false));
  
  // Ensure messages is always an array by using Array.isArray check
  const storedMessages = getFromStorage(STORAGE_KEYS.CHAT_HISTORY, []);
  const [messages, setMessages] = useState(Array.isArray(storedMessages) ? storedMessages : []);
  
  const [inputMessage, setInputMessage] = useState("");
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [availableAgents, setAvailableAgents] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [userProfile, setUserProfile] = useState(getUserProfile());
  const [chatSessions, setChatSessions] = useState(getFromStorage('ubos_chat_sessions', {}));
  
  // New state for managing multiple agents in a chat
  const [chatAgents, setChatAgents] = useState([]);
  const [showAgentSidebar, setShowAgentSidebar] = useState(true);
  const [showAddAgentModal, setShowAddAgentModal] = useState(false);
  
  // New state for multiple chats
  const [allChatSessions, setAllChatSessions] = useState(getFromStorage('ubos_all_chat_sessions', {}));
  const [activeChatId, setActiveChatId] = useState(getFromStorage('ubos_active_chat_id', null));
  const [chatsList, setChatsList] = useState([]);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

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

  // Load available agents and chat history
  useEffect(() => {
    // Get bots from the storage system
    const bots = getFromStorage(STORAGE_KEYS.BOTS, []);
    setAvailableAgents(bots);
    
    // Initialize chat sessions object if it doesn't exist
    if (!getFromStorage('ubos_chat_sessions')) {
      saveToStorage('ubos_chat_sessions', {});
    }
    
    // Initialize all chat sessions if it doesn't exist
    const chats = getFromStorage('ubos_all_chat_sessions', {});
    if (Object.keys(chats).length === 0) {
      // Create a default chat session
      const defaultChatId = `chat_${Date.now()}`;
      chats[defaultChatId] = {
        id: defaultChatId,
        title: "New Chat",
        agentId: bots.length > 0 ? bots[0].id : null,
        agentIds: bots.length > 0 ? [bots[0].id] : [], // Initialize with array of agent IDs
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: []
      };
      saveToStorage('ubos_all_chat_sessions', chats);
      saveToStorage('ubos_active_chat_id', defaultChatId);
      setActiveChatId(defaultChatId);
    }
    
    setAllChatSessions(chats);
    updateChatsList(chats);
    
    // Load active chat if exists
    const activeId = getFromStorage('ubos_active_chat_id', null);
    if (activeId && chats[activeId]) {
      setActiveChatId(activeId);
      
      // Set selected agent for this chat
      if (chats[activeId].agentId) {
        const chatAgent = bots.find(bot => bot.id === chats[activeId].agentId);
        if (chatAgent) {
          setSelectedAgent(chatAgent);
        } else if (bots.length > 0) {
          setSelectedAgent(bots[0]);
        }
      } else if (bots.length > 0) {
        setSelectedAgent(bots[0]);
      }
      
      // Initialize chat agents for multi-agent experience
      if (chats[activeId].agentIds && Array.isArray(chats[activeId].agentIds)) {
        const agents = chats[activeId].agentIds
          .map(id => bots.find(bot => bot.id === id))
          .filter(agent => agent !== undefined);
        setChatAgents(agents);
      } else if (chats[activeId].agentId) {
        // For backward compatibility with single agent chats
        const chatAgent = bots.find(bot => bot.id === chats[activeId].agentId);
        if (chatAgent) {
          setChatAgents([chatAgent]);
        }
      }
      
      // Load messages for this chat
      setMessages(Array.isArray(chats[activeId].messages) ? chats[activeId].messages : []);
    } else if (bots.length > 0) {
      // Default to first agent if no active chat
      setSelectedAgent(bots[0]);
      setChatAgents([bots[0]]);
    }
  }, []);
  
  // Update the chats list when allChatSessions changes
  useEffect(() => {
    updateChatsList(allChatSessions);
  }, [allChatSessions]);
  
  // Function to create a sorted list of chats
  const updateChatsList = (chats) => {
    const chatArray = Object.values(chats);
    // Sort by most recent update
    chatArray.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    setChatsList(chatArray);
  };
  
  // Create a new chat
  const createNewChat = () => {
    const newChatId = `chat_${Date.now()}`;
    const newChat = {
      id: newChatId,
      title: "New Chat",
      agentId: selectedAgent ? selectedAgent.id : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: []
    };
    
    // Update all chats
    const updatedChats = { ...allChatSessions, [newChatId]: newChat };
    setAllChatSessions(updatedChats);
    saveToStorage('ubos_all_chat_sessions', updatedChats);
    
    // Set as active chat
    setActiveChatId(newChatId);
    saveToStorage('ubos_active_chat_id', newChatId);
    
    // Clear messages
    setMessages([]);
  };
  
  // Switch to a different chat
  const switchToChat = (chatId) => {
    if (allChatSessions[chatId]) {
      setActiveChatId(chatId);
      saveToStorage('ubos_active_chat_id', chatId);
      
      // Load this chat's messages
      setMessages(Array.isArray(allChatSessions[chatId].messages) ? allChatSessions[chatId].messages : []);
      
      // Set this chat's agent
      if (allChatSessions[chatId].agentId) {
        const chatAgent = availableAgents.find(bot => bot.id === allChatSessions[chatId].agentId);
        if (chatAgent) {
          setSelectedAgent(chatAgent);
        }
      }
    }
  };
  
  // Update chat title based on messages
  const updateChatTitle = (chatId, messages) => {
    if (allChatSessions[chatId] && messages.length > 0) {
      const updatedChats = { ...allChatSessions };
      const firstUserMessage = messages.find(msg => msg.sender === 'user');
      
      if (firstUserMessage) {
        // Use first user message as title, truncated
        const title = firstUserMessage.text.length > 30 
          ? firstUserMessage.text.substring(0, 30) + '...' 
          : firstUserMessage.text;
        
        updatedChats[chatId] = {
          ...updatedChats[chatId],
          title: title,
          updatedAt: new Date().toISOString(),
          messages: messages
        };
        
        setAllChatSessions(updatedChats);
        saveToStorage('ubos_all_chat_sessions', updatedChats);
      } else {
        // Just update the messages
        updatedChats[chatId] = {
          ...updatedChats[chatId],
          updatedAt: new Date().toISOString(),
          messages: messages
        };
        
        setAllChatSessions(updatedChats);
        saveToStorage('ubos_all_chat_sessions', updatedChats);
      }
    }
  };
  
  // Delete a chat
  const deleteChat = (chatId, e) => {
    // Prevent the click from bubbling up to the parent (which would select the chat)
    e.stopPropagation();
    
    if (allChatSessions[chatId]) {
      const updatedChats = { ...allChatSessions };
      delete updatedChats[chatId];
      
      // Update state and localStorage
      setAllChatSessions(updatedChats);
      saveToStorage('ubos_all_chat_sessions', updatedChats);
      
      // If we deleted the active chat, switch to another one
      if (chatId === activeChatId) {
        const remainingChatIds = Object.keys(updatedChats);
        if (remainingChatIds.length > 0) {
          switchToChat(remainingChatIds[0]);
        } else {
          // No chats left, create a new one
          createNewChat();
        }
      }
    }
  };

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // When selected agent changes while in a chat, update the chat's agent
  useEffect(() => {
    if (selectedAgent && activeChatId && allChatSessions[activeChatId]) {
      const updatedChats = { ...allChatSessions };
      updatedChats[activeChatId] = {
        ...updatedChats[activeChatId],
        agentId: selectedAgent.id,
        updatedAt: new Date().toISOString()
      };
      
      // Make sure the selected agent is in the chatAgents list
      if (!chatAgents.some(agent => agent.id === selectedAgent.id)) {
        setChatAgents([...chatAgents, selectedAgent]);
        
        // Also update agentIds in the chat session
        const agentIds = [...chatAgents.map(a => a.id), selectedAgent.id];
        updatedChats[activeChatId].agentIds = agentIds;
      }
      
      setAllChatSessions(updatedChats);
      saveToStorage('ubos_all_chat_sessions', updatedChats);
    }
  }, [selectedAgent]);
  
  // Handle file upload
  const handleFileUpload = () => {
    fileInputRef.current.click();
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && selectedAgent && activeChatId) {
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
      
      const updatedMessages = [...messages, fileMessage];
      setMessages(updatedMessages);
      
      // Update chat history
      updateChatTitle(activeChatId, updatedMessages);
      
      // Simulate agent typing
      setIsTyping(true);
      
      try {
        // Use the executeBot function from botStorage with file data
        const executionResult = executeBot(selectedAgent.id, { 
          input: `Processing file: ${file.name}`,
          fileInfo: {
            name: file.name,
            size: file.size,
            type: file.type
          }
        });
        
        // Add activity about this chat interaction
        addRecentActivity({
          type: 'file_upload',
          botId: selectedAgent.id,
          botName: selectedAgent.name,
          fileName: file.name,
          timestamp: new Date().toISOString()
        });
        
        // Simulate a delay for typing response
        setTimeout(() => {
          const botResponse = {
            id: Date.now() + 1,
            text: executionResult.result || `I've received your file "${file.name}". How would you like me to help with this?`,
            sender: "agent",
            agent: selectedAgent,
            timestamp: new Date().toISOString(),
          };
          
          const newMessages = [...updatedMessages, botResponse];
          setMessages(newMessages);
          updateChatTitle(activeChatId, newMessages);
          setIsTyping(false);
        }, 1500);
      } catch (error) {
        console.error("Error processing file:", error);
        
        // Show error message
        setTimeout(() => {
          const errorResponse = {
            id: Date.now() + 1,
            text: `Sorry, there was an error processing your file: ${error.message}`,
            sender: "agent",
            agent: selectedAgent,
            timestamp: new Date().toISOString(),
            isError: true
          };
          
          const newMessages = [...updatedMessages, errorResponse];
          setMessages(newMessages);
          updateChatTitle(activeChatId, newMessages);
          setIsTyping(false);
        }, 1000);
      }
    }
  };

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (inputMessage.trim() === "" || !selectedAgent || !activeChatId) return;
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date().toISOString(),
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    updateChatTitle(activeChatId, updatedMessages);
    setInputMessage("");
    
    // Simulate agent typing
    setIsTyping(true);
    
    try {
      // Use the executeBot function from botStorage
      const executionResult = executeBot(selectedAgent.id, { input: inputMessage });
      
      // Add activity about this chat interaction
      addRecentActivity({
        type: 'chat_message',
        botId: selectedAgent.id,
        botName: selectedAgent.name,
        timestamp: new Date().toISOString()
      });
      
      // Simulate a delay for typing response
      setTimeout(() => {
        const botResponse = {
          id: Date.now() + 1,
          text: executionResult.result || `This is a simulated response from ${selectedAgent.name}.`,
          sender: "agent",
          agent: selectedAgent,
          timestamp: new Date().toISOString(),
        };
        
        const newMessages = [...updatedMessages, botResponse];
        setMessages(newMessages);
        updateChatTitle(activeChatId, newMessages);
        setIsTyping(false);
      }, 1500);
    } catch (error) {
      console.error("Error executing bot:", error);
      
      // Show error message
      setTimeout(() => {
        const errorResponse = {
          id: Date.now() + 1,
          text: `Sorry, there was an error processing your request: ${error.message}`,
          sender: "agent",
          agent: selectedAgent,
          timestamp: new Date().toISOString(),
          isError: true
        };
        
        const newMessages = [...updatedMessages, errorResponse];
        setMessages(newMessages);
        updateChatTitle(activeChatId, newMessages);
        setIsTyping(false);
      }, 1000);
    }
  };

  // Handle agent selection
  const handleAgentChange = (e) => {
    const agentId = e.target.value;
    const agent = availableAgents.find(agent => agent.id === agentId);
    setSelectedAgent(agent);
  };
  
  // Add an agent to the current chat
  const addAgentToChat = (agent) => {
    if (!agent || !activeChatId) return;
    
    // Check if agent is already in the chat
    if (chatAgents.some(a => a.id === agent.id)) return;
    
    // Add agent to chat
    const updatedAgents = [...chatAgents, agent];
    setChatAgents(updatedAgents);
    
    // Update chat session
    const updatedChats = { ...allChatSessions };
    updatedChats[activeChatId] = {
      ...updatedChats[activeChatId],
      agentIds: updatedAgents.map(a => a.id),
      updatedAt: new Date().toISOString()
    };
    
    setAllChatSessions(updatedChats);
    saveToStorage('ubos_all_chat_sessions', updatedChats);
    
    // If this is the first agent, also set it as selected
    if (updatedAgents.length === 1) {
      setSelectedAgent(agent);
    }
  };
  
  // Remove an agent from the current chat
  const removeAgentFromChat = (agentId) => {
    if (!agentId || !activeChatId) return;
    
    // Remove agent from chat
    const updatedAgents = chatAgents.filter(a => a.id !== agentId);
    setChatAgents(updatedAgents);
    
    // Update chat session
    const updatedChats = { ...allChatSessions };
    updatedChats[activeChatId] = {
      ...updatedChats[activeChatId],
      agentIds: updatedAgents.map(a => a.id),
      updatedAt: new Date().toISOString()
    };
    
    setAllChatSessions(updatedChats);
    saveToStorage('ubos_all_chat_sessions', updatedChats);
    
    // If we removed the selected agent, select another one if available
    if (selectedAgent && selectedAgent.id === agentId) {
      if (updatedAgents.length > 0) {
        setSelectedAgent(updatedAgents[0]);
      } else {
        setSelectedAgent(null);
      }
    }
  };
  
  // Toggle agent sidebar visibility
  const toggleAgentSidebar = () => {
    setShowAgentSidebar(!showAgentSidebar);
  };

  // Clear chat history for current chat
  const handleClearChat = () => {
    if (!activeChatId) return;
    
    // Clear messages for this chat
    const updatedChats = { ...allChatSessions };
    if (updatedChats[activeChatId]) {
      updatedChats[activeChatId] = {
        ...updatedChats[activeChatId],
        messages: [],
        updatedAt: new Date().toISOString(),
        title: "New Chat"
      };
      
      setAllChatSessions(updatedChats);
      saveToStorage('ubos_all_chat_sessions', updatedChats);
      setMessages([]);
      
      // Add activity
      if (selectedAgent) {
        addRecentActivity({
          type: 'chat_cleared',
          botId: selectedAgent.id,
          botName: selectedAgent.name,
          timestamp: new Date().toISOString()
        });
      }
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-neutral-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      {/* Sidebar */}
      <Sidebar darkMode={darkMode} />
      
      {/* Main Content - Using flex to ensure full height */}
      <div className="flex" style={{ paddingLeft: '16rem', paddingTop: '61px', height: 'calc(100vh )' }}>
        {/* Chat List Sidebar */}
        <div className={`w-64 h-full border-r ${darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200'} overflow-y-auto`}>
          <div className="p-4">
            <button 
              onClick={createNewChat}
              className={`w-full py-2 px-3 flex items-center justify-center gap-2 rounded-md border ${
                darkMode 
                  ? 'bg-blue-600 text-white border-blue-700 hover:bg-blue-700' 
                  : 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600'
              }`}
            >
              <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              New Chat
            </button>
          </div>
          
          <div className="px-3 pb-3 overflow-y-auto">
            <h3 className={`text-xs font-medium uppercase px-2 mb-2 ${darkMode ? 'text-neutral-400' : 'text-gray-500'}`}>Recent Chats</h3>
            <div className="space-y-1">
              {chatsList.map(chat => (
                <div 
                  key={chat.id}
                  onClick={() => switchToChat(chat.id)}
                  className={`group flex items-center justify-between p-2 rounded-md cursor-pointer ${
                    chat.id === activeChatId
                      ? (darkMode ? 'bg-neutral-700' : 'bg-blue-50')
                      : (darkMode ? 'hover:bg-neutral-700' : 'hover:bg-gray-100')
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className={`truncate text-sm ${
                      chat.id === activeChatId
                        ? (darkMode ? 'text-white font-medium' : 'text-blue-600 font-medium')
                        : (darkMode ? 'text-neutral-200' : 'text-gray-700')
                    }`}>
                      {chat.title || "New Chat"}
                    </div>
                    <div className={`text-xs truncate ${darkMode ? 'text-neutral-400' : 'text-gray-500'}`}>
                      {new Date(chat.updatedAt).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  <button 
                    onClick={(e) => deleteChat(chat.id, e)} 
                    className={`opacity-0 group-hover:opacity-100 p-1 rounded-full ${
                      darkMode 
                        ? 'text-neutral-400 hover:bg-neutral-600 hover:text-white' 
                        : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700'
                    }`}
                  >
                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              ))}
              
              {chatsList.length === 0 && (
                <div className={`text-center py-4 ${darkMode ? 'text-neutral-400' : 'text-gray-500'}`}>
                  No chats yet
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Chat Area */}
        <div className="flex-1 h-full flex flex-col relative">
          {/* Chat Header */}
          <div className={`p-4 border-b ${darkMode ? 'border-neutral-700' : 'border-gray-200'} flex justify-between items-center`}>
            <h1 className="text-xl font-semibold">Chat with Your Agents</h1>
            
            <div className="flex items-center gap-4">
              {/* Toggle Agent Sidebar Button */}
              <button 
                onClick={toggleAgentSidebar}
                className={`p-1.5 rounded-md ${darkMode ? 'hover:bg-neutral-700 text-neutral-300' : 'hover:bg-gray-100 text-gray-600'}`}
                title={showAgentSidebar ? "Hide Agents Panel" : "Show Agents Panel"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                  <line x1="9" x2="15" y1="15" y2="15"></line>
                  <line x1="9" x2="15" y1="9" y2="9"></line>
                  <line x1="15" x2="15" y1="9" y2="15"></line>
                </svg>
              </button>
              {/* Clear Chat Button */}
              {messages.length > 0 && (
                <button 
                  onClick={handleClearChat}
                  className={`text-sm ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-600'}`}
                >
                  Clear Chat
                </button>
              )}
              
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
          </div>
          
          {/* Messages Container - with flex-1 to take remaining height */}
          <div className={`flex-1 overflow-y-auto p-4 ${darkMode ? 'bg-neutral-800' : 'bg-gray-50'}`}>
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center">
                <div className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <svg className="w-16 h-16 mx-auto mb-4 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                          : message.isError
                            ? (darkMode ? 'bg-red-700 text-white' : 'bg-red-100 text-red-800 border border-red-300')
                            : (darkMode ? 'bg-neutral-700 text-white' : 'bg-white text-gray-900 border border-gray-200')
                      }`}
                    >
                      {message.sender === 'agent' && (
                        <div className="text-xs font-medium mb-1 flex items-center gap-2">
                          {message.agent?.avatar && <span>{message.agent.avatar}</span>}
                          <span>{message.agent?.name || 'Agent'}</span>
                          {message.isError && (
                            <span className="text-xs font-medium bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                              Error
                            </span>
                          )}
                        </div>
                      )}
                      
                      {/* Display file or normal message */}
                      {message.isFile ? (
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                          </svg>
                          <div>
                            <p className="font-medium">{message.fileName}</p>
                            <p className="text-xs opacity-75">
                              {Math.round(message.fileSize / 1024)} KB
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p>{message.text}</p>
                      )}
                      
                      <div className={`text-xs mt-1 text-right ${
                        message.sender === 'user' 
                          ? 'text-blue-200' 
                          : message.isError
                            ? (darkMode ? 'text-red-300' : 'text-red-500')
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
          
          {/* Message Input - New Design */}
          <div className={`p-4 border-t ${darkMode ? 'border-neutral-700' : 'border-gray-200'}`}>
            <form onSubmit={handleSendMessage} className="relative">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className={`p-3 block w-full border rounded-full text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none ${
                  darkMode 
                    ? 'bg-neutral-700 border-neutral-600 text-white placeholder-neutral-400 focus:ring-neutral-600' 
                    : 'border-gray-200 text-gray-800 placeholder-gray-500'
                }`}
                disabled={!selectedAgent}
              />
              <div className="absolute top-1/2 end-2 -translate-y-1/2 flex">
                {/* Send Message Button */}
                <button 
                  type="submit"
                  disabled={!selectedAgent || inputMessage.trim() === ""}
                  className={`size-10 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent ${
                    !selectedAgent || inputMessage.trim() === "" 
                      ? (darkMode ? 'text-neutral-600 pointer-events-none' : 'text-gray-300 pointer-events-none') 
                      : (darkMode ? 'text-blue-400 hover:text-blue-300 focus:text-blue-300' : 'text-blue-500 hover:text-blue-600 focus:text-blue-600')
                  }`}
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
                  disabled={!selectedAgent}
                  className={`size-10 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent ${
                    !selectedAgent 
                      ? (darkMode ? 'text-neutral-600 pointer-events-none' : 'text-gray-300 pointer-events-none')
                      : (darkMode ? 'text-neutral-400 hover:text-white focus:text-white' : 'text-gray-500 hover:text-gray-800 focus:text-gray-800')
                  }`}
                >
                  <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
                    <path d="M12 12v9"/>
                    <path d="m16 16-4-4-4 4"/>
                  </svg>
                </button>
                
                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </form>
            {!selectedAgent && (
              <p className={`mt-2 text-sm ${darkMode ? 'text-red-400' : 'text-red-500'}`}>
                Please select an agent to start chatting
              </p>
            )}
          </div>
          
          {/* Right Sidebar for Managing Agents */}
          {showAgentSidebar && (
            <div 
              className={`absolute right-0 top-0 bottom-0 w-72 border-l ${darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200'} z-50`}
              style={{ height: 'calc(100% - 61px)', marginTop: '61px' }}
            >
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Chat Agents</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? 'bg-neutral-700 text-neutral-300' : 'bg-gray-100 text-gray-700'}`}>
                  {chatAgents.length}
                </span>
              </div>
              
              {/* Agents List */}
              <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(100% - 120px)' }}>
                {chatAgents.length === 0 ? (
                  <div className={`text-center py-6 ${darkMode ? 'text-neutral-400' : 'text-gray-500'}`}>
                    <p>No agents in this chat yet</p>
                    <p className="text-xs mt-1">Add an agent to start chatting</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {chatAgents.map(agent => (
                      <div 
                        key={agent.id} 
                        className={`p-3 rounded-lg border ${agent.id === selectedAgent?.id ? 
                          (darkMode ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200') : 
                          (darkMode ? 'bg-neutral-700 border-neutral-600' : 'bg-white border-gray-200')}`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-neutral-600' : 'bg-gray-100'}`}>
                              {agent.avatar || (
                                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="12" cy="12" r="10"></circle>
                                  <circle cx="12" cy="10" r="3"></circle>
                                  <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"></path>
                                </svg>
                              )}
                            </div>
                            <div>
                              <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{agent.name}</div>
                              <div className={`text-xs ${darkMode ? 'text-neutral-400' : 'text-gray-500'}`}>{agent.type || 'Assistant'}</div>
                            </div>
                          </div>
                          
                          <div className="flex gap-1">
                            {/* Select Agent Button */}
                            <button 
                              onClick={() => setSelectedAgent(agent)}
                              className={`p-1 rounded ${agent.id === selectedAgent?.id ? 'opacity-50 cursor-not-allowed' : 
                                (darkMode ? 'text-neutral-300 hover:bg-neutral-600' : 'text-gray-600 hover:bg-gray-100')}`}
                              disabled={agent.id === selectedAgent?.id}
                              title="Select as active agent"
                            >
                              <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 11 12 14 22 4"></polyline>
                                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                              </svg>
                            </button>
                            
                            {/* Remove Agent Button */}
                            <button 
                              onClick={() => removeAgentFromChat(agent.id)}
                              className={`p-1 rounded ${darkMode ? 'text-red-400 hover:bg-neutral-600' : 'text-red-500 hover:bg-gray-100'}`}
                              title="Remove from chat"
                            >
                              <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Add Agent Button */}
              <div className="p-4 border-t border-gray-200">
                <button 
                  onClick={() => setShowAddAgentModal(true)}
                  className={`w-full py-2 px-3 flex items-center justify-center gap-2 rounded-md border ${
                    darkMode 
                      ? 'bg-blue-600 text-white border-blue-700 hover:bg-blue-700' 
                      : 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600'
                  }`}
                >
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Add Agent
                </button>
              </div>
            </div>
          )}
          
          {/* Add Agent Modal */}
          {showAddAgentModal && (
            <div className="hs-overlay fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center overflow-hidden pointer-events-auto">
              <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-100 ease-out transition-all sm:max-w-4xl sm:w-full mx-4">
                <div className={`max-h-[90vh] overflow-hidden flex flex-col ${darkMode ? 'bg-neutral-900 border-neutral-800 shadow-neutral-700/70' : 'bg-white border-gray-200'} border shadow-2xl rounded-xl pointer-events-auto`}>
                  {/* Modal Header */}
                  <div className={`flex justify-between items-center py-3 px-4 border-b ${darkMode ? 'border-neutral-800' : 'border-gray-200'}`}>
                    <h3 className={`font-bold ${darkMode ? 'text-neutral-200' : 'text-gray-800'}`}>
                      Add Agents to Chat
                    </h3>
                    <button 
                      onClick={() => setShowAddAgentModal(false)}
                      className={`size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent ${darkMode ? 'bg-neutral-700 hover:bg-neutral-600 text-neutral-400 focus:bg-neutral-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:bg-gray-200'}`}
                      aria-label="Close"
                    >
                      <span className="sr-only">Close</span>
                      <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                  </div>
                  
                  {/* Modal Body */}
                  <div className="p-4 overflow-y-auto flex-1">
                    {availableAgents.length === 0 ? (
                      <div className={`text-center py-12 ${darkMode ? 'text-neutral-400' : 'text-gray-500'}`}>
                        <svg className="w-16 h-16 mx-auto mb-4 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="8" x2="12" y2="12"></line>
                          <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        <p className="text-xl font-medium">No agents available</p>
                        <p className="mt-2">Create agents first to add them to your chat</p>
                      </div>
                    ) : (
                      <div>
                        <div className="mb-6">
                          <p className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-gray-600'}`}>
                            Select one or more agents to add to your multi-agent chat experience.
                          </p>
                        </div>
                        
                        {/* All Agents Grid */}
                        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                          {availableAgents
                            .filter(agent => !chatAgents.some(a => a.id === agent.id))
                            .map(agent => (
                              <div 
                                key={agent.id} 
                                className={`group border ${darkMode ? 'bg-neutral-800/80 hover:bg-neutral-800 border-neutral-700 hover:border-blue-700' : 'bg-white hover:bg-blue-50/30 border-gray-200 hover:border-blue-300'} p-4 transition-all duration-200 rounded-xl shadow-sm hover:shadow`}
                              >
                                <div className="flex items-start gap-x-4">
                                  <div className={`flex-shrink-0 ${darkMode ? 'bg-neutral-700 group-hover:bg-blue-900/40' : 'bg-blue-50 group-hover:bg-blue-100'} size-12 rounded-lg flex items-center justify-center transition-colors`}>
                                    {agent.avatar || (
                                      <svg className={`size-6 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        {agent.type && agent.type !== 'Assistant' ? (
                                          <>
                                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                                            <polyline points="14 2 14 8 20 8"/>
                                          </>
                                        ) : (
                                          <>
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <circle cx="12" cy="10" r="3"></circle>
                                            <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"></path>
                                          </>
                                        )}
                                      </svg>
                                    )}
                                  </div>
                                  
                                  <div className="grow">
                                    <div className="flex items-center gap-1.5">
                                      <h3 className={`text-sm font-semibold ${darkMode ? 'text-blue-400 group-hover:text-blue-300' : 'text-blue-600 group-hover:text-blue-700'} transition-colors`}>
                                        {agent.name}
                                      </h3>
                                      {agent.isNew && (
                                        <span className={`inline ${darkMode ? 'bg-blue-900/70 border-blue-700 text-blue-400' : 'bg-blue-50 border-blue-300 text-blue-600'} text-[10px] leading-4 uppercase rounded-full py-0.5 px-2 border`}>New</span>
                                      )}
                                    </div>
                                    <p className={`mt-1 text-sm ${darkMode ? 'text-neutral-400' : 'text-gray-600'} line-clamp-2`}>
                                      {agent.description || `${agent.type && agent.type !== 'Assistant' ? `Specialized in ${agent.type}` : 'AI assistant that can help with various tasks.'}`}
                                    </p>
                                    <div className="mt-2 flex items-center justify-between">
                                      <span className={`text-xs ${darkMode ? 'bg-neutral-700 text-neutral-300' : 'bg-gray-100 text-gray-700'} px-2 py-0.5 rounded-full`}>
                                        {agent.type || 'Assistant'}
                                      </span>
                                      <button 
                                        onClick={() => addAgentToChat(agent)}
                                        className={`ml-2 text-xs py-1 px-3 rounded ${darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'} transition-colors`}
                                      >
                                        Add to Chat
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          }
                        </div>
                        
                        {availableAgents.filter(agent => !chatAgents.some(a => a.id === agent.id)).length === 0 && (
                          <div className={`text-center py-12 ${darkMode ? 'text-neutral-400' : 'text-gray-500'}`}>
                            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"></circle>
                              <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                              <line x1="9" y1="9" x2="9.01" y2="9"></line>
                              <line x1="15" y1="9" x2="15.01" y2="9"></line>
                            </svg>
                            <p className="text-xl font-medium">All agents added</p>
                            <p className="mt-2">You've already added all available agents to this chat</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Modal Footer */}
                  <div className={`flex justify-between items-center gap-x-2 py-3 px-4 border-t ${darkMode ? 'border-neutral-800' : 'border-gray-200'}`}>
                    <div className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-gray-500'}`}>
                      {availableAgents.filter(agent => !chatAgents.some(a => a.id === agent.id)).length} agent(s) available
                    </div>
                    <button 
                      onClick={() => setShowAddAgentModal(false)}
                      className={`py-2 px-4 rounded-md ${darkMode ? 'bg-neutral-700 text-white hover:bg-neutral-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
