import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { getFromStorage, saveToStorage, STORAGE_KEYS } from "../utils/localStorage";

export default function SubscriptionPlans() {
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

  const plans = [
    {
      name: "Freemium Agent",
      price: 0,
      hourlyRate: 0,
      description: "10 hrs of AI uptime • Free",
      hours: 10,
      longDescription: "Get started with 10 free hours—perfect for testing your Agent's capabilities or handling light, exploratory tasks. No card required.",
      features: [
        "Access to core features",
        "Basic support",
        "No credit card required"
      ],
      useCases: [],
      buttonText: "Get Started",
      popular: false
    },
    {
      name: "Part-Time Agent",
      price: 49,
      hourlyRate: 0.41,
      description: "120 hrs of AI uptime • $0.41/hr",
      hours: 120,
      longDescription: "Perfect for light workloads, one-off tasks, or dipping your toes in automation. Unlock your Agent for 120 hours of runtime—like hiring a specialist for a few days each month, without the overhead.",
      features: [
        "Priority support",
        "Access to all features",
        "Multiple projects"
      ],
      useCases: [
        "Occasional support queries handled",
        "Quick data crunching or small analytics jobs",
        "Ad-hoc content creation & review"
      ],
      buttonText: "Choose Plan",
      popular: false
    },
    {
      name: "Half-Month Agent",
      price: 99,
      hourlyRate: 0.27,
      description: "360 hrs of AI uptime • $0.27/hr",
      hours: 360,
      longDescription: "Scale up your AI horsepower with a half-month commitment. Your Agent can tackle ongoing workflows—like a part-time team member who's always on call.",
      features: [
        "Priority support",
        "Access to all features",
        "Multiple projects",
        "Detailed analytics",
        "Custom integrations"
      ],
      useCases: [
        "Continuous customer support over peak periods",
        "Regular financial analysis & reporting",
        "Multi-channel marketing campaigns"
      ],
      buttonText: "Choose Plan",
      popular: true
    },
    {
      name: "Full-Time Agent",
      price: 149,
      hourlyRate: 0.20,
      description: "720 hrs of AI uptime • $0.20/hr",
      hours: 720,
      longDescription: "Your round-the-clock AI coworker—continuous, reliable, and the most cost-efficient option. Perfect for running 24/7 operations with maximum value.",
      features: [
        "Premium support",
        "Access to all features",
        "Unlimited projects",
        "Advanced analytics",
        "Custom integrations",
        "Dedicated account manager"
      ],
      useCases: [
        "Enterprise-level automation pipelines",
        "End-to-end project execution without interruptions",
        "High-volume, high-frequency tasks"
      ],
      buttonText: "Choose Plan",
      popular: false
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-neutral-900' : 'bg-gray-50'}`}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <Sidebar darkMode={darkMode} />
      <div style={{ paddingLeft: '16rem', paddingTop: '61px' }} className="h-screen overflow-hidden">
        <main className="w-full h-full overflow-auto p-4">
          <div className="max-w-[85rem] px-3 py-6 sm:px-4 lg:px-6 mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-6">
              <h2 className={`text-2xl font-bold md:text-3xl md:leading-tight ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Agent Work Time Plans
              </h2>
              <p className={`mt-3 text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Your AI agent needs time to work for you. Choose how much time you want to give them.
              </p>
              <p className={`mt-1 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-700'}`}>
                Think of it as hiring a digital worker—part-time, half-time, or full-time.
              </p>
              <div className="mt-3">
                <Link 
                  to="/cost-comparison" 
                  className={`inline-flex items-center text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                >
                  <svg className="mr-1 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20v-6M6 20V10M18 20V4"/>
                  </svg>
                  See how AI Agents compare to human workers
                </Link>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {plans.map((plan, index) => (
                <div 
                  key={index} 
                  className={`flex flex-col border ${darkMode ? 'border-neutral-700' : 'border-gray-200'} text-center rounded-xl p-5 ${
                    plan.popular 
                      ? 'border-blue-600 dark:border-blue-500' 
                      : darkMode ? 'border-neutral-700' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="py-1 px-2 inline-block text-xs font-medium bg-blue-600 text-white rounded-full mb-3 mx-auto">
                      Most popular
                    </div>
                  )}
                  <h4 className={`font-medium text-lg ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{plan.name}</h4>
                  <span className={`mt-2 font-bold text-4xl ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    ${plan.price}
                  </span>
                  <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {plan.description}
                  </p>
                  <div className={`mt-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} line-clamp-3`}>
                    {plan.longDescription}
                  </div>
                  
                  <div className="mt-4">
                    <h5 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      What's included:
                    </h5>
                    <ul className="space-y-1.5 text-sm">
                      <li className="flex space-x-2">
                        <svg className="flex-shrink-0 mt-0.5 size-4 text-blue-600 dark:text-blue-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span className={`${darkMode ? 'text-gray-400' : 'text-gray-800'} font-medium`}>{plan.hours} hours of Agent work time</span>
                      </li>
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex space-x-2">
                          <svg className="flex-shrink-0 mt-0.5 size-4 text-blue-600 dark:text-blue-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span className={`${darkMode ? 'text-gray-400' : 'text-gray-800'}`}>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {plan.useCases.length > 0 && (
                    <div className="mt-3">
                      <h5 className={`text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'} text-left`}>
                        Ideal for:
                      </h5>
                      <ul className="space-y-1.5 text-sm text-left">
                        {plan.useCases.map((useCase, useCaseIndex) => (
                          <li key={useCaseIndex} className="flex space-x-2">
                            <svg className="flex-shrink-0 mt-0.5 size-4 text-green-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                              <path d="m9 12 2 2 4-4" />
                            </svg>
                            <span className={`${darkMode ? 'text-gray-400' : 'text-gray-800'}`}>{useCase}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="mt-auto pt-4">
                    <button 
                      className={`w-full py-2.5 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border ${
                        plan.popular 
                          ? 'border-blue-600 bg-blue-600 text-white hover:bg-blue-700 hover:border-blue-700 dark:bg-blue-500 dark:border-blue-500 dark:hover:bg-blue-600 dark:hover:border-blue-600' 
                          : darkMode 
                            ? 'border-neutral-700 bg-neutral-800 text-white hover:bg-neutral-900' 
                            : 'border-gray-200 bg-white text-gray-800 hover:bg-gray-50'
                      }`}
                    >
                      {plan.buttonText}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Need a custom plan? <a className="text-blue-600 decoration-2 hover:underline font-medium dark:text-blue-500" href="mailto:sales@example.com">Contact us</a>
              </p>
              <p className={`mt-2 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                * Note: Your actual per-hour rate will vary slightly by Agent type (e.g. a Customer Support Agent may run at ~$0.38/hr, while a heavier-duty Marketing Agent could be closer to $0.45/hr).
              </p>
              <div className="mt-4">
                <Link 
                  to="/cost-comparison" 
                  className={`inline-flex items-center gap-x-2 py-2 px-4 rounded-lg ${
                    darkMode 
                      ? 'bg-neutral-800 hover:bg-neutral-700 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  } transition-colors text-sm`}
                >
                  <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 3v18h18"/>
                    <path d="m19 9-5 5-4-4-3 3"/>
                  </svg>
                  Compare AI Agent vs. Human Worker Costs
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
