import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('Modal Component', () => {
  beforeEach(() => {
    document.body.classList.remove('modal-open');
  });

  test('trigger button is rendered', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /open modal/i })).toBeInTheDocument();
  });

  test('modal opens when trigger button is clicked', () => {
    render(<App />);
    const triggerButton = screen.getByRole('button', { name: /open modal/i });
    fireEvent.click(triggerButton);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('modal has correct ARIA attributes', () => {
    render(<App />);
    const triggerButton = screen.getByRole('button', { name: /open modal/i });
    fireEvent.click(triggerButton);
    
    const modal = screen.getByRole('dialog');
    expect(modal).toHaveAttribute('aria-modal', 'true');
  });

  test('modal closes when close button is clicked', async () => {
    render(<App />);
    const triggerButton = screen.getByRole('button', { name: /open modal/i });
    fireEvent.click(triggerButton);
    
    const closeButton = screen.getByRole('button', { name: /close modal/i });
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  test('modal closes when Escape key is pressed', async () => {
    render(<App />);
    const triggerButton = screen.getByRole('button', { name: /open modal/i });
    fireEvent.click(triggerButton);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  test('modal closes when backdrop is clicked', async () => {
    render(<App />);
    const triggerButton = screen.getByRole('button', { name: /open modal/i });
    fireEvent.click(triggerButton);
    
    const backdrop = screen.getByRole('dialog').parentElement;
    fireEvent.click(backdrop);
    
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  test('body scroll is locked when modal is open', () => {
    render(<App />);
    const triggerButton = screen.getByRole('button', { name: /open modal/i });
    fireEvent.click(triggerButton);
    
    expect(document.body.classList.contains('modal-open')).toBe(true);
  });

  test('body scroll is restored when modal is closed', async () => {
    render(<App />);
    const triggerButton = screen.getByRole('button', { name: /open modal/i });
    fireEvent.click(triggerButton);
    
    const closeButton = screen.getByRole('button', { name: /close modal/i });
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(document.body.classList.contains('modal-open')).toBe(false);
    });
  });

  test('focus is trapped within modal', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const triggerButton = screen.getByRole('button', { name: /open modal/i });
    await user.click(triggerButton);
    
    const closeButton = screen.getByRole('button', { name: /close modal/i });
    expect(closeButton).toHaveFocus();
    
    // Tab through focusable elements
    await user.tab();
    expect(screen.getByRole('button', { name: /cancel/i })).toHaveFocus();
    
    await user.tab();
    expect(screen.getByRole('button', { name: /confirm/i })).toHaveFocus();
    
    // Tab should cycle back to close button (focus trap)
    await user.tab();
    expect(closeButton).toHaveFocus();
  });

  test('focus returns to trigger button when modal closes', async () => {
    render(<App />);
    const triggerButton = screen.getByRole('button', { name: /open modal/i });
    fireEvent.click(triggerButton);
    
    const closeButton = screen.getByRole('button', { name: /close modal/i });
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(triggerButton).toHaveFocus();
    });
  });

  test('modal content is accessible via keyboard', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const triggerButton = screen.getByRole('button', { name: /open modal/i });
    await user.click(triggerButton);
    
    // All focusable elements should be reachable via Tab
    const focusableButtons = screen.getAllByRole('button');
    expect(focusableButtons.length).toBe(4); // close, cancel, confirm + backdrop click handler
  });
});