import { getFromStorage, saveToStorage, STORAGE_KEYS } from './localStorage';
import { addRecentActivity, updateCreditsUsage } from './metricStorage';

/**
 * Bot management and storage
 */

// Default bot categories
const defaultBotCategories = [
  {
    id: 'support',
    name: 'Customer Support',
    description: 'Bots for handling customer inquiries and support requests',
    icon: '🤖',
    tpuConsumption: 270
  },
  {
    id: 'sales',
    name: 'Sales & Finance',
    description: 'Bots for product recommendations and sales conversions',
    icon: '🤑',
    tpuConsumption: 450
  },
  {
    id: 'content',
    name: 'Content & Marketing',
    description: 'Bots for content creation and marketing materials',
    icon: '✍️',
    tpuConsumption: 700
  }
];

// Default bot templates
const defaultBotTemplates = [
  {
    id: 'customer-support',
    name: 'Customer Support Assistant',
    description: 'Handles customer service inquiries with 24/7 availability',
    category: 'support',
    icon: '🤖',
    tpuConsumption: 270,
    settings: {
      greeting: 'Hello! I\'m your customer support assistant. How can I help you today?',
      knowledge: ['FAQ', 'Product Information', 'Return Policy'],
      responseTime: 'instant'
    }
  },
  {
    id: 'sales-agent',
    name: 'Sales Assistant',
    description: 'Helps with product recommendations and sales conversions',
    category: 'sales',
    icon: '🤑',
    tpuConsumption: 450,
    settings: {
      greeting: 'Hi there! Looking for the perfect product? I can help you find exactly what you need.',
      knowledge: ['Product Catalog', 'Pricing', 'Promotions'],
      responseTime: 'instant'
    }
  },
  {
    id: 'content-creator',
    name: 'Content Creator',
    description: 'Generates blog posts and social media content',
    category: 'content',
    icon: '✍️',
    tpuConsumption: 700,
    settings: {
      outputFormats: ['Blog Post', 'Social Media', 'Email'],
      toneOptions: ['Professional', 'Casual', 'Enthusiastic'],
      lengthOptions: ['Short', 'Medium', 'Long']
    }
  }
];

/**
 * Initialize bot-related data with defaults if not already set
 */
export const initBotData = () => {
  // Initialize bot categories
  if (!getFromStorage(STORAGE_KEYS.BOT_CATEGORIES)) {
    saveToStorage(STORAGE_KEYS.BOT_CATEGORIES, defaultBotCategories);
  }
  
  // Initialize bot templates
  if (!getFromStorage(STORAGE_KEYS.BOT_TEMPLATES)) {
    saveToStorage(STORAGE_KEYS.BOT_TEMPLATES, defaultBotTemplates);
  }
  
  // Initialize bots if not already set
  // Note: This is already handled in botsData.js but included here for completeness
  if (!getFromStorage(STORAGE_KEYS.BOTS)) {
    const sampleBots = getSampleBots();
    saveToStorage(STORAGE_KEYS.BOTS, sampleBots);
  }
};

/**
 * Get sample bots for initial setup
 * @returns {Array} Sample bots
 */
export const getSampleBots = () => {
  // This is essentially the same as sampleBots in botsData.js
  // Ideally, we would refactor to use only one source
  return [
    {
      id: '1',
      name: 'Customer Support Bot',
      description: 'Handles customer inquiries and support requests with 24/7 availability',
      createdAt: new Date('2025-04-15').toISOString(),
      status: 'active',
      type: 'support',
      avatar: '🤖',
      domain: 'support.ubos.bot',
      url: '/bot/customer-support-bot',
      averageTpuConsumption: 270,
      executionCount: 1254,
      lastExecuted: new Date('2025-05-04').toISOString()
    },
    {
      id: '2',
      name: 'Sales Assistant',
      description: 'Helps with product recommendations and sales conversions',
      createdAt: new Date('2025-04-20').toISOString(),
      status: 'active',
      type: 'sales',
      avatar: '🤑',
      domain: 'sales.ubos.bot',
      url: '/bot/sales-assistant',
      averageTpuConsumption: 450,
      executionCount: 876,
      lastExecuted: new Date('2025-05-05').toISOString()
    },
    {
      id: '3',
      name: 'Content Creator',
      description: 'Generates blog posts and social media content with media integration',
      createdAt: new Date('2025-04-25').toISOString(),
      status: 'active',
      type: 'content',
      avatar: '✍️',
      domain: 'content.ubos.bot',
      url: '/bot/content-creator',
      averageTpuConsumption: 700,
      executionCount: 532,
      lastExecuted: new Date('2025-05-03').toISOString()
    }
  ];
};

