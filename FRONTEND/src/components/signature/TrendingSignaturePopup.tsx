
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, ChevronRight } from 'lucide-react';

interface TrendingSignature {
  id: string;
  name: string;
  image: string;
  description: string;
}

const TRENDING_SIGNATURES: TrendingSignature[] = [
  {
    id: 'trend-1',
    name: 'Business Growth Pro',
    image: '/lovable-uploads/3a7fe7a9-f38f-4d70-ad8f-5a6858032ffd.png',
    description: 'Perfect for business development professionals'
  },
  {
    id: 'trend-2',
    name: 'Modern Minimal',
    image: '/lovable-uploads/e5249bf1-7545-48d2-a026-388f36c74145.png',
    description: 'Clean and professional look with sleek buttons'
  },
  {
    id: 'trend-3',
    name: 'Creative Bold',
    image: '/lovable-uploads/ffa0910e-e0dd-4210-8b94-95529e21b14e.png',
    description: 'Stand out with vibrant colors and strong visual presence'
  }
];

const TrendingSignaturePopup = () => {
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Check if this is the first visit using localStorage
  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('hasSeenTrendingPopup');
    const isMobile = window.innerWidth < 768;
    
    // Only show on desktop and if not seen before
    if (!hasSeenPopup && !isMobile) {
      // Add a slight delay for better UX
      const timer = setTimeout(() => {
        setOpen(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  const handleUseTemplate = () => {
    if (selectedTemplate) {
      // Mark as seen
      localStorage.setItem('hasSeenTrendingPopup', 'true');
      
      // Navigate to editor with selected template
      navigate(`/editor?template=${selectedTemplate}`);
      setOpen(false);
    }
  };
  
  const handleRemindLater = () => {
    // Close without marking as seen permanently
    setOpen(false);
  };
  
  const handleClose = () => {
    // Mark as seen
    localStorage.setItem('hasSeenTrendingPopup', 'true');
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[800px] p-0 bg-gradient-to-br from-[#031123] to-[#071f3d] border-[#112F59] text-white overflow-hidden">
        <DialogClose 
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-10"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </DialogClose>
        
        <div className="relative">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#01C8A9] to-transparent rounded-full opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-[#4169E1] to-transparent rounded-full opacity-20 translate-x-1/3 translate-y-1/3"></div>
          
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-2">Trending Signatures</h2>
            <p className="text-gray-300 mb-6">Boost Your Business with These Trending Signatures!</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {TRENDING_SIGNATURES.map((signature) => (
                <div 
                  key={signature.id}
                  className={`bg-[#051b37] border ${selectedTemplate === signature.id ? 'border-[#01C8A9]' : 'border-[#112F59]'} rounded-lg p-4 cursor-pointer transition-all hover:border-[#01C8A9]/70 relative overflow-hidden`}
                  onClick={() => setSelectedTemplate(signature.id)}
                >
                  {selectedTemplate === signature.id && (
                    <div className="absolute top-2 right-2 bg-[#01C8A9] rounded-full p-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M20 6L9 17l-5-5"></path></svg>
                    </div>
                  )}
                  <div className="relative">
                    <img 
                      src={signature.image} 
                      alt={signature.name} 
                      className="w-full h-28 object-cover rounded bg-[#001430]"
                    />
                    <span className="absolute bottom-2 left-2 bg-[#031123]/80 text-white text-xs px-2 py-1 rounded">
                      Trending
                    </span>
                  </div>
                  <h3 className="mt-2 text-white font-medium">{signature.name}</h3>
                  <p className="text-gray-400 text-sm">{signature.description}</p>
                  <div className="mt-2 text-xs text-[#01C8A9]">
                    <span className="flex items-center">
                      <span className="mr-1">14,392</span> users using this template
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex flex-wrap justify-end gap-3 mt-6">
              <Button 
                variant="outline" 
                onClick={handleRemindLater}
                className="bg-[#051b37] text-white border-[#112F59] hover:bg-[#071f3d]"
              >
                Remind Me Later
              </Button>
              <Button 
                variant="teal"
                onClick={handleUseTemplate}
                disabled={!selectedTemplate}
                className="flex items-center"
              >
                Use Template <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrendingSignaturePopup;
