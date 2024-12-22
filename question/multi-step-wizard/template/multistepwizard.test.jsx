import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('Multi-step Wizard', () => {
  beforeEach(() => {
    render(<App />);
  });

  test('renders initial wizard structure', () => {
    expect(screen.getByTestId('wizard-container')).toBeInTheDocument();
    expect(screen.getByTestId('wizard-progress')).toBeInTheDocument();
    expect(screen.getByTestId('wizard-content')).toBeInTheDocument();
    expect(screen.getByTestId('wizard-navigation')).toBeInTheDocument();
  });

  test('shows first step initially', () => {
    expect(screen.getByTestId('step-0')).toHaveClass('active');
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  test('validates required fields before proceeding', () => {
    const nextButton = screen.getByTestId('next-button');
    fireEvent.click(nextButton);
    
    expect(screen.getByText('First Name is required')).toBeInTheDocument();
    expect(screen.getByTestId('step-0')).toHaveClass('active');
  });

  test('proceeds to next step when form is valid', () => {
    // Fill out first step
    userEvent.type(screen.getByLabelText('First Name'), 'John');
    userEvent.type(screen.getByLabelText('Last Name'), 'Doe');
    userEvent.type(screen.getByLabelText('Email'), 'john@example.com');
    
    // Click next
    fireEvent.click(screen.getByTestId('next-button'));
    
    // Should be on second step
    expect(screen.getByTestId('step-1')).toHaveClass('active');
    expect(screen.getByLabelText('Street')).toBeInTheDocument();
  });

  test('allows navigation back to previous step', () => {
    // Go to second step
    userEvent.type(screen.getByLabelText('First Name'), 'John');
    userEvent.type(screen.getByLabelText('Last Name'), 'Doe');
    userEvent.type(screen.getByLabelText('Email'), 'john@example.com');
    fireEvent.click(screen.getByTestId('next-button'));
    
    // Go back
    fireEvent.click(screen.getByTestId('prev-button'));
    
    // Should be back on first step
    expect(screen.getByTestId('step-0')).toHaveClass('active');
    expect(screen.getByLabelText('First Name')).toHaveValue('John');
  });

  // Add more tests...
});
