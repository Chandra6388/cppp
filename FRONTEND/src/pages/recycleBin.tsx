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
import { getAllRecycleBinSignature, deleteSignatureFromArchive, restoreSignature } from '@/service/User/signatureService';
import { SEO } from '../../Utils/Helmet';
import Swal from 'sweetalert2';
import { sweetAlert } from '../../Utils/CommonFunctions'


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
      const res = await getAllRecycleBinSignature(req);
      setSignatures(res?.status ? res.data : []);
    } catch (error) {
      console.error("Error fetching signatures:", error);
      setSignatures([]);
    }
  };

  const filteredSignatures = signatures?.filter(sig => {
    const matchesSearch = sig?.SignatureName?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
      (sig.details?.fullName?.toLowerCase()?.includes(searchQuery.toLowerCase()) || false);

    if (activeFilter === 'all') return matchesSearch;
    if (activeFilter === 'business' && sig?.templateInfo?.TemplatesName?.toLowerCase()?.includes('business')) return matchesSearch;
    if (activeFilter === 'layouts' && sig?.details?.layout) return matchesSearch;
    if (activeFilter === 'free') return matchesSearch;

    return false;
  });

  const handleCreateSignature = () => navigate('/user/create-signature');
  const handleEdit = (id :string) => navigate('/user/editor', { state: { id, type: "edit" } });

  const confirmDelete = (id:string) => {
    setSelectedSignatureId(id);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (selectedSignatureId) {
      try {
        const req = { id: selectedSignatureId };
        const res = await deleteSignatureFromArchive(req);
        if (res?.status) {
          toast({ title: "Signature deleted", description: "Your signature has been permanently deleted." });

          fetchSignatures();
        }
      } catch (error) {
        console.error("Delete signature error:", error);
      }
    }
    setDeleteConfirmOpen(false);
    setSelectedSignatureId(null);
  };

  const handleShare = (id:string) => {
    setSelectedSignatureId(id);
    setShareModalOpen(true);
  };

  const handleCopy = (id:string) => {
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

  const getSelectedsignatureHtml = signatures?.filter(item => item._id === selectedSignatureId);
  const endpoint = window.location.hash.replace(/^#/, '').split('?')[0];




  const handleRestore = async (id:string) => {
    const req = { id: id };
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to restore this signature ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#01c8a7",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, Restore it!`
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await restoreSignature(req);
          if (res.status) {
            sweetAlert("Success", `your signature has been restore successfully`, "success",)
            fetchSignatures();
          } else {
            sweetAlert("Error", res.message || `Failed to change status`, "error");
          }
        } catch (error) {
          console.error(`Error in changing  status:`, error);
          sweetAlert("Error", `An error occurred while restore the signature`, "error");
        }
      }
    });
  };
  return (
    <>
      <SEO title={endpoint.split('/').pop()} description={"SignatureDashbaord"} />
      <SidebarProvider defaultOpen={!isMobile}>
        <div className="flex w-full min-h-screen bg-gradient-to-br from-[#001430] to-[#031a3d] font-sans">
          <MainSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} onCreateSignature={handleCreateSignature} onCollapseChange={setSidebarCollapsed} />
          <div className="flex flex-col flex-1 transition-all duration-300 ease-in-out" style={{ width: "100%", marginLeft: isMobile ? 0 : sidebarCollapsed ? '70px' : '250px', paddingBottom: isMobile ? '80px' : '0' }}>
            <Header onMenuClick={() => setSidebarOpen(true)} />
            <div className="flex flex-col p-4 sm:p-6">
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h1 className="text-white text-2xl font-bold mb-6">My Deleted Signatures</h1>
                <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 mb-6">
                  <div className="w-full sm:w-auto sm:ml-auto">
                    <input
                      type="text"
                      placeholder="Search signatures..."
                      className="w-full sm:w-[250px] px-4 py-2 bg-[#031123] border border-[#112F59] rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#01C8A9] focus:border-[#01C8A9]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </motion.div>

              {filteredSignatures?.length === 0 ? (
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

                      <h2 className="text-white text-lg font-semibold">No signatures deleted yet.</h2>

                    </div>
                  </motion.div>
                </div>
              ) : (
                <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4" initial="hidden" animate={animateCards ? "visible" : "hidden"}>
                  {filteredSignatures?.map(signature => (
                    <motion.div key={signature._id} variants={itemVariants} whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}>
                      <SignatureCard signature={signature} onEdit={handleEdit} onShare={handleShare} onCopy={handleCopy} onDelete={confirmDelete} isDeleted={true} onRestore={handleRestore} />
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