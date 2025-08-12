import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({ 
  className, 
  variant = "default", 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800",
    success: "bg-gradient-to-r from-success/10 to-green-100 text-success border border-success/20",
    warning: "bg-gradient-to-r from-warning/10 to-amber-100 text-warning border border-warning/20",
    error: "bg-gradient-to-r from-error/10 to-red-100 text-error border border-error/20",
    info: "bg-gradient-to-r from-info/10 to-blue-100 text-info border border-info/20",
    present: "bg-gradient-to-r from-success/10 to-green-100 text-success border border-success/20",
    absent: "bg-gradient-to-r from-error/10 to-red-100 text-error border border-error/20",
    late: "bg-gradient-to-r from-warning/10 to-amber-100 text-warning border border-warning/20"
  };

  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});

Badge.displayName = "Badge";

export default Badge;