import React, { useState } from "react";

const ProfileTab = ({ 
  darkMode, 
  companyData, 
  setCompanyData
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle logo selection
  const handleLogoSelect = (logo) => {
    setCompanyData(prev => ({
      ...prev,
      logo
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className={`p-6 rounded-xl ${darkMode ? 'bg-neutral-800' : 'bg-white'} shadow-sm`}>
        <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Company Profile</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Logo Selection */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Logo
              </label>
              <div className="flex flex-wrap gap-3">
                {["🏢", "🏭", "🏗️", "🏛️", "🏪", "🏬", "🏦", "🏨", "🏫", "🏥"].map(logo => (
                  <button
                    key={logo}
                    type="button"
                    onClick={() => handleLogoSelect(logo)}
                    className={`w-10 h-10 text-xl flex items-center justify-center rounded-lg ${
                      companyData.logo === logo 
                        ? (darkMode ? 'bg-blue-600' : 'bg-blue-500') 
                        : (darkMode ? 'bg-neutral-700 hover:bg-neutral-600' : 'bg-gray-100 hover:bg-gray-200')
                    }`}
                  >
                    {logo}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Public URL */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Public URL
              </label>
              <div className="flex items-center">
                <span className={`px-3 py-2 rounded-l-lg border-y border-l ${
                  darkMode 
                    ? 'bg-neutral-700 border-neutral-600 text-gray-300' 
                    : 'bg-gray-100 border-gray-300 text-gray-500'
                }`}>
                  company.ubos.tech/
                </span>
                <input
                  type="text"
                  name="publicUrl"
                  value={companyData.publicUrl}
                  onChange={handleChange}
                  className={`flex-1 px-3 py-2 rounded-r-lg border ${
                    darkMode 
                      ? 'bg-neutral-700 border-neutral-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="your-company-name"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {/* Company Name */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Company Name
              </label>
              <input
                type="text"
                name="name"
                value={companyData.name}
                onChange={handleChange}
                required
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-neutral-700 border-neutral-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter company name"
              />
            </div>
            
            {/* Description */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Description
              </label>
              <textarea
                name="description"
                value={companyData.description}
                onChange={handleChange}
                rows="3"
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-neutral-700 border-neutral-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Describe what your company does"
              />
            </div>
          </div>
          
          <div className="mt-6 flex items-center justify-end gap-3">
            {saveSuccess && (
              <span className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                Profile saved successfully!
              </span>
            )}
            <button
              type="submit"
              disabled={isSaving}
              className={`px-4 py-2 rounded-lg ${
                darkMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              } transition-colors text-sm font-medium flex items-center gap-2`}
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileTab;
