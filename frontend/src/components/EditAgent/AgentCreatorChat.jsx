import React, { useState, useRef, useEffect } from "react";

const AgentCreatorChat = ({ 
  darkMode, 
  isOpen, 
  onClose, 
  formData,
  setFormData,
  bot,
  botId,
  activeTab,
  saveChanges
}) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi! I'm your Agent Assistant. I'll help you build and configure your AI agent. Let me know what you'd like to do!`
    }
  ]);
  
  // Keep the welcome message consistent across tabs
  useEffect(() => {
    // Only reset messages if there are no existing messages (first load)
    if (messages.length <= 1) {
      setMessages([
        {
          role: 'assistant',
          content: `Hi! I'm your Agent Assistant. I'll help you build and configure your AI agent. Let me know what you'd like to do!`
        }
      ]);
    }
  }, [activeTab, messages.length]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  
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
    
    // Process user input and generate response
    processUserInput(input);
  };
  
  const processUserInput = (userInput) => {
    // Simulate AI processing with a delay
    setTimeout(() => {
      const userInputLower = userInput.toLowerCase();
      
      // Detect intent from user input
      let response = {
        role: 'assistant',
        content: "I'll help you with that. What would you like to know?",
        actions: []
      };
      
      // Check if the user is asking for general help
      if (userInputLower.includes("help") || userInputLower.includes("how to") || userInputLower.includes("what is") || userInputLower.includes("explain")) {
        // Provide general help options regardless of active tab
        if (userInputLower.includes("general") || userInputLower.includes("basic") || userInputLower.includes("information")) {
          response = {
            role: 'assistant',
            content: "To set up the general information for your agent, you'll want to provide a clear name, description, and select an appropriate avatar. This helps users understand what your agent does at a glance.",
            actions: [
              { type: 'suggestion', value: 'How do I improve my agent description?', label: 'Improve description' }
            ]
          };
        } else if (userInputLower.includes("team") || userInputLower.includes("member") || userInputLower.includes("assistant")) {
          response = {
            role: 'assistant',
            content: "The team tab allows you to add AI assistants to work alongside your main agent. Each team member can have different capabilities to handle specific tasks.",
            actions: [
              { type: 'suggestion', value: 'How do I add a team member?', label: 'Add team member' }
            ]
          };
        } else if (userInputLower.includes("prompt") || userInputLower.includes("engineering") || userInputLower.includes("system prompt")) {
          response = {
            role: 'assistant',
            content: "In the prompt engineering tab, you can customize how your agent responds to user inputs. A well-crafted system prompt is crucial for guiding your agent's behavior.",
            actions: [
              { type: 'suggestion', value: 'How do I write a good system prompt?', label: 'Improve system prompt' }
            ]
          };
        } else if (userInputLower.includes("knowledge") || userInputLower.includes("document") || userInputLower.includes("source")) {
          response = {
            role: 'assistant',
            content: "The knowledge base tab lets you upload documents and add sources that your agent can reference when answering questions. This helps your agent provide more accurate and specific information.",
            actions: [
              { type: 'suggestion', value: 'What file formats are supported?', label: 'Knowledge base help' }
            ]
          };
        } else if (userInputLower.includes("integration") || userInputLower.includes("connect") || userInputLower.includes("api")) {
          response = {
            role: 'assistant',
            content: "The integrations tab allows you to connect your agent with external services and APIs. This extends your agent's capabilities beyond conversation.",
            actions: [
              { type: 'suggestion', value: 'What integrations are available?', label: 'View integrations' }
            ]
          };
        } else if (userInputLower.includes("analytics") || userInputLower.includes("metrics") || userInputLower.includes("performance")) {
          response = {
            role: 'assistant',
            content: "The analytics tab provides insights into how users are interacting with your agent. You can track usage patterns, popular queries, and performance metrics.",
            actions: [
              { type: 'suggestion', value: 'What metrics should I track?', label: 'Analytics help' }
            ]
          };
        } else {
          // General help response if no specific area is mentioned
          response = {
            role: 'assistant',
            content: "I can help you build and configure your AI agent. What would you like to know about? You can ask about general settings, team members, prompt engineering, knowledge base, integrations, or analytics.",
            actions: [
              { type: 'suggestion', value: 'I want to create a customer support agent', label: 'Create support agent' },
              { type: 'suggestion', value: 'How do I add a knowledge base?', label: 'Knowledge base help' },
              { type: 'suggestion', value: 'How do I improve my agent?', label: 'Improvement tips' }
            ]
          };
        }
      }
      // Check for agent creation intents
      else if (userInputLower.includes("customer support") || userInputLower.includes("help desk") || userInputLower.includes("service")) {
        response = {
          role: 'assistant',
          content: "A customer support agent is a great choice! This type of agent can help answer customer questions, troubleshoot issues, and provide information about products or services.",
          actions: [
            { 
              type: 'update_field', 
              field: 'name', 
              value: userInputLower.includes("customer support") ? 'Customer Support Agent' : 'Help Desk Assistant', 
              label: 'Set this name' 
            },
            { 
              type: 'update_field', 
              field: 'type', 
              value: 'support', 
              label: 'Set type: Support' 
            },
            { 
              type: 'update_field', 
              field: 'description', 
              value: 'An AI agent that provides customer support, answers questions, and helps troubleshoot issues.', 
              label: 'Set this description' 
            }
          ]
        };
      } else if (userInputLower.includes("sales") || userInputLower.includes("marketing")) {
        response = {
          role: 'assistant',
          content: "A sales and marketing agent can help promote products, qualify leads, and provide information to potential customers.",
          actions: [
            { 
              type: 'update_field', 
              field: 'name', 
              value: userInputLower.includes("sales") ? 'Sales Assistant' : 'Marketing Agent', 
              label: 'Set this name' 
            },
            { 
              type: 'update_field', 
              field: 'type', 
              value: 'marketing', 
              label: 'Set type: Marketing' 
            },
            { 
              type: 'update_field', 
              field: 'description', 
              value: 'An AI agent that helps with sales inquiries, provides product information, and assists with marketing tasks.', 
              label: 'Set this description' 
            }
          ]
        };
      } else if (userInputLower.includes("knowledge") || userInputLower.includes("information") || userInputLower.includes("data")) {
        response = {
          role: 'assistant',
          content: "A knowledge base agent is perfect for organizing and retrieving information. This type of agent can help users find specific information from your documents and data.",
          actions: [
            { 
              type: 'update_field', 
              field: 'name', 
              value: 'Knowledge Assistant', 
              label: 'Set this name' 
            },
            { 
              type: 'update_field', 
              field: 'type', 
              value: 'knowledge', 
              label: 'Set type: Knowledge' 
            },
            { 
              type: 'update_field', 
              field: 'description', 
              value: 'An AI agent that helps retrieve and organize information from documents and knowledge bases.', 
              label: 'Set this description' 
            }
          ]
        };
      } else if (userInputLower.includes("creative") || userInputLower.includes("content") || userInputLower.includes("writing")) {
        response = {
          role: 'assistant',
          content: "A creative content agent can help generate ideas, write content, and assist with creative tasks.",
          actions: [
            { 
              type: 'update_field', 
              field: 'name', 
              value: 'Creative Assistant', 
              label: 'Set this name' 
            },
            { 
              type: 'update_field', 
              field: 'type', 
              value: 'creative', 
              label: 'Set type: Creative' 
            },
            { 
              type: 'update_field', 
              field: 'description', 
              value: 'An AI agent that helps with creative tasks, content generation, and writing assistance.', 
              label: 'Set this description' 
            }
          ]
        };
      } else if (userInputLower.includes("name")) {
        // Extract potential name from input
        const nameMatch = userInput.match(/name(?:\s+is|:)?\s+(.+?)(?:\.|\?|$)/i);
        const suggestedName = nameMatch ? nameMatch[1].trim() : "Custom Agent";
        
        response = {
          role: 'assistant',
          content: `I'll update the agent's name. Would you like to name it "${suggestedName}"?`,
          actions: [
            { 
              type: 'update_field', 
              field: 'name', 
              value: suggestedName, 
              label: `Name: ${suggestedName}` 
            }
          ]
        };
      } else if (userInputLower.includes("description") || userInputLower.includes("what it does")) {
        // Extract potential description from input
        const descMatch = userInput.match(/description(?:\s+is|:)?\s+(.+?)(?:\.|\?|$)/i);
        const suggestedDesc = descMatch ? descMatch[1].trim() : "";
        
        response = {
          role: 'assistant',
          content: "Let's update the agent's description. A good description helps users understand what your agent can do.",
          actions: [
            { 
              type: 'update_field', 
              field: 'description', 
              value: suggestedDesc || "An AI assistant that helps users with various tasks.", 
              label: 'Set this description' 
            }
          ]
        };
      } else if (userInputLower.includes("avatar") || userInputLower.includes("emoji")) {
        response = {
          role: 'assistant',
          content: "Let's choose an avatar for your agent. Here are some options:",
          actions: [
            { type: 'update_field', field: 'avatar', value: '🤖', label: '🤖 Robot' },
            { type: 'update_field', field: 'avatar', value: '💬', label: '💬 Chat' },
            { type: 'update_field', field: 'avatar', value: '🧠', label: '🧠 Brain' },
            { type: 'update_field', field: 'avatar', value: '👨‍💼', label: '👨‍💼 Business' },
            { type: 'update_field', field: 'avatar', value: '👩‍💼', label: '👩‍💼 Business Woman' },
            { type: 'update_field', field: 'avatar', value: '🔍', label: '🔍 Search' }
          ]
        };
      } else if (userInputLower.includes("model") || userInputLower.includes("llm")) {
        response = {
          role: 'assistant',
          content: "Let's select a language model for your agent. More capable models may cost more but provide better results.",
          actions: [
            { type: 'update_field', field: 'model', value: 'gpt-4', label: 'GPT-4 (Most capable)' },
            { type: 'update_field', field: 'model', value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo (Balanced)' },
            { type: 'update_field', field: 'model', value: 'claude-3-opus', label: 'Claude 3 Opus (High quality)' },
            { type: 'update_field', field: 'model', value: 'claude-3-sonnet', label: 'Claude 3 Sonnet (Fast)' },
            { type: 'update_field', field: 'model', value: 'llama-3', label: 'Llama 3 (Open source)' }
          ]
        };
      } else if (userInputLower.includes("function") || userInputLower.includes("capability") || userInputLower.includes("can do")) {
        response = {
          role: 'assistant',
          content: "Let's configure what your agent can do. Here are some capabilities you can enable:",
          actions: [
            { type: 'toggle_function', field: 'web_search', label: 'Web Search' },
            { type: 'toggle_function', field: 'code_execution', label: 'Code Execution' },
            { type: 'toggle_function', field: 'data_analysis', label: 'Data Analysis' },
            { type: 'toggle_function', field: 'image_generation', label: 'Image Generation' },
            { type: 'toggle_function', field: 'file_management', label: 'File Management' },
            { type: 'toggle_function', field: 'api_calls', label: 'API Calls' }
          ]
        };
      } else if (userInputLower.includes("personality") || userInputLower.includes("tone") || userInputLower.includes("style")) {
        response = {
          role: 'assistant',
          content: "Let's define your agent's personality. This will influence how it communicates with users.",
          actions: [
            { type: 'toggle_personality', trait: 'Helpful', label: 'Helpful' },
            { type: 'toggle_personality', trait: 'Friendly', label: 'Friendly' },
            { type: 'toggle_personality', trait: 'Professional', label: 'Professional' },
            { type: 'toggle_personality', trait: 'Creative', label: 'Creative' },
            { type: 'toggle_personality', trait: 'Technical', label: 'Technical' },
            { type: 'toggle_personality', trait: 'Concise', label: 'Concise' }
          ]
        };
      } else if (userInputLower.includes("save") || userInputLower.includes("done") || userInputLower.includes("finish")) {
        response = {
          role: 'assistant',
          content: "Great! I've configured your agent based on our conversation. Would you like to save these changes?",
          actions: [
            { type: 'save_changes', label: 'Save Changes' },
            { type: 'continue_editing', label: 'Continue Editing' }
          ]
        };
      } else if (userInputLower.includes("prompt") || userInputLower.includes("system")) {
        response = {
          role: 'assistant',
          content: "Let's set up a system prompt for your agent. This defines how your agent behaves and what capabilities it has. Here are some templates you can use:",
          actions: [
            { 
              type: 'update_field', 
              field: 'systemPrompt', 
              value: 'You are a helpful assistant specialized in customer support.', 
              label: 'Customer Support Template' 
            },
            { 
              type: 'update_field', 
              field: 'systemPrompt', 
              value: 'You are a helpful assistant specialized in content creation.', 
              label: 'Content Creation Template' 
            },
            { 
              type: 'update_field', 
              field: 'systemPrompt', 
              value: 'You are a helpful assistant specialized in data analysis.', 
              label: 'Data Analysis Template' 
            },
            { 
              type: 'update_field', 
              field: 'systemPrompt', 
              value: 'You are a helpful assistant specialized in programming.', 
              label: 'Programming Template' 
            }
          ]
        };
      } else {
        // Default response for unrecognized intents
        response = {
          role: 'assistant',
          content: "I'm here to help you create your agent. What would you like to configure? You can specify the name, description, avatar, model, functions, personality, or system prompt.",
          actions: [
            { type: 'suggest', value: 'name', label: 'Set agent name' },
            { type: 'suggest', value: 'description', label: 'Set description' },
            { type: 'suggest', value: 'avatar', label: 'Choose avatar' },
            { type: 'suggest', value: 'model', label: 'Select model' },
            { type: 'suggest', value: 'functions', label: 'Configure functions' },
            { type: 'suggest', value: 'personality', label: 'Define personality' },
            { type: 'suggest', value: 'prompt', label: 'Set system prompt' }
          ]
        };
      }
      
      setMessages(prev => [...prev, response]);
    }, 1000);
  };
  
  // Handle action buttons from assistant
  const handleAction = (action) => {
    if (action.type === 'update_field') {
      setFormData(prev => ({
        ...prev,
        [action.field]: action.value
      }));
      
      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: `I've updated the ${action.field} to "${action.value}". What else would you like to configure?`
        }
      ]);
    } else if (action.type === 'toggle_function') {
      const currentFunctions = formData.functions || [];
      const newFunctions = currentFunctions.includes(action.field)
        ? currentFunctions.filter(f => f !== action.field)
        : [...currentFunctions, action.field];
      
      setFormData(prev => ({
        ...prev,
        functions: newFunctions
      }));
      
      const actionTaken = currentFunctions.includes(action.field) ? 'disabled' : 'enabled';
      
      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: `I've ${actionTaken} the ${action.label} function. What else would you like to configure?`
        }
      ]);
    } else if (action.type === 'toggle_personality') {
      const currentTraits = formData.personality || [];
      const newTraits = currentTraits.includes(action.trait)
        ? currentTraits.filter(t => t !== action.trait)
        : [...currentTraits, action.trait];
      
      setFormData(prev => ({
        ...prev,
        personality: newTraits
      }));
      
      const actionTaken = currentTraits.includes(action.trait) ? 'removed' : 'added';
      
      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: `I've ${actionTaken} the ${action.trait} personality trait. What else would you like to configure?`
        }
      ]);
    } else if (action.type === 'save_changes') {
      saveChanges();
      
      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: "Great! I've saved your agent configuration. You can continue making changes or switch to the wizard interface for more detailed configuration."
        }
      ]);
    } else if (action.type === 'suggest') {
      // When user clicks a suggestion, simulate typing that suggestion
      setInput(action.value);
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className={`flex-none p-4 border-b ${darkMode ? 'border-neutral-700 bg-neutral-800' : 'border-gray-200 bg-white'}`}>
        <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Agent Creator Chat
        </h2>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div 
            key={index}
            className={`${message.role === 'user' 
              ? (darkMode ? 'bg-blue-900/30' : 'bg-blue-50') 
              : (darkMode ? 'bg-neutral-700/50' : 'bg-gray-50')
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

      {/* Chat Input */}
      <div className={`flex-none p-4 border-t ${darkMode ? 'border-neutral-700 bg-neutral-800' : 'border-gray-200 bg-white'}`}>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className={`flex-1 px-3 py-2 rounded-lg border ${
              darkMode 
                ? 'bg-neutral-700 border-neutral-600 text-white placeholder-neutral-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
          <button
            onClick={handleSendMessage}
            className={`px-4 py-2 rounded-lg ${
              darkMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentCreatorChat;
