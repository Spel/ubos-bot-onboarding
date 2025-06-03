/**
 * Utility functions for interacting with the Open WebUI API
 */
import { getFromStorage, saveToStorage, STORAGE_KEYS } from './localStorage';

// Default API configuration
const DEFAULT_API_CONFIG = {
  baseUrl: 'http://localhost:8000',
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
 * @param {string} [token] - Authentication token (optional if using stored token)
 * @param {boolean} [requireAuth=false] - Whether to require authentication
 * @returns {Promise<Object>} New user data
 */
export const createUser = async (email, password, name, profileImageUrl = "", token = null, requireAuth = false) => {
  try {
    const authToken = token || getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    } else if (requireAuth) {
      throw new Error('No authentication token available');
    }
    
    // First try the admin endpoint to add a user
    try {
      const response = await fetch(getApiUrl('/auths/add'), {
        method: 'POST',
        headers,
        body: JSON.stringify({
          email,
          password,
          name,
          profile_image_url: profileImageUrl || "", // Ensure profile_image_url is never null
          role: 'user' // Default role for new users
        }),
        credentials: 'include',
      });

      if (response.ok) {
        return await response.json();
      }
      
      // If admin endpoint fails with 403, we'll try the signup endpoint
      if (response.status === 403) {
        console.warn('Admin user creation failed, trying regular signup');
      } else {
        // For other errors, throw the error from the admin endpoint
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create user');
      }
    } catch (adminError) {
      // Only log the admin endpoint error for now
      console.error('Admin user creation error:', adminError);
      
      // For permission errors, we'll try the signup endpoint
      if (adminError.message.includes('permission') || adminError.message.includes('403')) {
        // Continue to signup endpoint
      } else {
        // Otherwise rethrow the admin endpoint error
        throw adminError;
      }
    }
    
    // Fallback to regular signup endpoint
    const signupResponse = await fetch(getApiUrl('/auths/signup'), {
      method: 'POST',
      headers,
      body: JSON.stringify({
        email,
        password,
        name,
        profile_image_url: profileImageUrl || "" // Ensure profile_image_url is never null
      }),
      credentials: 'include',
    });

    if (!signupResponse.ok) {
      const errorData = await signupResponse.json();
      throw new Error(errorData.detail || 'Failed to create user');
    }

    return await signupResponse.json();
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
export const clearAuthToken = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.OPEN_WEBUI_AUTH_TOKEN);
  } catch (error) {
    console.error('Error clearing token:', error);
  }
};

/**
 * Get the authentication token for API requests
 * @returns {string|null} The authentication token or null if not found
 */
export const getAuthToken = () => {
  return getStoredToken();
};

/**
 * Get all users (authentication is now optional)
 * @param {string} [token] - Authentication token (optional if using stored token)
 * @param {boolean} [requireAuth=false] - Whether to require authentication
 * @returns {Promise<Array>} List of users
 */
export const getUsers = async (token = null, requireAuth = false) => {
  try {
    const authToken = token || getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    } else if (requireAuth) {
      throw new Error('No authentication token available');
    }
    
    const response = await fetch(getApiUrl('/users'), {
      method: 'GET',
      headers,
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
 * @param {boolean} [requireAuth=false] - Whether to require authentication
 * @returns {Promise<Object>} User data
 */
export const getUserById = async (userId, token = null, requireAuth = false) => {
  try {
    const authToken = token || getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    } else if (requireAuth) {
      throw new Error('No authentication token available');
    }
    
    const response = await fetch(getApiUrl(`/users/${userId}`), {
      method: 'GET',
      headers,
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
 * @param {boolean} [requireAuth=false] - Whether to require authentication
 * @returns {Promise<Object>} Updated user data
 */
export const updateUser = async (userId, userData, token = null, requireAuth = false) => {
  try {
    const authToken = token || getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    } else if (requireAuth) {
      throw new Error('No authentication token available');
    }
    
    const response = await fetch(getApiUrl(`/users/${userId}`), {
      method: 'PUT',
      headers,
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
 * @param {boolean} [requireAuth=false] - Whether to require authentication
 * @returns {Promise<boolean>} True if deletion was successful
 */
export const deleteUser = async (userId, token = null, requireAuth = false) => {
  try {
    const authToken = token || getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    } else if (requireAuth) {
      throw new Error('No authentication token available');
    }
    
    const response = await fetch(getApiUrl(`/users/${userId}`), {
      method: 'DELETE',
      headers,
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
