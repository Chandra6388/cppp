
import React from "react";
import { motion } from "framer-motion";
import StatisticCard from "./StatisticCard";

const StatisticsGrid: React.FC = () => {
  // Generate realistic chart data for each statistic
  const generateChartData = (points: number, trend: "up" | "down" | "volatile", baseline: number = 100) => {
    const data = [];
    let currentValue = baseline;
    
    for (let i = 0; i < points; i++) {
      if (trend === "up") {
        currentValue += Math.random() * 20;
      } else if (trend === "down") {
        currentValue -= Math.random() * 15;
        currentValue = Math.max(currentValue, baseline / 2); // Don't go below half the baseline
      } else {
        // Volatile - can go up or down
        currentValue += (Math.random() - 0.5) * 30;
        currentValue = Math.max(currentValue, baseline / 2); // Keep it reasonable
      }
      
      data.push({
        name: `Day ${i + 1}`,
        value: currentValue
      });
    }
    
    return data;
  };

  const statistics = [
    {
      title: "TOTAL CREATED",
      value: "22",
      percentChange: 12,
      icon: "📊",
      chartData: generateChartData(12, "up", 10),
      chartColor: "#01C8A9"
    },
    {
      title: "TOTAL CLICKS",
      value: "78785",
      percentChange: 4,
      icon: "📈",
      chartData: generateChartData(12, "volatile", 60000),
      chartColor: "#216FFF"
    },
    {
      title: "TOTAL SOCIAL CLICKS",
      value: "156445",
      percentChange: 12,
      icon: "📱",
      chartData: generateChartData(12, "up", 120000),
      chartColor: "#FFB800"
    },
    {
      title: "TOTAL ACTION BUTTON CLICKS",
      value: "65416",
      percentChange: 12,
      icon: "🔘",
      chartData: generateChartData(12, "up", 50000),
      chartColor: "#FF5470"
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {statistics.map((stat, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: { 
                type: "spring", 
                stiffness: 100,
                damping: 12 
              }
            }
          }}
          whileHover={{ 
            scale: 1.03, 
            boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
            transition: { duration: 0.2 }
          }}
        >
          <StatisticCard
            title={stat.title}
            value={stat.value}
            percentChange={stat.percentChange}
            icon={stat.icon}
            chartData={stat.chartData}
            chartColor={stat.chartColor}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StatisticsGrid;
