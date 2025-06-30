import { format, isToday, isTomorrow, isYesterday, differenceInDays } from 'date-fns'

export const formatRelativeDate = (date) => {
  const targetDate = new Date(date)
  
  if (isToday(targetDate)) {
    return 'Today'
  }
  
  if (isTomorrow(targetDate)) {
    return 'Tomorrow'
  }
  
  if (isYesterday(targetDate)) {
    return 'Yesterday'
  }
  
  const daysDiff = differenceInDays(targetDate, new Date())
  
  if (Math.abs(daysDiff) < 7) {
    return format(targetDate, 'EEEE') // Day of week
  }
  
  return format(targetDate, 'MMM d, yyyy')
}

export const getDueDateStatus = (dueDate, completed = false) => {
  if (!dueDate || completed) return null
  
  const today = new Date()
  const due = new Date(dueDate)
  
  if (isToday(due)) {
    return {
      status: 'today',
      text: 'Due today',
      urgent: true
    }
  }
  
  const daysDiff = differenceInDays(due, today)
  
  if (daysDiff < 0) {
    return {
      status: 'overdue',
      text: `${Math.abs(daysDiff)} day${Math.abs(daysDiff) > 1 ? 's' : ''} overdue`,
      urgent: true
    }
  }
  
  if (daysDiff === 1) {
    return {
      status: 'tomorrow',
      text: 'Due tomorrow',
      urgent: false
    }
  }
  
  if (daysDiff <= 7) {
    return {
      status: 'week',
      text: `Due in ${daysDiff} days`,
      urgent: false
    }
  }
  
  return {
    status: 'future',
    text: formatRelativeDate(dueDate),
    urgent: false
  }
}