import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

describe('Virtual List Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders container with correct height', () => {
    render(<App />);
    
    const container = screen.getByRole('region') || 
      document.querySelector('.virtual-list-container');
    
    expect(container).toBeInTheDocument();
  });

  test('renders only a subset of items, not all 10,000', () => {
    render(<App />);
    
    // Should not have 10,000 DOM elements
    const items = document.querySelectorAll('.virtual-list-item');
    expect(items.length).toBeLessThan(100);
  });

  test('displays total items count', () => {
    render(<App />);
    
    expect(screen.getByText('10,000')).toBeInTheDocument();
  });

  test('scrollbar represents full content height', () => {
    render(<App />);
    
    const inner = document.querySelector('.virtual-list-inner');
    // 10,000 items * 50px = 500,000px
    expect(inner.style.height).toBe('500000px');
  });

  test('updates visible items on scroll', async () => {
    render(<App />);
    
    const container = document.querySelector('.virtual-list-container');
    
    // Simulate scroll
    fireEvent.scroll(container, { target: { scrollTop: 1000 } });
    
    // Force flush promises
    await waitFor(() => {
      const items = document.querySelectorAll('.virtual-list-item');
      // Items should still be limited
      expect(items.length).toBeLessThan(50);
    });
  });

  test('renders items in correct position', () => {
    render(<App />);
    
    const items = document.querySelectorAll('.virtual-list-item');
    
    // First item should be at top: 0
    const firstItem = items[0];
    expect(firstItem.style.top).toBe('0px');
  });

  test('renderItem receives correct item data', () => {
    render(<App />);
    
    // Check that items are rendered with correct text
    expect(screen.getByText('#1')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });

  test('handles itemCount change', async () => {
    const user = userEvent.setup({ delay: null });
    render(<App />);
    
    // Change item count to 1,000
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, '1000');
    
    expect(screen.getByText('1,000')).toBeInTheDocument();
    
    const inner = document.querySelector('.virtual-list-inner');
    // 1,000 items * 50px = 50,000px
    expect(inner.style.height).toBe('50000px');
  });

  test('overscan parameter affects visible item count', () => {
    render(<App />);
    
    // With overscan of 5, more items should be visible
    const items = document.querySelectorAll('.virtual-list-item');
    
    // Container shows ~8 items (400px / 50px)
    // With overscan 5 on each side, expect ~18 items
    expect(items.length).toBeGreaterThan(8);
    expect(items.length).toBeLessThan(30);
  });

  test('first visible item is near scroll position', async () => {
    render(<App />);
    
    const container = document.querySelector('.virtual-list-container');
    
    // Scroll to position 2000 (item ~40)
    fireEvent.scroll(container, { target: { scrollTop: 2000 } });
    
    await waitFor(() => {
      const items = document.querySelectorAll('.virtual-list-item');
      // First visible item should have index close to 40
      const firstItemIndex = parseInt(
        items[0].querySelector('.item-index').textContent.replace('#', ''),
        10
      );
      expect(firstItemIndex).toBeLessThan(50);
      expect(firstItemIndex).toBeGreaterThan(30);
    });
  });

  test('smooth scroll performance - no lag', async () => {
    render(<App />);
    
    const container = document.querySelector('.virtual-list-container');
    
    // Rapid scroll events
    for (let i = 0; i < 10; i++) {
      fireEvent.scroll(container, { target: { scrollTop: i * 100 } });
    }
    
    // Should handle multiple scrolls without error
    const items = document.querySelectorAll('.virtual-list-item');
    expect(items.length).toBeGreaterThan(0);
  });

  test('container has proper overflow styling', () => {
    render(<App />);
    
    const container = document.querySelector('.virtual-list-container');
    
    // Check overflow is set for scrolling
    expect(container.style.overflow).toMatch(/auto|scroll/);
  });

  test('items have correct height', () => {
    render(<App />);
    
    const items = document.querySelectorAll('.virtual-list-item');
    items.forEach(item => {
      expect(item.style.height).toBe('50px');
    });
  });

  test('displays item subtitles', () => {
    render(<App />);
    
    expect(screen.getByText(/subtitle for item 1/i)).toBeInTheDocument();
  });

  test('renders controls correctly', () => {
    render(<App />);
    
    expect(screen.getByLabelText(/item count/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/overscan/i)).toBeInTheDocument();
  });
});