import React, { useState, useEffect, useMemo } from "react";
import { getUsers, deleteUser } from "../utils/openWebUIApi";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "./ui/table";
import { Search } from "lucide-react";

/**
 * Component for displaying and managing users with shadcn UI styling
 * @param {Object} props - Component props
 * @param {boolean} props.darkMode - Whether dark mode is enabled
 * @param {Function} props.onEditUser - Handler for editing a user
 * @param {Function} props.onUserDeleted - Handler called after user deletion
 * @param {Function} props.onError - Handler for errors
 * @param {Function} props.onLoginRequired - Handler for login required
 * @param {boolean} props.skipAuthCheck - Whether to skip authentication check
 */
const UserTable = ({ darkMode, onEditUser, onUserDeleted, onError, onLoginRequired, skipAuthCheck = false }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "descending",
  });

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  // Load users from API
  const loadUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const userData = await getUsers();
      setUsers(userData || []);
    } catch (err) {
      console.error("Error loading users:", err);
      setError(err.message || "Failed to load users");
      if (onError) onError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete ${userName || 'this user'}?`)) {
      return;
    }

    try {
      await deleteUser(userId);
      
      // Remove user from state
      setUsers(users.filter(user => user.id !== userId));
      
      if (onUserDeleted) {
        onUserDeleted(userId);
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      setError(err.message || "Failed to delete user");
      if (onError) onError(err.message || "Failed to delete user");
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

  // Get sort indicator
  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? "↑" : "↓";
    }
    return "";
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    let filtered = [...users];

    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          (user.name && user.name.toLowerCase().includes(lowerSearchTerm)) ||
          (user.email && user.email.toLowerCase().includes(lowerSearchTerm)) ||
          (user.role && user.role.toLowerCase().includes(lowerSearchTerm))
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [users, searchTerm, sortConfig]);

  return (
    <div className={`h-full flex flex-col ${darkMode ? 'bg-neutral-800' : 'bg-white'}`}>
      {/* Search bar */}
      <div className={`px-2 py-1 border-b ${darkMode ? 'border-neutral-700 bg-neutral-700/50' : 'border-gray-200 bg-gray-50'}`}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
            <Search className={`h-3 w-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
          <input
            type="text"
            placeholder="Search users..."
            className={`pl-7 pr-3 py-1 w-full text-xs rounded-sm ${darkMode ? 'bg-neutral-700 text-white border-neutral-600 placeholder-gray-400' : 'bg-white text-gray-900 border-gray-300 placeholder-gray-500'} focus:outline-none focus:ring-1 ${darkMode ? 'focus:ring-blue-500' : 'focus:ring-blue-500'}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className={`p-2 text-sm ${darkMode ? 'bg-red-900/20 text-red-300' : 'bg-red-100 text-red-800'}`}>
          {error}
        </div>
      )}

      {/* Loading indicator */}
      {loading ? (
        <div className={`flex-1 flex items-center justify-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <div>
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent"></div>
            <p className="mt-1 text-xs">Loading users...</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          <Table className="w-full">
            <TableHeader className={darkMode ? 'bg-neutral-700/50 sticky top-0 z-10' : 'bg-gray-50 sticky top-0 z-10'}>
              <TableRow className={darkMode ? 'border-neutral-600' : 'border-gray-200'}>
                <TableHead 
                  className={`cursor-pointer text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                  onClick={() => requestSort("name")}
                >
                  User {getSortIndicator("name")}
                </TableHead>
                <TableHead 
                  className={`cursor-pointer text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                  onClick={() => requestSort("email")}
                >
                  Email {getSortIndicator("email")}
                </TableHead>
                <TableHead 
                  className={`cursor-pointer text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                  onClick={() => requestSort("role")}
                >
                  Role {getSortIndicator("role")}
                </TableHead>
                <TableHead 
                  className={`cursor-pointer text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                  onClick={() => requestSort("created_at")}
                >
                  Created {getSortIndicator("created_at")}
                </TableHead>
                <TableHead className={`text-right text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <TableRow 
                    key={user.id} 
                    className={`${darkMode ? 'border-neutral-600 hover:bg-neutral-700/50' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    <TableCell>
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${darkMode ? 'bg-blue-600/20' : 'bg-blue-100'}`}>
                          <span className={`text-xs font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                          </span>
                        </div>
                        <div className="ml-2">
                          <div className={`text-xs font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {user.name || "Unnamed User"}
                          </div>
                          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            ID: {user.id.substring(0, 6)}...
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex px-1.5 py-0.5 text-xs font-medium rounded-full ${
                        user.role === 'admin' 
                          ? (darkMode ? 'bg-purple-900/20 text-purple-300' : 'bg-purple-100 text-purple-800') 
                          : (darkMode ? 'bg-blue-900/20 text-blue-300' : 'bg-blue-100 text-blue-800')
                      }`}>
                        {user.role || "user"}
                      </span>
                    </TableCell>
                    <TableCell className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {formatDate(user.created_at)}
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <button
                        onClick={() => onEditUser(user)}
                        className={`px-2 py-0.5 text-xs rounded ${darkMode ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/20' : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'}`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id, user.name || user.email)}
                        className={`px-2 py-0.5 text-xs rounded ${darkMode ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20' : 'text-red-600 hover:text-red-700 hover:bg-red-50'}`}
                      >
                        Delete
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className={darkMode ? 'border-neutral-600' : 'border-gray-200'}>
                  <TableCell colSpan="5" className="text-center py-4">
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {searchTerm ? "No users found matching your search" : "No users found"}
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Refresh button */}
      <div className={`py-1 px-2 flex justify-end border-t ${darkMode ? 'border-neutral-700 bg-neutral-700/50' : 'border-gray-200 bg-gray-50'}`}>
        <button
          onClick={loadUsers}
          disabled={loading}
          className={`px-2 py-0.5 text-xs rounded ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
    </div>
  );
};

export default UserTable;
