export const getPriorityWeight = (priority) => {
  const weights = {
    high: 3,
    medium: 2,
    low: 1
  }
  return weights[priority] || 0
}

export const sortTasksByPriority = (tasks, order = 'desc') => {
  return [...tasks].sort((a, b) => {
    const weightA = getPriorityWeight(a.priority)
    const weightB = getPriorityWeight(b.priority)
    
    return order === 'desc' ? weightB - weightA : weightA - weightB
  })
}

export const filterTasksByStatus = (tasks, status) => {
  switch (status) {
    case 'completed':
      return tasks.filter(task => task.completed)
    case 'active':
      return tasks.filter(task => !task.completed)
    case 'all':
    default:
      return tasks
  }
}

export const filterTasksByPriority = (tasks, priority) => {
  if (priority === 'all') return tasks
  return tasks.filter(task => task.priority === priority)
}

export const filterTasksByCategory = (tasks, categoryId) => {
  if (!categoryId) return tasks
  return tasks.filter(task => task.categoryId === categoryId)
}

export const searchTasks = (tasks, query) => {
  if (!query.trim()) return tasks
  
  const searchTerm = query.toLowerCase().trim()
  
  return tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm) ||
    task.description?.toLowerCase().includes(searchTerm)
  )
}

export const getTaskStats = (tasks) => {
  const total = tasks.length
  const completed = tasks.filter(task => task.completed).length
  const active = total - completed
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0
  
  const byPriority = {
    high: tasks.filter(task => task.priority === 'high').length,
    medium: tasks.filter(task => task.priority === 'medium').length,
    low: tasks.filter(task => task.priority === 'low').length
  }
  
  return {
    total,
    completed,
    active,
    completionRate,
    byPriority
  }
}

export const validateTaskData = (taskData) => {
  const errors = {}
  
  if (!taskData.title?.trim()) {
    errors.title = 'Task title is required'
  }
  
  if (taskData.title?.length > 200) {
    errors.title = 'Task title must be less than 200 characters'
  }
  
  if (taskData.description?.length > 1000) {
    errors.description = 'Description must be less than 1000 characters'
  }
  
  if (taskData.dueDate) {
    const dueDate = new Date(taskData.dueDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (dueDate < today) {
      errors.dueDate = 'Due date cannot be in the past'
    }
  }
  
  if (taskData.priority && !['high', 'medium', 'low'].includes(taskData.priority)) {
    errors.priority = 'Invalid priority level'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export const generateTaskId = (existingTasks = []) => {
  const maxId = existingTasks.length > 0 
    ? Math.max(...existingTasks.map(task => task.Id || 0))
    : 0
  return maxId + 1
}