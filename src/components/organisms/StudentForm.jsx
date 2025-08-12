import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { studentService } from "@/services/api/studentService";
import { classService } from "@/services/api/classService";

const StudentForm = ({ student = null, onSave, onCancel }) => {
const [formData, setFormData] = useState({
    first_name_c: "",
    last_name_c: "",
    grade_level_c: "",
    date_of_birth_c: "",
    email_c: "",
    phone_c: "",
    class_ids_c: [],
    gender_c: ""
  });
  
  const [validationErrors, setValidationErrors] = useState({});
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

useEffect(() => {
    loadClasses();
    if (student) {
      // Format date_of_birth_c for HTML date input (YYYY-MM-DD format)
      let formattedDateOfBirth = "";
      if (student.date_of_birth_c) {
        try {
          const date = new Date(student.date_of_birth_c);
          if (!isNaN(date.getTime())) {
            formattedDateOfBirth = date.toISOString().split('T')[0];
          }
        } catch (error) {
          console.error("Error formatting date:", error);
        }
      }

      setFormData({
        first_name_c: student.first_name_c || "",
        last_name_c: student.last_name_c || "",
        grade_level_c: student.grade_level_c || "",
        date_of_birth_c: formattedDateOfBirth,
        email_c: student.email_c || "",
        phone_c: student.phone_c || "",
        class_ids_c: Array.isArray(student.class_ids_c) ? student.class_ids_c : (student.class_ids_c ? student.class_ids_c.toString().split(',').map(id => parseInt(id)) : []),
        gender_c: student.gender_c || ""
      });
      setValidationErrors({});
    }
  }, [student]);

  const loadClasses = async () => {
    try {
      const classData = await classService.getAll();
      setClasses(classData);
    } catch (error) {
      console.error("Error loading classes:", error);
    }
  };

const validateForm = () => {
    const newErrors = {};
    
    if (!formData.first_name_c || !formData.first_name_c.trim()) {
      newErrors.first_name_c = "First name is required";
    }
    
    if (!formData.last_name_c || !formData.last_name_c.trim()) {
      newErrors.last_name_c = "Last name is required";
    }
    
    if (!formData.grade_level_c) {
      newErrors.grade_level_c = "Grade level is required";
    }
    
    if (!formData.date_of_birth_c) {
      newErrors.date_of_birth_c = "Date of birth is required";
    }
    
    if (formData.email_c && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_c)) {
      newErrors.email_c = "Valid email is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      if (student) {
        await studentService.update(student.Id, formData);
        toast.success("Student updated successfully!");
      } else {
        await studentService.create(formData);
        toast.success("Student added successfully!");
      }
      onSave();
    } catch (error) {
      toast.error(student ? "Failed to update student" : "Failed to add student");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const gradeOptions = [
    { value: "K", label: "Kindergarten" },
    { value: "1", label: "1st Grade" },
    { value: "2", label: "2nd Grade" },
    { value: "3", label: "3rd Grade" },
    { value: "4", label: "4th Grade" },
    { value: "5", label: "5th Grade" },
    { value: "6", label: "6th Grade" },
    { value: "7", label: "7th Grade" },
    { value: "8", label: "8th Grade" },
    { value: "9", label: "9th Grade" },
    { value: "10", label: "10th Grade" },
    { value: "11", label: "11th Grade" },
    { value: "12", label: "12th Grade" }
  ];

  return (
<form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="First Name"
          type="text"
          value={formData.first_name_c || ""}
          onChange={(e) => handleChange("first_name_c", e.target.value)}
          error={errors.first_name_c}
          required
        />

        <FormField
          label="Last Name"
          type="text"
          value={formData.last_name_c || ""}
          onChange={(e) => handleChange("last_name_c", e.target.value)}
          error={errors.last_name_c}
          required
        />

        <FormField
          label="Grade Level"
          type="select"
          value={formData.grade_level_c || ""}
          onChange={(e) => handleChange("grade_level_c", e.target.value)}
          options={gradeOptions}
          error={errors.grade_level_c}
          required
        />

        <FormField
          label="Date of Birth"
          type="date"
          value={formData.date_of_birth_c || ""}
          onChange={(e) => handleChange("date_of_birth_c", e.target.value)}
          error={errors.date_of_birth_c}
          required
        />

        <FormField
          label="Email"
          type="email"
          value={formData.email_c || ""}
          onChange={(e) => handleChange("email_c", e.target.value)}
          error={errors.email_c}
        />

        <FormField
          label="Phone"
          type="tel"
          value={formData.phone_c || ""}
          onChange={(e) => handleChange("phone_c", e.target.value)}
          error={errors.phone_c}
        />

        <FormField
          label="Gender"
          type="select"
          value={formData.gender_c || ""}
          onChange={(e) => handleChange("gender_c", e.target.value)}
          options={[
            { value: "", label: "Select Gender" },
            { value: "Male", label: "Male" },
            { value: "Female", label: "Female" },
            { value: "Other", label: "Other" },
            { value: "Prefer not to say", label: "Prefer not to say" }
          ]}
          error={errors.gender_c}
        />
      </div>

      <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <ApperIcon name="Save" className="w-4 h-4 mr-2" />
          )}
          {student ? "Update Student" : "Add Student"}
        </Button>
      </div>
    </form>
  );
};

export default StudentForm;