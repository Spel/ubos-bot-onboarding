import { getFromStorage, saveToStorage, STORAGE_KEYS } from './localStorage';

/**
 * Dashboard metrics and usage statistics management
 */

// Default dashboard data
const defaultDashboardData = {
  lastUpdated: new Date().toISOString(),
  stats: {
    totalUsers: 72540,
    sessionsRate: 29.4,
    clickRate: 56.8,
    pageviews: 92913
  },
  recentActivities: []
};

// Default usage statistics
const defaultUsageStats = {
  lastUpdated: new Date().toISOString(),
  daily: {
    date: new Date().toISOString(),
    tpuUsage: 2100,
    botExecutions: 42,
    userInteractions: 78
  },
  weekly: {
    startDate: new Date().toISOString(),
    tpuUsage: 14500,
    botExecutions: 289,
    userInteractions: 543
  },
  monthly: {
    startDate: new Date().toISOString(),
    tpuUsage: 67300,
    botExecutions: 1345,
    userInteractions: 2467
  },
  // Historical data for charts
  history: {
    tpuConsumption: generateSampleData(30, 500, 2000),
    botExecutions: generateSampleData(30, 10, 80),
    userInteractions: generateSampleData(30, 20, 150)
  }
};

// Default notifications
const defaultNotifications = {
  items: [
    {
      id: '1',
      title: 'Welcome to UBOS!',
      message: 'Get started by creating your first AI agent.',
      type: 'info',
      read: false,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'System update completed',
      message: 'The platform has been updated with new features.',
      type: 'system',
      read: false,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  lastChecked: new Date().toISOString()
};

// Helper function to generate sample data for charts
function generateSampleData(days, min, max) {
  const data = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString(),
      value: Math.floor(Math.random() * (max - min + 1)) + min
    });
  }
  
  return data;
}

/**
 * Initialize metrics and statistics with defaults if not already set
 */
export const initMetricsData = () => {
  // Initialize dashboard data
  if (!getFromStorage(STORAGE_KEYS.DASHBOARD_DATA)) {
    saveToStorage(STORAGE_KEYS.DASHBOARD_DATA, defaultDashboardData);
  }
  
  // Initialize usage statistics
  if (!getFromStorage(STORAGE_KEYS.USAGE_STATISTICS)) {
    saveToStorage(STORAGE_KEYS.USAGE_STATISTICS, defaultUsageStats);
  }
  
  // Initialize notifications
  if (!getFromStorage(STORAGE_KEYS.NOTIFICATIONS)) {
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, defaultNotifications);
  }
  
  // Initialize recent activities
  if (!getFromStorage(STORAGE_KEYS.RECENT_ACTIVITIES)) {
    saveToStorage(STORAGE_KEYS.RECENT_ACTIVITIES, []);
  }
};

/**
 * Get dashboard data
 * @returns {Object} Dashboard data
 */
export const getDashboardData = () => {
  return getFromStorage(STORAGE_KEYS.DASHBOARD_DATA, defaultDashboardData);
};

/**
 * Update dashboard data
 * @param {Object} data - Updated dashboard data
 * @returns {Object} Updated dashboard data
 */
export const updateDashboardData = (data) => {
  const currentData = getDashboardData();
  const updatedData = {
    ...currentData,
    ...data,
    lastUpdated: new Date().toISOString()
  };
  
  saveToStorage(STORAGE_KEYS.DASHBOARD_DATA, updatedData);
  return updatedData;
};

/**
 * Get usage statistics
 * @returns {Object} Usage statistics
 */
export const getUsageStatistics = () => {
  return getFromStorage(STORAGE_KEYS.USAGE_STATISTICS, defaultUsageStats);
};

/**
 * Update usage statistics
 * @param {Object} data - Updated usage statistics
 * @returns {Object} Updated usage statistics
 */
export const updateUsageStatistics = (data) => {
  const currentStats = getUsageStatistics();
  const updatedStats = {
    ...currentStats,
    ...data,
    lastUpdated: new Date().toISOString()
  };
  
  saveToStorage(STORAGE_KEYS.USAGE_STATISTICS, updatedStats);
  return updatedStats;
};

/**
 * Record a new bot execution 
 * @param {string} botId - ID of the bot that was executed
 * @param {number} tpuUsed - Amount of TPU used
 * @returns {Object} Updated usage statistics
 */
