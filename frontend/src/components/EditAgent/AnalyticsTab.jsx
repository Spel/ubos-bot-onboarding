import React from "react";

const AnalyticsTab = ({ darkMode }) => {
  return (
    <div className={`p-6 rounded-xl ${darkMode ? 'bg-neutral-800' : 'bg-white'} shadow-sm`}>
      <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Analytics
      </h2>
      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        This tab will contain analytics for your agent. Coming soon.
      </p>
    </div>
  );
};

export default AnalyticsTab;
