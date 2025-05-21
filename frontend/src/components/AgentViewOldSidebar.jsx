import React from 'react';
import { Link } from 'react-router-dom';

const AgentViewOldSidebar = ({ darkMode }) => {
  const menuItems = [
    { 
      label: 'Prompt', 
      description: 'Create guidelines for your agent',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
        </svg>
      ),
      active: false
    },
    { 
      label: 'Tools', 
      description: 'Used by agents to complete tasks',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H10a3 3 0 013 3v1a1 1 0 102 0v-1a5 5 0 00-5-5H8.414l1.293-1.293z" clipRule="evenodd" />
        </svg>
      ),
      active: false
    },
    { 
      label: 'Knowledge', 
      description: 'Add your documents and data',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
        </svg>
      ),
      active: true
    },
    { 
      label: 'Triggers', 
      description: 'Run tasks on auto-pilot',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
        </svg>
      ),
      active: false
    },
    { 
      label: 'Escalations', 
      description: '',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
        </svg>
      ),
      active: false
    },
    { 
      label: 'Metadata', 
      description: '',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      ),
      active: false
    },
    { 
      label: 'Variables', 
      description: '',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      ),
      active: false
    }
  ];

  const bottomItems = [
    { 
      label: 'Advanced', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      )
    },
    { 
      label: 'Need help?', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      )
    }
  ];

  return (
    <aside 
      className={`fixed left-0 top-0 bottom-0 w-[248px] border-r flex flex-col justify-between ${
        darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-gray-200'
      }`}
    >
      {/* Top section of sidebar */}
      <div>
        <div className="p-4">
          {/* Main navigation items */}
          <nav className="space-y-1">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to="#"
                className={`flex items-start px-3 py-2 rounded-lg group ${
                  item.active 
                    ? darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-700'
                    : darkMode ? 'text-gray-400 hover:bg-neutral-800' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className={`mr-3 flex-shrink-0 mt-0.5 ${
                  item.active ? 'text-blue-500' : darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {item.icon}
                </span>
                <div>
                  <div className={`font-medium ${
                    item.active ? 'text-blue-500' : darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {item.label}
                  </div>
                  {item.description && (
                    <p className={`text-xs ${
                      item.active ? 'text-blue-400' : darkMode ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      {item.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom section of sidebar */}
      <div className="p-4">
        <div className="space-y-1">
          {bottomItems.map((item, index) => (
            <Link
              key={index}
              to="#"
              className={`flex items-center px-3 py-2 rounded-lg ${
                darkMode ? 'text-gray-400 hover:bg-neutral-800' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className={`mr-3 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {item.icon}
              </span>
              <div className="font-medium">
                {item.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default AgentViewOldSidebar;
