import React from 'react';
import NovelEditor from '../novel/NovelEditor';

const InstructionsTab = ({ darkMode, editorContent, onEditorUpdate }) => {
  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Agent Instructions</h2>
        </div>
        
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow">
          <div className="p-4 border-b dark:border-neutral-700">
            <h3 className="text-lg font-medium">Edit Instructions</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Define how your agent should behave and respond to users
            </p>
          </div>
          
          <div className="p-4">
            <NovelEditor 
              initialContent={editorContent}
              darkMode={darkMode}
              onUpdate={onEditorUpdate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructionsTab;
