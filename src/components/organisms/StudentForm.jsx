import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { studentService } from "@/services/api/studentService";
import { classService } from "@/services/api/classService";

const StudentForm = ({ student = null, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gradeLevel: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    classIds: []
  });
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadClasses();
    if (student) {
      setFormData({
        firstName: student.firstName || "",
        lastName: student.lastName || "",
        gradeLevel: student.gradeLevel || "",
        dateOfBirth: student.dateOfBirth || "",
        email: student.email || "",
        phone: student.phone || "",
        classIds: student.classIds || []
      });
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
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    
    if (!formData.gradeLevel) {
      newErrors.gradeLevel = "Grade level is required";
    }
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Valid email is required";
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
          value={formData.firstName}
          onChange={(e) => handleChange("firstName", e.target.value)}
          error={errors.firstName}
          required
        />

        <FormField
          label="Last Name"
          type="text"
          value={formData.lastName}
          onChange={(e) => handleChange("lastName", e.target.value)}
          error={errors.lastName}
          required
        />

        <FormField
          label="Grade Level"
          type="select"
          value={formData.gradeLevel}
          onChange={(e) => handleChange("gradeLevel", e.target.value)}
          options={gradeOptions}
          error={errors.gradeLevel}
          required
        />

        <FormField
          label="Date of Birth"
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => handleChange("dateOfBirth", e.target.value)}
          error={errors.dateOfBirth}
          required
        />

        <FormField
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          error={errors.email}
        />

        <FormField
          label="Phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          error={errors.phone}
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