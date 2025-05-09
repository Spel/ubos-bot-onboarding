import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { getFromStorage, STORAGE_KEYS } from "../utils/localStorage";

export default function ProductLanding() {
  const darkMode = getFromStorage(STORAGE_KEYS.DARK_MODE, false);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-neutral-900' : 'bg-gray-50'}`}>
      <Header darkMode={darkMode} />
      <Sidebar darkMode={darkMode} />

      <div className="lg:ml-64" style={{ marginTop: '65px' }}>
        {/* Hero Section */}
        <div className={`px-4 py-16 sm:px-6 lg:px-8 ${darkMode ? 'bg-neutral-900' : 'bg-white'} border-b ${darkMode ? 'border-neutral-800' : 'border-gray-200'}`}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className={`text-4xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'} sm:text-6xl`}>
                Build Advanced AI Agents for Your Business
              </h1>
              <p className={`mt-6 text-lg leading-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Create, customize, and deploy AI agents that understand your business context and help automate complex tasks.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  to="/templates"
                  className={`rounded-md px-6 py-3 text-base font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${darkMode ? 'bg-blue-600 hover:bg-blue-500 focus-visible:outline-blue-600' : 'bg-blue-600 hover:bg-blue-500 focus-visible:outline-blue-600'}`}
                >
                  Get Started
                </Link>
                <Link
                  to="/cost-comparison"
                  className={`text-base font-semibold leading-6 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-900 hover:text-gray-700'}`}
                >
                  View Pricing <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Key Features Section */}
        <div className={`py-16 sm:py-24 ${darkMode ? 'bg-neutral-800' : 'bg-gray-50'}`}>
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className={`text-base font-semibold leading-7 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>Deploy Faster</h2>
              <p className={`mt-2 text-3xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'} sm:text-4xl`}>
                Everything you need to build AI agents
              </p>
              <p className={`mt-6 text-lg leading-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Our platform provides all the tools and features you need to create powerful AI agents that integrate seamlessly with your existing systems.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                <div className={`flex flex-col ${darkMode ? 'bg-neutral-700' : 'bg-white'} rounded-lg p-6`}>
                  <dt className={`flex items-center gap-x-3 text-base font-semibold leading-7 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <svg className={`size-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z" />
                    </svg>
                    Customizable Templates
                  </dt>
                  <dd className={`mt-4 flex flex-auto flex-col text-base leading-7 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <p className="flex-auto">Start with pre-built templates for common use cases and customize them to your needs. Save time and ensure best practices.</p>
                  </dd>
                </div>
                <div className={`flex flex-col ${darkMode ? 'bg-neutral-700' : 'bg-white'} rounded-lg p-6`}>
                  <dt className={`flex items-center gap-x-3 text-base font-semibold leading-7 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <svg className={`size-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                      <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Advanced Context Understanding
                  </dt>
                  <dd className={`mt-4 flex flex-auto flex-col text-base leading-7 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <p className="flex-auto">Train agents with your business documents, websites, and data. They understand your context and provide relevant responses.</p>
                  </dd>
                </div>
                <div className={`flex flex-col ${darkMode ? 'bg-neutral-700' : 'bg-white'} rounded-lg p-6`}>
                  <dt className={`flex items-center gap-x-3 text-base font-semibold leading-7 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <svg className={`size-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M2 4.25A2.25 2.25 0 014.25 2h11.5A2.25 2.25 0 0118 4.25v8.5A2.25 2.25 0 0115.75 15h-3.105a3.501 3.501 0 001.1 1.677A.75.75 0 0113.26 18H6.74a.75.75 0 01-.484-1.323A3.501 3.501 0 007.355 15H4.25A2.25 2.25 0 012 12.75v-8.5zm1.5 0a.75.75 0 01.75-.75h11.5a.75.75 0 01.75.75v7.5a.75.75 0 01-.75.75H4.25a.75.75 0 01-.75-.75v-7.5z" />
                    </svg>
                    Seamless Integrations
                  </dt>
                  <dd className={`mt-4 flex flex-auto flex-col text-base leading-7 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <p className="flex-auto">Connect your agents to popular business tools and APIs. Enable automated workflows and data synchronization.</p>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Use Cases Section */}
        <div className={`py-16 ${darkMode ? 'bg-neutral-900' : 'bg-white'}`}>
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className={`text-base font-semibold leading-7 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>Use Cases</h2>
              <p className={`mt-2 text-3xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'} sm:text-4xl`}>
                Transform your business processes
              </p>
              <p className={`mt-6 text-lg leading-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Our AI agents can be customized for a wide range of business applications. Here are some popular use cases:
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2">
                {[
                  {
                    title: "Customer Support",
                    description: "24/7 automated support that understands your products and services. Handle inquiries, troubleshoot issues, and escalate when needed.",
                    icon: (
                      <svg className={`size-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    )
                  },
                  {
                    title: "Sales Assistance",
                    description: "Qualify leads, answer product questions, and guide customers through the sales process. Integration with your CRM for seamless handoffs.",
                    icon: (
                      <svg className={`size-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )
                  },
                  {
                    title: "Content Generation",
                    description: "Create marketing copy, blog posts, social media content, and more. Maintain brand voice and optimize for different channels.",
                    icon: (
                      <svg className={`size-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    )
                  },
                  {
                    title: "Research & Analysis",
                    description: "Process large amounts of data, generate insights, and create reports. Perfect for market research and competitive analysis.",
                    icon: (
                      <svg className={`size-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    )
                  }
                ].map((useCase, index) => (
                  <div key={index} className={`flex flex-col ${darkMode ? 'bg-neutral-800' : 'bg-gray-50'} rounded-2xl p-8`}>
                    <div className="flex items-center gap-x-3">
                      {useCase.icon}
                      <h3 className={`text-lg font-semibold leading-7 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {useCase.title}
                      </h3>
                    </div>
                    <p className={`mt-4 text-base leading-7 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {useCase.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className={`${darkMode ? 'bg-neutral-800' : 'bg-gray-50'}`}>
          <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className={`text-3xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'} sm:text-4xl`}>
                Ready to transform your business?
              </h2>
              <p className={`mx-auto mt-6 max-w-xl text-lg leading-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Start building your AI agents today and experience the future of business automation.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  to="/create-agent"
                  className={`rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${darkMode ? 'bg-blue-600 hover:bg-blue-500 focus-visible:outline-blue-600' : 'bg-blue-600 hover:bg-blue-500 focus-visible:outline-blue-600'}`}
                >
                  Create Your First Agent
                </Link>
                <Link
                  to="/templates"
                  className={`text-sm font-semibold leading-6 ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}
                >
                  Browse Templates <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}