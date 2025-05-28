import React, { useState } from 'react';
import { Search, Star, Users, MessageCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { getFromStorage, STORAGE_KEYS } from '../utils/localStorage';

export default function Marketplace() {
  const navigate = useNavigate();
  const storedDarkMode = getFromStorage(STORAGE_KEYS.DARK_MODE, false);
  const [darkMode] = useState(storedDarkMode);
  const [searchQuery, setSearchQuery] = useState('');

  // Sample agents data - in real app would come from API/backend
  const myAgents = [
    {
      id: 1,
      name: 'My Custom Support Bot',
      description: 'Personalized customer support agent with company knowledge',
      rating: 4.8,
      conversations: 1280,
      lastActive: '2 hours ago',
      image: '🤖'
    },
    {
      id: 2,
      name: 'Sales Helper',
      description: 'AI assistant for qualifying leads and sales outreach',
      rating: 4.7,
      conversations: 890,
      lastActive: '5 mins ago',
      image: '💼'
    }
  ];

  const orgAgents = [
    {
      id: 3,
      name: 'Marketing Team Assistant',
      description: 'Organization-wide marketing content creator',
      rating: 4.9,
      conversations: 2340,
      lastActive: '1 hour ago',
      image: '📢'
    },
    {
      id: 4,
      name: 'HR Bot',
      description: 'Internal HR assistant for employee queries',
      rating: 4.6,
      conversations: 567,
      lastActive: '30 mins ago',
      image: '👥'
    }
  ];

  const externalAgents = [
    {
      id: 5,
      name: 'General Support Pro',
      description: '24/7 customer support agent with multi-language capabilities',
      rating: 4.9,
      conversations: 15670,
      creator: 'UBOS.ai',
      pricing: 'From $19/mo',
      image: '💬'
    },
    {
      id: 6,
      name: 'Data Analyst',
      description: 'Advanced data analysis and visualization assistant',
      rating: 4.7,
      conversations: 8901,
      creator: 'Analytics Corp',
      pricing: 'From $29/mo',
      image: '📊'
    }
  ];

  const handleChatClick = (agentId) => {
    navigate(`/chat/${agentId}`);
  };

  // Filter agents based on search query
  const filterAgents = (agents) => {
    if (!searchQuery) return agents;
    return agents.filter(agent => 
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const renderAgentCard = (agent, type) => (
    <div
      key={agent.id}
      className={`rounded-lg shadow-sm border ${
        darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200'
      } hover:shadow-md transition-all cursor-pointer`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`text-2xl p-2 rounded-lg ${darkMode ? 'bg-neutral-700' : 'bg-gray-100'}`}>
              {agent.image}
            </div>
            <div>
              <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {agent.name}
              </h3>
              {type === 'external' && (
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  by {agent.creator}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm font-medium">{agent.rating}</span>
          </div>
        </div>
        
        <p className={`text-sm mb-4 line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {agent.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm gap-3">
            <div className="flex items-center">
              <MessageCircle className="h-4 w-4 mr-1" />
              <span>{agent.conversations.toLocaleString()}</span>
            </div>
            {(type === 'my' || type === 'org') && (
              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Active {agent.lastActive}
              </span>
            )}
            {type === 'external' && (
              <span className={`text-sm font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                {agent.pricing}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => handleChatClick(agent.id)}
          className={`w-full px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            darkMode
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          Chat with Agent
        </button>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-neutral-900' : 'bg-gray-50'}`}>
      <Header darkMode={darkMode} />
      <Sidebar darkMode={darkMode} />

      <div style={{ paddingLeft: '16rem', paddingTop: '61px' }}>
        <main className="w-full overflow-y-auto p-4 md:p-6 max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              AI Agents Marketplace
            </h1>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Chat with AI agents to get help with your tasks
            </p>
          </div>

          {/* Search bar */}
          <div className="relative max-w-md w-full mb-8">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <input
              type="text"
              placeholder="Search agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`block w-full pl-10 pr-3 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-neutral-800 border-neutral-700 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
          </div>

          {/* My Agents Section */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                My Agents
              </h2>
              <Link 
                to="/create-agent"
                className={`text-sm font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
              >
                Create New Agent
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterAgents(myAgents).map(agent => renderAgentCard(agent, 'my'))}
            </div>
          </section>

          {/* Organization Agents Section */}
          <section className="mb-8">
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Organization Agents
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterAgents(orgAgents).map(agent => renderAgentCard(agent, 'org'))}
            </div>
          </section>

          {/* External Agents Section */}
          <section className="mb-8">
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              External Agents
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterAgents(externalAgents).map(agent => renderAgentCard(agent, 'external'))}
            </div>
          </section>

          {/* Empty state when no results found */}
          {searchQuery && !filterAgents(myAgents).length && !filterAgents(orgAgents).length && !filterAgents(externalAgents).length && (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-medium mb-2">No agents found</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Try adjusting your search to find what you're looking for
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}