/**
 * Get all bot categories
 * @returns {Array} Bot categories
 */
export const getBotCategories = () => {
  return getFromStorage(STORAGE_KEYS.BOT_CATEGORIES, defaultBotCategories);
};

/**
 * Get a bot category by ID
 * @param {string} id - Category ID
 * @returns {Object|null} Bot category
 */
export const getBotCategory = (id) => {
  const categories = getBotCategories();
  return categories.find(category => category.id === id) || null;
};

/**
 * Get all bot templates
 * @returns {Array} Bot templates
 */
export const getBotTemplates = () => {
  return getFromStorage(STORAGE_KEYS.BOT_TEMPLATES, defaultBotTemplates);
};

/**
 * Get bot templates by category
 * @param {string} categoryId - Category ID
 * @returns {Array} Bot templates for the specified category
 */
export const getBotTemplatesByCategory = (categoryId) => {
  const templates = getBotTemplates();
  return templates.filter(template => template.category === categoryId);
};

/**
 * Get a bot template by ID
 * @param {string} id - Template ID
 * @returns {Object|null} Bot template
 */
export const getBotTemplate = (id) => {
  const templates = getBotTemplates();
  return templates.find(template => template.id === id) || null;
};

/**
 * Create a new bot from template
 * @param {string} templateId - Template ID
 * @param {Object} customData - Custom bot data
 * @returns {Object} The newly created bot
 */
export const createBotFromTemplate = (templateId, customData = {}) => {
  const template = getBotTemplate(templateId);
  
  if (!template) {
    throw new Error(`Template with ID ${templateId} not found`);
  }
  
  const newBot = {
    id: Date.now().toString(),
    name: customData.name || template.name,
    description: customData.description || template.description,
    createdAt: new Date().toISOString(),
    status: 'active',
    type: template.category,
    avatar: template.icon,
    domain: customData.domain || `${(customData.name || template.name).toLowerCase().replace(/\s+/g, '')}.ubos.bot`,
    url: `/bot/${(customData.name || template.name).toLowerCase().replace(/\s+/g, '-')}`,
    averageTpuConsumption: template.tpuConsumption,
    executionCount: 0,
    lastExecuted: null,
    settings: {
      ...template.settings,
      ...customData.settings
    }
  };
  
  // Save the new bot
  const bots = getFromStorage(STORAGE_KEYS.BOTS, []);
  const updatedBots = [...bots, newBot];
  saveToStorage(STORAGE_KEYS.BOTS, updatedBots);
  
  // Add activity
  addRecentActivity({
    type: 'bot_created',
    botId: newBot.id,
    botName: newBot.name,
    timestamp: new Date().toISOString()
  });
  
  return newBot;
};

/**
 * Create a custom bot
 * @param {Object} botData - Bot data
 * @returns {Object} The newly created bot
 */
