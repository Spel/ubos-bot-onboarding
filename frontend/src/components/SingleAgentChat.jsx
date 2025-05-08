import React, { useState, useEffect } from "react";
import ChatInterface from "./ChatInterface";
import { getFromStorage, saveToStorage, STORAGE_KEYS } from "../utils/localStorage";

const SingleAgentChat = ({ agentId }) => {
  const [darkMode, setDarkMode] = useState(getFromStorage(STORAGE_KEYS.DARK_MODE, false));

  // Toggle dark mode function
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    // Save dark mode preference to localStorage
    saveToStorage(STORAGE_KEYS.DARK_MODE, newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  // Apply dark mode on initial load
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-neutral-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Single Agent Chat</h1>
        <ChatInterface 
          darkMode={darkMode}
          onDarkModeToggle={toggleDarkMode}
          singleAgentMode={true}
          preSelectedAgentId={agentId}
          showHeader={true}
          showSidebar={false}
        />
      </div>
    </div>
  );
};

export default SingleAgentChat;
