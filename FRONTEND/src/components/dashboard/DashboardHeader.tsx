import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface TimeFilterOption {
  label: string;
  value: string;
}

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  timeFilterOptions: TimeFilterOption[];
  selectedTimeFilter: string;
  onTimeFilterChange: (value: string) => void;
  selectedYear?: string;
  onYearChange?: (value: string) => void;
  onApplyDateRange?: (startDate: Date | null, endDate: Date | null) => void;
}

const DashboardHeader = ({
  title,
  subtitle,
  timeFilterOptions,
  selectedTimeFilter,
  onTimeFilterChange,
  selectedYear = "",
  onYearChange = () => {},
  onApplyDateRange = () => {},
}: DashboardHeaderProps) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const handleApply = () => {
    onApplyDateRange(startDate, endDate);
    setShowPicker(false);
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-6 border-b border-[#112F59] w-full">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-white">{title}</h1>
        {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
        {/* Custom Tabs */}
        <div className="w-full overflow-x-auto">
          <div className="flex flex-nowrap gap-2 w-full max-w-full">
            {timeFilterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onTimeFilterChange(option.value)}
                className={`shrink-0 px-3 py-1 rounded text-xs sm:text-sm border ${
                  selectedTimeFilter === option.value
                    ? "bg-[#01C8A9] text-white border-transparent"
                    : "bg-[#051b37] text-white border-[#112F59]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date Range Button */}
        <div className="relative inline-block text-left w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEndDate(null);
              setStartDate(null);
              onTimeFilterChange("custom");
              setShowPicker(!showPicker);
            }}
            className="ml-auto sm:ml-0 bg-[#051b37] border-[#112F59] text-white hover:bg-[#071f3d] w-full sm:w-auto"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Custom Range
          </Button>

          {showPicker && (
            <div className="absolute right-0 mt-2 z-50 p-4 bg-white rounded-xl shadow-lg w-[90vw] max-w-xs sm:w-80">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date: Date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  dateFormat="MMMM d, yyyy"
                  className="w-full p-2 border rounded"
                  placeholderText="Select start date"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                <DatePicker
                  selected={endDate}
                  onChange={(date: Date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  dateFormat="MMMM d, yyyy"
                  className="w-full p-2 border rounded"
                  placeholderText="Select end date"
                />
              </div>

              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleApply}
                  className="w-full bg-[#051b37] border-[#112F59] text-white hover:bg-[#071f3d]"
                >
                  Apply
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
