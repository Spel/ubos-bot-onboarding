import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ChatInterface from "../components/ChatInterface";
import { getFromStorage, saveToStorage, STORAGE_KEYS } from "../utils/localStorage";

export default function GlobalChat() {
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
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-neutral-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      {/* Main container with sidebar and content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar darkMode={darkMode} />
        
        {/* Main Content */}
        <div className="flex-1 h-full" style={{ paddingLeft: '16rem', height: 'calc(100vh - 61px)', marginTop: '61px' }}>
          <div className="h-full">
            <ChatInterface 
              darkMode={darkMode}
              onDarkModeToggle={toggleDarkMode}
              singleAgentMode={false}
              showHeader={false}
              showSidebar={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
