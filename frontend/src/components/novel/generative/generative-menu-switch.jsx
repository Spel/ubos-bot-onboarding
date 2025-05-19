import React from 'react';
import { Sparkles } from 'lucide-react';

const GenerativeMenuSwitch = ({ open, onOpenChange, children }) => {
  return (
    <div className="flex items-center gap-1 p-1 bg-white dark:bg-neutral-800 rounded-md shadow-sm border border-gray-200 dark:border-neutral-700">
      <button
        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-neutral-700"
        onClick={() => onOpenChange(!open)}
        title="AI Assistance"
      >
        <Sparkles size={16} className={open ? "text-blue-500" : ""} />
      </button>
      
      {children}
    </div>
  );
};

export default GenerativeMenuSwitch;
