
import React, { useState } from "react";
import { Trash2, Edit2, Share2, Copy, RotateCcw, CheckCheck , Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateSignatureHtml } from "./SignatureUtils";
import { useToast } from "@/hooks/use-toast";
import { ConvertDate } from '../../../Utils/CommonFunctions'
import { v4 as uuidv4 } from 'uuid';
import * as Config from "../../../Utils/config";
import { boolean } from "zod";
interface SignatureCardProps {
  signature: {
    _id: string;
    SignatureName: string;

    templateInfo: {
      TemplatesName: string
    }
    createdAt: string;
    usageCount: number;

    details?: {
      name: string;
      jobTitle: string;
      company: string;
      phone?: string;
      email: string;
      website?: string;
      layout: string;
      buttons?: Array<{
        id: string;
        text: string;
        type: string;
        connect_with: string;
        icon?: any;
        color?: string;
        fontStyle?: string;
      }>;
      [key: string]: any;
    };
  };
  onEdit: (id: string) => void;
  onShare: (id: string) => void;
  onCopy: (id: string) => void;
  onDelete: (id: string) => void;
  onRestore?: (id: string) => void;
  onDownLoad?:(id:string)=>void;

  isDeleted: boolean
}

const SignatureCard: React.FC<SignatureCardProps> = ({ signature, onEdit, onShare, onCopy, onDelete, isDeleted, onRestore, onDownLoad }) => {
  const { toast } = useToast();
  const [copy, setCopy] = useState("Copy")
  const renderSignaturePreview = () => {

    if (!signature.details) {
      return <span className="text-gray-500 text-sm italic">No preview available</span>;
    }
    const signatureHtml = generateSignatureHtml(signature);
    return (
      <div
        className="bg-white w-full h-full overflow-hidden p-2"
        dangerouslySetInnerHTML={{ __html: signatureHtml }}
      />
    );
  };


  const handleCopyDirectly = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!signature.details) {
      toast({
        title: "Cannot copy signature",
        description: "This signature has no details to copy.",
        variant: "destructive",
        duration: 1000,
      });

      return;
    }




    try {
      let signatureHtml = generateSignatureHtml(signature);

      const userDetails = JSON.parse(localStorage.getItem('user'));
      const trackingId = uuidv4();



      const closingTableIndex = signatureHtml.lastIndexOf('</table>');
      if (closingTableIndex !== -1) {
        signatureHtml = `
          ${signatureHtml.slice(0, closingTableIndex)}
          <tr>
              <td>
                  <img 
                      src=${`${Config.base_url}signature/view/${signature?._id}?trackId=${trackingId}&t=${Date.now()}&userId=${userDetails?._id}`} 
                      width="1" 
                      height="1" 
                      style="width:1px; height:1px; opacity:0; visibility:hidden;" 
                      alt=""
                  />
              </td>
          </tr>
          ${signatureHtml.slice(closingTableIndex)}
      `;
      }


      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.top = '-9999px';
      document.body.appendChild(iframe);
      await new Promise(resolve => setTimeout(resolve, 100));
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) {
        throw new Error("Could not access iframe document");
      }

      doc.open();
      doc.write(`<html><body>${signatureHtml}</body></html>`);
      doc.close();
      await new Promise(resolve => setTimeout(resolve, 200));
      const selection = doc.getSelection();
      const range = doc.createRange();
      range.selectNodeContents(doc.body);
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
        const successful = doc.execCommand('copy');

        setCopy("Copied");

        setTimeout(() => {
          setCopy("Copy");
        }, 4000);
        if (successful) {

          toast({
            title: "Signature copied",
            description: "Your signature has been copied and is ready to paste into your email",
            variant: "success",
            duration: 1000,
          });
          document.body.removeChild(iframe);
          return;
        }
      }
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([signatureHtml], { type: 'text/html' })
        })
      ]);

      toast({
        title: "Signature copied",
        description: "Your signature has been copied and is ready to paste into your email",
        variant: "success",
        duration: 1000,
      });

      document.body.removeChild(iframe);
    } catch (err) {
      console.error('Copy failed:', err);
      onCopy(signature._id);
      toast({
        title: "Quick copy failed",
        description: "Opening copy options dialog instead",
        variant: "destructive",
        duration: 1000,
      });
    }
  };


  return (
    <div className="bg-[#031123] border border-[#112F59] overflow-hidden hover:shadow-lg hover:shadow-[#01C8A9]/10 transition-all duration-300 hover:scale-[1.02] hover:border-[#01C8A9]/40">

      <div className="h-50 overflow-hidden flex items-center justify-center responsvie">
        {renderSignaturePreview()}
      </div>
      <div className="p-4 border-t border-[#112F59] flex justify-between items-center">
        <div className=" border-[#112F59]">
          <h3 className="text-white font-medium truncate">{signature.SignatureName}</h3>
          <div className="flex justify-between items-center mt-2">
            {/* <span className="text-gray-400 text-xs">Template: {signature?.templateInfo?.TemplatesName}</span> */}
            <span className="text-gray-400 text-xs">Created: {ConvertDate(signature.createdAt)}</span>
          </div>
        </div>
        <div className="flex gap-2">

          {!isDeleted && <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-[#07234A]"
            onClick={() => onEdit(signature._id)}
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </Button>}
          {!isDeleted && <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-[#07234A]"
            onClick={() => onShare(signature._id)}
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </Button>}


          {!isDeleted && <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-[#07234A]"
            onClick={() => onDownLoad(signature._id)}
            title="Share"
          >
            <Download  className="w-4 h-4" />
          </Button>}




          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-red-400 hover:bg-[#07234A]"
            onClick={() => onDelete(signature._id)}
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          {!isDeleted &&  (
            <Button
              variant={copy === "Copy" ? "teal" : "dark"}
              size="sm"
              onClick={handleCopyDirectly}
              title="Copy to clipboard"
              className="flex items-center gap-1"
              disabled={copy != "Copy"}
            >
              {copy === "Copy" ? (
                <Copy className="w-3 h-3" />
              ) : (
                <CheckCheck className="w-3 h-3" />
              )}
              <span className="text-xs">{copy}</span>
            </Button>
          )}

          {isDeleted && <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-red-400 hover:bg-[#07234A]"
            onClick={() => onRestore(signature._id)}
            title="Restore"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>}

        </div>
      </div>
    </div>
  );
};

export default SignatureCard;
