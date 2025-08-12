import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No data found", 
  description = "Get started by adding your first item", 
  actionLabel = "Add Item",
  onAction,
  icon = "Database"
}) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="w-20 h-20 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full flex items-center justify-center mb-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
      >
        <ApperIcon name={icon} className="w-10 h-10 text-gray-400" />
      </motion.div>
      
      <motion.h3
        className="text-xl font-semibold text-gray-900 mb-2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {title}
      </motion.h3>
      
      <motion.p
        className="text-gray-600 text-center max-w-md mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {description}
      </motion.p>
      
      {onAction && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button onClick={onAction} variant="primary">
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Empty;