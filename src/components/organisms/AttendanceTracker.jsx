import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { attendanceService } from "@/services/api/attendanceService";
import { studentService } from "@/services/api/studentService";
import { classService } from "@/services/api/classService";

const AttendanceTracker = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      loadClassData();
    }
  }, [selectedClass, selectedDate]);

  const loadInitialData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const classData = await classService.getAll();
      setClasses(classData);
      
      if (classData.length > 0) {
        setSelectedClass(classData[0].Id.toString());
      }
    } catch (err) {
      setError("Failed to load class data");
    } finally {
      setLoading(false);
    }
  };

  const loadClassData = async () => {
    if (!selectedClass) return;

    setLoading(true);
    setError("");

    try {
      const [studentData, attendanceData] = await Promise.all([
        studentService.getAll(),
        attendanceService.getAll()
      ]);

      const classId = parseInt(selectedClass);
      const filteredStudents = studentData.filter(student => 
        student.classIds && student.classIds.includes(classId)
      );
      const filteredAttendance = attendanceData.filter(att => 
        att.classId === classId && att.date === selectedDate
      );

      setStudents(filteredStudents);
      setAttendance(filteredAttendance);
    } catch (err) {
      setError("Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  const getAttendanceStatus = (studentId) => {
    const record = attendance.find(att => att.studentId === studentId);
    return record ? record.status : "";
  };

  const handleAttendanceChange = async (studentId, status) => {
    setSaving(true);
    
    try {
      const existingRecord = attendance.find(att => att.studentId === studentId);
      const attendanceData = {
        studentId,
        classId: parseInt(selectedClass),
        date: selectedDate,
        status,
        notes: ""
      };

      if (existingRecord) {
        await attendanceService.update(existingRecord.Id, attendanceData);
        setAttendance(prev => prev.map(att => 
          att.Id === existingRecord.Id ? { ...att, ...attendanceData } : att
        ));
      } else {
        const newRecord = await attendanceService.create(attendanceData);
        setAttendance(prev => [...prev, newRecord]);
      }
      
      toast.success("Attendance updated successfully!");
    } catch (err) {
      toast.error("Failed to update attendance");
    } finally {
      setSaving(false);
    }
  };

  const markAllPresent = async () => {
    setSaving(true);
    
    try {
      for (const student of students) {
        await handleAttendanceChange(student.Id, "Present");
      }
      toast.success("All students marked present!");
    } catch (err) {
      toast.error("Failed to mark all present");
    } finally {
      setSaving(false);
    }
  };

  const getAttendanceStats = () => {
    const total = students.length;
    const present = attendance.filter(att => att.status === "Present").length;
    const absent = attendance.filter(att => att.status === "Absent").length;
    const late = attendance.filter(att => att.status === "Late").length;
    
    return { total, present, absent, late };
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadInitialData} />;

  if (classes.length === 0) {
    return (
      <Empty 
        title="No Classes Found" 
        description="Create a class first to start tracking attendance"
        icon="School"
      />
    );
  }

  if (!selectedClass) return null;

  if (students.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Attendance Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <Empty 
            title="No Students in Class" 
            description="Add students to this class to start tracking attendance"
            icon="Users"
          />
        </CardContent>
      </Card>
    );
  }

  const stats = getAttendanceStats();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center">
              <ApperIcon name="CheckSquare" className="w-5 h-5 mr-2 text-primary" />
              Attendance Tracker
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full sm:w-48"
              >
                {classes.map(cls => (
                  <option key={cls.Id} value={cls.Id}>
                    {cls.name}
                  </option>
                ))}
              </Select>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full sm:w-auto"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-wrap gap-4">
              <div className="text-sm">
                <span className="text-gray-600">Total: </span>
                <span className="font-medium">{stats.total}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Present: </span>
                <span className="font-medium text-success">{stats.present}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Absent: </span>
                <span className="font-medium text-error">{stats.absent}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Late: </span>
                <span className="font-medium text-warning">{stats.late}</span>
              </div>
            </div>
            <Button
              onClick={markAllPresent}
              disabled={saving}
              variant="outline"
              size="sm"
            >
              {saving ? (
                <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <ApperIcon name="CheckCheck" className="w-4 h-4 mr-2" />
              )}
              Mark All Present
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Attendance List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {students.map((student, index) => {
              const status = getAttendanceStatus(student.Id);
              
              return (
                <motion.div
                  key={student.Id}
                  className="p-6 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/20 rounded-full flex items-center justify-center">
                        <ApperIcon name="User" className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </h3>
                        <p className="text-sm text-gray-500">Grade {student.gradeLevel}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {status && (
                        <Badge variant={status.toLowerCase()}>
                          {status}
                        </Badge>
                      )}
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant={status === "Present" ? "primary" : "outline"}
                          onClick={() => handleAttendanceChange(student.Id, "Present")}
                          disabled={saving}
                        >
                          <ApperIcon name="Check" className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant={status === "Late" ? "primary" : "outline"}
                          onClick={() => handleAttendanceChange(student.Id, "Late")}
                          disabled={saving}
                        >
                          <ApperIcon name="Clock" className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant={status === "Absent" ? "primary" : "outline"}
                          onClick={() => handleAttendanceChange(student.Id, "Absent")}
                          disabled={saving}
                        >
                          <ApperIcon name="X" className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AttendanceTracker;