import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFromStorage, saveToStorage } from "../utils/localStorage";
import * as ABTestAnalytics from "../utils/abTestingAnalytics";

// Constants for A/B testing
const AB_TEST_STORAGE_KEY = "ab_test_variant";
const VARIANT_A = "original";
const VARIANT_B = "improved";
// Default to improved version (B) instead of 50/50 split
const DEFAULT_VARIANT = VARIANT_B;

/**
 * A/B Testing wrapper component
 * Determines which variant to show based on storage or random assignment
 * 
 * @param {Object} props
 * @param {React.Component} props.variantA - The original component
 * @param {React.Component} props.variantB - The improved component
 * @param {boolean} props.forceVariant - Optional parameter to force a specific variant (for testing)
 * @returns {React.Component}
 */
const ABTestWrapper = ({ variantA, variantB, forceVariant = null, testId = "agent_view" }) => {
  const [variant, setVariant] = useState(null);
  const params = useParams();
  const navigate = useNavigate();
  const startTimeRef = useRef(Date.now());
  const interactionsRef = useRef(0);

  // Check URL for variant override
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const variantParam = urlParams.get("variant");
    
    // If variant is specified in URL, use it and store it
    if (variantParam === VARIANT_A || variantParam === VARIANT_B) {
      saveToStorage(AB_TEST_STORAGE_KEY, variantParam);
      setVariant(variantParam);
      return;
    }
    
    // If forceVariant is provided, use it
    if (forceVariant) {
      setVariant(forceVariant);
      return;
    }

    // Check if user already has a variant assigned
    const storedVariant = getFromStorage(AB_TEST_STORAGE_KEY, null);
    
    if (storedVariant) {
      setVariant(storedVariant);
    } else {
      // Use improved version as default
      saveToStorage(AB_TEST_STORAGE_KEY, DEFAULT_VARIANT);
      setVariant(DEFAULT_VARIANT);
    }
  }, [forceVariant]);
  
  // Record page view and set up analytics when variant is determined
  useEffect(() => {
    if (variant) {
      // Initialize test if needed
      ABTestAnalytics.initializeTest(testId);
      
      // Record page view
      ABTestAnalytics.recordView(testId, variant);
      
      // Reset interaction counter
      interactionsRef.current = 0;
      
      // Reset start time
      startTimeRef.current = Date.now();
    }
  }, [variant, testId]);
  
  // Record time spent when component unmounts
  useEffect(() => {
    return () => {
      if (variant) {
        const timeSpentInSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
        ABTestAnalytics.recordTimeSpent(testId, variant, timeSpentInSeconds);
      }
    };
  }, [variant, testId]);

  // Record user interaction
  const recordInteraction = (interactionType = 'general') => {
    if (variant) {
      interactionsRef.current += 1;
      ABTestAnalytics.recordInteraction(testId, variant, interactionType);
    }
  };
  
  // Record task completion
  const recordTaskCompletion = () => {
    if (variant) {
      ABTestAnalytics.recordCompletedTask(testId, variant);
    }
  };
  
  // Record feedback score
  const recordFeedback = (score) => {
    if (variant) {
      ABTestAnalytics.recordFeedbackScore(testId, variant, score);
    }
  };
  
  // Handle switching variants (for testing purposes)
  const switchVariant = () => {
    // Record time spent before switching
    if (variant) {
      const timeSpentInSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
      ABTestAnalytics.recordTimeSpent(testId, variant, timeSpentInSeconds);
    }
    
    const newVariant = variant === VARIANT_A ? VARIANT_B : VARIANT_A;
    saveToStorage(AB_TEST_STORAGE_KEY, newVariant);
    
    // Reload with the new variant
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("variant", newVariant);
    navigate(`${window.location.pathname}?${urlParams.toString()}`);
  };
  
  // View test analytics
  const viewAnalytics = () => {
    const summary = ABTestAnalytics.getTestSummary(testId);
    console.log('A/B Test Summary:', summary);
    alert(
      `A/B Test Summary for ${testId}:\n\n` +
      `Original Version:\n` +
      `- Views: ${summary.variantA.views}\n` +
      `- Interactions: ${summary.variantA.interactions}\n` +
      `- Engagement Rate: ${(summary.variantA.engagementRate * 100).toFixed(2)}%\n` +
      `- Avg Time Spent: ${summary.variantA.avgTimeSpent.toFixed(2)}s\n\n` +
      `Improved Version:\n` +
      `- Views: ${summary.variantB.views}\n` +
      `- Interactions: ${summary.variantB.interactions}\n` +
      `- Engagement Rate: ${(summary.variantB.engagementRate * 100).toFixed(2)}%\n` +
      `- Avg Time Spent: ${summary.variantB.avgTimeSpent.toFixed(2)}s`
    );
  };

  if (!variant) {
    // Loading state while determining variant
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // State for panel visibility
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  
  // Toggle panel visibility
  const togglePanel = (e) => {
    if (e) e.stopPropagation();
    setIsPanelVisible(prev => !prev);
  };
  
  // Create a context with analytics functions to pass to the variant components
  const abTestContext = {
    variant,
    recordInteraction,
    recordTaskCompletion,
    recordFeedback
  };
  
  // Render the appropriate variant
  const SelectedVariant = variant === VARIANT_A ? variantA : variantB;
  
  return (
    <div onClick={() => recordInteraction('click')}>
      <SelectedVariant abTestContext={abTestContext} />
      
      {/* A/B Testing controls with slide-out panel */}
      {process.env.NODE_ENV === 'development' && (
        <>
          {/* More visible A/B testing button on the left side */}
          <button 
            onClick={togglePanel}
            className="fixed bottom-4 left-4 bg-blue-600 text-white px-3 py-2 rounded-md shadow-lg z-50 hover:bg-blue-700 transition-all duration-200 flex items-center gap-2"
            title="A/B Testing Controls"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
            <span>A/B Test</span>
          </button>
          
          {/* Slide-out panel */}
          <div 
            className={`fixed bottom-14 left-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg z-50 text-sm transition-all duration-300 ${isPanelVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}
            style={{ width: '300px' }}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">A/B Testing Controls</h3>
              <button 
                onClick={togglePanel}
                className="text-gray-400 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="mb-3 p-2 bg-gray-700 rounded">
              <div className="mb-1">Current variant:</div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${variant === VARIANT_A ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                <strong>{variant === VARIANT_A ? 'Original' : 'Improved'}</strong>
              </div>
            </div>
            
            <div className="space-y-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  switchVariant();
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 2v6h-6"></path>
                  <path d="M3 12a9 9 0 0 1 15-6.7l3-3"></path>
                  <path d="M3 22v-6h6"></path>
                  <path d="M21 12a9 9 0 0 1-15 6.7l-3 3"></path>
                </svg>
                Switch to {variant === VARIANT_A ? 'Improved' : 'Original'} Version
              </button>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  viewAnalytics();
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded text-sm flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3v18h18"></path>
                  <path d="M18 17V9"></path>
                  <path d="M13 17V5"></path>
                  <path d="M8 17v-3"></path>
                </svg>
                View Analytics
              </button>
            </div>
            
            <div className="mt-3 text-xs text-gray-400">
              Analytics data is stored locally in this browser.
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ABTestWrapper;
