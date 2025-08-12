import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Chart from "react-apexcharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import { format } from "date-fns";

const PerformanceChart = ({ studentId, grades = [], assignments = [] }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (grades.length > 0 && assignments.length > 0) {
      processChartData();
    }
  }, [grades, assignments, studentId]);

  const processChartData = () => {
    setLoading(true);
    
    // Filter grades for this student and sort by date
    const studentGrades = grades
      .filter(grade => grade.studentId === parseInt(studentId))
      .map(grade => {
        const assignment = assignments.find(a => a.Id === grade.assignmentId);
        return {
          ...grade,
          assignmentName: assignment?.name || "Unknown Assignment",
          percentage: (grade.score / grade.maxScore) * 100
        };
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (studentGrades.length === 0) {
      setChartData(null);
      setLoading(false);
      return;
    }

    const data = {
      series: [{
        name: 'Grade Percentage',
        data: studentGrades.map(grade => ({
          x: format(new Date(grade.date), 'MMM dd'),
          y: grade.percentage.toFixed(1),
          assignmentName: grade.assignmentName,
          score: grade.score,
          maxScore: grade.maxScore
        }))
      }],
      options: {
        chart: {
          type: 'line',
          height: 350,
          fontFamily: 'Inter, system-ui, sans-serif',
          toolbar: {
            show: false
          }
        },
        stroke: {
          curve: 'smooth',
          width: 3,
          colors: ['#2563EB']
        },
        markers: {
          size: 6,
          colors: ['#2563EB'],
          strokeColors: '#fff',
          strokeWidth: 2,
          hover: {
            size: 8
          }
        },
        xaxis: {
          title: {
            text: 'Assignment Date',
            style: {
              fontSize: '12px',
              fontWeight: 600,
              color: '#374151'
            }
          }
        },
        yaxis: {
          title: {
            text: 'Grade Percentage (%)',
            style: {
              fontSize: '12px',
              fontWeight: 600,
              color: '#374151'
            }
          },
          min: 0,
          max: 100
        },
        grid: {
          borderColor: '#E5E7EB'
        },
        tooltip: {
          custom: function({ series, seriesIndex, dataPointIndex, w }) {
            const data = w.config.series[seriesIndex].data[dataPointIndex];
            return `
              <div class="bg-white p-3 rounded-lg shadow-lg border">
                <div class="font-semibold text-gray-900">${data.assignmentName}</div>
                <div class="text-sm text-gray-600 mt-1">${data.x}</div>
                <div class="text-sm font-medium mt-2">
                  Score: ${data.score}/${data.maxScore} (${data.y}%)
                </div>
              </div>
            `;
          }
        }
      }
    };

    setChartData(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ApperIcon name="TrendingUp" className="w-5 h-5 mr-2 text-primary" />
            Performance Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Loading />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ApperIcon name="TrendingUp" className="w-5 h-5 mr-2 text-primary" />
            Performance Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chartData ? (
            <div className="w-full">
              <Chart
                options={chartData.options}
                series={chartData.series}
                type="line"
                height={350}
              />
            </div>
          ) : (
            <div className="text-center py-12">
              <ApperIcon name="BarChart3" className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No grade data available to display trends</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PerformanceChart;