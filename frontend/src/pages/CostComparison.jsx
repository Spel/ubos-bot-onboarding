import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { getFromStorage, saveToStorage, STORAGE_KEYS } from "../utils/localStorage";

export default function CostComparison() {
  const [darkMode, setDarkMode] = useState(getFromStorage(STORAGE_KEYS.DARK_MODE, false));
  
  // Toggle dark mode function
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    // Save dark mode preference to localStorage
    saveToStorage(STORAGE_KEYS.DARK_MODE, newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  // Initialize theme from localStorage or default to light mode
  useEffect(() => {
    const savedDarkMode = getFromStorage(STORAGE_KEYS.DARK_MODE, false);
    setDarkMode(savedDarkMode);
    
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Cost comparison data
  const comparisonData = [
    {
      role: "Customer Support Representative",
      humanHourlyRate: 22,
      agentHourlyRate: 0.38,
      savingsPercentage: 98,
      benefits: [
        "24/7 availability without overtime costs",
        "Instant responses to common inquiries",
        "Consistent quality across all interactions",
        "No training or onboarding time"
      ]
    },
    {
      role: "Content Writer",
      humanHourlyRate: 35,
      agentHourlyRate: 0.41,
      savingsPercentage: 99,
      benefits: [
        "Create content at scale without fatigue",
        "Consistent tone and style across all materials",
        "Research and draft content simultaneously",
        "No writer's block or creative fatigue"
      ]
    },
    {
      role: "Data Analyst",
      humanHourlyRate: 45,
      agentHourlyRate: 0.45,
      savingsPercentage: 99,
      benefits: [
        "Process large datasets without human error",
        "Generate reports automatically on schedule",
        "Perform complex analyses in seconds",
        "Scale analysis across multiple projects simultaneously"
      ]
    },
    {
      role: "Administrative Assistant",
      humanHourlyRate: 25,
      agentHourlyRate: 0.35,
      savingsPercentage: 99,
      benefits: [
        "Schedule management without conflicts",
        "Email organization and prioritization",
        "Document preparation and formatting",
        "Never takes a sick day or vacation"
      ]
    }
  ];

  // Business impact scenarios
  const businessImpacts = [
    {
      title: "Small Business",
      description: "A small business replacing one full-time customer support representative with an AI Agent",
      humanCost: "$45,760/year",
      agentCost: "$1,080/year",
      savings: "$44,680/year",
      icon: (
        <svg className="size-8 text-blue-600 dark:text-blue-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
          <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
          <path d="M13 13h4" />
          <path d="M13 17h4" />
          <path d="M9 13h.01" />
          <path d="M9 17h.01" />
        </svg>
      )
    },
    {
      title: "Mid-Size Company",
      description: "A mid-size company using AI Agents for content creation across marketing channels",
      humanCost: "$145,600/year",
      agentCost: "$3,540/year",
      savings: "$142,060/year",
      icon: (
        <svg className="size-8 text-blue-600 dark:text-blue-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M7 7h10" />
          <path d="M7 12h10" />
          <path d="M7 17h10" />
        </svg>
      )
    },
    {
      title: "Enterprise",
      description: "An enterprise deploying AI Agents across multiple departments for 24/7 operations",
      humanCost: "$1,248,000/year",
      agentCost: "$25,920/year",
      savings: "$1,222,080/year",
      icon: (
        <svg className="size-8 text-blue-600 dark:text-blue-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16" />
          <path d="M3 7h18" />
          <path d="M5 21h14" />
          <path d="M9 5v16" />
          <path d="M15 5v16" />
        </svg>
      )
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-neutral-900' : 'bg-gray-50'}`}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <Sidebar darkMode={darkMode} />
      <div style={{ paddingLeft: '16rem', paddingTop: '61px' }} className="h-screen overflow-hidden">
        <main className="w-full h-full overflow-auto p-4">
          <div className="max-w-[85rem] px-4 py-8 sm:px-6 lg:px-8 mx-auto">
            {/* Hero Section */}
            <div className="max-w-3xl mx-auto text-center mb-10">
              <h1 className={`text-3xl font-bold md:text-4xl md:leading-tight ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                AI Agents vs. Human Workers
              </h1>
              <p className={`mt-4 text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                See how much your business can save by using AI Agents as digital workers
              </p>
              <div className="mt-6">
                <Link 
                  to="/subscription-plans" 
                  className={`inline-flex items-center gap-x-2 py-3 px-6 rounded-lg ${
                    darkMode 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  } transition-colors font-medium`}
                >
                  <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  Get Your AI Agent Now
                </Link>
              </div>
            </div>

            {/* Cost Comparison Table */}
            <div className={`${darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200'} border rounded-xl shadow-sm overflow-hidden mb-10`}>
              <div className={`p-6 ${darkMode ? 'border-neutral-700' : 'border-gray-200'} border-b`}>
                <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Cost Comparison: Human vs. AI Agent
                </h2>
                <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  See the dramatic cost difference between traditional employees and AI Agents for various roles
                </p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                  <thead className={darkMode ? 'bg-neutral-700' : 'bg-gray-50'}>
                    <tr>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                        Role
                      </th>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                        Human Worker ($/hour)
                      </th>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                        AI Agent ($/hour)
                      </th>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                        Cost Savings
                      </th>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                        Key Benefits
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`${darkMode ? 'bg-neutral-800' : 'bg-white'} divide-y divide-gray-200 dark:divide-neutral-700`}>
                    {comparisonData.map((item, index) => (
                      <tr key={index}>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {item.role}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          ${item.humanHourlyRate.toFixed(2)}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-green-400' : 'text-green-600'} font-medium`}>
                          ${item.agentHourlyRate.toFixed(2)}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'} font-medium`}>
                          {item.savingsPercentage}%
                        </td>
                        <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          <ul className="list-disc pl-5 space-y-1">
                            {item.benefits.map((benefit, benefitIndex) => (
                              <li key={benefitIndex}>{benefit}</li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Business Impact Cards */}
            <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Real Business Impact
            </h2>
            <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {businessImpacts.map((impact, index) => (
                <div 
                  key={index} 
                  className={`flex flex-col ${darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200'} border rounded-xl shadow-sm p-6`}
                >
                  <div className="flex items-center mb-4">
                    {impact.icon}
                    <h3 className={`ml-3 text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {impact.title}
                    </h3>
                  </div>
                  <p className={`mb-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {impact.description}
                  </p>
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-neutral-700' : 'bg-gray-100'} mb-3`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Human Cost:</span>
                      <span className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-600'} font-medium`}>{impact.humanCost}</span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>AI Agent Cost:</span>
                      <span className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-600'} font-medium`}>{impact.agentCost}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Annual Savings:</span>
                      <span className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'} font-medium`}>{impact.savings}</span>
                    </div>
                  </div>
                  <div className="mt-auto">
                    <Link 
                      to="/subscription-plans" 
                      className={`w-full inline-flex justify-center items-center py-2.5 px-4 text-sm font-medium rounded-lg ${
                        darkMode 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      } transition-colors`}
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Benefits Section */}
            <div className={`${darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200'} border rounded-xl shadow-sm p-6 mb-10`}>
              <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Beyond Cost Savings: Additional Benefits of AI Agents
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className={`text-lg font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Operational Benefits
                  </h3>
                  <ul className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li className="flex items-start">
                      <svg className="mt-1 mr-2 size-4 text-green-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>24/7 availability without overtime, shifts, or scheduling concerns</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="mt-1 mr-2 size-4 text-green-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Instant scaling up or down based on business needs</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="mt-1 mr-2 size-4 text-green-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>No training or onboarding time required</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="mt-1 mr-2 size-4 text-green-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Consistent performance without fatigue or burnout</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className={`text-lg font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Strategic Advantages
                  </h3>
                  <ul className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li className="flex items-start">
                      <svg className="mt-1 mr-2 size-4 text-green-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Free up human talent for high-value creative and strategic work</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="mt-1 mr-2 size-4 text-green-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Reduce overhead costs associated with physical office space</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="mt-1 mr-2 size-4 text-green-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Improve customer satisfaction with instant responses</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="mt-1 mr-2 size-4 text-green-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Gain competitive advantage through operational efficiency</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className={`${darkMode ? 'bg-blue-900' : 'bg-blue-50'} rounded-xl p-8 text-center`}>
              <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-blue-800'}`}>
                Ready to Transform Your Business?
              </h2>
              <p className={`mb-6 ${darkMode ? 'text-blue-100' : 'text-blue-700'}`}>
                Start saving today by replacing expensive human labor with cost-effective AI Agents
              </p>
              <Link 
                to="/subscription-plans" 
                className={`inline-flex items-center gap-x-2 py-3 px-6 rounded-lg ${
                  darkMode 
                    ? 'bg-white text-blue-800 hover:bg-gray-100' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                } transition-colors font-medium`}
              >
                View Subscription Plans
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
