import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import MyBots from './pages/MyBots';
import Onboarding from './pages/Onboarding';
import Login from './pages/Login';
import Chat from './pages/Chat';
import GlobalChat from './pages/GlobalChat';
import MicroFrontendChat from './pages/MicroFrontendChat';
import BotLanding from './pages/BotLanding';
import SubscriptionPlans from './pages/SubscriptionPlans';
import CostComparison from './pages/CostComparison';
import Admin from './pages/Admin';
import Templates from './pages/Templates';
import CreateAgent from './pages/CreateAgent';
import EditAgent from './pages/EditAgent';
import AgentView from './pages/AgentView';
import AgentViewImproved from './pages/AgentViewImproved';
import AgentViewABTest from './pages/AgentViewABTest';
import CompanyManagement from './pages/CompanyManagement';
import ProductLanding from './pages/ProductLanding';
import Marketplace from './pages/Marketplace';
import UserManagement from './pages/UserManagement';
import { getFromStorage, saveToStorage, STORAGE_KEYS } from './utils/localStorage';
import { AppLayout } from './components/layout/app-layout';

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
    
    // User is logged in if the authentication flag is true
    // This is stricter than the previous implementation
    const loggedIn = isAuthenticated === true;
    setIsLoggedIn(loggedIn);
    
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
  
  // Protected route component that checks authentication
  const ProtectedRoute = () => {
    console.log("Protected route check - isLoggedIn:", isLoggedIn);
    return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={isLoggedIn ? <Navigate to="/home" /> : <ProductLanding />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/home" /> : <Login />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/product" element={<ProductLanding />} />
        
        {/* Protected routes with layout - Use ProtectedRoute to guard access */}
        <Route element={isLoggedIn ? <AppLayout /> : <Navigate to="/login" replace />}>
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-bots" element={<MyBots />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:botId" element={<Chat />} />
          <Route path="/micro-chat" element={<MicroFrontendChat />} />
          <Route path="/micro-chat/:botId" element={<MicroFrontendChat />} />
          <Route path="/global-chat" element={<GlobalChat />} />
          <Route path="/bot/:botId" element={<BotLanding />} />
          <Route path="/subscription-plans" element={<SubscriptionPlans />} />
          <Route path="/cost-comparison" element={<CostComparison />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/create-agent/:templateId?" element={<CreateAgent />} />
          <Route path="/manage-agent/:botId" element={<EditAgent />} />
          <Route path="/agent/:botId" element={<AgentViewImproved />} />
          <Route path="/agent-test/:botId" element={<AgentViewABTest />} />
          <Route path="/agent-original/:botId" element={<AgentView />} />
          <Route path="/agent-improved/:botId" element={<AgentViewImproved />} />
          <Route path="/company-management" element={<CompanyManagement />} />
          <Route path="/user-management" element={<UserManagement />} />
        </Route>
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to={isLoggedIn ? "/home" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
