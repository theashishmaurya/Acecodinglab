import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('Rich Text Editor', () => {
  beforeEach(() => {
    render(<App />);
  });

  test('renders editor components', () => {
    expect(screen.getByTestId('editor-container')).toBeInTheDocument();
    expect(screen.getByTestId('editor-toolbar')).toBeInTheDocument();
    expect(screen.getByTestId('editor-content')).toBeInTheDocument();
    expect(screen.getByTestId('editor-footer')).toBeInTheDocument();
  });

  test('updates character count', () => {
    const content = screen.getByTestId('editor-content');
    userEvent.type(content, 'Hello World');

    expect(screen.getByTestId('char-count')).toHaveTextContent('11 characters');
  });

  test('applies bold formatting', () => {
    const boldButton = screen.getByTestId('bold-button');
    const content = screen.getByTestId('editor-content');

    content.focus();
    userEvent.type(content, 'Hello World');

    // Select text
    document.execCommand('selectAll', false, null);

    // Click bold button
    fireEvent.click(boldButton);

    expect(content.innerHTML).toMatch(/<strong>Hello World<\/strong>/);
  });

  // Add more tests for other formatting options...
});
