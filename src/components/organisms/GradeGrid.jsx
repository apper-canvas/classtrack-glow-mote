import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { gradeService } from "@/services/api/gradeService";
import { studentService } from "@/services/api/studentService";
import { assignmentService } from "@/services/api/assignmentService";
import { classService } from "@/services/api/classService";

const GradeGrid = () => {
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState({});

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      loadClassData();
    }
  }, [selectedClass]);

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
      const [studentData, assignmentData, gradeData] = await Promise.all([
        studentService.getAll(),
        assignmentService.getAll(),
        gradeService.getAll()
      ]);

const classId = parseInt(selectedClass);
      const filteredStudents = studentData.filter(student => 
        student.class_ids_c && student.class_ids_c.toString().split(',').map(id => parseInt(id)).includes(classId)
      );
      const filteredAssignments = assignmentData.filter(assignment => 
        assignment.class_id_c?.Id === classId || assignment.class_id_c === classId
      );
      const filteredGrades = gradeData.filter(grade => 
        grade.class_id_c?.Id === classId || grade.class_id_c === classId
      );

      setStudents(filteredStudents);
      setAssignments(filteredAssignments);
      setGrades(filteredGrades);
    } catch (err) {
      setError("Failed to load grade data");
    } finally {
      setLoading(false);
    }
  };

const getGrade = (studentId, assignmentId) => {
    const grade = grades.find(g => 
      (g.student_id_c?.Id === studentId || g.student_id_c === studentId) && 
      (g.assignment_id_c?.Id === assignmentId || g.assignment_id_c === assignmentId)
    );
    return grade ? grade.score_c : "";
  };

  const handleGradeChange = async (studentId, assignmentId, score) => {
    const key = `${studentId}-${assignmentId}`;
    setSaving(prev => ({ ...prev, [key]: true }));

    try {
      const numScore = parseFloat(score);
const assignment = assignments.find(a => a.Id === assignmentId);
      
      if (isNaN(numScore) || numScore < 0 || numScore > assignment.max_score_c) {
        toast.error(`Score must be between 0 and ${assignment.maxScore}`);
        return;
      }

const existingGrade = grades.find(g => 
        (g.student_id_c?.Id === studentId || g.student_id_c === studentId) && 
        (g.assignment_id_c?.Id === assignmentId || g.assignment_id_c === assignmentId)
      );

const gradeData = {
        student_id_c: studentId,
        class_id_c: parseInt(selectedClass),
        assignment_id_c: assignmentId,
        score_c: numScore,
        max_score_c: assignment.max_score_c,
        date_c: new Date().toISOString().split('T')[0]
      };

      if (existingGrade) {
        await gradeService.update(existingGrade.Id, gradeData);
        setGrades(prev => prev.map(g => 
          g.Id === existingGrade.Id ? { ...g, ...gradeData } : g
        ));
      } else {
        const newGrade = await gradeService.create(gradeData);
        setGrades(prev => [...prev, newGrade]);
      }

      toast.success("Grade saved successfully!");
    } catch (err) {
      toast.error("Failed to save grade");
    } finally {
      setSaving(prev => ({ ...prev, [key]: false }));
    }
  };

const calculateStudentAverage = (studentId) => {
    const studentGrades = grades.filter(g => g.student_id_c?.Id === studentId || g.student_id_c === studentId);
    if (studentGrades.length === 0) return "N/A";
    
    const total = studentGrades.reduce((sum, grade) => {
      const percentage = (grade.score_c / grade.max_score_c) * 100;
      return sum + percentage;
    }, 0);
    
    return (total / studentGrades.length).toFixed(1) + "%";
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadInitialData} />;

  if (classes.length === 0) {
    return (
      <Empty 
        title="No Classes Found" 
        description="Create a class first to start managing grades"
        icon="School"
      />
    );
  }

  if (!selectedClass) return null;

  if (students.length === 0 || assignments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Grade Management</CardTitle>
            <Select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-48"
            >
{classes.map(cls => (
                <option key={cls.Id} value={cls.Id}>
                  {cls.Name}
                </option>
              ))}
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Empty 
            title={students.length === 0 ? "No Students in Class" : "No Assignments Created"}
            description={students.length === 0 
              ? "Add students to this class to start tracking grades" 
              : "Create assignments for this class to enter grades"
            }
            icon={students.length === 0 ? "Users" : "BookOpen"}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <ApperIcon name="BarChart3" className="w-5 h-5 mr-2 text-primary" />
              Grade Management
            </CardTitle>
            <Select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-48"
            >
{classes.map(cls => (
                <option key={cls.Id} value={cls.Id}>
                  {cls.Name}
                </option>
              ))}
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Student
                  </th>
{assignments.map(assignment => (
                    <th key={assignment.Id} className="px-4 py-3 text-center text-sm font-semibold text-gray-700 min-w-[120px]">
                      <div className="space-y-1">
                        <div>{assignment.Name}</div>
                        <div className="text-xs text-gray-500">
                          / {assignment.max_score_c}
                        </div>
                      </div>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    Average
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <motion.tr
                    key={student.Id}
                    className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
<td className="px-4 py-4">
                      <div className="font-medium text-gray-900">
                        {student.first_name_c} {student.last_name_c}
                      </div>
                      <div className="text-sm text-gray-500">
                        Grade {student.grade_level_c}
                      </div>
                    </td>
                    {assignments.map(assignment => {
                      const key = `${student.Id}-${assignment.Id}`;
                      const currentGrade = getGrade(student.Id, assignment.Id);
                      
                      return (
                        <td key={assignment.Id} className="px-4 py-4 text-center">
                          <div className="relative">
<Input
                              type="number"
                              min="0"
                              max={assignment.max_score_c}
                              step="0.1"
                              value={currentGrade}
                              onChange={(e) => handleGradeChange(student.Id, assignment.Id, e.target.value)}
                              className="w-16 text-center"
                              placeholder="—"
                            />
                            {saving[key] && (
                              <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                                <ApperIcon name="Loader2" className="w-4 h-4 animate-spin text-primary" />
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    })}
                    <td className="px-4 py-4 text-center font-medium text-gray-900">
                      {calculateStudentAverage(student.Id)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GradeGrid;