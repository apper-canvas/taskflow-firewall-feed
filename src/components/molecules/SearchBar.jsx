import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Input from '@/components/atoms/Input'

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search tasks...", 
  className = '',
  debounceMs = 300
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [searchTerm, onSearch, debounceMs])

  const handleClear = () => {
    setSearchTerm('')
  }

  return (
    <motion.div 
      className={`relative ${className}`}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <ApperIcon 
            name="Search" 
            size={18} 
            className={`transition-colors duration-200 ${
              isFocused ? 'text-primary-500' : 'text-gray-400'
            }`} 
          />
        </div>
        
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`
            w-full pl-10 pr-10 py-3 text-sm border rounded-xl transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            bg-white shadow-sm hover:shadow-md
            ${isFocused 
              ? 'border-primary-300 shadow-lg' 
              : 'border-gray-200 hover:border-gray-300'
            }
          `}
        />
        
        {searchTerm && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-700 transition-colors duration-200"
          >
            <ApperIcon name="X" size={16} className="text-gray-400" />
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

export default SearchBar