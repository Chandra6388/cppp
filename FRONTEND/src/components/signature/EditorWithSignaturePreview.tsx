
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import SignaturePreviewDialog from "./SignaturePreviewDialog";
import { Save, X, Eye } from "lucide-react";

interface EditorWithSignaturePreviewProps {
  onSaveSignature: () => void;
  onSendEmail?: () => void;
  previewContent?: React.ReactNode;
  children?: React.ReactNode;
  isEditMode?: boolean;
}

const EditorWithSignaturePreview: React.FC<EditorWithSignaturePreviewProps> = ({
  onSaveSignature,
  onSendEmail,
  previewContent,
  children,
  isEditMode = false
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSaveSignature = () => {
    onSaveSignature();
    toast({
      title: "Signature Saved",
      description: "Your signature has been saved successfully.",
      variant: "success",
      duration: 1000,
    });
    navigate("/signatures");
  };

  const handlePreviewClick = () => {
    setShowPreview(true);
  };

  const handleCancel = () => {
    navigate("/signatures");
  };

  return (
    <div className="w-full">
      {children}

      <div className="flex flex-wrap gap-4 justify-end mt-6">
        <Button
          variant="outline"
          onClick={handleCancel}
          className="text-white border-[#112F59] hover:bg-[#112F59]/20"
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button
          variant="teal"
          onClick={handlePreviewClick}
        >
          <Eye className="h-4 w-4 mr-2" />
          Preview Signature
        </Button>
        <Button
          variant="dark"
          onClick={handleSaveSignature}
        >
          <Save className="h-4 w-4 mr-2" />
          {isEditMode ? 'Update Signature' : 'Save Signature'}
        </Button>
      </div>

      <SignaturePreviewDialog
        open={showPreview}
        onOpenChange={setShowPreview}
        onSave={handleSaveSignature}
        onSendEmail={onSendEmail}
        previewContent={previewContent}
      />
    </div>
  );
};

export default EditorWithSignaturePreview;