export const createCustomBot = (botData) => {
  // Get default TPU consumption based on type
  let tpuConsumption = 270; // Default for support
  if (botData.type === 'sales') {
    tpuConsumption = 450;
  } else if (botData.type === 'content') {
    tpuConsumption = 700;
  }
  
  const newBot = {
    id: Date.now().toString(),
    name: botData.name,
    description: botData.description || `A ${botData.type} bot`,
    createdAt: new Date().toISOString(),
    status: 'active',
    type: botData.type,
    avatar: botData.avatar || '🤖',
    domain: botData.domain || `${botData.name.toLowerCase().replace(/\s+/g, '')}.ubos.bot`,
    url: `/bot/${botData.name.toLowerCase().replace(/\s+/g, '-')}`,
    averageTpuConsumption: botData.averageTpuConsumption || tpuConsumption,
    executionCount: 0,
    lastExecuted: null,
    settings: botData.settings || {}
  };
  
  // Save the new bot
  const bots = getFromStorage(STORAGE_KEYS.BOTS, []);
  const updatedBots = [...bots, newBot];
  saveToStorage(STORAGE_KEYS.BOTS, updatedBots);
  
  // Add activity
  addRecentActivity({
    type: 'bot_created',
    botId: newBot.id,
    botName: newBot.name,
    timestamp: new Date().toISOString()
  });
  
  return newBot;
};

/**
 * Update a bot
 * @param {string} id - Bot ID
 * @param {Object} updates - Updated bot data
 * @returns {Object|null} Updated bot or null if not found
 */
export const updateBot = (id, updates) => {
  const bots = getFromStorage(STORAGE_KEYS.BOTS, []);
  const botIndex = bots.findIndex(bot => bot.id === id);
  
  if (botIndex === -1) {
    return null;
  }
  
  const updatedBot = {
    ...bots[botIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  bots[botIndex] = updatedBot;
  saveToStorage(STORAGE_KEYS.BOTS, bots);
  
  // Add activity
  addRecentActivity({
    type: 'bot_updated',
    botId: updatedBot.id,
    botName: updatedBot.name,
    timestamp: new Date().toISOString()
  });
  
  return updatedBot;
};

/**
 * Delete a bot
 * @param {string} id - Bot ID
 * @returns {boolean} Success status
 */
export const deleteBot = (id) => {
  const bots = getFromStorage(STORAGE_KEYS.BOTS, []);
  const botToDelete = bots.find(bot => bot.id === id);
  
  if (!botToDelete) {
    return false;
  }
  
  const updatedBots = bots.filter(bot => bot.id !== id);
  saveToStorage(STORAGE_KEYS.BOTS, updatedBots);
  
  // Add activity
  addRecentActivity({
    type: 'bot_deleted',
    botId: id,
    botName: botToDelete.name,
    timestamp: new Date().toISOString()
  });
  
  return true;
};

/**
 * Execute a bot
 * @param {string} id - Bot ID
 * @param {Object} executionData - Data for the execution
 * @returns {Object} Execution result
 */
export const executeBot = (id, executionData = {}) => {
  const bots = getFromStorage(STORAGE_KEYS.BOTS, []);
  const botIndex = bots.findIndex(bot => bot.id === id);
  
  if (botIndex === -1) {
    throw new Error(`Bot with ID ${id} not found`);
  }
  
  const bot = bots[botIndex];
  
  // Update execution count and last executed
  bot.executionCount = (bot.executionCount || 0) + 1;
  bot.lastExecuted = new Date().toISOString();
  
  // Update the bot in storage
  bots[botIndex] = bot;
  saveToStorage(STORAGE_KEYS.BOTS, bots);
  
  // Record the execution for metrics
  const tpuUsed = bot.averageTpuConsumption || 100;
  updateCreditsUsage(tpuUsed);
  
  // Add activity
  addRecentActivity({
    type: 'bot_executed',
    botId: bot.id,
    botName: bot.name,
    tpuUsed,
    timestamp: new Date().toISOString()
  });
  
  // Return a simulated execution result
  return {
    id: Date.now().toString(),
    botId: bot.id,
    status: 'completed',
    tpuUsed,
    timestamp: new Date().toISOString(),
    duration: Math.round((tpuUsed / 60) * 1000), // Approx duration in ms
    result: executionData.input 
      ? `Response to: ${executionData.input}. This is a simulated response from ${bot.name}.`
      : `This is a simulated execution of ${bot.name}.`
  };
}; 