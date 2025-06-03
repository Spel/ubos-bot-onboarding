import React, { useState, useEffect } from "react";
import { updateBot } from "../../utils/botsData";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Link } from "react-router-dom";
import { getFromStorage, saveToStorage, STORAGE_KEYS } from "../../utils/localStorage";
import { getBots } from "../../utils/botsData";

const TeamTab = ({
  companyData,
  setCompanyData
}) => {
  // Load user's created bots as available agents
  const [userBots, setUserBots] = useState([]);
  
  // Load user's bots
  useEffect(() => {
    const bots = getBots();
    setUserBots(bots);
  }, []);

  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedBot, setSelectedBot] = useState(null);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLeaderModal, setShowLeaderModal] = useState(false);
  const [selectedLeader, setSelectedLeader] = useState(null);

  // Ensure teamMembers is initialized
  useEffect(() => {
    if (!companyData.teamMembers) {
      const updatedCompanyData = {
        ...companyData,
        teamMembers: []
      };
      setCompanyData(updatedCompanyData);
      saveToStorage(STORAGE_KEYS.COMPANY_DATA, updatedCompanyData);
    }
  }, []);

  // Get current team leader
  const getCurrentLeader = () => {
    if (!companyData.teamMembers || companyData.teamMembers.length === 0) {
      return companyData;
    }
    
    if (companyData.isTeamLeader) return companyData;
    return companyData.teamMembers.find(m => m.isTeamLeader) || companyData;
  };

  // Handle drag end
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    // If dropped in leader area (droppable-leader)
    if (destination.droppableId === 'droppable-leader') {
      const draggedMember = companyData.teamMembers[source.index];
      handleChangeLeader(draggedMember);
      return;
    }

    // If reordering team members
    if (source.droppableId === 'droppable-members' && destination.droppableId === 'droppable-members') {
      const items = Array.from(companyData.teamMembers || []);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      const updatedCompanyData = {
        ...companyData,
        teamMembers: items
      };

      setCompanyData(updatedCompanyData);
      saveToStorage(STORAGE_KEYS.COMPANY_DATA, updatedCompanyData);
    }
  };

  // Handle adding a team member
  const handleAddTeamMember = () => {
    if (!selectedBot) return;

    // Create a new team member from the selected bot
    const newMember = {
      id: `team-${Date.now()}`,
      name: selectedBot.name,
      description: selectedBot.description,
      avatar: selectedBot.avatar,
      type: selectedBot.type,
      framework: "UBOS.ai", // Default framework
      botId: selectedBot.id,
      addedAt: new Date().toISOString(),
      isTeamLeader: false
    };

    // Add to team members
    const updatedTeamMembers = [...(companyData.teamMembers || []), newMember];

    // Update company data
    const updatedCompanyData = {
      ...companyData,
      teamMembers: updatedTeamMembers
    };

    setCompanyData(updatedCompanyData);
    saveToStorage(STORAGE_KEYS.COMPANY_DATA, updatedCompanyData);

    // Close modal and reset selection
    setShowAddMemberModal(false);
    setSelectedBot(null);
  };

  // Handle removing a team member
  const handleRemoveTeamMember = (memberId) => {
    setMemberToDelete(companyData.teamMembers.find(m => m.id === memberId));
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    const updatedTeamMembers = (companyData.teamMembers || []).filter(member => member.id !== memberToDelete.id);

    // Update company data
    const updatedCompanyData = {
      ...companyData,
      teamMembers: updatedTeamMembers
    };

    setCompanyData(updatedCompanyData);
    saveToStorage(STORAGE_KEYS.COMPANY_DATA, updatedCompanyData);
    
    setShowDeleteModal(false);
    setMemberToDelete(null);
  };

  // Handle changing team leader
  const handleChangeLeader = (member) => {
    setSelectedLeader(member);
    setShowLeaderModal(true);
  };

  const confirmLeaderChange = () => {
    // Update the team leader status
    const updatedTeamMembers = (companyData.teamMembers || []).map(member => ({
      ...member,
      isTeamLeader: member.id === selectedLeader.id
    }));

    // Update the previous default agent to be a regular team member
    const updatedCompanyData = {
      ...companyData,
      teamMembers: updatedTeamMembers,
      isTeamLeader: selectedLeader.id === 'default'
    };

    // Update company data
    setCompanyData(updatedCompanyData);
    saveToStorage(STORAGE_KEYS.COMPANY_DATA, updatedCompanyData);
    
    setShowLeaderModal(false);
    setSelectedLeader(null);
  };
  // Get framework badge color
  const getFrameworkColor = (framework) => {
    switch (framework) {
      case 'UBOS.ai':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200';
      case 'Langflow':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200';
      case 'Crew.ai':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  // Get type badge color
  const getTypeColor = (type) => {
    switch (type) {
      case 'support':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200';
      case 'sales':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200';
      case 'content':
      case 'marketing':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200';
      case 'research':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200';
      case 'hr':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-800 dark:text-pink-200';
      case 'legal':
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200';
      case 'finance':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-200';
      case 'operations':
        return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-800 dark:text-cyan-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const renderAgentCard = (agent, index, isDraggable = true, isLeaderCard = false) => {
    const isLeader = agent.isTeamLeader || (agent === companyData && agent.isTeamLeader);
    const content = (
      <div className={`bg-white dark:bg-neutral-700 border-gray-200 dark:border-neutral-600 
        ${isLeader ? 'border-2 border-blue-500' : 'border'} 
        rounded-xl shadow-sm overflow-hidden group transition-all duration-200
        ${isDraggable ? 'hover:shadow-md cursor-grab active:cursor-grabbing' : ''}`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{agent.avatar || '🤖'}</div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {agent.name}
                  </h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    isLeader
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {isLeader ? 'Team Leader' : 'Team Member'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {agent.type && (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(agent.type)}`}>
                      {agent.type.charAt(0).toUpperCase() + agent.type.slice(1)}
                    </span>
                  )}
                  {agent.framework && (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getFrameworkColor(agent.framework)}`}>
                      {agent.framework}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {!isLeader && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleChangeLeader(agent)}
                  className="p-2 rounded-lg transition-colors bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 dark:bg-neutral-600 dark:hover:bg-blue-900/50 dark:text-gray-300 dark:hover:text-blue-300"
                  title="Make team leader"
                >
                  <svg className="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4L2 9.4h7.6L12 2z"/>
                  </svg>
                </button>
                <button
                  onClick={() => handleRemoveTeamMember(agent.id)}
                  className="p-2 rounded-lg transition-colors bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 dark:bg-neutral-600 dark:hover:bg-red-900/50 dark:text-gray-300 dark:hover:text-red-300"
                  title="Remove team member"
                >
                  <svg className="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            )}
          </div>
          <p className="text-sm mb-4 line-clamp-2 text-gray-600 dark:text-gray-300">
            {agent.description}
          </p>
          {agent.addedAt && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Added {new Date(agent.addedAt).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    );

    return isDraggable ? (
      <Draggable draggableId={agent.id || 'default'} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`${snapshot.isDragging ? 'z-50' : ''}`}
          >
            {content}
          </div>
        )}
      </Draggable>
    ) : content;
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-xl bg-white dark:bg-neutral-800 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Team Members
          </h2>
          <button
            onClick={() => setShowAddMemberModal(true)}
            className="py-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-colors text-sm"
          >
            <span className="flex items-center gap-x-2">
              <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add Team Member
            </span>
          </button>
        </div>

        {/* Team Information Section - Moved to top */}
        {companyData.teamMembers && companyData.teamMembers.length > 0 ? (
          <div className="mb-6">
            <div className="p-4 rounded-lg bg-gray-100 dark:bg-neutral-700">
              <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                Team Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Team Size</div>
                  <div className="text-lg font-medium text-gray-900 dark:text-white">
                    {companyData.teamMembers.length} Agents
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Current Leader</div>
                  <div className="text-lg font-medium text-gray-900 dark:text-white">
                    {getCurrentLeader().name}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Frameworks</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {Array.from(new Set([...companyData.teamMembers.map(member => member.framework)])).map(framework => (
                      <span key={framework} className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getFrameworkColor(framework)}`}>
                        {framework}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="space-y-4">
            {/* Team Leader Area - Droppable */}
            <Droppable droppableId="droppable-leader">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`w-full transition-colors ${
                    snapshot.isDraggingOver 
                      ? 'bg-blue-50 dark:bg-blue-900/20' 
                      : ''
                  } rounded-xl`}
                >
                  {/* Current Leader Card */}
                  <div className="w-full">
                    {getCurrentLeader() === companyData ? (
                      <div className="bg-white dark:bg-neutral-700 border-gray-200 dark:border-neutral-600 
                        border-2 border-blue-500 rounded-xl shadow-sm overflow-hidden transition-colors"
                      >
                        {renderAgentCard(companyData, 0, false, true)}
                      </div>
                    ) : (
                      <Draggable draggableId={getCurrentLeader().id} index={0}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {renderAgentCard(getCurrentLeader(), 0, true, true)}
                          </div>
                        )}
                      </Draggable>
                    )}
                  </div>
                  {provided.placeholder}
                  {snapshot.isDraggingOver && (
                    <div className="mt-2 text-sm text-center text-blue-600 dark:text-blue-400">
                      Drop here to make team leader
                    </div>
                  )}
                </div>
              )}
            </Droppable>

            {/* Team Members Grid - Droppable */}
            {!companyData.teamMembers || companyData.teamMembers.length === 0 ? (
              <div className="p-8 text-center rounded-lg border-2 border-dashed border-gray-300 text-gray-500 dark:border-neutral-700 dark:text-gray-400">
                <div className="flex justify-center mb-3">
                  <svg className="size-10 opacity-50" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-1">No Team Members</h3>
                <p className="mb-4">Add team members to create a multi-agent system</p>
                <button
                  onClick={() => setShowAddMemberModal(true)}
                  className="py-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-colors text-sm"
                >
                  Add Your First Team Member
                </button>
              </div>
            ) : (
              <Droppable droppableId="droppable-members">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    {companyData.teamMembers
                      .filter(member => !member.isTeamLeader)
                      .map((member, index) => (
                        <Draggable key={member.id} draggableId={member.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`${snapshot.isDragging ? 'z-50' : ''}`}
                            >
                              {renderAgentCard(member, index + 1)}
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            )}
          </div>
        </DragDropContext>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && memberToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-black opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full bg-white dark:bg-neutral-800">
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 bg-white dark:bg-neutral-800">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 bg-red-100 dark:bg-red-900">
                    <svg className="h-6 w-6 text-red-600 dark:text-red-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Remove Team Member
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-300">
                        Are you sure you want to remove {memberToDelete.name} from your team? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse bg-gray-50 border-t border-gray-200 dark:bg-neutral-800 dark:border-neutral-700">
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Remove
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setMemberToDelete(null);
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 dark:border-neutral-600 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-gray-300 px-4 py-2 text-base font-medium focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Team Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-black opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div 
              className="inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full bg-white dark:bg-neutral-800"
            >
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 bg-white dark:bg-neutral-800">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                        Add Team Member
                      </h3>
                      <button
                        onClick={() => setShowAddMemberModal(false)}
                        className="rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                      >
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="mt-2 text-gray-500 dark:text-gray-300 text-sm mb-4">
                      Select one of your existing agents to add to your company team.
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                      {userBots.length === 0 ? (
                        <div className="col-span-3 p-8 text-center rounded-lg border-2 border-dashed border-gray-300 text-gray-500 dark:border-neutral-700 dark:text-gray-400">
                          <div className="flex justify-center mb-3">
                            <svg className="size-10 opacity-50" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4L2 9.4h7.6L12 2z"/>
                            </svg>
                          </div>
                          <h3 className="text-lg font-medium mb-1">No Agents Found</h3>
                          <p className="mb-4">You need to create some agents first before you can add them to your team.</p>
                        </div>
                      ) : (
                        userBots.map(bot => (
                          <div
                            key={bot.id}
                            onClick={() => setSelectedBot(bot)}
                            className={`bg-white hover:bg-gray-50 border-gray-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:border-neutral-600 border rounded-lg p-4 cursor-pointer transition-colors ${selectedBot?.id === bot.id ? 'ring-2 ring-blue-500' : ''}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                {bot.avatar ? <img src={bot.avatar} alt={bot.name} className="h-full w-full object-cover" /> : bot.name.charAt(0)}
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  {bot.name}
                                </h4>
                                <div className="flex gap-1 mt-1">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getFrameworkColor(bot.framework)}`}>
                                    {bot.framework}
                                  </span>
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(bot.type)}`}>
                                    {bot.type}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <p className="text-xs line-clamp-2 text-gray-600 dark:text-gray-300 mt-2">
                              {bot.description || 'No description available'}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse bg-gray-50 border-t border-gray-200 dark:bg-neutral-800 dark:border-neutral-700">
                <button
                  type="button"
                  onClick={handleAddTeamMember}
                  disabled={!selectedBot}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 text-base font-medium text-white focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  Add to Team
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 dark:border-neutral-600 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-gray-300 px-4 py-2 text-base font-medium focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Team Leader Modal */}
      {showLeaderModal && selectedLeader && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-black opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full bg-white dark:bg-neutral-800">
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 bg-white dark:bg-neutral-800">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 bg-blue-100 dark:bg-blue-900">
                    <svg className="h-6 w-6 text-blue-600 dark:text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4L2 9.4h7.6L12 2z"/>
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Change Team Leader
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-300">
                        Are you sure you want to make {selectedLeader.name} the team leader? This will change the primary agent for your company.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse bg-gray-50 border-t border-gray-200 dark:bg-neutral-800 dark:border-neutral-700">
                <button
                  type="button"
                  onClick={confirmLeaderChange}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowLeaderModal(false);
                    setSelectedLeader(null);
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 dark:border-neutral-600 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-gray-300 px-4 py-2 text-base font-medium focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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

export default TeamTab;
