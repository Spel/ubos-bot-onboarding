/**
 * Utility functions for interacting with the Open WebUI API
 */
import { getFromStorage, saveToStorage, STORAGE_KEYS } from './localStorage';

// Default API configuration
const DEFAULT_API_CONFIG = {
  baseUrl: 'http://localhost:8081',
  apiPath: '/api/v1'
};

/**
 * Get the full API URL
 * @param {string} endpoint - API endpoint path
 * @returns {string} Full API URL
 */
export const getApiUrl = (endpoint) => {
  const config = getApiConfig();
  return `${config.baseUrl}${config.apiPath}${endpoint}`;
};

/**
 * Get the API configuration
 * @returns {Object} API configuration
 */
export const getApiConfig = () => {
  return {
    baseUrl: getFromStorage(STORAGE_KEYS.OPEN_WEBUI_BASE_URL, DEFAULT_API_CONFIG.baseUrl),
    apiPath: getFromStorage(STORAGE_KEYS.OPEN_WEBUI_API_PATH, DEFAULT_API_CONFIG.apiPath)
  };
};

/**
 * Update the API configuration
 * @param {Object} config - New API configuration
 */
export const updateApiConfig = (config) => {
  if (config.baseUrl) {
    saveToStorage(STORAGE_KEYS.OPEN_WEBUI_BASE_URL, config.baseUrl);
  }
  if (config.apiPath) {
    saveToStorage(STORAGE_KEYS.OPEN_WEBUI_API_PATH, config.apiPath);
  }
};

/**
 * Sign in to Open WebUI
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Authentication response
 */
export const signIn = async (email, password) => {
  try {
    const response = await fetch(getApiUrl('/auths/signin'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include', // Include cookies in the request
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to sign in');
    }

    const data = await response.json();
    
    // Store the token for future use
    if (data.token) {
      storeToken(data.token);
    }
    
    return data;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

/**
 * Create a new user in Open WebUI
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} name - User name
 * @param {string} [profileImageUrl] - Optional profile image URL
 * @returns {Promise<Object>} New user data
 */
export const createUser = async (email, password, name, profileImageUrl = null) => {
  try {
    const response = await fetch(getApiUrl('/auths/signup'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        name,
        profile_image_url: profileImageUrl
      }),
      credentials: 'include', // Include cookies in the request
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to create user');
    }

    return await response.json();
  } catch (error) {
    console.error('Create user error:', error);
    throw error;
  }
};

/**
 * Get the stored API token
 * @returns {string|null} The stored API token or null if not found
 */
export const getStoredToken = () => {
  try {
    return getFromStorage(STORAGE_KEYS.OPEN_WEBUI_AUTH_TOKEN, null);
  } catch (error) {
    console.error('Error getting stored token:', error);
    return null;
  }
};

/**
 * Store the API token
 * @param {string} token - The API token to store
 */
export const storeToken = (token) => {
  try {
    saveToStorage(STORAGE_KEYS.OPEN_WEBUI_AUTH_TOKEN, token);
  } catch (error) {
    console.error('Error storing token:', error);
  }
};

/**
 * Clear the stored API token
 */
export const clearToken = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.OPEN_WEBUI_AUTH_TOKEN);
  } catch (error) {
    console.error('Error clearing token:', error);
  }
};

/**
 * Get all users (requires admin privileges)
 * @param {string} [token] - Authentication token (optional if using stored token)
 * @returns {Promise<Array>} List of users
 */
export const getUsers = async (token = null) => {
  try {
    const authToken = token || getAuthToken();
    if (!authToken) {
      throw new Error('No authentication token available');
    }
    
    const response = await fetch(getApiUrl('/users'), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies in the request
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to get users');
    }

    return await response.json();
  } catch (error) {
    console.error('Get users error:', error);
    throw error;
  }
};

/**
 * Get a specific user by ID
 * @param {string} userId - The ID of the user to retrieve
 * @param {string} [token] - Authentication token (optional if using stored token)
 * @returns {Promise<Object>} User data
 */
export const getUserById = async (userId, token = null) => {
  try {
    const authToken = token || getAuthToken();
    if (!authToken) {
      throw new Error('No authentication token available');
    }
    
    const response = await fetch(getApiUrl(`/users/${userId}`), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to get user');
    }

    return await response.json();
  } catch (error) {
    console.error('Get user error:', error);
    throw error;
  }
};

/**
 * Update a user
 * @param {string} userId - The ID of the user to update
 * @param {Object} userData - The user data to update
 * @param {string} [token] - Authentication token (optional if using stored token)
 * @returns {Promise<Object>} Updated user data
 */
export const updateUser = async (userId, userData, token = null) => {
  try {
    const authToken = token || getAuthToken();
    if (!authToken) {
      throw new Error('No authentication token available');
    }
    
    const response = await fetch(getApiUrl(`/users/${userId}`), {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to update user');
    }

    return await response.json();
  } catch (error) {
    console.error('Update user error:', error);
    throw error;
  }
};

/**
 * Delete a user
 * @param {string} userId - The ID of the user to delete
 * @param {string} [token] - Authentication token (optional if using stored token)
 * @returns {Promise<boolean>} True if deletion was successful
 */
export const deleteUser = async (userId, token = null) => {
  try {
    const authToken = token || getAuthToken();
    if (!authToken) {
      throw new Error('No authentication token available');
    }
    
    const response = await fetch(getApiUrl(`/users/${userId}`), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to delete user');
    }

    return true;
  } catch (error) {
    console.error('Delete user error:', error);
    throw error;
  }
};

/**
 * Test the connection to the Open WebUI API
 * @param {string} baseUrl - Base URL of the API
 * @param {string} apiPath - API path
 * @returns {Promise<boolean>} True if connection is successful
 */
export const testConnection = async (baseUrl, apiPath) => {
  try {
    // Temporarily update the API config for this request
    const originalConfig = getApiConfig();
    updateApiConfig({ baseUrl, apiPath });
    
    const response = await fetch(getApiUrl('/health'), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Restore original config
    updateApiConfig(originalConfig);
    
    return response.ok;
  } catch (error) {
    console.error('Test connection error:', error);
    throw error;
  }
};

/**
 * Check if user is authenticated with Open WebUI
 * @param {string} [token] - Authentication token (optional if using stored token)
 * @returns {Promise<boolean>} True if authenticated
 */
export const isAuthenticated = async (token = null) => {
  try {
    const authToken = token || getStoredToken();
    if (!authToken) {
      return false;
    }
    
    const response = await fetch(getApiUrl('/auths/session'), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies in the request
    });

    return response.ok;
  } catch (error) {
    console.error('Authentication check error:', error);
    return false;
  }
};
