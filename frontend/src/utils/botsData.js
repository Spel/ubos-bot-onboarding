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
        domain: bot.domain || `${bot.name.toLowerCase().replace(/\s+/g, '')}.ubos.bot`,
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
  const domain = bot.domain || `${botNameSlug}.ubos.bot`;
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
  const bots = getBots();
  const updatedBots = bots.map(bot => 
    bot.id === id ? { ...bot, ...updatedData } : bot
  );
  
  saveToStorage(STORAGE_KEYS.BOTS, updatedBots);
  return updatedBots.find(bot => bot.id === id);
};

// Delete a bot
export const deleteBot = (id) => {
  const bots = getBots();
  const updatedBots = bots.filter(bot => bot.id !== id);
  
  saveToStorage(STORAGE_KEYS.BOTS, updatedBots);
  return updatedBots;
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
