import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useIsMobile } from "../../hooks/use-mobile";
import { cn } from "../../lib/utils";

// Constants
const SIDEBAR_COOKIE_NAME = "sidebar:state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

// Create context for sidebar state management
const SidebarContext = createContext(null);

/**
 * Hook to access sidebar context
 */
export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

/**
 * Main Sidebar component
 */
export function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  darkMode,
  ...props
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  // For non-collapsible sidebar
  if (collapsible === "none") {
    return (
      <div
        className={cn(
          "flex h-full w-[--sidebar-width] flex-col",
          darkMode ? "bg-neutral-900 text-white" : "bg-white text-gray-900",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }

  // Mobile sidebar
  if (isMobile) {
    return (
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/50",
          openMobile ? "block" : "hidden"
        )}
        onClick={() => setOpenMobile(false)}
      >
        <div
          className={cn(
            "absolute h-full w-[--sidebar-width] p-0",
            darkMode ? "bg-neutral-900 text-white" : "bg-white text-gray-900",
            side === "left" ? "left-0" : "right-0"
          )}
          style={{
            "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex h-full w-full flex-col">{children}</div>
        </div>
      </div>
    );
  }

  // Desktop sidebar
  return (
    <div
      className="group peer hidden lg:block"
      data-state={state.open ? "open" : "collapsed"}
      data-collapsible={state.open ? "" : "icon-only"}
      data-variant={variant}
      data-side={side}
    >
      {/* This handles the sidebar gap on desktop */}
      <div
        className={cn(
          "relative h-screen bg-transparent transition-[width] duration-300 ease-in-out",
          state.open ? "w-64" : "w-12",
          "group-data-[side=right]:rotate-180"
        )}
        style={{
          "--sidebar-width": "16rem",
          "--sidebar-width-icon": "3rem",
        }}
      />
      <div
        className={cn(
          "fixed inset-y-0 z-40 hidden h-screen flex-col overflow-hidden border-r shadow-md transition-all duration-300 ease-in-out lg:flex",
          side === "left"
            ? "left-0"
            : "right-0",
          state.open ? "w-64" : "w-12",
          // Adjust the padding for floating and inset variants
          variant === "floating" || variant === "inset"
            ? "p-2"
            : "group-data-[side=left]:border-r group-data-[side=right]:border-l",
          className
        )}
        style={{
          "--sidebar-width": SIDEBAR_WIDTH,
          "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
        }}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          className={cn(
            "relative flex h-full w-full flex-col",
            darkMode ? "bg-neutral-900 text-white" : "bg-white text-gray-900",
            variant === "floating" && "rounded-lg border shadow",
            variant === "floating" && darkMode && "border-neutral-800"
          )}
        >
          {/* Add collapse trigger */}
          <SidebarCollapseTrigger darkMode={darkMode} />
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Sidebar Provider component
 */
export function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}) {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = useState(false);

  // Internal state of the sidebar
  const [_open, _setOpen] = useState(defaultOpen);
  const open = openProp ?? _open;
  
  const setOpen = useCallback(
    (value) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }

      // Set cookie to remember sidebar state
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open]
  );

  // Toggle sidebar
  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setOpenMobile((prevOpen) => !prevOpen);
    } else {
      setOpen(!open);
      console.log('Toggling sidebar, new state:', !open);
    }
  }, [isMobile, setOpen, open, setOpenMobile]);

  // Add keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  // Close mobile sidebar on route change
  useEffect(() => {
    if (isMobile && openMobile) {
      setOpenMobile(false);
    }
  }, [location.pathname, isMobile, openMobile]);

  // Load sidebar state from cookie on mount
  useEffect(() => {
    const cookies = document.cookie.split(';');
    const sidebarCookie = cookies.find(cookie => cookie.trim().startsWith(`${SIDEBAR_COOKIE_NAME}=`));
    
    if (sidebarCookie) {
      const sidebarState = sidebarCookie.split('=')[1] === 'true';
      _setOpen(sidebarState);
    }
  }, []);

  const state = {
    open: open,
    status: open ? "expanded" : "collapsed"
  };

  const contextValue = {
    state,
    isMobile,
    openMobile,
    setOpenMobile,
    toggleSidebar,
    currentPath: location.pathname
  };

  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        style={{
          "--sidebar-width": SIDEBAR_WIDTH,
          "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
          ...style,
        }}
        className={cn(
          "group/sidebar-wrapper flex min-h-screen w-full",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

/**
 * Sidebar trigger button
 */
export function SidebarTrigger({ className, onClick, darkMode, ...props }) {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      data-sidebar="trigger"
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md text-sm",
        darkMode ? "text-white hover:bg-neutral-800" : "text-gray-700 hover:bg-gray-100",
        className
      )}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
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
        className="size-4"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <path d="M9 3v18" />
      </svg>
      <span className="sr-only">Toggle Sidebar</span>
    </button>
  );
}

/**
 * Sidebar collapse trigger - toggles between full sidebar and icon-only mode
 */
