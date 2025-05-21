import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getBot } from "../utils/botsData";
import { getFromStorage, STORAGE_KEYS } from "../utils/localStorage";
import AgentViewOldHeader from "../components/AgentViewOldHeader";
import AgentViewOldSidebar from "../components/AgentViewOldSidebar";
import { FiUpload } from "react-icons/fi";

export default function AgentViewOld() {
  const { botId } = useParams();
  const [darkMode, setDarkMode] = useState(getFromStorage(STORAGE_KEYS.DARK_MODE, false));
  const [bot, setBot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('add-existing');
  const [knowledgeItems, setKnowledgeItems] = useState([
    { name: 'kj', status: 'active', type: 'Tool' }
  ]);

  // Load bot data
  useEffect(() => {
    const botData = getBot(botId);
    setBot(botData);
    setLoading(false);
  }, [botId]);
  
  const handleFileUpload = (e) => {
    // Handle file upload logic here
    console.log('File upload:', e.target.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    console.log('Files dropped:', files);
    // Process dropped files
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show not found if bot doesn't exist
  if (!bot) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Agent Not Found</h1>
        <p className="mb-6">Sorry, we couldn't find the agent you're looking for.</p>
        <Link 
          to="/my-bots" 
          className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          Back to My Agents
        </Link>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-neutral-900' : 'bg-gray-50'}`}>
      <AgentViewOldHeader darkMode={darkMode} />
      <AgentViewOldSidebar darkMode={darkMode} />
      <div style={{ paddingLeft: '248px', paddingTop: '48px' }}>
        <main className="w-full overflow-y-auto p-6">
          {/* Knowledge Section Title */}
          <div className="mb-6">
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Knowledge
            </h1>
            <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Enable your agents to provide more customized, relevant responses.
            </p>
          </div>
          
          {/* File Upload Section */}
          <div 
            className={`border-2 border-dashed rounded-xl p-8 mb-6 flex flex-col items-center justify-center
              ${darkMode ? 'border-gray-700 bg-neutral-800' : 'border-gray-300 bg-white'}`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className={`p-4 rounded-full mb-2 ${darkMode ? 'bg-neutral-700' : 'bg-gray-100'}`}>
              <FiUpload className={`h-8 w-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
            </div>
            <div className="text-center">
              <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Drag & Drop or <span className="text-blue-500 cursor-pointer">Choose File</span> to upload</p>
              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Supported formats: .csv, .xlsx, .pptx, .pdf, .txt</p>
              <input type="file" className="hidden" onChange={handleFileUpload} />
            </div>
          </div>
          
          {/* Tabs Section */}
          <div className="mb-4">
            <div className="flex border-b space-x-4">
              <button 
                onClick={() => setActiveTab('add-existing')} 
                className={`py-2 px-4 ${activeTab === 'add-existing' ? 
                  'border-b-2 border-blue-500 text-blue-500 font-medium' : 
                  darkMode ? 'text-gray-400' : 'text-gray-600'}`}
              >
                Add existing knowledge
              </button>
              <button 
                onClick={() => setActiveTab('add-website')} 
                className={`py-2 px-4 ${activeTab === 'add-website' ? 
                  'border-b-2 border-blue-500 text-blue-500 font-medium' : 
                  darkMode ? 'text-gray-400' : 'text-gray-600'}`}
              >
                Add website
              </button>
              <button 
                onClick={() => setActiveTab('blank-table')} 
                className={`py-2 px-4 ${activeTab === 'blank-table' ? 
                  'border-b-2 border-blue-500 text-blue-500 font-medium' : 
                  darkMode ? 'text-gray-400' : 'text-gray-600'}`}
              >
                Blank table
              </button>
              <button 
                onClick={() => setActiveTab('add-text')} 
                className={`py-2 px-4 ${activeTab === 'add-text' ? 
                  'border-b-2 border-blue-500 text-blue-500 font-medium' : 
                  darkMode ? 'text-gray-400' : 'text-gray-600'}`}
              >
                Add markdown/plain text
              </button>
            </div>
          </div>
          
          {/* Current Knowledge Section */}
          <div className={`p-4 rounded-xl ${darkMode ? 'bg-neutral-800' : 'bg-white'} shadow-sm`}>
            <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Current knowledge
            </h2>
            
            <table className="w-full">
              <thead>
                <tr className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  <th className="text-left py-2 px-4 font-medium">Name</th>
                  <th className="text-left py-2 px-4 font-medium">Status</th>
                  <th className="text-left py-2 px-4 font-medium">Type</th>
                  <th className="py-2 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {knowledgeItems.map((item, index) => (
                  <tr key={index} className={`${darkMode ? 'text-white' : 'text-gray-800'} border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <td className="py-3 px-4">{item.name}</td>
                    <td className="py-3 px-4">
                      <span className="flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                        Active
                      </span>
                    </td>
                    <td className="py-3 px-4">{item.type}</td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
