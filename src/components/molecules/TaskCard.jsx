import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, isToday, isPast, isTomorrow } from 'date-fns'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Checkbox from '@/components/atoms/Checkbox'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'

const TaskCard = ({ 
  task, 
  onToggleComplete, 
  onEdit, 
  onDelete, 
  categories = [] 
}) => {
  const [isCompleting, setIsCompleting] = useState(false)
  
  const category = categories.find(cat => cat.Id === task.categoryId)
  
  const handleToggleComplete = async () => {
    if (task.completed) {
      // Uncompleting a task
      onToggleComplete(task.Id, false)
      toast.success('Task reopened!', { 
        position: "top-right",
        autoClose: 2000 
      })
    } else {
      // Completing a task
      setIsCompleting(true)
      
      // Add slight delay for animation
      setTimeout(() => {
        onToggleComplete(task.Id, true)
        setIsCompleting(false)
        toast.success('Task completed! 🎉', { 
          position: "top-right",
          autoClose: 3000 
        })
      }, 300)
    }
  }

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case 'high': return 'high'
      case 'medium': return 'medium'
      case 'low': return 'low'
      default: return 'default'
    }
  }

  const formatDueDate = (dueDate) => {
    if (!dueDate) return null
    
    const date = new Date(dueDate)
    if (isToday(date)) return 'Today'
    if (isTomorrow(date)) return 'Tomorrow'
    if (isPast(date)) return `Overdue - ${format(date, 'MMM d')}`
    return format(date, 'MMM d')
  }

  const getDueDateStyle = (dueDate) => {
    if (!dueDate) return ''
    
    const date = new Date(dueDate)
    if (isPast(date) && !isToday(date)) return 'text-accent-600 bg-accent-50'
    if (isToday(date)) return 'text-warning bg-yellow-50'
    return 'text-gray-600 bg-gray-50'
  }

  return (
    <AnimatePresence>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: isCompleting ? 0.7 : 1, 
          y: 0,
          x: isCompleting ? -20 : 0,
          scale: isCompleting ? 0.98 : 1
        }}
        exit={{ 
          opacity: 0, 
          x: -100, 
          scale: 0.95,
          transition: { duration: 0.3 }
        }}
        whileHover={{ 
          y: -2, 
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)' 
        }}
        className={`
          bg-white rounded-xl p-6 shadow-soft border border-gray-100
          transition-all duration-200 ease-out
          ${task.completed ? 'opacity-60' : ''}
          ${isCompleting ? 'animate-pulse' : ''}
        `}
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 pt-1">
            <Checkbox
              checked={task.completed}
              onChange={() => handleToggleComplete()}
              disabled={isCompleting}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className={`
                font-display font-semibold text-lg leading-tight
                ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}
              `}>
                {task.title}
              </h3>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant={getPriorityVariant(task.priority)} size="sm">
                  {task.priority}
                </Badge>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Edit3"
                    onClick={() => onEdit(task)}
                    className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-primary-50"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Trash2"
                    onClick={() => onDelete(task.Id)}
                    className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-accent-50 text-accent-600"
                  />
                </div>
              </div>
            </div>
            
            {task.description && (
              <p className={`
                text-sm mb-3 leading-relaxed
                ${task.completed ? 'text-gray-400' : 'text-gray-600'}
              `}>
                {task.description}
              </p>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {category && (
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-xs font-medium text-gray-500">
                      {category.name}
                    </span>
                  </div>
                )}
                
                {task.dueDate && (
                  <div className={`
                    flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                    ${getDueDateStyle(task.dueDate)}
                  `}>
                    <ApperIcon name="Calendar" size={12} />
                    {formatDueDate(task.dueDate)}
                  </div>
                )}
              </div>
              
              {task.completed && task.completedAt && (
                <div className="text-xs text-gray-400 flex items-center gap-1">
                  <ApperIcon name="CheckCircle" size={12} />
                  Completed {format(new Date(task.completedAt), 'MMM d')}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default TaskCard