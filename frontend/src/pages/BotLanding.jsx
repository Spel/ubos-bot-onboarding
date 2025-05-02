import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getBot } from "../utils/botsData";
import { getFromStorage, STORAGE_KEYS } from "../utils/localStorage";

export default function BotLanding() {
  const { botId } = useParams();
  const [bot, setBot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(getFromStorage(STORAGE_KEYS.DARK_MODE, false));
  
  // Load bot data
  useEffect(() => {
    const bots = getFromStorage(STORAGE_KEYS.BOTS, []);
    
    // First try to find by URL path
    let foundBot = bots.find(b => {
      if (!b.url) return false;
      const urlPath = b.url.split('/').pop();
      return urlPath === botId;
    });
    
    // If not found by URL, try to find by name slug
    if (!foundBot) {
      foundBot = bots.find(b => {
        const nameSlug = b.name?.toLowerCase().replace(/\s+/g, '-');
        return nameSlug === botId;
      });
    }
    
    // If still not found, try to find by ID
    if (!foundBot) {
      foundBot = bots.find(b => b.id === botId);
    }
    
    if (foundBot) {
      setBot(foundBot);
      
      // Load chat history for this bot
      const allChatHistory = getFromStorage(STORAGE_KEYS.CHAT_HISTORY, {});
      const botChatHistory = allChatHistory[foundBot.id] || [];
      setChatHistory(botChatHistory);
    }
    
    setLoading(false);
  }, [botId]);
  
  // Handle sending a message
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!message.trim() || !bot) return;
    
    // Add user message to chat
    const newMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: message,
      timestamp: new Date().toISOString()
    };
    
    // Simulate bot response
    const botResponse = {
      id: (Date.now() + 1).toString(),
      sender: 'bot',
      text: generateBotResponse(message, bot),
      timestamp: new Date().toISOString()
    };
    
    const updatedChatHistory = [...chatHistory, newMessage, botResponse];
    setChatHistory(updatedChatHistory);
    
    // Save to localStorage
    const allChatHistory = getFromStorage(STORAGE_KEYS.CHAT_HISTORY, {});
    allChatHistory[bot.id] = updatedChatHistory;
    localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(allChatHistory));
    
    // Clear input
    setMessage("");
  };
  
  // Simple bot response generator based on bot type
  const generateBotResponse = (userMessage, bot) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Generic responses based on bot type
    if (bot.type === 'support') {
      if (lowerMessage.includes('help') || lowerMessage.includes('issue')) {
        return "I'm here to help! Could you please provide more details about your issue?";
      } else if (lowerMessage.includes('thank')) {
        return "You're welcome! Is there anything else I can help you with?";
      } else {
        return "Thank you for contacting support. How can I assist you today?";
      }
    } else if (bot.type === 'sales') {
      if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
        return "Our pricing is competitive and depends on your specific needs. Would you like me to provide a personalized quote?";
      } else if (lowerMessage.includes('product') || lowerMessage.includes('service')) {
        return "We offer a range of high-quality products and services. Could you tell me more about what you're looking for?";
      } else {
        return "Thanks for your interest! I'd be happy to tell you more about our offerings. What specific information are you looking for?";
      }
    } else if (bot.type === 'content') {
      if (lowerMessage.includes('blog') || lowerMessage.includes('article')) {
        return "I can help create engaging blog content. What topic are you interested in?";
      } else if (lowerMessage.includes('social') || lowerMessage.includes('post')) {
        return "I specialize in creating social media content that drives engagement. What platforms are you targeting?";
      } else {
        return "I'm your content creation assistant. I can help with blogs, social media posts, and more. What type of content do you need?";
      }
    } else {
      return "I'm here to assist you. How can I help today?";
    }
  };
  
  // Show loading state
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-neutral-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Show not found state
  if (!bot) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${darkMode ? 'bg-neutral-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="text-6xl mb-4">🤖</div>
        <h1 className="text-2xl font-bold mb-2">Bot Not Found</h1>
        <p className="text-center mb-6">Sorry, we couldn't find the bot you're looking for.</p>
        <Link 
          to="/my-bots" 
          className={`py-2 px-4 rounded-lg ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}
        >
          Go to My Bots
        </Link>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-neutral-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`px-4 py-3 ${darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200'} border-b shadow-sm flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className="text-2xl">{bot.avatar}</div>
          <div>
            <h1 className="font-semibold">{bot.name}</h1>
            <div className="text-xs text-gray-500">{bot.domain}</div>
          </div>
        </div>
        <Link 
          to="/my-bots" 
          className={`text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
        >
          Back to My Bots
        </Link>
      </header>
      
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Welcome message */}
        {chatHistory.length === 0 && (
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-neutral-800' : 'bg-white'} shadow-sm max-w-lg mx-auto`}>
            <div className="flex items-start gap-3">
              <div className="text-2xl mt-1">{bot.avatar}</div>
              <div>
                <p className="font-medium">{bot.name}</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {bot.description}
                </p>
                <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  How can I assist you today?
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Chat messages */}
        {chatHistory.map(msg => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`p-3 rounded-lg max-w-[80%] ${
                msg.sender === 'user' 
                  ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white') 
                  : (darkMode ? 'bg-neutral-800' : 'bg-white shadow-sm')
              }`}
            >
              {msg.sender === 'bot' && (
                <div className="flex items-center gap-2 mb-1">
                  <span>{bot.avatar}</span>
                  <span className="font-medium">{bot.name}</span>
                </div>
              )}
              <p>{msg.text}</p>
              <div 
                className={`text-xs mt-1 ${
                  msg.sender === 'user' 
                    ? 'text-blue-200' 
                    : (darkMode ? 'text-gray-500' : 'text-gray-400')
                }`}
              >
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Message Input */}
      <div className={`p-4 ${darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200'} border-t`}>
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className={`flex-1 px-4 py-2 rounded-lg border ${
              darkMode 
                ? 'bg-neutral-700 border-neutral-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className={`px-4 py-2 rounded-lg ${
              darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
            } text-white transition-colors disabled:opacity-50`}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
