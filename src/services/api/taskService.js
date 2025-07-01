import tasksData from '@/services/mockData/tasks.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// In-memory storage for demo purposes
let tasks = [...tasksData]

export const getAllTasks = async () => {
  await delay(300)
  return [...tasks]
}

export const getTaskById = async (id) => {
  await delay(200)
  const task = tasks.find(task => task.Id === parseInt(id))
  if (!task) {
    throw new Error('Task not found')
  }
  return { ...task }
}

export const createTask = async (taskData) => {
  await delay(400)
  
  // Find the highest Id and add 1
  const maxId = tasks.length > 0 ? Math.max(...tasks.map(task => task.Id)) : 0
  const newTask = {
    Id: maxId + 1,
    ...taskData,
    categoryId: taskData.categoryId ? parseInt(taskData.categoryId) : null,
    completed: false,
    createdAt: new Date().toISOString(),
    completedAt: null
  }
  
  tasks.unshift(newTask)
  return { ...newTask }
}

export const updateTask = async (id, taskData) => {
  await delay(300)
  
  const index = tasks.findIndex(task => task.Id === parseInt(id))
  if (index === -1) {
    throw new Error('Task not found')
  }
  
  const updatedTask = {
    ...tasks[index],
    ...taskData,
    categoryId: taskData.categoryId ? parseInt(taskData.categoryId) : null
  }
  
  tasks[index] = updatedTask
  return { ...updatedTask }
}

export const deleteTask = async (id) => {
  await delay(250)
  
  const index = tasks.findIndex(task => task.Id === parseInt(id))
  if (index === -1) {
    throw new Error('Task not found')
  }
  
  tasks.splice(index, 1)
  return true
}

export const getTasksByCategory = async (categoryId) => {
  await delay(200)
  const filteredTasks = tasks.filter(task => task.categoryId === parseInt(categoryId))
  return [...filteredTasks]
}

export const getTasksByStatus = async (completed) => {
  await delay(200)
  const filteredTasks = tasks.filter(task => task.completed === completed)
  return [...filteredTasks]
}

export const getTasksByPriority = async (priority) => {
  await delay(200)
  const filteredTasks = tasks.filter(task => task.priority === priority)
  return [...filteredTasks]
}

export const getTasksByDateRange = async (startDate, endDate) => {
  await delay(200)
  
  const filteredTasks = tasks.filter(task => {
    if (!task.dueDate) return false
    
    const taskDate = new Date(task.dueDate)
    const start = startDate ? new Date(startDate) : null
    const end = endDate ? new Date(endDate) : null
    
    if (start && end) {
      return taskDate >= start && taskDate <= end
    }
    
    if (start) {
      return taskDate >= start
    }
    
    if (end) {
      return taskDate <= end
    }
    
    return true
  })
  
  return [...filteredTasks]
}

export const getTasksByDate = async (date) => {
  await delay(200)
  
  const targetDate = new Date(date)
  const filteredTasks = tasks.filter(task => {
    if (!task.dueDate) return false
    
    const taskDate = new Date(task.dueDate)
    return taskDate.toDateString() === targetDate.toDateString()
  })
  
  return [...filteredTasks]
}