import { motion } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", icon: "LayoutDashboard", path: "/" },
    { label: "Students", icon: "Users", path: "/students" },
    { label: "Grades", icon: "BookOpen", path: "/grades" },
    { label: "Attendance", icon: "CheckSquare", path: "/attendance" },
    { label: "Classes", icon: "School", path: "/classes" },
  ];

  const NavItem = ({ item, mobile = false }) => (
    <NavLink
      to={item.path}
      onClick={mobile ? onClose : undefined}
      className={({ isActive }) => 
        cn(
          "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group",
          isActive 
            ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg" 
            : "text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-primary"
        )
      }
    >
      {({ isActive }) => (
        <>
          <ApperIcon 
            name={item.icon} 
            className={cn(
              "w-5 h-5 transition-all duration-200",
              isActive ? "text-white" : "text-gray-500 group-hover:text-primary"
            )}
          />
          <span className="font-medium">{item.label}</span>
          {isActive && (
            <motion.div
              className="ml-auto w-2 h-2 bg-white rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
            />
          )}
        </>
      )}
    </NavLink>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:bg-white lg:border-r lg:border-gray-200 lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col pt-6 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-6 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <ApperIcon name="GraduationCap" className="w-6 h-6 text-white" />
            </div>
            <h2 className="ml-3 text-xl font-bold font-display text-gray-900">ClassTrack</h2>
          </div>
          
          <nav className="flex-1 px-4 space-y-2">
            {menuItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </nav>

          <div className="px-4 mt-6">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center">
                <ApperIcon name="Sparkles" className="w-5 h-5 text-primary" />
                <span className="ml-2 text-sm font-medium text-gray-900">Pro Tip</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Use keyboard shortcuts to navigate faster through your classes.
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <motion.div
        className={cn(
          "lg:hidden fixed inset-0 z-50",
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        initial={false}
        animate={{ opacity: isOpen ? 1 : 0 }}
      >
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.aside
          className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-2xl"
          initial={{ x: "-100%" }}
          animate={{ x: isOpen ? 0 : "-100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="GraduationCap" className="w-5 h-5 text-white" />
              </div>
              <h2 className="ml-3 text-lg font-bold font-display text-gray-900">ClassTrack</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="X" className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => (
              <NavItem key={item.path} item={item} mobile />
            ))}
          </nav>
        </motion.aside>
      </motion.div>
    </>
  );
};

export default Sidebar;