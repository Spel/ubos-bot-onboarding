import React, { useState } from "react";
import { Button } from "../ui/button";
import { Save, Settings, User, Mail, Phone } from "lucide-react";
import { updateBot } from "../../utils/botsData";
import { Link } from "react-router-dom";

export function GeneralSettingsSection({ darkMode, bot }) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Form data state
  const [formData, setFormData] = useState({
    name: bot?.name || "",
    description: bot?.description || "",
    model: bot?.model || "gpt-4",
    visibility: bot?.visibility || "private-link",  // New field for granular visibility
    isPublic: bot?.isPublic || false,
    avatar: bot?.avatar || "🤖",
    type: bot?.type || "support",
    status: bot?.status || "active",
    domain: bot?.domain || "",
    email: bot?.email || "",
    phoneNumber: bot?.phoneNumber || "",
    whatsApp: bot?.whatsApp || "",
    linkedin: bot?.linkedin || ""
  });
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    // Update formData based on input changes
    if (name === 'visibility') {
      // Update isPublic based on visibility selection
      setFormData(prev => ({
        ...prev,
        [name]: newValue,
        isPublic: newValue === 'public-review'
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: newValue
      }));
    }
  };

  // Handle avatar selection
  const handleAvatarSelect = (avatar) => {
    setFormData(prev => ({
      ...prev,
      avatar
    }));
  };
  
  // Handle form submission
  const handleSave = () => {
    setIsSaving(true);
    
    // Create updated bot object
    const updatedBot = {
      ...bot,
      ...formData
    };
    
    // Update the bot
    try {
      // Save the bot data using the updateBot function
      updateBot(bot.id, updatedBot);
      console.log("Saving general settings:", updatedBot);
      
      setSaveSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating bot:', error);
      alert('There was an error updating your bot. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-full mx-auto space-y-6">
      {/* Basic Information Section */}
      <div className={`p-6 rounded-xl ${darkMode ? 'bg-neutral-800' : 'bg-white'} shadow-sm`}>
       
        
        <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'} flex items-center`}>
          <User className={`h-5 w-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'} mr-2`} />
          Basic Information
        </h2>
        
        <div className="space-y-6">
          {/* Avatar Selection and Bot Type */}
          <div className="flex flex-col md:flex-row md:items-start md:gap-6">
            {/* Avatar Selection */}
            <div className="md:w-1/2">
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Avatar
              </label>
              <div className="flex flex-wrap gap-3">
                {["🤖", "🧠", "🦾", "👨‍💻", "👩‍💻", "🧑‍💼", "👨‍💼", "👩‍💼", "🧙‍♂️", "🧙‍♀️"].map(avatar => (
                  <button
                    key={avatar}
                    type="button"
                    onClick={() => handleAvatarSelect(avatar)}
                    className={`w-10 h-10 text-xl flex items-center justify-center rounded-lg ${
                      formData.avatar === avatar 
                        ? (darkMode ? 'bg-blue-600' : 'bg-blue-500') 
                        : (darkMode ? 'bg-neutral-700 hover:bg-neutral-600' : 'bg-gray-100 hover:bg-gray-200')
                    }`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Bot Type */}
            <div className="md:w-1/2 mt-4 md:mt-0">
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Bot Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border ${
                  darkMode 
                    ? 'bg-neutral-900 border-neutral-700 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-1 focus:ring-blue-500 outline-none transition-colors`}
              >
                <option value="support">Support</option>
                <option value="sales">Sales</option>
                <option value="content">Content</option>
              </select>
            </div>
          </div>
          
          {/* Name */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={`w-full p-3 rounded-lg border ${
                darkMode 
                  ? 'bg-neutral-900 border-neutral-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-1 focus:ring-blue-500 outline-none transition-colors`}
              placeholder="Enter bot name"
            />
          </div>
          
          {/* Description */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className={`w-full p-3 rounded-lg border ${
                darkMode 
                  ? 'bg-neutral-900 border-neutral-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-1 focus:ring-blue-500 outline-none transition-colors`}
              placeholder="Describe what your agent does"
            />
          </div>
          
          {/* Status */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Status
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="status"
                  value="active"
                  checked={formData.status === "active"}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className={darkMode ? 'text-gray-200' : 'text-gray-700'}>Active</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="status"
                  value="inactive"
                  checked={formData.status === "inactive"}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className={darkMode ? 'text-gray-200' : 'text-gray-700'}>Inactive</span>
              </label>
            </div>
          </div>
          

        </div>
      </div>

      {/* Visibility Settings */}
      <div className={`p-6 rounded-xl ${darkMode ? 'bg-neutral-800' : 'bg-white'} shadow-sm`}>
        <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'} flex items-center`}>
          <Settings className={`h-5 w-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'} mr-2`} />
          Visibility Settings
        </h2>
        
        <div className="space-y-4">
          {/* Visibility Options */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Sharing & visibility
            </label>
            <div className={`relative border ${darkMode ? 'border-neutral-700' : 'border-gray-300'} rounded-lg`}>
              <select
                name="visibility"
                value={formData.visibility}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg appearance-none ${
                  darkMode 
                    ? 'bg-neutral-900 text-white' 
                    : 'bg-white text-gray-900'
                } focus:ring-1 focus:ring-blue-500 outline-none transition-colors`}
              >
                <option value="private-link">Private (Anyone with the link)</option>
                <option value="private-only-me">Private (Only me)</option>
                <option value="private-company">Specific Company</option>
                <option value="public-review">Public (requires review)</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {formData.visibility === 'private-link' && 'Anyone with the link can access this agent'}
              {formData.visibility === 'private-only-me' && 'Only you can access this agent'}
              {formData.visibility === 'private-company' && 'Only members of your company can access this agent'}
              {formData.visibility === 'public-review' && 'This agent will be publicly available after review'}
            </p>
          </div>
          
          {/* Bot URL */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Bot name (32 characters max, no spaces)
            </label>
            <div className={`w-full p-1 rounded-lg border ${
              darkMode 
                ? 'bg-neutral-900 border-neutral-700 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            } focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500`}>
              <input
                type="text"
                name="domain"
                value={formData.domain}
                onChange={handleChange}
                className={`w-full p-2 rounded-lg ${
                  darkMode 
                    ? 'bg-neutral-900 text-white' 
                    : 'bg-white text-gray-900'
                } outline-none transition-colors border-none`}
                placeholder="Enter a bot name (i.e. mybot)"
                maxLength={32}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                  </svg>
                  https://{formData.domain ? `${formData.domain}.ubos.bot` : 'yourbot.ubos.bot'}
                </span>
              </p>
              <Link 
                to={bot?.url || `/bot/${formData.domain.toLowerCase().replace(/\s+/g, '-')}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
              >
                View Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contact Information */}
      <div className={`p-6 rounded-xl ${darkMode ? 'bg-neutral-800' : 'bg-white'} shadow-sm`}>
        <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'} flex items-center`}>
          <Mail className={`h-5 w-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'} mr-2`} />
          Contact Information
        </h2>
        
        <div className="space-y-4">
          {/* Email */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg border ${
                darkMode 
                  ? 'bg-neutral-900 border-neutral-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-1 focus:ring-blue-500 outline-none transition-colors`}
              placeholder="Enter email address"
            />
          </div>
          
          {/* Phone Number */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Phone Number
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg border ${
                darkMode 
                  ? 'bg-neutral-900 border-neutral-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-1 focus:ring-blue-500 outline-none transition-colors`}
              placeholder="Enter phone number"
            />
          </div>
          
          {/* WhatsApp */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              WhatsApp
            </label>
            <input
              type="text"
              name="whatsApp"
              value={formData.whatsApp}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg border ${
                darkMode 
                  ? 'bg-neutral-900 border-neutral-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-1 focus:ring-blue-500 outline-none transition-colors`}
              placeholder="Enter WhatsApp handle"
            />
          </div>
          
          {/* LinkedIn */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              LinkedIn
            </label>
            <input
              type="text"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg border ${
                darkMode 
                  ? 'bg-neutral-900 border-neutral-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-1 focus:ring-blue-500 outline-none transition-colors`}
              placeholder="Enter LinkedIn profile"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className={`p-6 rounded-xl ${darkMode ? 'bg-neutral-800' : 'bg-white'} shadow-sm`}>
        <div className="flex items-center justify-end gap-4">
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
          
          {saveSuccess && (
            <span className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
              Changes saved successfully!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}