export const recordBotExecution = (botId, tpuUsed = 100) => {
  // Update usage statistics
  const stats = getUsageStatistics();
  
  // Update daily stats
  stats.daily.tpuUsage += tpuUsed;
  stats.daily.botExecutions += 1;
  
  // Update weekly stats
  stats.weekly.tpuUsage += tpuUsed;
  stats.weekly.botExecutions += 1;
  
  // Update monthly stats
  stats.monthly.tpuUsage += tpuUsed;
  stats.monthly.botExecutions += 1;
  
  // Update history
  const today = new Date().toISOString().split('T')[0];
  const tpuHistoryIndex = stats.history.tpuConsumption.findIndex(
    item => item.date.split('T')[0] === today
  );
  
  if (tpuHistoryIndex >= 0) {
    stats.history.tpuConsumption[tpuHistoryIndex].value += tpuUsed;
  }
  
  const executionsHistoryIndex = stats.history.botExecutions.findIndex(
    item => item.date.split('T')[0] === today
  );
  
  if (executionsHistoryIndex >= 0) {
    stats.history.botExecutions[executionsHistoryIndex].value += 1;
  }
  
  saveToStorage(STORAGE_KEYS.USAGE_STATISTICS, stats);
  
  // Add to recent activities
  addRecentActivity({
    type: 'bot_execution',
    botId,
    tpuUsed,
    timestamp: new Date().toISOString()
  });
  
  // Update credits usage
  updateCreditsUsage(tpuUsed);
  
  return stats;
};

/**
 * Get notifications
 * @returns {Object} Notifications data
 */
export const getNotifications = () => {
  return getFromStorage(STORAGE_KEYS.NOTIFICATIONS, defaultNotifications);
};

/**
 * Add a new notification
 * @param {Object} notification - Notification to add
 * @returns {Object} Updated notifications
 */
export const addNotification = (notification) => {
  const notifications = getNotifications();
  
  const newNotification = {
    id: Date.now().toString(),
    title: notification.title,
    message: notification.message,
    type: notification.type || 'info',
    read: false,
    createdAt: new Date().toISOString(),
    ...notification
  };
  
  notifications.items = [newNotification, ...notifications.items];
  saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
  
  return notifications;
};

/**
 * Mark notifications as read
 * @param {string|string[]} ids - ID or array of IDs to mark as read
 * @returns {Object} Updated notifications
 */
export const markNotificationsAsRead = (ids) => {
  const notifications = getNotifications();
  const idArray = Array.isArray(ids) ? ids : [ids];
  
  notifications.items = notifications.items.map(notification => {
    if (idArray.includes(notification.id)) {
      return { ...notification, read: true };
    }
    return notification;
  });
  
  notifications.lastChecked = new Date().toISOString();
  saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
  
  return notifications;
};

/**
 * Get recent activities
 * @returns {Array} Recent activities
 */
export const getRecentActivities = () => {
  return getFromStorage(STORAGE_KEYS.RECENT_ACTIVITIES, []);
};

/**
 * Add a recent activity
 * @param {Object} activity - Activity to add
 * @returns {Array} Updated recent activities
 */
export const addRecentActivity = (activity) => {
  const activities = getRecentActivities();
  
  const newActivity = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    ...activity
  };
  
  // Keep only the most recent 50 activities
  const updatedActivities = [newActivity, ...activities].slice(0, 50);
  saveToStorage(STORAGE_KEYS.RECENT_ACTIVITIES, updatedActivities);
  
  return updatedActivities;
};

/**
 * Update credits usage
 * @param {number} tpuUsed - Amount of TPU used
 * @returns {Object} Updated credits
 */
export const updateCreditsUsage = (tpuUsed) => {
  const totalCredits = getFromStorage(STORAGE_KEYS.CREDITS, 2592000); // Default: 720 hours
  const usedCredits = getFromStorage('ubos_used_credits', 0);
  
  const newUsedCredits = usedCredits + tpuUsed;
  saveToStorage('ubos_used_credits', newUsedCredits);
  
  return {
    total: totalCredits,
    used: newUsedCredits,
    remaining: totalCredits - newUsedCredits
  };
}; 