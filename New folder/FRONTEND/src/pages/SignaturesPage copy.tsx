import React, { useState, useEffect, useCallback } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import MainSidebar from "@/components/layout/Sidebar";
import MobileNavbar from "@/components/layout/MobileNavbar";
import SignatureHeader from "@/components/signatures/SignatureHeader";
import SignatureCard from "@/components/signatures/SignatureCard";
import EmptySignatureState from "@/components/signatures/EmptySignatureState";
import ShareSignatureModal from "@/components/signatures/ShareSignatureModal";
import DeleteConfirmDialog from "@/components/signatures/DeleteConfirmDialog";
import { generateStandaloneSignatureHtml, filterSignatures } from "@/components/signatures/SignatureUtils";
import { getAllSignatures, deleteSignature } from '@/service/User/signatureService'
import { SEO } from '../../Utils/Helmet'
import { Button } from "@/components/ui/button";

interface Signature {
  _id: string;
  SignatureName: string;
  templateInfo: { TemplatesName: string };
  createdAt: string;
  usageCount: number;
  details?: {
    name: string;
    jobTitle: string;
    company: string;
    phone: string;
    email: string;
    website: string;
    layout: string;
    buttons?: Array<{
      id: string;
      text: string;
      type: string;
      connect_with: string;
      icon: any;
    }>;
    [key: string]: any;
  }
}

const filterButtons = [
  { id: 'all', label: 'All' },
  { id: 'free', label: 'Free' },
  // { id: 'business', label: 'Business' },
  // { id: 'layouts', label: 'Layouts' },
];

