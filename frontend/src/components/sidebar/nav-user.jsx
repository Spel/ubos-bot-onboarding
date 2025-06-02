import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sun, Moon, User, LogOut, Settings } from "lucide-react";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "../ui/sidebar";

/**
 * User navigation component for sidebar
 * @param {Object} props - Component props
 * @param {Object} props.user - User data
 * @param {boolean} props.darkMode - Whether dark mode is enabled
 * @param {Function} props.onToggleDarkMode - Dark mode toggle handler
 * @param {Function} props.onLogout - Logout handler function
 */
export function NavUser({ user, darkMode, onToggleDarkMode, onLogout, ...props }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Toggle dropdown menu
  const toggleMenu = () => setIsOpen(!isOpen);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="px-2 py-2" ref={dropdownRef}>
      <button
        onClick={toggleMenu}
        className={`flex w-full items-center justify-between rounded-md px-2 py-2 ${darkMode ? 'hover:bg-neutral-800' : 'hover:bg-gray-100'}`}
      >
        <div className="flex items-center gap-2">
          <div className={`flex size-8 items-center justify-center rounded-full ${darkMode ? 'bg-neutral-700' : 'bg-gray-200'}`}>
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="size-8 rounded-full object-cover"
              />
            ) : (
              <User className="size-4" />
            )}
          </div>
          <div className="flex flex-col">
            <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {user?.name || "User"}
            </span>
            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {user?.email || "user@example.com"}
            </span>
          </div>
        </div>
        <ChevronDown className={`size-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          className={`mt-1 rounded-md shadow-lg ${darkMode ? 'bg-neutral-800' : 'bg-white border border-gray-200'}`}
          style={{ zIndex: 50 }}
        >
          <SidebarMenu>
            <SidebarMenuItem>
              <Link to="/profile">
                <SidebarMenuButton
                  tooltip="Profile"
                  darkMode={darkMode}
                >
                  <User className="size-4" />
                  <span>Profile</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <Link to="/settings">
                <SidebarMenuButton
                  tooltip="Settings"
                  darkMode={darkMode}
                >
                  <Settings className="size-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={onToggleDarkMode}
                tooltip={darkMode ? "Light Mode" : "Dark Mode"}
                darkMode={darkMode}
              >
                {darkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
                <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={onLogout}
                tooltip="Logout"
                darkMode={darkMode}
              >
                <LogOut className="size-4" />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      )}
    </div>
  );
}

// ChevronDown icon component
function ChevronDown(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

// Sun component is imported from lucide-react

// Moon component is imported from lucide-react
