
import React, { useEffect, useState } from "react";
import { Menu, Bell, Search, User, Settings, HelpCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { useProfileDropdown } from "@/hooks/use-profile-dropdown";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import socket from "@/socket";
import { getAllNotification } from "@/rediuxStore/slice/user/userSlice";
import { useAppDispatch } from "@/rediuxStore/store/hooks";

interface HeaderProps {
  onMenuClick: () => void;
  hideAccount?: boolean;
}
const Header: React.FC<HeaderProps> = ({ onMenuClick, hideAccount = false }) => {
  const { logout } = useAuth();
  const dispatch = useAppDispatch();
  const UserDetails = JSON.parse(localStorage.getItem("user") || "{}");
  const isMobile = useIsMobile();
  const { isOpen, toggleDropdown, dropdownRef } = useProfileDropdown();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState([]);



  const fetchNotifications = async () => {
    const req = { reciverId: UserDetails?._id };
    await dispatch(getAllNotification(req)).unwrap()
      .then((res: any) => {
        if (res?.status) {
          setNotifications(res?.data);
        } else {
          setNotifications([]);
        }
      })
      .catch((err: any) => {
        console.log("err", err);
      })
  }


  useEffect(() => {
    fetchNotifications();
  }, []);


  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
        variant: "success",
        duration: 1000,
      });
    } catch (error) {
      console.error("Logout failed", error);
      toast({
        title: "Logout failed",
        description: "There was a problem logging out",
        variant: "destructive",
        duration: 1000,
      });
    }
  };
  const getUserInitial = () => {
    if (UserDetails?.Username) {
      return UserDetails?.Username.charAt(0);
    }
  };
  const displayName = UserDetails?.Username


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user?._id) return;

    socket.emit("join_user_room", { userId: user._id });
    socket.on("new_notification", (newNotif) => {
      setNotifications(prev => [newNotif, ...prev]);
    });

    return () => {
      socket.off("new_notification");
    };
  }, []);


  const getUnredNotificationsCount = () => {
    return notifications?.filter(notif => !notif.isRead).length;
 
  };

  const unreadCount = getUnredNotificationsCount();

  const getRoute = () => {
    if (UserDetails?.Role === "USER") {
      return "/user/";
    } else if (UserDetails?.Role === "EMPLOYEE") {
      return "/employee/";
    } else {
      return "/admin/";
    }
  }
  return (
    <header className="bg-[#031123] border-b border-[#112F59] p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onMenuClick} className="md:hidden">
            <Menu className="h-5 w-5 text-white" />
          </Button>
          <h2 className="text-white font-medium hidden sm:block">Welcome, {displayName}</h2>
        </div>
        <div className="flex items-center gap-10">
          {UserDetails?.Role == "ADMIN" ? "" : <Button variant="ghost" size="icon" className="text-white relative">
            <Link to={`${UserDetails?.Role == "USER" ? "/user/notifications" : "/employee/notifications"}`}>
              <Bell className="h-10 w-10" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
          </Button>}
          {!hideAccount && (
            <div className="relative" ref={dropdownRef}>
              <button className="flex items-center gap-2" onClick={toggleDropdown}>
                <Avatar className="h-9 w-9 border border-[#01C8A9] cursor-pointer">
                  <AvatarFallback className="bg-[#01C8A9] text-white">{getUserInitial()}</AvatarFallback>
                </Avatar>
              </button>
              {isOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-[#031123] border border-[#112F59] z-50">
                  <div className="py-2">
                    <div className="px-4 py-3 border-b border-[#112F59]">
                      <p className="text-sm text-white font-medium">{displayName}</p>
                      <p className="text-xs text-[#8793A3]">{UserDetails?.Email || 'user@example.com'}</p>
                    </div>
                    <Link
                      to={getRoute() + "account"}
                      className="flex items-center px-4 py-2 text-sm text-white hover:bg-[#112F59]/50 transition-colors"
                    >
                      <User size={16} className="mr-2" />
                      My Account
                    </Link>
                    <Link
                      to={getRoute() + "settings"}
                      className="flex items-center px-4 py-2 text-sm text-white hover:bg-[#112F59]/50 transition-colors"
                    >
                      <Settings size={16} className="mr-2" />
                      Settings
                    </Link>

                    <div className="border-t border-[#112F59] mt-1"></div>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-red-400 hover:bg-[#112F59]/50 transition-colors"
                    >
                      <LogOut size={16} className="mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
