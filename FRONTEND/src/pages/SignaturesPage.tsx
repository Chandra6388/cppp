import React, { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import MainSidebar from "@/components/layout/Sidebar";
import MobileNavbar from "@/components/layout/MobileNavbar";
import SignatureCard from "@/components/signatures/SignatureCard";
import ShareSignatureModal from "@/components/signatures/ShareSignatureModal";
import DeleteConfirmDialog from "@/components/signatures/DeleteConfirmDialog";
import { generateStandaloneSignatureHtml } from "@/components/signatures/SignatureUtils";
import { getAllSignatures, deleteSignature } from '@/service/User/signatureService';
import { SEO } from '../../Utils/Helmet';
import { Button } from "@/components/ui/button";

const filterButtons = [
  { id: 'all', label: 'All' },
  { id: 'free', label: 'Free' },
];

const SignaturesPage = () => {
  const userDetails = JSON.parse(localStorage.getItem('user'));
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedSignatureId, setSelectedSignatureId] = useState(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const navigate = useNavigate();
  const { toast } = useToast();
  const [signatures, setSignatures] = useState([]);
  const [animateCards, setAnimateCards] = useState(false);

  useEffect(() => {
    fetchSignatures();
    const timer = setTimeout(() => setAnimateCards(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const fetchSignatures = async () => {
    const req = { userId: userDetails?._id };
    try {
      const res = await getAllSignatures(req);
      setSignatures(res?.status ? res.data : []);
    } catch (error) {
      console.error("Error fetching signatures:", error);
      setSignatures([]);
    }
  };

  const filteredSignatures = signatures.filter(sig => {
    const matchesSearch = sig?.SignatureName?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
      (sig.details?.fullName?.toLowerCase()?.includes(searchQuery.toLowerCase()) || false);

    if (activeFilter === 'all') return matchesSearch;
    if (activeFilter === 'business' && sig?.templateInfo?.TemplatesName?.toLowerCase()?.includes('business')) return matchesSearch;
    if (activeFilter === 'layouts' && sig?.details?.layout) return matchesSearch;
    if (activeFilter === 'free') return matchesSearch;

    return false;
  });

  const handleCreateSignature = () => navigate('/user/create-signature');
  const handleEdit = (id) => navigate('/user/editor', { state: { id, type: "edit" } });

  const confirmDelete = (id) => {
    setSelectedSignatureId(id);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (selectedSignatureId) {
      try {
        const req = { id: selectedSignatureId };
        const res = await deleteSignature(req);
        if (res?.status) {
          toast({ title: "Signature deleted", description: "Your signature has been deleted." });
          fetchSignatures();
        }
      } catch (error) {
        console.error("Delete signature error:", error);
      }
    }
    setDeleteConfirmOpen(false);
    setSelectedSignatureId(null);
  };

  const handleShare = (id) => {
    setSelectedSignatureId(id);
    setShareModalOpen(true);
  };

  const handleCopy = (id) => {
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

    setTimeout(() => {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) return document.body.removeChild(iframe);

      doc.open();
      doc.write(`<html><body>${html}</body></html>`);
      doc.close();

      setTimeout(() => {
        const selection = doc.getSelection();
        const range = doc.createRange();
        range.selectNodeContents(doc.body);

        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
          const successful = doc.execCommand('copy');

          toast({
            title: successful ? "Signature copied" : "Copy failed",
            description: successful ? "Your signature has been copied." : "Unable to copy. Try downloading instead.",
            variant: successful ? undefined : "destructive",
          });
        }

        document.body.removeChild(iframe);
      }, 200);
    }, 100);
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 12 } }
  };

  const getSelectedsignatureHtml = signatures.filter(item => item._id === selectedSignatureId);
  const endpoint = window.location.hash.replace(/^#/, '').split('?')[0];

  return (
    <>
      <SEO title={endpoint.split('/').pop()} description={"SignatureDashbaord"} />
      <SidebarProvider defaultOpen={!isMobile}>
        <div className="flex w-full min-h-screen bg-gradient-to-br from-[#001430] to-[#031a3d] font-sans">
          <MainSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} onCreateSignature={handleCreateSignature} onCollapseChange={setSidebarCollapsed} />
          <div className="flex flex-col flex-1 transition-all duration-300 ease-in-out" style={{ width: "100%", marginLeft: isMobile ? 0 : sidebarCollapsed ? '70px' : '230px', paddingBottom: isMobile ? '80px' : '0' }}>
            <Header onMenuClick={() => setSidebarOpen(true)} />
            <div className="flex flex-col p-4 sm:p-6">
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h1 className="text-white text-2xl font-bold mb-6">My Signatures</h1>
                <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 mb-6">
                  <div className="flex flex-wrap gap-2 sm:gap-2">
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
                  </div>

                  {/* Search Bar */}
                  <div className="w-full sm:w-auto sm:ml-auto">
                    <input
                      type="text"
                      placeholder="Search signatures..."
                      className="w-full sm:w-[250px] px-4 py-2 bg-[#031123] border border-[#112F59] rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#01C8A9] focus:border-[#01C8A9]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  {/* Add Button */}

                  <motion.div
                    variants={itemVariants}
                    className="w-full sm:w-auto mt-3 sm:mt-0"
                  >
                    <Button
                      onClick={handleCreateSignature}
                      className="w-full sm:w-auto bg-[#01C8A9] hover:bg-[#01a78f] text-white px-4 py-2 flex items-center justify-center gap-2 rounded-full"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-[#ffffff]"
                      >
                        <path d="M5 12h14"></path>
                        <path d="M12 5v14"></path>
                      </svg>
                      Add New Signature
                    </Button>
                  </motion.div>
                  
                </div>

              </motion.div>

              {filteredSignatures.length === 0 ? (
                <div className="w-[60%] mx-auto flex-grow min-h-[50vh] flex items-center justify-center" style={{ boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;" }}>
                  <motion.div
                    className="flex flex-col items-center justify-center bg-[#092756] rounded-xl py-8 px-8 w-full max-w-xxl"
                    style={{ border: "1px solid rgb(49 65 86)" }}
                    variants={itemVariants}
                  >
                    <div className="flex flex-col items-center text-center space-y-4">
                      <img
                        src="/lovable-uploads/no-sigature-img.png"
                        alt="Email signature example"
                        className="rounded-lg shadow-2xl animate-image-reveal w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] md:w-[120px] md:h-[120px] object-contain"
                      />

                      <h2 className="text-white text-lg font-semibold">No signatures yet.</h2>
                      <p className="text-sm text-gray-400">Click “Add New Signature” to create your first one!</p>
                      <motion.div variants={itemVariants} className="flex justify-center">
                        <Button onClick={handleCreateSignature} className="bg-[#01C8A9] hover:bg-[#01a78f] text-white px-4">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#ffffff]">
                            <path d="M5 12h14"></path>
                            <path d="M12 5v14"></path>
                          </svg>
                          Add New Signature
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              ) : (
                <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4" initial="hidden" animate={animateCards ? "visible" : "hidden"}>
                  {filteredSignatures.map(signature => (
                    <motion.div key={signature._id} variants={itemVariants} whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}>
                      <SignatureCard signature={signature} onEdit={handleEdit} onShare={handleShare} onCopy={handleCopy} onDelete={confirmDelete} isDeleted={false } />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
          {isMobile && <MobileNavbar onCreateClick={handleCreateSignature} />}
        </div>
        <DeleteConfirmDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen} onConfirm={handleDelete} />
        <ShareSignatureModal
          open={shareModalOpen}
          onOpenChange={setShareModalOpen}
          signatureId={selectedSignatureId}
          details={{
            html: getSelectedsignatureHtml?.[0]?.details?.html || "",
            background: { background_value: getSelectedsignatureHtml?.[0]?.details?.background?.background_value || "#ffffff" }
          }}
        />
      </SidebarProvider>
    </>
  );
};

export default SignaturesPage;