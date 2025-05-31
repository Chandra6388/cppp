
import { Home, Search, User, PlusCircle, FileText } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface MobileNavbarProps {
  onCreateClick?: () => void;
}

const MobileNavbar: React.FC<MobileNavbarProps> = ({ onCreateClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleCreateClick = () => {
    navigate('/create-signature');
  };
  
  const navItems = [
    {
      icon: Home,
      label: "Home",
      path: "/",
    },
    {
      icon: FileText,
      label: "Signatures",
      path: "/signatures",
    },
    {
      icon: PlusCircle,
      label: "Create",
      path: "/create",
      action: handleCreateClick,
    },
    {
      icon: Search,
      label: "Search",
      path: "/search",
    },
    {
      icon: User,
      label: "Account",
      path: "/account",
    },
  ];


  const endpoint = window.location.hash.replace(/^#/, '').split('?')[0];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="grid grid-cols-5 gap-1 bg-gradient-to-t from-[#021a38] to-[#031123] border-t border-[#112F59] p-2">
        {navItems.map((item) => {
          const isActive = item.path === endpoint;
          return (
            <div key={item.label} className="flex flex-col items-center">
              {item.action ? (
                <button
                  className="w-full flex flex-col items-center pt-2 pb-1 px-1"
                  onClick={item.action}
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
                </button>
              ) : (
                <Link
                  to={item.path}
                  className="w-full flex flex-col items-center pt-2 pb-1 px-1"
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
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavbar;
