import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import StatCard from "@/components/molecules/StatCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { studentService } from "@/services/api/studentService";
import { gradeService } from "@/services/api/gradeService";
import { attendanceService } from "@/services/api/attendanceService";
import { classService } from "@/services/api/classService";
import { format } from "date-fns";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    averageGrade: 0,
    attendanceRate: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");

    try {
      const [students, grades, attendance, classes] = await Promise.all([
        studentService.getAll(),
        gradeService.getAll(),
        attendanceService.getAll(),
        classService.getAll()
      ]);

      // Calculate stats
      const totalStudents = students.length;
      const totalClasses = classes.length;
      
// Calculate average grade
      let averageGrade = 0;
      if (grades.length > 0) {
        const totalPercentages = grades.reduce((sum, grade) => {
          return sum + (grade.score_c / grade.max_score_c) * 100;
        }, 0);
        averageGrade = totalPercentages / grades.length;
      }

// Calculate attendance rate for today
      const today = format(new Date(), "yyyy-MM-dd");
      const todayAttendance = attendance.filter(att => att.date_c === today);
      const presentCount = todayAttendance.filter(att => att.status_c === "Present").length;
      const attendanceRate = todayAttendance.length > 0 
        ? (presentCount / todayAttendance.length) * 100 
        : 100;
      setStats({
        totalStudents,
        totalClasses,
        averageGrade: averageGrade.toFixed(1),
        attendanceRate: attendanceRate.toFixed(1)
      });

      // Generate recent activity
      const activity = [];
      
      // Recent grades
      const recentGrades = grades.slice(-3).reverse();
recentGrades.forEach(grade => {
        const student = students.find(s => s.Id === (grade.student_id_c?.Id || grade.student_id_c));
        if (student) {
          activity.push({
            type: "grade",
            message: `Grade recorded for ${student.first_name_c} ${student.last_name_c}`,
            time: "2 hours ago",
            icon: "BookOpen"
          });
        }
      });

      // Recent attendance
      const recentAttendance = todayAttendance.slice(-2);
      recentAttendance.forEach(att => {
        const student = students.find(s => s.Id === (att.student_id_c?.Id || att.student_id_c));
        if (student) {
          activity.push({
            type: "attendance",
            message: `${student.first_name_c} ${student.last_name_c} marked ${att.status_c.toLowerCase()}`,
            time: "1 hour ago",
            icon: "CheckSquare"
          });
        }
      });

      setRecentActivity(activity.slice(0, 5));

      // Generate upcoming events
      setUpcomingEvents([
        {
          title: "Parent-Teacher Conferences",
          date: "Next Monday",
          type: "meeting",
          icon: "Calendar"
        },
        {
          title: "Midterm Exams",
          date: "Next Week",
          type: "exam",
          icon: "FileText"
        },
        {
          title: "Science Fair Projects Due",
          date: "Friday",
          type: "assignment",
          icon: "Beaker"
        }
      ]);

    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-display bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Welcome to ClassTrack
        </h1>
        <p className="text-gray-600 mt-2">
          Here's an overview of your classroom activities today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          change="+2 this week"
          icon="Users"
          trend="up"
          delay={0}
        />
        <StatCard
          title="Total Classes"
          value={stats.totalClasses}
          change="Active courses"
          icon="School"
          trend="neutral"
          delay={0.1}
        />
        <StatCard
          title="Average Grade"
          value={`${stats.averageGrade}%`}
          change="+3.2% this month"
          icon="BarChart3"
          trend="up"
          delay={0.2}
        />
        <StatCard
          title="Attendance Rate"
          value={`${stats.attendanceRate}%`}
          change="Today's rate"
          icon="CheckSquare"
          trend="up"
          delay={0.3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ApperIcon name="Activity" className="w-5 h-5 mr-2 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-primary/10 to-secondary/20 rounded-lg flex items-center justify-center">
                        <ApperIcon name={activity.icon} className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.message}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No recent activity</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ApperIcon name="Calendar" className="w-5 h-5 mr-2 text-primary" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-accent/10 to-warning/20 rounded-lg flex items-center justify-center">
                        <ApperIcon name={event.icon} className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {event.title}
                        </p>
                        <p className="text-xs text-gray-500">{event.date}</p>
                      </div>
                    </div>
                    <Badge variant="info">{event.type}</Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ApperIcon name="Zap" className="w-5 h-5 mr-2 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col">
                <ApperIcon name="UserPlus" className="w-6 h-6 mb-2" />
                <span className="text-sm">Add Student</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <ApperIcon name="CheckSquare" className="w-6 h-6 mb-2" />
                <span className="text-sm">Take Attendance</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <ApperIcon name="BookOpen" className="w-6 h-6 mb-2" />
                <span className="text-sm">Enter Grades</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <ApperIcon name="BarChart3" className="w-6 h-6 mb-2" />
                <span className="text-sm">View Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;