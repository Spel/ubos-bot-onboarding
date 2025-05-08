import React, { useState, useEffect, useRef } from "react";
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
  const [activeTab, setActiveTab] = useState('overview');
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);
  
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
  
  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, isTyping]);

  // Handle sending a message
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!message.trim() || !bot || isTyping) return;
    
    // Add user message to chat
    const newMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: message,
      timestamp: new Date().toISOString()
    };
    
    // Update chat with user message
    const updatedChatHistory = [...chatHistory, newMessage];
    setChatHistory(updatedChatHistory);
    
    // Show typing indicator
    setIsTyping(true);
    
    // Simulate bot thinking time (500-1500ms)
    const thinkingTime = Math.floor(Math.random() * 1000) + 500;
    
    setTimeout(() => {
      // Generate bot response
      const botResponse = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: generateBotResponse(message, bot),
        timestamp: new Date().toISOString()
      };
      
      // Add bot response to chat
      const finalChatHistory = [...updatedChatHistory, botResponse];
      setChatHistory(finalChatHistory);
      
      // Save to localStorage
      const allChatHistory = getFromStorage(STORAGE_KEYS.CHAT_HISTORY, {});
      allChatHistory[bot.id] = finalChatHistory;
      localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(allChatHistory));
      
      // Hide typing indicator
      setIsTyping(false);
    }, thinkingTime);
    
    // Clear input
    setMessage("");
  };
  
  // Enhanced bot response generator based on bot type and capabilities
  const generateBotResponse = (userMessage, bot) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for API or integration questions first (common to all bot types)
    if (lowerMessage.includes('api') || lowerMessage.includes('integration') || lowerMessage.includes('connect')) {
      return "You can integrate with me using our REST API, MCP protocol, or Agent-to-Agent communication. Check the API Documentation tab for detailed instructions and examples.";
    }
    
    // Check for capability questions
    if (lowerMessage.includes('what can you do') || lowerMessage.includes('capabilities') || lowerMessage.includes('features')) {
      if (bot.type === 'support') {
        return "I can help troubleshoot issues, provide customer support, answer product questions, and connect you with human agents when needed. My knowledge base includes all product documentation and common solutions.";
      } else if (bot.type === 'sales') {
        return "I can provide product information, pricing details, handle basic sales inquiries, schedule demos, and connect potential customers with sales representatives. I'm trained on our entire product catalog and pricing structure.";
      } else if (bot.type === 'content') {
        return "I can generate blog ideas, create social media content, suggest content strategies, and help optimize existing content for SEO. I'm trained on content marketing best practices and can adapt to various tones and styles.";
      } else {
        return `As ${bot.name}, I'm designed to ${bot.description || 'assist with various tasks'}. Ask me anything specific you'd like help with!`;
      }
    }
    
    // Generic responses based on bot type
    if (bot.type === 'support') {
      if (lowerMessage.includes('help') || lowerMessage.includes('issue') || lowerMessage.includes('problem')) {
        return "I'm here to help resolve your issue! Could you please provide more details about what you're experiencing? Include any error messages or steps to reproduce the problem.";
      } else if (lowerMessage.includes('thank')) {
        return "You're welcome! I'm glad I could assist. Is there anything else you need help with today?";
      } else if (lowerMessage.includes('speak') || lowerMessage.includes('human') || lowerMessage.includes('agent')) {
        return "I'd be happy to connect you with a human support agent. Please note that our agents are available Monday-Friday, 9am-5pm EST. Would you like me to create a support ticket for you?";
      } else {
        return "Thank you for contacting support. I'm here to help troubleshoot any issues you're experiencing. Could you please describe what you need assistance with?";
      }
    } else if (bot.type === 'sales') {
      if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('pricing')) {
        return "Our pricing starts at $29/month for the Basic plan, $79/month for Professional, and $199/month for Enterprise. We also offer custom solutions for larger organizations. Would you like me to provide more details about what's included in each plan?";
      } else if (lowerMessage.includes('product') || lowerMessage.includes('service') || lowerMessage.includes('offer')) {
        return "We offer a comprehensive suite of solutions including our flagship product, enterprise integrations, and professional services. Our platform helps businesses increase efficiency by up to 40%. Which specific aspect would you like to learn more about?";
      } else if (lowerMessage.includes('demo') || lowerMessage.includes('try') || lowerMessage.includes('test')) {
        return "I'd be happy to arrange a demo for you! Our product specialists can show you how our solution addresses your specific needs. Would you prefer a live demo or a recorded walkthrough? Also, what's the best email to reach you?";
      } else {
        return "Thanks for your interest in our solutions! I can provide information about our products, pricing, or schedule a demo with our team. What specific information would be most helpful for you right now?";
      }
    } else if (bot.type === 'content') {
      if (lowerMessage.includes('blog') || lowerMessage.includes('article')) {
        return "I can help create engaging blog content optimized for both readers and search engines. Some popular formats include how-to guides, listicles, case studies, and thought leadership pieces. What industry or topic would your blog focus on?";
      } else if (lowerMessage.includes('social') || lowerMessage.includes('post') || lowerMessage.includes('media')) {
        return "Social media content requires the right mix of engagement and value. I can help craft posts for LinkedIn, Twitter, Facebook, Instagram, and TikTok, each optimized for the platform's specific audience and format. Which platforms are you currently focusing on?";
      } else if (lowerMessage.includes('seo') || lowerMessage.includes('keyword') || lowerMessage.includes('rank')) {
        return "SEO is essential for content visibility. I can help identify relevant keywords, optimize content structure, and suggest meta descriptions. I stay updated with the latest algorithm changes to ensure your content ranks well. What specific SEO challenges are you facing?";
      } else {
        return "As your content assistant, I can help with blogs, social media, email newsletters, video scripts, and more. My goal is to help you create engaging content that resonates with your audience and achieves your marketing objectives. What type of content are you looking to create?";
      }
    } else {
      // Default responses for other bot types
      if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return `Hello! I'm ${bot.name}${bot.description ? `, ${bot.description.toLowerCase()}` : ''}. How can I assist you today?`;
      } else if (lowerMessage.includes('thank')) {
        return "You're welcome! I'm here to help whenever you need assistance. Is there anything else you'd like to know?";
      } else if (lowerMessage.includes('how') && lowerMessage.includes('work')) {
        return `I work by processing your questions and providing relevant responses based on my training. I'm specialized in ${bot.type || 'various tasks'} and continuously learning to better assist users like you.`;
      } else {
        return `I'm ${bot.name}, here to assist you! I can answer questions, provide information, and help with various tasks related to ${bot.type || 'your needs'}. Feel free to ask me anything specific!`;
      }
    }
  };
  
  // Show loading state
  // Tab content rendering functions
  const renderOverviewTab = () => {
    if (!bot) return null;
    
    return (
      <div className="space-y-6">
        <div className={`p-6 rounded-xl ${darkMode ? 'bg-neutral-800' : 'bg-white'} shadow-sm`}>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl">{bot.avatar}</div>
            <div>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{bot.name}</h1>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bot.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {bot.status === 'active' ? 'Active' : 'Inactive'}
                </span>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {bot.type.charAt(0).toUpperCase() + bot.type.slice(1)} Bot
                </span>
              </div>
            </div>
          </div>
          
          <p className={`text-base mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {bot.description || `A powerful ${bot.type} bot designed to help with various tasks.`}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-neutral-700' : 'bg-gray-100'}`}>
              <h3 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Bot URL</h3>
              <div className="flex items-center gap-2">
                <span className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{bot.domain}</span>
                <button className={`p-1 rounded hover:bg-opacity-10 ${darkMode ? 'hover:bg-white' : 'hover:bg-black'}`} onClick={() => navigator.clipboard.writeText(bot.domain)}>
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-neutral-700' : 'bg-gray-100'}`}>
              <h3 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Created</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {bot.created ? new Date(bot.created).toLocaleDateString() : 'Recently'}
              </p>
            </div>
          </div>
        </div>
        
        <div className={`p-6 rounded-xl ${darkMode ? 'bg-neutral-800' : 'bg-white'} shadow-sm`}>
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {renderCapabilities()}
          </div>
        </div>
        
        <div className={`p-6 rounded-xl ${darkMode ? 'bg-neutral-800' : 'bg-white'} shadow-sm`}>
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Agent Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-neutral-700' : 'bg-gray-100'}`}>
              <h3 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Phone Number</h3>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{bot.phoneNumber || "+1 (555) 123-4567"}</span>
                <button className={`p-1 rounded hover:bg-opacity-10 ${darkMode ? 'hover:bg-white' : 'hover:bg-black'}`} onClick={() => navigator.clipboard.writeText(bot.phoneNumber || "+1 (555) 123-4567")}>
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-neutral-700' : 'bg-gray-100'}`}>
              <h3 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Email Address</h3>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{bot.email || `${bot.name.toLowerCase().replace(/\s+/g, '.')}@ubos.tech`}</span>
                <button className={`p-1 rounded hover:bg-opacity-10 ${darkMode ? 'hover:bg-white' : 'hover:bg-black'}`} onClick={() => navigator.clipboard.writeText(bot.email || `${bot.name.toLowerCase().replace(/\s+/g, '.')}@ubos.tech`)}>
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-neutral-700' : 'bg-gray-100'}`}>
              <h3 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>WhatsApp</h3>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{bot.whatsApp || `@${bot.name.toLowerCase().replace(/\s+/g, '')}`}</span>
                <button className={`p-1 rounded hover:bg-opacity-10 ${darkMode ? 'hover:bg-white' : 'hover:bg-black'}`} onClick={() => navigator.clipboard.writeText(bot.whatsApp || `@${bot.name.toLowerCase().replace(/\s+/g, '')}`)}>                  
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-neutral-700' : 'bg-gray-100'}`}>
              <h3 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>LinkedIn</h3>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{bot.linkedin || bot.name}</span>
                <button className={`p-1 rounded hover:bg-opacity-10 ${darkMode ? 'hover:bg-white' : 'hover:bg-black'}`} onClick={() => navigator.clipboard.writeText(bot.linkedin || bot.name)}>
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Quick Start</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mt-0.5">
                1
              </div>
              <div>
                <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Chat with {bot.name}</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Use the chat interface to interact with {bot.name} directly. Ask questions, request information, or test capabilities.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mt-0.5">
                2
              </div>
              <div>
                <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Integrate via API</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Integrate {bot.name} into your applications using our REST API. See the API Documentation tab for details.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mt-0.5">
                3
              </div>
              <div>
                <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Agent-to-Agent Communication</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Enable your own bots to communicate with {bot.name} using our Agent-to-Agent protocol.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render bot capabilities based on type
  const renderCapabilities = () => {
    const capabilities = [];
    
    // Common capabilities
    capabilities.push({
      icon: <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>,
      title: "Natural Conversations",
      description: "Engage in natural, human-like conversations with contextual understanding"
    });
    
    capabilities.push({
      icon: <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>,
      title: "Secure Integration",
      description: "Enterprise-grade security for all interactions and data exchanges"
    });
    
    // Type-specific capabilities
    if (bot.type === 'support') {
      capabilities.push({
        icon: <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>,
        title: "Knowledge Base Access",
        description: "Access to comprehensive product documentation and solutions"
      });
    } else if (bot.type === 'sales') {
      capabilities.push({
        icon: <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>,
        title: "Pricing Information",
        description: "Detailed pricing information and personalized quotes"
      });
    } else if (bot.type === 'content') {
      capabilities.push({
        icon: <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>,
        title: "Content Generation",
        description: "Create engaging content for blogs, social media, and more"
      });
    }
    
    return capabilities.map((capability, index) => (
      <div key={index} className={`p-4 rounded-lg ${darkMode ? 'bg-neutral-700' : 'bg-gray-100'}`}>
        <div className={`mb-3 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
          {capability.icon}
        </div>
        <h3 className={`text-base font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {capability.title}
        </h3>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {capability.description}
        </p>
      </div>
    ));
  };
  
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
        <h1 className="text-2xl font-bold mb-4">Bot Not Found</h1>
        <p className="mb-6">Sorry, we couldn't find the bot you're looking for.</p>
        <Link 
          to="/my-bots" 
          className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          Back to My Bots
        </Link>
      </div>
    );
  }
  
  // Render chat interface tab
  const renderChatTab = () => {
    return (
      <div className="flex flex-col" style={{ height: 'calc(100vh - 80px)', overflow: 'hidden', maxHeight: '100%' }}>
        {/* Chat messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={chatContainerRef}>
          {/* Welcome message */}
          {chatHistory.length === 0 && (
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-neutral-800' : 'bg-white'} shadow-sm max-w-lg mx-auto`}>
              <div className="flex items-start gap-3">
                <div className="text-2xl mt-1">{bot.avatar}</div>
                <div>
                  <p className="font-medium">{bot.name}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {bot.description || `I'm a ${bot.type} bot ready to assist you.`}
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
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-neutral-800' : 'bg-white shadow-sm'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span>{bot.avatar}</span>
                  <span className="font-medium">{bot.name}</span>
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Message input */}
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
              disabled={!message.trim() || isTyping}
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
  };
  
  // Render API documentation tab
  const renderApiTab = () => {
    return (
      <div className="space-y-6">
        <div className={`p-6 rounded-xl ${darkMode ? 'bg-neutral-800' : 'bg-white'} shadow-sm`}>
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>REST API Integration</h2>
          <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Integrate with {bot.name} using our REST API to enable programmatic interactions from your applications.
          </p>
          
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-neutral-700' : 'bg-gray-100'} mb-4`}>
            <h3 className={`text-base font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Base URL</h3>
            <div className="flex items-center gap-2">
              <code className={`px-2 py-1 rounded ${darkMode ? 'bg-neutral-600 text-blue-300' : 'bg-gray-200 text-blue-700'}`}>
                https://api.ubos.tech/v1/bots/{bot.id}
              </code>
              <button className={`p-1 rounded hover:bg-opacity-10 ${darkMode ? 'hover:bg-white' : 'hover:bg-black'}`} onClick={() => navigator.clipboard.writeText(`https://api.ubos.tech/v1/bots/${bot.id}`)}>
                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
          
          <h3 className={`text-lg font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Authentication</h3>
          <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            All API requests require an API key to be included in the header.
          </p>
          
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-neutral-700' : 'bg-gray-100'} font-mono text-sm mb-6 overflow-x-auto`}>
            <pre className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
              {`Authorization: Bearer YOUR_API_KEY`}
            </pre>
          </div>
          
          <h3 className={`text-lg font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Send a Message</h3>
          <p className={`mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Send a message to the bot and receive a response.
          </p>
          
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-neutral-700' : 'bg-gray-100'} font-mono text-sm mb-2 overflow-x-auto`}>
            <div className={`mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>POST /messages</div>
            <pre className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
              {`{
  "message": "Hello, how can you help me?",
  "user_id": "optional-user-identifier",
  "session_id": "optional-session-identifier"
}`}
            </pre>
          </div>
          
          <h3 className={`text-lg font-medium mb-3 mt-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Response Format</h3>
          
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-neutral-700' : 'bg-gray-100'} font-mono text-sm overflow-x-auto`}>
            <pre className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
              {`{
  "id": "msg_123456789",
  "bot_id": "${bot.id}",
  "response": "I can help with various ${bot.type} tasks. What specific assistance do you need?",
  "created_at": "2025-05-02T12:34:56Z"
}`}
            </pre>
          </div>
        </div>
        
        <div className={`p-6 rounded-xl ${darkMode ? 'bg-neutral-800' : 'bg-white'} shadow-sm`}>
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>MCP Protocol</h2>
          <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Multi-Channel Protocol (MCP) allows for real-time, bidirectional communication with {bot.name}.
          </p>
          
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-neutral-700' : 'bg-gray-100'} mb-4`}>
            <h3 className={`text-base font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>WebSocket Endpoint</h3>
            <div className="flex items-center gap-2">
              <code className={`px-2 py-1 rounded ${darkMode ? 'bg-neutral-600 text-blue-300' : 'bg-gray-200 text-blue-700'}`}>
                wss://mcp.ubos.tech/v1/bots/{bot.id}/ws
              </code>
            </div>
          </div>
          
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            For detailed documentation on implementing MCP, refer to our <a href="#" className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>MCP Integration Guide</a>.
          </p>
        </div>
        
        <div className={`p-6 rounded-xl ${darkMode ? 'bg-neutral-800' : 'bg-white'} shadow-sm`}>
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Agent-to-Agent Communication</h2>
          <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Enable your own AI agents to communicate with {bot.name} using our Agent-to-Agent protocol.
          </p>
          
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-neutral-700' : 'bg-gray-100'} mb-4`}>
            <h3 className={`text-base font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Agent Discovery</h3>
            <div className="flex items-center gap-2">
              <code className={`px-2 py-1 rounded ${darkMode ? 'bg-neutral-600 text-blue-300' : 'bg-gray-200 text-blue-700'}`}>
                https://a2a.ubos.tech/v1/discovery/{bot.id}
              </code>
            </div>
          </div>
          
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            For detailed documentation on implementing Agent-to-Agent communication, refer to our <a href="#" className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>A2A Protocol Guide</a>.
          </p>
        </div>
      </div>
    );
  };
  
  return (
    <div className={`min-h-screen flex flex-col overflow-hidden ${darkMode ? 'bg-neutral-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header with Tabs */}
      <header className={`${darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200'} border-b shadow-sm sticky top-0 z-10`}>
        <div className="px-8 py-4 flex items-center justify-between">
          {/* Bot info */}
          <div className="flex items-center">
            <div className="flex items-center gap-4 mr-12">
              <div className="text-3xl">{bot.avatar}</div>
              <div>
                <h1 className="text-lg font-semibold">{bot.name}</h1>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{bot.domain}</div>
              </div>
            </div>
            
            {/* Divider */}
            <div className={`h-10 w-px mx-4 ${darkMode ? 'bg-neutral-700' : 'bg-gray-200'}`}></div>
            
            {/* Tab Navigation */}
            <div className="flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-6 font-medium text-sm border-b-2 ${activeTab === 'overview'
                  ? (darkMode ? 'border-blue-500 text-blue-400' : 'border-blue-600 text-blue-600')
                  : (darkMode ? 'border-transparent text-gray-400 hover:text-gray-300' : 'border-transparent text-gray-500 hover:text-gray-700')
                } transition-colors`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`py-2 px-6 font-medium text-sm border-b-2 ${activeTab === 'chat'
                  ? (darkMode ? 'border-blue-500 text-blue-400' : 'border-blue-600 text-blue-600')
                  : (darkMode ? 'border-transparent text-gray-400 hover:text-gray-300' : 'border-transparent text-gray-500 hover:text-gray-700')
                } transition-colors`}
              >
                Chat
              </button>
              <button
                onClick={() => setActiveTab('api')}
                className={`py-2 px-6 font-medium text-sm border-b-2 ${activeTab === 'api'
                  ? (darkMode ? 'border-blue-500 text-blue-400' : 'border-blue-600 text-blue-600')
                  : (darkMode ? 'border-transparent text-gray-400 hover:text-gray-300' : 'border-transparent text-gray-500 hover:text-gray-700')
                } transition-colors`}
              >
                API Documentation
              </button>
            </div>
          </div>
          
          {/* Back button */}
          <Link 
            to="/my-bots" 
            className={`py-2 px-5 rounded-lg ${darkMode ? 'bg-neutral-700 hover:bg-neutral-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors text-sm font-medium`}
          >
            Back to My Bots
          </Link>
        </div>
      </header>
      
      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'overview' && <div className="h-full overflow-y-auto p-6">{renderOverviewTab()}</div>}
        {activeTab === 'chat' && <div className="h-full overflow-hidden">{renderChatTab()}</div>}
        {activeTab === 'api' && <div className="h-full overflow-y-auto p-6">{renderApiTab()}</div>}
      </div>
    </div>
  );
}
