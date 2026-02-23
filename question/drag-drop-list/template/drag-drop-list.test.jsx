import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Helper to get item indices
const getItemOrder = () => {
  const items = screen.getAllByRole('listitem');
  return items.map(item => item.querySelector('.item-title').textContent);
};

describe('Drag and Drop List', () => {
  test('renders list items', () => {
    render(<App />);
    
    expect(screen.getByText('Design System')).toBeInTheDocument();
    expect(screen.getByText('API Integration')).toBeInTheDocument();
    expect(screen.getByText('User Testing')).toBeInTheDocument();
    expect(screen.getByText('Documentation')).toBeInTheDocument();
  });

  test('items are draggable', () => {
    render(<App />);
    
    const items = screen.getAllByRole('listitem');
    items.forEach(item => {
      expect(item).toHaveAttribute('draggable', 'true');
    });
  });

  test('shows drag handles on items', () => {
    render(<App />);
    
    const dragHandles = screen.getAllByLabelText('Drag handle');
    expect(dragHandles.length).toBe(6);
  });

  test('shows current order in output', () => {
    render(<App />);
    
    const output = screen.getByText(/current order/i).parentElement;
    expect(output).toHaveTextContent('Design System');
    expect(output).toHaveTextContent('API Integration');
  });

  test('drag start sets dragging state', async () => {
    render(<App />);
    
    const firstItem = screen.getAllByRole('listitem')[0];
    
    fireEvent.dragStart(firstItem);
    
    expect(firstItem).toHaveClass('dragging');
  });

  test('drag over sets drag-over state', () => {
    render(<App />);
    
    const items = screen.getAllByRole('listitem');
    
    fireEvent.dragStart(items[0]);
    fireEvent.dragOver(items[2]);
    
    expect(items[2]).toHaveClass('drag-over');
  });

  test('drag leave removes drag-over state', () => {
    render(<App />);
    
    const items = screen.getAllByRole('listitem');
    
    fireEvent.dragStart(items[0]);
    fireEvent.dragOver(items[2]);
    fireEvent.dragLeave(items[2]);
    
    expect(items[2]).not.toHaveClass('drag-over');
  });

  test('drop reorders items', async () => {
    render(<App />);
    
    const items = screen.getAllByRole('listitem');
    const initialOrder = getItemOrder();
    
    // Drag first item to third position
    const dataTransfer = {
      setData: jest.fn(),
      getData: jest.fn(() => '0'),
    };
    
    fireEvent.dragStart(items[0], { dataTransfer });
    fireEvent.dragOver(items[2], { dataTransfer });
    fireEvent.drop(items[2], { dataTransfer });
    
    const newOrder = getItemOrder();
    
    // First item should now be at index 2
    expect(newOrder[2]).toBe('Design System');
    // Second item should have moved up
    expect(newOrder[0]).toBe('API Integration');
  });

  test('drag end clears dragging state', () => {
    render(<App />);
    
    const items = screen.getAllByRole('listitem');
    
    fireEvent.dragStart(items[0]);
    expect(items[0]).toHaveClass('dragging');
    
    fireEvent.dragEnd(items[0]);
    expect(items[0]).not.toHaveClass('dragging');
  });

  test('items can be moved to first position', () => {
    render(<App />);
    
    const items = screen.getAllByRole('listitem');
    
    // Drag last item to first position
    const dataTransfer = {
      setData: jest.fn(),
      getData: jest.fn(() => '5'),
    };
    
    fireEvent.dragStart(items[5]);
    fireEvent.dragOver(items[0]);
    fireEvent.drop(items[0]);
    
    const newOrder = getItemOrder();
    expect(newOrder[0]).toBe('Accessibility');
  });

  test('items can be moved to last position', () => {
    render(<App />);
    
    const items = screen.getAllByRole('listitem');
    
    // Drag first item to last position
    const dataTransfer = {
      setData: jest.fn(),
      getData: jest.fn(() => '0'),
    };
    
    fireEvent.dragStart(items[0]);
    fireEvent.dragOver(items[5]);
    fireEvent.drop(items[5]);
    
    const newOrder = getItemOrder();
    expect(newOrder[5]).toBe('Design System');
  });

  test('has correct ARIA attributes', () => {
    render(<App />);
    
    const list = screen.getByRole('list', { name: /reorderable list/i });
    expect(list).toBeInTheDocument();
    
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBe(6);
    
    // Each item should have a description
    items.forEach(item => {
      expect(item).toHaveAttribute('aria-describedby');
    });
  });

  test('keyboard support - Space to pick up (bonus)', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const items = screen.getAllByRole('listitem');
    items[0].focus();
    
    await user.keyboard('{Space}');
    
    // Item should have keyboard-dragging state
    expect(items[0]).toHaveClass('keyboard-dragging');
  });

  test('keyboard support - Arrows to move (bonus)', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const items = screen.getAllByRole('listitem');
    items[0].focus();
    
    // Pick up
    await user.keyboard('{Space}');
    
    // Move down
    await user.keyboard('{ArrowDown}');
    
    // Drop
    await user.keyboard('{Space}');
    
    const newOrder = getItemOrder();
    // Item should have moved
    expect(newOrder).not.toEqual([
      'Design System',
      'API Integration',
      'User Testing',
      'Documentation',
      'Performance',
      'Accessibility'
    ]);
  });

  test('keyboard support - Escape to cancel (bonus)', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const items = screen.getAllByRole('listitem');
    items[0].focus();
    
    // Pick up
    await user.keyboard('{Space}');
    expect(items[0]).toHaveClass('keyboard-dragging');
    
    // Cancel
    await user.keyboard('{Escape}');
    expect(items[0]).not.toHaveClass('keyboard-dragging');
    
    // Order should not have changed
    const order = getItemOrder();
    expect(order[0]).toBe('Design System');
  });
});