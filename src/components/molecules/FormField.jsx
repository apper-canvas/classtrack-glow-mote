import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  error, 
  type = "text", 
  options = [], 
  className,
  ...props 
}) => {
  const renderInput = () => {
    if (type === "select") {
      return (
        <Select {...props}>
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      );
    }
    
    return <Input type={type} {...props} />;
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label className="block text-sm font-medium text-gray-700">
          {label}
        </Label>
      )}
      {renderInput()}
      {error && (
        <p className="text-sm text-error font-medium">{error}</p>
      )}
    </div>
  );
};

export default FormField;