import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import SearchBar from "@/components/molecules/SearchBar";
import DataTable from "@/components/molecules/DataTable";
import Modal from "@/components/molecules/Modal";
import StudentForm from "@/components/organisms/StudentForm";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { studentService } from "@/services/api/studentService";

const Students = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm]);

  const loadStudents = async () => {
    setLoading(true);
    setError("");
    
    try {
      const data = await studentService.getAll();
      setStudents(data);
    } catch (err) {
      setError("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    if (!searchTerm.trim()) {
      setFilteredStudents(students);
      return;
    }

    const filtered = students.filter(student => 
      `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.gradeLevel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    setFilteredStudents(filtered);
  };

  const handleAdd = () => {
    setEditingStudent(null);
    setShowModal(true);
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setShowModal(true);
  };

  const handleView = (student) => {
    navigate(`/students/${student.Id}`);
  };

  const handleDelete = async (student) => {
    if (!confirm(`Are you sure you want to delete ${student.firstName} ${student.lastName}?`)) {
      return;
    }

    try {
      await studentService.delete(student.Id);
      setStudents(prev => prev.filter(s => s.Id !== student.Id));
      toast.success("Student deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete student");
    }
  };

  const handleSave = () => {
    loadStudents();
    setShowModal(false);
  };

  const columns = [
    { 
      key: "name", 
      label: "Name",
      render: (value, student) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-secondary/20 rounded-full flex items-center justify-center">
            <ApperIcon name="User" className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="font-medium text-gray-900">
              {student.firstName} {student.lastName}
            </div>
            <div className="text-sm text-gray-500">{student.email}</div>
          </div>
        </div>
      )
    },
    { 
      key: "gradeLevel", 
      label: "Grade",
      render: (value) => (
        <Badge variant="info">Grade {value}</Badge>
      )
    },
    { 
      key: "phone", 
      label: "Phone",
      render: (value) => value || "N/A"
    },
    { 
      key: "classCount", 
      label: "Classes",
      render: (value, student) => student.classIds ? student.classIds.length : 0
    }
  ];

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadStudents} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600 mt-1">Manage your student roster</p>
        </div>
        <Button onClick={handleAdd}>
          <ApperIcon name="UserPlus" className="w-4 h-4 mr-2" />
          Add Student
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchBar
          placeholder="Search students..."
          onSearch={setSearchTerm}
          value={searchTerm}
        />
        <div className="text-sm text-gray-600">
          {filteredStudents.length} of {students.length} students
        </div>
      </div>

      {students.length === 0 ? (
        <Empty 
          title="No Students Found"
          description="Add your first student to get started with class management"
          actionLabel="Add Student"
          onAction={handleAdd}
          icon="Users"
        />
      ) : filteredStudents.length === 0 ? (
        <Empty 
          title="No Students Match Your Search"
          description="Try adjusting your search terms to find students"
          icon="Search"
        />
      ) : (
        <DataTable
          data={filteredStudents}
          columns={columns}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
        />
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingStudent ? "Edit Student" : "Add New Student"}
        size="lg"
      >
        <StudentForm
          student={editingStudent}
          onSave={handleSave}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </motion.div>
  );
};

export default Students;