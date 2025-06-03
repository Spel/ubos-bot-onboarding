import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { getFromStorage, saveToStorage, STORAGE_KEYS } from "../utils/localStorage";
import OpenWebUIUserTable from "../components/OpenWebUIUserTable";
import OpenWebUIUserModal from "../components/OpenWebUIUserModal";
import OpenWebUIUserEditModal from "../components/OpenWebUIUserEditModal";
import OpenWebUILoginModal from "../components/OpenWebUILoginModal";
import { testConnection, isAuthenticated, clearAuthToken, getAuthToken, getApiConfig, updateApiConfig } from "../utils/openWebUIApi";

export default function UserManagement() {
  const [darkMode, setDarkMode] = useState(getFromStorage(STORAGE_KEYS.DARK_MODE, false));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false); // Changed to false to avoid initial loading state
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [openWebUIApiConfig, setOpenWebUIApiConfig] = useState(() => getApiConfig());
  const [connectionTestRunning, setConnectionTestRunning] = useState(false);
  const [connectionTestResult, setConnectionTestResult] = useState(null);

  // Check authentication status on mount and when API config changes
  useEffect(() => {
    checkAuthStatus();
  }, [openWebUIApiConfig]);

  // Check if user is authenticated with OpenWebUI - now only sets the state but doesn't affect functionality
  const checkAuthStatus = async () => {
    try {
      const token = getAuthToken();
      if (token) {
        const authStatus = await isAuthenticated();
        setIsAuthenticated(authStatus);
        setAuthError(null);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      setIsAuthenticated(false);
      setAuthError(err.message);
    }
  };

  // Handle API config changes
  const handleApiConfigChange = (e) => {
    const { name, value } = e.target;
    setOpenWebUIApiConfig(prev => {
      const updated = { ...prev, [name]: value };
      // Save to localStorage
      if (name === "baseUrl") {
        saveToStorage(STORAGE_KEYS.OPEN_WEBUI_BASE_URL, value);
      } else if (name === "apiPath") {
        saveToStorage(STORAGE_KEYS.OPEN_WEBUI_API_PATH, value);
      }
      
      // Update API config
      updateApiConfig(updated);
      
      return updated;
    });
  };

  // Test the connection to Open WebUI
  const handleTestConnection = async () => {
    setConnectionTestRunning(true);
    setConnectionTestResult(null);
    
    try {
      const success = await testConnection(
        openWebUIApiConfig.baseUrl,
        openWebUIApiConfig.apiPath
      );
      
      setConnectionTestResult({
        success,
        message: success 
          ? "Connection successful! API is accessible." 
          : "Connection failed. Please check the base URL and API path."
      });
    } catch (err) {
      setConnectionTestResult({
        success: false,
        message: `Connection error: ${err.message}`
      });
    } finally {
      setConnectionTestRunning(false);
    }
  };

  // Handle successful login
  const handleLoginSuccess = (authData) => {
    setIsAuthenticated(true);
    checkAuthStatus();
  };

  // Handle logout
  const handleLogout = () => {
    clearAuthToken();
    setIsAuthenticated(false);
  };

  // Handle opening the edit user modal
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditUserModal(true);
  };

  // Handle successful user creation or update
  const handleUserSuccess = () => {
    // This will trigger a refresh of the user table
    setShowAddUserModal(false);
    setShowEditUserModal(false);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-neutral-900' : 'bg-gray-50'}`}>
      {/* Page content */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            User Management
          </h1>
          <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Manage users for your application with OpenWebUI integration
          </p>
        </div>

        {/* API Configuration */}
        <div className={`${darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200'} border rounded-xl shadow-sm p-6 mb-6`}>
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            OpenWebUI Connection
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Base URL
              </label>
              <input
                type="text"
                name="baseUrl"
                value={openWebUIApiConfig.baseUrl}
                onChange={handleApiConfigChange}
                className={`w-full py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-neutral-700 text-white' : 'bg-white text-gray-900'} border ${darkMode ? 'border-neutral-600' : 'border-gray-300'}`}
                placeholder="http://localhost:8081"
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                API Path
              </label>
              <input
                type="text"
                name="apiPath"
                value={openWebUIApiConfig.apiPath}
                onChange={handleApiConfigChange}
                className={`w-full py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-neutral-700 text-white' : 'bg-white text-gray-900'} border ${darkMode ? 'border-neutral-600' : 'border-gray-300'}`}
                placeholder="/api/v1"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleTestConnection}
                disabled={connectionTestRunning}
                className={`py-2 px-4 rounded-lg ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors ${connectionTestRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {connectionTestRunning ? 'Testing...' : 'Test Connection'}
              </button>
            </div>
          </div>

          {connectionTestResult && (
            <div className={`mt-4 p-3 rounded-lg ${connectionTestResult.success ? (darkMode ? 'bg-green-900/20 text-green-300' : 'bg-green-100 text-green-800') : (darkMode ? 'bg-red-900/20 text-red-300' : 'bg-red-100 text-red-800')}`}>
              {connectionTestResult.message}
            </div>
          )}
        </div>
        
        {/* Authentication Status - Now just informational, not required */}
        <div className={`${darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200'} border rounded-xl shadow-sm p-6 mb-6`}>
          <div className="flex justify-between items-center">
            <div>
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Authentication Status
              </h2>
              <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {isAuthenticated ? 'You are authenticated with OpenWebUI' : 'Authentication is optional'}
              </p>
              {authError && (
                <p className="mt-2 text-red-500">
                  Error: {authError}
                </p>
              )}
            </div>
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'}`}>
                  Authenticated
                </span>
                <button
                  onClick={handleLogout}
                  className={`py-2 px-4 rounded-lg ${darkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white transition-colors text-sm`}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className={`py-2 px-4 rounded-lg ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
        
        {/* User Management Section - Now accessible without authentication */}
        <div className={`${darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200'} border rounded-xl shadow-sm p-6`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Users
            </h2>
            <button
              onClick={() => setShowAddUserModal(true)}
              className={`py-2 px-4 rounded-lg ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}
            >
              Add User
            </button>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${darkMode ? 'border-blue-500' : 'border-blue-600'}`}></div>
            </div>
          ) : (
            <OpenWebUIUserTable
              darkMode={darkMode}
              onEditUser={handleEditUser}
              onUserDeleted={() => {}} // Just refresh automatically
              onError={(message) => console.error(message)}
              onLoginRequired={() => setShowLoginModal(true)}
              skipAuthCheck={true} // New prop to skip authentication check
            />
          )}
        </div>
      </main>

      {/* Login Modal */}
      <OpenWebUILoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        darkMode={darkMode}
        onSuccess={handleLoginSuccess}
      />

      {/* Add User Modal */}
      <OpenWebUIUserModal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        darkMode={darkMode}
        onSuccess={handleUserSuccess}
      />

      {/* Edit User Modal */}
      <OpenWebUIUserEditModal
        isOpen={showEditUserModal}
        onClose={() => setShowEditUserModal(false)}
        darkMode={darkMode}
        user={selectedUser}
        onSuccess={handleUserSuccess}
      />
    </div>
  );
}