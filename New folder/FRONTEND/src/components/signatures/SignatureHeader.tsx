
import React from "react";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SignatureHeaderProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCreateSignature: () => void;
}

const SignatureHeader: React.FC<SignatureHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onCreateSignature,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
      <div>
        <h1 className="text-white text-xl font-semibold">My Signatures</h1>
        <p className="text-gray-400 text-sm">Manage all your email signatures</p>
      </div>
      
      <div className="flex gap-3 flex-col sm:flex-row w-full md:w-auto">
        <div className="relative flex-grow sm:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search signatures..."
            value={searchQuery}
            onChange={onSearchChange}
            className="pl-10 pr-4 py-2 bg-[#031123] border border-[#112F59] rounded-lg w-full text-white focus:outline-none focus:ring-1 focus:ring-[#01C8A9] focus:border-[#01C8A9]"
          />
        </div>
        
        <Button 
          onClick={onCreateSignature}
          className="bg-gradient-to-r from-[#01C8A9] to-[#01a78f] hover:from-[#01a78f] hover:to-[#018a76] text-white font-medium px-4 py-2.5 rounded-lg transition-all duration-300 shadow-lg shadow-[#01C8A9]/20 hover:shadow-xl hover:shadow-[#01C8A9]/30"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Signature
        </Button>
      </div>
    </div>
  );
};

export default SignatureHeader;
