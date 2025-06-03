/**
 * Authentication Module - Centralized authentication management
 * 
 * This module integrates Agentspace authentication with OpenWebUI authentication
 * and provides a consistent API for handling user authentication across the app.
 */
import { getFromStorage, saveToStorage, removeFromStorage, STORAGE_KEYS, clearAuthData } from './localStorage';
import { 
  signIn as openWebUISignIn, 
  createUser as openWebUICreateUser,
  isAuthenticated as openWebUIIsAuthenticated,
  getAuthToken,
  storeToken,
  clearAuthToken,
  getUserById
} from './openWebUIApi';

// Event names for auth state changes
export const AUTH_EVENTS = {
  SIGNED_IN: 'auth:signed_in',
  SIGNED_OUT: 'auth:signed_out',
  AUTH_ERROR: 'auth:error',
  SESSION_EXPIRED: 'auth:session_expired',
  USER_UPDATED: 'auth:user_updated'
};

// Auth event bus for pub/sub pattern
const authEventBus = {
  listeners: {},
  
  // Subscribe to auth events
  subscribe(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    };
  },
  
  // Publish auth event
  publish(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }
};

/**
 * Sign in a user with OpenWebUI credentials
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User data
 */
export const signIn = async (email, password) => {
  try {
    console.log('Signing in with OpenWebUI:', email);
    
    // Call OpenWebUI signIn
    const userData = await openWebUISignIn(email, password);
    
    // Store user data in localStorage for app use
    saveToStorage(STORAGE_KEYS.USER_EMAIL, email);
    saveToStorage(STORAGE_KEYS.EMAIL, email); // For compatibility
    saveToStorage(STORAGE_KEYS.USER_NAME, userData.name || email.split('@')[0]);
    saveToStorage(STORAGE_KEYS.IS_AUTHENTICATED, true);
    
    // Store additional user info if available
    if (userData.id) {
      saveToStorage(STORAGE_KEYS.USER_PROFILE, {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        profile_image_url: userData.profile_image_url,
      });
    }
    
    // Publish auth event
    authEventBus.publish(AUTH_EVENTS.SIGNED_IN, userData);
    
    return userData;
  } catch (error) {
    console.error('Sign in failed:', error);
    
    // Publish auth error event
    authEventBus.publish(AUTH_EVENTS.AUTH_ERROR, { 
      message: error.message || 'Sign in failed', 
      error 
    });
    
    throw error;
  }
};

/**
 * Sign up a new user
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} name - User name
 * @param {string} [profileImageUrl] - Optional profile image URL
 * @returns {Promise<Object>} New user data
 */
export const signUp = async (email, password, name, profileImageUrl = "") => {
  try {
    console.log('Creating new user in OpenWebUI:', email);
    
    // Call OpenWebUI createUser
    const userData = await openWebUICreateUser(email, password, name, profileImageUrl);
    
    // Store user data in localStorage for app use
    saveToStorage(STORAGE_KEYS.USER_EMAIL, email);
    saveToStorage(STORAGE_KEYS.EMAIL, email); // For compatibility
    saveToStorage(STORAGE_KEYS.USER_NAME, name || email.split('@')[0]);
    saveToStorage(STORAGE_KEYS.IS_AUTHENTICATED, true);
    
    // Store additional user info if available
    if (userData.id) {
      saveToStorage(STORAGE_KEYS.USER_PROFILE, {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        profile_image_url: userData.profile_image_url,
      });
    }
    
    // Publish auth event
    authEventBus.publish(AUTH_EVENTS.SIGNED_IN, userData);
    
    return userData;
  } catch (error) {
    console.error('Sign up failed:', error);
    
    // Publish auth error event
    authEventBus.publish(AUTH_EVENTS.AUTH_ERROR, { 
      message: error.message || 'Sign up failed', 
      error 
    });
    
    throw error;
  }
};

/**
 * Sign out the current user
 * @returns {Promise<boolean>} Success status
 */
export const signOut = async () => {
  try {
    console.log('Signing out user');
    
    // Clear OpenWebUI auth token
    clearAuthToken();
    
    // Clear app auth data
    clearAuthData();
    
    // Publish auth event
    authEventBus.publish(AUTH_EVENTS.SIGNED_OUT);
    
    return true;
  } catch (error) {
    console.error('Sign out failed:', error);
    return false;
  }
};

/**
 * Check if a user is authenticated
 * @returns {Promise<boolean>} Authentication status
 */
export const checkAuth = async () => {
  try {
    // Check local authentication flag first for quick response
    const isLocallyAuthenticated = getFromStorage(STORAGE_KEYS.IS_AUTHENTICATED, false);
    
    // If not authenticated locally, no need to check with server
    if (!isLocallyAuthenticated) {
      return false;
    }
    
    // Check authentication with OpenWebUI
    const isAuthValid = await openWebUIIsAuthenticated();
    
    if (!isAuthValid) {
      // If server says not authenticated but we have local data,
      // the session has expired - clear local auth data
      if (isLocallyAuthenticated) {
        clearAuthData();
        clearAuthToken();
        authEventBus.publish(AUTH_EVENTS.SESSION_EXPIRED);
      }
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Auth check failed:', error);
    return false;
  }
};

/**
 * Get current user data from local storage
 * @returns {Object|null} User data or null if not authenticated
 */
export const getCurrentUser = () => {
  try {
    const isAuthenticated = getFromStorage(STORAGE_KEYS.IS_AUTHENTICATED, false);
    if (!isAuthenticated) {
      return null;
    }
    
    const userProfile = getFromStorage(STORAGE_KEYS.USER_PROFILE, null);
    if (userProfile) {
      return userProfile;
    }
    
    // Fallback to basic user data
    return {
      email: getFromStorage(STORAGE_KEYS.USER_EMAIL, ''),
      name: getFromStorage(STORAGE_KEYS.USER_NAME, ''),
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Get current user data from OpenWebUI API
 * @returns {Promise<Object|null>} User data or null if not authenticated
 */
export const fetchCurrentUser = async () => {
  try {
    const userProfile = getFromStorage(STORAGE_KEYS.USER_PROFILE, null);
    if (!userProfile || !userProfile.id) {
      return null;
    }
    
    const userData = await getUserById(userProfile.id);
    
    // Update stored profile
    saveToStorage(STORAGE_KEYS.USER_PROFILE, userData);
    
    // Publish user updated event
    authEventBus.publish(AUTH_EVENTS.USER_UPDATED, userData);
    
    return userData;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
};

/**
 * Update user password
 * @param {string} oldPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<boolean>} Success status
 */
export const updatePassword = async (oldPassword, newPassword) => {
  try {
    // This would need to be implemented in openWebUIApi.js
    throw new Error('Password update not implemented');
  } catch (error) {
    console.error('Password update failed:', error);
    throw error;
  }
};

/**
 * Subscribe to authentication state changes
 * @param {string} event - Event name from AUTH_EVENTS
 * @param {Function} callback - Callback function
 * @returns {Function} Unsubscribe function
 */
export const onAuthStateChanged = (event, callback) => {
  return authEventBus.subscribe(event, callback);
};

/**
 * Initialize authentication system
 * This should be called at app startup
 */
export const initializeAuth = async () => {
  try {
    console.log('Initializing auth system');
    await checkAuth();
    return true;
  } catch (error) {
    console.error('Auth initialization failed:', error);
    return false;
  }
};

// Default export with all auth functions
export default {
  signIn,
  signUp,
  signOut,
  checkAuth,
  getCurrentUser,
  fetchCurrentUser,
  updatePassword,
  onAuthStateChanged,
  initializeAuth,
  AUTH_EVENTS,
};