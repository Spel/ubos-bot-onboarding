import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getFromStorage, STORAGE_KEYS } from '../utils/localStorage';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

/**
 * MicroFrontendChat component that integrates an external chat component
 * served from another origin as a microfrontend.
 */
export default function MicroFrontendChat() {
  const { botId } = useParams();
  const [darkMode, setDarkMode] = useState(getFromStorage(STORAGE_KEYS.DARK_MODE, false));
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const iframeRef = useRef(null);

  // Microfrontend URL
  const microFrontendUrl = 'http://localhost:5174/';

  // Handle iframe load events
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  // Handle iframe error events
  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Setup message listener for cross-origin communication
  useEffect(() => {
    const handleMessage = (event) => {
      // Only accept messages from the microfrontend origin
      if (event.origin !== 'http://localhost:5174') return;
      
      // Handle messages from the microfrontend
      console.log('Message from microfrontend:', event.data);
      
      // Example: Handle theme changes or other events
      if (event.data.type === 'THEME_CHANGE') {
        // Handle theme change request
      }
    };

    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Send message to the iframe
  const sendMessageToMicroFrontend = (message) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(message, microFrontendUrl);
    }
  };

  // Example: Send theme information to the microfrontend
  useEffect(() => {
    if (!isLoading && !hasError) {
      sendMessageToMicroFrontend({
        type: 'THEME',
        payload: { darkMode }
      });
    }
  }, [darkMode, isLoading, hasError]);

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-neutral-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Header darkMode={darkMode} />
      <div className="flex flex-1 h-[calc(100vh-4rem)] mt-[4rem]">
        <Sidebar darkMode={darkMode} />
        <main className="flex-1 flex flex-col relative" style={{ marginLeft: '16rem', height: 'calc(-61px + 100vh)', marginTop: '61px'}}>
          <div className={`flex-1 flex flex-col rounded-lg shadow-lg ${darkMode ? 'bg-neutral-800' : 'bg-white'}`}>
            {isLoading && (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center">
                  <div className="flex space-x-2 mb-4">
                    <div className={`w-3 h-3 rounded-full ${darkMode ? 'bg-blue-400' : 'bg-blue-600'} animate-bounce`} style={{ animationDelay: '0ms' }}></div>
                    <div className={`w-3 h-3 rounded-full ${darkMode ? 'bg-blue-400' : 'bg-blue-600'} animate-bounce`} style={{ animationDelay: '150ms' }}></div>
                    <div className={`w-3 h-3 rounded-full ${darkMode ? 'bg-blue-400' : 'bg-blue-600'} animate-bounce`} style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading chat component...</p>
                </div>
              </div>
            )}
            
            {hasError && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-6 max-w-md">
                  <svg className="w-12 h-12 mx-auto text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                  <h3 className="text-lg font-medium mb-2">Failed to load chat component</h3>
                  <p className="text-sm mb-4">The chat component could not be loaded. Please ensure the microfrontend server is running at {microFrontendUrl}.</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}
            
            <iframe
              ref={iframeRef}
              src={microFrontendUrl}
              className={`w-full h-full border-0 ${isLoading || hasError ? 'hidden' : 'block'}`}
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              title="Chat Component"
              allow="microphone; camera"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
            />
          </div>
        </main>
      </div>
    </div>
  );
}
