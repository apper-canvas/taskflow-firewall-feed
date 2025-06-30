import tasksData from '@/services/mockData/tasks.json'

let tasks = [...tasksData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const taskService = {
  async getAll() {
    await delay(300)
    return [...tasks]
  },

  async getById(id) {
    await delay(200)
    const task = tasks.find(t => t.Id === parseInt(id))
    if (!task) {
      throw new Error('Task not found')
    }
    return { ...task }
  },

  async create(taskData) {
    await delay(250)
    const newTask = {
      Id: Math.max(...tasks.map(t => t.Id), 0) + 1,
      title: taskData.title,
      completed: false,
      priority: taskData.priority || 'medium',
      category: taskData.category || 'Personal',
      dueDate: taskData.dueDate || null,
      createdAt: new Date().toISOString(),
      completedAt: null
    }
    tasks.push(newTask)
    return { ...newTask }
  },

  async update(id, updates) {
    await delay(200)
    const index = tasks.findIndex(t => t.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Task not found')
    }
    
    const updatedTask = {
      ...tasks[index],
      ...updates,
      completedAt: updates.completed && !tasks[index].completed 
        ? new Date().toISOString() 
        : (!updates.completed && tasks[index].completed ? null : tasks[index].completedAt)
    }
    
    tasks[index] = updatedTask
    return { ...updatedTask }
  },

  async delete(id) {
    await delay(200)
    const index = tasks.findIndex(t => t.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Task not found')
    }
    const deletedTask = tasks.splice(index, 1)[0]
    return { ...deletedTask }
  },

  async bulkUpdate(ids, updates) {
    await delay(300)
    const updatedTasks = []
    
    for (const id of ids) {
      const index = tasks.findIndex(t => t.Id === parseInt(id))
      if (index !== -1) {
        const updatedTask = {
          ...tasks[index],
          ...updates,
          completedAt: updates.completed && !tasks[index].completed 
            ? new Date().toISOString() 
            : (!updates.completed && tasks[index].completed ? null : tasks[index].completedAt)
        }
        tasks[index] = updatedTask
        updatedTasks.push({ ...updatedTask })
      }
    }
    
    return updatedTasks
  },

  async bulkDelete(ids) {
    await delay(300)
    const deletedTasks = []
    
    // Sort ids in descending order to avoid index issues when deleting
    const sortedIds = ids.map(id => parseInt(id)).sort((a, b) => b - a)
    
    for (const id of sortedIds) {
      const index = tasks.findIndex(t => t.Id === id)
      if (index !== -1) {
        const deletedTask = tasks.splice(index, 1)[0]
        deletedTasks.push({ ...deletedTask })
      }
    }
    
    return deletedTasks.reverse() // Return in original order
  }
}