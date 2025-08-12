import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import DataTable from "@/components/molecules/DataTable";
import Modal from "@/components/molecules/Modal";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { classService } from "@/services/api/classService";
import { studentService } from "@/services/api/studentService";

const ClassManager = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    room: "",
    schedule: "",
    studentIds: []
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [classData, studentData] = await Promise.all([
        classService.getAll(),
        studentService.getAll()
      ]);
      
      setClasses(classData);
      setStudents(studentData);
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingClass(null);
    setFormData({
      name: "",
      subject: "",
      room: "",
      schedule: "",
      studentIds: []
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleEdit = (classItem) => {
    setEditingClass(classItem);
    setFormData({
      name: classItem.name || "",
      subject: classItem.subject || "",
      room: classItem.room || "",
      schedule: classItem.schedule || "",
      studentIds: classItem.studentIds || []
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleDelete = async (classItem) => {
    if (!confirm(`Are you sure you want to delete "${classItem.name}"?`)) {
      return;
    }

    try {
      await classService.delete(classItem.Id);
      setClasses(prev => prev.filter(c => c.Id !== classItem.Id));
      toast.success("Class deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete class");
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = "Class name is required";
    }
    
    if (!formData.subject.trim()) {
      errors.subject = "Subject is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (editingClass) {
        await classService.update(editingClass.Id, formData);
        setClasses(prev => prev.map(c => 
          c.Id === editingClass.Id ? { ...c, ...formData } : c
        ));
        toast.success("Class updated successfully!");
      } else {
        const newClass = await classService.create(formData);
        setClasses(prev => [...prev, newClass]);
        toast.success("Class created successfully!");
      }
      setShowModal(false);
    } catch (err) {
      toast.error(editingClass ? "Failed to update class" : "Failed to create class");
    }
  };

  const getStudentCount = (classItem) => {
    return classItem.studentIds ? classItem.studentIds.length : 0;
  };

  const columns = [
    { key: "name", label: "Class Name" },
    { key: "subject", label: "Subject" },
    { key: "room", label: "Room" },
    { key: "schedule", label: "Schedule" },
    { 
      key: "studentCount", 
      label: "Students",
      render: (value, row) => getStudentCount(row)
    }
  ];

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Class Management</h1>
          <p className="text-gray-600 mt-1">Organize and manage your classes</p>
        </div>
        <Button onClick={handleAdd}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Class
        </Button>
      </div>

      {classes.length === 0 ? (
        <Empty 
          title="No Classes Found"
          description="Create your first class to get started with student management"
          actionLabel="Add Class"
          onAction={handleAdd}
          icon="School"
        />
      ) : (
        <DataTable
          data={classes}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingClass ? "Edit Class" : "Add New Class"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Class Name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              error={formErrors.name}
              placeholder="e.g., Math 101"
              required
            />

            <FormField
              label="Subject"
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              error={formErrors.subject}
              placeholder="e.g., Mathematics"
              required
            />

            <FormField
              label="Room"
              type="text"
              value={formData.room}
              onChange={(e) => setFormData(prev => ({ ...prev, room: e.target.value }))}
              error={formErrors.room}
              placeholder="e.g., Room 203"
            />

            <FormField
              label="Schedule"
              type="text"
              value={formData.schedule}
              onChange={(e) => setFormData(prev => ({ ...prev, schedule: e.target.value }))}
              error={formErrors.schedule}
              placeholder="e.g., MWF 9:00-10:00 AM"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit">
              <ApperIcon name="Save" className="w-4 h-4 mr-2" />
              {editingClass ? "Update Class" : "Create Class"}
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default ClassManager;