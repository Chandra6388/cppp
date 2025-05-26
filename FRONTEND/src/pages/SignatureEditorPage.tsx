
import React, { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/layout/Header";
import MainSidebar from "@/components/layout/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useResponsiveSidebar } from "@/hooks/use-responsive-sidebar";
import EditorWithSignaturePreview from "@/components/signature/EditorWithSignaturePreview";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SignatureEditorPage = () => {
  const isMobile = useIsMobile();
  const { sidebarOpen, setSidebarOpen, sidebarCollapsed, setSidebarCollapsed } = useResponsiveSidebar();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("personal");
  
   

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };
  
  const handleSaveSignature = () => {
    // Implement actual save functionality
    toast({
      title: "Signature Saved",
      description: "Your signature has been saved successfully.",
      variant: "success",
  duration: 1000,
    });
  };
  
  const handleSendEmail = () => {
    // Implement actual email sending functionality
    toast({
      title: "Email Sent",
      description: "Your signature has been sent to your email.",
      variant: "success",
  duration: 1000,
    });
  };

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex w-full min-h-screen bg-[#001430] font-sans">
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

          {/* Editor content */}
          <div className="flex-1 p-4">
            
            <div className="bg-[#031123] border border-[#112F59] rounded-lg p-4 h-full overflow-hidden">
              <h1 className="text-white text-xl font-semibold mb-6">Signature Editor</h1>
              
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left side: Editor controls */}
                <div className="flex-1 border border-[#112F59] rounded-lg p-4 bg-[#020e1f] overflow-auto">
                  <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-6 bg-[#031123] border border-[#112F59] grid grid-cols-4 w-full">
                      <TabsTrigger value="personal" className="text-xs sm:text-sm">Personal Info</TabsTrigger>
                      <TabsTrigger value="templates" className="text-xs sm:text-sm">Templates</TabsTrigger>
                      <TabsTrigger value="buttons" className="text-xs sm:text-sm">Buttons</TabsTrigger>
                      <TabsTrigger value="style" className="text-xs sm:text-sm">Style</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="personal" className="space-y-6">
                      <h2 className="text-white text-lg mb-4">Personal Information</h2>
                      
                      {/* Headshot upload area */}
                      <div className="mb-6 p-4 border border-dashed border-[#112F59] rounded-lg text-center">
                        <p className="text-gray-400 mb-2">Upload Headshot</p>
                        <p className="text-xs text-gray-500">1:1 ratio recommended</p>
                        <button className="mt-3 bg-[#112F59]/50 hover:bg-[#112F59] text-white py-2 px-4 rounded transition-colors">
                          Select Image
                        </button>
                      </div>
                      
                      <div className="space-y-4 text-gray-300">
                        <div className="border border-[#112F59]/50 rounded p-3 bg-[#001430]/50">
                          Name & Title Settings
                        </div>
                        <div className="border border-[#112F59]/50 rounded p-3 bg-[#001430]/50">
                          Contact Information
                        </div>
                        <div className="border border-[#112F59]/50 rounded p-3 bg-[#001430]/50">
                          Social Links
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="templates">
                      <h2 className="text-white text-lg mb-4">Templates</h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="border border-[#112F59] rounded-lg p-2 bg-[#001430]/70 cursor-pointer hover:border-[#01C8A9] transition-colors">
                          <div className="aspect-video bg-[#020e1f] rounded-lg flex items-center justify-center">
                            Template 1
                          </div>
                          <p className="text-center text-white mt-2 text-sm">Modern</p>
                        </div>
                        <div className="border border-[#112F59] rounded-lg p-2 bg-[#001430]/70 cursor-pointer hover:border-[#01C8A9] transition-colors">
                          <div className="aspect-video bg-[#020e1f] rounded-lg flex items-center justify-center">
                            Template 2
                          </div>
                          <p className="text-center text-white mt-2 text-sm">Classic</p>
                        </div>
                        <div className="border border-[#112F59] rounded-lg p-2 bg-[#001430]/70 cursor-pointer hover:border-[#01C8A9] transition-colors">
                          <div className="aspect-video bg-[#020e1f] rounded-lg flex items-center justify-center">
                            Template 3
                          </div>
                          <p className="text-center text-white mt-2 text-sm">Simple</p>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="buttons">
                      <h2 className="text-white text-lg mb-4">Call-to-Action Buttons</h2>
                      <p className="text-gray-400 text-sm mb-4">Add up to 3 buttons to your signature</p>
                      
                      <div className="mb-4 p-4 border border-[#112F59] rounded-lg bg-[#031123]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="bg-green-500 text-white rounded px-3 py-1 text-sm">
                              Call Now
                            </div>
                          </div>
                          <button className="text-gray-400 hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                          </button>
                        </div>
                        
                        <div className="mt-4 space-y-3">
                          <div>
                            <label className="text-sm text-gray-400 block mb-1">Button Text</label>
                            <input type="text" value="Call Now" className="w-full bg-[#001430] border border-[#112F59] rounded p-2 text-white" />
                          </div>
                          <div>
                            <label className="text-sm text-gray-400 block mb-1">URL / Phone Number</label>
                            <input type="text" value="tel:+1234567890" className="w-full bg-[#001430] border border-[#112F59] rounded p-2 text-white" />
                          </div>
                          <div>
                            <label className="text-sm text-gray-400 block mb-1">Button Color</label>
                            <div className="flex flex-wrap gap-2">
                              <div className="w-6 h-6 rounded-full bg-green-500 cursor-pointer border-2 border-white"></div>
                              <div className="w-6 h-6 rounded-full bg-blue-500 cursor-pointer"></div>
                              <div className="w-6 h-6 rounded-full bg-red-500 cursor-pointer"></div>
                              <div className="w-6 h-6 rounded-full bg-yellow-500 cursor-pointer"></div>
                              <div className="w-6 h-6 rounded-full bg-purple-500 cursor-pointer"></div>
                              <div className="w-6 h-6 rounded-full bg-pink-500 cursor-pointer"></div>
                              <div className="w-6 h-6 rounded-full bg-gray-500 cursor-pointer"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <button className="w-full py-2 border border-dashed border-[#112F59] rounded-lg text-[#01C8A9] hover:bg-[#01C8A9]/10 transition-colors">
                        + Add Button
                      </button>
                    </TabsContent>
                    
                    <TabsContent value="style">
                      <h2 className="text-white text-lg mb-4">Style Settings</h2>
                      <div className="space-y-6 text-gray-300">
                        <div>
                          <label className="text-sm text-gray-400 block mb-1">Font Family</label>
                          <select className="w-full bg-[#001430] border border-[#112F59] rounded p-2 text-white">
                            <option>Arial</option>
                            <option>Helvetica</option>
                            <option>Roboto</option>
                            <option>Open Sans</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="text-sm text-gray-400 block mb-1">Font Size</label>
                          <select className="w-full bg-[#001430] border border-[#112F59] rounded p-2 text-white">
                            <option>Small</option>
                            <option>Medium</option>
                            <option>Large</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="text-sm text-gray-400 block mb-1">Background Style</label>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="border border-[#112F59] rounded-lg p-2 bg-[#001430]/70 cursor-pointer hover:border-[#01C8A9] transition-colors">
                              <div className="aspect-square bg-transparent border border-dashed border-[#112F59] rounded-lg flex items-center justify-center text-xs text-gray-400">
                                None
                              </div>
                            </div>
                            <div className="border border-white rounded-lg p-2 bg-[#001430]/70 cursor-pointer transition-colors">
                              <div className="aspect-square bg-gradient-to-br from-blue-600 to-purple-500 rounded-lg"></div>
                            </div>
                            <div className="border border-[#112F59] rounded-lg p-2 bg-[#001430]/70 cursor-pointer hover:border-[#01C8A9] transition-colors">
                              <div className="aspect-square bg-gradient-to-br from-green-500 to-teal-600 rounded-lg"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
                
                {/* Right side: Preview */}
                <div className="flex-1 border border-[#112F59] rounded-lg p-4 bg-[#020e1f] overflow-auto">
                  <h2 className="text-white text-lg mb-4">Preview</h2>
                  
                  {/* Signature preview placeholder */}
                  <div className="border border-[#112F59] rounded-lg p-4 bg-white h-64 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-full bg-gray-300 mx-auto mb-2"></div>
                      <div className="text-lg font-semibold">Your Name</div>
                      <div className="text-sm text-gray-600">Job Title | Company</div>
                      <div className="text-xs text-gray-600 mt-2">email@example.com | (123) 456-7890</div>
                      <div className="mt-3">
                        <button className="bg-green-500 text-white text-xs px-3 py-1 rounded hover:bg-green-600">
                          Call Now
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Preview and Save buttons */}
                  <EditorWithSignaturePreview
                    onSaveSignature={handleSaveSignature}
                    onSendEmail={handleSendEmail}
                    previewContent={
                      <div className="flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-20 h-20 rounded-full bg-gray-300 mx-auto mb-2"></div>
                          <div className="text-lg font-semibold text-gray-800">Your Name</div>
                          <div className="text-sm text-gray-600">Job Title | Company</div>
                          <div className="text-xs text-gray-600 mt-2">email@example.com | (123) 456-7890</div>
                          <div className="mt-3">
                            <button className="bg-green-500 text-white text-xs px-3 py-1 rounded hover:bg-green-600">
                              Call Now
                            </button>
                          </div>
                        </div>
                      </div>
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default SignatureEditorPage;
