import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="w-16 h-16 bg-gradient-to-br from-error/10 to-error/20 rounded-full flex items-center justify-center mb-4"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
      >
        <ApperIcon name="AlertTriangle" className="w-8 h-8 text-error" />
      </motion.div>
      
      <motion.h3
        className="text-xl font-semibold text-gray-900 mb-2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Oops! Something went wrong
      </motion.h3>
      
      <motion.p
        className="text-gray-600 text-center max-w-md mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {message}
      </motion.p>
      
      {onRetry && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button onClick={onRetry} variant="primary">
            <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Error;