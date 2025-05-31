
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { X, Send, Mail } from "lucide-react";

interface SendSignatureEmailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  signatureHtml?: string;
  signatureName?: string;
}

const SendSignatureEmailModal: React.FC<SendSignatureEmailModalProps> = ({
  open,
  onOpenChange,
  signatureHtml,
  signatureName = "My Signature"
}) => {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSendEmail = () => {
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
        duration: 1000,
      });
      return;
    }

    setIsSending(true);

    // Simulate email sending (in a real app, make an API call here)
    setTimeout(() => {
      setIsSending(false);
      toast({
        title: "Email sent",
        description: `Your signature has been sent to ${email}`,
        variant: "success",
        duration: 1000,
      });
      onOpenChange(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#031123] border-[#112F59] text-white sm:max-w-md">
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>

        <DialogHeader>
          <DialogTitle className="text-lg text-white">Email Signature</DialogTitle>
        </DialogHeader>

        <div className="p-4 border border-[#112F59] rounded-lg bg-[#051b37] my-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#01C8A9]/20 rounded-full">
              <Mail className="h-5 w-5 text-[#01C8A9]" />
            </div>
            <div>
              <h3 className="text-white font-medium text-sm">{signatureName}</h3>
              <p className="text-gray-400 text-xs">HTML Email Signature</p>
            </div>
          </div>

          <p className="text-sm text-gray-400">
            Enter your email address below to receive this signature directly in your inbox.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-300">Email Address</label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#020e1f] border-[#112F59] text-white"
            />
          </div>

          <Button
            onClick={handleSendEmail}
            disabled={isSending}
            className="w-full bg-[#01C8A9] hover:bg-[#01a58c] text-white"
          >
            {isSending ? (
              <>
                <span className="animate-spin mr-2">◌</span>
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Signature
              </>
            )}
          </Button>

          <p className="text-xs text-gray-400 text-center">
            The email will contain instructions on how to use your signature with various email clients.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SendSignatureEmailModal;
