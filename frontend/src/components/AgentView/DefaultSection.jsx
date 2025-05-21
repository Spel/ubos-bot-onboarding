import React from 'react';
import { Button } from '../ui/button';

export function DefaultSection({ darkMode, sectionName, onBackClick }) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className={`p-8 max-w-md w-full rounded-xl text-center ${darkMode ? 'bg-neutral-800/50' : 'bg-gray-50'}`}>
          <h2 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {sectionName.charAt(0).toUpperCase() + sectionName.slice(1)} Configuration
          </h2>
          <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            This section is under development. Please check back later.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={onBackClick}
            className={darkMode ? 'border-gray-600 text-gray-300' : ''}
          >
            Back to Knowledge
          </Button>
        </div>
      </div>
    </div>
  );
}