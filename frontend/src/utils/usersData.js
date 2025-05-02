/**
 * Utility functions for working with user data in localStorage
 */
import { saveToStorage, getFromStorage, STORAGE_KEYS } from './localStorage';

// Default users data for initial setup
const DEFAULT_USERS = [
  {
    id: '1',
    name: 'James Smith',
    email: 'james@site.com',
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80',
    position: 'Seller',
    department: 'Branding products',
    status: 'warning',
    progress: 60,
    created: '20 Dec, 09:27'
  },
  {
    id: '2',
    name: 'Anne Richard',
    email: 'anne@site.com',
    avatar: '',
    initials: 'A',
    position: 'Designer',
    department: 'IT department',
    status: 'active',
    progress: 100,
    created: '18 Dec, 15:20'
  }
];

/**
 * Get all users from localStorage or return default users if none exist
 * @returns {Array} Array of user objects
 */
export const getUsers = () => {
  return getFromStorage(STORAGE_KEYS.USERS, DEFAULT_USERS);
};

/**
 * Save users to localStorage
 * @param {Array} users - Array of user objects
 * @returns {Boolean} Success status
 */
export const saveUsers = (users) => {
  return saveToStorage(STORAGE_KEYS.USERS, users);
};

/**
 * Add a new user to localStorage
 * @param {Object} user - User object to add
 * @returns {Object} Newly added user with generated ID
 */
export const addUser = (user) => {
  const users = getUsers();
  
  // Generate a new ID
  const newId = (Math.max(...users.map(u => parseInt(u.id)), 0) + 1).toString();
  
  // Add created date
  const now = new Date();
  const formattedDate = `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })}, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
  // Create new user with ID and date
  const newUser = {
    ...user,
    id: newId,
    created: formattedDate
  };
  
  // Add to users array and save
  const updatedUsers = [...users, newUser];
  saveUsers(updatedUsers);
  
  return newUser;
};

/**
 * Update an existing user
 * @param {String} userId - ID of user to update
 * @param {Object} userData - Updated user data
 * @returns {Object|null} Updated user or null if not found
 */
export const updateUser = (userId, userData) => {
  const users = getUsers();
  const index = users.findIndex(user => user.id === userId);
  
  if (index === -1) return null;
  
  // Update user data
  const updatedUser = { ...users[index], ...userData };
  const updatedUsers = [...users];
  updatedUsers[index] = updatedUser;
  
  saveUsers(updatedUsers);
  return updatedUser;
};

/**
 * Delete a user
 * @param {String} userId - ID of user to delete
 * @returns {Boolean} Success status
 */
export const deleteUser = (userId) => {
  const users = getUsers();
  const filteredUsers = users.filter(user => user.id !== userId);
  
  if (filteredUsers.length === users.length) {
    return false; // User not found
  }
  
  return saveUsers(filteredUsers);
};

/**
 * Get a single user by ID
 * @param {String} userId - ID of user to retrieve
 * @returns {Object|null} User object or null if not found
 */
export const getUserById = (userId) => {
  const users = getUsers();
  return users.find(user => user.id === userId) || null;
};
