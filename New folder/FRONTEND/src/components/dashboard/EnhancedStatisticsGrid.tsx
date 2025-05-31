import React from "react";
import { motion } from "framer-motion";
import EnhancedStatisticCard from "./EnhancedStatisticCard";

interface Stat {
  title: string;
  value: number | string;
  change?: number;
  isPositive?: boolean;
}

interface StatsData {
  day: Stat[];
}

interface EnhancedStatisticsGridProps {
  timePeriod?: "day";
  statsData: StatsData;
}

const EnhancedStatisticsGrid: React.FC<EnhancedStatisticsGridProps> = ({timePeriod = "week", statsData,}) => {
  const stats = statsData[timePeriod] || statsData?.day;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: index * 0.1,
            duration: 0.5,
            ease: "easeOut",
          }}
        >
          <EnhancedStatisticCard
            title={stat.title}
            value={stat.value}
            change={stat.change}
            isPositive={stat.isPositive}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default EnhancedStatisticsGrid;
