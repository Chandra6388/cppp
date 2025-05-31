import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface BackgroundOption {
  id: string;
  background_type: 'color' | 'gradient' | 'image';
  background_value: string;
  label?: string;
}

interface SignatureBackgroundPickerProps {
  selectedBackground: BackgroundOption | null;
  onSelectBackground: (background: BackgroundOption) => void;
}

const SignatureBackgroundPicker: React.FC<SignatureBackgroundPickerProps> = ({
  selectedBackground,
  onSelectBackground
}) => {
  // Solid colors options
  const colorOptions: BackgroundOption[] = [
    { id: 'white', background_type: 'color', background_value: '#ffffff', label: 'White' },
    { id: 'light-gray', background_type: 'color', background_value: '#f3f4f6', label: 'Light Gray' },
    { id: 'light-blue', background_type: 'color', background_value: '#f0f9ff', label: 'Light Blue' },
    { id: 'light-green', background_type: 'color', background_value: '#f0fdf4', label: 'Light Green' },
    { id: 'light-yellow', background_type: 'color', background_value: '#fefce8', label: 'Light Yellow' },
    { id: 'light-red', background_type: 'color', background_value: '#fef2f2', label: 'Light Red' },
  ];
  
  // Gradient options
  const gradientOptions: BackgroundOption[] = [
    { id: 'blue-gradient', background_type: 'gradient', background_value: 'linear-gradient(to right, #a5b4fc, #818cf8)' },
    { id: 'green-gradient', background_type: 'gradient', background_value: 'linear-gradient(to right, #86efac, #4ade80)' },
    { id: 'orange-gradient', background_type: 'gradient', background_value: 'linear-gradient(to right, #fdba74, #fb923c)' },
    { id: 'teal-blue-gradient', background_type: 'gradient', background_value: 'linear-gradient(60deg, #abecd6 0%, #fbed96 100%)' },
    { id: 'pink-orange-gradient', background_type: 'gradient', background_value: 'linear-gradient(90deg, hsla(24, 100%, 83%, 1) 0%, hsla(341, 91%, 68%, 1) 100%)' },
    { id: 'blue-purple-gradient', background_type: 'gradient', background_value: 'linear-gradient(90deg, hsla(221, 45%, 73%, 1) 0%, hsla(220, 78%, 29%, 1) 100%)' },
  ];
  
  // Image options with the new uploaded images
  const imageOptions: BackgroundOption[] = [
    { id: 'signature-bg-1', background_type: 'image', background_value: 'url(/lovable-uploads/95dacdad-2df1-416e-8fc3-19b25ebbed85.png)' },
    { id: 'signature-bg-2', background_type: 'image', background_value: 'url(/lovable-uploads/713b90c0-a5b3-4193-b811-341c184f93b0.png)' },
    { id: 'signature-bg-3', background_type: 'image', background_value: 'url(/lovable-uploads/05cb6a8b-2e0a-46de-9aee-c37d6b54a9fd.png)' },
    { id: 'signature-bg-4', background_type: 'image', background_value: 'url(/lovable-uploads/96da7565-c048-45be-ab6b-61ca34f0f2ac.png)' },
    // Keep some of the original images as options
    { id: 'professional-pattern', background_type: 'image', background_value: 'url(/lovable-uploads/56f72441-009e-4e93-a214-641f71838222.png)' },
    { id: 'orange-bg', background_type: 'image', background_value: 'url(/lovable-uploads/d23df437-8cfc-4e6f-8621-17590d761324.png)' },
    { id: 'blue-grid-bg', background_type: 'image', background_value: 'url(/lovable-uploads/7e0a47f6-5c05-42cf-90e8-fda88fd4d667.png)' },
    { id: 'pattern-3', background_type: 'image', background_value: 'url(/lovable-uploads/b653c06d-0c0c-4902-82c3-6ff95d2dadfc.png)' },
  ];
  
  return (
    <div>
      <Tabs defaultValue="colors" className="w-full">
        <TabsList className="grid grid-cols-3 bg-[#07234A] mb-4">
          <TabsTrigger value="colors">Solid Colors</TabsTrigger>
          <TabsTrigger value="gradients">Gradients</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
        </TabsList>
        
        <TabsContent value="colors" className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {colorOptions.map((option) => (
              <div
                key={option.id}
                onClick={() => onSelectBackground(option)}
                style={{ backgroundColor: option.background_value }}
                className="h-12 rounded-md cursor-pointer border border-[#112F59] flex items-center justify-center relative hover:border-[#01C8A9] transition-all"
              >
                {selectedBackground?.id === option.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-md">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                )}
                <span className="text-xs text-gray-800">{option.label}</span>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="gradients" className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {gradientOptions.map((option) => (
              <div
                key={option.id}
                onClick={() => onSelectBackground(option)}
                style={{ background: option.background_value }}
                className="h-12 rounded-md cursor-pointer border border-[#112F59] flex items-center justify-center relative hover:border-[#01C8A9] transition-all"
              >
                {selectedBackground?.id === option.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-md">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="images" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto">
            {imageOptions.map((option) => (
              <div
                key={option.id}
                onClick={() => onSelectBackground(option)}
                style={{ 
                  backgroundImage: option.background_value,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
                className="h-24 rounded-md cursor-pointer border border-[#112F59] flex items-center justify-center relative hover:border-[#01C8A9] transition-all"
              >
                {selectedBackground?.id === option.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-md">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="text-xs text-gray-400 mt-2">
            <p>Tip: Background images work best when they are subtle and don't distract from your signature content.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SignatureBackgroundPicker;
