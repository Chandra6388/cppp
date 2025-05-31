
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { motion } from "framer-motion";
import { Bell, Check, CheckCheck, Clock, Info, Mail } from "lucide-react";
import Header from "@/components/layout/Header";
import MainSidebar from "@/components/layout/Sidebar";
import MobileNavbar from "@/components/layout/MobileNavbar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import CreateSignatureModal from "@/components/modals/CreateSignatureModal";

// Demo notification data
const demoNotifications = [
  {
    id: 1,
    type: "signature",
    icon: Mail,
    title: "New signature created",
    description: "Your email signature has been successfully created.",
    time: "2 hours ago",
    read: false,
    iconBg: "#01C8A9"
  },
  {
    id: 2,
    type: "alert",
    icon: Info,
    title: "Trial expires soon",
    description: "Your free trial will expire in 3 days. Upgrade now to continue uninterrupted service.",
    time: "1 day ago",
    read: true,
    iconBg: "#F59E0B"
  },
  {
    id: 3,
    type: "stats",
    icon: Clock,
    title: "Weekly stats available",
    description: "Your weekly signature performance report is now available.",
    time: "3 days ago",
    read: false,
    iconBg: "#3B82F6"
  },
  {
    id: 4,
    type: "system",
    icon: CheckCheck,
    title: "System update completed",
    description: "We've added new features to improve your signature management experience.",
    time: "1 week ago",
    read: true,
    iconBg: "#8B5CF6"
  }
];

const NotificationsPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [notifications, setNotifications] = useState(demoNotifications);

  const handleSidebarCollapseChange = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleCreateSignature = () => {
    setCreateModalOpen(true);
  };

  const handleSignatureSuccess = (name: string) => {
    toast({
      title: "Success!",
      description: `Signature "${name}" created successfully!`,
      variant: "success",
  duration: 1000,
    });
  };

  const handleMarkAllRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notif => ({ ...notif, read: true }))
    );
    toast({
      title: "Notifications updated",
      description: "All notifications marked as read",
      variant: "success",
  duration: 1000,
    });
  };

  const handleMarkAsRead = (id: number) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex w-full min-h-screen bg-gradient-to-br from-[#001430] to-[#031a3d] font-sans">
        <MainSidebar 
          open={sidebarOpen} 
          onOpenChange={setSidebarOpen}
          onCreateSignature={handleCreateSignature}
          onCollapseChange={handleSidebarCollapseChange}
        />
        
        <div 
          className="flex flex-col flex-1 transition-all duration-300 ease-in-out"
          style={{ 
            width: "100%",
            marginLeft: isMobile ? 0 : sidebarCollapsed ? '70px' : '230px',
            paddingBottom: isMobile ? '80px' : '0'
          }}
        >
          <Header 
            onMenuClick={handleMenuClick}
          
          />

          <div className="flex flex-col p-4 sm:p-6 w-full">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-white text-2xl font-bold">Notifications</h1>
                <p className="text-[#8793A3] text-sm">Stay updated with your account activity</p>
              </div>
              <Button 
                variant="dark" 
                size="sm" 
                onClick={handleMarkAllRead}
                className="text-[#01C8A9] border-[#01C8A9]/30 hover:bg-[#01C8A9]/10"
              >
                <Check size={16} />
                Mark all read
              </Button>
            </div>

            <div className="space-y-3">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <motion.div 
                    key={notification.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`p-4 rounded-lg border ${notification.read ? 'bg-[#031123]/50 border-[#112F59]' : 'bg-[#031123] border-[#112F59]'}`}
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div 
                        className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: notification.iconBg }}
                      >
                        <notification.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className={`font-medium ${notification.read ? 'text-[#8793A3]' : 'text-white'}`}>
                            {notification.title}
                            {!notification.read && (
                              <span className="inline-block w-2 h-2 bg-[#01C8A9] rounded-full ml-2"></span>
                            )}
                          </h3>
                          <span className="text-xs text-[#8793A3]">{notification.time}</span>
                        </div>
                        <p className="text-sm text-[#8793A3] mt-1">{notification.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="py-12 flex flex-col items-center justify-center rounded-lg border border-[#112F59] bg-[#031123]">
                  <div className="w-16 h-16 rounded-full bg-[#112F59]/30 flex items-center justify-center mb-4">
                    <Bell className="h-8 w-8 text-[#8793A3]" />
                  </div>
                  <h3 className="text-white text-lg font-medium">No notifications</h3>
                  <p className="text-[#8793A3] text-sm mt-1">You're all caught up!</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation Bar */}
        {isMobile && (
          <MobileNavbar onCreateClick={handleCreateSignature} />
        )}
      </div>

      <CreateSignatureModal 
        open={createModalOpen} 
        onOpenChange={setCreateModalOpen}
        onSuccess={handleSignatureSuccess}
      />
    </SidebarProvider>
  );
};

export default NotificationsPage;
