import { motion } from "framer-motion";
import { Card } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const DataTable = ({ 
  data = [], 
  columns = [], 
  onEdit, 
  onDelete, 
  onView,
  loading = false 
}) => {
  if (loading) {
    return (
      <Card>
        <div className="p-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-4 py-4 border-b border-gray-100 last:border-0">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse" />
                <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((row, rowIndex) => (
              <motion.tr
                key={row.Id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: rowIndex * 0.05 }}
                className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                    {column.render ? column.render(row[column.key], row) : (
                      column.key === "status" ? (
                        <Badge variant={row[column.key]?.toLowerCase()}>
                          {row[column.key]}
                        </Badge>
                      ) : (
                        <span className="text-sm text-gray-900">
                          {row[column.key]}
                        </span>
                      )
                    )}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end space-x-2">
                    {onView && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onView(row)}
                        className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100"
                      >
                        <ApperIcon name="Eye" className="w-4 h-4" />
                      </Button>
                    )}
                    {onEdit && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onEdit(row)}
                        className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100"
                      >
                        <ApperIcon name="Edit" className="w-4 h-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDelete(row)}
                        className="hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-error"
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default DataTable;