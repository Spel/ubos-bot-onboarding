import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getFromStorage, saveToStorage } from '../utils/localStorage';
import { STORAGE_KEYS } from '../utils/localStorage';
import { getAllTemplates, getTemplateById } from '../utils/templateData';
import { addBot } from '../utils/botsData';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const CreateAgent = () => {
  const navigate = useNavigate();
  const { templateId } = useParams();
  const [darkMode, setDarkMode] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [agent, setAgent] = useState({
    name: '',
    description: '',
    prompt: '',
    isActive: true
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

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

  // Load dark mode from local storage
  useEffect(() => {
    const isDarkMode = getFromStorage(STORAGE_KEYS.DARK_MODE, false);
    setDarkMode(isDarkMode);
  }, []);

  // Load templates and set selected template if templateId is provided
  useEffect(() => {
    const allTemplates = getAllTemplates();
    setTemplates(allTemplates);
    
    if (templateId) {
      const template = getTemplateById(parseInt(templateId));
      if (template) {
        setSelectedTemplate(template);
        setAgent(prev => ({
          ...prev,
          name: `${template.name}`,
          description: template.description,
          prompt: template.samplePrompt,
          framework: template.framework,
          hourlyRate: template.hourlyRate
        }));
      }
    }
  }, [templateId]);

  // Handle template selection
  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setAgent(prev => ({
      ...prev,
      name: `${template.name}`,
      description: template.description,
      prompt: template.samplePrompt,
      framework: template.framework,
      hourlyRate: template.hourlyRate
    }));
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAgent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Move to next step
  const nextStep = () => {
    if (currentStep === 1 && !selectedTemplate) {
      alert('Please select a template to continue');
      return;
    }
    
    if (currentStep === 2 && (!agent.name || !agent.description)) {
      alert('Please fill in all required fields');
      return;
    }
    
    setCurrentStep(prev => prev + 1);
  };

  // Move to previous step
  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Map template complexity to bot type
    let botType = 'support'; // default
    if (selectedTemplate.complexity === 'high') {
      botType = 'content';
    } else if (selectedTemplate.complexity === 'medium') {
      botType = 'sales';
    }

    // Create new bot object
    const newBot = {
      name: agent.name,
      description: agent.description,
      type: botType,
      status: 'active',
      avatar: selectedTemplate.icon,
      averageTpuConsumption: Math.round(selectedTemplate.hourlyRate * 1000), // Convert hourly rate to TPU consumption
      prompt: agent.prompt,
      framework: selectedTemplate.framework
    };
    
    // Add the bot using the addBot function from botsData.js
    try {
      addBot(newBot);
      
      // Navigate to My Bots page after successful creation
      setTimeout(() => {
        navigate('/my-bots');
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error creating bot:', error);
      setIsLoading(false);
      alert('There was an error creating your bot. Please try again.');
    }
  };

  // Get framework badge color
  const getFrameworkColor = (framework) => {
    switch (framework) {
      case 'UBOS.ai':
        return darkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800';
      case 'Langflow':
        return darkMode ? 'bg-purple-800 text-purple-200' : 'bg-purple-100 text-purple-800';
      case 'Crew.ai':
        return darkMode ? 'bg-orange-800 text-orange-200' : 'bg-orange-100 text-orange-800';
      default:
        return darkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800';
    }
  };

  // Get complexity badge color
  const getComplexityColor = (complexity) => {
    switch (complexity) {
      case 'low':
        return darkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800';
      case 'medium':
        return darkMode ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-800';
      case 'high':
        return darkMode ? 'bg-purple-800 text-purple-200' : 'bg-purple-100 text-purple-800';
      default:
        return darkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-neutral-900' : 'bg-gray-50'}`}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <Sidebar darkMode={darkMode} />
      <div style={{ paddingLeft: '16rem', paddingTop: '61px' }}>
        <main className="w-full overflow-y-auto p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Create AI Agent</h1>
            <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {currentStep === 1 ? 'Select a template to get started' : 
               currentStep === 2 ? 'Configure your AI agent' : 
               'Review and create your AI agent'}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  currentStep >= 1 
                    ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white') 
                    : (darkMode ? 'bg-neutral-700 text-gray-400' : 'bg-gray-200 text-gray-600')
                }`}>
                  1
                </div>
                <div className={`ml-2 text-sm font-medium ${
                  currentStep >= 1 
                    ? (darkMode ? 'text-white' : 'text-gray-900') 
                    : (darkMode ? 'text-gray-500' : 'text-gray-500')
                }`}>
                  Select Template
                </div>
              </div>
              <div className={`flex-1 h-0.5 mx-4 ${
                darkMode ? 'bg-neutral-700' : 'bg-gray-200'
              }`}></div>
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  currentStep >= 2 
                    ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white') 
                    : (darkMode ? 'bg-neutral-700 text-gray-400' : 'bg-gray-200 text-gray-600')
                }`}>
                  2
                </div>
                <div className={`ml-2 text-sm font-medium ${
                  currentStep >= 2 
                    ? (darkMode ? 'text-white' : 'text-gray-900') 
                    : (darkMode ? 'text-gray-500' : 'text-gray-500')
                }`}>
                  Configure Agent
                </div>
              </div>
              <div className={`flex-1 h-0.5 mx-4 ${
                darkMode ? 'bg-neutral-700' : 'bg-gray-200'
              }`}></div>
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  currentStep >= 3 
                    ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white') 
                    : (darkMode ? 'bg-neutral-700 text-gray-400' : 'bg-gray-200 text-gray-600')
                }`}>
                  3
                </div>
                <div className={`ml-2 text-sm font-medium ${
                  currentStep >= 3 
                    ? (darkMode ? 'text-white' : 'text-gray-900') 
                    : (darkMode ? 'text-gray-500' : 'text-gray-500')
                }`}>
                  Review & Create
                </div>
              </div>
            </div>
          </div>

          {/* Step 1: Template Selection */}
          {currentStep === 1 && (
            <div>
              {/* Template Selection */}
              {!selectedTemplate ? (
                <div>
                  <div className="mb-4">
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Select a Template
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {templates.map((template) => (
                        <div 
                          key={template.id}
                          onClick={() => handleTemplateSelect(template)}
                          className={`${
                            darkMode ? 'bg-neutral-800 border-neutral-700 hover:bg-neutral-750' : 'bg-white border-gray-200 hover:bg-gray-50'
                          } border rounded-xl shadow-sm p-4 cursor-pointer transition-colors duration-200`}
                        >
                          <div className="flex items-start mb-3">
                            <span className="text-2xl mr-3">{template.icon}</span>
                            <div>
                              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{template.name}</h3>
                              <div className="flex flex-wrap gap-1 mt-1">
                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getComplexityColor(template.complexity)}`}>
                                  {template.complexity.charAt(0).toUpperCase() + template.complexity.slice(1)}
                                </span>
                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getFrameworkColor(template.framework)}`}>
                                  {template.framework}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className={`text-sm mb-2 line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {template.description}
                          </p>
                          <div className="mt-2">
                            <div className="flex justify-between items-center mb-1">
                              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Hourly Rate</span>
                              <span className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                ${template.hourlyRate.toFixed(2)}/hr
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-4">
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Selected Template
                    </label>
                    <div className={`${
                      darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200'
                    } border rounded-xl shadow-sm p-6`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <span className="text-3xl mr-3">{selectedTemplate.icon}</span>
                          <div>
                            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedTemplate.name}</h3>
                            <div className="flex flex-wrap gap-1 mt-1">
                              <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getComplexityColor(selectedTemplate.complexity)}`}>
                                {selectedTemplate.complexity.charAt(0).toUpperCase() + selectedTemplate.complexity.slice(1)}
                              </span>
                              <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getFrameworkColor(selectedTemplate.framework)}`}>
                                {selectedTemplate.framework}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => setSelectedTemplate(null)}
                          className={`text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                          Change
                        </button>
                      </div>
                      
                      <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {selectedTemplate.description}
                      </p>
                      
                      <div className="mb-4">
                        <h4 className={`text-xs font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>KEY FEATURES</h4>
                        <ul className="space-y-1">
                          {selectedTemplate.features.map((feature, index) => (
                            <li key={index} className={`text-sm flex items-start ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              <svg className={`h-4 w-4 mt-0.5 mr-2 flex-shrink-0 ${darkMode ? 'text-green-400' : 'text-green-500'}`} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Hourly Rate</span>
                          <span className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            ${selectedTemplate.hourlyRate.toFixed(2)}/hr
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                          <div 
                            className="bg-blue-600 h-1.5 rounded-full" 
                            style={{ width: `${Math.min(100, (selectedTemplate.hourlyRate / 0.50) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Configure Agent */}
          {currentStep === 2 && (
            <div className={`${darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200'} border rounded-xl shadow-sm p-6`}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Agent Name*
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={agent.name}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      darkMode 
                        ? 'bg-neutral-700 border-neutral-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Description*
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows="3"
                    value={agent.description}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      darkMode 
                        ? 'bg-neutral-700 border-neutral-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    required
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="prompt" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Initial Prompt
                  </label>
                  <textarea
                    name="prompt"
                    id="prompt"
                    rows="6"
                    value={agent.prompt}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      darkMode 
                        ? 'bg-neutral-700 border-neutral-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                  ></textarea>
                  <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    This prompt will be used to initialize the AI agent. You can modify it to customize the agent's behavior.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Framework
                    </label>
                    <div className={`mt-1 py-2 px-3 rounded-md ${darkMode ? 'bg-neutral-700' : 'bg-gray-100'}`}>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getFrameworkColor(selectedTemplate.framework)}`}>
                        {selectedTemplate.framework}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Hourly Rate
                    </label>
                    <div className={`mt-1 py-2 px-3 rounded-md ${darkMode ? 'bg-neutral-700' : 'bg-gray-100'}`}>
                      <span className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        ${selectedTemplate.hourlyRate.toFixed(2)}/hr
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review & Create */}
          {currentStep === 3 && (
            <div className={`${darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200'} border rounded-xl shadow-sm p-6`}>
              <div className="space-y-6">
                <div>
                  <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Review Your AI Agent</h3>
                  <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Please review the details of your AI agent before creating it.
                  </p>
                </div>
                
                <div className="border-t border-b py-4 grid grid-cols-1 md:grid-cols-2 gap-6 ${darkMode ? 'border-neutral-700' : 'border-gray-200'}">
                  <div>
                    <h4 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Agent Details</h4>
                    
                    <div className="space-y-3">
                      <div>
                        <span className={`block text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Name</span>
                        <span className={`block ${darkMode ? 'text-white' : 'text-gray-900'}`}>{agent.name}</span>
                      </div>
                      
                      <div>
                        <span className={`block text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Description</span>
                        <span className={`block text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{agent.description}</span>
                      </div>
                      
                      <div className="flex space-x-4">
                        <div>
                          <span className={`block text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Framework</span>
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getFrameworkColor(selectedTemplate.framework)}`}>
                            {selectedTemplate.framework}
                          </span>
                        </div>
                        
                        <div>
                          <span className={`block text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Hourly Rate</span>
                          <span className={`block ${darkMode ? 'text-white' : 'text-gray-900'}`}>${selectedTemplate.hourlyRate.toFixed(2)}/hr</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Template</h4>
                    
                    <div className="flex items-start">
                      <span className="text-2xl mr-3">{selectedTemplate.icon}</span>
                      <div>
                        <span className={`block font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedTemplate.name}</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getComplexityColor(selectedTemplate.complexity)}`}>
                            {selectedTemplate.complexity.charAt(0).toUpperCase() + selectedTemplate.complexity.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <span className={`block text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Key Features</span>
                      <ul className="mt-1 space-y-1">
                        {selectedTemplate.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className={`text-xs flex items-start ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            <svg className={`h-3 w-3 mt-0.5 mr-1 flex-shrink-0 ${darkMode ? 'text-green-400' : 'text-green-500'}`} viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Initial Prompt</h4>
                  <div className={`p-3 rounded-md text-sm ${darkMode ? 'bg-neutral-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                    {agent.prompt || <span className="text-gray-500 italic">No initial prompt specified</span>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className={`px-4 py-2 border rounded-md text-sm font-medium ${
                  darkMode 
                    ? 'border-neutral-600 bg-neutral-700 text-gray-300 hover:bg-neutral-600' 
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Back
              </button>
            ) : (
              <div></div>
            )}
            
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isLoading 
                    ? (darkMode ? 'bg-blue-800 cursor-not-allowed' : 'bg-blue-400 cursor-not-allowed')
                    : (darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700')
                } flex items-center`}
              >
                {isLoading && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                Create Agent
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateAgent;
