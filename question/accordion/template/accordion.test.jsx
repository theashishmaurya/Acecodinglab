import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock data for testing
const mockQuestions = [
  { id: 1, title: 'Question 1', info: 'Answer 1' },
  { id: 2, title: 'Question 2', info: 'Answer 2' },
];

// Mock the questions import
jest.mock('./data', () => mockQuestions);

describe('Accordion Component', () => {
  test('renders accordion structure', () => {
    render(<App />);
    const accordionElement = screen.getByTestId('accordion');
    expect(accordionElement).toBeInTheDocument();
    expect(accordionElement).toHaveClass('accordion');
  });

  test('renders accordion title', () => {
    render(<App />);
    const titleElement = screen.getByTestId('accordion-title');
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveClass('accordion-title');
  });

  test('renders accordion icon button', () => {
    render(<App />);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass('accordion-icon');
  });

  test('renders accordion info', () => {
    render(<App />);
    const infoElement = screen.getByTestId('accordion-info');
    expect(infoElement).toBeInTheDocument();
    expect(infoElement).toHaveClass('accordion-info');
  });

  test('toggles accordion content when button is clicked', () => {
    render(<App />);
    const buttonElement = screen.getByRole('button');
    const infoElement = screen.getByTestId('accordion-info');
    
    expect(infoElement).not.toBeVisible();
    fireEvent.click(buttonElement);
    expect(infoElement).toBeVisible();
    fireEvent.click(buttonElement);
    expect(infoElement).not.toBeVisible();
  });

  test('changes button text when toggled', () => {
    render(<App />);
    const buttonElement = screen.getByRole('button');
    
    expect(buttonElement).toHaveTextContent('-');
    fireEvent.click(buttonElement);
    expect(buttonElement).toHaveTextContent('+');
    fireEvent.click(buttonElement);
    expect(buttonElement).toHaveTextContent('-');
  });
});

describe('App Component', () => {
  test('renders App title', () => {
    render(<App />);
    expect(screen.getByText('Accordion')).toBeInTheDocument();
  });

  test('renders Accordion component', () => {
    render(<App />);
    expect(screen.getByTestId('accordion')).toBeInTheDocument();
  });
});