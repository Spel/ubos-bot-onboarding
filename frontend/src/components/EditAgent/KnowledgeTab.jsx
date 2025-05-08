import React from "react";

const KnowledgeTab = ({ darkMode }) => {
  return (
    <div className={`p-6 rounded-xl ${darkMode ? 'bg-neutral-800' : 'bg-white'} shadow-sm`}>
      <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Knowledge Base
      </h2>
      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        This tab will contain knowledge base settings for your agent. Coming soon.
      </p>
    </div>
  );
};

export default KnowledgeTab;
