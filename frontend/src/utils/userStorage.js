import { getFromStorage, saveToStorage, STORAGE_KEYS } from './localStorage';

/**
 * User and profile data management
 */

// Default user profile
const defaultUserProfile = {
  name: '',
  email: '',
  company: '',
  role: '',
  avatar: null,
  createdAt: new Date().toISOString(),
  lastLogin: new Date().toISOString(),
  preferences: {
    notifications: true,
    emailUpdates: true,
    darkMode: false
  }
};

// Default user settings
const defaultUserSettings = {
  language: 'en',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h'
};

/**
 * Initialize user data with defaults if not already set
 */
export const initUserData = () => {
  // Initialize user profile
  if (!getFromStorage(STORAGE_KEYS.USER_PROFILE)) {
    saveToStorage(STORAGE_KEYS.USER_PROFILE, defaultUserProfile);
  }
  
  // Initialize user settings
  if (!getFromStorage(STORAGE_KEYS.USER_SETTINGS)) {
    saveToStorage(STORAGE_KEYS.USER_SETTINGS, defaultUserSettings);
  }
  
  // Initialize user preferences
  if (!getFromStorage(STORAGE_KEYS.USER_PREFERENCES)) {
    saveToStorage(STORAGE_KEYS.USER_PREFERENCES, defaultUserProfile.preferences);
  }
};

/**
 * Get user profile data
 * @returns {Object} User profile data
 */
export const getUserProfile = () => {
  return getFromStorage(STORAGE_KEYS.USER_PROFILE, defaultUserProfile);
};

/**
 * Update user profile data
 * @param {Object} profileData - Updated profile data
 * @returns {Object} Updated user profile
 */
export const updateUserProfile = (profileData) => {
  const currentProfile = getUserProfile();
  const updatedProfile = {
    ...currentProfile,
    ...profileData,
    updatedAt: new Date().toISOString()
  };
  
  saveToStorage(STORAGE_KEYS.USER_PROFILE, updatedProfile);
  
  // If email is updated, also update the email in auth data
  if (profileData.email) {
    saveToStorage(STORAGE_KEYS.USER_EMAIL, profileData.email);
    saveToStorage(STORAGE_KEYS.EMAIL, profileData.email); // For compatibility
  }
  
  return updatedProfile;
};

/**
 * Get user settings
 * @returns {Object} User settings
 */
export const getUserSettings = () => {
  return getFromStorage(STORAGE_KEYS.USER_SETTINGS, defaultUserSettings);
};

/**
 * Update user settings
 * @param {Object} settingsData - Updated settings data
 * @returns {Object} Updated user settings
 */
export const updateUserSettings = (settingsData) => {
  const currentSettings = getUserSettings();
  const updatedSettings = {
    ...currentSettings,
    ...settingsData
  };
  
  saveToStorage(STORAGE_KEYS.USER_SETTINGS, updatedSettings);
  return updatedSettings;
};

/**
 * Get user preferences
 * @returns {Object} User preferences
 */
export const getUserPreferences = () => {
  return getFromStorage(STORAGE_KEYS.USER_PREFERENCES, defaultUserProfile.preferences);
};

/**
 * Update user preferences
 * @param {Object} preferencesData - Updated preferences data
 * @returns {Object} Updated user preferences
 */
export const updateUserPreferences = (preferencesData) => {
  const currentPreferences = getUserPreferences();
  const updatedPreferences = {
    ...currentPreferences,
    ...preferencesData
  };
  
  saveToStorage(STORAGE_KEYS.USER_PREFERENCES, updatedPreferences);
  
  // If dark mode preference is updated, sync with dedicated dark mode setting
  if (preferencesData.hasOwnProperty('darkMode')) {
    saveToStorage(STORAGE_KEYS.DARK_MODE, preferencesData.darkMode);
  }
  
  return updatedPreferences;
};

/**
 * Update last login time
 */
export const updateLastLogin = () => {
  const profile = getUserProfile();
  profile.lastLogin = new Date().toISOString();
  saveToStorage(STORAGE_KEYS.USER_PROFILE, profile);
};

/**
 * Clear all user data (for logout)
 */
export const clearUserData = () => {
  saveToStorage(STORAGE_KEYS.USER_PROFILE, null);
  saveToStorage(STORAGE_KEYS.USER_SETTINGS, null);
  saveToStorage(STORAGE_KEYS.USER_PREFERENCES, null);
  saveToStorage(STORAGE_KEYS.IS_AUTHENTICATED, false);
  saveToStorage(STORAGE_KEYS.USER_EMAIL, '');
  saveToStorage(STORAGE_KEYS.EMAIL, '');
}; 