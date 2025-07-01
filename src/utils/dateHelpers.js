import { 
  format, 
  isToday, 
  isTomorrow, 
  isYesterday, 
  isPast, 
  isFuture,
  differenceInDays,
  startOfDay,
  endOfDay
} from 'date-fns'

export const formatDate = (date, formatString = 'MMM d, yyyy') => {
  if (!date) return null
  return format(new Date(date), formatString)
}

export const formatRelativeDate = (date) => {
  if (!date) return null
  
  const dateObj = new Date(date)
  
  if (isToday(dateObj)) return 'Today'
  if (isTomorrow(dateObj)) return 'Tomorrow'
  if (isYesterday(dateObj)) return 'Yesterday'
  
  const daysDiff = differenceInDays(dateObj, new Date())
  
  if (daysDiff > 0 && daysDiff <= 7) {
    return `In ${daysDiff} day${daysDiff === 1 ? '' : 's'}`
  }
  
  if (daysDiff < 0 && daysDiff >= -7) {
    return `${Math.abs(daysDiff)} day${Math.abs(daysDiff) === 1 ? '' : 's'} ago`
  }
  
  return format(dateObj, 'MMM d')
}

export const getDueDateStatus = (dueDate) => {
  if (!dueDate) return 'none'
  
  const dateObj = new Date(dueDate)
  
  if (isPast(dateObj) && !isToday(dateObj)) return 'overdue'
  if (isToday(dateObj)) return 'today'
  if (isTomorrow(dateObj)) return 'tomorrow'
  if (isFuture(dateObj)) return 'upcoming'
  
  return 'none'
}

export const sortByDate = (items, dateField, order = 'asc') => {
  return [...items].sort((a, b) => {
    const dateA = a[dateField] ? new Date(a[dateField]) : null
    const dateB = b[dateField] ? new Date(b[dateField]) : null
    
    // Handle null dates (put them at the end)
    if (!dateA && !dateB) return 0
    if (!dateA) return 1
    if (!dateB) return -1
    
    const diff = dateA - dateB
    return order === 'asc' ? diff : -diff
  })
}

export const isDateInRange = (date, startDate, endDate) => {
  if (!date) return false
  
  const dateObj = new Date(date)
  const start = startDate ? startOfDay(new Date(startDate)) : null
  const end = endDate ? endOfDay(new Date(endDate)) : null
  
  if (start && end) {
    return dateObj >= start && dateObj <= end
  }
  
  if (start) {
    return dateObj >= start
  }
  
  if (end) {
    return dateObj <= end
  }
  
  return true
}

export const getDateRangeLabel = (startDate, endDate) => {
  if (!startDate && !endDate) return 'All time'
  
  if (startDate && endDate) {
    return `${format(new Date(startDate), 'MMM d')} - ${format(new Date(endDate), 'MMM d')}`
  }
  
  if (startDate) {
    return `From ${format(new Date(startDate), 'MMM d')}`
  }
  
  if (endDate) {
    return `Until ${format(new Date(endDate), 'MMM d')}`
  }
  
  return 'All time'
}