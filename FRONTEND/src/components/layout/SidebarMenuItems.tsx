import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  FileSignature,
  HelpCircle,
  UserCircle,
  TicketCheck,
  Sparkles,
  Settings,
  Trash,
  Box,
  Bell,
  RadioTower ,
  NotebookPen ,
  MessagesSquare
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import socket from "@/socket";

const SidebarMenuItems = ({
  collapsed,
  showInitialAnimation,
  onOpenChange,
  isMobile,
}) => {
  const location = useLocation();
  const UserDetails = JSON.parse(localStorage.getItem("user"));
  const Role = UserDetails?.Role;
  const userId = UserDetails?._id;
  const readerType = Role === "USER" ? "support" : "user";

  const endpoint = window.location.hash.replace(/^#/, "").split("?")[0];
  const isActive = (path) => endpoint === path;

  const [unreadCounts, setUnreadCounts] = useState(0);
  const isOpen = localStorage.getItem("open");

  const menuItemsByRole = {
    ADMIN: [
      { path: "/admin/dashboard", label: "Home", icon: Home },
      { path: "/admin/support-tickets", label: "Support Tickets", icon: TicketCheck },
      { path: "/admin/broadcast", label: "Broadcast", icon: RadioTower  },
      { path: "/admin/all-blog", label: "All Blog", icon: NotebookPen},
      { path: "/admin/contactUs", label: "Contact Us", icon: MessagesSquare},



    ],
    EMPLOYEE: [
      { path: "/employee/dashboard", label: "Home", icon: Home },
      { path: "/employee/tickets", label: "Tickets", icon: TicketCheck, showUnread: true },
      { path: "/employee/notifications", label: "Notifications", icon: Bell },

    ],
    USER: [
      { path: "/user/dashboard", label: "Home", icon: Home },
      { path: "/user/signatures", label: "My Signatures", icon: FileSignature },
      { path: "/user/templates", label: "Templates", icon: Box },
      { path: "/user/tickets", label: "Tickets", icon: TicketCheck, showUnread: true },
      { path: "/user/support", label: "Support & Help", icon: HelpCircle },
      { path: "/user/notifications", label: "Notifications", icon: Bell },
      { path: "/user/account", label: "My Account", icon: UserCircle },
      { path: "/user/settings", label: "Settings", icon: Settings },
      { path: "/user/recycle-bin", label: "Recycle Bin", icon: Trash },
    ],
  };

  const menuItems = menuItemsByRole[Role] || [];

  // 🟢 Emit unread count request on mount
  useEffect(() => {
    if (userId) {
      socket.emit("join_user_room", { userId });
      socket.emit("unreadCountUpdate", { userId, readerType });
    }
  }, [userId, readerType, isOpen]);

  // 🟢 Handle unread count response
  useEffect(() => {
    const handleUnreadCountResponse = ({ userId: incomingId, count }) => {
      if (incomingId === userId) {
        setUnreadCounts(count);
      }
    };

    socket.on("unreadCountResponse", handleUnreadCountResponse);
    return () => {
      socket.off("unreadCountResponse", handleUnreadCountResponse);
    };
  }, [userId]);

  // 🟢 Refresh unread count when window is focused
  useEffect(() => {
    const handleFocus = () => {
      socket.emit("unreadCountUpdate", { userId, readerType });
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [userId, readerType]);

  // 🟢 Listen for message seen event and refresh count
  useEffect(() => {
    const handleMessagesMarkedAsRead = ({ ticketId, readerType: msgReaderType }) => {
      // Make sure it’s relevant
      if (msgReaderType !== readerType) {
        socket.emit("unreadCountUpdate", { userId, readerType });
      }
    };

    socket.on("messages_marked_as_read", handleMessagesMarkedAsRead);
    return () => {
      socket.off("messages_marked_as_read", handleMessagesMarkedAsRead);
    };
  }, [userId, readerType]);

  return (
    <SidebarMenu>
      {menuItems.map((item, index) => (
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
            <Link
              to={item.path}
              className={cn(
                "flex items-center gap-4 z-10 relative py-2.5",
                collapsed ? "justify-center px-0" : "px-2"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-7 h-7 rounded-md transition-all duration-300",
                  isActive(item.path)
                    ? "text-[#01C8A9] bg-[#031123]/50"
                    : "text-[#8793A3]",
                  isActive(item.path) && "animate-pulse",
                  showInitialAnimation && "animate-icon-pulse"
                )}
              >
                <item.icon className="h-5 w-5" />
                {isActive(item.path) && (
                  <span className="absolute inset-0 rounded-md bg-[#01C8A9]/10 animate-ping opacity-75 duration-1000"></span>
                )}
              </div>

              {!collapsed && (
                <span
                  className={cn(
                    "font-medium transition-all whitespace-nowrap flex items-center gap-2",
                    isActive(item.path)
                      ? "text-[#01C8A9]"
                      : "text-[#8793A3] group-hover:text-white"
                  )}
                >
                  {item.label}

                  {item.showUnread && unreadCounts > 0 && (
                    <span className="inline-flex items-center justify-center px-1.5 text-[10px] bg-red-600 text-white rounded-full font-bold min-w-[18px] h-[18px]">
                      {unreadCounts}
                    </span>
                  )}

                  {isActive(item.path) && (
                    <span className="ml-1.5 relative inline-flex">
                      <Sparkles size={12} className="text-[#01C8A9] animate-pulse" />
                    </span>
                  )}
                </span>
              )}

              {isActive(item.path) && (
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#01C8A9] rounded-r-md before:content-[''] before:absolute before:inset-0 before:bg-white before:opacity-30 before:animate-pulse" />
              )}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};

export default SidebarMenuItems;
