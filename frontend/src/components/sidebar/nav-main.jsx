import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "../ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

/**
 * Main navigation component for the sidebar
 * @param {Object} props - Component props
 * @param {Array} props.items - Navigation items with title, url, icon, and subitems
 * @param {boolean} props.darkMode - Whether dark mode is enabled
 */
export function NavMain({ items, darkMode }) {
  const location = useLocation();
  
  return (
    <SidebarGroup>
      <SidebarGroupLabel darkMode={darkMode}>Navigation</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          // Check if this item or any of its subitems is active
          const isItemActive = location.pathname === item.url;
          const isGroupActive = item.items?.some(subItem => location.pathname === subItem.url) || isItemActive;
          
          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isGroupActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton 
                    tooltip={item.title} 
                    isActive={isGroupActive}
                    darkMode={darkMode}
                  >
                    {item.icon && <item.icon className="size-4" />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => {
                      const isSubItemActive = location.pathname === subItem.url;
                      
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton 
                            asChild 
                            isActive={isSubItemActive}
                            darkMode={darkMode}
                          >
                            <Link to={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
