
import React from "react";
import { MoveLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface SidebarFooterProps {
  collapsed: boolean;
  showInitialAnimation: boolean;
  onCreateSignature?: () => void;
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({
  collapsed,
  showInitialAnimation,
  onCreateSignature,
}) => {
  const { logout } = useAuth();
  const { toast } = useToast();

  if (collapsed) {
    return (
      <div className="px-2 py-4">
        <button
          onClick={onCreateSignature}
          className="w-full bg-[#01C8A9] hover:bg-[#01a78f] text-white rounded-md flex items-center justify-center p-2 transition-all duration-300 hover:shadow-lg relative overflow-hidden group"
          title="Create Signature"
        >
          <span className="text-lg relative z-10">+</span>
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700 ease-in-out" />
        </button>
      </div>
    );
  }

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


  return (
    <div className={cn(
      "px-4 py-4",
      showInitialAnimation && "animate-slide-up animation-delay-700"
    )}>
      {/* <div className="bg-[#031123] rounded-lg p-4 flex flex-col items-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-b from-[#01C8A9]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute -inset-[100%] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiMwMUM4QTkiIG9wYWNpdHk9IjAuMDgiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybildIi8+PC9zdmc+')] opacity-5 group-hover:animate-slow-spin" />
        
        <div className="relative z-10">
          <img 
            src="/lovable-uploads/9e8729bb-ef12-4190-9169-b8a5c55be57c.png" 
            alt="Signature example" 
            className={cn(
              "w-full max-w-[120px] rounded mb-3",
              showInitialAnimation && "animate-image-reveal animation-delay-800"
            )}
          />
        </div>
        
        <button 
          onClick={onCreateSignature}
          className={cn(
            "w-full bg-[#01C8A9] hover:bg-[#01a78f] text-white text-xs font-medium py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg relative z-10 overflow-hidden group",
            showInitialAnimation && "animate-button-reveal animation-delay-900"
          )}
        >
          <span className="relative z-10 flex items-center gap-1">
            <span className="text-lg">+</span> Create Signature
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700 ease-in-out" />
        </button>
        
        <div 
          className={cn(
            "text-[#01C8A9] text-xs mt-3 flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity cursor-pointer relative z-10 hover:underline",
            showInitialAnimation && "animate-fade-in animation-delay-1000"
          )}
        >
          <ExternalLink className="w-3 h-3" />
          <span>View Examples</span>
        </div>
      </div> */}
      <button
        onClick={handleLogout}
        className={cn(
          "w-full bg-[#ee3232] hover:bg-[#dd7474] text-white text-base font-medium py-2 px-2 rounded-md flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg relative z-10 overflow-hidden group",
          showInitialAnimation && "animate-button-reveal animation-delay-900"
        )}
      >
        <span className="relative z-10 flex items-center gap-1">
          <MoveLeft /> Log Out
        </span>
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700 ease-in-out" />
      </button>

    </div>
  );
};

export default SidebarFooter;
