
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
        <span className="text-white text-xs uppercase">{label}</span>
        <span className="text-white text-xs">{percentage.toFixed(0)}%</span>
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

const SignatureUseCard: React.FC = () => {
  return (
    <div className="bg-[#031123] p-6 rounded-lg border border-[#112F59]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white text-xl font-semibold">Signature Use</h3>
        <div className="bg-[#031123] text-white text-xs px-3 py-1 rounded border border-[#112F59]">
          Week <span>▼</span>
        </div>
      </div>
      
      <div>
        <ProgressBar 
          label="Facebook" 
          value={85} 
          maxValue={100} 
          color="#216FFF" 
        />
        <ProgressBar 
          label="Twitter" 
          value={65} 
          maxValue={100} 
          color="#01C8A9" 
        />
        <ProgressBar 
          label="LinkedIn" 
          value={75} 
          maxValue={100} 
          color="#FFB800" 
        />
        <ProgressBar 
          label="Email" 
          value={95} 
          maxValue={100} 
          color="#FF5470" 
        />
      </div>
    </div>
  );
};

export default SignatureUseCard;
