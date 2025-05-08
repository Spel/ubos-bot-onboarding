import React, { useState } from "react";
import { updateBot } from "../../utils/botsData";

const CreatorTab = ({
  darkMode,
  formData,
  setFormData,
  bot,
  botId
}) => {
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardMode, setWizardMode] = useState('wizard'); // 'wizard' or 'chat'
  
  // Handle form field changes in wizard mode
  const handleWizardChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Save changes to the bot
  const saveChanges = () => {
    const updatedBot = {
      ...bot,
      ...formData
    };
    
    updateBot(botId, updatedBot);
  };
  
  // Render the purpose step content
  const renderPurposeStep = () => {
    return (
      <div className="step-content">
        <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Define Your Agent's Purpose
        </h3>
        
        <div className="space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              What will your agent do?
            </label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleWizardChange}
              placeholder="Describe your agent's main purpose and capabilities..."
              className={`w-full p-3 rounded-lg border ${
                darkMode 
                  ? 'bg-neutral-700 border-neutral-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              rows={4}
            />
            <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Be specific about what problems your agent will solve for users.
            </p>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Target audience
            </label>
            <select
              name="audience"
              value={formData.audience || ''}
              onChange={handleWizardChange}
              className={`w-full p-3 rounded-lg border ${
                darkMode 
                  ? 'bg-neutral-700 border-neutral-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="">Select target audience</option>
              <option value="general">General Users</option>
              <option value="business">Business Professionals</option>
              <option value="developers">Developers</option>
              <option value="students">Students</option>
              <option value="researchers">Researchers</option>
              <option value="creative">Creative Professionals</option>
            </select>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Agent personality
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {['Helpful', 'Friendly', 'Professional', 'Creative', 'Technical', 'Concise'].map(trait => (
                <label 
                  key={trait} 
                  className={`flex items-center p-3 rounded-lg border ${
                    formData.personality?.includes(trait)
                      ? (darkMode ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-300')
                      : (darkMode ? 'bg-neutral-700 border-neutral-600' : 'bg-white border-gray-300')
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.personality?.includes(trait) || false}
                    onChange={() => {
                      const currentTraits = formData.personality || [];
                      const newTraits = currentTraits.includes(trait)
                        ? currentTraits.filter(t => t !== trait)
                        : [...currentTraits, trait];
                      
                      setFormData(prev => ({
                        ...prev,
                        personality: newTraits
                      }));
                    }}
                    className="mr-2"
                  />
                  <span className={darkMode ? 'text-white' : 'text-gray-900'}>
                    {trait}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render the capabilities step content
  const renderCapabilitiesStep = () => {
    return (
      <div className="step-content">
        <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Configure Your Agent's Capabilities
        </h3>
        
        <div className="space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              LLM Model
            </label>
            <select
              name="model"
              value={formData.model || ''}
              onChange={handleWizardChange}
              className={`w-full p-3 rounded-lg border ${
                darkMode 
                  ? 'bg-neutral-700 border-neutral-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="">Select a model</option>
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              <option value="claude-3-opus">Claude 3 Opus</option>
              <option value="claude-3-sonnet">Claude 3 Sonnet</option>
              <option value="llama-3">Llama 3</option>
            </select>
            <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              More capable models may cost more but provide better results.
            </p>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              System Prompt
            </label>
            <div className="mb-2">
              <select
                name="promptTemplate"
                onChange={(e) => {
                  // This would populate the prompt textarea with a template
                  const templateValue = e.target.value;
                  if (templateValue) {
                    setFormData(prev => ({
                      ...prev,
                      systemPrompt: templateValue === 'custom' 
                        ? prev.systemPrompt 
                        : `You are a helpful assistant specialized in ${templateValue}.`
                    }));
                  }
                }}
                className={`w-full p-3 rounded-lg border ${
                  darkMode 
                    ? 'bg-neutral-700 border-neutral-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="">Select a template</option>
                <option value="customer support">Customer Support</option>
                <option value="content creation">Content Creation</option>
                <option value="data analysis">Data Analysis</option>
                <option value="programming">Programming Assistant</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <textarea
              name="systemPrompt"
              value={formData.systemPrompt || ''}
              onChange={handleWizardChange}
              placeholder="Enter instructions for your agent..."
              className={`w-full p-3 rounded-lg border ${
                darkMode 
                  ? 'bg-neutral-700 border-neutral-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              rows={6}
            />
            <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              The system prompt defines how your agent behaves and what capabilities it has.
            </p>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Agent Functions
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'web_search', name: 'Web Search' },
                { id: 'code_execution', name: 'Code Execution' },
                { id: 'data_analysis', name: 'Data Analysis' },
                { id: 'image_generation', name: 'Image Generation' },
                { id: 'file_management', name: 'File Management' },
                { id: 'api_calls', name: 'API Calls' }
              ].map(func => (
                <label 
                  key={func.id} 
                  className={`flex items-center p-3 rounded-lg border ${
                    formData.functions?.includes(func.id)
                      ? (darkMode ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-300')
                      : (darkMode ? 'bg-neutral-700 border-neutral-600' : 'bg-white border-gray-300')
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.functions?.includes(func.id) || false}
                    onChange={() => {
                      const currentFunctions = formData.functions || [];
                      const newFunctions = currentFunctions.includes(func.id)
                        ? currentFunctions.filter(f => f !== func.id)
                        : [...currentFunctions, func.id];
                      
                      setFormData(prev => ({
                        ...prev,
                        functions: newFunctions
                      }));
                    }}
                    className="mr-2"
                  />
                  <span className={darkMode ? 'text-white' : 'text-gray-900'}>
                    {func.name}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render the knowledge step content
  const renderKnowledgeStep = () => {
    return (
      <div className="step-content">
        <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Add Knowledge to Your Agent
        </h3>
        
        <div className="space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Knowledge Sources
            </label>
            <div className={`p-6 border-2 border-dashed rounded-lg text-center ${
              darkMode ? 'border-neutral-600 text-gray-400' : 'border-gray-300 text-gray-500'
            }`}>
              <div className="flex justify-center mb-3">
                <svg className="size-12 opacity-50" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              </div>
              <p className="mb-2">Drag and drop files here or click to browse</p>
              <p className="text-xs">Supported formats: PDF, DOCX, TXT, CSV, MD</p>
              <button className={`mt-4 px-4 py-2 rounded-lg ${
                darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
              }`}>
                Upload Files
              </button>
            </div>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Web Resources
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter a URL to add as a knowledge source"
                className={`flex-1 p-3 rounded-lg border ${
                  darkMode 
                    ? 'bg-neutral-700 border-neutral-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
              <button className={`px-4 py-2 rounded-lg ${
                darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
              }`}>
                Add
              </button>
            </div>
            <div className="mt-4">
              <div className={`p-4 rounded-lg ${
                darkMode ? 'bg-neutral-700' : 'bg-gray-100'
              }`}>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  No web resources added yet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render the publish step content
  const renderPublishStep = () => {
    return (
      <div className="step-content">
        <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Review and Publish Your Agent
        </h3>
        
        <div className="space-y-6">
          <div className={`p-6 rounded-lg ${darkMode ? 'bg-neutral-700' : 'bg-gray-100'}`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl">{formData.avatar || '🤖'}</div>
              <div>
                <h4 className={`text-xl font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {formData.name || 'Unnamed Agent'}
                </h4>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {formData.type && formData.type.charAt(0).toUpperCase() + formData.type.slice(1)}
                  {formData.framework && ` • ${formData.framework}`}
                </p>
              </div>
            </div>
            
            <div className="mb-4">
              <h5 className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Description
              </h5>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {formData.description || 'No description provided.'}
              </p>
            </div>
            
            {formData.personality?.length > 0 && (
              <div className="mb-4">
                <h5 className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Personality
                </h5>
                <div className="flex flex-wrap gap-2">
                  {formData.personality.map(trait => (
                    <span 
                      key={trait}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {formData.functions?.length > 0 && (
              <div className="mb-4">
                <h5 className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Functions
                </h5>
                <div className="flex flex-wrap gap-2">
                  {formData.functions.map(func => (
                    <span 
                      key={func}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        darkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {func.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <h5 className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Model
              </h5>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {formData.model || 'No model selected.'}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col space-y-4">
            <button 
              onClick={saveChanges}
              className={`w-full py-3 px-4 rounded-lg font-medium ${
                darkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Publish Agent
            </button>
            
            <button 
              className={`w-full py-3 px-4 rounded-lg font-medium ${
                darkMode ? 'bg-neutral-700 text-white hover:bg-neutral-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Save as Draft
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Chat-based creator component
  const AgentCreatorChat = () => {
    const [messages, setMessages] = useState([
      {
        role: 'assistant',
        content: "Hi! I'm the Agent Creator Assistant. I'll help you build your AI agent. Tell me about the agent you want to create."
      }
    ]);
    const [input, setInput] = useState('');
    
    const handleSendMessage = () => {
      if (!input.trim()) return;
      
      // Add user message
      const newMessages = [
        ...messages,
        { role: 'user', content: input }
      ];
      
      setMessages(newMessages);
      setInput('');
      
      // Simulate AI response (in a real app, this would call an API)
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { 
            role: 'assistant', 
            content: "I understand you want to create an agent that can help with that. Let me ask a few questions to get started...",
            // Could include suggested actions as structured data
            actions: [
              { type: 'update_name', value: 'Customer Support Bot', label: 'Set name: Customer Support Bot' },
              { type: 'update_description', value: 'Helps answer customer questions', label: 'Set description' }
            ]
          }
        ]);
      }, 1000);
    };
    
    // Handle action buttons from assistant
    const handleAction = (action) => {
      if (action.type === 'update_name') {
        setFormData(prev => ({ ...prev, name: action.value }));
      } else if (action.type === 'update_description') {
        setFormData(prev => ({ ...prev, description: action.value }));
      }
      // Handle other action types
    };
    
    return (
      <div className="flex flex-col h-[600px]">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div 
              key={index}
              className={`${message.role === 'user' 
                ? (darkMode ? 'bg-blue-900/30' : 'bg-blue-50') 
                : (darkMode ? 'bg-neutral-700' : 'bg-gray-100')
              } p-3 rounded-lg max-w-[80%] ${
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
                        darkMode ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {action.label || `Apply: ${action.value}`}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className={`p-4 border-t ${darkMode ? 'border-neutral-700' : 'border-gray-200'}`}>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Describe the agent you want to create..."
              className={`flex-1 p-2 rounded-lg ${
                darkMode 
                  ? 'bg-neutral-700 text-white border-neutral-600' 
                  : 'bg-white text-gray-900 border-gray-300'
              } border`}
            />
            <button
              onClick={handleSendMessage}
              className={`px-4 py-2 rounded-lg ${
                darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
              }`}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Agent Creator
        </h2>
        <p className={`mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Create your AI agent using our guided wizard or chat with our Agent Creator assistant.
        </p>
      </div>
      
      {/* Mode Selection */}
      <div className="flex mb-8 border rounded-lg overflow-hidden">
        <button 
          className={`flex-1 py-3 px-4 text-center ${wizardMode === 'wizard' 
            ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800') 
            : (darkMode ? 'bg-neutral-700 text-gray-300' : 'bg-gray-100 text-gray-600')}`}
          onClick={() => setWizardMode('wizard')}
        >
          No-Code Wizard
        </button>
        <button 
          className={`flex-1 py-3 px-4 text-center ${wizardMode === 'chat' 
            ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800') 
            : (darkMode ? 'bg-neutral-700 text-gray-300' : 'bg-gray-100 text-gray-600')}`}
          onClick={() => setWizardMode('chat')}
        >
          Chat with Agent Creator
        </button>
      </div>
      
      {/* Wizard Interface */}
      {wizardMode === 'wizard' && (
        <div className="wizard-interface">
          {/* Step indicator */}
          <div className="flex justify-between mb-8">
            {[1, 2, 3, 4].map(step => (
              <div 
                key={step} 
                className={`flex flex-col items-center ${step <= wizardStep ? 'opacity-100' : 'opacity-50'}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  step < wizardStep 
                    ? (darkMode ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800')
                    : step === wizardStep
                      ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800')
                      : (darkMode ? 'bg-neutral-700 text-gray-300' : 'bg-gray-100 text-gray-600')
                }`}>
                  {step < wizardStep ? '✓' : step}
                </div>
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {step === 1 && 'Purpose'}
                  {step === 2 && 'Capabilities'}
                  {step === 3 && 'Knowledge'}
                  {step === 4 && 'Publish'}
                </span>
              </div>
            ))}
          </div>
          
          {/* Step content */}
          {wizardStep === 1 && renderPurposeStep()}
          {wizardStep === 2 && renderCapabilitiesStep()}
          {wizardStep === 3 && renderKnowledgeStep()}
          {wizardStep === 4 && renderPublishStep()}
          
          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            <button 
              className={`px-4 py-2 rounded ${
                darkMode ? 'bg-neutral-700 text-white hover:bg-neutral-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
              onClick={() => setWizardStep(Math.max(1, wizardStep - 1))}
              disabled={wizardStep === 1}
            >
              Previous
            </button>
            <button 
              className={`px-4 py-2 rounded ${
                darkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
              onClick={() => {
                if (wizardStep === 4) {
                  saveChanges();
                } else {
                  setWizardStep(Math.min(4, wizardStep + 1));
                }
              }}
            >
              {wizardStep === 4 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      )}
      
      {/* Chat Interface */}
      {wizardMode === 'chat' && <AgentCreatorChat />}
    </div>
  );
};

export default CreatorTab;
