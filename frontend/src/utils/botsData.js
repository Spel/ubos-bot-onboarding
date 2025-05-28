import { getFromStorage, saveToStorage, STORAGE_KEYS } from './localStorage';

// Using the BOTS key from STORAGE_KEYS

// Sample bot data
const sampleBots = [
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
  },
  {
    id: '4',
    name: 'Financial Advisor',
    description: 'Provides financial analysis and investment recommendations',
    createdAt: new Date('2025-04-10').toISOString(),
    status: 'active',
    type: 'sales',
    avatar: '💰',
    domain: 'finance.ubos.bot',
    url: '/bot/financial-advisor',
    averageTpuConsumption: 560,
    executionCount: 423,
    lastExecuted: new Date('2025-05-02').toISOString()
  },
  {
    id: '5',
    name: 'Marketing Strategist',
    description: 'Creates marketing campaigns and analyzes performance metrics',
    createdAt: new Date('2025-04-05').toISOString(),
    status: 'active',
    type: 'content',
    avatar: '📊',
    domain: 'marketing.ubos.bot',
    url: '/bot/marketing-strategist',
    averageTpuConsumption: 680,
    executionCount: 367,
    lastExecuted: new Date('2025-05-01').toISOString()
  },
  {
    id: '6',
    name: 'Technical Support',
    description: 'Resolves technical issues and provides troubleshooting guidance',
    createdAt: new Date('2025-03-28').toISOString(),
    status: 'inactive',
    type: 'support',
    avatar: '🔧',
    domain: 'techsupport.ubos.bot',
    url: '/bot/technical-support',
    averageTpuConsumption: 320,
    executionCount: 1089,
    lastExecuted: new Date('2025-04-28').toISOString()
  }
];

// Get all bots
export const getBots = () => {
  const bots = getFromStorage(STORAGE_KEYS.BOTS, null);
  console.log('Retrieved bots from storage:', bots);
  
  if (!bots) {
    // Initialize with sample data if no bots exist
    console.log('No bots found, initializing with sample data');
    saveToStorage(STORAGE_KEYS.BOTS, sampleBots);
    return sampleBots;
  }
  
  // Ensure all bots have proper URLs and domains
  const updatedBots = bots.map(bot => {
    if (!bot.url || !bot.domain) {
      const botNameSlug = bot.name.toLowerCase().replace(/\s+/g, '-');
      return {
        ...bot,
        domain: bot.domain || bot.name.toLowerCase().replace(/\s+/g, ''),
        url: bot.url || `/bot/${botNameSlug}`
      };
    }
    return bot;
  });
  
  // Save updated bots if any changes were made
  if (JSON.stringify(bots) !== JSON.stringify(updatedBots)) {
    console.log('Updating bots with proper URLs and domains');
    saveToStorage(STORAGE_KEYS.BOTS, updatedBots);
  }
  
  return updatedBots;
};

// Get a single bot by ID
export const getBot = (id) => {
  const bots = getBots();
  return bots.find(bot => bot.id === id);
};

// Add a new bot
export const addBot = (bot) => {
  console.log('Adding new bot with data:', bot);
  const bots = getBots();
  console.log('Current bots before adding:', bots);
  
  // Generate URL and domain from bot name if not provided
  const botNameSlug = bot.name.toLowerCase().replace(/\s+/g, "-");
  const domain = bot.domain || botNameSlug;
  const url = bot.url || `/bot/${botNameSlug}`;
  
  // Set default average TPU consumption based on bot type
  let averageTpuConsumption = 270; // Default for support
  if (bot.type === 'sales') {
    averageTpuConsumption = 450;
  } else if (bot.type === 'content') {
    averageTpuConsumption = 700;
  }
  
  const newBot = {
    ...bot,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    domain,
    url,
    averageTpuConsumption: bot.averageTpuConsumption || averageTpuConsumption,
    executionCount: 0,
    lastExecuted: null
  };
  
  const updatedBots = [...bots, newBot];
  console.log('Updated bots list:', updatedBots);
  saveToStorage(STORAGE_KEYS.BOTS, updatedBots);
  console.log('Saved to storage with key:', STORAGE_KEYS.BOTS);
  return newBot;
};

