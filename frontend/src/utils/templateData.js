/**
 * Mock data for AI Agent Templates
 */

export const agentTemplates = [
  {
    id: 1,
    name: "Customer Support Agent",
    description: "Handle customer inquiries, resolve issues, and provide product information.",
    category: "support",
    icon: "🛎️",
    popularity: 85,
    complexity: "medium",
    framework: "UBOS.ai",
    features: [
      "24/7 availability",
      "FAQ knowledge base integration",
      "Ticket creation and tracking",
      "Multi-language support",
      "Sentiment analysis"
    ],
    useCases: [
      "E-commerce support",
      "SaaS product help desk",
      "Technical troubleshooting"
    ],
    hourlyRate: 0.38,
    samplePrompt: "You are a helpful customer support agent for a software company. You help users troubleshoot issues, answer questions about features, and provide guidance on best practices. You're friendly, patient, and knowledgeable."
  },
  {
    id: 2,
    name: "Sales Assistant",
    description: "Qualify leads, answer product questions, and guide customers through the sales process.",
    category: "sales",
    icon: "💼",
    popularity: 78,
    complexity: "medium",
    framework: "Langflow",
    features: [
      "Product recommendation engine",
      "Pricing information",
      "Competitive comparison",
      "Lead qualification",
      "Meeting scheduling"
    ],
    useCases: [
      "B2B sales qualification",
      "E-commerce product advisor",
      "Real estate property finder"
    ],
    hourlyRate: 0.42,
    samplePrompt: "You are a knowledgeable sales assistant for a technology company. You help potential customers understand our products, answer their questions, compare features to competitors, and guide them toward the best solution for their needs. You're persuasive without being pushy."
  },
  {
    id: 3,
    name: "Content Creator",
    description: "Generate blog posts, social media content, and marketing copy based on your brand guidelines.",
    category: "marketing",
    icon: "✍️",
    popularity: 72,
    complexity: "high",
    framework: "Crew.ai",
    features: [
      "SEO optimization",
      "Brand voice adaptation",
      "Multi-format content generation",
      "Content calendar integration",
      "Audience targeting"
    ],
    useCases: [
      "Blog post creation",
      "Social media management",
      "Email marketing campaigns"
    ],
    hourlyRate: 0.45,
    samplePrompt: "You are a creative content creator specializing in digital marketing. You can write engaging blog posts, social media updates, and marketing copy that aligns with brand guidelines and appeals to the target audience. You understand SEO principles and can optimize content accordingly."
  },
  {
    id: 4,
    name: "Research Assistant",
    description: "Gather information, analyze data, and provide summaries on specific topics.",
    category: "research",
    icon: "🔍",
    popularity: 65,
    complexity: "high",
    framework: "UBOS.ai",
    features: [
      "Data analysis",
      "Literature review",
      "Trend identification",
      "Citation management",
      "Summary generation"
    ],
    useCases: [
      "Academic research",
      "Market analysis",
      "Competitive intelligence"
    ],
    hourlyRate: 0.43,
    samplePrompt: "You are a thorough research assistant with expertise in gathering, analyzing, and synthesizing information. You can search for relevant sources, extract key insights, identify trends, and create comprehensive summaries. You maintain academic rigor and properly cite all sources."
  },
  {
    id: 5,
    name: "HR Assistant",
    description: "Answer employee questions about policies, benefits, and procedures.",
    category: "hr",
    icon: "👥",
    popularity: 60,
    complexity: "medium",
    framework: "Langflow",
    features: [
      "Policy knowledge base",
      "Benefits explanation",
      "Onboarding assistance",
      "Leave management",
      "Employee FAQ"
    ],
    useCases: [
      "New employee onboarding",
      "Benefits enrollment support",
      "Policy clarification"
    ],
    hourlyRate: 0.36,
    samplePrompt: "You are an HR assistant for a medium-sized company. You help employees understand company policies, explain benefits options, assist with onboarding procedures, and answer common HR-related questions. You're discreet, helpful, and knowledgeable about employment regulations."
  },
  {
    id: 6,
    name: "Product Manager",
    description: "Help prioritize features, gather requirements, and manage product roadmaps.",
    category: "product",
    icon: "📊",
    popularity: 55,
    complexity: "high",
    framework: "Crew.ai",
    features: [
      "Feature prioritization",
      "User story creation",
      "Roadmap planning",
      "Competitive analysis",
      "Market research"
    ],
    useCases: [
      "Agile development teams",
      "Startup product planning",
      "Enterprise product management"
    ],
    hourlyRate: 0.41,
    samplePrompt: "You are a strategic product manager who helps teams define and prioritize features, create user stories, and plan product roadmaps. You understand agile methodologies, can analyze market trends, and balance technical constraints with business goals. You're organized, analytical, and focused on delivering value to users."
  },
  {
    id: 7,
    name: "Legal Assistant",
    description: "Provide basic legal information and help draft simple legal documents.",
    category: "legal",
    icon: "⚖️",
    popularity: 50,
    complexity: "high",
    framework: "UBOS.ai",
    features: [
      "Legal research",
      "Document drafting assistance",
      "Legal terminology explanation",
      "Procedure guidance",
      "Case management"
    ],
    useCases: [
      "Contract review assistance",
      "Legal research support",
      "Regulatory compliance guidance"
    ],
    hourlyRate: 0.44,
    samplePrompt: "You are a legal assistant with knowledge of basic legal concepts and terminology. You can help with preliminary legal research, assist in drafting simple legal documents, and explain legal procedures. You always clarify that you don't provide legal advice and recommend consulting with a licensed attorney for specific legal matters."
  },
  {
    id: 8,
    name: "Financial Advisor",
    description: "Provide general financial information and basic planning guidance.",
    category: "finance",
    icon: "💰",
    popularity: 48,
    complexity: "high",
    framework: "Langflow",
    features: [
      "Budget planning",
      "Investment education",
      "Retirement planning",
      "Debt management",
      "Financial goal setting"
    ],
    useCases: [
      "Personal financial planning",
      "Small business financial guidance",
      "Investment education"
    ],
    hourlyRate: 0.40,
    samplePrompt: "You are a financial advisor who provides general financial information and basic planning guidance. You can help with budgeting, explain investment concepts, discuss retirement planning strategies, and assist with debt management approaches. You always clarify that you don't provide specific investment advice and recommend consulting with a licensed financial advisor for personalized recommendations."
  },
  {
    id: 9,
    name: "Technical Support Engineer",
    description: "Provide technical troubleshooting and support for software and hardware issues.",
    category: "technical",
    icon: "🔧",
    popularity: 70,
    complexity: "high",
    framework: "Crew.ai",
    features: [
      "Diagnostic procedures",
      "Step-by-step troubleshooting",
      "System configuration assistance",
      "Error code interpretation",
      "Technical documentation"
    ],
    useCases: [
      "Software troubleshooting",
      "Hardware diagnostics",
      "Network configuration support"
    ],
    hourlyRate: 0.43,
    samplePrompt: "You are a technical support engineer with expertise in diagnosing and resolving software and hardware issues. You can guide users through troubleshooting steps, help with system configurations, interpret error messages, and provide clear technical explanations. You're patient, methodical, and can communicate complex technical concepts in simple terms."
  },
  {
    id: 10,
    name: "Educational Tutor",
    description: "Provide explanations, answer questions, and help students learn various subjects.",
    category: "education",
    icon: "🎓",
    popularity: 75,
    complexity: "medium",
    framework: "UBOS.ai",
    features: [
      "Subject matter expertise",
      "Personalized explanations",
      "Practice problem generation",
      "Learning progress tracking",
      "Study plan creation"
    ],
    useCases: [
      "K-12 homework help",
      "College subject tutoring",
      "Test preparation"
    ],
    hourlyRate: 0.39,
    samplePrompt: "You are an educational tutor with expertise across multiple subjects. You can explain concepts clearly, answer questions, provide examples, create practice problems, and offer study strategies. You adapt your teaching approach based on the student's level of understanding and learning style. You're patient, encouraging, and focused on helping students master the material."
  }
];

