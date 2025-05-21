import React, { useState } from 'react';
import { Upload, MoreHorizontal } from 'lucide-react';
import { Button } from '../ui/button';

export function KnowledgeSection({ darkMode, knowledgeItems = [] }) {
  const [activeTab, setActiveTab] = useState('add-existing');

  const handleFileUpload = (e) => {
    console.log('File upload:', e.target.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    console.log('Files dropped:', files);
  };

  return (
    <div className={`p-8 rounded-xl ${darkMode ? 'bg-neutral-900' : 'bg-white'} shadow-lg border ${darkMode ? 'border-neutral-800' : 'border-gray-200'}`}>
      <div className="mb-6">
        <h1 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Knowledge
        </h1>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Enable your agents to provide more customized, relevant responses.
        </p>
      </div>
      
      <div 
        className={`border-2 border-dashed rounded-xl p-8 mb-8 flex flex-col items-center justify-center
          ${darkMode ? 'border-gray-700 bg-neutral-800/80' : 'border-gray-200 bg-gray-50'} transition-colors hover:border-blue-400`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className={`p-4 rounded-full mb-3 ${darkMode ? 'bg-neutral-700' : 'bg-gray-100'}`}>
          <Upload className={`h-6 w-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
        </div>
        <div className="text-center">
          <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Drag & Drop or <span className="text-blue-500 cursor-pointer">Choose File</span> to upload
          </p>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Supported formats: .csv, .xlsx, .pptx, .pdf, .txt
          </p>
          <input type="file" className="hidden" onChange={handleFileUpload} />
        </div>
      </div>
      
      <div className="mb-6">
        <div className={`flex border-b space-x-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          {['add-existing', 'add-website', 'blank-table', 'add-text'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)} 
              className={`py-2 px-4 ${activeTab === tab ? 
                'border-b-2 border-blue-500 text-blue-500 font-medium' : 
                darkMode ? 'text-gray-400' : 'text-gray-600'}`}
            >
              {tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </button>
          ))}
        </div>
      </div>
      
      <div className={`p-5 rounded-lg ${darkMode ? 'bg-neutral-800' : 'bg-gray-50'} border ${darkMode ? 'border-neutral-700' : 'border-gray-200'}`}>
        <h2 className={`text-base font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Current knowledge
        </h2>
        
        <table className="w-full border-collapse">
          <thead>
            <tr className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-xs uppercase border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <th className="text-left py-2 px-4 font-medium">Name</th>
              <th className="text-left py-2 px-4 font-medium">Status</th>
              <th className="text-left py-2 px-4 font-medium">Type</th>
              <th className="py-2 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {knowledgeItems.map((item, index) => (
              <tr key={index} className={`${darkMode ? 'hover:bg-neutral-700' : 'hover:bg-gray-100'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors`}>
                <td className="py-3 px-4 font-medium">{item.name}</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                    ${item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {item.status === 'active' ? 'Active' : item.status}
                  </span>
                </td>
                <td className="py-3 px-4">{item.type}</td>
                <td className="py-3 px-4 text-right">
                  <button className={`p-1 rounded-full ${darkMode ? 'hover:bg-neutral-600' : 'hover:bg-gray-200'} transition-colors`}>
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {knowledgeItems.length === 0 && (
          <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <div className={`rounded-full p-3 bg-opacity-10 mx-auto mb-3 inline-flex ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
              <Upload className="h-8 w-8 opacity-70" />
            </div>
            <p className="font-medium">No knowledge items added yet</p>
            <p className="text-sm mt-1 max-w-md mx-auto">Upload files or add from existing sources</p>
          </div>
        )}
      </div>
    </div>
  );
}