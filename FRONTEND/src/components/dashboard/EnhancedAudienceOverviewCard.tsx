import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface GraphArrMap {
  name: string;
  views: number;
  clicks: number;
}

interface TimeFilterOption {
  label: string;
  value: string;
}

interface EnhancedAudienceOverviewCardProps {
  title: string;
  subtitle?: string;
  timeFilterOptions: TimeFilterOption[];
  selectedTimeFilter: string;
  onTimeFilterChange: (value: string) => void;
  onApplyDateRange?: (startDate: Date | null, endDate: Date | null) => void;
  audienceViewAndClickDraphData: GraphArrMap[];
}

const EnhancedAudienceOverviewCard: React.FC<EnhancedAudienceOverviewCardProps> = ({
  title,
  subtitle,
  timeFilterOptions,
  selectedTimeFilter,
  onTimeFilterChange,
  onApplyDateRange = () => {},
  audienceViewAndClickDraphData,
}) => {
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: any[];
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#031123] border border-[#112F59] p-3 rounded shadow-lg">
          <p className="text-white font-medium">{label}</p>
          <div className="space-y-1 mt-1">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <p className="text-xs text-gray-300">
                  {`${entry.name}: ${entry.value}`}
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#031123] border border-[#112F59] rounded-lg p-4">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-white text-lg font-medium">{title}</h3>
        {subtitle && <p className="text-gray-400 text-sm">{subtitle}</p>}
       
      </div>

      {/* Legends */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#01C8A9]" />
          <span className="text-xs text-gray-400">Views</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#3B82F6]" />
          <span className="text-xs text-gray-400">Clicks</span>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={audienceViewAndClickDraphData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#112F59"
              vertical={false}
            />
            <XAxis dataKey="name" tick={{ fill: "#8793A3" }} />
            <YAxis tick={{ fill: "#8793A3" }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="views"
              name="Views"
              fill="#01C8A9"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="clicks"
              name="Clicks"
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Totals */}
      <div className="mt-4 pt-4 border-t border-[#112F59]">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400 block">Total Views</span>
            <span className="text-white font-medium text-lg">
              {audienceViewAndClickDraphData?.reduce(
                (sum, item) => sum + item.views,
                0
              )}
            </span>
          </div>
          <div>
            <span className="text-gray-400 block">Total Clicks</span>
            <span className="text-white font-medium text-lg">
              {audienceViewAndClickDraphData?.reduce(
                (sum, item) => sum + item.clicks,
                0
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAudienceOverviewCard;
