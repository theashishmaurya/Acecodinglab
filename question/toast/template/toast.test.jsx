import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App, { ToastProvider, useToast } from './App';

// Helper to render with ToastProvider
const renderWithProvider = (ui, options = {}) => {
  return render(
    <ToastProvider {...options}>
      {ui}
    </ToastProvider>
  );
};

// Test component that uses toast
function TestComponent({ onMount }) {
  const toast = useToast();
  
  React.useEffect(() => {
    if (onMount) onMount(toast);
  }, [onMount, toast]);
  
  return null;
}

describe('Toast Notification System', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders trigger buttons', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /success toast/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /error toast/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /warning toast/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /info toast/i })).toBeInTheDocument();
  });

  test('shows success toast when clicked', async () => {
    const user = userEvent.setup({ delay: null });
    render(<App />);
    
    await user.click(screen.getByRole('button', { name: /success toast/i }));
    
    expect(screen.getByRole('alert')).toHaveTextContent('Operation completed successfully!');
  });

  test('shows error toast with custom duration', async () => {
    const user = userEvent.setup({ delay: null });
    render(<App />);
    
    await user.click(screen.getByRole('button', { name: /error toast/i }));
    
    const toast = screen.getByRole('alert');
    expect(toast).toHaveTextContent('Something went wrong!');
    expect(toast).toHaveClass('toast-error');
  });

  test('shows warning toast with title', async () => {
    const user = userEvent.setup({ delay: null });
    render(<App />);
    
    await user.click(screen.getByRole('button', { name: /warning toast/i }));
    
    const toast = screen.getByRole('alert');
    expect(toast).toHaveTextContent('Warning');
    expect(toast).toHaveTextContent('Please review your input');
  });

  test('shows multiple toasts stacked', async () => {
    const user = userEvent.setup({ delay: null });
    render(<App />);
    
    await user.click(screen.getByRole('button', { name: /multiple toasts/i }));
    
    const toasts = screen.getAllByRole('alert');
    expect(toasts.length).toBe(3);
  });

  test('toast auto-dismisses after duration', async () => {
    renderWithProvider(<TestComponent onMount={toast => {
      toast.success('Auto dismiss test', { duration: 3000 });
    }} />);
    
    expect(screen.getByRole('alert')).toBeInTheDocument();
    
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    // Wait for exit animation
    act(() => {
      jest.advanceTimersByTime(300);
    });
    
    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  test('toast dismisses on close button click', async () => {
    const user = userEvent.setup({ delay: null });
    render(<App />);
    
    await user.click(screen.getByRole('button', { name: /success toast/i }));
    
    const dismissButton = screen.getByRole('button', { name: 'Dismiss' });
    await user.click(dismissButton);
    
    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  test('dismissAll removes all toasts', async () => {
    const user = userEvent.setup({ delay: null });
    render(<App />);
    
    await user.click(screen.getByRole('button', { name: /multiple toasts/i }));
    
    expect(screen.getAllByRole('alert').length).toBe(3);
    
    await user.click(screen.getByRole('button', { name: /dismiss all/i }));
    
    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  test('toast progress bar decreases over time', async () => {
    renderWithProvider(<TestComponent onMount={toast => {
      toast.success('Progress test', { duration: 5000 });
    }} />);
    
    const progressBar = screen.getByRole('alert').querySelector('.toast-progress');
    
    // Initial progress should be 100%
    expect(progressBar.style.width).toBe('100%');
    
    act(() => {
      jest.advanceTimersByTime(2500);
    });
    
    // After half duration, progress should be around 50%
    expect(parseFloat(progressBar.style.width)).toBeLessThan(60);
    expect(parseFloat(progressBar.style.width)).toBeGreaterThan(40);
  });

  test('toast pauses on hover', async () => {
    const user = userEvent.setup({ delay: null });
    render(<App />);
    
    await user.click(screen.getByRole('button', { name: /success toast/i }));
    
    const toast = screen.getByRole('alert');
    const progressBar = toast.querySelector('.toast-progress');
    
    act(() => jest.advanceTimersByTime(1000));
    
    const widthBeforeHover = parseFloat(progressBar.style.width);
    
    await user.hover(toast);
    
    act(() => jest.advanceTimersByTime(1000));
    
    // Progress should not have changed much while hovering
    const widthAfterHover = parseFloat(progressBar.style.width);
    expect(Math.abs(widthBeforeHover - widthAfterHover)).toBeLessThan(5);
  });

  test('toast has correct aria attributes', async () => {
    const user = userEvent.setup({ delay: null });
    render(<App />);
    
    await user.click(screen.getByRole('button', { name: /success toast/i }));
    
    const toast = screen.getByRole('alert');
    expect(toast).toHaveAttribute('aria-live', 'polite');
  });

  test('toast has correct type-specific styling', async () => {
    const user = userEvent.setup({ delay: null });
    render(<App />);
    
    await user.click(screen.getByRole('button', { name: /success toast/i }));
    expect(screen.getByRole('alert')).toHaveClass('toast-success');
    
    await user.click(screen.getByRole('button', { name: /error toast/i }));
    expect(screen.getAllByRole('alert')[0]).toHaveClass('toast-error');
  });

  test('toast appears in correct position', () => {
    renderWithProvider(<TestComponent onMount={toast => {
      toast.success('Position test');
    }} />, { position: 'bottom-left' });
    
    const container = screen.getByRole('alert').parentElement;
    expect(container).toHaveClass('toast-bottom-left');
  });
});