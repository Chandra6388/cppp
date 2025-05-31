
import React, { useState } from "react";
import { 
  Area, 
  AreaChart, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const AudienceOverviewCard: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState("week");

  // Sample data for the chart
  const data = [
    { name: "Mon", signatureView: 4800, buttonClicks: 2200, socialClicks: 1100 },
    { name: "Tue", signatureView: 4200, buttonClicks: 2100, socialClicks: 1300 },
    { name: "Wed", signatureView: 4500, buttonClicks: 2600, socialClicks: 2400 },
    { name: "Thu", signatureView: 4800, buttonClicks: 2800, socialClicks: 1900 },
    { name: "Fri", signatureView: 4300, buttonClicks: 2300, socialClicks: 1400 },
    { name: "Sat", signatureView: 3900, buttonClicks: 1800, socialClicks: 1000 },
    { name: "Sun", signatureView: 4100, buttonClicks: 2400, socialClicks: 1800 },
  ];

  // Chart configuration
  const chartConfig = {
    signatureView: { color: "#01C8A9" },
    buttonClicks: { color: "#216FFF" },
    socialClicks: { color: "#FF7A00" },
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#031123] p-3 rounded shadow-lg border border-[#112F59] text-white">
          <div className="text-sm font-semibold mb-1">{label.toUpperCase()}, 4:50 PM</div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-[#01C8A9]">Views</span>
            <span>${payload[0].value}</span>
          </div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-[#216FFF]">Clicks</span>
            <span>${payload[1].value}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#FF7A00]">Leads</span>
            <span>${payload[2].value}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#031123] p-6 rounded-lg border border-[#112F59]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-xl font-semibold">Audience Overview</h3>
        <div className="bg-[#031123] text-white text-xs px-3 py-1 rounded border border-[#112F59] cursor-pointer">
          Week <span>▼</span>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex gap-4 mb-2">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[#01C8A9] mr-2"></div>
            <span className="text-white text-xs">Signature View</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[#216FFF] mr-2"></div>
            <span className="text-white text-xs">Button Clicks</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[#FF7A00] mr-2"></div>
            <span className="text-white text-xs">Social Clicks</span>
          </div>
        </div>
      </div>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorSignatureView" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#01C8A9" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#01C8A9" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorButtonClicks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#216FFF" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#216FFF" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorSocialClicks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF7A00" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#FF7A00" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="name" 
              stroke="#8B8B8B" 
              tick={{ fill: '#8B8B8B' }}
              axisLine={{ stroke: '#112F59' }} 
            />
            <YAxis 
              stroke="#8B8B8B" 
              tick={{ fill: '#8B8B8B' }}
              axisLine={{ stroke: '#112F59' }} 
              tickFormatter={(value) => `${value}`}
            />
            <CartesianGrid 
              vertical={false}
              horizontal={true} 
              stroke="#112F59" 
              strokeDasharray="3 3" 
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="signatureView" 
              stackId="1"
              stroke="#01C8A9" 
              fillOpacity={1}
              fill="url(#colorSignatureView)" 
            />
            <Area 
              type="monotone" 
              dataKey="buttonClicks" 
              stackId="2"
              stroke="#216FFF" 
              fillOpacity={1}
              fill="url(#colorButtonClicks)" 
            />
            <Area 
              type="monotone" 
              dataKey="socialClicks" 
              stackId="3"
              stroke="#FF7A00" 
              fillOpacity={1}
              fill="url(#colorSocialClicks)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AudienceOverviewCard;
