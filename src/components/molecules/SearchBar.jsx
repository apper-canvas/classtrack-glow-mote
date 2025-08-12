import { useState } from "react";
import { motion } from "framer-motion";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";

const SearchBar = ({ onSearch, placeholder = "Search...", value = "" }) => {
  const [searchTerm, setSearchTerm] = useState(value);

  const handleSearch = (term) => {
    setSearchTerm(term);
    onSearch?.(term);
  };

  return (
    <motion.div 
      className="relative"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <ApperIcon name="Search" className="h-4 w-4 text-gray-400" />
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-10 pr-4 bg-gradient-to-r from-gray-50 to-white border-gray-200 focus:from-white focus:to-white"
      />
      {searchTerm && (
        <button
          onClick={() => handleSearch("")}
          className="absolute inset-y-0 right-0 pr-3 flex items-center hover:scale-110 transition-transform"
        >
          <ApperIcon name="X" className="h-4 w-4 text-gray-400 hover:text-gray-600" />
        </button>
      )}
    </motion.div>
  );
};

export default SearchBar;