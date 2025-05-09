import React, { useState, useRef } from "react";
import { updateBot } from "../../utils/botsData";

const KnowledgeTab = ({ darkMode, bot, botId }) => {
  const [activeSection, setActiveSection] = useState('documents');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // State for uploaded files
  const [documents, setDocuments] = useState(bot?.knowledgeBase?.documents || []);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  // State for web URLs
  const [webUrls, setWebUrls] = useState(bot?.knowledgeBase?.webUrls || []);
  const [newUrl, setNewUrl] = useState('');
  const [isProcessingUrl, setIsProcessingUrl] = useState(false);
  
  // State for text & Q&A
  const [textEntries, setTextEntries] = useState(bot?.knowledgeBase?.textEntries || []);
  const [qaEntries, setQaEntries] = useState(bot?.knowledgeBase?.qaEntries || []);
  const [newText, setNewText] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  
  // State for images
  const [images, setImages] = useState(bot?.knowledgeBase?.images || []);
  const [imageUploadProgress, setImageUploadProgress] = useState({});
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const imageInputRef = useRef(null);
  
  // State for external integrations
  const [integrations, setIntegrations] = useState(bot?.knowledgeBase?.integrations || {
    googleDrive: { connected: false, lastSync: null },
    notion: { connected: false, lastSync: null },
    oneDrive: { connected: false, lastSync: null }
  });
  
  // Save knowledge base changes
  const saveKnowledgeBase = () => {
    setIsSaving(true);
    
    const updatedKnowledgeBase = {
      documents,
      webUrls,
      textEntries,
      qaEntries,
      images,
      integrations
    };
    
    const updatedBot = {
      ...bot,
      knowledgeBase: updatedKnowledgeBase
    };
    
    try {
      updateBot(botId, updatedBot);
      setSaveSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating knowledge base:', error);
      alert('There was an error updating your knowledge base. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  // File upload handlers
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setIsUploading(true);
    const newProgress = {};
    
    // Process each file
    const newDocuments = files.map(file => {
      const id = `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      newProgress[id] = 0;
      
      // Simulate file upload progress
      simulateFileUploadProgress(id);
      
      return {
        id,
        name: file.name,
        type: file.type,
        size: file.size,
        addedAt: new Date().toISOString(),
        status: 'processing',
        source: 'upload'
      };
    });
    
    setUploadProgress(newProgress);
    setDocuments(prev => [...prev, ...newDocuments]);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };
  
  // Simulate file upload progress
  const simulateFileUploadProgress = (fileId) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Update document status to 'completed' after upload
        setDocuments(prev => prev.map(doc => 
          doc.id === fileId ? { ...doc, status: 'completed' } : doc
        ));
        
        // Check if all documents are completed
        const allCompleted = Object.values(uploadProgress).every(p => p === 100);
        if (allCompleted) {
          setIsUploading(false);
          saveKnowledgeBase();
        }
      }
      
      setUploadProgress(prev => ({
        ...prev,
        [fileId]: progress
      }));
    }, 500);
  };
  
  // Remove document
  const removeDocument = (docId) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[docId];
      return newProgress;
    });
    
    // Save changes
    saveKnowledgeBase();
  };
  
  // Get file icon based on type
  const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) {
      return (
        <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
      );
    } else if (fileType.includes('word') || fileType.includes('doc')) {
      return (
        <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
      );
    } else if (fileType.includes('sheet') || fileType.includes('excel') || fileType.includes('csv')) {
      return (
        <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
      );
    } else if (fileType.includes('text') || fileType.includes('txt')) {
      return (
        <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
      );
    } else {
      return (
        <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
      );
    }
  };
  
  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className={`p-4 rounded-xl ${darkMode ? 'bg-neutral-800' : 'bg-white'} shadow-sm`}>
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveSection('documents')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeSection === 'documents'
              ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
              : (darkMode ? 'bg-neutral-700 text-gray-300' : 'bg-gray-100 text-gray-700')}`}
          >
            Documents
          </button>
          <button
            onClick={() => setActiveSection('web')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeSection === 'web'
              ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
              : (darkMode ? 'bg-neutral-700 text-gray-300' : 'bg-gray-100 text-gray-700')}`}
          >
            Web Content
          </button>
          <button
            onClick={() => setActiveSection('text')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeSection === 'text'
              ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
              : (darkMode ? 'bg-neutral-700 text-gray-300' : 'bg-gray-100 text-gray-700')}`}
          >
            Text & Q&A
          </button>
          <button
            onClick={() => setActiveSection('images')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeSection === 'images'
              ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
              : (darkMode ? 'bg-neutral-700 text-gray-300' : 'bg-gray-100 text-gray-700')}`}
          >
            Images
          </button>
          <button
            onClick={() => setActiveSection('integrations')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeSection === 'integrations'
              ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
              : (darkMode ? 'bg-neutral-700 text-gray-300' : 'bg-gray-100 text-gray-700')}`}
          >
            Integrations
          </button>
          <button
            onClick={() => setActiveSection('manage')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeSection === 'manage'
              ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
              : (darkMode ? 'bg-neutral-700 text-gray-300' : 'bg-gray-100 text-gray-700')}`}
          >
            Manage All
          </button>
        </div>
      </div>
      
      {/* Content Sections */}
      <div>
        {/* Document Upload Section */}
        {activeSection === 'documents' && (
          <div className={`p-6 rounded-xl ${darkMode ? 'bg-neutral-800' : 'bg-white'} shadow-sm`}>
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Document Upload
            </h2>
            <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Upload PDF, DOCX, TXT, and other document files to train your agent on specific content.
            </p>
            
            {/* File Dropzone */}
            <div className={`border-2 border-dashed rounded-lg p-6 text-center transition cursor-pointer ${darkMode 
              ? 'border-neutral-600 hover:border-neutral-500 hover:bg-neutral-700/30' 
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}`}
            >
              <input 
                type="file" 
                id="document-upload" 
                className="hidden" 
                multiple 
                accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.xls,.ppt,.pptx"
                onChange={handleFileUpload}
                ref={fileInputRef}
              />
              <label htmlFor="document-upload" className="cursor-pointer block w-full h-full">
                <div className="flex flex-col items-center">
                  <svg className={`w-12 h-12 ${darkMode ? 'text-neutral-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className={`mt-4 text-sm font-medium ${darkMode ? 'text-neutral-200' : 'text-gray-700'}`}>
                    Drag and drop files here or click to browse
                  </p>
                  <p className={`mt-2 text-xs ${darkMode ? 'text-neutral-400' : 'text-gray-500'}`}>
                    Supports PDF, DOCX, TXT, CSV, XLSX, PPT (Max 50MB per file)
                  </p>
                </div>
              </label>
            </div>
            
            {/* Uploaded Files List */}
            {documents.length > 0 && (
              <div className="mt-8">
                <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Uploaded Documents ({documents.length})
                </h3>
                <div className={`rounded-lg border overflow-hidden ${darkMode ? 'border-neutral-700' : 'border-gray-200'}`}>
                  <div className="overflow-x-auto">
                    <table className={`min-w-full divide-y ${darkMode ? 'divide-neutral-700' : 'divide-gray-200'}`}>
                      <thead className={darkMode ? 'bg-neutral-700' : 'bg-gray-50'}>
                        <tr>
                          <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-neutral-300' : 'text-gray-500'} uppercase tracking-wider`}>File</th>
                          <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-neutral-300' : 'text-gray-500'} uppercase tracking-wider`}>Size</th>
                          <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-neutral-300' : 'text-gray-500'} uppercase tracking-wider`}>Added</th>
                          <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-neutral-300' : 'text-gray-500'} uppercase tracking-wider`}>Status</th>
                          <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-neutral-300' : 'text-gray-500'} uppercase tracking-wider`}>Actions</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${darkMode ? 'divide-neutral-700' : 'divide-gray-200'}`}>
                        {documents.map((doc) => (
                          <tr key={doc.id} className={darkMode ? 'bg-neutral-800' : 'bg-white'}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0">
                                  {getFileIcon(doc.type)}
                                </div>
                                <div className="ml-4">
                                  <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{doc.name}</div>
                                  <div className={`text-xs ${darkMode ? 'text-neutral-400' : 'text-gray-500'}`}>{doc.type}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`text-sm ${darkMode ? 'text-neutral-300' : 'text-gray-500'}`}>{formatFileSize(doc.size)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`text-sm ${darkMode ? 'text-neutral-300' : 'text-gray-500'}`}>{formatDate(doc.addedAt)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {doc.status === 'processing' ? (
                                <div className="w-full">
                                  <div className="flex items-center">
                                    <div className={`text-xs mr-2 ${darkMode ? 'text-neutral-300' : 'text-gray-500'}`}>
                                      {Math.round(uploadProgress[doc.id] || 0)}%
                                    </div>
                                    <div className="flex-1">
                                      <div className={`h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-neutral-700' : 'bg-gray-200'}`}>
                                        <div 
                                          className="h-full bg-blue-500" 
                                          style={{ width: `${uploadProgress[doc.id] || 0}%` }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : doc.status === 'completed' ? (
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'}`}>
                                  Processed
                                </span>
                              ) : doc.status === 'failed' ? (
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'}`}>
                                  Failed
                                </span>
                              ) : (
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${darkMode ? 'bg-neutral-700 text-neutral-200' : 'bg-gray-100 text-gray-800'}`}>
                                  {doc.status}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button 
                                onClick={() => removeDocument(doc.id)}
                                className={`text-sm ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-900'}`}
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            
            {/* Empty State */}
            {documents.length === 0 && (
              <div className={`mt-6 text-center py-8 ${darkMode ? 'text-neutral-400' : 'text-gray-500'}`}>
                <p>No documents uploaded yet. Upload documents to train your agent.</p>
              </div>
            )}
          </div>
        )}
        
        {/* Web Content Section */}
        {activeSection === 'web' && (
          <div className={`p-6 rounded-xl ${darkMode ? 'bg-neutral-800' : 'bg-white'} shadow-sm`}>
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Web Content
            </h2>
            <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Add website URLs to train your agent on web content. The agent will crawl and index the content from these websites.
            </p>
            
            {/* URL Input Form */}
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-neutral-700' : 'bg-gray-50'} mb-6`}>
              <h3 className={`text-md font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Add Website URL
              </h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://example.com"
                  className={`flex-1 px-3 py-2 rounded-lg border ${darkMode 
                    ? 'bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <button 
                  onClick={() => {
                    if (!newUrl) return;
                    
                    // Validate URL
                    try {
                      new URL(newUrl);
                    } catch (e) {
                      alert('Please enter a valid URL');
                      return;
                    }
                    
                    // Check if URL already exists
                    if (webUrls.some(item => item.url === newUrl)) {
                      alert('This URL has already been added');
                      return;
                    }
                    
                    setIsProcessingUrl(true);
                    
                    // Simulate processing delay
                    setTimeout(() => {
                      const newWebUrl = {
                        id: `url-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                        url: newUrl,
                        title: newUrl.replace(/^https?:\/\//, '').replace(/\/$/, ''),
                        addedAt: new Date().toISOString(),
                        status: 'indexed',
                        pageCount: Math.floor(Math.random() * 20) + 1
                      };
                      
                      setWebUrls(prev => [...prev, newWebUrl]);
                      setNewUrl('');
                      setIsProcessingUrl(false);
                      saveKnowledgeBase();
                    }, 2000);
                  }}
                  disabled={isProcessingUrl || !newUrl}
                  className={`px-4 py-2 rounded-lg font-medium ${darkMode 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'} disabled:opacity-50 transition-colors sm:whitespace-nowrap`}
                >
                  {isProcessingUrl ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing
                    </span>
                  ) : 'Add URL'}
                </button>
              </div>
              <p className={`mt-2 text-xs ${darkMode ? 'text-neutral-400' : 'text-gray-500'}`}>
                Enter the full URL including http:// or https:// prefix
              </p>
            </div>
            
            {/* Added URLs List */}
            {webUrls.length > 0 && (
              <div>
                <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Added Websites ({webUrls.length})
                </h3>
                <div className={`rounded-lg border overflow-hidden ${darkMode ? 'border-neutral-700' : 'border-gray-200'}`}>
                  <div className="overflow-x-auto">
                    <table className={`min-w-full divide-y ${darkMode ? 'divide-neutral-700' : 'divide-gray-200'}`}>
                      <thead className={darkMode ? 'bg-neutral-700' : 'bg-gray-50'}>
                        <tr>
                          <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-neutral-300' : 'text-gray-500'} uppercase tracking-wider`}>Website</th>
                          <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-neutral-300' : 'text-gray-500'} uppercase tracking-wider`}>Pages</th>
                          <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-neutral-300' : 'text-gray-500'} uppercase tracking-wider`}>Added</th>
                          <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-neutral-300' : 'text-gray-500'} uppercase tracking-wider`}>Status</th>
                          <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-neutral-300' : 'text-gray-500'} uppercase tracking-wider`}>Actions</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${darkMode ? 'divide-neutral-700' : 'divide-gray-200'}`}>
                        {webUrls.map((item) => (
                          <tr key={item.id} className={darkMode ? 'bg-neutral-800' : 'bg-white'}>
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="flex-shrink-0">
                                  <svg className={`w-6 h-6 ${darkMode ? 'text-neutral-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                                <div className="ml-4">
                                  <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.title}</div>
                                  <div className={`text-xs ${darkMode ? 'text-neutral-400' : 'text-gray-500'}`}>
                                    <a 
                                      href={item.url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className={`hover:underline ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}
                                    >
                                      {item.url}
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`text-sm ${darkMode ? 'text-neutral-300' : 'text-gray-500'}`}>{item.pageCount} pages</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`text-sm ${darkMode ? 'text-neutral-300' : 'text-gray-500'}`}>{formatDate(item.addedAt)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {item.status === 'processing' ? (
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${darkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800'}`}>
                                  Processing
                                </span>
                              ) : item.status === 'indexed' ? (
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'}`}>
                                  Indexed
                                </span>
                              ) : item.status === 'failed' ? (
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'}`}>
                                  Failed
                                </span>
                              ) : (
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${darkMode ? 'bg-neutral-700 text-neutral-200' : 'bg-gray-100 text-gray-800'}`}>
                                  {item.status}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button 
                                onClick={() => {
                                  setWebUrls(prev => prev.filter(url => url.id !== item.id));
                                  saveKnowledgeBase();
                                }}
                                className={`text-sm ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-900'}`}
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            
            {/* Empty State */}
            {webUrls.length === 0 && (
              <div className={`text-center py-8 ${darkMode ? 'text-neutral-400' : 'text-gray-500'}`}>
                <p>No websites added yet. Add website URLs to train your agent on web content.</p>
              </div>
            )}
          </div>
        )}
        
        {/* Text & Q&A Section */}
        {activeSection === 'text' && (
          <div className={`p-6 rounded-xl ${darkMode ? 'bg-neutral-800' : 'bg-white'} shadow-sm`}>
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Text & Q&A
            </h2>
            <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Add custom text or question-answer pairs to train your agent with specific knowledge.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Custom Text Section */}
              <div className={`p-4 rounded-lg border ${darkMode ? 'border-neutral-700 bg-neutral-700/30' : 'border-gray-200 bg-gray-50'}`}>
                <h3 className={`text-md font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Add Custom Text
                </h3>
                <div className="space-y-4">
                  <div>
                    <textarea
                      rows="6"
                      value={newText}
                      onChange={(e) => setNewText(e.target.value)}
                      placeholder="Enter text to add to your agent's knowledge..."
                      className={`w-full px-3 py-2 rounded-lg border ${darkMode 
                        ? 'bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                  <button 
                    onClick={() => {
                      if (!newText.trim()) return;
                      
                      const newTextEntry = {
                        id: `text-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                        content: newText,
                        addedAt: new Date().toISOString()
                      };
                      
                      setTextEntries(prev => [...prev, newTextEntry]);
                      setNewText('');
                      saveKnowledgeBase();
                    }}
                    disabled={!newText.trim()}
                    className={`w-full px-4 py-2 rounded-lg font-medium ${darkMode 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'} disabled:opacity-50 transition-colors`}
                  >
                    Add Text to Knowledge Base
                  </button>
                </div>
              </div>
              
              {/* Q&A Section */}
              <div className={`p-4 rounded-lg border ${darkMode ? 'border-neutral-700 bg-neutral-700/30' : 'border-gray-200 bg-gray-50'}`}>
                <h3 className={`text-md font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Add Question & Answer
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-neutral-300' : 'text-gray-700'}`}>
                      Question
                    </label>
                    <input
                      type="text"
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      placeholder="Enter a question..."
                      className={`w-full px-3 py-2 rounded-lg border ${darkMode 
                        ? 'bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-neutral-300' : 'text-gray-700'}`}>
                      Answer
                    </label>
                    <textarea
                      rows="3"
                      value={newAnswer}
                      onChange={(e) => setNewAnswer(e.target.value)}
                      placeholder="Enter the answer..."
                      className={`w-full px-3 py-2 rounded-lg border ${darkMode 
                        ? 'bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                  <button 
                    onClick={() => {
                      if (!newQuestion.trim() || !newAnswer.trim()) return;
                      
                      const newQAPair = {
                        id: `qa-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                        question: newQuestion,
                        answer: newAnswer,
                        addedAt: new Date().toISOString()
                      };
                      
                      setQaEntries(prev => [...prev, newQAPair]);
                      setNewQuestion('');
                      setNewAnswer('');
                      saveKnowledgeBase();
                    }}
                    disabled={!newQuestion.trim() || !newAnswer.trim()}
                    className={`w-full px-4 py-2 rounded-lg font-medium ${darkMode 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'} disabled:opacity-50 transition-colors`}
                  >
                    Add Q&A to Knowledge Base
                  </button>
                </div>
              </div>
            </div>
            
            {/* Knowledge Entries */}
            <div className="mt-8 space-y-6">
              {/* Text Entries */}
              {textEntries.length > 0 && (
                <div>
                  <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Custom Text Entries ({textEntries.length})
                  </h3>
                  <div className="space-y-4">
                    {textEntries.map((entry) => (
                      <div 
                        key={entry.id} 
                        className={`p-4 rounded-lg border relative ${darkMode ? 'border-neutral-700 bg-neutral-800' : 'border-gray-200 bg-white'}`}
                      >
                        <div className="pr-8">
                          <p className={`whitespace-pre-wrap text-sm ${darkMode ? 'text-neutral-300' : 'text-gray-700'}`}>
                            {entry.content}
                          </p>
                          <div className={`mt-2 text-xs ${darkMode ? 'text-neutral-400' : 'text-gray-500'}`}>
                            Added on {formatDate(entry.addedAt)}
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            setTextEntries(prev => prev.filter(item => item.id !== entry.id));
                            saveKnowledgeBase();
                          }}
                          className={`absolute top-4 right-4 p-1 rounded-full ${darkMode ? 'hover:bg-neutral-700' : 'hover:bg-gray-100'}`}
                        >
                          <svg className={`w-5 h-5 ${darkMode ? 'text-neutral-400 hover:text-red-400' : 'text-gray-400 hover:text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Q&A Entries */}
              {qaEntries.length > 0 && (
                <div>
                  <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Question & Answer Pairs ({qaEntries.length})
                  </h3>
                  <div className="space-y-4">
                    {qaEntries.map((entry) => (
                      <div 
                        key={entry.id} 
                        className={`p-4 rounded-lg border relative ${darkMode ? 'border-neutral-700 bg-neutral-800' : 'border-gray-200 bg-white'}`}
                      >
                        <div className="pr-8">
                          <h4 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Q: {entry.question}
                          </h4>
                          <p className={`whitespace-pre-wrap text-sm ${darkMode ? 'text-neutral-300' : 'text-gray-700'}`}>
                            A: {entry.answer}
                          </p>
                          <div className={`mt-2 text-xs ${darkMode ? 'text-neutral-400' : 'text-gray-500'}`}>
                            Added on {formatDate(entry.addedAt)}
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            setQaEntries(prev => prev.filter(item => item.id !== entry.id));
                            saveKnowledgeBase();
                          }}
                          className={`absolute top-4 right-4 p-1 rounded-full ${darkMode ? 'hover:bg-neutral-700' : 'hover:bg-gray-100'}`}
                        >
                          <svg className={`w-5 h-5 ${darkMode ? 'text-neutral-400 hover:text-red-400' : 'text-gray-400 hover:text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Empty State */}
              {textEntries.length === 0 && qaEntries.length === 0 && (
                <div className={`text-center py-8 ${darkMode ? 'text-neutral-400' : 'text-gray-500'}`}>
                  <p>No text or Q&A entries added yet. Add custom text or question-answer pairs to train your agent.</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Images Section */}
        {activeSection === 'images' && (
          <div className={`p-6 rounded-xl ${darkMode ? 'bg-neutral-800' : 'bg-white'} shadow-sm`}>
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Images
            </h2>
            <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Upload images to train your agent on visual content. The agent will be able to understand and reference these images.
            </p>
            
            {/* Image Dropzone */}
            <div className={`border-2 border-dashed rounded-lg p-6 text-center transition cursor-pointer ${darkMode 
              ? 'border-neutral-600 hover:border-neutral-500 hover:bg-neutral-700/30' 
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}`}
            >
              <input 
                type="file" 
                id="image-upload" 
                className="hidden" 
                multiple 
                accept="image/*"
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  if (files.length === 0) return;
                  
                  setIsUploadingImages(true);
                  const newProgress = {};
                  
                  // Process each file
                  const newImages = files.map(file => {
                    const id = `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                    newProgress[id] = 0;
                    
                    // Create image preview
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      setImages(prev => prev.map(img => 
                        img.id === id ? { ...img, preview: e.target.result } : img
                      ));
                    };
                    reader.readAsDataURL(file);
                    
                    // Simulate upload progress
                    let progress = 0;
                    const interval = setInterval(() => {
                      progress += Math.random() * 15;
                      if (progress >= 100) {
                        progress = 100;
                        clearInterval(interval);
                        
                        // Update image status to 'completed' after upload
                        setImages(prev => prev.map(img => 
                          img.id === id ? { ...img, status: 'processed' } : img
                        ));
                        
                        // Check if all images are completed
                        const allCompleted = Object.values(imageUploadProgress).every(p => p === 100);
                        if (allCompleted) {
                          setIsUploadingImages(false);
                          saveKnowledgeBase();
                        }
                      }
                      
                      setImageUploadProgress(prev => ({
                        ...prev,
                        [id]: progress
                      }));
                    }, 500);
                    
                    return {
                      id,
                      name: file.name,
                      type: file.type,
                      size: file.size,
                      preview: null, // Will be set when FileReader completes
                      addedAt: new Date().toISOString(),
                      status: 'processing'
                    };
                  });
                  
                  setImageUploadProgress(newProgress);
                  setImages(prev => [...prev, ...newImages]);
                  
                  // Reset file input
                  if (imageInputRef.current) {
                    imageInputRef.current.value = null;
                  }
                }}
                ref={imageInputRef}
              />
              <label htmlFor="image-upload" className="cursor-pointer block w-full h-full">
                <div className="flex flex-col items-center">
                  <svg className={`w-12 h-12 ${darkMode ? 'text-neutral-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className={`mt-4 text-sm font-medium ${darkMode ? 'text-neutral-200' : 'text-gray-700'}`}>
                    Drag and drop images here or click to browse
                  </p>
                  <p className={`mt-2 text-xs ${darkMode ? 'text-neutral-400' : 'text-gray-500'}`}>
                    Supports JPG, PNG, GIF (Max 10MB per image)
                  </p>
                </div>
              </label>
            </div>
            
            {/* Uploaded Images */}
            {images.length > 0 && (
              <div className="mt-8">
                <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Uploaded Images ({images.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {images.map((image) => (
                    <div 
                      key={image.id} 
                      className={`relative rounded-lg border overflow-hidden group ${darkMode ? 'border-neutral-700 bg-neutral-800' : 'border-gray-200 bg-white'}`}
                    >
                      <div className="aspect-square relative">
                        {image.preview ? (
                          <img 
                            src={image.preview} 
                            alt={image.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center ${darkMode ? 'bg-neutral-700' : 'bg-gray-100'}`}>
                            <svg className={`w-8 h-8 ${darkMode ? 'text-neutral-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        
                        {/* Upload Progress Overlay */}
                        {image.status === 'processing' && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="text-center">
                              <div className="w-16 h-16 mx-auto mb-2">
                                <svg className="w-full h-full" viewBox="0 0 36 36">
                                  <path
                                    d="M18 2.0845
                                      a 15.9155 15.9155 0 0 1 0 31.831
                                      a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#4F46E5"
                                    strokeWidth="3"
                                    strokeDasharray={`${imageUploadProgress[image.id] || 0}, 100`}
                                    strokeLinecap="round"
                                  />
                                </svg>
                              </div>
                              <div className="text-white text-sm font-medium">
                                {Math.round(imageUploadProgress[image.id] || 0)}%
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-2">
                        <div className="truncate text-xs font-medium ${darkMode ? 'text-neutral-300' : 'text-gray-700'}">
                          {image.name}
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <div className="text-xs ${darkMode ? 'text-neutral-400' : 'text-gray-500'}">
                            {formatFileSize(image.size)}
                          </div>
                          {image.status === 'processed' ? (
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'}`}>
                              Processed
                            </span>
                          ) : image.status === 'failed' ? (
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'}`}>
                              Failed
                            </span>
                          ) : (
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${darkMode ? 'bg-neutral-700 text-neutral-200' : 'bg-gray-100 text-gray-800'}`}>
                              {image.status}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Remove Button */}
                      <button 
                        onClick={() => {
                          setImages(prev => prev.filter(img => img.id !== image.id));
                          setImageUploadProgress(prev => {
                            const newProgress = { ...prev };
                            delete newProgress[image.id];
                            return newProgress;
                          });
                          saveKnowledgeBase();
                        }}
                        className="absolute top-2 right-2 p-1 rounded-full bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Empty State */}
            {images.length === 0 && (
              <div className={`mt-6 text-center py-8 ${darkMode ? 'text-neutral-400' : 'text-gray-500'}`}>
                <p>No images uploaded yet. Upload images to train your agent on visual content.</p>
              </div>
            )}
          </div>
        )}
        
        {/* Placeholder for remaining sections */}
        {(activeSection !== 'documents' && activeSection !== 'web' && activeSection !== 'text' && activeSection !== 'images') && (
          <div className={`p-6 rounded-xl ${darkMode ? 'bg-neutral-800' : 'bg-white'} shadow-sm`}>
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {activeSection === 'integrations' ? 'External Integrations' : 'Knowledge Base Management'}
            </h2>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              This section will be implemented in the next part.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeTab;
