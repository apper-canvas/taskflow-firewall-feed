import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const Empty = ({ type = 'tasks', onAction, actionText = 'Get Started' }) => {
  const getEmptyContent = () => {
    switch (type) {
      case 'tasks':
        return {
          icon: 'CheckSquare',
          title: 'No tasks yet',
          subtitle: 'Create your first task to get organized and stay productive.',
          gradient: 'from-primary-100 to-primary-200',
          iconColor: 'text-primary-600'
        }
      case 'completed':
        return {
          icon: 'Trophy',
          title: 'No completed tasks',
          subtitle: 'Complete some tasks to see your achievements here.',
          gradient: 'from-green-100 to-green-200',
          iconColor: 'text-green-600'
        }
      case 'search':
        return {
          icon: 'Search',
          title: 'No results found',
          subtitle: 'Try adjusting your search criteria or create a new task.',
          gradient: 'from-gray-100 to-gray-200',
          iconColor: 'text-gray-600'
        }
      case 'category':
        return {
          icon: 'FolderOpen',
          title: 'No tasks in this category',
          subtitle: 'Add tasks to this category to see them here.',
          gradient: 'from-blue-100 to-blue-200',
          iconColor: 'text-blue-600'
        }
      default:
        return {
          icon: 'Inbox',
          title: 'Nothing here yet',
          subtitle: 'Start by adding some content to get things organized.',
          gradient: 'from-gray-100 to-gray-200',
          iconColor: 'text-gray-600'
        }
    }
  }

  const content = getEmptyContent()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <div className={`w-20 h-20 bg-gradient-to-br ${content.gradient} rounded-full flex items-center justify-center mb-6 shadow-lg`}>
        <ApperIcon name={content.icon} size={32} className={content.iconColor} />
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">
        {content.title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-sm leading-relaxed">
        {content.subtitle}
      </p>
      
      {onAction && (
        <Button
          onClick={onAction}
          variant="primary"
          className="bg-gradient-primary hover:shadow-xl transform hover:scale-105 transition-all duration-200 px-6 py-3"
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          {actionText}
        </Button>
      )}
    </motion.div>
  )
}

export default Empty