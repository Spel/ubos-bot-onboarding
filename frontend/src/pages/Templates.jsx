import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllTemplates, getTemplatesByCategory, getTemplatesByPopularity, searchTemplates } from '../utils/templateData';
import { getFromStorage, saveToStorage } from '../utils/localStorage';
import { STORAGE_KEYS } from '../utils/localStorage';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const Templates = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFramework, setSelectedFramework] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [customTemplate, setCustomTemplate] = useState({
    name: '',
    description: '',
    category: 'support',
    icon: '🤖',
    complexity: 'medium',
    framework: 'UBOS.ai',
    features: ['', '', ''],
    useCases: ['', '', ''],
    hourlyRate: 0.40,
    samplePrompt: ''
  });
  
  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'support', name: 'Customer Support' },
    { id: 'sales', name: 'Sales' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'research', name: 'Research' },
    { id: 'hr', name: 'Human Resources' },
    { id: 'product', name: 'Product Management' },
    { id: 'legal', name: 'Legal' },
    { id: 'finance', name: 'Finance' },
    { id: 'technical', name: 'Technical Support' },
    { id: 'education', name: 'Education' }
  ];

  // Toggle dark mode function
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    // Save dark mode preference to localStorage
    saveToStorage(STORAGE_KEYS.DARK_MODE, newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Get dark mode from local storage
  useEffect(() => {
    const isDarkMode = getFromStorage(STORAGE_KEYS.DARK_MODE, false);
    setDarkMode(isDarkMode);
  }, []);

  // Load templates
  useEffect(() => {
    const allTemplates = getAllTemplates();
    setTemplates(allTemplates);
    setFilteredTemplates(allTemplates);
  }, []);

  // Filter and sort templates
  useEffect(() => {
    let result = [...templates];
    
    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(template => template.category === selectedCategory);
    }
    
    // Filter by framework
    if (selectedFramework !== 'all') {
      result = result.filter(template => template.framework === selectedFramework);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(template => 
        template.name.toLowerCase().includes(query) || 
        template.description.toLowerCase().includes(query)
      );
    }
    
    // Sort templates
    if (sortBy === 'popularity') {
      result = result.sort((a, b) => b.popularity - a.popularity);
    } else if (sortBy === 'name') {
      result = result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'hourlyRate') {
      result = result.sort((a, b) => a.hourlyRate - b.hourlyRate);
    }
    
    setFilteredTemplates(result);
  }, [templates, selectedCategory, selectedFramework, searchQuery, sortBy]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle category selection
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  // Handle framework selection
  const handleFrameworkChange = (frameworkId) => {
    setSelectedFramework(frameworkId);
  };

  // Handle sort selection
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  // Handle template selection
  const handleTemplateSelect = (templateId) => {
    // In a real app, this would navigate to a template detail page or start the agent creation process
    console.log(`Selected template: ${templateId}`);
    // navigate(`/create-agent/${templateId}`);
  };

  // Open create template modal
  const openCreateModal = () => {
    setShowModal(true);
  };

  // Close create template modal
  const closeCreateModal = () => {
    setShowModal(false);
    // Reset form
    setCustomTemplate({
      name: '',
      description: '',
      category: 'support',
      icon: '🤖',
      complexity: 'medium',
      framework: 'UBOS.ai',
      features: ['', '', ''],
      useCases: ['', '', ''],
      hourlyRate: 0.40,
      samplePrompt: ''
    });
  };

  // Handle custom template form changes
  const handleTemplateChange = (e) => {
    const { name, value } = e.target;
    setCustomTemplate(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle feature changes
  const handleFeatureChange = (index, value) => {
    const updatedFeatures = [...customTemplate.features];
    updatedFeatures[index] = value;
    setCustomTemplate(prev => ({
      ...prev,
      features: updatedFeatures
    }));
  };

  // Handle use case changes
  const handleUseCaseChange = (index, value) => {
    const updatedUseCases = [...customTemplate.useCases];
    updatedUseCases[index] = value;
    setCustomTemplate(prev => ({
      ...prev,
      useCases: updatedUseCases
    }));
  };

  // Add feature field
  const addFeature = () => {
    setCustomTemplate(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  // Add use case field
  const addUseCase = () => {
    setCustomTemplate(prev => ({
      ...prev,
      useCases: [...prev.useCases, '']
    }));
  };

  // Remove feature field
  const removeFeature = (index) => {
    const updatedFeatures = [...customTemplate.features];
    updatedFeatures.splice(index, 1);
    setCustomTemplate(prev => ({
      ...prev,
      features: updatedFeatures
    }));
  };

  // Remove use case field
  const removeUseCase = (index) => {
    const updatedUseCases = [...customTemplate.useCases];
    updatedUseCases.splice(index, 1);
    setCustomTemplate(prev => ({
      ...prev,
      useCases: updatedUseCases
    }));
  };

  // Save custom template
  const saveCustomTemplate = () => {
    // Validate form
    if (!customTemplate.name || !customTemplate.description) {
      alert('Please fill in all required fields');
      return;
    }

    // Filter out empty features and use cases
    const filteredFeatures = customTemplate.features.filter(feature => feature.trim() !== '');
    const filteredUseCases = customTemplate.useCases.filter(useCase => useCase.trim() !== '');

    if (filteredFeatures.length === 0) {
      alert('Please add at least one feature');
      return;
    }

    // Create new template with a unique ID
    const newTemplate = {
      ...customTemplate,
      id: templates.length > 0 ? Math.max(...templates.map(t => t.id)) + 1 : 1,
      features: filteredFeatures,
      useCases: filteredUseCases,
      popularity: 0 // New templates start with 0 popularity
    };

    // Add to templates list
    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);
    
    // Close modal
    closeCreateModal();
  };

  // Get complexity badge color
  const getComplexityColor = (complexity) => {
    switch (complexity) {
      case 'low':
        return darkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800';
      case 'medium':
        return darkMode ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-800';
      case 'high':
        return darkMode ? 'bg-purple-800 text-purple-200' : 'bg-purple-100 text-purple-800';
      default:
        return darkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800';
    }
  };

  // Get framework badge color
  const getFrameworkColor = (framework) => {
    switch (framework) {
      case 'UBOS.ai':
        return darkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800';
      case 'Langflow':
        return darkMode ? 'bg-purple-800 text-purple-200' : 'bg-purple-100 text-purple-800';
      case 'Crew.ai':
        return darkMode ? 'bg-orange-800 text-orange-200' : 'bg-orange-100 text-orange-800';
      default:
        return darkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800';
    }
  };

  // Handle "Use Template" button click
  const handleUseTemplate = (templateId) => {
    navigate(`/create-agent/${templateId}`);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-neutral-900' : 'bg-gray-50'}`}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <Sidebar darkMode={darkMode} />
      <div style={{ paddingLeft: '16rem', paddingTop: '61px' }}>
        <main className="w-full overflow-y-auto p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>AI Agent Templates</h1>
                <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Choose a template to quickly create a specialized AI agent for your specific needs
                </p>
              </div>
              <button 
                className={`px-4 py-2 rounded-lg ${
                  darkMode 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } flex items-center`}
                onClick={openCreateModal}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Create Custom Template
              </button>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className={`h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className={`block w-full rounded-md border-0 py-3 pl-10 pr-3 ${
                      darkMode 
                        ? 'bg-neutral-800 text-white placeholder:text-gray-500 focus:ring-blue-600' 
                        : 'bg-white text-gray-900 placeholder:text-gray-400 focus:ring-blue-500'
                    } shadow-sm ring-1 ring-inset ${
                      darkMode ? 'ring-neutral-700' : 'ring-gray-300'
                    } focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>

              {/* Sort */}
              <div className="w-full md:w-48">
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className={`block w-full rounded-md border-0 py-3 ${
                    darkMode 
                      ? 'bg-neutral-800 text-white focus:ring-blue-600' 
                      : 'bg-white text-gray-900 focus:ring-blue-500'
                  } shadow-sm ring-1 ring-inset ${
                    darkMode ? 'ring-neutral-700' : 'ring-gray-300'
                  } focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
                >
                  <option value="popularity">Most Popular</option>
                  <option value="name">Alphabetical</option>
                  <option value="hourlyRate">Lowest Hourly Rate</option>
                </select>
              </div>
            </div>

            {/* Category Tabs */}
            <div className="mt-4 border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-4 overflow-x-auto pb-1" aria-label="Tabs">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                      selectedCategory === category.id
                        ? `border-blue-500 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`
                        : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-300 hover:border-gray-700' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </nav>
            </div>
            
            {/* Framework Filter */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Framework:</span>
              <button
                onClick={() => handleFrameworkChange('all')}
                className={`px-2 py-1 text-xs rounded-full ${
                  selectedFramework === 'all'
                    ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800')
                    : (darkMode ? 'bg-neutral-700 text-gray-300 hover:bg-neutral-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200')
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleFrameworkChange('UBOS.ai')}
                className={`px-2 py-1 text-xs rounded-full ${
                  selectedFramework === 'UBOS.ai'
                    ? (darkMode ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800')
                    : (darkMode ? 'bg-neutral-700 text-gray-300 hover:bg-neutral-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200')
                }`}
              >
                UBOS.ai
              </button>
              <button
                onClick={() => handleFrameworkChange('Langflow')}
                className={`px-2 py-1 text-xs rounded-full ${
                  selectedFramework === 'Langflow'
                    ? (darkMode ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-800')
                    : (darkMode ? 'bg-neutral-700 text-gray-300 hover:bg-neutral-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200')
                }`}
              >
                Langflow
              </button>
              <button
                onClick={() => handleFrameworkChange('Crew.ai')}
                className={`px-2 py-1 text-xs rounded-full ${
                  selectedFramework === 'Crew.ai'
                    ? (darkMode ? 'bg-orange-600 text-white' : 'bg-orange-100 text-orange-800')
                    : (darkMode ? 'bg-neutral-700 text-gray-300 hover:bg-neutral-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200')
                }`}
              >
                Crew.ai
              </button>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <div 
                key={template.id}
                className={`${
                  darkMode ? 'bg-neutral-800 border-neutral-700 hover:bg-neutral-750' : 'bg-white border-gray-200 hover:bg-gray-50'
                } border rounded-xl shadow-sm p-6 cursor-pointer transition-colors duration-200`}
              >
                {/* Template Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-3xl mr-3">{template.icon}</span>
                    <div>
                      <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{template.name}</h3>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getComplexityColor(template.complexity)}`}>
                          {template.complexity.charAt(0).toUpperCase() + template.complexity.slice(1)}
                        </span>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getFrameworkColor(template.framework)}`}>
                          {template.framework}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={`flex items-center ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className={`ml-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{template.popularity}%</span>
                  </div>
                </div>
                
                {/* Description */}
                <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {template.description}
                </p>
                
                {/* Features */}
                <div className="mb-4">
                  <h4 className={`text-xs font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>KEY FEATURES</h4>
                  <ul className="space-y-1">
                    {template.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className={`text-sm flex items-start ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <svg className={`h-4 w-4 mt-0.5 mr-2 flex-shrink-0 ${darkMode ? 'text-green-400' : 'text-green-500'}`} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A1 1 0 012 8v8a2 2 0 002 2 2 2 0 012 2 2 2 0 012-2 2 2 0 012-2V8a1 1 0 012-1 1 1 0 010-1.414l7-7a1 1 0 011.414 0l7 7z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {template.features.length > 3 && (
                    <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      +{template.features.length - 3} more features
                    </p>
                  )}
                </div>
                
                {/* Hourly Rate */}
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Hourly Rate</span>
                    <span className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      ${template.hourlyRate.toFixed(2)}/hr
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full" 
                      style={{ width: `${Math.min(100, (template.hourlyRate / 0.50) * 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Use Template Button */}
                <div className="mt-4">
                  <button
                    onClick={() => handleUseTemplate(template.id)}
                    className={`w-full px-3 py-2 text-sm font-medium rounded-md ${
                      darkMode 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    } flex items-center justify-center`}
                  >
                    <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14"></path>
                      <path d="M12 5l7 7-7 7"></path>
                    </svg>
                    Create Agent with Template
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* No Results */}
          {filteredTemplates.length === 0 && (
            <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className={`mt-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>No templates found</h3>
              <p className="mt-1 text-sm">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </main>
      </div>
      
      {/* Custom Template Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity dark:bg-gray-800 dark:bg-opacity-75" 
              onClick={closeCreateModal}
            ></div>

            {/* Modal panel */}
            <div className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full ${darkMode ? 'bg-neutral-800' : 'bg-white'}`}>
              <div className={`px-4 pt-5 pb-4 sm:p-6 sm:pb-4 ${darkMode ? 'bg-neutral-800' : 'bg-white'}`}>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className={`text-lg leading-6 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Create Custom Template
                    </h3>
                    <div className="mt-6">
                      <form className="space-y-6">
                        {/* Basic Info Section */}
                        <div className="space-y-4">
                          <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Basic Information</h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Template Name */}
                            <div>
                              <label htmlFor="name" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Template Name*
                              </label>
                              <input
                                type="text"
                                name="name"
                                id="name"
                                value={customTemplate.name}
                                onChange={handleTemplateChange}
                                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                                  darkMode 
                                    ? 'bg-neutral-700 border-neutral-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                }`}
                                required
                              />
                            </div>
                            
                            {/* Category */}
                            <div>
                              <label htmlFor="category" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Category*
                              </label>
                              <select
                                name="category"
                                id="category"
                                value={customTemplate.category}
                                onChange={handleTemplateChange}
                                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                                  darkMode 
                                    ? 'bg-neutral-700 border-neutral-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                }`}
                              >
                                <option value="support">Customer Support</option>
                                <option value="sales">Sales</option>
                                <option value="marketing">Marketing</option>
                                <option value="research">Research</option>
                                <option value="hr">Human Resources</option>
                                <option value="product">Product Management</option>
                                <option value="legal">Legal</option>
                                <option value="finance">Finance</option>
                                <option value="technical">Technical Support</option>
                                <option value="education">Education</option>
                              </select>
                            </div>
                          </div>
                          
                          {/* Description */}
                          <div>
                            <label htmlFor="description" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Description*
                            </label>
                            <textarea
                              name="description"
                              id="description"
                              rows="3"
                              value={customTemplate.description}
                              onChange={handleTemplateChange}
                              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                                darkMode 
                                  ? 'bg-neutral-700 border-neutral-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                              }`}
                              required
                            ></textarea>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Icon */}
                            <div>
                              <label htmlFor="icon" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Icon
                              </label>
                              <input
                                type="text"
                                name="icon"
                                id="icon"
                                value={customTemplate.icon}
                                onChange={handleTemplateChange}
                                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                                  darkMode 
                                    ? 'bg-neutral-700 border-neutral-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                }`}
                                placeholder="🤖"
                              />
                              <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Use an emoji as icon
                              </p>
                            </div>
                            
                            {/* Framework */}
                            <div>
                              <label htmlFor="framework" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Framework
                              </label>
                              <select
                                name="framework"
                                id="framework"
                                value={customTemplate.framework}
                                onChange={handleTemplateChange}
                                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                                  darkMode 
                                    ? 'bg-neutral-700 border-neutral-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                }`}
                              >
                                <option value="UBOS.ai">UBOS.ai</option>
                                <option value="Langflow">Langflow</option>
                                <option value="Crew.ai">Crew.ai</option>
                              </select>
                              <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Framework used to build this agent
                              </p>
                            </div>
                            
                            {/* Complexity */}
                            <div>
                              <label htmlFor="complexity" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Complexity
                              </label>
                              <select
                                name="complexity"
                                id="complexity"
                                value={customTemplate.complexity}
                                onChange={handleTemplateChange}
                                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                                  darkMode 
                                    ? 'bg-neutral-700 border-neutral-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                }`}
                              >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                              </select>
                            </div>
                          </div>
                          
                          {/* Hourly Rate */}
                          <div>
                            <label htmlFor="hourlyRate" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Hourly Rate ($)
                            </label>
                            <input
                              type="number"
                              name="hourlyRate"
                              id="hourlyRate"
                              value={customTemplate.hourlyRate}
                              onChange={handleTemplateChange}
                              step="0.01"
                              min="0.35"
                              max="0.50"
                              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                                darkMode 
                                  ? 'bg-neutral-700 border-neutral-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                              }`}
                            />
                            <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Estimated cost per hour of operation ($0.35-$0.50)
                            </p>
                          </div>
                        </div>
                        
                        {/* Features Section */}
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Features*</h4>
                            <button
                              type="button"
                              onClick={addFeature}
                              className={`inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded ${
                                darkMode 
                                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                  : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                              }`}
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                              </svg>
                              Add Feature
                            </button>
                          </div>
                          
                          {customTemplate.features.map((feature, index) => (
                            <div key={`feature-${index}`} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={feature}
                                onChange={(e) => handleFeatureChange(index, e.target.value)}
                                className={`block w-full rounded-md shadow-sm sm:text-sm ${
                                  darkMode 
                                    ? 'bg-neutral-700 border-neutral-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                }`}
                                placeholder={`Feature ${index + 1}`}
                              />
                              {customTemplate.features.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeFeature(index)}
                                  className={`p-1 rounded-full ${
                                    darkMode 
                                      ? 'text-gray-400 hover:text-white hover:bg-red-600' 
                                      : 'text-gray-500 hover:text-red-600 hover:bg-red-100'
                                  }`}
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                  </svg>
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        {/* Use Cases Section */}
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Use Cases</h4>
                            <button
                              type="button"
                              onClick={addUseCase}
                              className={`inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded ${
                                darkMode 
                                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                  : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                              }`}
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                              </svg>
                              Add Use Case
                            </button>
                          </div>
                          
                          {customTemplate.useCases.map((useCase, index) => (
                            <div key={`usecase-${index}`} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={useCase}
                                onChange={(e) => handleUseCaseChange(index, e.target.value)}
                                className={`block w-full rounded-md shadow-sm sm:text-sm ${
                                  darkMode 
                                    ? 'bg-neutral-700 border-neutral-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                }`}
                                placeholder={`Use Case ${index + 1}`}
                              />
                              {customTemplate.useCases.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeUseCase(index)}
                                  className={`p-1 rounded-full ${
                                    darkMode 
                                      ? 'text-gray-400 hover:text-white hover:bg-red-600' 
                                      : 'text-gray-500 hover:text-red-600 hover:bg-red-100'
                                  }`}
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                  </svg>
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        {/* Sample Prompt */}
                        <div>
                          <label htmlFor="samplePrompt" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Sample Prompt
                          </label>
                          <textarea
                            name="samplePrompt"
                            id="samplePrompt"
                            rows="4"
                            value={customTemplate.samplePrompt}
                            onChange={handleTemplateChange}
                            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                              darkMode 
                                ? 'bg-neutral-700 border-neutral-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                            }`}
                            placeholder="You are a helpful assistant that..."
                          ></textarea>
                          <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Provide a sample prompt that will be used to initialize the AI agent
                          </p>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Modal footer */}
              <div className={`px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse ${darkMode ? 'bg-neutral-800 border-t border-neutral-700' : 'bg-gray-50 border-t border-gray-200'}`}>
                <button
                  type="button"
                  onClick={saveCustomTemplate}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${
                    darkMode ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500' : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                  }`}
                >
                  Create Template
                </button>
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className={`mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm ${
                    darkMode 
                      ? 'border-neutral-600 bg-neutral-700 text-gray-300 hover:bg-neutral-600 focus:ring-neutral-500' 
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Templates;
