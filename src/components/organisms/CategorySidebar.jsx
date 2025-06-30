import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Loading from '@/components/ui/Loading'
import Empty from '@/components/ui/Empty'

const CategorySidebar = ({ 
  categories = [], 
  activeCategory, 
  onCategoryChange, 
  loading = false,
  error = null,
  className = '' 
}) => {
  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 font-display">Categories</h2>
        </div>
        <Loading type="categories" />
      </div>
    )
  }

  if (error) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 font-display">Categories</h2>
        </div>
        <div className="text-center py-8">
          <ApperIcon name="AlertTriangle" size={24} className="text-red-500 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Failed to load categories</p>
        </div>
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 font-display">Categories</h2>
        </div>
        <Empty type="category" />
      </div>
    )
  }

  const allTasksCount = categories.reduce((sum, cat) => sum + cat.taskCount, 0)

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 font-display mb-2">Categories</h2>
        <p className="text-sm text-gray-600">Organize your tasks</p>
      </div>

      <nav className="space-y-2">
        {/* All Tasks */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onCategoryChange('all')}
          className={`
            w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200
            ${activeCategory === 'all'
              ? 'bg-gradient-primary text-white shadow-lg'
              : 'text-gray-700 hover:bg-gray-50'
            }
          `}
        >
          <div className="flex items-center space-x-3">
            <ApperIcon 
              name="List" 
              size={18} 
              className={activeCategory === 'all' ? 'text-white' : 'text-gray-500'} 
            />
            <span className="font-medium">All Tasks</span>
          </div>
          <span className={`
            px-2 py-1 rounded-full text-xs font-semibold
            ${activeCategory === 'all'
              ? 'bg-white/20 text-white'
              : 'bg-gray-100 text-gray-600'
            }
          `}>
            {allTasksCount}
          </span>
        </motion.button>

        {/* Category List */}
        {categories.map((category) => (
          <motion.button
            key={category.Id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onCategoryChange(category.name)}
            className={`
              w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200
              ${activeCategory === category.name
                ? 'bg-gradient-primary text-white shadow-lg'
                : 'text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            <div className="flex items-center space-x-3">
              <div 
                className="w-3 h-3 rounded-full shadow-sm"
                style={{ 
                  backgroundColor: activeCategory === category.name ? 'white' : category.color 
                }}
              />
              <span className="font-medium">{category.name}</span>
            </div>
            <span className={`
              px-2 py-1 rounded-full text-xs font-semibold
              ${activeCategory === category.name
                ? 'bg-white/20 text-white'
                : 'bg-gray-100 text-gray-600'
              }
            `}>
              {category.taskCount}
            </span>
          </motion.button>
        ))}
      </nav>

      {/* Quick Stats */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Stats</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Categories</span>
            <span className="font-semibold text-gray-900">{categories.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Tasks</span>
            <span className="font-semibold text-gray-900">{allTasksCount}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategorySidebar