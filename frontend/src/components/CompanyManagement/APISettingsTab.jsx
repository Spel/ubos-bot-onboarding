import React, { useState } from "react";

const APISettingsTab = ({ 
  darkMode, 
  companyData, 
  setCompanyData
}) => {
  const [newApiKey, setNewApiKey] = useState({
    id: "",
    name: "",
    key: "",
    createdAt: "",
    lastUsed: null,
    permissions: ["read"]
  });
  
  const [newWebhook, setNewWebhook] = useState({
    id: "",
    name: "",
    url: "",
    events: ["message.created"],
    isActive: true
  });
  
  const [activeSection, setActiveSection] = useState("apiKeys");

  // Generate a random API key
  const generateApiKey = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let key = "sk_live_";
    for (let i = 0; i < 24; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  };

  // Handle API key form input changes
  const handleApiKeyChange = (e) => {
    const { name, value } = e.target;
    setNewApiKey(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle API key permission changes
  const handlePermissionChange = (permission) => {
    setNewApiKey(prev => {
      const permissions = [...prev.permissions];
      
      if (permissions.includes(permission)) {
        return {
          ...prev,
          permissions: permissions.filter(p => p !== permission)
        };
      } else {
        return {
          ...prev,
          permissions: [...permissions, permission]
        };
      }
    });
  };

  // Add new API key
  const handleAddApiKey = (e) => {
    e.preventDefault();
    
    const id = Date.now().toString();
    const key = generateApiKey();
    const createdAt = new Date().toISOString();
    
    setCompanyData(prev => ({
      ...prev,
      apiKeys: [...prev.apiKeys, { 
        ...newApiKey, 
        id, 
        key, 
        createdAt 
      }]
    }));
    
    // Reset form
    setNewApiKey({
      id: "",
      name: "",
      key: "",
      createdAt: "",
      lastUsed: null,
      permissions: ["read"]
    });
  };

  // Delete API key
  const handleDeleteApiKey = (index) => {
    const updatedApiKeys = [...companyData.apiKeys];
    updatedApiKeys.splice(index, 1);
    
    setCompanyData(prev => ({
      ...prev,
      apiKeys: updatedApiKeys
    }));
  };

  // Handle webhook form input changes
  const handleWebhookChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewWebhook(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle webhook event changes
  const handleEventChange = (event) => {
    setNewWebhook(prev => {
      const events = [...prev.events];
      
      if (events.includes(event)) {
        return {
          ...prev,
          events: events.filter(e => e !== event)
        };
      } else {
        return {
          ...prev,
          events: [...events, event]
        };
      }
    });
  };

  // Add new webhook
  const handleAddWebhook = (e) => {
    e.preventDefault();
    
    const id = Date.now().toString();
    
    setCompanyData(prev => ({
      ...prev,
      webhookEndpoints: [...prev.webhookEndpoints, { 
        ...newWebhook, 
        id
      }]
    }));
    
    // Reset form
    setNewWebhook({
      id: "",
      name: "",
      url: "",
      events: ["message.created"],
      isActive: true
    });
  };

  // Delete webhook
  const handleDeleteWebhook = (index) => {
    const updatedWebhooks = [...companyData.webhookEndpoints];
    updatedWebhooks.splice(index, 1);
    
    setCompanyData(prev => ({
      ...prev,
      webhookEndpoints: updatedWebhooks
    }));
  };

  // Toggle A2A protocol
  const handleToggleA2A = () => {
    setCompanyData(prev => ({
      ...prev,
      a2aEnabled: !prev.a2aEnabled
    }));
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Section Tabs */}
      <div className={`p-4 rounded-xl ${darkMode ? 'bg-neutral-800' : 'bg-white'} shadow-sm`}>
        <div className="flex space-x-4 border-b pb-3 mb-4">
          <button
            onClick={() => setActiveSection("apiKeys")}
            className={`py-2 px-4 font-medium text-sm rounded-lg ${
              activeSection === "apiKeys"
                ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                : (darkMode ? 'text-gray-400 hover:bg-neutral-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600')
            }`}
          >
            API Keys
          </button>
          <button
            onClick={() => setActiveSection("webhooks")}
            className={`py-2 px-4 font-medium text-sm rounded-lg ${
              activeSection === "webhooks"
                ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                : (darkMode ? 'text-gray-400 hover:bg-neutral-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600')
            }`}
          >
            Webhooks
          </button>
          <button
            onClick={() => setActiveSection("a2a")}
            className={`py-2 px-4 font-medium text-sm rounded-lg ${
              activeSection === "a2a"
                ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                : (darkMode ? 'text-gray-400 hover:bg-neutral-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600')
            }`}
          >
            A2A Protocol
          </button>
        </div>
        
        {/* API Keys Section */}
        {activeSection === "apiKeys" && (
          <div>
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>API Keys</h2>
            
            {/* API Keys List */}
            {companyData.apiKeys.length > 0 ? (
              <div className="overflow-x-auto mb-6">
                <table className={`min-w-full divide-y ${darkMode ? 'divide-neutral-700' : 'divide-gray-200'}`}>
                  <thead>
                    <tr>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Name</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Key</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Created</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Last Used</th>
                      <th className={`px-6 py-3 text-right text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${darkMode ? 'divide-neutral-700' : 'divide-gray-200'}`}>
                    {companyData.apiKeys.map((apiKey, index) => (
                      <tr key={apiKey.id}>
                        <td className="px-6 py-4">
                          <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{apiKey.name}</div>
                          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {apiKey.permissions.join(', ')}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <code className={`text-xs font-mono ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              {apiKey.key.substring(0, 10)}...
                            </code>
                            <button 
                              onClick={() => navigator.clipboard.writeText(apiKey.key)}
                              className={`ml-2 p-1 rounded-md ${darkMode ? 'hover:bg-neutral-700' : 'hover:bg-gray-100'}`}
                              title="Copy to clipboard"
                            >
                              <svg className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {formatDate(apiKey.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {formatDate(apiKey.lastUsed)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleDeleteApiKey(index)}
                            className={`text-red-500 hover:text-red-700 ${darkMode ? 'hover:text-red-400' : 'hover:text-red-600'}`}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={`text-center py-8 mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No API keys created yet. Add your first API key below.
              </div>
            )}
            
            {/* Add API Key Form */}
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-neutral-700' : 'bg-gray-50'}`}>
              <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Create New API Key
              </h3>
              
              <form onSubmit={handleAddApiKey}>
                <div className="space-y-4">
                  {/* API Key Name */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Key Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={newApiKey.name}
                      onChange={handleApiKeyChange}
                      required
                      className={`w-full px-3 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-neutral-600 border-neutral-500 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="e.g., Production API Key"
                    />
                  </div>
                  
                  {/* Permissions */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Permissions
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {["read", "write", "admin"].map(permission => (
                        <label key={permission} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={newApiKey.permissions.includes(permission)}
                            onChange={() => handlePermissionChange(permission)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className={`ml-2 text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            {permission.charAt(0).toUpperCase() + permission.slice(1)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    type="submit"
                    className={`px-4 py-2 rounded-lg ${
                      darkMode 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    } transition-colors text-sm font-medium`}
                  >
                    Generate API Key
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Webhooks Section */}
        {activeSection === "webhooks" && (
          <div>
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Webhook Endpoints</h2>
            
            {/* Webhooks List */}
            {companyData.webhookEndpoints.length > 0 ? (
              <div className="overflow-x-auto mb-6">
                <table className={`min-w-full divide-y ${darkMode ? 'divide-neutral-700' : 'divide-gray-200'}`}>
                  <thead>
                    <tr>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Name</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>URL</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Events</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Status</th>
                      <th className={`px-6 py-3 text-right text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${darkMode ? 'divide-neutral-700' : 'divide-gray-200'}`}>
                    {companyData.webhookEndpoints.map((webhook, index) => (
                      <tr key={webhook.id}>
                        <td className="px-6 py-4">
                          <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{webhook.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`text-sm font-mono ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {webhook.url}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {webhook.events.map(event => (
                              <span 
                                key={event}
                                className={`px-2 py-1 text-xs rounded-full ${
                                  darkMode ? 'bg-neutral-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {event}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            webhook.isActive
                              ? (darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800')
                              : (darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-800')
                          }`}>
                            {webhook.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleDeleteWebhook(index)}
                            className={`text-red-500 hover:text-red-700 ${darkMode ? 'hover:text-red-400' : 'hover:text-red-600'}`}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={`text-center py-8 mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No webhook endpoints created yet. Add your first webhook below.
              </div>
            )}
            
            {/* Add Webhook Form */}
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-neutral-700' : 'bg-gray-50'}`}>
              <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Add Webhook Endpoint
              </h3>
              
              <form onSubmit={handleAddWebhook}>
                <div className="space-y-4">
                  {/* Webhook Name */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Webhook Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={newWebhook.name}
                      onChange={handleWebhookChange}
                      required
                      className={`w-full px-3 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-neutral-600 border-neutral-500 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="e.g., Message Notifications"
                    />
                  </div>
                  
                  {/* Webhook URL */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Webhook URL
                    </label>
                    <input
                      type="url"
                      name="url"
                      value={newWebhook.url}
                      onChange={handleWebhookChange}
                      required
                      className={`w-full px-3 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-neutral-600 border-neutral-500 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="https://example.com/webhook"
                    />
                  </div>
                  
                  {/* Events */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Events
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "message.created", 
                        "message.updated", 
                        "service.purchased", 
                        "service.canceled",
                        "agent.assigned",
                        "agent.unassigned"
                      ].map(event => (
                        <label key={event} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={newWebhook.events.includes(event)}
                            onChange={() => handleEventChange(event)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className={`ml-2 text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            {event}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  {/* Active Status */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      id="isActive"
                      checked={newWebhook.isActive}
                      onChange={handleWebhookChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className={`ml-2 block text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Webhook is active
                    </label>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    type="submit"
                    className={`px-4 py-2 rounded-lg ${
                      darkMode 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    } transition-colors text-sm font-medium`}
                  >
                    Add Webhook
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* A2A Protocol Section */}
        {activeSection === "a2a" && (
          <div>
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>A2A Protocol Settings</h2>
            
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-neutral-700' : 'bg-gray-50'} mb-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Enable Agent-to-Agent Communication
                  </h3>
                  <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Allow your company's agents to communicate with other agents using the A2A protocol.
                  </p>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={handleToggleA2A}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      companyData.a2aEnabled
                        ? (darkMode ? 'bg-blue-600' : 'bg-blue-500')
                        : (darkMode ? 'bg-neutral-600' : 'bg-gray-300')
                    }`}
                  >
                    <span 
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        companyData.a2aEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`} 
                    />
                  </button>
                  <span className={`ml-2 text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    {companyData.a2aEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-neutral-700' : 'bg-gray-50'}`}>
              <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                A2A Protocol Documentation
              </h3>
              <p className={`mb-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                The Agent-to-Agent (A2A) protocol allows AI agents to communicate with each other, enabling complex workflows and delegated tasks.
              </p>
              
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-neutral-800' : 'bg-white'} font-mono text-xs overflow-x-auto`}>
                <pre className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
{`// Example A2A communication
{
  "sender": {
    "agent_id": "agent_123",
    "company_id": "${companyData.name || 'your_company'}"
  },
  "recipient": {
    "agent_id": "agent_456",
    "company_id": "external_company"
  },
  "message": {
    "type": "request",
    "content": "Please provide the latest sales data",
    "metadata": {
      "priority": "high",
      "requires_response": true
    }
  }
}`}
                </pre>
              </div>
              
              <div className="mt-4">
                <a 
                  href="#" 
                  className={`text-sm font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}
                >
                  View full A2A protocol documentation →
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default APISettingsTab;
