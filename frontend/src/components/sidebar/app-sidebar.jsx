import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Settings,
  Users,
  FileText,
  MessageSquare,
  HelpCircle,
  BarChart2,
  Layout,
  Bot,
  Store,
  PieChart,
  Building2,
  Copy,
  LogOut,
  Sun,
  Moon,
  UserCog,
} from "lucide-react";

import { getFromStorage, saveToStorage, STORAGE_KEYS } from "../../utils/localStorage";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  SidebarCollapseTrigger,
} from "../ui/sidebar";

/**
 * Main application sidebar component
 * @param {Object} props - Component props
 * @param {boolean} props.darkMode - Whether dark mode is enabled
 * @param {Function} props.onToggleDarkMode - Dark mode toggle handler
 * @param {Function} props.onLogout - Logout handler function
 */
export function AppSidebar({ darkMode, onToggleDarkMode, onLogout, ...props }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isCreatorMode, setIsCreatorMode] = useState(
    getFromStorage(STORAGE_KEYS.USER_MODE, 'user') === 'creator'
  );
  const [tpuSeconds, setTpuSeconds] = useState(
    getFromStorage(STORAGE_KEYS.CREDITS, 2592000)
  );
  const [usedTpuSeconds, setUsedTpuSeconds] = useState(0);

  // Fetch user data from localStorage on mount
  useEffect(() => {
    // User data
    const userEmail = getFromStorage(STORAGE_KEYS.USER_EMAIL, 'user@example.com');
    setUser({
      name: userEmail.split('@')[0] || "User",
      email: userEmail,
      avatar: null,
    });

    // TPU/Credits data
    const credits = getFromStorage(STORAGE_KEYS.CREDITS, 2592000);
    setTpuSeconds(credits);
    setUsedTpuSeconds(Math.round(credits * 0.67));
  }, []);

  // Toggle between user and creator modes
  const toggleMode = () => {
    const newMode = !isCreatorMode;
    setIsCreatorMode(newMode);
    saveToStorage(STORAGE_KEYS.USER_MODE, newMode ? 'creator' : 'user');
  };

  // Format helpers
  const formatCredits = (tpuSeconds) => {
    if (tpuSeconds >= 1000000) return `${(tpuSeconds / 1000000).toFixed(2)}M`;
    if (tpuSeconds >= 1000) return `${(tpuSeconds / 1000).toFixed(1)}K`;
    return tpuSeconds.toString();
  };

  // Common navigation items (for both user and creator modes)
  const commonNavItems = [
    {
      title: "Home",
      url: "/home",
      icon: Home,
      isActive: location.pathname === '/home' || location.pathname === '/',
      items: [],
    },
    {
      title: "Chat",
      url: "/global-chat",
      icon: MessageSquare,
      isActive: location.pathname === '/global-chat',
      items: [],
    },
    {
      title: "Micro Chat",
      url: "/micro-chat",
      icon: MessageSquare,
      isActive: location.pathname === '/micro-chat' || location.pathname.startsWith('/micro-chat/'),
      items: [],
    },
    {
      title: "Marketplace",
      url: "/marketplace",
      icon: Store,
      isActive: location.pathname === '/marketplace',
      items: [],
    },
  ];

  // Creator mode specific navigation items
  const creatorNavItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: PieChart,
      isActive: location.pathname === '/dashboard',
      items: [],
    },
    {
      title: "My Agents",
      url: "/my-bots",
      icon: Bot,
      isActive: location.pathname === '/my-bots',
      items: [],
    },
    {
      title: "My Company",
      url: "/company-management",
      icon: Building2,
      isActive: location.pathname === '/company-management',
      items: [],
    },
    {
      title: "Templates",
      url: "/templates",
      icon: Copy,
      isActive: location.pathname === '/templates',
      items: [],
    },
    {
      title: "Admin",
      url: "/admin",
      icon: Settings,
      isActive: location.pathname === '/admin',
      items: [],
    },
    {
      title: "User Management",
      url: "/user-management",
      icon: UserCog,
      isActive: location.pathname === '/user-management',
      items: [],
    },
  ];

  // Determine which navigation items to show based on mode
  // Only show common items in the main navigation
  const navItems = commonNavItems;

  // Calculate remaining credits
  const remainingTpuSeconds = tpuSeconds - usedTpuSeconds;

  return (
    <Sidebar darkMode={darkMode} {...props}>
      <SidebarHeader>
        {/* Logo */}
        <div className="flex items-center gap-2 px-2 py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center">
              <svg width="25" height="25" viewBox="0 0 17 19" fill="none">
                <path d="M16.8817 11.255L14.0684 12.6617L11.2551 11.255L14.0684 9.84839L16.8817 11.255Z" fill="#66CBE2"></path>
                <path d="M14.0683 12.6617C13.5453 13.7063 12.7419 14.5847 11.748 15.1986C10.7541 15.8125 9.60898 16.1376 8.44079 16.1376C7.2726 16.1376 6.12746 15.8125 5.13357 15.1986C4.13969 14.5847 3.33628 13.7063 2.81329 12.6617L5.62662 11.2551C5.88803 11.7776 6.28974 12.217 6.78678 12.5241C7.28381 12.8312 7.85653 12.9939 8.44079 12.9939C9.02505 12.9939 9.59777 12.8312 10.0948 12.5241C10.5918 12.217 10.9936 11.7776 11.255 11.2551L14.0683 12.6617Z" fill="#41B1E5"></path>
                <path d="M5.62665 11.255L2.81332 12.6617L0 11.255L2.81332 9.84839L5.62665 11.255Z" fill="#66CBE2"></path>
                <path d="M16.8816 11.2551C16.8824 11.2613 16.8824 11.2676 16.8816 11.2738C16.5443 13.2675 15.5119 15.0773 13.9674 16.3824C12.423 17.6875 10.4662 18.4036 8.4442 18.4036C6.42216 18.4036 4.46544 17.6875 2.92098 16.3824C1.37652 15.0773 0.344097 13.2675 0.0067749 11.2738C0.00757591 11.2676 0.00757591 11.2613 0.0067749 11.2551L2.8201 12.6617C3.34309 13.7063 4.14649 14.5847 5.14038 15.1986C6.13427 15.8125 7.27941 16.1376 8.4476 16.1376C9.61579 16.1376 10.7609 15.8125 11.7548 15.1986C12.7487 14.5847 13.5521 13.7063 14.0751 12.6617L16.8816 11.2551Z" fill="#5279BC"></path>
                <path d="M14.0684 2.81334V8.44169L11.2551 7.03333V1.40668L14.0684 2.81334Z" fill="#41B1E5"></path>
                <path d="M16.8817 1.40666L14.0684 2.81332L11.2551 1.40666L14.0684 0L16.8817 1.40666Z" fill="#66CBE2"></path>
                <path d="M16.8817 1.40668V7.03333L14.0684 8.44169V2.81334L16.8817 1.40668Z" fill="#5279BC"></path>
                <path d="M5.62665 1.40666L2.81332 2.81332L0 1.40666L2.81332 0L5.62665 1.40666Z" fill="#66CBE2"></path>
                <path d="M2.81332 2.81334V8.44169L0 7.03333V1.40668L2.81332 2.81334Z" fill="#41B1E5"></path>
                <path d="M5.62662 1.40668V7.03333L2.81329 8.44169V2.81334L5.62662 1.40668Z" fill="#5279BC"></path>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className={`text-lg font-semibold leading-none ${darkMode ? 'text-white' : 'text-gray-900'}`}>Agentspace</span>
            </div>
          </Link>
        </div>

        {/* Mode Toggle Switch */}
        <div className="px-3 py-2">
          <div className="flex p-[2px] rounded-lg bg-gray-100 dark:bg-neutral-800" style={{ minHeight: '34px' }}>
            <button
              onClick={() => isCreatorMode && toggleMode()}
              className={`relative flex-1 flex items-center justify-center gap-1.5 rounded-md text-xs font-medium transition-all duration-300 ${
                !isCreatorMode 
                  ? 'bg-white dark:bg-neutral-700 text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
              }`}
              style={{ height: '30px' }}
            >
              <Sun className="size-3.5" />
              User
            </button>

            <button
              onClick={() => !isCreatorMode && toggleMode()}
              className={`relative flex-1 flex items-center justify-center gap-1.5 rounded-md text-xs font-medium transition-all duration-300 ${
                isCreatorMode 
                  ? 'bg-white dark:bg-neutral-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
              }`}
              style={{ height: '30px' }}
            >
              <Bot className="size-3.5" />
              Creator
            </button>
          </div>
        </div>

        <div className={`mx-4 mb-2 border-b ${darkMode ? 'border-neutral-800' : 'border-gray-200'}`}></div>
      </SidebarHeader>
      
      <SidebarContent>
        {/* Navigation */}
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <Link to={item.url}>
                  <SidebarMenuButton 
                    tooltip={item.title} 
                    isActive={item.isActive}
                    darkMode={darkMode}
                    icon={item.icon && <item.icon className="size-4" />}
                  >
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Creator mode section */}
        {isCreatorMode && (
          <SidebarGroup>
            <SidebarGroupLabel darkMode={darkMode}>Agent Management</SidebarGroupLabel>
            <SidebarMenu>
              {creatorNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <Link to={item.url}>
                    <SidebarMenuButton 
                      tooltip={item.title} 
                      isActive={item.isActive}
                      darkMode={darkMode}
                      icon={item.icon && <item.icon className="size-4" />}
                    >
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>
      
      <SidebarFooter>
        {/* User section */}
        <NavUser 
          user={user || { name: "User", email: "user@example.com", avatar: null }} 
          darkMode={darkMode} 
          onToggleDarkMode={onToggleDarkMode} 
          onLogout={onLogout} 
        />

        {/* Credits indicator */}
        <div className={`mx-2 mb-2 p-3 rounded-lg ${darkMode ? 'bg-neutral-800' : 'bg-gray-50'}`}>
          <div className="mb-1">
            <span className={`text-xs font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              FREE PLAN
            </span>
          </div>
          
          <div className="flex items-center gap-1 mb-1">
            <svg className="size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            <span className={`text-xs font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Credits</span>
            <span className={`text-xs font-medium ml-auto ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              {formatCredits(remainingTpuSeconds)}/{formatCredits(tpuSeconds)}
            </span>
          </div>

          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full" 
              style={{ width: `${(remainingTpuSeconds / tpuSeconds) * 100}%` }}
            ></div>
          </div>
        </div>
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  );
}
