import React from 'react';
import { FiSettings } from 'react-icons/fi';

const AgentViewOldHeader = ({ darkMode }) => {
  return (
    <header className={`fixed top-0 right-0 left-0 z-30 border-b ${darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-gray-200'}`}
      style={{ marginLeft: '248px', height: '48px' }}>
      <div className="flex items-center justify-between h-full px-4">
        {/* Left section - Researcher Name */}
        <div className="flex items-center">
          <div className="h-7 w-7 rounded-full bg-purple-700 flex items-center justify-center text-white text-xs mr-2">
            R
          </div>
          <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Researcher Rachel
          </span>
          <span className="ml-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </span>
        </div>

        {/* Right section - Controls */}
        <div className="flex items-center space-x-2">
          <button className={`px-3 py-1 rounded-md flex items-center ${darkMode ? 'bg-neutral-800 text-white hover:bg-neutral-700' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            Run
          </button>
          <button className={`px-3 py-1 rounded-md flex items-center ${darkMode ? 'bg-neutral-800 text-white hover:bg-neutral-700' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Build
          </button>
          
          <div className="mx-2 h-4 border-l border-gray-300"></div>
          
          <button className={`p-1 rounded-md flex items-center ${darkMode ? 'hover:bg-neutral-800' : 'hover:bg-gray-100'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 2zM10 14a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 14zM10 8a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
          </button>
          <button className={`p-1 rounded-md flex items-center ${darkMode ? 'hover:bg-neutral-800' : 'hover:bg-gray-100'}`}>
            <span className="text-gray-500">Publish changes</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AgentViewOldHeader;