export function SidebarCollapseTrigger({ className, onClick, darkMode, ...props }) {
  const { state, toggleSidebar } = useSidebar();
  
  return (
    <button
      data-sidebar="collapse-trigger"
      title={state.open ? "Collapse sidebar" : "Expand sidebar"}
      aria-label={state.open ? "Collapse sidebar" : "Expand sidebar"}
      className={cn(
        "absolute right-0 top-20 z-50 flex h-6 w-6 translate-x-1/2 items-center justify-center rounded-full border shadow-sm transition-colors",
        darkMode 
          ? "border-neutral-700 bg-neutral-800 text-gray-300 hover:bg-neutral-700 hover:text-white" 
          : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900",
        className
      )}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
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
        className="size-3 transition-transform"
        style={{ transform: state.open ? 'rotate(0deg)' : 'rotate(180deg)' }}
      >
        <path d="m15 18-6-6 6-6" />
      </svg>
      <span className="sr-only">{state.open ? "Collapse sidebar" : "Expand sidebar"}</span>
    </button>
  );
}

/**
 * Sidebar rail for resizing
 */
export function SidebarRail({ className, ...props }) {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      data-sidebar="rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-gray-200 group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
        "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-gray-50",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className
      )}
      {...props}
    />
  );
}

/**
 * Sidebar header component
 */
export function SidebarHeader({ className, ...props }) {
  return (
    <div
      data-sidebar="header"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  );
}

/**
 * Sidebar footer component
 */
export function SidebarFooter({ className, ...props }) {
  return (
    <div
      data-sidebar="footer"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  );
}

/**
 * Sidebar content component
 */
export function SidebarContent({ className, ...props }) {
  return (
    <div
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className
      )}
      {...props}
    />
  );
}

/**
 * Sidebar group component
 */
export function SidebarGroup({ className, ...props }) {
  return (
    <div
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
      {...props}
    />
  );
}

/**
 * Sidebar group label component
 */
export function SidebarGroupLabel({ className, darkMode, ...props }) {
  return (
    <div
      data-sidebar="group-label"
      className={cn(
        "flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium transition-[margin,opacity] duration-200 ease-linear",
        darkMode ? "text-gray-400" : "text-gray-500",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className
      )}
      {...props}
    />
  );
}

/**
 * Sidebar menu component
 */
export function SidebarMenu({ className, ...props }) {
  return (
    <ul
      data-sidebar="menu"
      className={cn("flex w-full min-w-0 flex-col gap-1", className)}
      {...props}
    />
  );
}

/**
 * Sidebar menu item component
 */
export function SidebarMenuItem({ className, ...props }) {
  return (
    <li
      data-sidebar="menu-item"
      className={cn("group/menu-item relative", className)}
      {...props}
    />
  );
}

/**
 * Sidebar menu button component
 */
export function SidebarMenuButton({
  className,
  darkMode,
  isActive = false,
  tooltip,
  icon,
  children,
  size = "default",
  ...props
}) {
  const { state, isMobile } = useSidebar();
  const isCollapsed = !state.open && !isMobile;

  const baseClasses = cn(
    "flex items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none transition-all duration-200 ease-in-out",
    size === "default" ? "h-8 text-sm" : size === "sm" ? "h-7 text-xs" : "h-12 text-sm",
    isCollapsed ? "justify-center w-8" : "w-full",
    isActive
      ? darkMode
        ? "bg-neutral-700 font-medium text-white"
        : "bg-gray-100 font-medium text-blue-600"
      : darkMode
      ? "text-gray-400 hover:bg-neutral-700 hover:text-white"
      : "text-gray-700 hover:bg-gray-100 hover:text-blue-600",
    className
  );

  // If sidebar is collapsed, only show icon with tooltip
  if (isCollapsed) {
    return (
      <div className="relative group w-full flex justify-center">
        <button
          data-sidebar="menu-button"
          data-size={size}
          data-active={isActive}
          className={baseClasses}
          {...props}
        >
          {icon}
        </button>
        {tooltip && (
          <div className="absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 rounded-md bg-black px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
            {tooltip}
          </div>
        )}
      </div>
    );
  }

  // Regular button with icon and text
  return (
    <button
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive}
      className={baseClasses}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}

/**
 * Sidebar menu sub component
 */
export function SidebarMenuSub({ className, ...props }) {
  return (
    <ul
      data-sidebar="menu-sub"
      className={cn("ml-6 mt-1 flex flex-col gap-1", className)}
      {...props}
    />
  );
}

/**
 * Sidebar menu sub item component
 */
export function SidebarMenuSubItem({ className, ...props }) {
  return (
    <li
      data-sidebar="menu-sub-item"
      className={cn("relative", className)}
      {...props}
    />
  );
}

/**
 * Sidebar menu sub button component
 */
export function SidebarMenuSubButton({
  className,
  darkMode,
  isActive = false,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? React.Fragment : "button";

  return (
    <Comp
      data-sidebar="menu-sub-button"
      data-active={isActive}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm",
        isActive
          ? darkMode
            ? "bg-neutral-700 font-medium text-white"
            : "bg-gray-100 font-medium text-blue-600"
          : darkMode
          ? "text-gray-400 hover:bg-neutral-700 hover:text-white"
          : "text-gray-700 hover:bg-gray-100 hover:text-blue-600",
        className
      )}
      {...props}
    />
  );
}

/**
 * SidebarInset component - Contains the main content area next to the sidebar
 */
export function SidebarInset({ className, children, ...props }) {
  const { state, isMobile } = useSidebar();
  
  return (
    <div
      data-sidebar="inset"
      className={cn(
        "flex min-h-screen w-full flex-col transition-all duration-300 ease-in-out",
        !isMobile && (state.open ? "ml-64" : "ml-12"),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
