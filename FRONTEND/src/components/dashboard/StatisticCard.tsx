
import React from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

interface DataPoint {
  name: string;
  value: number;
}

interface StatisticCardProps {
  title: string;
  value: string | number;
  percentChange: number;
  icon?: React.ReactNode;
  chartData?: DataPoint[];
  chartColor?: string;
}

const StatisticCard: React.FC<StatisticCardProps> = ({
  title,
  value,
  percentChange,
  icon,
  chartData = [],
  chartColor = "#01C8A9",
}) => {
  const isPositive = percentChange >= 0;
  
  return (
    <div className="bg-[#031123] p-4 rounded-lg border border-[#112F59] overflow-hidden relative group hover:shadow-lg hover:shadow-[#01C8A9]/20 transition-all duration-300">
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-300"
        style={{ 
          backgroundImage: `linear-gradient(to right, ${chartColor}33, transparent)` 
        }}
      />

      <div className="flex flex-col relative z-10">
        <div className="flex items-center gap-2 text-gray-400 text-xs uppercase mb-2">
          {icon && (
            <motion.span
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {icon}
            </motion.span>
          )}
          <span>{title}</span>
        </div>
        
        <div className="flex items-end justify-between">
          <div>
            <motion.div 
              className="text-white text-3xl font-bold"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              {value}
            </motion.div>
            <motion.div 
              className={`flex items-center text-xs ${isPositive ? 'text-[#01C8A9]' : 'text-[#FF5470]'} mt-1`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <span className="flex items-center">
                {isPositive ? '↑' : '↓'} {Math.abs(percentChange)}%
                <span className="text-gray-400 ml-1">vc yesterday</span>
              </span>
            </motion.div>
          </div>
          
          {chartData.length > 0 && (
            <motion.div 
              className="h-16 w-24"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id={`colorGradient-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={chartColor} stopOpacity={0.8} />
                      <stop offset="100%" stopColor={chartColor} stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke={chartColor}
                    strokeWidth={2}
                    fill={`url(#colorGradient-${title.replace(/\s+/g, '')})`} 
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatisticCard;
