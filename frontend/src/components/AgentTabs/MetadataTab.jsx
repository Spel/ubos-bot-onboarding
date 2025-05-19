import React from 'react';

const MetadataTab = ({ darkMode }) => {
  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Agent Metadata</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Configure your agent's basic information and settings
          </p>
        </div>
        
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="agent-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Agent Name
                </label>
                <input
                  type="text"
                  id="agent-name"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:text-white"
                  defaultValue="My AI Agent"
                />
              </div>
              
              <div>
                <label htmlFor="agent-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  id="agent-description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:text-white"
                  defaultValue="A helpful AI assistant that can answer questions and perform tasks."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Visibility
                </label>
                <div className="mt-1 space-y-2">
                  <div className="flex items-center">
                    <input
                      id="visibility-public"
                      name="visibility"
                      type="radio"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-neutral-600"
                      defaultChecked
                    />
                    <label htmlFor="visibility-public" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Public - Anyone with the link can interact
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="visibility-private"
                      name="visibility"
                      type="radio"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-neutral-600"
                    />
                    <label htmlFor="visibility-private" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Private - Only team members can interact
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-neutral-700">
              <button
                type="button"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetadataTab;
