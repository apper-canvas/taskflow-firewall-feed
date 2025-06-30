import { motion } from 'framer-motion'

const Loading = ({ type = 'tasks' }) => {
  const renderTaskSkeleton = () => (
    <div className="space-y-4">
      {[...Array(6)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
        >
          <div className="flex items-center space-x-4">
            <div className="w-5 h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse w-3/4" />
              <div className="flex items-center space-x-2">
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse w-16" />
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse w-20" />
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse w-24" />
              </div>
            </div>
            <div className="w-8 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
          </div>
        </motion.div>
      ))}
    </div>
  )

  const renderCategorySkeleton = () => (
    <div className="space-y-3">
      {[...Array(4)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center space-x-3 p-3 rounded-lg"
        >
          <div className="w-3 h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse" />
          <div className="flex-1 h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
          <div className="w-6 h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
        </motion.div>
      ))}
    </div>
  )

  return (
    <div className="w-full">
      {type === 'tasks' && renderTaskSkeleton()}
      {type === 'categories' && renderCategorySkeleton()}
      {type === 'spinner' && (
        <div className="flex justify-center items-center py-8">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  )
}

export default Loading