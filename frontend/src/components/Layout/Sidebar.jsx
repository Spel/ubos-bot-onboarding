import React from "react";
import {
  FileText,
  Zap,
  ArrowUpRight,
  Settings,
  HelpCircle,
  Info,
  Code,
} from "lucide-react";

const Sidebar = ({ darkMode, activeSection, setActiveSection }) => {
  const sidebarItems = [
    {
      id: 'prompt',
      title: 'Prompt',
      description: 'Create guidelines for your agent',
      icon: 'P',
      iconType: 'letter',
      iconClass: darkMode ? 'bg-purple-800 text-purple-200' : 'bg-purple-100 text-purple-600'
    },
    {
      id: 'tools',
      title: 'Tools',
      description: 'Used by agents to complete tasks',
      icon: <Settings className={`h-3 w-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />,
      iconType: 'component'
    },
    {
      id: 'knowledge',
      title: 'Knowledge',
      description: 'Add your documents and data',
      icon: <FileText className={`h-3 w-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />,
      iconType: 'component'
    },
    {
      id: 'triggers',
      title: 'Triggers',
      description: 'Run tasks on auto-pilot',
      icon: <Zap className={`h-3 w-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />,
      iconType: 'component'
    },
    {
      id: 'escalations',
      title: 'Escalations',
      description: '',
      icon: <ArrowUpRight className={`h-3 w-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />,
      iconType: 'component'
    },
    {
      id: 'metadata',
      title: 'Metadata',
      description: '',
      icon: <Info className={`h-3 w-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />,
      iconType: 'component'
    },
    {
      id: 'variables',
      title: 'Variables',
      description: '',
      icon: <Code className={`h-3 w-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />,
      iconType: 'component'
    },
    {
      id: 'advanced',
      title: 'Advanced',
      description: '',
      icon: <Settings className={`h-3 w-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />,
      iconType: 'component'
    },
    {
      id: 'help',
      title: 'Need help?',
      description: '',
      icon: <HelpCircle className={`h-3 w-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />,
      iconType: 'component'
    }
  ];

  return (
    <div className={`w-64 border-r overflow-y-auto ${darkMode ? 'border-neutral-800 bg-neutral-900' : 'border-gray-200 bg-white'}`}>
      {sidebarItems.map((item, index) => (
        <div 
          key={item.id}
          className={`p-4 ${index < sidebarItems.length - 1 ? 'border-b' : ''} ${activeSection === item.id ? (darkMode ? 'bg-neutral-800' : 'bg-gray-100') : ''} ${darkMode ? 'border-neutral-800' : 'border-gray-200'}`}
          onClick={() => setActiveSection(item.id)}
        >
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-5 h-5 rounded ${item.iconType === 'letter' ? item.iconClass : darkMode ? 'bg-neutral-800' : 'bg-gray-100'} flex items-center justify-center`}>
              {item.iconType === 'letter' ? item.icon : item.icon}
            </div>
            <span className="font-medium">{item.title}</span>
          </div>
          {item.description && (
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} pl-7`}>{item.description}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
