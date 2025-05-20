import React from "react";
import {
  ChevronDown,
  Plus,
  FileSpreadsheet,
  MessageSquare,
  Search,
  Globe,
  Info,
  MoreHorizontal,
  Zap
} from "lucide-react";
import { Button } from "../ui/button";

const RightSidebar = ({ darkMode }) => {
  const tools = [
    {
      id: 'analyse-csv',
      icon: <FileSpreadsheet className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />,
      title: 'Analyse CSV',
      description: 'Analyse CSV data, please be specific about your question'
    },
    {
      id: 'gpt-files',
      icon: <MessageSquare className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />,
      title: 'GPT on my files',
      description: 'Get your questions answered on any PDF, CSV, or audio file'
    },
    {
      id: 'meeting-transcript',
      icon: <MessageSquare className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />,
      title: 'Summarize meeting transcript',
      description: 'Summarize a meeting transcript to get the most accurate...'
    },
    {
      id: 'google-search',
      icon: <Search className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />,
      title: 'Google Search',
      description: 'Search the internet for the latest information about a topic'
    },
    {
      id: 'scrape-website',
      icon: <Globe className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />,
      title: 'Scrape & summarize website',
      description: 'Scrape website content via URL, do NOT make up URLs'
    },
    {
      id: 'add-metadata',
      icon: <Info className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />,
      title: 'Add conversation metadata',
      description: 'Want to reuse values throughout your agent? Turn them into variables that you can access with...'
    }
  ];

  return (
    <div className={`w-72 border-l overflow-y-auto ${darkMode ? 'border-neutral-800 bg-neutral-900' : 'border-gray-200 bg-white'}`}>
      <div className={`p-4 border-b ${darkMode ? 'border-neutral-800' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <span className="font-medium">Tools</span>
            <ChevronDown className="h-4 w-4" />
          </div>
          <Button size="sm" variant="outline" className={`h-7 gap-1 ${darkMode ? 'border-gray-700 text-gray-300' : ''}`}>
            <Plus className="h-3 w-3" />
            Add tool
          </Button>
        </div>

        <div className="space-y-3">
          {tools.map((tool) => (
            <div 
              key={tool.id}
              className={`flex items-center justify-between p-2 rounded-md ${darkMode ? 'hover:bg-neutral-800' : 'hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-2">
                {tool.icon}
                <div>
                  <div className="font-medium text-sm">{tool.title}</div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {tool.description}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <div className={`rounded p-0.5 ${darkMode ? 'bg-neutral-700' : 'bg-gray-100'}`}>
                  <Zap className="h-3 w-3" />
                </div>
                <MoreHorizontal className={`h-4 w-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
