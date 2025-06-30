import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { isToday, isPast, parseISO } from 'date-fns'
import { taskService } from '@/services/api/taskService'
import { categoryService } from '@/services/api/categoryService'
import TaskList from '@/components/organisms/TaskList'
import CategorySidebar from '@/components/organisms/CategorySidebar'
import QuickAdd from '@/components/molecules/QuickAdd'
import SearchBar from '@/components/molecules/SearchBar'
import FilterBar from '@/components/molecules/FilterBar'
import TaskForm from '@/components/molecules/TaskForm'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'

const TaskDashboard = () => {
  // Data state
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [categoriesError, setCategoriesError] = useState(null)

  // UI state
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [activeCategory, setActiveCategory] = useState('all')
  const [editingTask, setEditingTask] = useState(null)
  const [showTaskForm, setShowTaskForm] = useState(false)

  // Load initial data
  useEffect(() => {
    loadTasks()
    loadCategories()
  }, [])

  const loadTasks = async () => {
    try {
      setError(null)
      setLoading(true)
      const data = await taskService.getAll()
      setTasks(data)
    } catch (err) {
      setError(err.message)
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      setCategoriesError(null)
      setCategoriesLoading(true)
      const data = await categoryService.getAll()
      
      // Update task counts
      const updatedCategories = data.map(category => {
        const taskCount = tasks.filter(task => task.category === category.name).length
        return { ...category, taskCount }
      })
      
      setCategories(updatedCategories)
    } catch (err) {
      setCategoriesError(err.message)
    } finally {
      setCategoriesLoading(false)
    }
  }

  // Update category counts when tasks change
  useEffect(() => {
    if (categories.length > 0) {
      const updatedCategories = categories.map(category => {
        const taskCount = tasks.filter(task => task.category === category.name).length
        return { ...category, taskCount }
      })
      setCategories(updatedCategories)
    }
  }, [tasks])

  // Filter and search tasks
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks]

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) ||
        task.category.toLowerCase().includes(query)
      )
    }

    // Apply category filter
    if (activeCategory !== 'all') {
      filtered = filtered.filter(task => task.category === activeCategory)
    }

    // Apply status filter
    switch (activeFilter) {
      case 'pending':
        filtered = filtered.filter(task => !task.completed)
        break
      case 'completed':
        filtered = filtered.filter(task => task.completed)
        break
      case 'overdue':
        filtered = filtered.filter(task => {
          if (!task.dueDate || task.completed) return false
          const dueDate = parseISO(task.dueDate)
          return isPast(dueDate) && !isToday(dueDate)
        })
        break
      case 'today':
        filtered = filtered.filter(task => {
          if (!task.dueDate) return false
          const dueDate = parseISO(task.dueDate)
          return isToday(dueDate)
        })
        break
    }

    // Sort by priority and due date
    return filtered.sort((a, b) => {
      // Completed tasks go to bottom
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1
      }

      // Sort by priority
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
      if (priorityDiff !== 0) return priorityDiff

      // Sort by due date
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate) - new Date(b.dueDate)
      }
      if (a.dueDate) return -1
      if (b.dueDate) return 1

      // Sort by creation date
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
  }, [tasks, searchQuery, activeFilter, activeCategory])

  // Calculate task counts for filters
  const taskCounts = useMemo(() => {
    const all = tasks.length
    const pending = tasks.filter(task => !task.completed).length
    const completed = tasks.filter(task => task.completed).length
    const overdue = tasks.filter(task => {
      if (!task.dueDate || task.completed) return false
      const dueDate = parseISO(task.dueDate)
      return isPast(dueDate) && !isToday(dueDate)
    }).length
    const today = tasks.filter(task => {
      if (!task.dueDate) return false
      const dueDate = parseISO(task.dueDate)
      return isToday(dueDate)
    }).length

    return { all, pending, completed, overdue, today }
  }, [tasks])

  // Task operations
  const handleAddTask = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData)
      setTasks(prev => [newTask, ...prev])
      toast.success('Task created successfully!')
    } catch (error) {
      toast.error('Failed to create task')
      throw error
    }
  }

  const handleToggleComplete = async (taskId, completed) => {
    try {
      const updatedTask = await taskService.update(taskId, { completed })
      setTasks(prev => prev.map(task => 
        task.Id === taskId ? updatedTask : task
      ))
      toast.success(completed ? 'Task completed! 🎉' : 'Task marked as pending')
    } catch (error) {
      toast.error('Failed to update task')
    }
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setShowTaskForm(true)
  }

  const handleUpdateTask = async (taskData) => {
    try {
      const updatedTask = await taskService.update(editingTask.Id, taskData)
      setTasks(prev => prev.map(task => 
        task.Id === editingTask.Id ? updatedTask : task
      ))
      setEditingTask(null)
      setShowTaskForm(false)
      toast.success('Task updated successfully!')
    } catch (error) {
      toast.error('Failed to update task')
      throw error
    }
  }

  const handleDeleteTask = async (taskId) => {
    const confirmed = window.confirm('Are you sure you want to delete this task?')
    if (!confirmed) return

    try {
      await taskService.delete(taskId)
      setTasks(prev => prev.filter(task => task.Id !== taskId))
      toast.success('Task deleted successfully')
    } catch (error) {
      toast.error('Failed to delete task')
    }
  }

  const handleBulkDelete = async (taskIds) => {
    try {
      await taskService.bulkDelete(taskIds)
      setTasks(prev => prev.filter(task => !taskIds.includes(task.Id)))
    } catch (error) {
      toast.error('Failed to delete tasks')
      throw error
    }
  }

  // UI handlers
  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const handleFilterChange = (filter) => {
    setActiveFilter(filter)
  }

  const handleClearFilters = () => {
    setActiveFilter('all')
    setActiveCategory('all')
    setSearchQuery('')
  }

  const handleCategoryChange = (category) => {
    setActiveCategory(category)
  }

  const handleCloseTaskForm = () => {
    setEditingTask(null)
    setShowTaskForm(false)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <Loading type="tasks" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <Error message={error} onRetry={loadTasks} />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Task Form Modal */}
      <AnimatePresence>
        {showTaskForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && handleCloseTaskForm()}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 font-display">
                  {editingTask ? 'Edit Task' : 'Create New Task'}
                </h2>
                <p className="text-gray-600 mt-1">
                  {editingTask ? 'Update your task details' : 'Add a new task to your list'}
                </p>
              </div>
              
              <TaskForm
                task={editingTask}
                categories={categories}
                onSubmit={editingTask ? handleUpdateTask : handleAddTask}
                onCancel={handleCloseTaskForm}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-80 flex-shrink-0">
          <CategorySidebar
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
            loading={categoriesLoading}
            error={categoriesError}
            className="sticky top-8"
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="space-y-6">
            {/* Quick Add */}
            <QuickAdd
              onAddTask={handleAddTask}
              categories={categories}
            />

            {/* Search and Filters */}
            <div className="space-y-4">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search tasks..."
                className="w-full"
              />
              
              <FilterBar
                activeFilter={activeFilter}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                taskCounts={taskCounts}
              />
            </div>

            {/* Task List */}
            <TaskList
              tasks={filteredTasks}
              loading={false}
              error={null}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onBulkDelete={handleBulkDelete}
              onRetry={loadTasks}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskDashboard