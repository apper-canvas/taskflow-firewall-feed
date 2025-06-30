import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, isToday, isPast, differenceInDays } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Checkbox from '@/components/atoms/Checkbox'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'

const TaskItem = ({ 
  task, 
  onToggleComplete, 
  onEdit, 
  onDelete, 
  onSelect,
  isSelected = false,
  selectionMode = false,
  className = '' 
}) => {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleToggleComplete = async () => {
    setIsAnimating(true)
    
    // Add delay for animation
    setTimeout(() => {
      onToggleComplete(task.Id, !task.completed)
      setIsAnimating(false)
    }, 400)
  }

  const getDueDateStatus = () => {
    if (!task.dueDate) return null
    
    const dueDate = new Date(task.dueDate)
    const today = new Date()
    
    if (isPast(dueDate) && !isToday(dueDate) && !task.completed) {
      const daysOverdue = Math.abs(differenceInDays(today, dueDate))
      return {
        status: 'overdue',
        text: `${daysOverdue} day${daysOverdue > 1 ? 's' : ''} overdue`,
        color: 'text-red-600 bg-red-50'
      }
    }
    
    if (isToday(dueDate)) {
      return {
        status: 'today',
        text: 'Due today',
        color: 'text-orange-600 bg-orange-50'
      }
    }
    
    const daysUntil = differenceInDays(dueDate, today)
    if (daysUntil <= 3) {
      return {
        status: 'soon',
        text: `Due in ${daysUntil} day${daysUntil > 1 ? 's' : ''}`,
        color: 'text-yellow-600 bg-yellow-50'
      }
    }
    
    return null
  }

  const dueDateStatus = getDueDateStatus()
  
  const getCategoryColor = () => {
    const colors = {
      'Work': '#5B4FF7',
      'Personal': '#FF6B6B',
      'Learning': '#4ECDC4',
      'Leisure': '#FFE66D'
    }
    return colors[task.category] || '#5B4FF7'
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: task.completed && isAnimating ? 0.5 : 1, 
        y: 0,
        scale: isSelected ? 0.98 : 1
      }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={`
        bg-white rounded-xl p-4 shadow-sm border transition-all duration-200
        ${isSelected 
          ? 'border-primary-500 bg-primary-50 shadow-md' 
          : 'border-gray-100 hover:border-gray-200 hover:shadow-md'
        }
        ${task.completed ? 'opacity-75' : ''}
        ${className}
      `}
    >
      <div className="flex items-start space-x-4">
        {/* Checkbox */}
        <div className="flex-shrink-0 pt-1">
          <Checkbox
            checked={task.completed}
            onChange={handleToggleComplete}
            size="md"
            className={task.completed ? 'animate-bounce-check' : ''}
          />
        </div>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className={`
                text-base font-medium transition-all duration-200
                ${task.completed 
                  ? 'text-gray-500 line-through' 
                  : 'text-gray-900'
                }
              `}>
                {task.title}
              </h3>
              
              <div className="flex items-center space-x-3 mt-2">
                {/* Category */}
                <div className="flex items-center space-x-1">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: getCategoryColor() }}
                  />
                  <span className="text-xs font-medium text-gray-600">
                    {task.category}
                  </span>
                </div>

                {/* Priority */}
                <Badge variant={task.priority} size="xs">
                  {task.priority}
                </Badge>

                {/* Due Date */}
                {task.dueDate && (
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="Calendar" size={12} className="text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {format(new Date(task.dueDate), 'MMM d')}
                    </span>
                  </div>
                )}

                {/* Due Date Status */}
                {dueDateStatus && (
                  <span className={`
                    px-2 py-0.5 rounded-full text-xs font-medium
                    ${dueDateStatus.color}
                  `}>
                    {dueDateStatus.text}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-1 ml-4">
              {selectionMode ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSelect(task.Id)}
                  className="p-2"
                >
                  <ApperIcon 
                    name={isSelected ? "CheckSquare" : "Square"} 
                    size={16} 
                    className={isSelected ? "text-primary-600" : "text-gray-400"}
                  />
                </Button>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(task)}
                    className="p-2 hover:bg-gray-100"
                  >
                    <ApperIcon name="Edit2" size={14} className="text-gray-500" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(task.Id)}
                    className="p-2 hover:bg-red-50 hover:text-red-600"
                  >
                    <ApperIcon name="Trash2" size={14} className="text-gray-500" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default TaskItem