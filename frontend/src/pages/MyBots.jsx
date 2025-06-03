import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { saveToStorage, getFromStorage, STORAGE_KEYS } from "../utils/localStorage";
import { getBots, addBot, updateBot, deleteBot } from "../utils/botsData";

export default function MyBots() {
  const navigate = useNavigate();
  const [bots, setBots] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentBot, setCurrentBot] = useState(null);
  const [newBot, setNewBot] = useState({
    name: "",
    description: "",
    type: "support",
    status: "active",
    avatar: "🤖",
    averageTpuConsumption: 0,
    executionCount: 0,
    lastExecuted: null
  });
  
  // Initialize component and load bots
  useEffect(() => {
    // Load bots
    loadBots();

    // Add click handler to close menus when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-menu') && !event.target.closest('button')) {
        setBots(prevBots => prevBots.map(bot => ({
          ...bot,
          showMenu: false
        })));
      }
    };

    document.addEventListener('click', handleClickOutside);
    
    // Clean up event listener
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Load bots from storage
  const loadBots = () => {
    const botsList = getBots();
    // Initialize showMenu property for each bot
    const botsWithMenu = botsList.map(bot => ({
      ...bot,
      showMenu: false
    }));
    setBots(botsWithMenu);
  };

  // Handle add bot
  const handleAddBot = () => {
    addBot(newBot);
    setNewBot({
      name: "",
      description: "",
      type: "support",
      status: "active",
      avatar: "🤖",
      averageTpuConsumption: 0,
      executionCount: 0,
      lastExecuted: null
    });
    setShowAddModal(false);
    loadBots();
  };
  
  // Close all menus
  const closeAllMenus = () => {
    setBots(prevBots => prevBots.map(bot => ({
      ...bot,
      showMenu: false
    })));
  };

  // Handle edit bot
  const handleEditBot = () => {
    if (currentBot) {
      updateBot(currentBot.id, currentBot);
      setCurrentBot(null);
      setShowEditModal(false);
      loadBots();
    }
  };

  // Handle delete bot
  const handleDeleteBot = (id) => {
    if (confirm("Are you sure you want to delete this bot?")) {
      deleteBot(id);
      loadBots();
    } else {
      closeAllMenus();
    }
  };

  // Open edit modal
  const openEditModal = (bot) => {
    setCurrentBot({...bot});
    setShowEditModal(true);
    closeAllMenus();
  };

  return (
    <div className="flex flex-col h-full w-full">
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold dark:text-white text-gray-800">My Agents</h1>
              <p className="mt-1 dark:text-gray-400 text-gray-600">Manage your AI Agents</p>
            </div>
            <button 
              onClick={() => navigate('/create-agent')}
              className="py-2.5 px-4 rounded-lg dark:bg-blue-600 dark:hover:bg-blue-700 bg-blue-500 hover:bg-blue-600 text-white transition-colors"
            >
              <span className="flex items-center gap-x-2">
                <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Create New Agent
              </span>
            </button>
          </div>
          
          {/* Bots Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {bots.map(bot => (
              <div key={bot.id} className="border dark:bg-neutral-800 dark:border-neutral-700 bg-white border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-[320px]">
                <div className="p-4 flex-grow relative">
                  <div className="relative dropdown-menu">
                    {bot.showMenu ? (
                      <div 
                        className="absolute top-0 right-0 mt-8 w-48 rounded-lg shadow-lg overflow-hidden z-10 dark:bg-neutral-700 dark:border-neutral-600 bg-white border-gray-200 border"
                      >
                        <button 
                          onClick={() => openEditModal(bot)}
                          className="w-full p-3 text-left flex items-center gap-2 dark:hover:bg-neutral-600 dark:text-gray-200 hover:bg-gray-50 text-gray-700"
                        >
                          <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 20h9"></path>
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                          </svg>
                          Quick Edit
                        </button>
                        <Link 
                          to={`/agent/${bot.id}`}
                          className="w-full p-3 text-left flex items-center gap-2 dark:hover:bg-neutral-600 dark:text-gray-200 hover:bg-gray-50 text-gray-700"
                        >
                          <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                          View
                        </Link>
                        <button 
                          onClick={() => {
                            closeAllMenus();
                            navigate(`/manage-agent/${bot.id}`);
                          }}
                          className="w-full p-3 text-left flex items-center gap-2 dark:hover:bg-neutral-600 dark:text-gray-200 hover:bg-gray-50 text-gray-700"
                        >
                          <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteBot(bot.id)}
                          className="w-full p-3 text-left flex items-center gap-2 dark:hover:bg-neutral-600 dark:text-red-400 hover:bg-gray-50 text-red-600"
                        >
                          <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                          </svg>
                          Delete
                        </button>
                      </div>
                    ) : null}
                    <button 
                      onClick={() => {
                        const updatedBots = bots.map(b => ({
                          ...b,
                          showMenu: b.id === bot.id ? !b.showMenu : false
                        }));
                        setBots(updatedBots);
                      }}
                      className="absolute top-0 right-0 p-2 rounded-full dark:hover:bg-neutral-700 dark:text-gray-400 hover:bg-gray-100 text-gray-700"
                    >
                      <svg className="size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="19" cy="12" r="1"></circle>
                        <circle cx="5" cy="12" r="1"></circle>
                      </svg>
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-3xl p-2 rounded-lg dark:bg-neutral-700 bg-gray-100">{bot.avatar}</div>
                    <div>
                      <h3 className="font-semibold dark:text-white text-gray-800">{bot.name}</h3>
                      <span className={`inline-flex items-center gap-1.5 py-0.5 px-2 rounded-full text-xs font-medium ${
                        bot.status === 'active' 
                          ? 'dark:bg-green-900 dark:text-green-300 bg-green-100 text-green-800' 
                          : 'dark:bg-gray-800 dark:text-gray-400 bg-gray-100 text-gray-800'
                      }`}>
                        {bot.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm mb-3 dark:text-gray-400 text-gray-600">{bot.description}</p>
                  
                  {/* Bot Stats */}
                  <div className="grid grid-cols-2 gap-2 mb-3 dark:text-gray-400 text-gray-600">
                    {/* Average TPU Consumption */}
                    <div className="p-2 rounded-lg dark:bg-neutral-700 bg-gray-100">
                      <div className="flex items-center">
                        <svg className="size-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                        </svg>
                        <span className="text-xs font-medium">Avg. Cost:</span>
                      </div>
                      <div className="mt-1 text-sm font-semibold dark:text-blue-400 text-blue-600">
                        {bot.averageTpuConsumption} TPU
                      </div>
                    </div>
                    
                    {/* Execution Count */}
                    <div className="p-2 rounded-lg dark:bg-neutral-700 bg-gray-100">
                      <div className="flex items-center">
                        <svg className="size-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6 9l6 6 6-6"></path>
                        </svg>
                        <span className="text-xs font-medium">Executions:</span>
                      </div>
                      <div className="mt-1 text-sm font-semibold dark:text-green-400 text-green-600">
                        {bot.executionCount || 0}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center mt-3">
                    <Link 
                      to={bot.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs font-medium dark:text-blue-400 dark:hover:text-blue-300 text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <svg className="size-3" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                      </svg>
                      {bot.domain.includes('.ubos.bot') ? bot.domain : `${bot.domain}.ubos.bot`}
                    </Link>
                  </div>
                </div>
                <div className="mt-auto border-t dark:border-neutral-700 border-gray-200">
                  <div className="p-3 flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      Created: {new Date(bot.createdAt).toLocaleDateString()}
                    </div>
                    {bot.lastExecuted && (
                      <div className="text-xs text-gray-500">
                        Last run: {new Date(bot.lastExecuted).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {bots.length === 0 && (
            <div className="text-center py-12 px-4 rounded-xl border dark:bg-neutral-800 dark:border-neutral-700 bg-white border-gray-200">
              <div className="mx-auto w-24 h-24 flex items-center justify-center rounded-full bg-blue-50 mb-4">
                <svg className="size-12 text-blue-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 8V4H8"></path>
                  <rect width="16" height="12" x="4" y="8" rx="2"></rect>
                  <path d="m2 14 4-4"></path>
                  <path d="m22 14-4-4"></path>
                  <path d="M10 16v.01"></path>
                  <path d="M14 16v.01"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-1 dark:text-white text-gray-900">No agents yet</h3>
              <p className="mb-4 dark:text-gray-400 text-gray-600">Create your first agent to get started</p>
              <button 
                onClick={() => setShowAddModal(true)}
                className="py-2.5 px-4 rounded-lg dark:bg-blue-600 dark:hover:bg-blue-700 bg-blue-500 hover:bg-blue-600 text-white transition-colors"
              >
                Create Bot
              </button>
            </div>
          )}
      </main>

      {/* Add Bot Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="border dark:bg-neutral-800 dark:border-neutral-700 bg-white border-gray-200 rounded-xl shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold dark:text-white text-gray-800">Add New Bot</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="dark:text-gray-400 dark:hover:text-white text-gray-500 hover:text-gray-700"
              >
                <svg className="size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300 text-gray-700">Bot Name</label>
                <input 
                  type="text" 
                  value={newBot.name} 
                  onChange={(e) => setNewBot({...newBot, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-700 dark:border-neutral-600 dark:text-white dark:focus:border-blue-500 bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                  placeholder="Enter bot name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300 text-gray-700">Description</label>
                <textarea 
                  value={newBot.description} 
                  onChange={(e) => setNewBot({...newBot, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-700 dark:border-neutral-600 dark:text-white dark:focus:border-blue-500 bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                  placeholder="Enter bot description"
                  rows="3"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300 text-gray-700">Bot Type</label>
                <select 
                  value={newBot.type} 
                  onChange={(e) => setNewBot({...newBot, type: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-700 dark:border-neutral-600 dark:text-white dark:focus:border-blue-500 bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                >
                  <option value="support">Support</option>
                  <option value="sales">Sales</option>
                  <option value="content">Content</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300 text-gray-700">Status</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      checked={newBot.status === 'active'} 
                      onChange={() => setNewBot({...newBot, status: 'active'})}
                      className="mr-2"
                    />
                    <span className="dark:text-gray-300 text-gray-700">Active</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      checked={newBot.status === 'inactive'} 
                      onChange={() => setNewBot({...newBot, status: 'inactive'})}
                      className="mr-2"
                    />
                    <span className="dark:text-gray-300 text-gray-700">Inactive</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300 text-gray-700">Avatar</label>
                <div className="flex gap-2">
                  {['🤖', '🤑', '✍️', '🧠', '👾'].map(emoji => (
                    <button 
                      key={emoji}
                      onClick={() => setNewBot({...newBot, avatar: emoji})}
                      className={`text-2xl p-2 rounded-lg ${
                        newBot.avatar === emoji 
                          ? 'dark:bg-blue-600 bg-blue-100' 
                          : 'dark:bg-neutral-700 bg-gray-100'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300 text-gray-700">Average TPU Consumption</label>
                <div className="flex items-center">
                  <input 
                    type="number" 
                    value={newBot.averageTpuConsumption} 
                    onChange={(e) => setNewBot({...newBot, averageTpuConsumption: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-700 dark:border-neutral-600 dark:text-white dark:focus:border-blue-500 bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                    placeholder="Enter average TPU consumption"
                  />
                  <div className="ml-2 text-sm text-gray-500">TPU</div>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Typical values: Support (270), Sales (450), Content (700)
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button 
                onClick={() => setShowAddModal(false)}
                className="py-2 px-4 rounded-lg dark:bg-neutral-700 dark:text-gray-300 dark:hover:bg-neutral-600 bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddBot}
                className="py-2 px-4 rounded-lg dark:bg-blue-600 dark:hover:bg-blue-700 bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                disabled={!newBot.name}
              >
                Add Bot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Bot Modal */}
      {showEditModal && currentBot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="border dark:bg-neutral-800 dark:border-neutral-700 bg-white border-gray-200 rounded-xl shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold dark:text-white text-gray-800">Edit Bot</h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="dark:text-gray-400 dark:hover:text-white text-gray-500 hover:text-gray-700"
              >
                <svg className="size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300 text-gray-700">Bot Name</label>
                <input 
                  type="text" 
                  value={currentBot.name} 
                  onChange={(e) => setCurrentBot({...currentBot, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-700 dark:border-neutral-600 dark:text-white dark:focus:border-blue-500 bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                  placeholder="Enter bot name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300 text-gray-700">Description</label>
                <textarea 
                  value={currentBot.description} 
                  onChange={(e) => setCurrentBot({...currentBot, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-700 dark:border-neutral-600 dark:text-white dark:focus:border-blue-500 bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                  placeholder="Enter bot description"
                  rows="3"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300 text-gray-700">Bot Type</label>
                <select 
                  value={currentBot.type} 
                  onChange={(e) => setCurrentBot({...currentBot, type: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-700 dark:border-neutral-600 dark:text-white dark:focus:border-blue-500 bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                >
                  <option value="support">Support</option>
                  <option value="sales">Sales</option>
                  <option value="content">Content</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300 text-gray-700">Status</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      checked={currentBot.status === 'active'} 
                      onChange={() => setCurrentBot({...currentBot, status: 'active'})}
                      className="mr-2"
                    />
                    <span className="dark:text-gray-300 text-gray-700">Active</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      checked={currentBot.status === 'inactive'} 
                      onChange={() => setCurrentBot({...currentBot, status: 'inactive'})}
                      className="mr-2"
                    />
                    <span className="dark:text-gray-300 text-gray-700">Inactive</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300 text-gray-700">Avatar</label>
                <div className="flex gap-2">
                  {['🤖', '🤑', '✍️', '🧠', '👾'].map(emoji => (
                    <button 
                      key={emoji}
                      onClick={() => setCurrentBot({...currentBot, avatar: emoji})}
                      className={`text-2xl p-2 rounded-lg ${
                        currentBot.avatar === emoji 
                          ? 'dark:bg-blue-600 bg-blue-100' 
                          : 'dark:bg-neutral-700 bg-gray-100'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300 text-gray-700">Average TPU Consumption</label>
                <div className="flex items-center">
                  <input 
                    type="number" 
                    value={currentBot.averageTpuConsumption} 
                    onChange={(e) => setCurrentBot({...currentBot, averageTpuConsumption: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-700 dark:border-neutral-600 dark:text-white dark:focus:border-blue-500 bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                    placeholder="Enter average TPU consumption"
                  />
                  <div className="ml-2 text-sm text-gray-500">TPU</div>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Typical values: Support (270), Sales (450), Content (700)
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button 
                onClick={() => setShowEditModal(false)}
                className="py-2 px-4 rounded-lg dark:bg-neutral-700 dark:text-gray-300 dark:hover:bg-neutral-600 bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button 
                onClick={handleEditBot}
                className="py-2 px-4 rounded-lg dark:bg-blue-600 dark:hover:bg-blue-700 bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                disabled={!currentBot.name}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
