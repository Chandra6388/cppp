
// import React from "react";
// import { useToast } from "@/hooks/use-toast";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
// } from "@/components/ui/dialog";

// interface ShareSignatureModalProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }

// const ShareSignatureModal: React.FC<ShareSignatureModalProps> = ({
//   open,
//   onOpenChange,
// }) => {
//   const { toast } = useToast();

//   const handleCopyLink = () => {
//     navigator.clipboard.writeText("https://signatures.app/s/example-link");
//     toast({
//       title: "Link copied",
//       description: "Share link has been copied to clipboard",
//     });
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="bg-[#031123] border-[#112F59] p-6 text-white max-w-md">
//         <DialogHeader>
//           <h2 className="text-xl font-medium">Share Signature</h2>
//         </DialogHeader>
//         <div className="py-4">
//           <div className="grid grid-cols-3 gap-4 mb-6">
//             <button className="flex flex-col items-center p-3 bg-[#07234A] rounded-lg hover:bg-[#0a2d5e] transition-colors">
//               <svg className="w-6 h-6 mb-2 text-[#1DA1F2]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
//                 <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.028 10.028 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
//               </svg>
//               <span className="text-xs">Twitter</span>
//             </button>
//             <button className="flex flex-col items-center p-3 bg-[#07234A] rounded-lg hover:bg-[#0a2d5e] transition-colors">
//               <svg className="w-6 h-6 mb-2 text-[#0A66C2]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
//                 <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
//               </svg>
//               <span className="text-xs">LinkedIn</span>
//             </button>
//             <button className="flex flex-col items-center p-3 bg-[#07234A] rounded-lg hover:bg-[#0a2d5e] transition-colors">
//               <svg className="w-6 h-6 mb-2 text-[#4267B2]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
//                 <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
//               </svg>
//               <span className="text-xs">Facebook</span>
//             </button>
//           </div>

//           <div className="mb-4">
//             <label htmlFor="share-link" className="block text-sm text-gray-400 mb-1">
//               Or copy this link
//             </label>
//             <div className="flex">
//               <input
//                 type="text"
//                 id="share-link"
//                 className="flex-1 bg-[#07234A] border border-[#112F59] rounded-l-md p-2 text-white"
//                 value="https://signatures.app/s/example-link"
//                 readOnly
//               />
//               <Button 
//                 onClick={handleCopyLink}
//                 className="bg-[#01C8A9] hover:bg-[#01a78f] rounded-l-none"
//               >
//                 Copy
//               </Button>
//             </div>
//           </div>

//           <div>
//             <label htmlFor="share-email" className="block text-sm text-gray-400 mb-1">
//               Send via email
//             </label>
//             <div className="flex">
//               <input
//                 type="email"
//                 id="share-email"
//                 className="flex-1 bg-[#07234A] border border-[#112F59] rounded-l-md p-2 text-white"
//                 placeholder="recipient@example.com"
//               />
//               <Button className="bg-[#01C8A9] hover:bg-[#01a78f] rounded-l-none">Send</Button>
//             </div>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default ShareSignatureModal;
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { signatureSendByMails } from '@/service/User/signatureService'


interface ShareSignatureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  signatureId: string;
  details: {
    html: string;
    background: {
      background_value: string
    }
  }
}

const ShareSignatureModal: React.FC<ShareSignatureModalProps> = ({
  open,
  onOpenChange,
  signatureId,
  details
}) => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const userId = JSON.parse(localStorage.getItem('user'))?._id

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://signatures.app/s/example-link");
    toast({
      title: "Link copied",
      description: "Share link has been copied to clipboard",
      variant: "success",
      duration: 1000,
    });
  };


  const handleSendEmail = async () => {
     

    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter a valid email address.",
        variant: "destructive",
        duration: 1000,
      });
      return;
    }

    setIsSending(true);

    try {

      const req = { email: email, signatureId: signatureId, html: details.html, userId: userId }

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
            setIsSending(false);
            setEmail("")
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
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Email Sending Failed",
        description: "There was an issue sending the signature. Please try again.",
        variant: "destructive",
        duration: 1000,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#031123] border-[#112F59] p-6 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium">Share Signature</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="grid grid-cols-3 gap-4 mb-6">
          </div>
          <div>
            <label htmlFor="share-email" className="block text-sm text-gray-400 mb-1">
              Send via email
            </label>
            <div className="flex">
              <input
                type="email"
                id="share-email"
                className="flex-1 bg-[#07234A] border border-[#112F59] rounded-l-md p-2 text-white"
                placeholder="recipient@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                onClick={handleSendEmail}
                className="bg-[#01C8A9] hover:bg-[#01a78f] rounded-l-none"
                disabled={isSending}
              >
                {isSending ? "Sending..." : "Send"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareSignatureModal;
