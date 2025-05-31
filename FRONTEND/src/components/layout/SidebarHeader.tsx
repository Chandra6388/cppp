
import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

interface SidebarHeaderProps {
  collapsed: boolean;
  toggleCollapse: () => void;
  showInitialAnimation: boolean;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  collapsed,
  toggleCollapse,
  showInitialAnimation,
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="relative px-2 py-3">
      <Link 
        to="/" 
        className={cn(
          "flex items-center transition-all duration-300",
          collapsed ? "justify-center" : "",
          showInitialAnimation && "animate-fade-in"
        )}
      >
        <motion.div
          initial={false}
          animate={{ 
            width: collapsed ? "auto" : "auto",
            opacity: 1 
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden flex justify-center"
        >
          {collapsed ? (
            <img 
              src="/lovable-uploads/259df6fc-e573-444b-b74d-b3d550f961c1.png" 
              alt="Pro Signature (Collapsed)" 
              className="h-9 w-auto transition-all duration-300"
            />
          ) : (
            <img 
              src="/lovable-uploads/9a58fdb1-7935-4814-888a-6a16bfa167b9.png" 
              alt="Pro Signature" 
              className="h-12 w-auto transition-all duration-300"
            />
          )}
        </motion.div>
      </Link>

      {/* Only show collapse button on desktop */}
      {!isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute right-1 top-1/2 -translate-y-1/2 text-[#8793A3] hover:text-white hover:bg-[#112F59]/50",
            showInitialAnimation && "animate-fade-in"
          )}
          onClick={toggleCollapse}
          aria-label={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      )}
    </div>
  );
};

export default SidebarHeader;
