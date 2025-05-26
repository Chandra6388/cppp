
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface GraphArrMap {
  name: string;
  value:number
}
interface TimeFilterOption {
  label: string;
  value: string;
}

interface EnhancedSignatureOverviewCardProps {
  title: string;
  subtitle?: string;
  timeFilterOptions: TimeFilterOption[];
  selectedTimeFilter: string;
  onTimeFilterChange: (value: string) => void;
  onApplyDateRange?: (startDate: Date | null, endDate: Date | null) => void;
  operatingSystem:  GraphArrMap[];
}



const EnhancedSignatureOverviewCard: React.FC<EnhancedSignatureOverviewCardProps> = ({ title, subtitle, timeFilterOptions, selectedTimeFilter, onTimeFilterChange, onApplyDateRange = () => { }, operatingSystem }) => {
 
console.log("operatingSystem",operatingSystem)
  const colors = ["#01C8A9", "#3B82F6", "#F59E0B", "#8B5CF6"];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#031123] border border-[#112F59] p-3 rounded shadow-lg">
          <p className="text-white font-medium">{`${payload[0].name}`}</p>
          <p className="text-[#01C8A9] text-sm">{`${payload[0].value} signatures (${((payload[0].value / operatingSystem.reduce((a, b) => a + b.value, 0)) * 100).toFixed(1)}%)`}</p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <ul className="flex flex-wrap gap-x-4 gap-y-2 mt-4 justify-center">
        {payload.map((entry: any, index: number) => (
          <li key={`item-${index}`} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-gray-400">{entry.value}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="bg-[#031123] border border-[#112F59] rounded-lg p-4">
      <div className="mb-4">
        <h3 className="text-white text-lg font-medium">{title}</h3>
        <p className="text-gray-400 text-sm">{subtitle}</p>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={operatingSystem}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              innerRadius={40}
              fill="#8884d8"
              dataKey="value"
            >
              {operatingSystem?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-4 border-t border-[#112F59]">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Total Signatures</span>
          <span className="text-white font-medium">
            {operatingSystem?.reduce((sum, item) => sum + item.value, 0)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSignatureOverviewCard;
