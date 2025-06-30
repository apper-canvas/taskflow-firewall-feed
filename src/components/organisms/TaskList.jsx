import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import TaskItem from '@/components/organisms/TaskItem'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'

const TaskList = ({ 
  tasks = [], 
  loading = false, 
  error = null, 
  onToggleComplete, 
  onEdit, 
  onDelete,
  onBulkDelete,
  onRetry,
  className = '' 
}) => {
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedTasks, setSelectedTasks] = useState(new Set())

  const handleSelectTask = (taskId) => {
    const newSelected = new Set(selectedTasks)
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId)
    } else {
      newSelected.add(taskId)
    }
    setSelectedTasks(newSelected)
    
    // Exit selection mode if no tasks selected
    if (newSelected.size === 0) {
      setSelectionMode(false)
    }
  }

  const handleSelectAll = () => {
    if (selectedTasks.size === tasks.length) {
      setSelectedTasks(new Set())
      setSelectionMode(false)
    } else {
      setSelectedTasks(new Set(tasks.map(task => task.Id)))
    }
  }

  const handleBulkDelete = async () => {
    if (selectedTasks.size === 0) return
    
    const selectedCount = selectedTasks.size
    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedCount} task${selectedCount > 1 ? 's' : ''}?`
    )
    
    if (!confirmed) return
    
    try {
      await onBulkDelete(Array.from(selectedTasks))
      setSelectedTasks(new Set())
      setSelectionMode(false)
      toast.success(`${selectedCount} task${selectedCount > 1 ? 's' : ''} deleted successfully`)
    } catch (error) {
      toast.error('Failed to delete tasks')
    }
  }

  const handleExitSelection = () => {
    setSelectionMode(false)
    setSelectedTasks(new Set())
  }

  const startSelectionMode = () => {
    setSelectionMode(true)
  }

  if (loading) {
    return (
      <div className={className}>
        <Loading type="tasks" />
      </div>
    )
  }

  if (error) {
    return (
      <div className={className}>
        <Error message={error} onRetry={onRetry} />
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className={className}>
        <Empty type="tasks" />
      </div>
    )
  }

  const pendingTasks = tasks.filter(task => !task.completed)
  const completedTasks = tasks.filter(task => task.completed)
  const allSelected = selectedTasks.size === tasks.length && tasks.length > 0

  return (
    <div className={className}>
      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectionMode && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleExitSelection}
                >
                  <ApperIcon name="X" size={16} className="mr-2" />
                  Cancel
                </Button>
                
                <div className="text-sm text-gray-600">
                  {selectedTasks.size} of {tasks.length} selected
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAll}
                >
                  <ApperIcon 
                    name={allSelected ? "MinusSquare" : "CheckSquare"} 
                    size={16} 
                    className="mr-2" 
                  />
                  {allSelected ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleBulkDelete}
                  disabled={selectedTasks.size === 0}
                >
                  <ApperIcon name="Trash2" size={16} className="mr-2" />
                  Delete ({selectedTasks.size})
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task List Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 font-display">
            Your Tasks
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {pendingTasks.length} pending, {completedTasks.length} completed
          </p>
        </div>
        
        {!selectionMode && tasks.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={startSelectionMode}
          >
            <ApperIcon name="CheckSquare" size={16} className="mr-2" />
            Select
          </Button>
        )}
      </div>

      {/* Pending Tasks */}
      {pendingTasks.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
            Pending Tasks ({pendingTasks.length})
          </h3>
          <div className="space-y-3">
            <AnimatePresence>
              {pendingTasks.map((task) => (
                <TaskItem
                  key={task.Id}
                  task={task}
                  onToggleComplete={onToggleComplete}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onSelect={handleSelectTask}
                  isSelected={selectedTasks.has(task.Id)}
                  selectionMode={selectionMode}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
            Completed Tasks ({completedTasks.length})
          </h3>
          <div className="space-y-3">
            <AnimatePresence>
              {completedTasks.map((task) => (
                <TaskItem
                  key={task.Id}
                  task={task}
                  onToggleComplete={onToggleComplete}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onSelect={handleSelectTask}
                  isSelected={selectedTasks.has(task.Id)}
                  selectionMode={selectionMode}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  )
}

export default TaskList