
import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import {EnhancedSignatureUseCardProps } from '../../../Utils/AdminIntrface'
 
const EnhancedSignatureUseCard: React.FC<EnhancedSignatureUseCardProps> = ({ title, subtitle, timeFilterOptions, selectedTimeFilter, onTimeFilterChange, onApplyDateRange = () => { }, signatureSendHistoryGraphData }) => {
 

  const CustomTooltip = ({ active, payload, label }: any) => {
 
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#031123] border border-[#112F59] p-3 rounded shadow-lg">
          <p className="text-white font-medium">{`${label}`}</p>
          <p className="text-[#01C8A9] text-sm">{`${payload[0].value} created`}</p>
        </div>
      );
    }
    return null;
  };



  return (
    <div className="bg-[#031123] border border-[#112F59] rounded-lg p-4">
   

      <div className="mb-4">
        <h3 className="text-white text-lg font-medium">{title}</h3>
        <p className="text-gray-400 text-sm">
          {subtitle}
        </p>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={signatureSendHistoryGraphData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#01C8A9" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#01C8A9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#112F59" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: "#8793A3" }} />
            <YAxis tick={{ fill: "#8793A3" }} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="usage"
              stroke="#01C8A9"
              fillOpacity={1}
              fill="url(#colorUsage)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 pt-4 border-t border-[#112F59] grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <span className="text-gray-400 text-xs">Average Created</span>
          <div className="text-white font-medium">
            {Math.round(signatureSendHistoryGraphData?.reduce((sum, item) => sum + item?.usage, 0) / signatureSendHistoryGraphData?.length)}
            {/* <span className="text-xs text-gray-400 ml-1">per {timePeriod === "day" ? "hour" : timePeriod === "week" ? "day" : "week"}</span> */}
          </div>
        </div>
        <div>
          <span className="text-gray-400 text-xs">Total Create</span>
          <div className="text-white font-medium">
            {signatureSendHistoryGraphData?.reduce((sum, item) => sum + item.usage, 0)}
          </div>
        </div>
        <div>
          <span className="text-gray-400 text-xs">Peak Create</span>
          <div className="text-white font-medium">
            {Math?.max(...signatureSendHistoryGraphData?.map(item => item?.usage))}
            <span className="text-xs text-gray-400 ml-1">({signatureSendHistoryGraphData?.find(item => item.usage === Math.max(...signatureSendHistoryGraphData?.map(i => i.usage)))?.name})</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSignatureUseCard;
