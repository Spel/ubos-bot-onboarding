import React, { useState } from "react";
import { getFromStorage, STORAGE_KEYS } from "../utils/localStorage";
import UserTable from "../components/UserTable";
import OpenWebUIUserModal from "../components/OpenWebUIUserModal";
import OpenWebUIUserEditModal from "../components/OpenWebUIUserEditModal";

export default function UserManagement() {
  const [darkMode, setDarkMode] = useState(getFromStorage(STORAGE_KEYS.DARK_MODE, false));
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Handle error from user table
  const handleError = (message) => {
    console.error("User table error:", message);
  };

  // Handle opening the edit user modal
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditUserModal(true);
  };

  // Handle successful user creation or update
  const handleUserSuccess = () => {
    // This will trigger a refresh of the user table
    setShowAddUserModal(false);
    setShowEditUserModal(false);
  };

  return (
    <div className={`h-screen flex flex-col ${darkMode ? 'bg-neutral-900' : 'bg-gray-50'}`}>
      {/* Page content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className={`flex justify-between items-center px-2 py-1 border-b ${darkMode ? 'border-neutral-700 text-white' : 'border-gray-200 text-gray-900'}`}>
          <h1 className="text-sm font-medium">User Management</h1>
          <button
            onClick={() => setShowAddUserModal(true)}
            className={`py-1 px-2 text-xs rounded ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}
          >
            Add User
          </button>
        </div>
        
        {/* User management */}
        <div className="flex-1 overflow-hidden">
          <UserTable
            darkMode={darkMode}
            onEditUser={handleEditUser}
            onUserDeleted={() => {}} // Just refresh automatically
            onError={handleError}
          />
        </div>
      </main>

      {/* Add User Modal */}
      <OpenWebUIUserModal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        darkMode={darkMode}
        onSuccess={handleUserSuccess}
      />

      {/* Edit User Modal */}
      <OpenWebUIUserEditModal
        isOpen={showEditUserModal}
        onClose={() => setShowEditUserModal(false)}
        darkMode={darkMode}
        user={selectedUser}
        onSuccess={handleUserSuccess}
      />
    </div>
  );
}