
import React from "react";
import { Menu, Bell, Search, User, Settings, HelpCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { useProfileDropdown } from "@/hooks/use-profile-dropdown";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  onMenuClick: () => void;
  hideAccount?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, hideAccount = false }) => {
  const { logout } = useAuth();
  const UserDetails = JSON.parse(localStorage.getItem('user'))
  const isMobile = useIsMobile();
  const { isOpen, toggleDropdown, dropdownRef } = useProfileDropdown();
  const { toast } = useToast();

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

  return (
    <header className="bg-[#031123] border-b border-[#112F59] p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="md:hidden"
          >
            <Menu className="h-5 w-5 text-white" />
          </Button>

          {/* Welcome message */}
          <h2 className="text-white font-medium hidden sm:block">Welcome, {displayName}</h2>

          {!isMobile && (
            <div className="relative max-w-md w-80 hidden md:block ml-6">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8 bg-[#001430] border-[#112F59] text-white w-full"
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* <Button variant="ghost" size="icon" className="text-white">
            <Link to="/notifications">
              <Bell className="h-5 w-5" />
            </Link>
          </Button> */}

          {!hideAccount && (
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center gap-2"
                onClick={toggleDropdown}
              >
                <Avatar className="h-9 w-9 border border-[#01C8A9] cursor-pointer">
                  <AvatarFallback className="bg-[#01C8A9] text-white">{getUserInitial()}</AvatarFallback>
                </Avatar>
              </button>

              {/* Dropdown Menu */}
              {isOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-[#031123] border border-[#112F59] z-50">
                  <div className="py-2">
                    <div className="px-4 py-3 border-b border-[#112F59]">
                      <p className="text-sm text-white font-medium">{displayName}</p>
                      <p className="text-xs text-[#8793A3]">{UserDetails?.Email || 'user@example.com'}</p>
                    </div>
                    <Link
                      to="/user/account"
                      className="flex items-center px-4 py-2 text-sm text-white hover:bg-[#112F59]/50 transition-colors"
                    >
                      <User size={16} className="mr-2" />
                      My Account
                    </Link>
                    {/* <Link 
                      to="/user/settings" 
                      className="flex items-center px-4 py-2 text-sm text-white hover:bg-[#112F59]/50 transition-colors"
                    >
                      <Settings size={16} className="mr-2" />
                      Settings
                    </Link> */}
                    {/* <Link 
                      to="/user/support" 
                      className="flex items-center px-4 py-2 text-sm text-white hover:bg-[#112F59]/50 transition-colors"
                    >
                      <HelpCircle size={16} className="mr-2" />
                      Help & Support
                    </Link> */}
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
