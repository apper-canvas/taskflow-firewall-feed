import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const Error = ({ message, onRetry, type = 'general' }) => {
  const getErrorContent = () => {
    switch (type) {
      case 'network':
        return {
          icon: 'WifiOff',
          title: 'Connection Problem',
          subtitle: 'Please check your internet connection and try again.'
        }
      case 'notFound':
        return {
          icon: 'SearchX',
          title: 'Not Found',
          subtitle: 'The item you\'re looking for doesn\'t exist.'
        }
      default:
        return {
          icon: 'AlertTriangle',
          title: 'Something went wrong',
          subtitle: message || 'An unexpected error occurred. Please try again.'
        }
    }
  }

  const content = getErrorContent()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-12 px-6 text-center"
    >
      <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name={content.icon} size={24} className="text-red-600" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {content.title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {content.subtitle}
      </p>
      
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="primary"
          className="bg-gradient-primary hover:shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          <ApperIcon name="RefreshCw" size={16} className="mr-2" />
          Try Again
        </Button>
      )}
    </motion.div>
  )
}

export default Error