import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('Data Grid', () => {
  beforeEach(() => {
    render(<App />);
  });

  test('renders initial grid structure', () => {
    expect(screen.getByTestId('data-grid-container')).toBeInTheDocument();
    expect(screen.getByTestId('grid-header')).toBeInTheDocument();
    expect(screen.getByTestId('grid-table')).toBeInTheDocument();
    expect(screen.getByTestId('grid-pagination')).toBeInTheDocument();
  });

  test('sorts data when clicking column header', async () => {
    const nameColumn = screen.getByTestId('column-name');
    fireEvent.click(nameColumn);
    
    const cells = screen.getAllByTestId(/cell-name-/);
    expect(cells[0].textContent).toBe('Bob Johnson'); // Alphabetically first
  });

  test('filters data based on search input', async () => {
    const searchInput = screen.getByTestId('search-input');
    userEvent.type(searchInput, 'John');
    
    await waitFor(() => {
      const rows = screen.getAllByTestId(/row-/);
      expect(rows).toHaveLength(1);
      expect(rows[0]).toHaveTextContent('John Doe');
    });
  });

  test('paginates data correctly', () => {
    const nextButton = screen.getByTestId('next-page');
    fireEvent.click(nextButton);
    
    const pageInfo = screen.getByTestId('page-info');
    expect(pageInfo).toHaveTextContent('Page 2');
  });

  test('resizes columns', () => {
    const resizer = screen.getByTestId('resizer-name');
    fireEvent.mouseDown(resizer);
    fireEvent.mouseMove(resizer, { clientX: 300 });
    fireEvent.mouseUp(resizer);
    
    const column = screen.getByTestId('column-name');
    expect(column).toHaveStyle({ width: '300px' });
  });

  // Add more tests for other features...
});
