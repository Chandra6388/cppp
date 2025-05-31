
import React from "react";

interface ProgressBarProps {
  label: string;
  value: number;
  maxValue: number;
  color: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ label, value, maxValue, color }) => {
  const percentage = (value / maxValue) * 100;
  
  return (
    <div className="mb-3">
      <div className="flex justify-between mb-1">
        <span className="text-white text-xs">{label}</span>
        <span className="text-white text-xs">{value}</span>
      </div>
      <div className="w-full bg-[#112F59] rounded-full h-2">
        <div
          className="h-2 rounded-full"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        ></div>
      </div>
    </div>
  );
};

const ButtonClickTrackingCard: React.FC = () => {
  return (
    <div className="bg-[#01C8A9] p-6 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span className="bg-white/20 p-1 rounded mr-2">📊</span>
          <span className="text-white font-semibold">BUTTON CLICK TRACKING</span>
        </div>
        <div className="bg-[#031123] text-white text-xs px-3 py-1 rounded">
          Week <span>▼</span>
        </div>
      </div>
      
      <div className="text-white text-4xl font-bold mb-4">54564</div>
      
      <div className="bg-[#031123] inline-block px-3 py-1 rounded text-xs text-[#01C8A9] mb-6">
        <span className="flex items-center">
          ↑ 12% <span className="text-gray-400 ml-1">vc yesterday</span>
        </span>
      </div>
      
      <div>
        <ProgressBar 
          label="APPLY HELLO" 
          value={850} 
          maxValue={1000} 
          color="#FF9500" 
        />
        <ProgressBar 
          label="SCHEDULE ZOOM CALL" 
          value={750} 
          maxValue={1000} 
          color="#FFD60A" 
        />
        <ProgressBar 
          label="DOWNLOAD PDF" 
          value={600} 
          maxValue={1000} 
          color="#FF7A00" 
        />
        <ProgressBar 
          label="VISIT WEBSITE" 
          value={700} 
          maxValue={1000} 
          color="#FF9500" 
        />
      </div>
    </div>
  );
};

export default ButtonClickTrackingCard;
