import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Chat from './pages/Chat';
import Dashboard from './pages/Dashboard';
import MyBots from './pages/MyBots';
import BotLanding from './pages/BotLanding';
import { getFromStorage, STORAGE_KEYS } from './utils/localStorage';

// Home route component that redirects based on authentication status
function HomeRoute() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Check if user is authenticated
    const authStatus = getFromStorage(STORAGE_KEYS.IS_AUTHENTICATED, false);
    setIsAuthenticated(authStatus);
    setLoading(false);
  }, []);
  
  // Show loading while checking
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  // Redirect to login if not authenticated
  return isAuthenticated ? <Navigate to="/onboarding" replace /> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-bots" element={<MyBots />} />
        <Route path="/chat/:botId" element={<Chat />} />
        <Route path="/bot/:botId" element={<BotLanding />} />
      </Routes>
    </Router>
  );
}

export default App