// Update an existing bot
export const updateBot = (id, updatedData) => {
  console.log(`Updating bot with ID: ${id}`, updatedData);
  
  const bots = getBots();
  if (!bots || !bots.length) {
    console.error('No bots found in storage when trying to update');
    return null;
  }
  
  // Find the bot to update
  const botToUpdate = bots.find(bot => bot.id === id);
  if (!botToUpdate) {
    console.error(`Bot with ID ${id} not found`);
    return null;
  }
  
  // Ensure knowledgeBase exists
  if (updatedData.knowledgeBase && !botToUpdate.knowledgeBase) {
    console.log(`Initializing knowledgeBase for bot ${id}`);
  }
  
  // Create updated bot
  const updatedBot = { ...botToUpdate, ...updatedData };
  console.log('Updated bot data:', updatedBot);
  
  // Update the bots array
  const updatedBots = bots.map(bot => 
    bot.id === id ? updatedBot : bot
  );
  
  // Save to localStorage
  console.log('Saving updated bots to localStorage');
  saveToStorage(STORAGE_KEYS.BOTS, updatedBots);
  
  // Verify the save was successful
  const savedBots = getFromStorage(STORAGE_KEYS.BOTS, []);
  const savedBot = savedBots.find(bot => bot.id === id);
  
  if (savedBot && savedBot.knowledgeBase) {
    console.log('Bot successfully saved with knowledge base:', savedBot.knowledgeBase);
  } else {
    console.warn('Bot may not have been saved correctly');
  }
  
  return savedBot;
};

// Delete a bot
export const deleteBot = (id) => {
  const bots = getBots();
  const updatedBots = bots.filter(bot => bot.id !== id);
  saveToStorage(STORAGE_KEYS.BOTS, updatedBots);
  return true;
};

// Get all knowledge bases from existing bots
export const getAllKnowledgeBases = () => {
  const bots = getBots();
  return bots
    .filter(bot => bot.knowledgeBase) // Only include bots that have a knowledge base
    .map(bot => ({
      botId: bot.id,
      botName: bot.name,
      knowledgeBase: bot.knowledgeBase,
      lastUpdated: bot.knowledgeBase.lastUpdated || 'Unknown',
      itemCount: [
        bot.knowledgeBase.documents?.length || 0,
        bot.knowledgeBase.webUrls?.length || 0,
        bot.knowledgeBase.textEntries?.length || 0,
        bot.knowledgeBase.qaEntries?.length || 0,
        bot.knowledgeBase.images?.length || 0
      ].reduce((a, b) => a + b, 0) // Total count of all knowledge items
    }));
};

// Copy a knowledge base from one bot to another
export const copyKnowledgeBase = (sourceBotId, targetBotId) => {
  // Get source and target bots
  const sourceBotData = getBot(sourceBotId);
  const targetBotData = getBot(targetBotId);
  
  if (!sourceBotData || !targetBotData) {
    console.error('Source or target bot not found');
    return false;
  }
  
  if (!sourceBotData.knowledgeBase) {
    console.error('Source bot does not have a knowledge base');
    return false;
  }
  
  // Create a deep copy of the knowledge base
  const knowledgeBaseCopy = JSON.parse(JSON.stringify(sourceBotData.knowledgeBase));
  
  // Update the lastUpdated timestamp
  knowledgeBaseCopy.lastUpdated = new Date().toISOString();
  
  // Update the target bot with the copied knowledge base
  const updatedTargetBot = {
    ...targetBotData,
    knowledgeBase: knowledgeBaseCopy
  };
  
  // Save the updated target bot
  return updateBot(targetBotId, updatedTargetBot);
};

// Get bot count
export const getBotCount = () => {
  return getBots().length;
};

// Get active bot count
export const getActiveBotCount = () => {
  const bots = getBots();
  return bots.filter(bot => bot.status === 'active').length;
};

// Get bots by type
export const getBotsByType = (type) => {
  const bots = getBots();
  return bots.filter(bot => bot.type === type);
};
