import React, { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/layout/Header";
import MainSidebar from "@/components/layout/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Megaphone } from "lucide-react";
import { Label } from "@/components/ui/label";
import socket from "@/socket";

interface BroadcastForm {
  title: string;
  message: string;
  audience: string;
}

const BroadcastPage = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [formData, setFormData] = useState<BroadcastForm>({
    title: "",
    message: "",
    audience: "all",
  });


  const handleMenuClick = () => setSidebarOpen(true);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {

    if (socket) {
      socket.emit("broadcast_message", {
        title: formData.title,
        message: formData.message,
        audience: formData.audience,
        time: new Date().toISOString(),
      })

      toast({
        title: "Broadcast Sent",
        description: `Message sent to ${formData.audience} users.`,
        variant: "success",
      });

      setFormData({ title: "", message: "", audience: "all" });
    }
    else {
      toast({
        title: "Socket not connected",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const handleSidebarCollapseChange = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex w-full min-h-screen bg-[#001430] font-sans">
        <MainSidebar
          open={sidebarOpen}
          onOpenChange={setSidebarOpen}
          onCollapseChange={handleSidebarCollapseChange}
        />

        <div
          className="flex flex-col flex-1 transition-all duration-300 ease-in-out"
          style={{
            width: "100%",
            marginLeft: isMobile ? 0 : sidebarCollapsed ? "70px" : "250px"
          }}
        >
          <Header onMenuClick={handleMenuClick} />

          <div className="flex flex-col p-4 sm:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div>
                <h1 className="text-white text-xl font-semibold">📢 Broadcast Message</h1>
                <p className="text-gray-400 text-sm">Notify users about updates or new features</p>
              </div>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 ml-6 gap-6"
            >
              <motion.div
                variants={itemVariants}
                className="bg-[#031123] border border-[#112F59] rounded-lg p-6 shadow-lg"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#01C8A9]/20 flex items-center justify-center mr-3">
                    <Megaphone className="text-[#01C8A9] w-5 h-5" />
                  </div>
                  <h3 className="text-white font-medium text-lg">New Feature Announcement</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-gray-400">Title</Label>
                    <Input
                      name="title"
                      placeholder="Enter a short title (e.g. 'New Update Released')"
                      className="bg-[#001430] border-[#112F59] text-white mt-1"
                      value={formData.title}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="message" className="text-gray-400">Message</Label>
                    <textarea
                      name="message"
                      rows={5}
                      placeholder="Write your broadcast message here..."
                      className="w-full bg-[#001430] border border-[#112F59] text-white rounded-md p-2 mt-1"
                      value={formData.message}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                  <div>
                    <Label htmlFor="audience" className="text-gray-400">Audience</Label>
                    <select
                      name="audience"
                      value={formData.audience}
                      onChange={handleChange}
                      className="w-full bg-[#001430] border border-[#112F59] text-white rounded-md p-2 mt-1"
                    >
                      <option value="all">All Users</option>
                      <option value="user">User Only</option>
                      <option value="employee">Employee Only</option>
                    </select>
                  </div>
                  <Button
                    type="button"
                    className="w-full bg-gradient-to-r from-[#01C8A9] to-[#01a088] text-white"
                    onClick={handleSubmit}
                  >
                    Send Broadcast
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default BroadcastPage;
