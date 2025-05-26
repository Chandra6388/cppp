
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { X, Mail, Save, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { signatureSendByMails } from '@/service/User/signatureService'

interface SignaturePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  previewContent?: React.ReactNode;
  details: {
    background: {
      background_value: string;
    }
    html: string
  }
}

const SignaturePreviewDialog = ({ open, onOpenChange, previewContent, details }: SignaturePreviewDialogProps) => {
  const { toast } = useToast();
  const userId = JSON.parse(localStorage.getItem('user'))?._id
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [isSending, setIsSending] = useState(false);



  const handleSendEmail = async () => {
    if (showEmailInput) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailAddress)) {
        toast({
          title: "Invalid email",
          description: "Please enter a valid email address.",
          variant: "destructive",
          duration: 1000,
        });
        return;
      }
       
      setIsSending(true)
      try {
        const req = { email: emailAddress, signatureId: "", html: details.html, userId: userId }
        await signatureSendByMails(req)
          .then((res) => {
            if (res.status) {
              toast({
                title: "Signature Sent",
                description: "The signature has been sent to the provided email.",
                variant: "success",
                duration: 1000,
              });
              onOpenChange(false);
              setIsSending(false)
              setEmailAddress('')
            }
          }).catch((error) => {
            console.error("Error sending email:", error);
            toast({
              title: "Email Sending Failed",
              description: "There was an issue sending the signature. Please try again.",
              variant: "destructive",
              duration: 1000,
            });
          })
      }
      catch (error) {
        console.error("Error sending email:", error);
        toast({
          title: "Email Sending Failed",
          description: "There was an issue sending the signature. Please try again.",
          variant: "destructive",
          duration: 1000,
        });
      }
    } else {
      setShowEmailInput(true);
    }
  };



  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] bg-[#031123] border-[#112F59] text-white">
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        <DialogHeader>
          <DialogTitle className="text-xl text-white">Signature Preview</DialogTitle>
        </DialogHeader>
        <div className=" bg-white border border-[#112F59] rounded-lg my-4">
          {previewContent || (
            <div className="flex items-center justify-center h-64 text-gray-400">
              Signature Preview Content
            </div>
          )}
        </div>

        {showEmailInput ? (
          <div className="bg-[#051b37] p-4 rounded-lg my-4">
            <h3 className="text-white text-sm font-medium mb-3">Send Signature via Email</h3>
            <div className="flex gap-3">
              <Input
                type="email"
                placeholder="Enter email address"
                className="bg-[#031123] border-[#112F59] text-white"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
              />
              <Button
                variant="teal"
                className="whitespace-nowrap"
                onClick={handleSendEmail}
                disabled={isSending}
              >
                {isSending ? (
                  <>
                    <span className="animate-spin mr-2">◌</span>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} className="mr-2" />
                    Send
                  </>
                )}
              </Button>
            </div>
            <p className="text-gray-400 text-xs mt-2">
              Your signature will be sent as an HTML email attachment.
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-400 mb-4">
            This is how your signature will appear in emails. You can save it or send it directly to your email.
          </p>
        )}

        <div className="flex flex-wrap gap-4 justify-end mt-4">
          {!showEmailInput && (
            <Button
              variant="teal"
              onClick={handleSendEmail}
              className="flex items-center gap-2"
            >
              <Mail size={16} />
              Send Signature (Email)
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignaturePreviewDialog;
