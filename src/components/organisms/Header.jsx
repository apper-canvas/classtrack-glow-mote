import { motion } from "framer-motion";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ onMenuToggle, onSearch, searchValue, title = "ClassTrack" }) => {
  return (
    <motion.header
      className="bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-sm bg-white/95"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" className="w-5 h-5" />
          </Button>
          
          <h1 className="text-2xl font-bold font-display bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {title}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:block w-80">
            <SearchBar
              placeholder="Search students, classes..."
              onSearch={onSearch}
              value={searchValue}
            />
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="relative hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
          >
            <ApperIcon name="Bell" className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-error to-red-600 rounded-full" />
          </Button>
          
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <ApperIcon name="User" className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-6 pb-4">
        <SearchBar
          placeholder="Search students, classes..."
          onSearch={onSearch}
          value={searchValue}
        />
      </div>
    </motion.header>
  );
};

export default Header;