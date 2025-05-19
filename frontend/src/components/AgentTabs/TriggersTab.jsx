import React from 'react';

const TriggersTab = ({ darkMode }) => {
  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Triggers</h2>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            New Trigger
          </button>
        </div>
        
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium">No triggers set up</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Create triggers to automate actions based on specific events or conditions.
            </p>
            <div className="mt-6">
              <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Create Trigger
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TriggersTab;
