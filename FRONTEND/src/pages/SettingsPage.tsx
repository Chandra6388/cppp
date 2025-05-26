
import React, { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/layout/Header";
import MainSidebar from "@/components/layout/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useResponsiveSidebar } from "@/hooks/use-responsive-sidebar";
import { motion } from "framer-motion";
import { Settings, Bell, Shield, Palette, Globe, Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const isMobile = useIsMobile();
  const { sidebarOpen, setSidebarOpen, sidebarCollapsed, setSidebarCollapsed } = useResponsiveSidebar();
  const { toast } = useToast();

  // Settings state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [browserNotifications, setBrowserNotifications] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [theme, setTheme] = useState("system");

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully",
      variant: "success",
  duration: 1000,
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
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

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex w-full min-h-screen bg-gradient-to-br from-[#001430] to-[#002040] font-sans">
        <MainSidebar 
          open={sidebarOpen} 
          onOpenChange={setSidebarOpen}
          onCollapseChange={setSidebarCollapsed}
        />
        
        <div 
          className="flex flex-col flex-1 transition-all duration-300 ease-in-out"
          style={{ 
            width: "100%",
            marginLeft: isMobile ? 0 : sidebarCollapsed ? '70px' : '250px',
            paddingBottom: isMobile ? '80px' : '0'
          }}
        >
          <Header 
            onMenuClick={handleMenuClick}
             
          />

          <div className="flex flex-col p-4 sm:p-6">
            <h1 className="text-white text-xl font-semibold mb-6 flex items-center">
              <Settings className="mr-2 text-[#01C8A9]" />
              Settings
            </h1>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* Notifications Settings */}
              <motion.div variants={itemVariants} className="bg-gradient-to-br from-[#031123] to-[#051b36] border border-[#112F59] rounded-lg p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/30 to-blue-700/30 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-white font-medium text-lg">Notifications</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-[#031123]/50 rounded-lg hover:bg-[#041b36] transition-colors">
                    <div>
                      <Label htmlFor="email-notifications" className="text-white">Email Notifications</Label>
                      <p className="text-sm text-gray-400">Receive updates about your signatures via email</p>
                    </div>
                    <Switch 
                      id="email-notifications" 
                      checked={emailNotifications} 
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#031123]/50 rounded-lg hover:bg-[#041b36] transition-colors">
                    <div>
                      <Label htmlFor="browser-notifications" className="text-white">Browser Notifications</Label>
                      <p className="text-sm text-gray-400">Get notified in your browser for important events</p>
                    </div>
                    <Switch 
                      id="browser-notifications" 
                      checked={browserNotifications} 
                      onCheckedChange={setBrowserNotifications}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#031123]/50 rounded-lg hover:bg-[#041b36] transition-colors">
                    <div>
                      <Label htmlFor="weekly-digest" className="text-white">Weekly Digest</Label>
                      <p className="text-sm text-gray-400">Get a weekly summary of your signature performance</p>
                    </div>
                    <Switch 
                      id="weekly-digest" 
                      checked={weeklyDigest} 
                      onCheckedChange={setWeeklyDigest}
                    />
                  </div>
                </div>
              </motion.div>
              
              {/* Security Settings */}
              <motion.div variants={itemVariants} className="bg-gradient-to-br from-[#031123] to-[#051b36] border border-[#112F59] rounded-lg p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/30 to-purple-700/30 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-white font-medium text-lg">Security</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-[#031123]/50 rounded-lg hover:bg-[#041b36] transition-colors">
                    <div>
                      <Label htmlFor="two-factor-auth" className="text-white">Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
                    </div>
                    <Switch 
                      id="two-factor-auth" 
                      checked={twoFactorAuth} 
                      onCheckedChange={setTwoFactorAuth}
                    />
                  </div>
                  <div className="p-3 bg-[#031123]/50 rounded-lg hover:bg-[#041b36] transition-colors">
                    <Button 
                      variant="outline" 
                      className="text-white border-[#112F59] hover:bg-[#112F59]/50 w-full sm:w-auto"
                    >
                      Change Password
                    </Button>
                  </div>
                </div>
              </motion.div>
              
              {/* Appearance Settings */}
              <motion.div variants={itemVariants} className="bg-gradient-to-br from-[#031123] to-[#051b36] border border-[#112F59] rounded-lg p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500/30 to-teal-700/30 flex items-center justify-center">
                    <Palette className="w-5 h-5 text-teal-400" />
                  </div>
                  <h3 className="text-white font-medium text-lg">Appearance</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="p-3 bg-[#031123]/50 rounded-lg hover:bg-[#041b36] transition-colors">
                    <Label className="text-white mb-2 block">Theme Preference</Label>
                    <RadioGroup defaultValue={theme} onValueChange={setTheme} className="flex flex-wrap gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="light" id="light" />
                        <Label htmlFor="light" className="text-gray-400">Light</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dark" id="dark" />
                        <Label htmlFor="dark" className="text-gray-400">Dark</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="system" id="system" />
                        <Label htmlFor="system" className="text-gray-400">System</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </motion.div>
              
              {/* Language Settings */}
              <motion.div variants={itemVariants} className="bg-gradient-to-br from-[#031123] to-[#051b36] border border-[#112F59] rounded-lg p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500/30 to-yellow-700/30 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-yellow-400" />
                  </div>
                  <h3 className="text-white font-medium text-lg">Language & Region</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="p-3 bg-[#031123]/50 rounded-lg hover:bg-[#041b36] transition-colors">
                    <Label className="text-white mb-2 block">Language</Label>
                    <select className="w-full sm:w-auto bg-[#001430] border border-[#112F59] text-white rounded p-2">
                      <option value="en">English</option>
                      <option value="fr">French</option>
                      <option value="es">Spanish</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                </div>
              </motion.div>
              
              {/* Advanced Settings */}
              <motion.div variants={itemVariants} className="bg-gradient-to-br from-[#031123] to-[#051b36] border border-[#112F59] rounded-lg p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500/30 to-orange-700/30 flex items-center justify-center">
                    <Sliders className="w-5 h-5 text-orange-400" />
                  </div>
                  <h3 className="text-white font-medium text-lg">Advanced</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-[#031123]/50 rounded-lg hover:bg-[#041b36] transition-colors">
                    <div>
                      <Label htmlFor="data-collection" className="text-white">Data Collection</Label>
                      <p className="text-sm text-gray-400">Allow anonymous usage data collection</p>
                    </div>
                    <Switch id="data-collection" defaultChecked />
                  </div>
                </div>
              </motion.div>
              
              {/* Save Button */}
              <motion.div variants={itemVariants} className="flex justify-end">
                <Button 
                  onClick={handleSaveSettings}
                  className="bg-gradient-to-r from-[#01C8A9] to-[#01a088] hover:opacity-90 text-white"
                >
                  Save Settings
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default SettingsPage;
