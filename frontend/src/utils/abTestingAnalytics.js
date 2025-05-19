/**
 * A/B Testing Analytics Utility
 * Provides functions to track and analyze A/B test results
 */

// Constants
const AB_TEST_ANALYTICS_KEY = 'ab_test_analytics';
const VARIANT_A = 'original';
const VARIANT_B = 'improved';

/**
 * Initialize analytics for a specific test
 * @param {string} testId - Identifier for the test (e.g., 'agent_view')
 */
export const initializeTest = (testId) => {
  const analytics = getAnalyticsData();
  
  if (!analytics[testId]) {
    analytics[testId] = {
      [VARIANT_A]: {
        views: 0,
        interactions: 0,
        completedTasks: 0,
        timeSpent: 0,
        feedbackScores: []
      },
      [VARIANT_B]: {
        views: 0,
        interactions: 0,
        completedTasks: 0,
        timeSpent: 0,
        feedbackScores: []
      }
    };
    saveAnalyticsData(analytics);
  }
  
  return analytics[testId];
};

/**
 * Record a page view for a specific variant
 * @param {string} testId - Identifier for the test
 * @param {string} variant - The variant (VARIANT_A or VARIANT_B)
 */
export const recordView = (testId, variant) => {
  const analytics = getAnalyticsData();
  
  if (!analytics[testId]) {
    initializeTest(testId);
  }
  
  analytics[testId][variant].views += 1;
  saveAnalyticsData(analytics);
};

/**
 * Record an interaction with the page
 * @param {string} testId - Identifier for the test
 * @param {string} variant - The variant (VARIANT_A or VARIANT_B)
 * @param {string} interactionType - Type of interaction (e.g., 'click', 'form_submit')
 */
export const recordInteraction = (testId, variant, interactionType) => {
  const analytics = getAnalyticsData();
  
  if (!analytics[testId]) {
    initializeTest(testId);
  }
  
  analytics[testId][variant].interactions += 1;
  
  // You can also track specific interaction types if needed
  if (!analytics[testId][variant].interactionTypes) {
    analytics[testId][variant].interactionTypes = {};
  }
  
  if (!analytics[testId][variant].interactionTypes[interactionType]) {
    analytics[testId][variant].interactionTypes[interactionType] = 0;
  }
  
  analytics[testId][variant].interactionTypes[interactionType] += 1;
  saveAnalyticsData(analytics);
};

/**
 * Record a completed task
 * @param {string} testId - Identifier for the test
 * @param {string} variant - The variant (VARIANT_A or VARIANT_B)
 */
export const recordCompletedTask = (testId, variant) => {
  const analytics = getAnalyticsData();
  
  if (!analytics[testId]) {
    initializeTest(testId);
  }
  
  analytics[testId][variant].completedTasks += 1;
  saveAnalyticsData(analytics);
};

/**
 * Record time spent on the page
 * @param {string} testId - Identifier for the test
 * @param {string} variant - The variant (VARIANT_A or VARIANT_B)
 * @param {number} timeInSeconds - Time spent in seconds
 */
export const recordTimeSpent = (testId, variant, timeInSeconds) => {
  const analytics = getAnalyticsData();
  
  if (!analytics[testId]) {
    initializeTest(testId);
  }
  
  analytics[testId][variant].timeSpent += timeInSeconds;
  saveAnalyticsData(analytics);
};

/**
 * Record user feedback score
 * @param {string} testId - Identifier for the test
 * @param {string} variant - The variant (VARIANT_A or VARIANT_B)
 * @param {number} score - Feedback score (e.g., 1-5)
 */
export const recordFeedbackScore = (testId, variant, score) => {
  const analytics = getAnalyticsData();
  
  if (!analytics[testId]) {
    initializeTest(testId);
  }
  
  analytics[testId][variant].feedbackScores.push(score);
  saveAnalyticsData(analytics);
};

/**
 * Get analytics data for all tests
 * @returns {Object} Analytics data
 */
export const getAnalyticsData = () => {
  const data = localStorage.getItem(AB_TEST_ANALYTICS_KEY);
  return data ? JSON.parse(data) : {};
};

/**
 * Save analytics data
 * @param {Object} data - Analytics data to save
 */
const saveAnalyticsData = (data) => {
  try {
    localStorage.setItem(AB_TEST_ANALYTICS_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving A/B test analytics data:', error);
  }
};

/**
 * Get a summary of test results
 * @param {string} testId - Identifier for the test
 * @returns {Object} Test summary
 */
export const getTestSummary = (testId) => {
  const analytics = getAnalyticsData();
  
  if (!analytics[testId]) {
    return null;
  }
  
  const variantA = analytics[testId][VARIANT_A];
  const variantB = analytics[testId][VARIANT_B];
  
  // Calculate average feedback scores
  const avgScoreA = variantA.feedbackScores.length > 0 
    ? variantA.feedbackScores.reduce((sum, score) => sum + score, 0) / variantA.feedbackScores.length 
    : 0;
    
  const avgScoreB = variantB.feedbackScores.length > 0 
    ? variantB.feedbackScores.reduce((sum, score) => sum + score, 0) / variantB.feedbackScores.length 
    : 0;
  
  // Calculate engagement rates
  const engagementRateA = variantA.views > 0 ? variantA.interactions / variantA.views : 0;
  const engagementRateB = variantB.views > 0 ? variantB.interactions / variantB.views : 0;
  
  // Calculate task completion rates
  const completionRateA = variantA.views > 0 ? variantA.completedTasks / variantA.views : 0;
  const completionRateB = variantB.views > 0 ? variantB.completedTasks / variantB.views : 0;
  
  // Calculate average time spent
  const avgTimeA = variantA.views > 0 ? variantA.timeSpent / variantA.views : 0;
  const avgTimeB = variantB.views > 0 ? variantB.timeSpent / variantB.views : 0;
  
  return {
    variantA: {
      views: variantA.views,
      interactions: variantA.interactions,
      completedTasks: variantA.completedTasks,
      avgFeedbackScore: avgScoreA,
      engagementRate: engagementRateA,
      completionRate: completionRateA,
      avgTimeSpent: avgTimeA
    },
    variantB: {
      views: variantB.views,
      interactions: variantB.interactions,
      completedTasks: variantB.completedTasks,
      avgFeedbackScore: avgScoreB,
      engagementRate: engagementRateB,
      completionRate: completionRateB,
      avgTimeSpent: avgTimeB
    }
  };
};

/**
 * Reset analytics data for a specific test
 * @param {string} testId - Identifier for the test
 */
export const resetTestData = (testId) => {
  const analytics = getAnalyticsData();
  
  if (analytics[testId]) {
    delete analytics[testId];
    saveAnalyticsData(analytics);
  }
};

/**
 * Clear all analytics data
 */
export const clearAllAnalytics = () => {
  localStorage.removeItem(AB_TEST_ANALYTICS_KEY);
};

export default {
  initializeTest,
  recordView,
  recordInteraction,
  recordCompletedTask,
  recordTimeSpent,
  recordFeedbackScore,
  getAnalyticsData,
  getTestSummary,
  resetTestData,
  clearAllAnalytics
};
