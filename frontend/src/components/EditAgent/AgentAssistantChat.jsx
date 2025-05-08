import React, { useState, useRef, useEffect } from "react";

const AgentAssistantChat = ({ 
  darkMode, 
  isOpen, 
  onClose, 
  activeTab,
  formData,
  setFormData,
  bot,
  botId
}) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi! I'm your Agent Assistant. I can help you configure your agent in the ${activeTab} tab. What would you like to know?`
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  
  // Update welcome message when tab changes
  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content: `Hi! I'm your Agent Assistant. I can help you configure your agent in the ${activeTab} tab. What would you like to know?`
      }
    ]);
  }, [activeTab]);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const newMessages = [
      ...messages,
      { role: 'user', content: input }
    ];
    
    setMessages(newMessages);
    setInput('');
    
    // Generate context-aware responses based on active tab
    setTimeout(() => {
      let response = {
        role: 'assistant',
        content: "I'll help you with that. Let me think about it...",
        actions: []
      };
      
      // Customize response based on active tab
      switch (activeTab) {
        case 'general':
          response.content = "To set up the general information for your agent, you'll want to provide a clear name, description, and select an appropriate avatar. This helps users understand what your agent does at a glance.";
          response.actions = [
            { 
              type: 'focus_field', 
              field: 'name', 
              label: 'Focus on Name field' 
            },
            { 
              type: 'suggestion', 
              value: 'Make description more specific', 
              label: 'Improve description' 
            }
          ];
          break;
        case 'team':
          response.content = "The team tab allows you to add AI assistants to work alongside your main agent. Each team member can have different capabilities to handle specific tasks.";
          response.actions = [
            { 
              type: 'open_modal', 
              value: 'add_team_member', 
              label: 'Add team member' 
            }
          ];
          break;
        case 'prompt':
          response.content = "In the prompt engineering tab, you can customize how your agent responds to user inputs. A well-crafted system prompt is crucial for guiding your agent's behavior.";
          response.actions = [
            { 
              type: 'suggestion', 
              value: 'Use a more specific system prompt', 
              label: 'Improve system prompt' 
            }
          ];
          break;
        case 'knowledge':
          response.content = "The knowledge base tab lets you upload documents and add sources that your agent can reference when answering questions. This helps your agent provide more accurate and specific information.";
          response.actions = [
            { 
              type: 'suggestion', 
              value: 'Upload relevant documents', 
              label: 'Add knowledge' 
            }
          ];
          break;
        case 'creator':
          response.content = "The agent creator provides a guided experience to build your agent. You can use the step-by-step wizard or chat with me directly to configure your agent.";
          response.actions = [
            { 
              type: 'suggestion', 
              value: 'Start with the purpose section', 
              label: 'Begin wizard' 
            }
          ];
          break;
        default:
          response.content = "I can help you configure this section of your agent. What specific aspect are you interested in?";
      }
      
      setMessages(prev => [...prev, response]);
    }, 1000);
  };
  
  // Handle action buttons from assistant
  const handleAction = (action) => {
    console.log('Action clicked:', action);
    // Here you would implement the actual action handlers
    // For example, focusing on a field, opening a modal, etc.
    
    // Add a message acknowledging the action
    setMessages(prev => [
      ...prev, 
      { 
        role: 'assistant', 
        content: `I'll help you with that. ${action.type === 'suggestion' ? `Here's how to ${action.value}...` : 'Let me guide you through this process...'}`
      }
    ]);
  };
  
  return (
    <div 
      className={`fixed top-[61px] bottom-0 right-0 w-[30%] z-20 flex flex-col ${darkMode ? 'bg-neutral-800 text-white' : 'bg-white text-gray-900'} shadow-xl border-l ${darkMode ? 'border-neutral-700' : 'border-gray-200'} transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      {/* Header */}
      <div className={`p-4 border-b ${darkMode ? 'border-neutral-700' : 'border-gray-200'} flex justify-between items-center`}>
        <h3 className="font-medium">Agent Assistant</h3>
        <button 
          onClick={onClose}
          className={`p-1.5 rounded-full ${darkMode ? 'hover:bg-neutral-700' : 'hover:bg-gray-100'}`}
        >
          <svg className="size-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div 
            key={index}
            className={`${message.role === 'user' 
              ? (darkMode ? 'bg-blue-900/30' : 'bg-blue-50') 
              : (darkMode ? 'bg-neutral-700' : 'bg-gray-100')
            } p-3 rounded-lg max-w-[90%] ${
              message.role === 'user' ? 'ml-auto' : 'mr-auto'
            }`}
          >
            <div className={darkMode ? 'text-white' : 'text-gray-800'}>
              {message.content}
            </div>
            
            {message.actions && (
              <div className="mt-2 flex flex-wrap gap-2">
                {message.actions.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => handleAction(action)}
                    className={`text-xs px-2 py-1 rounded ${
                      darkMode ? 'bg-blue-800 text-blue-200 hover:bg-blue-700' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                    }`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <div className={`p-4 border-t ${darkMode ? 'border-neutral-700' : 'border-gray-200'}`}>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask for help with configuration..."
            className={`flex-1 p-2 rounded-lg ${
              darkMode 
                ? 'bg-neutral-700 text-white border-neutral-600' 
                : 'bg-white text-gray-900 border-gray-300'
            } border`}
          />
          <button
            onClick={handleSendMessage}
            className={`p-2 rounded-lg ${
              darkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            <svg className="size-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentAssistantChat;
