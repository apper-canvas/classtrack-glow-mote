import { motion } from "framer-motion";

const Loading = ({ type = "page", rows = 5 }) => {
  if (type === "table") {
    return (
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <motion.div
            key={index}
            className="flex items-center space-x-4 p-4 bg-white rounded-xl border border-gray-100"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse" />
              <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse w-3/4" />
            </div>
            <div className="w-20 h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full animate-pulse" />
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-xl border border-gray-100 p-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl animate-pulse" />
                <div className="w-6 h-6 bg-gradient-to-br from-gray-200 to-gray-300 rounded animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse" />
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse w-2/3" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <motion.div
        className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <motion.p
        className="mt-4 text-gray-600 font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Loading...
      </motion.p>
    </div>
  );
};

export default Loading;