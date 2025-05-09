import React, { useState } from "react";

const PublishingTab = ({ 
  darkMode, 
  companyData, 
  setCompanyData
}) => {
  const [previewMode, setPreviewMode] = useState("desktop");
  
  // Toggle public visibility
  const handleTogglePublic = () => {
    setCompanyData(prev => ({
      ...prev,
      isPublic: !prev.isPublic
    }));
  };

  // Generate preview URL
  const getPreviewUrl = () => {
    const baseUrl = "company.ubos.tech/";
    return baseUrl + (companyData.publicUrl || "your-company");
  };

  return (
    <div className="space-y-6">
      {/* Publishing Controls */}
      <div className={`p-6 rounded-xl ${darkMode ? 'bg-neutral-800' : 'bg-white'} shadow-sm`}>
        <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Publishing Controls</h2>
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Public Visibility
            </h3>
            <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Make your company page visible to the public
            </p>
          </div>
          <div className="flex items-center">
            <button
              onClick={handleTogglePublic}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                companyData.isPublic
                  ? (darkMode ? 'bg-green-600' : 'bg-green-500')
                  : (darkMode ? 'bg-neutral-600' : 'bg-gray-300')
              }`}
            >
              <span 
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  companyData.isPublic ? 'translate-x-6' : 'translate-x-1'
                }`} 
              />
            </button>
            <span className={`ml-2 text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              {companyData.isPublic ? 'Public' : 'Private'}
            </span>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-neutral-700' : 'bg-gray-50'}`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className={`text-md font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Public URL
            </h3>
            <button 
              onClick={() => navigator.clipboard.writeText(`https://${getPreviewUrl()}`)}
              className={`px-3 py-1 rounded-lg text-xs ${
                darkMode 
                  ? 'bg-neutral-600 hover:bg-neutral-500 text-gray-200' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              Copy URL
            </button>
          </div>
          <div className={`flex items-center p-2 rounded-lg ${darkMode ? 'bg-neutral-800' : 'bg-white'}`}>
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>https://</span>
            <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{getPreviewUrl()}</span>
          </div>
        </div>
      </div>
      
      {/* Preview Section */}
      <div className={`p-6 rounded-xl ${darkMode ? 'bg-neutral-800' : 'bg-white'} shadow-sm`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Preview</h2>
          
          {/* Device Toggle */}
          <div className={`flex p-1 rounded-lg ${darkMode ? 'bg-neutral-700' : 'bg-gray-100'}`}>
            <button
              onClick={() => setPreviewMode("desktop")}
              className={`px-3 py-1 rounded-lg text-sm ${
                previewMode === "desktop"
                  ? (darkMode ? 'bg-neutral-600 text-white' : 'bg-white text-gray-800 shadow-sm')
                  : (darkMode ? 'text-gray-400' : 'text-gray-600')
              }`}
            >
              Desktop
            </button>
            <button
              onClick={() => setPreviewMode("mobile")}
              className={`px-3 py-1 rounded-lg text-sm ${
                previewMode === "mobile"
                  ? (darkMode ? 'bg-neutral-600 text-white' : 'bg-white text-gray-800 shadow-sm')
                  : (darkMode ? 'text-gray-400' : 'text-gray-600')
              }`}
            >
              Mobile
            </button>
          </div>
        </div>
        
        {/* Preview Frame */}
        <div className="flex justify-center p-4">
          <div 
            className={`border ${darkMode ? 'border-neutral-700' : 'border-gray-200'} rounded-lg overflow-hidden shadow-lg`}
            style={{
              width: previewMode === "desktop" ? '100%' : '375px',
              height: '500px'
            }}
          >
            {/* Preview Content */}
            <div className={`h-full ${darkMode ? 'bg-neutral-900' : 'bg-white'}`}>
              {/* Header */}
              <div className={`p-4 border-b ${darkMode ? 'border-neutral-800 bg-neutral-900' : 'border-gray-200 bg-white'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{companyData.logo || '🏢'}</span>
                    <span className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {companyData.name || 'Your Company'}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button className={`px-3 py-1 rounded-lg text-sm ${darkMode ? 'bg-neutral-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                      Services
                    </button>
                    <button className={`px-3 py-1 rounded-lg text-sm ${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}`}>
                      Chat
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Hero Section */}
              <div className={`p-6 ${darkMode ? 'bg-neutral-800' : 'bg-blue-50'}`}>
                <div className="max-w-3xl mx-auto text-center">
                  <h1 className={`text-2xl md:text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {companyData.name || 'Your Company'} - AI-Powered Solutions
                  </h1>
                  <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {companyData.description || 'We provide intelligent AI solutions to help your business grow.'}
                  </p>
                  <button className={`px-6 py-2 rounded-lg font-medium ${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}`}>
                    Get Started
                  </button>
                </div>
              </div>
              
              {/* Services Section */}
              <div className="p-6">
                <h2 className={`text-xl font-bold mb-4 text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Our Services
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {companyData.services && companyData.services.length > 0 ? (
                    companyData.services.slice(0, 4).map(service => (
                      <div 
                        key={service.id}
                        className={`p-4 rounded-lg ${darkMode ? 'bg-neutral-800' : 'bg-white'} ${darkMode ? 'border border-neutral-700' : 'shadow-sm'}`}
                      >
                        <h3 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{service.name}</h3>
                        <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{service.description}</p>
                        <div className="flex items-center justify-between">
                          <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {service.currency === 'USD' ? '$' : service.currency}
                            {service.price}
                            {service.billingCycle !== 'oneTime' ? `/${service.billingCycle.substring(0, 2)}` : ''}
                          </span>
                          <button className={`text-sm px-3 py-1 rounded-lg ${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}`}>
                            Learn More
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      {[1, 2, 3, 4].map(i => (
                        <div 
                          key={i}
                          className={`p-4 rounded-lg ${darkMode ? 'bg-neutral-800' : 'bg-white'} ${darkMode ? 'border border-neutral-700' : 'shadow-sm'}`}
                        >
                          <h3 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Service {i}</h3>
                          <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            This is a sample service description. Add real services to see them here.
                          </p>
                          <div className="flex items-center justify-between">
                            <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>$99/mo</span>
                            <button className={`text-sm px-3 py-1 rounded-lg ${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}`}>
                              Learn More
                            </button>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mt-4">
          <a 
            href={`https://${getPreviewUrl()}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`px-4 py-2 rounded-lg ${
              darkMode 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            } transition-colors text-sm font-medium`}
          >
            Open Full Preview
          </a>
        </div>
      </div>
      
      {/* SEO Settings */}
      <div className={`p-6 rounded-xl ${darkMode ? 'bg-neutral-800' : 'bg-white'} shadow-sm`}>
        <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>SEO Settings</h2>
        
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Meta Title
            </label>
            <input
              type="text"
              placeholder={`${companyData.name || 'Your Company'} - AI-Powered Solutions`}
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-neutral-700 border-neutral-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Meta Description
            </label>
            <textarea
              rows="2"
              placeholder={companyData.description || 'We provide intelligent AI solutions to help your business grow.'}
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-neutral-700 border-neutral-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Keywords (comma separated)
            </label>
            <input
              type="text"
              placeholder="AI company, autonomous agents, AI services"
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-neutral-700 border-neutral-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button
            className={`px-4 py-2 rounded-lg ${
              darkMode 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            } transition-colors text-sm font-medium`}
          >
            Save SEO Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublishingTab;
