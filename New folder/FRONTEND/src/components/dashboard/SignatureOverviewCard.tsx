
import React from "react";

interface SignatureData {
  title: string;
  percentage: number;
  clicks: number;
  times: number;
  color: string;
}

const SignatureOverviewCard: React.FC = () => {
  const data: SignatureData[] = [
    { title: "Business Pro", percentage: 35, clicks: 3459, times: 5669, color: "#01C8A9" },
    { title: "Real Estate Expert", percentage: 25, clicks: 1348, times: 2820, color: "#216FFF" },
    { title: "Legal Consultant", percentage: 18, clicks: 879, times: 2280, color: "#FFB800" },
    { title: "Marketing Guru", percentage: 15, clicks: 622, times: 1348, color: "#FF7A00" },
    { title: "Freelance Designer", percentage: 7, clicks: 348, times: 1224, color: "#FF5470" }
  ];

  return (
    <div className="bg-[#031123] p-6 rounded-lg border border-[#112F59]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white text-xl font-semibold">Signature Overview</h3>
        <div className="bg-[#031123] text-white text-xs px-3 py-1 rounded border border-[#112F59]">
          Week <span>▼</span>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Chart */}
        <div className="relative flex-1 flex items-center justify-center">
          <div className="relative w-48 h-48">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="text-3xl font-bold">8,900</div>
              </div>
            </div>
            {/* This would be a donut chart in a real implementation */}
            <div className="w-full h-full rounded-full border-8 border-[#01C8A9]" style={{borderRightColor: '#216FFF', borderBottomColor: '#FFB800', borderLeftColor: '#FF5470'}}></div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex-1">
          {data.map((item, index) => (
            <div key={index} className="flex items-start mb-3">
              <div className={`w-3 h-3 mt-1 rounded-full`} style={{backgroundColor: item.color}}></div>
              <div className="ml-2 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">{item.title} ({item.percentage}%)</span>
                  <span className="text-white text-sm font-semibold">{item.clicks}</span>
                </div>
                <div className="text-gray-400 text-xs">CLICKED {item.times} TIMES</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SignatureOverviewCard;
