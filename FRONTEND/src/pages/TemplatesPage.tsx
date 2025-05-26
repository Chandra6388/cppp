
import React, { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/layout/Header";
import MainSidebar from "@/components/layout/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import CreateSignatureModal from "@/components/modals/CreateSignatureModal";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const TemplatesPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { toast } = useToast();

  const templates = [
    {
      id: "6809dca3921ec942269433d3",
      name: "Professional Blue",
      description: "Clean design with circular photo and social media icons",
      image: "/lovable-uploads/9876cab7-81ef-4f25-b7a8-ec2df02a2cb5.png",
      gradient: "bg-gradient-to-r from-blue-600 to-teal-400",
    },
    {
      id: "6809dc9c921ec942269433d0",
      name: "Modern Teal",
      description: "Modern layout with horizontal social media icons",
      image: "/lovable-uploads/4d3c0365-1f4e-48e7-88b4-1c71b62511ba.png",
      gradient: "bg-gradient-to-r from-teal-400 to-blue-600",
    },
    
  ];

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleSidebarCollapseChange = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
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

  const handleUseTemplate = (templateId: string) => {
    toast({
      title: "Template Selected",
      description: "Loading template into the editor...",
      variant: "success",
  duration: 1000,
    });
    navigate(`/editor?template=${templateId}`);
  };

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex w-full min-h-screen bg-[#001430] font-sans">
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
            marginLeft: isMobile ? 0 : sidebarCollapsed ? '70px' : '250px'
          }}
        >
          <Header 
            onMenuClick={handleMenuClick}
            
          />

          <div className="flex flex-col p-4 sm:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div>
                <h1 className="text-white text-xl font-semibold">Templates</h1>
                <p className="text-gray-400 text-sm">Choose from our premium signature templates</p>
              </div>
              <div>
                <Button 
                  onClick={handleCreateSignature} 
                  className="bg-gradient-to-r from-[#01C8A9] to-[#01a78f] hover:from-[#01a78f] hover:to-[#018a76] text-white"
                >
                  Create Custom Signature
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {templates.map((template) => (
                <div 
                  key={template.id}
                  className="bg-[#031123] border border-[#112F59] rounded-lg overflow-hidden flex flex-col hover:border-[#01C8A9] transition-all hover:shadow-lg hover:shadow-[#01C8A9]/20 hover:scale-[1.02] duration-300"
                >
                  <div className="p-4 border-b border-[#112F59]">
                    <div className="rounded-lg overflow-hidden mb-3">
                      <img 
                        src={template.image} 
                        alt={template.name} 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="p-4 flex-1">
                    <h3 className="text-white font-medium text-lg">{template.name}</h3>
                    <p className="text-gray-400 text-sm mt-1">{template.description}</p>
                  </div>
                  <div className="p-4 pt-0">
                    <button
                      onClick={() => handleUseTemplate(template.id)}
                      className={`w-full text-white font-medium py-2.5 px-4 rounded-lg transition-all ${template.gradient} hover:shadow-lg flex items-center justify-center gap-2`}
                    >
                      Use This Template
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <CreateSignatureModal 
        open={createModalOpen} 
        onOpenChange={setCreateModalOpen}
        onSuccess={handleSignatureSuccess}
      />
    </SidebarProvider>
  );
};

export default TemplatesPage;
