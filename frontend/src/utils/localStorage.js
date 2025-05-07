/**
 * Utility functions for working with localStorage
 */

// Keys for localStorage
export const STORAGE_KEYS = {
  USER_NAME: 'ubos_user_name',
  USER_EMAIL: 'ubos_user_email',
  EMAIL: 'ubos_email', // Added for compatibility with App.jsx
  IS_AUTHENTICATED: 'ubos_is_authenticated',
  DOMAIN: 'ubos_domain',
  DARK_MODE: 'ubos_dark_mode',
  USERS: 'ubos_users',
  BOTS: 'ubos_bots',
  BOT_SETTINGS: 'ubos_bot_settings',
  CHAT_HISTORY: 'ubos_chat_history',
  CREDITS: 'ubos_credits',
  // Additional data keys
  USER_SETTINGS: 'ubos_user_settings',
  USER_PROFILE: 'ubos_user_profile',
  DASHBOARD_DATA: 'ubos_dashboard_data',
  BOT_METRICS: 'ubos_bot_metrics',
  BOT_TEMPLATES: 'ubos_bot_templates',
  BOT_CATEGORIES: 'ubos_bot_categories',
  USER_PREFERENCES: 'ubos_user_preferences',
  NOTIFICATIONS: 'ubos_notifications',
  RECENT_ACTIVITIES: 'ubos_recent_activities',
  USAGE_STATISTICS: 'ubos_usage_statistics'
};

/**
 * Save data to localStorage
 * @param {string} key - Storage key
 * @param {any} data - Data to store (will be JSON stringified)
 */
export const saveToStorage = (key, data) => {
  try {
    console.log(`Saving to localStorage - Key: ${key}, Data:`, data);
    const jsonData = JSON.stringify(data);
    console.log('Stringified data:', jsonData);
    localStorage.setItem(key, jsonData);
    console.log('Successfully saved to localStorage');
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

/**
 * Get data from localStorage
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {any} - Parsed data or default value
 */
export const getFromStorage = (key, defaultValue = null) => {
  try {
    console.log(`Getting from localStorage - Key: ${key}`);
    const item = localStorage.getItem(key);
    console.log(`Raw item from localStorage:`, item);
    const result = item ? JSON.parse(item) : defaultValue;
    console.log(`Parsed result:`, result);
    return result;
  } catch (error) {
    console.error('Error getting from localStorage:', error);
    return defaultValue;
  }
};

/**
 * Remove data from localStorage
 * @param {string} key - Storage key to remove
 */
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing from localStorage:', error);
    return false;
  }
};

/**
 * Clear all app data from localStorage
 */
export const clearAllStorage = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

/**
 * Clear authentication data from localStorage
 * Useful for logout functionality
 */
export const clearAuthData = () => {
  try {
    console.log('Clearing authentication data from localStorage');
    saveToStorage(STORAGE_KEYS.IS_AUTHENTICATED, false);
    saveToStorage(STORAGE_KEYS.USER_EMAIL, '');
    saveToStorage(STORAGE_KEYS.EMAIL, '');
    console.log('Authentication data cleared');
    return true;
  } catch (error) {
    console.error('Error clearing authentication data:', error);
    return false;
  }
};
