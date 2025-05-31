
import React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptySignatureStateProps {
  searchQuery?: string;
  onClearSearch?: () => void;
}

const EmptySignatureState: React.FC<EmptySignatureStateProps> = ({
  searchQuery,
  onClearSearch,
}) => {
  return (
    <div className="col-span-full bg-[#031123] border border-[#112F59] rounded-lg p-8 flex flex-col items-center justify-center">
      <div className="bg-[#07234A] rounded-full p-4 mb-4">
        <Search className="h-8 w-8 text-[#01C8A9]" />
      </div>
      <h3 className="text-white text-lg font-medium">No signatures found</h3>
      <p className="text-gray-400 text-center mt-2">
        {searchQuery 
          ? `No signatures match "${searchQuery}". Try a different search term.` 
          : "You haven't created any signatures yet."}
      </p>
      {searchQuery && onClearSearch && (
        <Button
          variant="darkOutline"
          onClick={onClearSearch}
          className="mt-4 text-white hover:bg-[#07234A]"
        >
          Clear search
        </Button>
      )}
    </div>
  );
};

export default EmptySignatureState;
