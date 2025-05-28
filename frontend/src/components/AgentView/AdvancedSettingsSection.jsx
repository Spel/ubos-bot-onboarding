import React, { useState, useEffect } from "react";
import { updateBot } from "../../utils/botsData";

export function AdvancedSettingsSection({ darkMode, bot }) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [integrationData, setIntegrationData] = useState({
    agentType: bot?.agentType || "simple",
    ubosIntegration: bot?.ubosIntegration || {
      enabled: false,
      apiEndpoint: "",
      webhookUrl: "",
      apiKey: "",
      healthCheckEndpoint: "",
      status: "disconnected"
    }
  });
  const [isHealthCheckLoading, setIsHealthCheckLoading] = useState(false);
  const [healthCheckStatus, setHealthCheckStatus] = useState(null);
  
  // Load integration data from bot if available
  useEffect(() => {
    if (bot?.ubosIntegration) {
      setIntegrationData(prev => ({
        ...prev,
        agentType: bot.agentType || "simple",
        ubosIntegration: {
          ...prev.ubosIntegration,
          ...bot.ubosIntegration
        }
      }));
    }
  }, [bot]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "agentType") {
      setIntegrationData(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setIntegrationData(prev => ({
        ...prev,
        ubosIntegration: {
          ...prev.ubosIntegration,
          [name]: value
        }
      }));
    }
  };

  // Handle toggle for UBOS integration
  const handleToggleUbosIntegration = () => {
    setIntegrationData(prev => ({
      ...prev,
      ubosIntegration: {
        ...prev.ubosIntegration,
        enabled: !prev.ubosIntegration.enabled
      }
    }));
  };

  // Simulate health check for the UBOS agent
  const performHealthCheck = () => {
    setIsHealthCheckLoading(true);
    setHealthCheckStatus(null);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const isSuccess = integrationData.ubosIntegration.healthCheckEndpoint && 
                       integrationData.ubosIntegration.apiEndpoint && 
                       integrationData.ubosIntegration.webhookUrl;
      
      setHealthCheckStatus({
        success: isSuccess,
        message: isSuccess ? "Agent is online and responding" : "Failed to connect to agent"
      });
      
      // Update status in integration data
      setIntegrationData(prev => ({
        ...prev,
        ubosIntegration: {
          ...prev.ubosIntegration,
          status: isSuccess ? "connected" : "disconnected"
        }
      }));
      
      setIsHealthCheckLoading(false);
    }, 2000);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Create updated bot object
    const updatedBot = {
      ...bot,
      agentType: integrationData.agentType,
      ubosIntegration: integrationData.ubosIntegration
    };
    
    // Update the bot
    try {
      updateBot(bot.id, updatedBot);
      setSaveSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating bot:', error);
      alert('There was an error updating your agent integration. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-2xl font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Advanced Settings
        </h2>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Configure advanced options for your agent
        </p>
      </div>
      
      {/* Agent Type Selection */}
      <div className={`p-6 rounded-xl ${darkMode ? 'bg-neutral-800' : 'bg-white'} shadow-sm`}>
        <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Agent Type
        </h2>
        
        <div className="mb-6">
          <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Choose how you want to create and manage your AI Agent:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Simple Agent Option */}
            <div 
              onClick={() => handleChange({ target: { name: 'agentType', value: 'simple' } })}
              className={`p-4 border rounded-xl cursor-pointer transition-all ${integrationData.agentType === 'simple' 
                ? (darkMode ? 'border-blue-500 bg-blue-900/20' : 'border-blue-500 bg-blue-50') 
                : (darkMode ? 'border-neutral-600 hover:border-neutral-500' : 'border-gray-200 hover:border-gray-300')}`}
            >
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 w-5 h-5 rounded-full border ${integrationData.agentType === 'simple' 
                  ? (darkMode ? 'border-blue-500 bg-blue-500' : 'border-blue-500 bg-blue-500') 
                  : (darkMode ? 'border-neutral-500' : 'border-gray-300')}`}>
                  {integrationData.agentType === 'simple' && (
                    <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Simple Agent</h3>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Create and manage your agent directly in Agentspace UI. Best for most use cases.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Advanced UBOS Agent Option */}
            <div 
              onClick={() => handleChange({ target: { name: 'agentType', value: 'ubos' } })}
              className={`p-4 border rounded-xl cursor-pointer transition-all ${integrationData.agentType === 'ubos' 
                ? (darkMode ? 'border-blue-500 bg-blue-900/20' : 'border-blue-500 bg-blue-50') 
                : (darkMode ? 'border-neutral-600 hover:border-neutral-500' : 'border-gray-200 hover:border-gray-300')}`}
            >
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 w-5 h-5 rounded-full border ${integrationData.agentType === 'ubos' 
                  ? (darkMode ? 'border-blue-500 bg-blue-500' : 'border-blue-500 bg-blue-500') 
                  : (darkMode ? 'border-neutral-500' : 'border-gray-300')}`}>
                  {integrationData.agentType === 'ubos' && (
                    <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Advanced UBOS Agent</h3>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Create a complex AI Agent on UBOS Platform with custom integrations and connect it to Agentspace.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* UBOS Platform Integration */}
      {integrationData.agentType === 'ubos' && (
        <div className={`p-6 rounded-xl ${darkMode ? 'bg-neutral-800' : 'bg-white'} shadow-sm`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              UBOS Platform Integration
            </h2>
            <div className="flex items-center">
              <span className={`mr-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {integrationData.ubosIntegration.enabled ? 'Enabled' : 'Disabled'}
              </span>
              <button 
                type="button"
                onClick={handleToggleUbosIntegration}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${integrationData.ubosIntegration.enabled 
                  ? (darkMode ? 'bg-blue-600' : 'bg-blue-500') 
                  : (darkMode ? 'bg-neutral-600' : 'bg-gray-300')}`}
              >
                <span 
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${integrationData.ubosIntegration.enabled ? 'translate-x-6' : 'translate-x-1'}`} 
                />
              </button>
            </div>
          </div>
          
          {integrationData.ubosIntegration.enabled && (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 mb-6">
                <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Connect your custom AI Agent created on UBOS Platform to Agentspace. You'll need to provide the necessary endpoints to establish the connection.
                </p>
                
                {/* API Endpoint */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    API Endpoint URL
                  </label>
                  <input
                    type="url"
                    name="apiEndpoint"
                    value={integrationData.ubosIntegration.apiEndpoint}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 rounded-lg border ${darkMode 
                      ? 'bg-neutral-700 border-neutral-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="https://your-agent-api.ubos.tech/api"
                  />
                  <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    The main API endpoint of your UBOS Agent that will receive requests from Agentspace
                  </p>
                </div>
                
                {/* Webhook URL */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Webhook URL
                  </label>
                  <input
                    type="url"
                    name="webhookUrl"
                    value={integrationData.ubosIntegration.webhookUrl}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 rounded-lg border ${darkMode 
                      ? 'bg-neutral-700 border-neutral-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="https://your-agent-webhook.ubos.tech/webhook"
                  />
                  <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Webhook URL where your UBOS Agent will send responses and events back to Agentspace
                  </p>
                </div>
                
                {/* API Key */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    API Key
                  </label>
                  <input
                    type="password"
                    name="apiKey"
                    value={integrationData.ubosIntegration.apiKey}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 rounded-lg border ${darkMode 
                      ? 'bg-neutral-700 border-neutral-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Your UBOS Agent API Key"
                  />
                  <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    API Key for authenticating requests between Agentspace and your UBOS Agent
                  </p>
                </div>
                
                {/* Health Check Endpoint */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Health Check Endpoint
                  </label>
                  <input
                    type="url"
                    name="healthCheckEndpoint"
                    value={integrationData.ubosIntegration.healthCheckEndpoint}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 rounded-lg border ${darkMode 
                      ? 'bg-neutral-700 border-neutral-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="https://your-agent-api.ubos.tech/health"
                  />
                  <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Endpoint to check if your UBOS Agent is online and responding
                  </p>
                </div>
                
                {/* Connection Status and Health Check */}
                <div className={`mt-6 p-4 rounded-lg border ${darkMode ? 'border-neutral-600 bg-neutral-700/50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Connection Status
                      </h3>
                      <div className="flex items-center mt-1">
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${integrationData.ubosIntegration.status === 'connected' 
                          ? 'bg-green-500' 
                          : 'bg-red-500'}`} 
                        />
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {integrationData.ubosIntegration.status === 'connected' ? 'Connected' : 'Disconnected'}
                        </span>
                      </div>
                      {healthCheckStatus && (
                        <p className={`text-xs mt-1 ${healthCheckStatus.success 
                          ? (darkMode ? 'text-green-400' : 'text-green-600') 
                          : (darkMode ? 'text-red-400' : 'text-red-600')}`}>
                          {healthCheckStatus.message}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={performHealthCheck}
                      disabled={isHealthCheckLoading}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium ${darkMode 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-blue-500 hover:bg-blue-600 text-white'} disabled:opacity-50 transition-colors`}
                    >
                      {isHealthCheckLoading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Checking
                        </span>
                      ) : 'Check Connection'}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Documentation and Help */}
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-100'} mb-6`}>
                <h3 className={`font-medium mb-2 ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                  How to Create a UBOS Platform Agent
                </h3>
                <p className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-600'} mb-2`}>
                  Follow these steps to create and connect your custom AI Agent:
                </p>
                <ol className={`text-sm list-decimal list-inside ${darkMode ? 'text-blue-200' : 'text-blue-600'} space-y-1`}>
                  <li>Create your AI Agent on UBOS Platform using the AI Agent Stack SDK</li>
                  <li>Deploy your agent as a microservice on UBOS Platform</li>
                  <li>Configure the connection endpoints above to link your agent with Agentspace</li>
                  <li>Test the connection to ensure your agent is properly responding</li>
                </ol>
                <a 
                  href="https://docs.ubos.tech/ai-agents" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`inline-block mt-3 text-sm font-medium ${darkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-700'}`}
                >
                  View UBOS Platform Documentation →
                </a>
              </div>
              
              {/* Save Button */}
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  disabled={isSaving}
                  className={`px-4 py-2 rounded-lg font-medium ${darkMode 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'} disabled:opacity-50 transition-colors`}
                >
                  {isSaving ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving
                    </span>
                  ) : 'Save Integration'}
                </button>
                
                {saveSuccess && (
                  <span className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                    Integration settings saved successfully!
                  </span>
                )}
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
