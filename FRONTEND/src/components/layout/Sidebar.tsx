
import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Sidebar, SidebarContent, SidebarFooter as UIFooter, SidebarGroup, SidebarGroupContent, SidebarHeader as UIHeader } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import SidebarHeader from "./SidebarHeader";
import SidebarMenuItems from "./SidebarMenuItems";
import SidebarFooter from "./SidebarFooter";
import { X } from "lucide-react";

interface MainSidebarProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onCreateSignature?: () => void;
  onCollapseChange?: (collapsed: boolean) => void;
}

export const MainSidebar: React.FC<MainSidebarProps> = ({ open, onOpenChange, onCreateSignature, onCollapseChange }) => {
  const isMobile = useIsMobile();
  const Role = JSON.parse(localStorage.getItem("user"))?.Role
  const location = useLocation();
  const [showInitialAnimation, setShowInitialAnimation] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const hasAnimatedBefore = sessionStorage.getItem('sidebarAnimated');
    if (!hasAnimatedBefore) {
      setShowInitialAnimation(true);
      sessionStorage.setItem('sidebarAnimated', 'true');
      const timer = setTimeout(() => {
        setShowInitialAnimation(false);
        setHasAnimated(true);
      }, 1500);  
      return () => clearTimeout(timer);
    } else {
      setHasAnimated(true);
    }
  }, []);

  useEffect(() => {
    if (onCollapseChange) {
      onCollapseChange(collapsed);
    }
  }, [collapsed, onCollapseChange]);

  const toggleCollapse = () => {
    if (!isMobile) {
      setCollapsed(!collapsed);
    }
  };

  const handleOverlayClick = () => {
    if (isMobile && open) {
      if (onOpenChange) {
        onOpenChange(false);
      }
    }
  };

  const sidebarContent = (
    <>
      <UIHeader>
        <SidebarHeader
          collapsed={collapsed}
          toggleCollapse={toggleCollapse}
          showInitialAnimation={showInitialAnimation}
        />
      </UIHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenuItems
              collapsed={isMobile ? false : collapsed}
              showInitialAnimation={showInitialAnimation}
              onOpenChange={onOpenChange}
              isMobile={isMobile}
            />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {Role=="USER" && <UIFooter className="mt-auto">
        <SidebarFooter
          collapsed={isMobile ? false : collapsed}
          showInitialAnimation={showInitialAnimation}
          onCreateSignature={onCreateSignature}
        />
      </UIFooter>}
    </>
  );

  if (isMobile) {
    return (
      <>
        {open && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20"
            onClick={handleOverlayClick}
            aria-hidden="true"
          />
        )}
        <Sheet open={open} onOpenChange={onOpenChange}>
          <SheetContent side="left" className="p-0 bg-[#031123] border-r border-[#112F59] max-w-[250px] w-[250px]">
            <div className="flex justify-end pt-2 pr-2 md:hidden">
              <button
                onClick={() => onOpenChange && onOpenChange(false)}
                className="text-gray-400 hover:text-white p-1 rounded-md"
              >
                <X size={18} />
              </button>
            </div>
            {sidebarContent}
          </SheetContent>
        </Sheet>
      </>
    );
  }

  return (
    <div className="fixed left-0 top-0 h-screen z-20">
      <Sidebar className={cn(
        "border-r border-[#112F59] bg-[#031123] h-full",
        collapsed ? "w-[70px]" : "w-[250px]",
        "transition-all duration-300 ease-in-out"
      )}>
        {sidebarContent}
      </Sidebar>
    </div>
  );
};

export default MainSidebar;
