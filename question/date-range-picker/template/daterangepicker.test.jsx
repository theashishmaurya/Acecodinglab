import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('Date Range Picker', () => {
  beforeEach(() => {
    render(<App />);
  });

  test('renders initial structure', () => {
    expect(screen.getByTestId('date-picker-container')).toBeInTheDocument();
    expect(screen.getByTestId('date-inputs')).toBeInTheDocument();
    expect(screen.getByTestId('calendar-container')).toBeInTheDocument();
  });

  test('navigates between months', () => {
    const prevButton = screen.getByTestId('prev-month');
    const nextButton = screen.getByTestId('next-month');
    const monthDisplay = screen.getByTestId('current-month');
    
    const initialMonth = monthDisplay.textContent;
    
    fireEvent.click(nextButton);
    expect(monthDisplay.textContent).not.toBe(initialMonth);
    
    fireEvent.click(prevButton);
    expect(monthDisplay.textContent).toBe(initialMonth);
  });

  test('selects date range', () => {
    const startDate = screen.getByTestId('calendar-day-15');
    const endDate = screen.getByTestId('calendar-day-20');
    
    fireEvent.click(startDate);
    fireEvent.click(endDate);
    
    expect(startDate).toHaveClass('range-start');
    expect(endDate).toHaveClass('range-end');
  });

  test('displays selected dates in inputs', () => {
    const startInput = screen.getByTestId('start-date-input');
    const endInput = screen.getByTestId('end-date-input');
    
    const startDate = screen.getByTestId('calendar-day-15');
    const endDate = screen.getByTestId('calendar-day-20');
    
    fireEvent.click(startDate);
    fireEvent.click(endDate);
    
    expect(startInput.value).not.toBe('');
    expect(endInput.value).not.toBe('');
  });

  test('highlights date range on hover', () => {
    const startDate = screen.getByTestId('calendar-day-15');
    fireEvent.click(startDate);
    
    const hoverDate = screen.getByTestId('calendar-day-18');
    fireEvent.mouseEnter(hoverDate);
    
    const inBetweenDate = screen.getByTestId('calendar-day-16');
    expect(inBetweenDate).toHaveClass('in-range');
  });

  // Add more tests...
});
