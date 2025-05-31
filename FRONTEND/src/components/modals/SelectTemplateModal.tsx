
import React from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface SelectTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  signatureName?: string;
}

const templates = [
  { 
    id: "template1", 
    name: "Professional Blue", 
    description: "Clean design with circular photo and social media icons",
    image: "/lovable-uploads/9876cab7-81ef-4f25-b7a8-ec2df02a2cb5.png" 
  },
  { 
    id: "template2", 
    name: "Modern Teal", 
    description: "Modern layout with horizontal social media icons",
    image: "/lovable-uploads/4d3c0365-1f4e-48e7-88b4-1c71b62511ba.png" 
  },
  { 
    id: "template3", 
    name: "Executive Style", 
    description: "Professional layout with contact details on the right",
    image: "/lovable-uploads/e676fe77-2cdf-4250-b6e3-d4f616030a21.png" 
  },
  { 
    id: "template4", 
    name: "Sleek Horizontal", 
    description: "Modern horizontal layout with balanced elements",
    image: "/lovable-uploads/b97701e4-fc23-45fb-b4e5-1c23680fa2e5.png" 
  }
];

const SelectTemplateModal: React.FC<SelectTemplateModalProps> = ({
  open,
  onOpenChange,
  signatureName
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = React.useState<string | null>(null);

  const handleSelectTemplate = (id: string) => {
    setSelectedTemplate(id);
  };

  const handleCreateSignature = () => {
    onOpenChange(false);
    const params = new URLSearchParams();
    if (selectedTemplate) {
      params.append('template', selectedTemplate);
    }
    if (signatureName) {
      params.append('name', signatureName);
    }
    navigate(`/editor?${params.toString()}`);
  };

  const handleSkip = () => {
    onOpenChange(false);
    const params = new URLSearchParams();
    if (signatureName) {
      params.append('name', signatureName);
    }
    navigate(`/editor?${params.toString()}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#001430] border-[#112F59] p-0 overflow-hidden max-w-4xl">
        <DialogHeader className="p-0">
          <div className="flex items-center justify-between w-full bg-[#031123] p-6 border-b border-[#112F59]">
            <h2 className="text-white text-xl font-medium">Select Template</h2>
            <button
              onClick={() => onOpenChange(false)}
              className="text-white hover:text-gray-300"
            >
              <X size={20} />
            </button>
          </div>
        </DialogHeader>
        
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {templates.map((template) => (
              <div 
                key={template.id}
                onClick={() => handleSelectTemplate(template.id)}
                className={`bg-[#031123] border-2 ${selectedTemplate === template.id ? 'border-[#01C8A9]' : 'border-[#112F59]'} rounded-lg p-3 cursor-pointer transition-all hover:border-[#01C8A9]/50`}
              >
                <div className="aspect-[16/9] rounded overflow-hidden mb-3">
                  <img 
                    src={template.image} 
                    alt={template.name} 
                    className="w-full h-full object-contain" 
                  />
                </div>
                <h4 className="text-white text-sm font-medium">{template.name}</h4>
                <p className="text-gray-400 text-xs mt-1">{template.description}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 border-t border-[#112F59] pt-4">
            <Button
              variant="darkOutline"
              onClick={handleSkip}
              className="text-white"
            >
              Skip for now
            </Button>
            <Button
              onClick={handleCreateSignature}
              className="bg-gradient-to-r from-[#01C8A9] to-[#01a78f] hover:from-[#01a78f] hover:to-[#018a76] text-white"
            >
              Create Signature
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SelectTemplateModal;
