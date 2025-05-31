
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import SelectTemplateModal from "./SelectTemplateModal";
import { Button } from "@/components/ui/button";

interface CreateSignatureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (signatureName: string) => void;
}

const CreateSignatureModal: React.FC<CreateSignatureModalProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const [signatureName, setSignatureName] = useState("");
  const [selectTemplateModalOpen, setSelectTemplateModalOpen] = useState(false);
  const { toast } = useToast();

  const handleCreate = () => {
    if (!signatureName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a signature name",
        variant: "destructive",
        duration: 1000,
      });
      return;
    }

    // Store signature name in sessionStorage for the editor to access
    sessionStorage.setItem("newSignatureName", signatureName);
    
    // Close this modal and open the template selection modal
    onOpenChange(false);
    setSelectTemplateModalOpen(true);
    
    if (onSuccess) {
      onSuccess(signatureName);
    }
  };

  const handleTemplateModalClose = (open: boolean) => {
    setSelectTemplateModalOpen(open);
    // Reset the signature name when the template modal is closed
    if (!open) {
      setSignatureName("");
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-[#001430] border-[#112F59] p-0 overflow-hidden max-w-md">
          <DialogHeader className="p-0">
            <div className="flex items-center justify-between w-full bg-[#001430] p-6 border-b border-[#112F59]">
              <h2 className="text-white text-xl font-medium">Create New Signature</h2>
              <button
                onClick={() => onOpenChange(false)}
                className="text-white hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>
          </DialogHeader>
          
          <div className="p-6">
            <div className="mb-6">
              <label htmlFor="signatureName" className="block text-[#8B8B8B] text-sm mb-2">
                Signature Name
              </label>
              <Input
                id="signatureName"
                value={signatureName}
                onChange={(e) => setSignatureName(e.target.value)}
                placeholder="Business Signature"
                className="bg-[#001430] border-[#112F59] text-white focus:ring-[#01C8A9] focus:border-[#01C8A9]"
              />
            </div>

            <Button
              onClick={handleCreate}
              variant="teal"
              className="w-full"
            >
              Create Signature
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.33398 8H12.6673" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.33398 3.33337L13.0007 8.00004L8.33398 12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <SelectTemplateModal 
        open={selectTemplateModalOpen} 
        onOpenChange={handleTemplateModalClose} 
        signatureName={signatureName}
      />
    </>
  );
};

export default CreateSignatureModal;
