
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from "recharts";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
 

interface GraphArrMap {
  name: string;
  leave_review: number;
  contact_us: number;
  join_meeting: number;
  visit_website: number;
  book_meeting: number;
}

interface TimeFilterOption {
  label: string;
  value: string;
}
 

interface EnhancedButtonClickTrackingCardProps {
  title: string;
  subtitle?: string;
  timeFilterOptions: TimeFilterOption[];
  selectedTimeFilter: string;
  onTimeFilterChange: (value: string) => void;
  onApplyDateRange?: (startDate: Date | null, endDate: Date | null) => void;
  GraphData: GraphArrMap[];
}

const EnhancedButtonClickTrackingCard: React.FC<EnhancedButtonClickTrackingCardProps> = ({ title, subtitle, timeFilterOptions, selectedTimeFilter, onTimeFilterChange, onApplyDateRange = () => { }, GraphData }) => {

  const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#031123] border border-[#112F59] p-3 rounded shadow-lg">
          <p className="text-white font-medium">{`${label}`}</p>
          <div className="space-y-1 mt-1">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <p className="text-xs text-gray-300">
                  {`${entry.name == "contact_us" ? "Contact Us" : entry.name == "join_meeting" ? "Join Meeting" : entry.name == "visit_website" ? "Visit Website" : entry.name == "book_meeting" ? "Book Meeting" : entry.name == "leave_review" ? "Leave Review" : entry.name}: ${entry.value}`}
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
    <div className="bg-[#031123] border border-[#112F59] rounded-lg p-4 overflow-hidden">
      <div className="mb-4">
        <h3 className="text-white text-lg font-medium">{title}</h3>
        <p className="text-gray-400 text-sm">{subtitle}</p>
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#01C8A9]" />
          <span className="text-xs text-gray-400">Contact Us</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#3B82F6]" />
          <span className="text-xs text-gray-400">Join Meeting</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
          <span className="text-xs text-gray-400">Visit Website</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ce42f5]" />
          <span className="text-xs text-gray-400">Book Meeting</span>
        </div><div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
          <span className="text-xs text-gray-400">Leave Review</span>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={GraphData}
            margin={{ top: 0, right: 10, left: -25, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#112F59" />
            <XAxis dataKey="name" tick={{ fill: "#8793A3" }} />
            <YAxis tick={{ fill: "#8793A3" }} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="contact_us"
              stroke="#01C8A9"  // Teal
              activeDot={{ r: 6 }}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="join_meeting"
              stroke="#3B82F6"  // Blue
              activeDot={{ r: 6 }}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="visit_website"
              stroke="#F59E0B"  // Amber
              activeDot={{ r: 6 }}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="book_meeting"
              stroke="#ce42f5"  // Purple
              activeDot={{ r: 6 }}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="leave_review"
              stroke="#EF4444"  // Red
              activeDot={{ r: 6 }}
              strokeWidth={2}
            />

          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EnhancedButtonClickTrackingCard;
