import React, { useState } from "react";

const ServicesTab = ({ 
  darkMode, 
  companyData, 
  setCompanyData
}) => {
  const [newService, setNewService] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    currency: "USD",
    billingCycle: "monthly",
    agentWorkflow: "",
    isActive: true
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  // Handle form input changes for new service
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewService(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Add new service
  const handleAddService = (e) => {
    e.preventDefault();
    
    if (isEditing && editIndex !== null) {
      // Update existing service
      const updatedServices = [...companyData.services];
      updatedServices[editIndex] = {
        ...newService,
        id: companyData.services[editIndex].id
      };
      
      setCompanyData(prev => ({
        ...prev,
        services: updatedServices
      }));
      
      setIsEditing(false);
      setEditIndex(null);
    } else {
      // Add new service
      const id = Date.now().toString();
      
      setCompanyData(prev => ({
        ...prev,
        services: [...prev.services, { ...newService, id }]
      }));
    }
    
    // Reset form
    setNewService({
      id: "",
      name: "",
      description: "",
      price: "",
      currency: "USD",
      billingCycle: "monthly",
      agentWorkflow: "",
      isActive: true
    });
  };

  // Edit service
  const handleEditService = (index) => {
    setNewService({ ...companyData.services[index] });
    setIsEditing(true);
    setEditIndex(index);
  };

  // Delete service
  const handleDeleteService = (index) => {
    const updatedServices = [...companyData.services];
    updatedServices.splice(index, 1);
    
    setCompanyData(prev => ({
      ...prev,
      services: updatedServices
    }));
  };

  // Format price display
  const formatPrice = (price, currency, billingCycle) => {
    const currencySymbols = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥'
    };
    
    const symbol = currencySymbols[currency] || currency;
    const cycleText = billingCycle === 'oneTime' ? '' : `/${billingCycle.substring(0, 2)}`;
    
    return `${symbol}${price}${cycleText}`;
  };

  return (
    <div className="space-y-6">
      {/* Services List */}
      <div className={`p-6 rounded-xl ${darkMode ? 'bg-neutral-800' : 'bg-white'} shadow-sm`}>
        <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Services</h2>
        
        {companyData.services.length > 0 ? (
          <div className="overflow-x-auto">
            <table className={`min-w-full divide-y ${darkMode ? 'divide-neutral-700' : 'divide-gray-200'}`}>
              <thead>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Service</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Price</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Agent Workflow</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Status</th>
                  <th className={`px-6 py-3 text-right text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-neutral-700' : 'divide-gray-200'}`}>
                {companyData.services.map((service, index) => (
                  <tr key={service.id}>
                    <td className="px-6 py-4">
                      <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{service.name}</div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{service.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {formatPrice(service.price, service.currency, service.billingCycle)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {service.agentWorkflow || 'Not specified'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        service.isActive
                          ? (darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800')
                          : (darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-800')
                      }`}>
                        {service.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditService(index)}
                        className={`text-blue-500 hover:text-blue-700 mr-4 ${darkMode ? 'hover:text-blue-400' : 'hover:text-blue-600'}`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteService(index)}
                        className={`text-red-500 hover:text-red-700 ${darkMode ? 'hover:text-red-400' : 'hover:text-red-600'}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No services added yet. Add your first service below.
          </div>
        )}
      </div>
      
      {/* Add/Edit Service Form */}
      <div className={`p-6 rounded-xl ${darkMode ? 'bg-neutral-800' : 'bg-white'} shadow-sm`}>
        <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {isEditing ? 'Edit Service' : 'Add New Service'}
        </h2>
        
        <form onSubmit={handleAddService}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Service Name */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Service Name
              </label>
              <input
                type="text"
                name="name"
                value={newService.name}
                onChange={handleChange}
                required
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-neutral-700 border-neutral-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter service name"
              />
            </div>
            
            {/* Price */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Price
              </label>
              <div className="flex">
                <select
                  name="currency"
                  value={newService.currency}
                  onChange={handleChange}
                  className={`w-24 px-3 py-2 rounded-l-lg border-y border-l ${
                    darkMode 
                      ? 'bg-neutral-700 border-neutral-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="USD">$</option>
                  <option value="EUR">€</option>
                  <option value="GBP">£</option>
                  <option value="JPY">¥</option>
                </select>
                <input
                  type="text"
                  name="price"
                  value={newService.price}
                  onChange={handleChange}
                  required
                  className={`flex-1 px-3 py-2 border-y ${
                    darkMode 
                      ? 'bg-neutral-700 border-neutral-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="0.00"
                />
                <select
                  name="billingCycle"
                  value={newService.billingCycle}
                  onChange={handleChange}
                  className={`w-32 px-3 py-2 rounded-r-lg border-y border-r ${
                    darkMode 
                      ? 'bg-neutral-700 border-neutral-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="monthly">/month</option>
                  <option value="yearly">/year</option>
                  <option value="weekly">/week</option>
                  <option value="daily">/day</option>
                  <option value="oneTime">One-time</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {/* Description */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Description
              </label>
              <textarea
                name="description"
                value={newService.description}
                onChange={handleChange}
                rows="2"
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-neutral-700 border-neutral-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Describe the service"
              />
            </div>
            
            {/* Agent Workflow */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Agent Workflow
              </label>
              <input
                type="text"
                name="agentWorkflow"
                value={newService.agentWorkflow}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-neutral-700 border-neutral-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter agent workflow name or ID"
              />
            </div>
            
            {/* Active Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                id="isActive"
                checked={newService.isActive}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className={`ml-2 block text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Service is active and available for purchase
              </label>
            </div>
          </div>
          
          <div className="mt-6 flex items-center justify-end gap-3">
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditIndex(null);
                  setNewService({
                    id: "",
                    name: "",
                    description: "",
                    price: "",
                    currency: "USD",
                    billingCycle: "monthly",
                    agentWorkflow: "",
                    isActive: true
                  });
                }}
                className={`px-4 py-2 rounded-lg ${
                  darkMode 
                    ? 'bg-neutral-700 hover:bg-neutral-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                } transition-colors text-sm font-medium`}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg ${
                darkMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              } transition-colors text-sm font-medium`}
            >
              {isEditing ? 'Update Service' : 'Add Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServicesTab;
