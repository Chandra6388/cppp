import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  FileSignature,
  HelpCircle,
  UserCircle,
  TicketCheck,
  RadioTower,
  NotebookPen,
  Bell,
} from "lucide-react";

const MobileNavbar = () => {
  const location = useLocation();
  const UserDetails = JSON.parse(localStorage.getItem("user"));
  const Role = UserDetails?.Role;

  const menuItemsByRole = {
    ADMIN: [
      { path: "/admin/dashboard", label: "Home", icon: Home },
      { path: "/admin/support-tickets", label: "Support Tickets", icon: TicketCheck },
      { path: "/admin/broadcast", label: "Broadcast", icon: RadioTower },
      { path: "/admin/all-blog", label: "All Blog", icon: NotebookPen },
    ],
    EMPLOYEE: [
      { path: "/employee/dashboard", label: "Home", icon: Home },
      { path: "/employee/tickets", label: "Tickets", icon: TicketCheck, showUnread: true },
      { path: "/employee/notifications", label: "Notifications", icon: Bell },
    ],
    USER: [
      { path: "/user/dashboard", label: "Home", icon: Home },
      { path: "/user/signatures", label: "My Signatures", icon: FileSignature },
      { path: "/user/support", label: "Support & Help", icon: HelpCircle },
      { path: "/user/account", label: "My Account", icon: UserCircle },
    ],
  };

  const menuItems = menuItemsByRole[Role] || [];
  const endpoint = location.pathname;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="flex bg-gradient-to-t from-[#021a38] to-[#031123] border-t border-[#112F59]">
        {menuItems.map((item) => {
          const isActive = item.path === endpoint;
          return (
            <Link
              key={item.label}
              to={item.path}
              className="flex-1 flex flex-col items-center py-2"
            >
              <item.icon
                className={cn(
                  "h-5 w-5 mb-1",
                  isActive ? "text-[#01C8A9]" : "text-gray-400"
                )}
              />
              <span
                className={cn(
                  "text-[10px]",
                  isActive ? "text-[#01C8A9]" : "text-gray-400"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavbar;
