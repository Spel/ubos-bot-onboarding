import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import MyBots from './pages/MyBots';
import Onboarding from './pages/Onboarding';
import Login from './pages/Login';
import Chat from './pages/Chat';
import BotLanding from './pages/BotLanding';
import SubscriptionPlans from './pages/SubscriptionPlans';
import CostComparison from './pages/CostComparison';
import Admin from './pages/Admin';
import { getFromStorage, STORAGE_KEYS } from './utils/localStorage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is logged in
    const userEmail = getFromStorage(STORAGE_KEYS.USER_EMAIL, null);
    const email = getFromStorage(STORAGE_KEYS.EMAIL, null);
    const isAuthenticated = getFromStorage(STORAGE_KEYS.IS_AUTHENTICATED, false);
    
    // User is logged in if any of these conditions are true
    setIsLoggedIn(!!(userEmail || email || isAuthenticated));
    setLoading(false);
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
        <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
