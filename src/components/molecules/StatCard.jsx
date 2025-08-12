import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ title, value, change, icon, trend = "up", delay = 0 }) => {
  const trendColor = trend === "up" ? "text-success" : trend === "down" ? "text-error" : "text-gray-500";
  const bgGradient = trend === "up" ? "from-success/5 to-green-50" : trend === "down" ? "from-error/5 to-red-50" : "from-gray-50 to-gray-100";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} opacity-30 group-hover:opacity-40 transition-opacity`} />
        <CardContent className="p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {value}
              </p>
              {change && (
                <p className={`text-sm font-medium ${trendColor} flex items-center mt-2`}>
                  <ApperIcon 
                    name={trend === "up" ? "TrendingUp" : trend === "down" ? "TrendingDown" : "Minus"} 
                    className="w-4 h-4 mr-1" 
                  />
                  {change}
                </p>
              )}
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <ApperIcon name={icon} className="w-6 h-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatCard;