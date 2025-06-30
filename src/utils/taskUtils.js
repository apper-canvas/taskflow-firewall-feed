export const getPriorityColor = (priority) => {
  const colors = {
    high: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-200',
      gradient: 'from-red-500 to-red-600'
    },
    medium: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-200',
      gradient: 'from-yellow-500 to-yellow-600'
    },
    low: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-200',
      gradient: 'from-green-500 to-green-600'
    }
  }
  
  return colors[priority] || colors.medium
}

export const getCategoryColor = (category) => {
  const colors = {
    'Work': '#5B4FF7',
    'Personal': '#FF6B6B',
    'Learning': '#4ECDC4',
    'Leisure': '#FFE66D',
    'Health': '#9B59B6',
    'Finance': '#E67E22',
    'Shopping': '#3498DB'
  }
  
  return colors[category] || '#5B4FF7'
}

export const sortTasks = (tasks, sortBy = 'priority') => {
  return [...tasks].sort((a, b) => {
    // Completed tasks always go to bottom
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }
    
    switch (sortBy) {
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
        if (priorityDiff !== 0) return priorityDiff
        break
        
      case 'dueDate':
        if (a.dueDate && b.dueDate) {
          return new Date(a.dueDate) - new Date(b.dueDate)
        }
        if (a.dueDate) return -1
        if (b.dueDate) return 1
        break
        
      case 'category':
        const categoryDiff = a.category.localeCompare(b.category)
        if (categoryDiff !== 0) return categoryDiff
        break
        
      case 'created':
        return new Date(b.createdAt) - new Date(a.createdAt)
    }
    
    // Default to creation date
    return new Date(b.createdAt) - new Date(a.createdAt)
  })
}

export const filterTasks = (tasks, filters) => {
  return tasks.filter(task => {
    // Text search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      const matchesTitle = task.title.toLowerCase().includes(searchLower)
      const matchesCategory = task.category.toLowerCase().includes(searchLower)
      if (!matchesTitle && !matchesCategory) return false
    }
    
    // Category filter
    if (filters.category && filters.category !== 'all') {
      if (task.category !== filters.category) return false
    }
    
    // Status filter
    if (filters.status) {
      switch (filters.status) {
        case 'completed':
          if (!task.completed) return false
          break
        case 'pending':
          if (task.completed) return false
          break
      }
    }
    
    // Priority filter
    if (filters.priority && filters.priority.length > 0) {
      if (!filters.priority.includes(task.priority)) return false
    }
    
    return true
  })
}

export const getTaskStats = (tasks) => {
  const total = tasks.length
  const completed = tasks.filter(task => task.completed).length
  const pending = total - completed
  const overdue = tasks.filter(task => {
    if (!task.dueDate || task.completed) return false
    const dueDate = new Date(task.dueDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return dueDate < today
  }).length
  
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0
  
  const priorityBreakdown = {
    high: tasks.filter(task => task.priority === 'high' && !task.completed).length,
    medium: tasks.filter(task => task.priority === 'medium' && !task.completed).length,
    low: tasks.filter(task => task.priority === 'low' && !task.completed).length
  }
  
  return {
    total,
    completed,
    pending,
    overdue,
    completionRate,
    priorityBreakdown
  }
}