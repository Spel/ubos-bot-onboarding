import React from "react";
import {
  FileText,
  Settings,
  Zap,
  ArrowUpRight,
  Info,
  Code,
  HelpCircle
} from "lucide-react";

export function AgentViewSidebar({ darkMode, activeSection, setActiveSection }) {
  const mainItems = [
    {
      id: 'prompt',
      icon: 'P',
      label: 'Prompt',
      description: 'Create guidelines for your agent',
      customStyles: {
        icon: `text-xs ${darkMode ? 'text-purple-200' : 'text-purple-600'}`,
        iconBg: darkMode ? 'bg-purple-800' : 'bg-purple-100'
      }
    },
    {
      id: 'tools',
      icon: <Settings className={`h-3.5 w-3.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />,
      label: 'Tools',
      description: 'Used by agents to complete tasks'
    },
    {
      id: 'knowledge',
      icon: <FileText className={`h-3.5 w-3.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />,
      label: 'Knowledge',
      description: 'Add your documents and data'
    },
    {
      id: 'triggers',
      icon: <Zap className={`h-3.5 w-3.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />,
      label: 'Triggers',
      description: 'Run tasks on auto-pilot'
    }
  ];

  const subItems = [
    {
      id: 'escalations',
      icon: <ArrowUpRight className={`h-3.5 w-3.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />,
      label: 'Escalations'
    },
    {
      id: 'metadata',
      icon: <Info className={`h-3.5 w-3.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />,
      label: 'Metadata'
    },
    {
      id: 'variables',
      icon: <Code className={`h-3.5 w-3.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />,
      label: 'Variables'
    }
  ];

  const bottomItems = [
    {
      id: 'advanced',
      icon: <Settings className={`h-3.5 w-3.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />,
      label: 'Advanced'
    },
    {
      id: 'help',
      icon: <HelpCircle className={`h-3.5 w-3.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />,
      label: 'Need help?'
    }
  ];

  const renderSidebarItem = (item) => (
    <div
      key={item.id}
      className={`py-3.5 px-4 cursor-pointer transition-colors
        ${activeSection === item.id 
          ? (darkMode ? 'bg-neutral-800' : 'bg-gray-100') 
          : 'hover:bg-gray-50 dark:hover:bg-neutral-800/50'}`}
      onClick={() => setActiveSection(item.id)}
    >
      <div className="flex items-center gap-2.5 mb-0.5">
        <div className={`w-5 h-5 rounded flex items-center justify-center
          ${item.customStyles?.iconBg || (darkMode ? 'bg-transparent' : 'bg-transparent')}`}>
          {typeof item.icon === 'string' 
            ? <span className={item.customStyles?.icon}>{item.icon}</span>
            : item.icon}
        </div>
        <span className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          {item.label}
        </span>
      </div>
      {item.description && (
        <p className={`text-xs pl-7.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {item.description}
        </p>
      )}
    </div>
  );

  return (
    <div className={`w-64 border-r overflow-y-auto flex flex-col h-full ${darkMode ? 'border-neutral-800 bg-neutral-900' : 'border-gray-200 bg-white'}`}>
      {/* Main section */}
      <div className="flex-none">
        {mainItems.map(renderSidebarItem)}
      </div>

      {/* Separator */}
      <div className={`h-px mx-3 my-2 ${darkMode ? 'bg-neutral-800' : 'bg-gray-200'}`} />

      {/* Sub section */}
      <div className="flex-none">
        {subItems.map(renderSidebarItem)}
      </div>

      {/* Separator */}
      <div className={`h-px mx-3 my-2 ${darkMode ? 'bg-neutral-800' : 'bg-gray-200'}`} />

      {/* Bottom section - pushed to bottom with flex */}
      <div className="mt-auto">
        {bottomItems.map(renderSidebarItem)}
      </div>
    </div>
  );
}