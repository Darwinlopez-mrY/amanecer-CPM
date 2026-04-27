import { useState } from 'react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'

export default function DateRangePicker({ unavailableDates = [], onSelect }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [hoverDate, setHoverDate] = useState(null)

  const isUnavailable = (date) => {
    return unavailableDates.some(unavailable => {
      const d = new Date(unavailable)
      return d.toDateString() === date.toDateString()
    })
  }

  const isSelected = (date) => {
    if (!startDate) return false
    if (startDate && !endDate) {
      return date.toDateString() === startDate.toDateString()
    }
    if (startDate && endDate) {
      return date >= startDate && date <= endDate
    }
    return false
  }

  const isInRange = (date) => {
    if (!startDate || !hoverDate) return false
    if (endDate) return false
    const start = new Date(startDate)
    const end = new Date(hoverDate)
    return date > start && date < end
  }

  const handleDateClick = (date) => {
    if (isUnavailable(date)) return
    
    if (!startDate || (startDate && endDate)) {
      setStartDate(date)
      setEndDate(null)
      onSelect && onSelect(date, null)
    } else if (startDate && !endDate) {
      if (date < startDate) {
        setStartDate(date)
        setEndDate(null)
        onSelect && onSelect(date, null)
      } else {
        setEndDate(date)
        onSelect && onSelect(startDate, date)
      }
    }
  }

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay()
  }

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1))
  }

  const renderDays = () => {
    const days = []
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10" />)
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const unavailable = isUnavailable(date)
      const selected = isSelected(date)
      const inRange = isInRange(date)
      
      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(date)}
          disabled={unavailable}
          className={`
            h-10 rounded-full text-sm transition-all
            ${unavailable && 'text-gray-300 line-through cursor-not-allowed bg-gray-50'}
            ${selected && !unavailable && 'bg-primary text-white hover:bg-primary/90'}
            ${inRange && !selected && !unavailable && 'bg-primary/20 text-primary'}
            ${!selected && !inRange && !unavailable && 'hover:bg-gray-100 text-gray-700'}
          `}
        >
          {day}
        </button>
      )
    }
    return days
  }

  const nights = startDate && endDate 
    ? Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
    : 0

  return (
    <div className="bg-white rounded-xl border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Selecciona fechas</h3>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-full">
            <ChevronLeft size={20} />
          </button>
          <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-full">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      <div className="text-center font-semibold mb-4">
        {monthNames[month]} {year}
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs text-gray-500 h-8 flex items-center justify-center">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {renderDays()}
      </div>
      
      {nights > 0 && (
        <div className="mt-4 pt-4 border-t text-center text-sm text-gray-600">
          {nights} noche{nights !== 1 ? 's' : ''} seleccionada{nights !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}