
import React from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

interface DataPoint {
  name: string;
  value: number;
}

export interface EnhancedStatisticCardProps {
  title: string;
  value: string | number;
  change: number;
  isPositive: boolean;
  icon?: React.ReactNode;
  chartData?: DataPoint[];
  chartColor?: string;
  bgColor?: string;
}

const EnhancedStatisticCard: React.FC<EnhancedStatisticCardProps> = ({
  title,
  value,
  change,
  isPositive,
  icon,
  chartData = [],
  chartColor = "#01C8A9",
  bgColor = "from-[#031123] to-[#071a36]",
}) => {
  // Get a slightly darker version of the chart color for the gradient
  const getColorWithOpacity = (color: string, opacity: string) => {
    if (color.startsWith('#')) {
      return `${color}${opacity}`;
    }
    return color;
  };

  const uniqueId = `gradient-${title.replace(/\s+/g, '')}-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <motion.div 
      whileHover={{ translateY: -5 }}
      transition={{ duration: 0.3 }}
      className={`bg-gradient-to-br ${bgColor} p-5 rounded-2xl border border-[#112F59]/50 overflow-hidden relative group transition-all duration-300 shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/20 backdrop-blur-sm`}
    >
      {/* Background gradient effect */}
      <div 
        className="absolute inset-0 bg-gradient-to-r opacity-10 group-hover:opacity-20 transition-opacity duration-300"
        style={{ 
          backgroundImage: `linear-gradient(to right, ${chartColor}33, transparent)` 
        }}
      />
      
      {/* Subtle animated light effect */}
      <motion.div 
        className="absolute -right-20 -top-20 w-40 h-40 rounded-full opacity-20 blur-xl"
        style={{ backgroundColor: chartColor }}
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ 
          repeat: Infinity,
          duration: 4,
          ease: "easeInOut"
        }}
      />

      <div className="flex flex-col relative z-10">
        <div className="flex items-center gap-2 text-gray-400 text-xs uppercase mb-2">
          {icon && (
            <motion.div
              className="bg-white/10 p-1.5 rounded-md"
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {icon}
            </motion.div>
          )}
          <span className="font-medium tracking-wider">{title}</span>
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
              className={`flex items-center text-xs mt-1 ${isPositive ? 'text-[#01C8A9]' : 'text-[#FF5470]'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <span className="flex items-center">
                {isPositive ? (
                  <ArrowUpIcon className="w-3 h-3 mr-1" />
                ) : (
                  <ArrowDownIcon className="w-3 h-3 mr-1" />
                )}
                {Math.abs(change)}%
                {/* <span className="text-gray-400 ml-1">vs yesterday</span> */}
              </span>
            </motion.div>
          </div>
          
          {chartData.length > 0 && (
            <motion.div 
              className="h-16 w-24 rounded-md overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id={uniqueId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={chartColor} stopOpacity={0.8} />
                      <stop offset="100%" stopColor={chartColor} stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke={chartColor}
                    strokeWidth={2}
                    fill={`url(#${uniqueId})`} 
                    dot={false}
                    activeDot={{ r: 5, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Subtle bottom line accent */}
      <div 
        className="absolute bottom-0 left-0 h-1 rounded-full transition-all duration-300 opacity-70"
        style={{ 
          backgroundColor: chartColor,
          width: '30%', 
        }}
      />
    </motion.div>
  );
};

export default EnhancedStatisticCard;