/**
 * Get all agent templates
 * @returns {Array} All agent templates
 */
export const getAllTemplates = () => {
  return agentTemplates;
};

/**
 * Get template by ID
 * @param {number} id - Template ID
 * @returns {Object} Template object or null if not found
 */
export const getTemplateById = (id) => {
  return agentTemplates.find(template => template.id === id) || null;
};

/**
 * Get templates by category
 * @param {string} category - Category name
 * @returns {Array} Templates in the specified category
 */
export const getTemplatesByCategory = (category) => {
  return agentTemplates.filter(template => template.category === category);
};

/**
 * Get templates by framework
 * @param {string} framework - Framework name
 * @returns {Array} Templates using the specified framework
 */
export const getTemplatesByFramework = (framework) => {
  return agentTemplates.filter(template => template.framework === framework);
};

/**
 * Get templates sorted by popularity
 * @param {boolean} descending - Sort in descending order if true
 * @returns {Array} Sorted templates
 */
export const getTemplatesByPopularity = (descending = true) => {
  return [...agentTemplates].sort((a, b) => {
    return descending ? b.popularity - a.popularity : a.popularity - b.popularity;
  });
};

/**
 * Get templates sorted by hourly rate
 * @param {boolean} descending - Sort in descending order if true
 * @returns {Array} Sorted templates
 */
export const getTemplatesByHourlyRate = (descending = false) => {
  return [...agentTemplates].sort((a, b) => {
    return descending ? b.hourlyRate - a.hourlyRate : a.hourlyRate - b.hourlyRate;
  });
};

/**
 * Search templates by name or description
 * @param {string} query - Search query
 * @returns {Array} Matching templates
 */
export const searchTemplates = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return agentTemplates.filter(template => 
    template.name.toLowerCase().includes(lowercaseQuery) || 
    template.description.toLowerCase().includes(lowercaseQuery)
  );
};
