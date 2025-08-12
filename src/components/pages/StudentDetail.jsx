import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import PerformanceChart from "@/components/organisms/PerformanceChart";
import { studentService } from "@/services/api/studentService";
import { gradeService } from "@/services/api/gradeService";
import { attendanceService } from "@/services/api/attendanceService";
import { assignmentService } from "@/services/api/assignmentService";
const StudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      loadStudentData();
    }
  }, [id]);

  const loadStudentData = async () => {
    setLoading(true);
    setError("");

    try {
      const [studentData, gradesData, attendanceData, assignmentsData] = await Promise.all([
        studentService.getById(parseInt(id)),
        gradeService.getAll(),
        attendanceService.getAll(),
        assignmentService.getAll()
      ]);

setStudent(studentData);
      setGrades(gradesData.filter(g => (g.student_id_c?.Id === parseInt(id) || g.student_id_c === parseInt(id))));
      setAttendance(attendanceData.filter(a => (a.student_id_c?.Id === parseInt(id) || a.student_id_c === parseInt(id))));
      setAssignments(assignmentsData);
    } catch (err) {
      setError("Failed to load student data");
    } finally {
      setLoading(false);
    }
  };

  const calculateGPA = () => {
    if (grades.length === 0) return "N/A";
    
const total = grades.reduce((sum, grade) => {
      return sum + (grade.score_c / grade.max_score_c) * 100;
    }, 0);
    
    return (total / grades.length).toFixed(1) + "%";
  };

  const getAttendanceRate = () => {
    if (attendance.length === 0) return "N/A";
const presentCount = attendance.filter(a => a.status_c === "Present").length;
    return ((presentCount / attendance.length) * 100).toFixed(1) + "%";
  };

  const getRecentAttendance = () => {
return attendance
      .sort((a, b) => new Date(b.date_c) - new Date(a.date_c))
      .slice(0, 10);
  };

  const getRecentGrades = () => {
return grades
      .map(grade => {
        const assignment = assignments.find(a => a.Id === (grade.assignment_id_c?.Id || grade.assignment_id_c));
        return { ...grade, assignmentName: assignment?.Name };
      })
      .sort((a, b) => new Date(b.date_c) - new Date(a.date_c))
      .slice(0, 5);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadStudentData} />;
  if (!student) return <Error message="Student not found" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/students")}
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
            Back to Students
          </Button>
        </div>
        <Button variant="outline">
          <ApperIcon name="Edit" className="w-4 h-4 mr-2" />
          Edit Student
        </Button>
      </div>

      {/* Student Info */}
      <Card>
        <CardContent className="p-8">
          <div className="flex items-start space-x-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
{student.first_name_c} {student.last_name_c}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <div className="flex items-center">
                  <ApperIcon name="GraduationCap" className="w-4 h-4 mr-2" />
                  Grade {student.grade_level_c}
                </div>
                {student.email_c && (
                  <div className="flex items-center">
                    <ApperIcon name="Mail" className="w-4 h-4 mr-2" />
                    {student.email_c}
                  </div>
                )}
                {student.phone_c && (
                  <div className="flex items-center">
                    <ApperIcon name="Phone" className="w-4 h-4 mr-2" />
                    {student.phone_c}
                  </div>
                )}
                {student.date_of_birth_c && (
                  <div className="flex items-center">
                    <ApperIcon name="Calendar" className="w-4 h-4 mr-2" />
                    Born {format(new Date(student.date_of_birth_c), "MMM dd, yyyy")}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="BarChart3" className="w-6 h-6 text-primary" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{calculateGPA()}</p>
            <p className="text-gray-600">Average Grade</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-success/10 to-green-200 rounded-xl flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="CheckSquare" className="w-6 h-6 text-success" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{getAttendanceRate()}</p>
            <p className="text-gray-600">Attendance Rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-accent/10 to-yellow-200 rounded-xl flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="BookOpen" className="w-6 h-6 text-accent" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{grades.length}</p>
            <p className="text-gray-600">Total Grades</p>
          </CardContent>
        </Card>
      </div>

{/* Performance Chart */}
      <div className="mb-8">
        <PerformanceChart 
          studentId={id} 
          grades={grades} 
          assignments={assignments} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Grades */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ApperIcon name="BookOpen" className="w-5 h-5 mr-2 text-primary" />
              Recent Grades
            </CardTitle>
          </CardHeader>
          <CardContent>
            {getRecentGrades().length > 0 ? (
              <div className="space-y-4">
                {getRecentGrades().map((grade, index) => (
                  <motion.div
                    key={grade.Id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
<div>
                      <p className="font-medium text-gray-900">{grade.assignmentName}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(grade.date_c), "MMM dd, yyyy")}
                      </p>
                    </div>
                    <Badge variant={grade.score_c / grade.max_score_c >= 0.8 ? "success" : grade.score_c / grade.max_score_c >= 0.6 ? "warning" : "error"}>
                      {grade.score_c}/{grade.max_score_c} ({((grade.score_c / grade.max_score_c) * 100).toFixed(0)}%)
                    </Badge>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No grades recorded yet</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Attendance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ApperIcon name="CheckSquare" className="w-5 h-5 mr-2 text-primary" />
              Recent Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {getRecentAttendance().length > 0 ? (
              <div className="space-y-4">
                {getRecentAttendance().map((att, index) => (
                  <motion.div
                    key={att.Id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
<p className="font-medium text-gray-900">
                      {format(new Date(att.date_c), "MMM dd, yyyy")}
                    </p>
                    <Badge variant={att.status_c.toLowerCase()}>
                      {att.status_c}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No attendance records yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default StudentDetail;