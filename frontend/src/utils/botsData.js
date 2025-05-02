import { getFromStorage, saveToStorage, STORAGE_KEYS } from './localStorage';

// Using the BOTS key from STORAGE_KEYS

// Sample bot data
const sampleBots = [
  {
    id: '1',
    name: 'Customer Support Bot',
    description: 'Handles customer inquiries and support requests',
    createdAt: new Date('2025-04-15').toISOString(),
    status: 'active',
    type: 'support',
    avatar: '🤖'
  },
  {
    id: '2',
    name: 'Sales Assistant',
    description: 'Helps with product recommendations and sales',
    createdAt: new Date('2025-04-20').toISOString(),
    status: 'active',
    type: 'sales',
    avatar: '🤑'
  },
  {
    id: '3',
    name: 'Content Creator',
    description: 'Generates blog posts and social media content',
    createdAt: new Date('2025-04-25').toISOString(),
    status: 'inactive',
    type: 'content',
    avatar: '✍️'
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
  return bots;
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
  
  const newBot = {
    ...bot,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
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
