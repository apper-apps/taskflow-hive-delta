import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { isAfter, isBefore, parseISO } from 'date-fns'
import TaskCard from '@/components/molecules/TaskCard'
import FilterBar from '@/components/molecules/FilterBar'
import Empty from '@/components/ui/Empty'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'

const TaskList = ({ 
  tasks = [], 
  categories = [],
  loading = false,
  error = null,
  onTaskToggle,
  onTaskEdit,
  onTaskDelete,
  onRetry
}) => {
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    sortBy: 'dueDate'
  })

  // Calculate task counts
  const taskCounts = useMemo(() => {
    const all = tasks.length
    const active = tasks.filter(task => !task.completed).length
    const completed = tasks.filter(task => task.completed).length
    
    return { all, active, completed }
  }, [tasks])

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks]

    // Filter by status
    if (filters.status === 'active') {
      filtered = filtered.filter(task => !task.completed)
    } else if (filters.status === 'completed') {
      filtered = filtered.filter(task => task.completed)
    }

    // Filter by priority
    if (filters.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === filters.priority)
    }

    // Sort tasks
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'dueDate':
          // No due date goes to end
          if (!a.dueDate && !b.dueDate) return 0
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return new Date(a.dueDate) - new Date(b.dueDate)
          
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
          
        case 'created':
          return new Date(b.createdAt) - new Date(a.createdAt)
          
        case 'alphabetical':
          return a.title.localeCompare(b.title)
          
        default:
          return 0
      }
    })

    return filtered
  }, [tasks, filters])

  const handleFilterChange = (type, value) => {
    if (type === 'reset') {
      setFilters({
        status: 'all',
        priority: 'all',
        sortBy: 'dueDate'
      })
    } else {
      setFilters(prev => ({
        ...prev,
        [type]: value
      }))
    }
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <Error 
        message={error}
        onRetry={onRetry}
      />
    )
  }

  if (tasks.length === 0) {
    return <Empty />
  }

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        taskCounts={taskCounts}
      />

      {/* Task Count Summary */}
      <div className="bg-white rounded-xl p-6 shadow-soft border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-semibold text-xl text-gray-900 mb-1">
              {filters.status === 'all' && 'All Tasks'}
              {filters.status === 'active' && 'Active Tasks'}
              {filters.status === 'completed' && 'Completed Tasks'}
            </h2>
            <p className="text-gray-600">
              {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
              {filters.priority !== 'all' && ` with ${filters.priority} priority`}
            </p>
          </div>
          
          {taskCounts.all > 0 && (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-success">
                  {Math.round((taskCounts.completed / taskCounts.all) * 100)}%
                </div>
                <div className="text-xs text-gray-500">Complete</div>
              </div>
              <div className="w-16 h-16 relative">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#4ECDC4"
                    strokeWidth="2"
                    strokeDasharray={`${(taskCounts.completed / taskCounts.all) * 100}, 100`}
                    className="transition-all duration-500 ease-out"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length > 0 ? (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredTasks.map((task) => (
              <motion.div
                key={task.Id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <TaskCard
                  task={task}
                  categories={categories}
                  onToggleComplete={onTaskToggle}
                  onEdit={onTaskEdit}
                  onDelete={onTaskDelete}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 shadow-soft border border-gray-100 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              {filters.status === 'completed' && (
                <div className="text-success">✓</div>
              )}
              {filters.status === 'active' && (
                <div className="text-primary-400">○</div>
              )}
              {filters.status === 'all' && (
                <div className="text-gray-400">□</div>
              )}
            </motion.div>
          </div>
          
          <h3 className="font-display font-semibold text-lg text-gray-900 mb-2">
            {filters.status === 'completed' && 'No completed tasks'}
            {filters.status === 'active' && 'No active tasks'}
            {filters.status === 'all' && 'No tasks found'}
          </h3>
          
          <p className="text-gray-600 mb-4">
            {filters.status === 'completed' && 'Complete some tasks to see them here.'}
            {filters.status === 'active' && 'All your tasks are completed! 🎉'}
            {filters.status === 'all' && 'Try adjusting your filters or create a new task.'}
          </p>
        </div>
      )}
    </div>
  )
}

export default TaskList