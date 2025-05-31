
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { generateSignatureHtml } from "../signatures/SignatureUtils";

interface SignatureItem {
  id: string;
  title: string;
  date: string;
  status: "active" | "pending" | "expired";
  preview?: string; // Add preview image property
  details?: {
    name: string;
    jobTitle: string;
    company: string;
    email: string;
    phone?: string;
    website?: string;
    layout: string;
    [key: string]: any;
  };
}

interface SignatureGridProps {
  items?: SignatureItem[];
  isLoading?: boolean;
}

export const SignatureGrid: React.FC<SignatureGridProps> = ({
  items = [],
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-5 p-5 max-md:grid-cols-2 max-sm:grid-cols-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-40 bg-[#031123] rounded-lg animate-pulse border border-[#112F59]"
          />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="grid grid-cols-4 gap-5 p-5 max-md:grid-cols-2 max-sm:grid-cols-1">
        <div className="col-span-full flex flex-col items-center justify-center h-40 bg-[#031123] rounded-lg border border-[#112F59] p-4">
          <p className="text-white text-sm">No signatures found</p>
          <p className="text-gray-400 text-xs mt-2">
            Create your first signature to get started
          </p>
        </div>
      </div>
    );
  }

  // Fallback images if no preview is available
  const templateImages = [
    "/lovable-uploads/9876cab7-81ef-4f25-b7a8-ec2df02a2cb5.png",
    "/lovable-uploads/4d3c0365-1f4e-48e7-88b4-1c71b62511ba.png", 
    "/lovable-uploads/e676fe77-2cdf-4250-b6e3-d4f616030a21.png",
    "/lovable-uploads/b97701e4-fc23-45fb-b4e5-1c23680fa2e5.png",
    "/lovable-uploads/9e972af7-e337-4516-8d72-03a3ffcc2a44.png" 
  ];

  // Render the signature preview based on details or preview image
  const renderPreview = (item: SignatureItem, index: number) => {
    // If there's a stored preview image, use that
    if (item.preview) {
      return (
        <img
          src={item.preview}
          alt={item.title}
          className="w-full h-full object-contain"
        />
      );
    }
    
    // If there are details, render proper HTML signature preview using the same generator
    if (item.details) {
      // Use signature structure compatible with our signature generator
      const signature = {
        id: item.id,
        name: item.title,
        template: "",
        createdAt: item.date,
        usageCount: 0,
        details: item.details
      };
      
      const signatureHtml = generateSignatureHtml(signature);
      return (
        <div 
          className="w-full h-full bg-white p-2 overflow-hidden"
          dangerouslySetInnerHTML={{ __html: signatureHtml }}
        />
      );
    }
    
    // Fallback to template images
    return (
      <img
        src={templateImages[index % templateImages.length]}
        alt={item.title}
        className="w-full h-full object-contain"
      />
    );
  };

  return (
    <div className="grid grid-cols-4 gap-5 p-5 max-md:grid-cols-2 max-sm:grid-cols-1">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="bg-[#031123] rounded-lg border border-[#112F59] p-4 hover:shadow-lg hover:shadow-[#01C8A9]/20 transition-all duration-300 hover:scale-[1.02] hover:border-[#01C8A9]/40"
        >
          <h3 className="text-white text-sm font-medium">{item.title}</h3>
          <p className="text-gray-400 text-xs mt-1">{item.date}</p>
          <div className="mt-4 h-20 rounded overflow-hidden bg-white">
            {renderPreview(item, index)}
          </div>
          <div className="mt-4 flex justify-between items-center">
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                item.status === "active"
                  ? "bg-[#01C8A9]/20 text-[#01C8A9]"
                  : item.status === "pending"
                    ? "bg-[#FFB800]/20 text-[#FFB800]"
                    : "bg-[#FF5470]/20 text-[#FF5470]"
              }`}
            >
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </span>
            <button className="text-[#216FFF] text-xs">View</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SignatureGrid;
