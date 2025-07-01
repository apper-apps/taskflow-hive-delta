import { useState, useEffect, useMemo } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { motion, AnimatePresence } from 'framer-motion'
import { format, isToday, isPast, startOfMonth, endOfMonth } from 'date-fns'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import TaskForm from '@/components/molecules/TaskForm'
import * as taskService from '@/services/api/taskService'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = momentLocalizer(moment)

const CalendarView = ({
  tasks = [],
  categories = [],
  onTaskToggle,
  onTaskEdit,
  onTaskDelete,
  onTaskCreate,
  selectedDate,
  onDateSelect,
  dateRange,
  onDateRangeChange
}) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedTasks, setSelectedTasks] = useState([])
  const [showTaskDetail, setShowTaskDetail] = useState(false)
  const [calendarView, setCalendarView] = useState('month')

  // Filter tasks based on date range if provided
  const filteredTasks = useMemo(() => {
    if (!dateRange.start && !dateRange.end) {
      return tasks
    }

    return tasks.filter(task => {
      if (!task.dueDate) return false
      
      const taskDate = new Date(task.dueDate)
      const start = dateRange.start ? new Date(dateRange.start) : null
      const end = dateRange.end ? new Date(dateRange.end) : null
      
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
  }, [tasks, dateRange])

  // Convert tasks to calendar events
  const calendarEvents = useMemo(() => {
    return filteredTasks
      .filter(task => task.dueDate)
      .map(task => ({
        id: task.Id,
        title: task.title,
        start: new Date(task.dueDate),
        end: new Date(task.dueDate),
        resource: task,
        allDay: true
      }))
  }, [filteredTasks])

  // Handle event selection
  const handleSelectEvent = (event) => {
    const task = event.resource
    const tasksForDate = filteredTasks.filter(t => 
      t.dueDate && new Date(t.dueDate).toDateString() === event.start.toDateString()
    )
    
    setSelectedTasks(tasksForDate)
    setShowTaskDetail(true)
    onDateSelect(event.start)
  }

  // Handle date selection
  const handleSelectSlot = ({ start }) => {
    const tasksForDate = filteredTasks.filter(task => 
      task.dueDate && new Date(task.dueDate).toDateString() === start.toDateString()
    )
    
    setSelectedTasks(tasksForDate)
    setShowTaskDetail(true)
    onDateSelect(start)
  }

  // Custom event component
  const EventComponent = ({ event }) => {
    const task = event.resource
    const category = categories.find(cat => cat.Id === task.categoryId)
    
    const getPriorityColor = (priority) => {
      switch (priority) {
        case 'high': return 'bg-red-500'
        case 'medium': return 'bg-yellow-500'
        case 'low': return 'bg-green-500'
        default: return 'bg-gray-400'
      }
    }

    return (
      <div className={`
        text-xs p-1 rounded-sm text-white font-medium truncate
        ${task.completed ? 'opacity-60 line-through' : ''}
        ${getPriorityColor(task.priority)}
      `}>
        <div className="flex items-center gap-1">
          {task.completed && <ApperIcon name="Check" size={10} />}
          <span className="truncate">{task.title}</span>
        </div>
      </div>
    )
  }

  // Custom day cell wrapper
  const DayWrapper = ({ children, value }) => {
    const dayTasks = filteredTasks.filter(task => 
      task.dueDate && new Date(task.dueDate).toDateString() === value.toDateString()
    )
    
    const hasOverdue = dayTasks.some(task => 
      !task.completed && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate))
    )
    
    const hasToday = isToday(value)
    
    return (
      <div className={`
        h-full relative
        ${hasToday ? 'bg-primary-50' : ''}
        ${hasOverdue ? 'bg-red-50' : ''}
      `}>
        {children}
        {dayTasks.length > 0 && (
          <div className="absolute top-1 right-1">
            <span className={`
              inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full
              ${hasOverdue ? 'bg-red-500 text-white' : 'bg-primary-500 text-white'}
            `}>
              {dayTasks.length}
            </span>
          </div>
        )}
      </div>
    )
  }

  const handleTaskQuickToggle = async (taskId, completed) => {
    try {
      await onTaskToggle(taskId, completed)
      // Update local state
      setSelectedTasks(prev => prev.map(task => 
        task.Id === taskId ? { ...task, completed } : task
      ))
      toast.success(completed ? 'Task completed!' : 'Task reopened!')
    } catch (error) {
      toast.error('Failed to update task')
    }
  }

  const handleTaskQuickDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return
    }
    
    try {
      await onTaskDelete(taskId)
      setSelectedTasks(prev => prev.filter(task => task.Id !== taskId))
      toast.success('Task deleted successfully')
    } catch (error) {
      toast.error('Failed to delete task')
    }
  }

  return (
    <div className="space-y-6">
      {/* Calendar Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          
          <div className="flex bg-gray-100 rounded-lg p-1">
            {['month', 'week', 'day'].map((view) => (
              <button
                key={view}
                onClick={() => setCalendarView(view)}
                className={`
                  px-3 py-1 rounded-md text-sm font-medium transition-all capitalize
                  ${calendarView === view 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                {view}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon="ChevronLeft"
            onClick={() => setCurrentDate(moment(currentDate).subtract(1, calendarView).toDate())}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
            className="text-sm"
          >
            Today
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon="ChevronRight"
            onClick={() => setCurrentDate(moment(currentDate).add(1, calendarView).toDate())}
          />
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden">
        <div className="h-[600px] p-4">
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            date={currentDate}
            onNavigate={setCurrentDate}
            view={calendarView}
            onView={setCalendarView}
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            selectable
            components={{
              event: EventComponent,
              dateCellWrapper: DayWrapper
            }}
            eventPropGetter={(event) => ({
              style: {
                backgroundColor: 'transparent',
                border: 'none',
                padding: 0,
                margin: '1px 0'
              }
            })}
            dayPropGetter={(date) => ({
              style: {
                backgroundColor: isToday(date) ? '#f0f9ff' : 'transparent'
              }
            })}
            toolbar={false}
            popup={false}
            step={60}
            showMultiDayTimes={false}
          />
        </div>
      </div>

      {/* Task Detail Panel */}
      <AnimatePresence>
        {showTaskDetail && selectedTasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white rounded-xl shadow-soft border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Tasks for {selectedDate && format(selectedDate, 'MMMM d, yyyy')}
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedTasks.length} task{selectedTasks.length !== 1 ? 's' : ''}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                icon="X"
                onClick={() => setShowTaskDetail(false)}
                className="text-gray-400 hover:text-gray-600"
              />
            </div>

            <div className="space-y-3">
              {selectedTasks.map((task) => {
                const category = categories.find(cat => cat.Id === task.categoryId)
                
                return (
                  <motion.div
                    key={task.Id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`
                      p-4 rounded-lg border-2 transition-all
                      ${task.completed 
                        ? 'bg-gray-50 border-gray-200 opacity-75' 
                        : 'bg-white border-gray-200 hover:border-primary-200'
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => handleTaskQuickToggle(task.Id, !task.completed)}
                        className={`
                          mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all
                          ${task.completed 
                            ? 'bg-primary-500 border-primary-500' 
                            : 'border-gray-300 hover:border-primary-400'
                          }
                        `}
                      >
                        {task.completed && (
                          <ApperIcon name="Check" size={12} className="text-white" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className={`
                              font-medium text-sm
                              ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}
                            `}>
                              {task.title}
                            </h4>
                            {task.description && (
                              <p className={`
                                text-xs mt-1
                                ${task.completed ? 'text-gray-400' : 'text-gray-600'}
                              `}>
                                {task.description}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {category && (
                              <Badge
                                variant="secondary"
                                className="text-xs"
                                style={{ backgroundColor: category.color + '20', color: category.color }}
                              >
                                {category.name}
                              </Badge>
                            )}
                            
                            <Badge
                              variant={
                                task.priority === 'high' ? 'danger' :
                                task.priority === 'medium' ? 'warning' : 'success'
                              }
                              className="text-xs"
                            >
                              {task.priority}
                            </Badge>

                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="xs"
                                icon="Edit2"
                                onClick={() => onTaskEdit(task)}
                                className="text-gray-400 hover:text-primary-600"
                              />
                              <Button
                                variant="ghost"
                                size="xs"
                                icon="Trash2"
                                onClick={() => handleTaskQuickDelete(task.Id)}
                                className="text-gray-400 hover:text-red-600"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <Button
                variant="primary"
                icon="Plus"
                onClick={onTaskCreate}
                className="w-full sm:w-auto"
              >
                Add Task for This Date
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Calendar Legend */}
      <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-4">
        <div className="flex flex-wrap items-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-gray-600">High Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span className="text-gray-600">Medium Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-gray-600">Low Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary-100 border border-primary-300 rounded"></div>
            <span className="text-gray-600">Today</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
            <span className="text-gray-600">Overdue Tasks</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalendarView