import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import MyBots from './pages/MyBots';
import Onboarding from './pages/Onboarding';
import Login from './pages/Login';
import Chat from './pages/Chat';
import BotLanding from './pages/BotLanding';
import SubscriptionPlans from './pages/SubscriptionPlans';
import CostComparison from './pages/CostComparison';
import Admin from './pages/Admin';
import Templates from './pages/Templates';
import CreateAgent from './pages/CreateAgent';
import { getFromStorage, STORAGE_KEYS } from './utils/localStorage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Function to check authentication status
  const checkAuthStatus = () => {
    // Check if user is logged in
    const userEmail = getFromStorage(STORAGE_KEYS.USER_EMAIL, null);
    const email = getFromStorage(STORAGE_KEYS.EMAIL, null);
    const isAuthenticated = getFromStorage(STORAGE_KEYS.IS_AUTHENTICATED, false);
    
    console.log('Auth check - userEmail:', userEmail);
    console.log('Auth check - email:', email);
    console.log('Auth check - isAuthenticated:', isAuthenticated);
    
    // User is logged in if any of these conditions are true
    const loggedIn = !!(userEmail || email || isAuthenticated);
    setIsLoggedIn(loggedIn);
    
    // Ensure authentication state is consistent
    if (loggedIn && !isAuthenticated) {
      saveToStorage(STORAGE_KEYS.IS_AUTHENTICATED, true);
    }
    
    setLoading(false);
    return loggedIn;
  };
  
  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);
  
  // Set up a listener to check auth status when localStorage changes
  useEffect(() => {
    // Function to handle storage events
    const handleStorageChange = () => {
      console.log('Storage changed, checking auth status');
      checkAuthStatus();
    };
    
    // Add event listener for storage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically (every 1 second) for changes
    // This helps with cases where the storage event might not fire
    const interval = setInterval(() => {
      checkAuthStatus();
    }, 1000);
    
    // Clean up
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);
  
  // Show loading while checking
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  return (
    <Router>
      <Routes>
        <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/my-bots" element={isLoggedIn ? <MyBots /> : <Navigate to="/login" />} />
        <Route path="/chat/:botId" element={isLoggedIn ? <Chat /> : <Navigate to="/login" />} />
        <Route path="/bot/:botId" element={isLoggedIn ? <BotLanding /> : <Navigate to="/login" />} />
        <Route path="/subscription-plans" element={isLoggedIn ? <SubscriptionPlans /> : <Navigate to="/login" />} />
        <Route path="/cost-comparison" element={isLoggedIn ? <CostComparison /> : <Navigate to="/login" />} />
        <Route path="/admin" element={isLoggedIn ? <Admin /> : <Navigate to="/login" />} />
        <Route path="/templates" element={isLoggedIn ? <Templates /> : <Navigate to="/login" />} />
        <Route path="/create-agent/:templateId?" element={isLoggedIn ? <CreateAgent /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
