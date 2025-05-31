
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/layout/Header";
import MainSidebar from "@/components/layout/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import MobileNavbar from "@/components/layout/MobileNavbar";
import { getAllTemplates } from '@/service/User/signatureService'
import { SEO } from '../../Utils/Helmet'
import { X } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
const CreateSignaturePage = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [name, setName] = useState("");
  const [allTemplatesList, setAllTemplatesList] = useState([])
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const handleMenuClick = () => {
    setSidebarOpen(true);
  };
  const handleSidebarCollapseChange = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  useEffect(() => {
    getTemplates()
  }, [])

  const getTemplates = async () => {
    const req = {}
    await getAllTemplates(req)
      .then((res) => {
        if (res.status) {
          setAllTemplatesList(res.data)
        }
        else {
          setAllTemplatesList([])
        }
      })
      .catch((error) => {
        console.log("error in fetching templates", error)
      })
  }
  const [selectedTemplete, setSelectedTemplate] = useState({ id: "", html: "" });

  const handleCreateSignature = (id: string, htmlCode: string) => {
    setOpen(true);
    setSelectedTemplate({
      id: id,
      html: htmlCode,
    });
  };


  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };
  const endpoint = window.location.hash.replace(/^#/, '').split('?')[0];


  const handleSubmit = () => {
    if (!name) {
      toast({
        title: "Name Required",
        description: "Please enter a name for your signature.",
        variant: "destructive",
        duration: 1000,
      });
      return;
    }
    toast({
      title: "Success!",
      description: `Signature "${name}" created successfully!`,
      variant: "success",
      duration: 1000,
    });
    navigate("/user/editor", { state: { signatureName: name, templatesId: selectedTemplete, type: "add" } });
    setOpen(false);
    setName("");
  }


  return (
    <>
      <SEO title={endpoint.split('/').pop()} description={"createSignature"} />

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
              marginLeft: isMobile ? 0 : sidebarCollapsed ? '70px' : '230px',
              paddingBottom: isMobile ? '80px' : '0'
            }}
          >
            <Header onMenuClick={handleMenuClick} />
            <div className="flex flex-col p-4 sm:p-4 pb-20">
              <motion.div
                initial="hidden"
                animate="visible"
                className="w-full"
              >
                <motion.div variants={itemVariants} className="mb-6">
                  <h2 className="text-xl text-white font-medium mb-6 mt-6 text-center">Choose a Template</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
                    {allTemplatesList.map((items, index) => {
                      return (
                        <div
                          key={index}
                          className="overflow-hidden bg-[#031123] border border-transparent rounded-lg cursor-pointer transition-all hover:border-[#01C8A9]/100"
                          onClick={() => handleCreateSignature(items._id, items.htmlCode)}
                        >
                          <div
                            key={items._id}
                            dangerouslySetInnerHTML={{ __html: items.htmlCode }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
          {isMobile && <MobileNavbar />}
        </div>
      </SidebarProvider>

      <Dialog open={open} onOpenChange={() => { setOpen(!open); setName("") }}>
        <DialogContent className="bg-[#001430] border-[#112F59] p-0 overflow-hidden sm:max-w-xl">
          <DialogHeader className="p-0">
            <div className="flex items-center justify-between w-full bg-[#001430] p-6 border-b border-[#112F59]">
              <div>
                <h2 className="text-white text-xl font-medium flex items-center gap-2">Signature Name</h2>
              </div>
              <button
                onClick={() => {setOpen(false); setName("")}}
                className="text-white hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>
          </DialogHeader>

          <div className="p-6">
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  className="flex-2 bg-[#07234A] w-full border border-[#112F59] rounded-l-md p-2 text-white"
                  placeholder="Enter signature name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="flex justify-end items-center">
                <Button variant="teal" className="w-50 my-4" onClick={() => handleSubmit()}  >   Submit  </Button>

              </div>

            </div>

          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateSignaturePage;
