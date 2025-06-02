import React, { useState, useEffect } from "react";
import { getUsers, deleteUser, isAuthenticated, signIn } from "../utils/openWebUIApi";

/**
 * Component for displaying and managing Open WebUI users
 */
const OpenWebUIUserTable = ({ darkMode, onEditUser, onUserDeleted, onError, onLoginRequired }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "ascending" });

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  // Load users from the API
  const loadUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      // Check if authenticated
      const authenticated = await isAuthenticated();
      if (!authenticated) {
        if (onLoginRequired) {
          onLoginRequired();
        }
        setLoading(false);
        return;
      }

      const userData = await getUsers();
      setUsers(userData || []);
    } catch (err) {
      console.error("Failed to load users:", err);
      setError(err.message || "Failed to load users");
      if (onError) {
        onError(err.message || "Failed to load users");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user ${userName}?`)) {
      return;
    }

    try {
      await deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
      
      if (onUserDeleted) {
        onUserDeleted(userId);
      }
    } catch (err) {
      console.error("Failed to delete user:", err);
      setError(err.message || "Failed to delete user");
      if (onError) {
        onError(err.message || "Failed to delete user");
      }
    }
  };

  // Handle sorting
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Get sorted users
  const getSortedUsers = () => {
    const sortableUsers = [...users];
    if (sortConfig.key) {
      sortableUsers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableUsers;
  };

  // Filter users by search term
  const filteredUsers = getSortedUsers().filter(user => {
    return (
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  // Get sort indicator
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === "ascending" ? " ↑" : " ↓";
  };

  return (
    <div className={`${darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200'} border rounded-xl shadow-sm overflow-hidden`}>
      {/* Search bar */}
      <div className={`p-4 ${darkMode ? 'bg-neutral-700' : 'bg-gray-50'}`}>
        <div className={`relative ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </span>
          <input
            type="text"
            className={`py-2 pl-10 pr-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-neutral-600 text-white' : 'bg-white text-gray-900'}`}
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className={`p-4 ${darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'}`}>
          {error}
        </div>
      )}

      {/* Loading indicator */}
      {loading ? (
        <div className={`p-8 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent"></div>
          <p className="mt-2">Loading users...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className={darkMode ? 'bg-neutral-700' : 'bg-gray-50'}>
              <tr>
                <th 
                  scope="col" 
                  className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider cursor-pointer`}
                  onClick={() => requestSort("name")}
                >
                  User {getSortIndicator("name")}
                </th>
                <th 
                  scope="col" 
                  className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider cursor-pointer`}
                  onClick={() => requestSort("email")}
                >
                  Email {getSortIndicator("email")}
                </th>
                <th 
                  scope="col" 
                  className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider cursor-pointer`}
                  onClick={() => requestSort("role")}
                >
                  Role {getSortIndicator("role")}
                </th>
                <th 
                  scope="col" 
                  className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider cursor-pointer`}
                  onClick={() => requestSort("created_at")}
                >
                  Created {getSortIndicator("created_at")}
                </th>
                <th scope="col" className={`px-6 py-3 text-right text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y divide-gray-200 dark:divide-gray-700 ${darkMode ? 'bg-neutral-800' : 'bg-white'}`}>
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <tr key={user.id} className={darkMode ? 'hover:bg-neutral-700' : 'hover:bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 size-10 rounded-full flex items-center justify-center ${darkMode ? 'bg-blue-600' : 'bg-blue-100'}`}>
                          <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-blue-600'}`}>
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {user.name || "Unnamed User"}
                          </div>
                          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            ID: {user.id.substring(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'admin' 
                          ? (darkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800') 
                          : (darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800')
                      }`}>
                        {user.role || "user"}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => onEditUser(user)}
                        className={`text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3`}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id, user.name || user.email)}
                        className={`text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className={`px-6 py-4 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {searchTerm ? "No users found matching your search" : "No users found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Refresh button */}
      <div className={`p-4 flex justify-end ${darkMode ? 'bg-neutral-700' : 'bg-gray-50'}`}>
        <button
          onClick={loadUsers}
          disabled={loading}
          className={`px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Refreshing...' : 'Refresh Users'}
        </button>
      </div>
    </div>
  );
};

export default OpenWebUIUserTable;
