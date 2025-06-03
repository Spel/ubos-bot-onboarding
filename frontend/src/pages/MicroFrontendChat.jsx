import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFromStorage, STORAGE_KEYS } from '../utils/localStorage';
import { cn } from '../utils/cn';

/**
 * MicroFrontendChat component that integrates an external application
 * served from another origin as a microfrontend within an iframe.
 * 
 * @returns {JSX.Element} The MicroFrontendChat component
 */
export default function MicroFrontendChat() {
  const { botId } = useParams();
  const navigate = useNavigate();
  const iframeRef = useRef(null);
  
  // State management
  const [darkMode, setDarkMode] = useState(getFromStorage(STORAGE_KEYS.DARK_MODE, false));
  const [iframeState, setIframeState] = useState({
    isLoading: true,
    hasError: false,
    errorMessage: '',
  });
  
  // URL for the microfrontend - could be environment variable in production
  const microFrontendUrl = 'http://localhost:5050/';
  
  // Event handlers
  const handleIframeLoad = () => {
    setIframeState({
      isLoading: false,
      hasError: false,
      errorMessage: '',
    });
  };
  
  const handleIframeError = () => {
    setIframeState({
      isLoading: false,
      hasError: true,
      errorMessage: 'Failed to load the embedded application',
    });
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, JSON.stringify(newDarkMode));
  };

  const handleLogout = () => {
    // Clear all user-related data from storage
    [
      STORAGE_KEYS.USER_EMAIL,
      STORAGE_KEYS.USER_NAME,
      STORAGE_KEYS.AUTH_TOKEN
    ].forEach(key => localStorage.removeItem(key));
    
    // Redirect to login page
    navigate('/login');
  };
  
  // Communication with iframe
  const sendMessageToMicroFrontend = (message) => {
    if (!iframeRef.current?.contentWindow) return;
    
    try {
      iframeRef.current.contentWindow.postMessage(message, microFrontendUrl);
    } catch (error) {
      console.error('Failed to send message to microfrontend:', error);
    }
  };

  // Listen for messages from the microfrontend
  useEffect(() => {
    const handleMessage = (event) => {
      // Security check: only accept messages from the expected origin
      if (event.origin !== new URL(microFrontendUrl).origin) return;
      
      const { type, payload } = event.data || {};
      
      switch (type) {
        case 'THEME_CHANGE':
          // Handle theme change request from iframe
          if (payload?.darkMode !== undefined) {
            setDarkMode(payload.darkMode);
          }
          break;
          
        case 'NAVIGATION':
          // Handle navigation requests from iframe
          if (payload?.path) {
            navigate(payload.path);
          }
          break;
          
        case 'ERROR':
          // Handle error messages from iframe
          console.error('Error from microfrontend:', payload);
          break;
          
        default:
          // Log unhandled message types for debugging
          console.log('Message from microfrontend:', event.data);
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Cleanup event listener on component unmount
    return () => window.removeEventListener('message', handleMessage);
  }, [navigate, microFrontendUrl]);

  // Send theme information to the microfrontend when theme changes
  useEffect(() => {
    if (iframeState.isLoading || iframeState.hasError) return;
    
    sendMessageToMicroFrontend({
      type: 'THEME',
      payload: { darkMode }
    });
  }, [darkMode, iframeState.isLoading, iframeState.hasError]);

  // Send bot ID to the microfrontend when it loads
  useEffect(() => {
    if (iframeState.isLoading || iframeState.hasError || !botId) return;
    
    sendMessageToMicroFrontend({
      type: 'BOT_ID',
      payload: { botId }
    });
  }, [botId, iframeState.isLoading, iframeState.hasError]);

  // Ensure the iframe takes up the available space while respecting sidebar width
  return (
    <div className={cn(
      'h-screen overflow-hidden flex-grow',
      darkMode ? 'dark bg-gray-900' : 'bg-white'
    )}>
      {/* Main content area */}
      <div className="h-full w-full overflow-hidden relative">
            {/* Loading state */}
            {iframeState.isLoading && (
              <LoadingIndicator darkMode={darkMode} />
            )}
            
            {/* Error state */}
            {iframeState.hasError && (
              <ErrorDisplay 
                darkMode={darkMode}
                errorMessage={iframeState.errorMessage}
                microFrontendUrl={microFrontendUrl}
              />
            )}
            
            {/* The iframe itself */}
            <iframe
              ref={iframeRef}
              src={microFrontendUrl}
              className={cn(
                'absolute inset-0 border-none',
                iframeState.isLoading || iframeState.hasError ? 'hidden' : 'block'
              )}
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              title="Embedded Application"
              allow="microphone; camera"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                height: '100%',
                border: 'none',
                margin: 0,
                padding: 0,
                overflow: 'hidden',
                zIndex: 5,
                display: iframeState.isLoading || iframeState.hasError ? 'none' : 'block'
              }}
            />
      </div>
    </div>
  );
}

/**
 * Loading indicator component
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.darkMode - Whether dark mode is enabled
 * @returns {JSX.Element} The loading indicator component
 */
function LoadingIndicator({ darkMode }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-10">
      <div className="flex flex-col items-center">
        <div className="flex space-x-2 mb-4">
          {[0, 150, 300].map((delay) => (
            <div 
              key={delay}
              className={cn(
                'w-3 h-3 rounded-full animate-bounce',
                darkMode ? 'bg-blue-400' : 'bg-blue-600'
              )}
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </div>
        <p className={cn(
          'text-sm',
          darkMode ? 'text-gray-300' : 'text-gray-600'
        )}>
          Loading application...
        </p>
      </div>
    </div>
  );
}

/**
 * Error display component
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.darkMode - Whether dark mode is enabled
 * @param {string} props.errorMessage - Error message to display
 * @param {string} props.microFrontendUrl - URL of the microfrontend
 * @returns {JSX.Element} The error display component
 */
function ErrorDisplay({ darkMode, errorMessage, microFrontendUrl }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-10">
      <div className={cn(
        'text-center p-6 max-w-md rounded-lg shadow-lg',
        darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
      )}>
        <svg 
          className="w-12 h-12 mx-auto text-red-500 mb-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h3 className="text-lg font-medium mb-2">
          {errorMessage || 'Failed to load application'}
        </h3>
        <p className="text-sm mb-4">
          Please ensure the application server is running at{' '}
          <code className={cn(
            'px-1 py-0.5 rounded',
            darkMode ? 'bg-gray-700' : 'bg-gray-100'
          )}>
            {microFrontendUrl}
          </code>
        </p>
        <button 
          onClick={() => window.location.reload()}
          className={cn(
            'px-4 py-2 rounded-md transition-colors',
            'bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            darkMode && 'focus:ring-offset-gray-800'
          )}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
