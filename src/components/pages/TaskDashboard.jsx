import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { useOutletContext } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import TaskList from '@/components/organisms/TaskList'
import TaskForm from '@/components/molecules/TaskForm'
import Sidebar from '@/components/organisms/Sidebar'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import * as taskService from '@/services/api/taskService'
import * as categoryService from '@/services/api/categoryService'

const TaskDashboard = () => {
  const { closeMobileSidebar } = useOutletContext() || {}
  
  // Data state
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // UI state
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [activeCategoryId, setActiveCategoryId] = useState(null)

  // Load initial data
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAllTasks(),
        categoryService.getAllCategories()
      ])
      
      setTasks(tasksData)
      setCategories(categoriesData)
    } catch (err) {
      setError('Failed to load data. Please try again.')
      console.error('Error loading data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Task operations
  const handleTaskCreate = async (taskData) => {
    try {
      const newTask = await taskService.createTask(taskData)
      setTasks(prev => [newTask, ...prev])
      setShowTaskForm(false)
      
      if (closeMobileSidebar) {
        closeMobileSidebar()
      }
      
      // Update category task count
      if (taskData.categoryId) {
        setCategories(prev => prev.map(cat => 
          cat.Id === parseInt(taskData.categoryId)
            ? { ...cat, taskCount: cat.taskCount + 1 }
            : cat
        ))
      }
    } catch (error) {
      throw error
    }
  }

  const handleTaskUpdate = async (taskData) => {
    try {
      const updatedTask = await taskService.updateTask(editingTask.Id, taskData)
      setTasks(prev => prev.map(task => 
        task.Id === editingTask.Id ? updatedTask : task
      ))
      setEditingTask(null)
      setShowTaskForm(false)
      
      if (closeMobileSidebar) {
        closeMobileSidebar()
      }
    } catch (error) {
      throw error
    }
  }

  const handleTaskSubmit = async (taskData) => {
    if (editingTask) {
      await handleTaskUpdate(taskData)
    } else {
      await handleTaskCreate(taskData)
    }
  }

  const handleTaskToggle = async (taskId, completed) => {
    try {
      const updatedTask = await taskService.updateTask(taskId, { 
        completed,
        completedAt: completed ? new Date().toISOString() : null
      })
      
      setTasks(prev => prev.map(task => 
        task.Id === taskId ? updatedTask : task
      ))
    } catch (error) {
      toast.error('Failed to update task')
      console.error('Error toggling task:', error)
    }
  }

  const handleTaskEdit = (task) => {
    setEditingTask(task)
    setShowTaskForm(true)
  }

  const handleTaskDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return
    }
    
    try {
      await taskService.deleteTask(taskId)
      const deletedTask = tasks.find(task => task.Id === taskId)
      
      setTasks(prev => prev.filter(task => task.Id !== taskId))
      
      // Update category task count
      if (deletedTask?.categoryId) {
        setCategories(prev => prev.map(cat => 
          cat.Id === deletedTask.categoryId
            ? { ...cat, taskCount: Math.max(0, cat.taskCount - 1) }
            : cat
        ))
      }
      
      toast.success('Task deleted successfully')
    } catch (error) {
      toast.error('Failed to delete task')
      console.error('Error deleting task:', error)
    }
  }

  // Category operations
  const handleCategoryCreate = async (categoryData) => {
    try {
      const newCategory = await categoryService.createCategory({
        ...categoryData,
        taskCount: 0
      })
      setCategories(prev => [...prev, newCategory])
    } catch (error) {
      throw error
    }
  }

  const handleCategoryUpdate = async (categoryId, categoryData) => {
    try {
      const updatedCategory = await categoryService.updateCategory(categoryId, categoryData)
      setCategories(prev => prev.map(cat => 
        cat.Id === categoryId ? updatedCategory : cat
      ))
    } catch (error) {
      throw error
    }
  }

  const handleCategoryDelete = async (categoryId) => {
    const categoryTasks = tasks.filter(task => task.categoryId === categoryId)
    
    if (categoryTasks.length > 0) {
      const confirmed = window.confirm(
        `This category contains ${categoryTasks.length} task(s). Deleting it will remove the category from all tasks. Continue?`
      )
      if (!confirmed) return
    }
    
    try {
      await categoryService.deleteCategory(categoryId)
      
      // Remove category from tasks
      setTasks(prev => prev.map(task => 
        task.categoryId === categoryId 
          ? { ...task, categoryId: null }
          : task
      ))
      
      // Remove category
      setCategories(prev => prev.filter(cat => cat.Id !== categoryId))
      
      // Reset active category if it was deleted
      if (activeCategoryId === categoryId) {
        setActiveCategoryId(null)
      }
      
      toast.success('Category deleted successfully')
    } catch (error) {
      toast.error('Failed to delete category')
      console.error('Error deleting category:', error)
    }
  }

  const handleCategorySelect = (categoryId) => {
    setActiveCategoryId(categoryId)
    if (closeMobileSidebar) {
      closeMobileSidebar()
    }
  }

  // Calculate task counts for categories
  const categoriesWithCounts = categories.map(category => ({
    ...category,
    taskCount: tasks.filter(task => task.categoryId === category.Id).length
  }))

  // Filter tasks by active category
  const filteredTasks = activeCategoryId 
    ? tasks.filter(task => task.categoryId === activeCategoryId)
    : tasks

  // Calculate task counts for sidebar
  const taskCounts = {
    all: tasks.length,
    active: tasks.filter(task => !task.completed).length,
    completed: tasks.filter(task => task.completed).length
  }

  const handleFormCancel = () => {
    setShowTaskForm(false)
    setEditingTask(null)
  }

  if (loading) {
    return (
      <div className="flex h-screen">
        <div className="hidden lg:block w-80 bg-white border-r border-gray-200">
          <div className="p-6">
            <div className="animate-pulse">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
              <div className="space-y-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-12 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <Loading />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen">
        <div className="hidden lg:block w-80 bg-white border-r border-gray-200"></div>
        <div className="flex-1">
          <Error message={error} onRetry={loadData} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          categories={categoriesWithCounts}
          activeCategoryId={activeCategoryId}
          onCategorySelect={handleCategorySelect}
          onCategoryCreate={handleCategoryCreate}
          onCategoryUpdate={handleCategoryUpdate}
          onCategoryDelete={handleCategoryDelete}
          taskCounts={taskCounts}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 lg:px-8 lg:py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display font-bold text-2xl lg:text-3xl text-gray-900 mb-1">
                {activeCategoryId 
                  ? categoriesWithCounts.find(cat => cat.Id === activeCategoryId)?.name || 'Category'
                  : 'All Tasks'
                }
              </h1>
              <p className="text-gray-600">
                {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'} total
              </p>
            </div>
            
            <Button
              variant="primary"
              icon="Plus"
              onClick={() => setShowTaskForm(true)}
              className="shadow-medium hover:shadow-hover"
            >
              <span className="hidden sm:inline">Add Task</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto custom-scrollbar">
            <div className="p-6 lg:p-8 max-w-6xl mx-auto">
              <AnimatePresence>
                {showTaskForm && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mb-8 bg-white rounded-xl p-6 shadow-soft border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-display font-semibold text-xl text-gray-900">
                        {editingTask ? 'Edit Task' : 'Create New Task'}
                      </h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="X"
                        onClick={handleFormCancel}
                        className="text-gray-400 hover:text-gray-600"
                      />
                    </div>
                    
                    <TaskForm
                      task={editingTask}
                      categories={categoriesWithCounts}
                      onSubmit={handleTaskSubmit}
                      onCancel={handleFormCancel}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <TaskList
                tasks={filteredTasks}
                categories={categoriesWithCounts}
                loading={false}
                error={null}
                onTaskToggle={handleTaskToggle}
                onTaskEdit={handleTaskEdit}
                onTaskDelete={handleTaskDelete}
                onRetry={loadData}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskDashboard