import React, { useState } from "react";
import { createUser } from "../utils/openWebUIApi";

/**
 * Modal component for creating new Open WebUI users
 */
const OpenWebUIUserModal = ({ isOpen, onClose, darkMode, onSuccess }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await createUser(
        formData.email,
        formData.password,
        formData.name
      );
      setIsLoading(false);
      
      // Reset form
      setFormData({
        email: "",
        password: "",
        name: "",
      });
      
      // Call success callback with the created user data
      if (onSuccess) {
        onSuccess(result);
      }
      
      // Close the modal
      onClose();
    } catch (err) {
      setIsLoading(false);
      setError(err.message || "Failed to create user");
    }
  };

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        {/* Modal panel */}
        <div
          className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${
            darkMode ? "bg-neutral-800" : "bg-white"
          }`}
        >
          <div className={`px-4 pt-5 pb-4 sm:p-6 sm:pb-4`}>
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3
                  className={`text-lg leading-6 font-medium ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Create New Open WebUI User
                </h3>
                <div className="mt-4">
                  <form onSubmit={handleSubmit}>
                    {/* Error message */}
                    {error && (
                      <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                      </div>
                    )}

                    {/* Name field */}
                    <div className="mb-4">
                      <label
                        htmlFor="name"
                        className={`block text-sm font-medium ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                          darkMode
                            ? "bg-neutral-700 text-white border-neutral-600"
                            : "border-gray-300"
                        }`}
                      />
                    </div>

                    {/* Email field */}
                    <div className="mb-4">
                      <label
                        htmlFor="email"
                        className={`block text-sm font-medium ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                          darkMode
                            ? "bg-neutral-700 text-white border-neutral-600"
                            : "border-gray-300"
                        }`}
                      />
                    </div>

                    {/* Password field */}
                    <div className="mb-4">
                      <label
                        htmlFor="password"
                        className={`block text-sm font-medium ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength="6"
                        className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                          darkMode
                            ? "bg-neutral-700 text-white border-neutral-600"
                            : "border-gray-300"
                        }`}
                      />
                    </div>

                    {/* Action buttons */}
                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm ${
                          isLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {isLoading ? "Creating..." : "Create User"}
                      </button>
                      <button
                        type="button"
                        onClick={onClose}
                        className={`mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 text-base font-medium sm:mt-0 sm:col-start-1 sm:text-sm ${
                          darkMode
                            ? "border-neutral-600 bg-neutral-700 text-gray-300 hover:bg-neutral-600"
                            : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenWebUIUserModal;
