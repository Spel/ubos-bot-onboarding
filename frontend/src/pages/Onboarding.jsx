import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { saveToStorage, getFromStorage, STORAGE_KEYS } from "../utils/localStorage";
import { addBot } from "../utils/botsData";

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [botName, setBotName] = useState("");
  const [botDescription, setBotDescription] = useState("");
  const [botType, setBotType] = useState("support");
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState("🤖");
  
  const navigate = useNavigate();
  const location = useLocation();
  const isFromDashboard = location.state?.fromDashboard || false;
  
  // Check if user is authenticated
  const isAuthenticated = getFromStorage(STORAGE_KEYS.IS_AUTHENTICATED, false);
  const userEmail = getFromStorage(STORAGE_KEYS.USER_EMAIL, '');
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      console.log('User not authenticated, redirecting to login');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Reset form when component mounts
  useEffect(() => {
    if (isFromDashboard) {
      // If coming from dashboard, start at the bot creation step
      setStep(1);
    } else {
      // If opening the app for the first time, show intro
      setStep(0);
    }
  }, [isFromDashboard]);

  const handleNext = () => {
    if (step === 1) {
      // Generate domain from bot name
      const newDomain = `${botName.toLowerCase().replace(/\s+/g, "")}.ubos.bot`;
      setDomain(newDomain);
    }

    if (step === 2) {
      // Simulate bot provisioning
      setLoading(true);
      setTimeout(() => {
        // Create the new bot
        const newBot = {
          name: botName,
          description: botDescription,
          type: botType,
          domain: domain,
          status: "active",
          avatar: avatar,
          owner: userEmail || 'user@example.com',
          createdAt: new Date().toISOString()
        };
        
        // Add the bot to storage and log for debugging
        console.log('Creating new bot:', newBot);
        const createdBot = addBot(newBot);
        console.log('Bot created:', createdBot);
        
        setLoading(false);
        setStep(step + 1);
      }, 2000); // simulate provisioning delay
    } else {
      setStep(step + 1);
    }
  };
  
  // Handle completion of the flow
  const handleComplete = () => {
    if (isFromDashboard) {
      // If from dashboard, go back to My Bots page
      navigate("/my-bots");
    } else {
      // Otherwise go to dashboard
      navigate("/dashboard");
    }
  };

  // Inline styles to ensure proper styling
  const styles = {
    container: {
      maxWidth: '28rem',
      margin: '2.5rem auto 0',
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '0.75rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      border: '1px solid #f3f4f6',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    },
    heading: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#1a202c'
    },
    paragraph: {
      color: '#4b5563'
    },
    primaryButton: {
      width: '100%',
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      backgroundColor: '#2563eb',
      color: 'white',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
    },
    secondaryButton: {
      width: '100%',
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      backgroundColor: 'transparent',
      color: '#2563eb',
      border: '1px solid #2563eb',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
    }
  };

  return (
    <div style={styles.container} className="max-w-md mx-auto mt-10 space-y-6 p-4">
      <div style={styles.card} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 space-y-4">
        {step === 0 && (
          <>
            <h2 style={styles.heading} className="text-xl font-bold">Meet Your UBOS Agent</h2>
            <p style={styles.paragraph}>Your AI bot will build your website and talk to your visitors.</p>
            <button 
              style={styles.primaryButton} 
              className="w-full py-2 px-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition" 
              onClick={handleNext}
            >
              Start
            </button>
          </>
        )}

        {step === 1 && (
          <>
            <h2 className="text-xl font-bold">{isFromDashboard ? "Create a New Bot" : "Let's Create Your First Bot"}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Bot Name</label>
                <input
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ex: Customer Support Bot"
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="What will this bot do?"
                  value={botDescription}
                  onChange={(e) => setBotDescription(e.target.value)}
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Bot Type</label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={botType}
                  onChange={(e) => setBotType(e.target.value)}
                >
                  <option value="support">Customer Support</option>
                  <option value="sales">Sales Assistant</option>
                  <option value="content">Content Creator</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Choose Avatar</label>
                <div className="flex gap-2">
                  {['🤖', '🤑', '✍️', '🧠', '👾'].map(emoji => (
                    <button 
                      key={emoji}
                      onClick={() => setAvatar(emoji)}
                      className={`text-2xl p-2 rounded-lg ${avatar === emoji ? 'bg-blue-100' : 'bg-gray-100'}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <button
                className="w-full py-2 px-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                onClick={handleNext}
                disabled={!botName}
              >
                Create Bot
              </button>
              
              {isFromDashboard && (
                <button
                  className="w-full mt-2 py-2 px-4 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition"
                  onClick={() => navigate('/my-bots')}
                >
                  Cancel
                </button>
              )}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-xl font-bold">Your Bot Domain is Ready!</h2>
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl">{avatar}</div>
              <div>
                <h3 className="font-semibold">{botName}</h3>
                <p className="text-sm text-gray-600">{botType === 'support' ? 'Customer Support' : botType === 'sales' ? 'Sales Assistant' : 'Content Creator'}</p>
              </div>
            </div>
            <p className="text-lg font-mono text-blue-600">{domain}</p>
            <p className="text-sm text-gray-600">To connect your own domain, point a CNAME to <strong>ubos.site</strong>.</p>
            {loading ? (
              <div className="py-4 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2">Provisioning your bot…</p>
              </div>
            ) : (
              <button className="w-full py-2 px-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition" onClick={handleNext}>
                Continue
              </button>
            )}
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-xl font-bold">Your Bot is Ready! 🎉</h2>
            <div className="border rounded-xl p-3 bg-gray-50 space-y-2">
              <div className="flex items-start gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-bold">{avatar}</span>
                <p>Hi there, I'm {botName}. I'm ready to assist with {botType === 'support' ? 'customer support' : botType === 'sales' ? 'sales inquiries' : 'content creation'}!</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-bold">💬</span>
                <p>What can you help me with?</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-bold">{avatar}</span>
                <p>{botDescription || "I can answer questions, provide information, and help with various tasks related to " + (botType === 'support' ? 'customer support' : botType === 'sales' ? 'sales' : 'content creation')}</p>
              </div>
            </div>
            <div className="text-sm text-gray-600 mt-2">
              🧠 Usage: <strong>0</strong> / 2,592,000 TPU-seconds this month
            </div>
            <button
              className="w-full mt-4 py-2 px-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              onClick={handleComplete}
            >
              {isFromDashboard ? "Go to My Bots" : "Go to Dashboard"}
            </button>
          </>
        )}
      </div>
    </div>
  );
} 