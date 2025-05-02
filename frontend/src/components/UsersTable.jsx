import React, { useState, useEffect } from "react";
import { getUsers, addUser, updateUser, deleteUser } from "../utils/usersData";

export default function UsersTable({ darkMode = false }) {
  const [users, setUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    position: '',
    department: '',
    status: 'active',
    progress: 0
  });
  
  // Load users from localStorage on component mount
  useEffect(() => {
    setUsers(getUsers());
  }, []);
  
  // Handle input change for new user form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission for new user
  const handleAddUser = (e) => {
    e.preventDefault();
    
    // Add the new user and update state
    const createdUser = addUser(newUser);
    setUsers(prev => [...prev, createdUser]);
    
    // Reset form and close modal
    setNewUser({
      name: '',
      email: '',
      position: '',
      department: '',
      status: 'active',
      progress: 0
    });
    setShowAddModal(false);
  };
  
  // Handle user deletion
  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(userId);
      setUsers(prev => prev.filter(user => user.id !== userId));
    }
  };
  return (
    <div className="flex flex-col">
      <div className="-m-1.5 overflow-x-auto">
        <div className="p-1.5 min-w-full inline-block align-middle">
          <div className="bg-neutral-800 border border-neutral-700 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-neutral-700">
              <div>
                <h2 className="text-xl font-semibold text-white">Users</h2>
                <p className="text-sm text-neutral-400">Add users, edit and more.</p>
              </div>
              <div className="flex justify-end">
                <div className="inline-flex gap-x-2">
                  <a className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-neutral-700 bg-transparent text-neutral-300 hover:bg-neutral-700 disabled:opacity-50 disabled:pointer-events-none" href="#">View all</a>
                  <button 
                    className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                    onClick={() => setShowAddModal(true)}
                  >
                    <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
                    Add user
                  </button>
                </div>
              </div>
            </div>
            <table className="min-w-full divide-y divide-neutral-700">
              <thead className="bg-neutral-800">
                <tr>
                  <th scope="col" className="ps-6 py-3 text-start">
                    <div className="flex items-center gap-x-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-neutral-200">NAME</span>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-start">
                    <div className="flex items-center gap-x-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-neutral-200">POSITION</span>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-start">
                    <div className="flex items-center gap-x-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-neutral-200">STATUS</span>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-start">
                    <div className="flex items-center gap-x-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-neutral-200">PORTFOLIO</span>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-start">
                    <div className="flex items-center gap-x-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-neutral-200">CREATED</span>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-end"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-700">
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td className="ps-6 py-3">
                        <div className="flex items-center gap-x-3">
                          <img className="inline-block size-8 rounded-full" src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80" alt="User avatar" />
                          <div>
                            <span className="block text-sm font-semibold text-white">{user.name}</span>
                            <span className="block text-xs text-neutral-400">{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <div>
                          <span className="block text-sm font-medium text-white">{user.position}</span>
                          <span className="block text-xs text-neutral-400">{user.department}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        {user.status === 'active' ? (
                          <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-teal-500/10 text-teal-500 rounded-full">
                            <span className="size-1.5 rounded-full bg-teal-400"></span>
                            Active
                          </span>
                        ) : user.status === 'warning' ? (
                          <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-yellow-500/10 text-yellow-500 rounded-full">
                            <span className="size-1.5 rounded-full bg-yellow-400"></span>
                            Warning
                          </span>
                        ) : (
                          <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-red-500/10 text-red-500 rounded-full">
                            <span className="size-1.5 rounded-full bg-red-400"></span>
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-x-3">
                          <span className="text-xs text-neutral-400">{Math.floor(user.progress / 20)}/5</span>
                          <div className="flex w-24 h-1.5 bg-neutral-700 rounded-full overflow-hidden">
                            <div className="flex bg-blue-500 h-full rounded-full" style={{ width: `${user.progress}%` }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <span className="text-sm text-neutral-400">{user.created}</span>
                      </td>
                      <td className="px-6 py-3 text-end">
                        <div className="flex justify-end gap-2">
                          <button className="inline-flex items-center gap-x-1 text-sm text-blue-500 decoration-2 hover:underline font-medium">
                            Edit
                          </button>
                          <button 
                            className="inline-flex items-center gap-x-1 text-sm text-red-500 decoration-2 hover:underline font-medium"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-neutral-400">
                      No users found. Add a new user to get started.
                    </td>
                  </tr>
                )}
                
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-neutral-800 border border-neutral-700 rounded-xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-white mb-4">Add New User</h3>
            <form onSubmit={handleAddUser}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newUser.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={newUser.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1">Position</label>
                    <input
                      type="text"
                      name="position"
                      value={newUser.position}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1">Department</label>
                    <input
                      type="text"
                      name="department"
                      value={newUser.department}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1">Status</label>
                    <select
                      name="status"
                      value={newUser.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="warning">Warning</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1">Progress (%)</label>
                    <input
                      type="number"
                      name="progress"
                      value={newUser.progress}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-medium text-neutral-300 bg-neutral-700 rounded-lg hover:bg-neutral-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 