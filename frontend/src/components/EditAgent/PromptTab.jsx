import React from "react";

const PromptTab = ({ darkMode }) => {
  return (
    <div className={`p-6 rounded-xl ${darkMode ? 'bg-neutral-800' : 'bg-white'} shadow-sm`}>
      <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Prompt Engineering
      </h2>
      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        This tab will contain prompt engineering settings for your agent. Coming soon.
      </p>
    </div>
  );
};

export default PromptTab;
