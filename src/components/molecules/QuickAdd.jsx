import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const QuickAdd = ({ onAddTask, categories = [], className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('medium')
  const [category, setCategory] = useState('Personal')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isExpanded])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleCancel()
      }
    }

    if (isExpanded) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isExpanded])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!title.trim()) return
    
    setIsSubmitting(true)
    
    try {
      await onAddTask({
        title: title.trim(),
        priority,
        category
      })
      
      // Reset form
      setTitle('')
      setPriority('medium')
      setCategory('Personal')
      setIsExpanded(false)
    } catch (error) {
      console.error('Error adding task:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setTitle('')
    setPriority('medium')
    setCategory('Personal')
    setIsExpanded(false)
  }

  const handleQuickAdd = () => {
    setIsExpanded(true)
  }

  const priorities = [
    { value: 'low', label: 'Low', color: 'text-green-600 bg-green-50' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600 bg-yellow-50' },
    { value: 'high', label: 'High', color: 'text-red-600 bg-red-50' }
  ]

  if (!isExpanded) {
    return (
      <motion.button
        onClick={handleQuickAdd}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          w-full p-4 bg-white border-2 border-dashed border-gray-300 rounded-xl
          hover:border-primary-400 hover:bg-primary-50 transition-all duration-200
          flex items-center justify-center space-x-3 text-gray-600 hover:text-primary-600
          ${className}
        `}
      >
        <ApperIcon name="Plus" size={20} />
        <span className="font-medium">Add a new task...</span>
      </motion.button>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`bg-white rounded-xl shadow-lg border border-gray-100 p-6 ${className}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full px-0 py-2 text-lg font-medium bg-transparent border-0 border-b-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-colors duration-200"
            disabled={isSubmitting}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Priority Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600">Priority:</span>
              <div className="flex space-x-1">
                {priorities.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPriority(p.value)}
                    className={`
                      px-3 py-1 rounded-full text-xs font-medium transition-all duration-200
                      ${priority === p.value 
                        ? p.color + ' ring-2 ring-offset-1 ring-current' 
                        : 'text-gray-500 bg-gray-100 hover:bg-gray-200'
                      }
                    `}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600">Category:</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={isSubmitting}
              >
                {categories.map((cat) => (
                  <option key={cat.Id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!title.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Adding...
                </>
              ) : (
                <>
                  <ApperIcon name="Plus" size={14} className="mr-1" />
                  Add Task
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  )
}

export default QuickAdd