const SignaturesPage = () => {
  const userDetails = JSON.parse(localStorage.getItem('user'))
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedSignatureId, setSelectedSignatureId] = useState<string | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const navigate = useNavigate();
  const { toast } = useToast();
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [animateCards, setAnimateCards] = useState(false);

  // Load signatures from localStorage
  useEffect(() => {
    getSignature()
    const timer = setTimeout(() => {
      setAnimateCards(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);


  const getSignature = async () => {
    const req = { userId: userDetails?._id }
    await getAllSignatures(req)
      .then((res) => {
        if (res.status) {
          setSignatures(res.data)
        }
        else {
          setSignatures([])
        }
      })
      .catch((error) => {
        console.log("Error in fetching the signature", error)
      })
  }


  // Filter signatures based on search query and active filter
  const filteredSignatures = signatures?.filter(sig => {
    const matchesSearch = sig?.SignatureName?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      (sig.details?.fullName?.toLowerCase().includes(searchQuery?.toLowerCase()) || false);

    if (activeFilter === 'all') return matchesSearch;
    if (activeFilter === 'business' && sig?.templateInfo?.TemplatesName?.toLowerCase()?.includes('business')) return matchesSearch;
    if (activeFilter === 'layouts' && sig?.details?.layout) return matchesSearch;
    if (activeFilter === 'free') return matchesSearch; // Assuming all signatures are free in this example

    return false;
  });

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleSidebarCollapseChange = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  const handleCreateSignature = () => {
    navigate('/user/create-signature');
  };

  const handleEdit = (id: string) => {
    const signature = signatures.find(sig => sig._id === id);
    if (signature) {
      navigate('/user/editor', { state: { id: signature._id, type: "edit" } });
    }

  };

  const confirmDelete = async (id: string) => {
    setSelectedSignatureId(id);
    setDeleteConfirmOpen(true);

  };

  const handleDelete = async () => {
    if (selectedSignatureId) {
      const req = { id: selectedSignatureId }
      await deleteSignature(req)
        .then((res) => {
          if (res.status) {
            toast({
              title: "Signature deleted",
              description: "Your signature has been permanently deleted.",
              variant: "success",
              duration: 1000,
            });
            getSignature()

          }
        })
        .catch((error) => {
          console.log("error in delete signature", error)
        })
    }
    setDeleteConfirmOpen(false);
    setSelectedSignatureId(null);
  };

  const handleShare = (id: string) => {
    setSelectedSignatureId(id);
    setShareModalOpen(true);
  };

  const handleDuplicate = (id: string) => {
    const signatureToDuplicate = signatures.find(sig => sig._id === id);
    if (signatureToDuplicate) {
      const duplicatedSignature = {
        ...signatureToDuplicate,
        id: Date.now().toString(),
        SignatureName: `${signatureToDuplicate.SignatureName} (Copy)`,
        createdAt: new Date().toISOString().split('T')[0],
      };
      const updatedSignatures = [...signatures, duplicatedSignature];
      setSignatures(updatedSignatures);
      localStorage.setItem('signatures', JSON.stringify(updatedSignatures));

      toast({
        title: "Signature duplicated",
        description: `"${duplicatedSignature.SignatureName}" has been created.`,
        variant: "success",
        duration: 1000,
      });
    }
  };

  const handleCopy = (id: string) => {
    const signature = signatures.find(sig => sig._id === id);
    if (!signature) return;

    const html = generateStandaloneSignatureHtml(signature);

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.top = '-9999px';
    iframe.style.width = '500px';
    iframe.style.height = '200px';
    iframe.style.opacity = '0';
    document.body.appendChild(iframe);

    // Write the HTML content to the iframe
    setTimeout(() => {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) {
        document.body.removeChild(iframe);
        return;
      }

      doc.open();
      doc.write(`<html><head><style>body{margin:0;padding:0;}</style></head><body>${html}</body></html>`);
      doc.close();

      // Select the content in the iframe
      setTimeout(() => {
        const selection = doc.getSelection();
        const range = doc.createRange();
        range.selectNodeContents(doc.body);

        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
          const successful = doc.execCommand('copy');

          if (successful) {
            toast({
              title: "Signature copied",
              description: "Your signature has been copied and is ready to paste into your email client.",
              variant: "success",
              duration: 1000,
            });
          } else {
            toast({
              title: "Copy failed",
              description: "Unable to copy signature. Please try viewing the signature and using the download option.",
              variant: "destructive",
              duration: 1000,
            });
          }
        }

        document.body.removeChild(iframe);
      }, 200);
    }, 100);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const getSelectedsignatureHtml = signatures.filter(item => item._id === selectedSignatureId)
  const endpoint = window.location.hash.replace(/^#/, '').split('?')[0];

  return (
    <>
      <SEO title={endpoint.split('/').pop()} description={"SignatureDashbaord"} />

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
              marginLeft: isMobile ? 0 : sidebarCollapsed ? '70px' : '250px',
              paddingBottom: isMobile ? '80px' : '0'
            }}
          >
            <Header onMenuClick={handleMenuClick} />


            <div className="flex flex-col p-4 sm:p-6">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-white text-2xl font-bold mb-6">My Signatures</h1>

                <div className="flex flex-wrap gap-2 mb-6">
                  {filterButtons.map(button => (
                    <button
                      key={button.id}
                      className={`px-6 py-2 rounded-full text-sm transition-all ${activeFilter === button.id
                        ? 'bg-[#01C8A9] text-white'
                        : 'bg-transparent text-white border border-[#112F59] hover:bg-[#051b37]'
                        }`}
                      onClick={() => setActiveFilter(button.id)}
                    >
                      {button.label}
                    </button>
                  ))}

                  <div className="ml-auto">
                    <input
                      type="text"
                      placeholder="Search signatures..."
                      className="px-4 py-2 bg-[#031123] border border-[#112F59] rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#01C8A9] focus:border-[#01C8A9] w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <motion.div variants={itemVariants} className="flex justify-center  ">
                    <Button
                      onClick={handleCreateSignature}
                      className="bg-[#01C8A9] hover:bg-[#01a78f] text-white px-4"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#ffffff]">
                        <path d="M5 12h14"></path>
                        <path d="M12 5v14"></path>
                      </svg>
                      Add New Signature
                    </Button>
                  </motion.div>

                </div>
              </motion.div>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4"
                variants={containerVariants}
                initial="hidden"
                animate={animateCards ? "visible" : "hidden"}
              >
                {/* <motion.div
                  variants={itemVariants}
                  className="bg-[#031123] border border-[#112F59] border-dashed rounded-lg flex flex-col items-center justify-center p-8 hover:bg-[#051b37] transition-colors cursor-pointer h-full min-h-[250px]"
                  onClick={handleCreateSignature}
                >
                  <div className="w-16 h-16 rounded-full bg-[#051b37] flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#01C8A9]">
                      <path d="M5 12h14"></path>
                      <path d="M12 5v14"></path>
                    </svg>
                  </div>
                  <h3 className="text-white font-medium text-lg mb-2">Create New</h3>
                  <p className="text-gray-400 text-sm text-center">Create a new email signature</p>
                </motion.div> */}

                {filteredSignatures.length === 0 && searchQuery ? (
                  <motion.div variants={itemVariants} className="col-span-full">
                    <EmptySignatureState
                      searchQuery={searchQuery}
                      onClearSearch={() => setSearchQuery("")}
                    />
                  </motion.div>
                ) : (
                  filteredSignatures.map((signature) => (
                    <motion.div
                      key={signature?._id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                    >
                      <SignatureCard
                        signature={signature}
                        onEdit={handleEdit}
                        onShare={handleShare}
                        onCopy={handleCopy}
                        onDelete={confirmDelete}
                      />
                    </motion.div>
                  ))
                )}
              </motion.div>

            </div>
          </div>

          {/* Mobile Navigation Bar */}
          {isMobile && (
            <MobileNavbar onCreateClick={handleCreateSignature} />
          )}
        </div>

        {/* Modals */}
        <DeleteConfirmDialog
          open={deleteConfirmOpen}
          onOpenChange={setDeleteConfirmOpen}
          onConfirm={handleDelete}
        />

        <ShareSignatureModal
          open={shareModalOpen}
          onOpenChange={setShareModalOpen}
          signatureId={selectedSignatureId}
          details={{
            html: getSelectedsignatureHtml[0]?.details?.html || "",
            background: {
              background_value: getSelectedsignatureHtml[0]?.details?.background?.background_value || "#ffffff"
            }
          }}

        />

      </SidebarProvider>
    </>
  );
};

export default SignaturesPage;
