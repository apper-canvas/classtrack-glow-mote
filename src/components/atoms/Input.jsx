import React from "react";
import { cn } from "@/utils/cn";

const Input = React.forwardRef(({ 
  className, 
  type = "text", 
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;