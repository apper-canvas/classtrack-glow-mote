import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ 
  className, 
  variant = "primary", 
  size = "default", 
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white hover:scale-105 hover:shadow-lg focus:ring-primary/50 active:scale-95",
    secondary: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 hover:scale-105 focus:ring-gray-300",
    outline: "border-2 border-primary text-primary bg-white hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white hover:scale-105 focus:ring-primary/50",
    ghost: "text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900",
    danger: "bg-gradient-to-r from-error to-red-600 text-white hover:scale-105 hover:shadow-lg focus:ring-error/50 active:scale-95"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    default: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;