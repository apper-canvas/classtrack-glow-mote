import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = "default",
  hideCloseButton = false 
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const sizes = {
    sm: "max-w-md",
    default: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl"
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          <motion.div
            className={`relative w-full ${sizes[size]} bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-[90vh] overflow-hidden`}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {title && (
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                {!hideCloseButton && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200"
                  >
                    <ApperIcon name="X" className="w-5 h-5" />
                  </Button>
                )}
              </div>
            )}
            
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;