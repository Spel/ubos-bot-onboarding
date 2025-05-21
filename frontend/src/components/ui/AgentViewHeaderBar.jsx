import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Play,
  Hammer,
  Search,
  ChevronDown
} from "lucide-react";
import { Button } from "./button";

export function AgentViewHeaderBar({ darkMode, saved, setSaved, user }) {
  const navigate = useNavigate();

  return (
    <header className={`flex items-center justify-between px-4 py-2 border-b ${darkMode ? 'border-neutral-800' : 'border-gray-200'}`}>
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={() => navigate('/my-bots')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-full ${darkMode ? 'bg-purple-800' : 'bg-purple-100'} flex items-center justify-center`}>
            <span className={`text-xs ${darkMode ? 'text-purple-200' : 'text-purple-600'}`}>B</span>
          </div>
          <span className="font-medium">Bot</span>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </div>
        <span className={`text-sm ${saved ? 'text-green-500' : 'text-gray-500'}`}>
          {saved ? 'Saved' : 'Unsaved'}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="gap-2">
          <Play className="h-4 w-4" />
          Run
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <Hammer className="h-4 w-4" />
          Build
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Search className="h-4 w-4" />
        </Button>
        <span className="text-sm text-gray-500">Versions</span>
        <Button 
          variant="default" 
          size="sm" 
          className={`${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-black hover:bg-gray-800'} text-white`}
          onClick={() => setSaved(true)}
        >
          Publish changes
        </Button>
        <div className="ml-2 flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className={`h-6 w-6 rounded-full ${darkMode ? 'bg-blue-800' : 'bg-blue-100'} flex items-center justify-center`}>
              <span className={`text-xs ${darkMode ? 'text-blue-200' : 'text-blue-600'}`}>
                {user?.name?.charAt(0) || "U"}
              </span>
            </div>
            <span className="text-sm hidden md:inline">{user?.name}</span>
          </div>
          <Button variant="ghost" size="sm">
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}