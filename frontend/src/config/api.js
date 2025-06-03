/**
 * API Configuration Settings
 * 
 * This file contains centralized configuration for API endpoints, 
 * including CORS settings and environment-specific configurations.
 */

// Base API settings
const API_CONFIG = {
  // Base URL for OpenWebUI API - update this to match your OpenWebUI instance
  baseUrl: 'http://localhost:8000',
  apiPath: '/api/v1',
  
  // CORS settings
  cors: {
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  },
  
  // Timeout settings (in milliseconds)
  timeout: 30000,
  
  // Retry settings
  retry: {
    attempts: 1,
    delay: 1000
  }
};

/**
 * Get the full API configuration for the current environment
 * @returns {Object} Complete API configuration
 */
export const getApiConfig = () => {
  // Check if we're in a production environment
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Override settings based on environment
  return {
    ...API_CONFIG,
    // Production overrides if needed
    ...(isProduction ? {
      // Override production settings here
    } : {})
  };
};

/**
 * Get the complete URL for a specific API endpoint
 * @param {string} endpoint - API endpoint path (without leading slash)
 * @returns {string} Full API URL
 */
export const getApiUrl = (endpoint) => {
  const config = getApiConfig();
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${config.baseUrl}${config.apiPath}${path}`;
};

/**
 * Get default fetch options with proper CORS and credentials configuration
 * @param {Object} additionalOptions - Additional fetch options to merge
 * @returns {Object} Configured fetch options
 */
export const getFetchOptions = (additionalOptions = {}) => {
  const config = getApiConfig();
  
  return {
    mode: config.cors.mode,
    credentials: config.cors.credentials,
    headers: { ...config.cors.headers },
    ...additionalOptions,
  };
};

export default {
  getApiConfig,
  getApiUrl,
  getFetchOptions
};