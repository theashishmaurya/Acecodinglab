import React, { useState, useCallback } from 'react';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DateRangePicker = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [hoverDate, setHoverDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Format date for display
  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get calendar days for current month
  const getCalendarDays = useCallback(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    
    // Add days from previous month
    for (let i = 0; i < firstDay.getDay(); i++) {
      const date = new Date(year, month, -i);
      days.unshift({
        date,
        isOtherMonth: true
      });
    }
    
    // Add days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({
        date: new Date(year, month, i),
        isOtherMonth: false
      });
    }
    
    // Add days from next month
    const remainingDays = 42 - days.length; // 6 rows × 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isOtherMonth: true
      });
    }
    
    return days;
  }, [currentDate]);

  // Handle date selection
  const handleDateClick = (date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else {
      if (date < startDate) {
        setStartDate(date);
        setEndDate(null);
      } else {
        setEndDate(date);
      }
    }
  };

  // Check if date is in range
  const isInRange = (date) => {
    if (!startDate) return false;
    if (!endDate && hoverDate) {
      return date > startDate && date < hoverDate;
    }
    return date > startDate && date < endDate;
  };

  // Navigate between months
  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  // Render calendar day
  const renderDay = (dayInfo) => {
    const { date, isOtherMonth } = dayInfo;
    
    const isStart = startDate && date.getTime() === startDate.getTime();
    const isEnd = endDate && date.getTime() === endDate.getTime();
    const isToday = new Date().toDateString() === date.toDateString();
    const inRange = isInRange(date);

    return (
      <div
        key={date.getTime()}
        className={`calendar-day ${isOtherMonth ? 'other-month' : ''}
          ${isStart ? 'range-start' : ''}
          ${isEnd ? 'range-end' : ''}
          ${inRange ? 'in-range' : ''}
          ${isToday ? 'today' : ''}`}
        onClick={() => handleDateClick(date)}
        onMouseEnter={() => setHoverDate(date)}
        data-testid={`calendar-day-${date.getDate()}`}
      >
        {date.getDate()}
      </div>
    );
  };

  return (
    <div className="date-picker-container" data-testid="date-picker-container">
      <div className="date-inputs" data-testid="date-inputs">
        <input
          type="text"
          placeholder="Start Date"
          value={formatDate(startDate)}
          readOnly
          data-testid="start-date-input"
        />
        <span className="separator">to</span>
        <input
          type="text"
          placeholder="End Date"
          value={formatDate(endDate)}
          readOnly
          data-testid="end-date-input"
        />
      </div>

      <div className="calendar-container" data-testid="calendar-container">
        <div className="calendar-header">
          <button
            onClick={() => navigateMonth(-1)}
            data-testid="prev-month"
          >
            &lt;
          </button>
          <span data-testid="current-month">
            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button
            onClick={() => navigateMonth(1)}
            data-testid="next-month"
          >
            &gt;
          </button>
        </div>

        <div className="weekdays">
          {WEEKDAYS.map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>

        <div className="calendar-grid" data-testid="calendar-grid">
          {getCalendarDays().map(day => renderDay(day))}
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker;
