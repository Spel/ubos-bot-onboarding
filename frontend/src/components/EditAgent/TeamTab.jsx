import React, { useState } from "react";
import { updateBot } from "../../utils/botsData";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const TeamTab = ({
  darkMode,
  formData,
  setFormData,
  templates,
  bot,
  botId
}) => {
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLeaderModal, setShowLeaderModal] = useState(false);
  const [selectedLeader, setSelectedLeader] = useState(null);

  // Get current team leader
  const getCurrentLeader = () => {
    if (formData.isTeamLeader) return formData;
    return formData.teamMembers.find(m => m.isTeamLeader) || formData;
  };

  // Handle drag end
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    // If dropped in leader area (droppable-leader)
    if (destination.droppableId === 'droppable-leader') {
      const draggedMember = formData.teamMembers[source.index];
      handleChangeLeader(draggedMember);
      return;
    }

    // If reordering team members
    if (source.droppableId === 'droppable-members' && destination.droppableId === 'droppable-members') {
      const items = Array.from(formData.teamMembers);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      const updatedFormData = {
        ...formData,
        teamMembers: items
      };

      setFormData(updatedFormData);
      updateBot(botId, updatedFormData);
    }
  };

  // Handle adding a team member
  const handleAddTeamMember = () => {
    if (!selectedTemplate) return;

    // Create a new team member from the selected template
    const newMember = {
      id: `team-${Date.now()}`,
      name: selectedTemplate.name,
      description: selectedTemplate.description,
      avatar: selectedTemplate.icon,
      type: selectedTemplate.category,
      framework: selectedTemplate.framework,
      templateId: selectedTemplate.id,
      addedAt: new Date().toISOString(),
      isTeamLeader: false
    };

    // Add to team members
    const updatedTeamMembers = [...formData.teamMembers, newMember];

    // Update form data
    setFormData(prev => ({
      ...prev,
      teamMembers: updatedTeamMembers
    }));

    // Save changes
    const updatedBot = {
      ...bot,
      teamMembers: updatedTeamMembers
    };

    updateBot(botId, updatedBot);

    // Close modal and reset selection
    setShowAddMemberModal(false);
    setSelectedTemplate(null);
  };

  // Handle removing a team member
  const handleRemoveTeamMember = (memberId) => {
    setMemberToDelete(formData.teamMembers.find(m => m.id === memberId));
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    const updatedTeamMembers = formData.teamMembers.filter(member => member.id !== memberToDelete.id);

    // Update form data
    setFormData(prev => ({
      ...prev,
      teamMembers: updatedTeamMembers
    }));

    // Save changes
    const updatedBot = {
      ...bot,
      teamMembers: updatedTeamMembers
    };

    updateBot(botId, updatedBot);
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
    const updatedTeamMembers = formData.teamMembers.map(member => ({
      ...member,
      isTeamLeader: member.id === selectedLeader.id
    }));

    // Update the previous default agent to be a regular team member
    const updatedFormData = {
      ...formData,
      teamMembers: updatedTeamMembers,
      isTeamLeader: selectedLeader.id === 'default'
    };

    // Update form data
    setFormData(updatedFormData);

    // Save changes
    const updatedBot = {
      ...bot,
      ...updatedFormData
    };

    updateBot(botId, updatedBot);
    setShowLeaderModal(false);
    setSelectedLeader(null);
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

  // Get type badge color
  const getTypeColor = (type) => {
    switch (type) {
      case 'support':
        return darkMode ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-800';
      case 'sales':
        return darkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800';
      case 'content':
      case 'marketing':
        return darkMode ? 'bg-purple-800 text-purple-200' : 'bg-purple-100 text-purple-800';
      case 'research':
        return darkMode ? 'bg-yellow-800 text-yellow-200' : 'bg-yellow-100 text-yellow-800';
      case 'hr':
        return darkMode ? 'bg-pink-800 text-pink-200' : 'bg-pink-100 text-pink-800';
      case 'legal':
        return darkMode ? 'bg-red-800 text-red-200' : 'bg-red-100 text-red-800';
      case 'finance':
        return darkMode ? 'bg-emerald-800 text-emerald-200' : 'bg-emerald-100 text-emerald-800';
      default:
        return darkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800';
    }
  };

  const renderAgentCard = (agent, index, isDraggable = true, isLeaderCard = false) => {
    const isLeader = agent.isTeamLeader || (agent === formData && agent.isTeamLeader);
    const content = (
      <div className={`${darkMode ? 'bg-neutral-700 border-neutral-600' : 'bg-white border-gray-200'} 
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
                  <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {agent.name}
                  </h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    isLeader
                      ? (darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800')
                      : (darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800')
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
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode 
                      ? 'bg-neutral-600 hover:bg-blue-900/50 text-gray-300 hover:text-blue-300' 
                      : 'bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600'
                  }`}
                  title="Make team leader"
                >
                  <svg className="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4L2 9.4h7.6L12 2z"/>
                  </svg>
                </button>
                {agent !== formData && (
                  <button
                    onClick={() => handleRemoveTeamMember(agent.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      darkMode 
                        ? 'bg-neutral-600 hover:bg-red-900/50 text-gray-300 hover:text-red-300' 
                        : 'bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600'
                    }`}
                    title="Remove team member"
                  >
                    <svg className="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>
          <p className={`text-sm mb-4 line-clamp-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {agent.description}
          </p>
          {agent !== formData && (
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
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
      <div className={`p-6 rounded-xl ${darkMode ? 'bg-neutral-800' : 'bg-white'} shadow-sm`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Team Members
          </h2>
          <button
            onClick={() => setShowAddMemberModal(true)}
            className={`py-2 px-4 rounded-lg ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors text-sm`}
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
        {formData.teamMembers?.length > 0 ? (
          <div className="mb-6">
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-neutral-700' : 'bg-gray-100'}`}>
              <h3 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Team Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Team Size</div>
                  <div className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {formData.teamMembers.length + 1} Agents
                  </div>
                </div>
                <div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Current Leader</div>
                  <div className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {getCurrentLeader().name}
                  </div>
                </div>
                <div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Frameworks</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {Array.from(new Set([...formData.teamMembers.map(member => member.framework)])).map(framework => (
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
                      ? (darkMode ? 'bg-blue-900/20' : 'bg-blue-50') 
                      : ''
                  } rounded-xl`}
                >
                  {/* Current Leader Card */}
                  <div className="w-full">
                    {getCurrentLeader() === formData ? (
                      <div className={`${darkMode ? 'bg-neutral-700 border-neutral-600' : 'bg-white border-gray-200'} 
                        border-2 border-blue-500 rounded-xl shadow-sm overflow-hidden transition-colors`}
                      >
                        {renderAgentCard(formData, 0, false, true)}
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
                    <div className={`mt-2 text-sm text-center ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      Drop here to make team leader
                    </div>
                  )}
                </div>
              )}
            </Droppable>

            {/* Team Members Grid - Droppable */}
            {formData.teamMembers?.length === 0 ? (
              <div className={`p-8 text-center rounded-lg border-2 border-dashed ${darkMode ? 'border-neutral-700 text-gray-400' : 'border-gray-300 text-gray-500'}`}>
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
                  className={`py-2 px-4 rounded-lg ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors text-sm`}
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
                    {formData.teamMembers
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
              <div className={`absolute inset-0 ${darkMode ? 'bg-black' : 'bg-gray-500'} opacity-75`}></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${darkMode ? 'bg-neutral-800' : 'bg-white'}`}>
              <div className={`px-4 pt-5 pb-4 sm:p-6 sm:pb-4 ${darkMode ? 'bg-neutral-800' : 'bg-white'}`}>
                <div className="sm:flex sm:items-start">
                  <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 ${darkMode ? 'bg-red-900' : 'bg-red-100'}`}>
                    <svg className={`h-6 w-6 ${darkMode ? 'text-red-300' : 'text-red-600'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className={`text-lg leading-6 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Remove Team Member
                    </h3>
                    <div className="mt-2">
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        Are you sure you want to remove {memberToDelete.name} from your team? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse ${darkMode ? 'bg-neutral-800 border-t border-neutral-700' : 'bg-gray-50 border-t border-gray-200'}`}>
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
                  className={`mt-3 w-full inline-flex justify-center rounded-md border ${
                    darkMode 
                      ? 'border-neutral-600 bg-neutral-700 hover:bg-neutral-600 text-gray-300' 
                      : 'border-gray-300 bg-white hover:bg-gray-50 text-gray-700'
                  } px-4 py-2 text-base font-medium focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm`}
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
              <div className={`absolute inset-0 ${darkMode ? 'bg-black' : 'bg-gray-500'} opacity-75`}></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div 
              className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full ${darkMode ? 'bg-neutral-800' : 'bg-white'}`}
            >
              <div className={`px-4 pt-5 pb-4 sm:p-6 sm:pb-4 ${darkMode ? 'bg-neutral-800' : 'bg-white'}`}>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className={`text-lg leading-6 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Add Team Member
                      </h3>
                      <button
                        onClick={() => setShowAddMemberModal(false)}
                        className={`rounded-md ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-500'} focus:outline-none`}
                      >
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-500'} text-sm mb-4`}>
                      Select a template to add a new team member to your agent team.
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                      {templates.map(template => (
                        <div 
                          key={template.id}
                          onClick={() => setSelectedTemplate(template)}
                          className={`${darkMode ? 'bg-neutral-700 hover:bg-neutral-600 border-neutral-600' : 'bg-white hover:bg-gray-50 border-gray-200'} border rounded-lg p-4 cursor-pointer transition-colors ${selectedTemplate?.id === template.id ? (darkMode ? 'ring-2 ring-blue-500' : 'ring-2 ring-blue-500') : ''}`}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className="text-2xl">{template.icon}</div>
                            <div>
                              <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {template.name}
                              </h4>
                              <div className="flex gap-2 mt-1">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(template.category)}`}>
                                  {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
                                </span>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getFrameworkColor(template.framework)}`}>
                                  {template.framework}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className={`text-xs line-clamp-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {template.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className={`px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse ${darkMode ? 'bg-neutral-800 border-t border-neutral-700' : 'bg-gray-50 border-t border-gray-200'}`}>
                <button
                  type="button"
                  disabled={!selectedTemplate}
                  onClick={handleAddTeamMember}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-base font-medium text-white focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50`}
                >
                  Add to Team
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className={`mt-3 w-full inline-flex justify-center rounded-md border ${darkMode ? 'border-neutral-600 bg-neutral-700 hover:bg-neutral-600 text-gray-300' : 'border-gray-300 bg-white hover:bg-gray-50 text-gray-700'} px-4 py-2 text-base font-medium focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm`}
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
              <div className={`absolute inset-0 ${darkMode ? 'bg-black' : 'bg-gray-500'} opacity-75`}></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${darkMode ? 'bg-neutral-800' : 'bg-white'}`}>
              <div className={`px-4 pt-5 pb-4 sm:p-6 sm:pb-4 ${darkMode ? 'bg-neutral-800' : 'bg-white'}`}>
                <div className="sm:flex sm:items-start">
                  <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 ${darkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                    <svg className={`h-6 w-6 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4L2 9.4h7.6L12 2z"/>
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className={`text-lg leading-6 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Change Team Leader
                    </h3>
                    <div className="mt-2">
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        Are you sure you want to make {selectedLeader.name} the team leader? This agent will be responsible for external communication and team coordination.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse ${darkMode ? 'bg-neutral-800 border-t border-neutral-700' : 'bg-gray-50 border-t border-gray-200'}`}>
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
                  className={`mt-3 w-full inline-flex justify-center rounded-md border ${
                    darkMode 
                      ? 'border-neutral-600 bg-neutral-700 hover:bg-neutral-600 text-gray-300' 
                      : 'border-gray-300 bg-white hover:bg-gray-50 text-gray-700'
                  } px-4 py-2 text-base font-medium focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm`}
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
