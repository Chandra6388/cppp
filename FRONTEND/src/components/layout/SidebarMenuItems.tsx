
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, FileSignature, LayoutTemplate, HelpCircle, UserCircle, CreditCard, TicketCheck, Star, Sparkles } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";

interface MenuItem {
  path: string;
  label: string;
  icon: React.ElementType;
  hoverEffect?: string;
}

interface SidebarMenuItemsProps {
  collapsed: boolean;
  showInitialAnimation: boolean;
  onOpenChange?: (open: boolean) => void;
  isMobile: boolean;
}

const SidebarMenuItems: React.FC<SidebarMenuItemsProps> = ({ collapsed, showInitialAnimation, onOpenChange, isMobile }) => {
  const location = useLocation();
  const UserDetails = JSON.parse(localStorage.getItem("user"))
  const Role = UserDetails?.Role

  const endpoint = window.location.hash.replace(/^#/, '').split('?')[0];

  const isActive = (path: string) => {
    return endpoint === path;
  };

  const menuItemsAdmin: MenuItem[] = [
    {
      path: "/admin/dashboard",
      label: "Home",
      icon: Home,
      hoverEffect: "hover:scale-105"
    },
    {
      path: "/admin/support-tickets",
      label: "Support Tickets ",
      icon: TicketCheck,
      hoverEffect: "hover:scale-105"
    },
    
  ];

  const menuItemsUser: MenuItem[] = [
    {
      path: "/user/dashboard",
      label: "Home",
      icon: Home,
      hoverEffect: "hover:scale-105"
    },
    {
      path: "/user/signatures",
      label: "My Signatures",
      icon: FileSignature,
      hoverEffect: "hover:rotate-3"
    },
    // {
    //   path: "/user/templates",
    //   label: "Templates",
    //   icon: LayoutTemplate,
    //   hoverEffect: "hover:translate-x-1"
    // },
    // {
    //   path: "/user/tickets",
    //   label: "Tickets",
    //   icon: TicketCheck,
    //   hoverEffect: "hover:scale-105"
    // },
    {
      path: "/user/support",
      label: "Support & Help",
      icon: HelpCircle,
      hoverEffect: "hover:scale-110"
    },
    {
      path: "/user/account",
      label: "My Account",
      icon: UserCircle,
      hoverEffect: "hover:translate-x-1"
    },
    // {
    //   path: "/user/subscription",
    //   label: "Subscription",
    //   icon: CreditCard,
    //   hoverEffect: "hover:rotate-2"
    // },
  ];

  return (
    <SidebarMenu>
      {(Role=="ADMIN" ? menuItemsAdmin : menuItemsUser || []).map((item, index) => (
        <SidebarMenuItem key={item.path} className="mb-2">
          <SidebarMenuButton
            asChild
            className={cn(
              "transition-all duration-300 group relative overflow-hidden",
              isActive(item.path)
                ? "text-[#01C8A9] bg-[#07234A]"
                : "text-[#8793A3] hover:text-white",
              "hover:bg-[#04B99D]/20 hover:text-white",
              showInitialAnimation && "animate-slide-in",
              showInitialAnimation && `animation-delay-${index * 100}`,
              collapsed ? "justify-center" : "",
              item.hoverEffect
            )}
            onClick={() => isMobile && onOpenChange?.(false)}
            tooltip={collapsed ? item.label : undefined}
          >
            <Link to={item.path} className={cn(
              "flex items-center gap-4 z-10 relative py-2.5",
              collapsed ? "justify-center px-0" : "px-2"
            )}>
              <div className={cn(
                "flex items-center justify-center w-7 h-7 rounded-md transition-all duration-300",
                isActive(item.path)
                  ? "text-[#01C8A9] bg-[#031123]/50"
                  : "text-[#8793A3]",
                isActive(item.path) && "animate-pulse",
                showInitialAnimation && "animate-icon-pulse"
              )}>
                <item.icon className="h-5 w-5" />
                {isActive(item.path) && (
                  <span className="absolute inset-0 rounded-md bg-[#01C8A9]/10 animate-ping opacity-75 duration-1000"></span>
                )}
              </div>
              {!collapsed && (
                <span className={cn(
                  "font-medium transition-all whitespace-nowrap",
                  isActive(item.path)
                    ? "text-[#01C8A9]"
                    : "text-[#8793A3] group-hover:text-white"
                )}>
                  {item.label}
                  {isActive(item.path) && (
                    <span className="ml-1.5 relative inline-flex">
                      <Sparkles size={12} className="text-[#01C8A9] animate-pulse" />
                    </span>
                  )}
                </span>
              )}

              {/* Active indicator line with subtle animation */}
              {isActive(item.path) && (
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#01C8A9] rounded-r-md before:content-[''] before:absolute before:inset-0 before:bg-white before:opacity-30 before:animate-pulse" />
              )}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}

      {/* {!collapsed && Role=="USER" && (
        <div className="mt-6 mb-2 px-4">
          <div className="bg-gradient-to-r from-[#031123] via-[#07234A] to-[#031123] rounded-lg p-3 border border-[#112F59]/40">
            <div className="flex items-center gap-3">
              <div className="bg-[#01C8A9]/20 p-2 rounded-full">
                <Star className="h-5 w-5 text-[#01C8A9] animate-pulse" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-white">Pro Features</p>
                <p className="text-xs text-[#8793A3]">Unlock advanced tools</p>
              </div>
            </div>
          </div>
        </div>
      )} */}
    </SidebarMenu>
  );
};

export default SidebarMenuItems;
