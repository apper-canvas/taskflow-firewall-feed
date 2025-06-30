import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const FilterBar = ({ 
  activeFilter, 
  onFilterChange, 
  onClearFilters, 
  taskCounts = {},
  className = '' 
}) => {
  const filters = [
    { key: 'all', label: 'All', icon: 'List', count: taskCounts.all || 0 },
    { key: 'pending', label: 'Pending', icon: 'Clock', count: taskCounts.pending || 0 },
    { key: 'completed', label: 'Completed', icon: 'CheckCircle', count: taskCounts.completed || 0 },
    { key: 'overdue', label: 'Overdue', icon: 'AlertTriangle', count: taskCounts.overdue || 0 },
    { key: 'today', label: 'Due Today', icon: 'Calendar', count: taskCounts.today || 0 }
  ]

  const hasActiveFilters = activeFilter !== 'all'

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {filters.map((filter) => (
          <motion.button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 whitespace-nowrap
              ${activeFilter === filter.key
                ? 'bg-gradient-primary text-white border-primary-500 shadow-lg'
                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md'
              }
            `}
          >
            <ApperIcon 
              name={filter.icon} 
              size={16} 
              className={activeFilter === filter.key ? 'text-white' : 'text-gray-500'} 
            />
            <span className="font-medium">{filter.label}</span>
            <span className={`
              px-2 py-0.5 rounded-full text-xs font-semibold
              ${activeFilter === filter.key
                ? 'bg-white/20 text-white'
                : 'bg-gray-100 text-gray-600'
              }
            `}>
              {filter.count}
            </span>
          </motion.button>
        ))}
      </div>

      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <ApperIcon name="X" size={14} className="mr-1" />
            Clear
          </Button>
        </motion.div>
      )}
    </div>
  )
}

export default FilterBar