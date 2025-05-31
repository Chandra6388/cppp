
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, CheckCheck, Download, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { toPng } from 'html-to-image';
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

interface SignatureCopyProps {
  signatureHtml: string;
}

const SignatureCopy: React.FC<SignatureCopyProps> = ({ signatureHtml }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const signatureRef = useRef<HTMLDivElement>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  const handleCopySignature = async () => {
    try {
      // Create a temporary iframe to hold the content
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.top = '-9999px';
      iframe.style.width = '500px';
      iframe.style.height = '200px';
      iframe.style.opacity = '0';
      document.body.appendChild(iframe);

      // Wait for iframe to initialize
      await new Promise(resolve => setTimeout(resolve, 100));

      // Write the HTML content to the iframe with minimal wrappers
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) {
        throw new Error("Could not access iframe document");
      }

      doc.open();
      doc.write(`
        <html>
        <head>
          <style>
            body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
          </style>
        </head>
        <body>
          ${signatureHtml}
        </body>
        </html>
      `);
      doc.close();

      // Wait for the iframe to render fully
      await new Promise(resolve => setTimeout(resolve, 200));

      // Select the content in the iframe
      const selection = doc.getSelection();
      const range = doc.createRange();
      range.selectNodeContents(doc.body);

      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);

        // Copy to clipboard using document.execCommand
        const successful = doc.execCommand('copy');

        if (successful) {
          setCopied(true);
          toast({
            title: "Signature copied",
            description: "Your signature has been copied and is ready to paste into your email",
            variant: "success",
            duration: 1000,
          });

          setShowInstructions(true);
          setTimeout(() => setCopied(false), 2000);
          document.body.removeChild(iframe);
          return;
        }
      }

      // Fallback to clipboard API if execCommand fails
      try {
        // Get HTML content from the iframe
        const html = doc.body.innerHTML;

        // Use clipboard API to write HTML
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/html': new Blob([html], { type: 'text/html' })
          })
        ]);

        setCopied(true);
        toast({
          title: "Signature copied",
          description: "Your signature has been copied and is ready to paste into your email",
          variant: "success",
          duration: 1000,
        });

        setShowInstructions(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Clipboard API failed:", err);
        toast({
          title: "Copy failed",
          description: "Please try using the 'Download as Image' option instead",
          variant: "destructive",
          duration: 1000,
        });
      }

      document.body.removeChild(iframe);
    } catch (err) {
      console.error('Copy failed:', err);
      toast({
        title: "Copy failed",
        description: "Please try using the 'Download as Image' option instead",
        variant: "destructive",
        duration: 1000,
      });
    }
  };

  const handleDownloadImage = async () => {
    try {
      if (!signatureRef.current) return;

      const dataUrl = await toPng(signatureRef.current, {
        quality: 0.95,
        backgroundColor: '#ffffff',
        canvasWidth: 600,
        style: {
          margin: '20px'
        }
      });

      const link = document.createElement('a');
      link.download = 'email-signature.png';
      link.href = dataUrl;
      link.click();

      toast({
        title: "Signature downloaded",
        description: "Your signature has been downloaded as an image. You can insert it into your email.",
        variant: "success",
        duration: 1000,
      });

      setShowInstructions(true);
    } catch (err) {
      console.error('Download failed:', err);
      toast({
        title: "Download failed",
        description: "Unable to download signature. Please try again.",
        variant: "destructive",
        duration: 1000,
      });
    }
  };

  return (
    <div>
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
        <Button
          onClick={handleCopySignature}
          variant="teal"
          className="flex items-center justify-center gap-2"
        >
          {copied ? (
            <>
              <CheckCheck size={16} />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={16} />
              <span>Copy Signature</span>
            </>
          )}
        </Button>

        <Button
          onClick={handleDownloadImage}
          variant="outline"
          className="flex items-center justify-center gap-2"
        >
          <Download size={16} />
          <span>Download as Image</span>
        </Button>
      </div>

      {showInstructions && (
        <div className="mb-4 p-3 bg-[#07234A] rounded-md border border-[#112F59]">
          <h3 className="text-white text-sm font-medium flex items-center gap-2 mb-2">
            <Mail className="w-4 h-4" />
            Email Usage Instructions
          </h3>
          <Table className="text-xs text-gray-300">
            <TableBody>
              <TableRow>
                <TableCell className="py-1 font-medium">Gmail:</TableCell>
                <TableCell className="py-1">Settings (⚙️) → See all settings → Signature → Paste</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="py-1 font-medium">Outlook:</TableCell>
                <TableCell className="py-1">New Email → Signature → Signatures → Paste</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="py-1 font-medium">Apple Mail:</TableCell>
                <TableCell className="py-1">Preferences → Signatures → Create new → Paste</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}

      {/* This is the visible signature preview that will be copied */}
      <div className="border border-gray-200 rounded-md p-3 bg-white mb-4">
        <div
          ref={signatureRef}
          className="signature-preview"
          dangerouslySetInnerHTML={{ __html: signatureHtml }}
        />
      </div>
    </div>
  );
};

export default SignatureCopy;
