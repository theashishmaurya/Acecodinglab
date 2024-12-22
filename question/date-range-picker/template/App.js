import React from 'react';
import './styles.css';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const App = () => {
  // TODO: Implement state management for:
  // - Selected date range (start and end dates)
  // - Current month/year being viewed
  // - Calendar navigation
  // - Hover states for range selection

  return (
    <div className="date-picker-container" data-testid="date-picker-container">
      <div className="date-inputs" data-testid="date-inputs">
        <input
          type="text"
          placeholder="Start Date"
          data-testid="start-date-input"
          readOnly
        />
        <span className="separator">to</span>
        <input
          type="text"
          placeholder="End Date"
          data-testid="end-date-input"
          readOnly
        />
      </div>

      <div className="calendar-container" data-testid="calendar-container">
        <div className="calendar-header">
          <button data-testid="prev-month">&lt;</button>
          <span data-testid="current-month">Month Year</span>
          <button data-testid="next-month">&gt;</button>
        </div>

        <div className="weekdays">
          {WEEKDAYS.map(day => (
            <div key={day} className="weekday">
              {day}
            </div>
          ))}
        </div>

        <div className="calendar-grid" data-testid="calendar-grid">
          {/* TODO: Implement calendar days */}
        </div>
      </div>
    </div>
  );
};

export default App;
