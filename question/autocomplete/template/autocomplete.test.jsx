import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('Autocomplete Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders input field', () => {
    render(<App />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  test('input has proper ARIA attributes', () => {
    render(<App />);
    const input = screen.getByRole('combobox');
    expect(input).toHaveAttribute('aria-autocomplete', 'list');
    expect(input).toHaveAttribute('aria-expanded', 'false');
  });

  test('shows suggestions when typing', async () => {
    render(<App />);
    const input = screen.getByRole('combobox');
    
    fireEvent.change(input, { target: { value: 'app' } });
    
    // Wait for debounce and API delay
    act(() => {
      jest.advanceTimersByTime(800);
    });
    
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
  });

  test('debounces API calls (300ms)', async () => {
    render(<App />);
    const input = screen.getByRole('combobox');
    
    // Type multiple characters quickly
    fireEvent.change(input, { target: { value: 'a' } });
    act(() => jest.advanceTimersByTime(150));
    
    fireEvent.change(input, { target: { value: 'ap' } });
    act(() => jest.advanceTimersByTime(150));
    
    fireEvent.change(input, { target: { value: 'app' } });
    
    // At this point, 300ms hasn't passed since last keystroke
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    
    // Wait for debounce
    act(() => jest.advanceTimersByTime(350));
    
    // Wait for API delay
    act(() => jest.advanceTimersByTime(500));
    
    await waitFor(() => {
      expect(screen.queryByRole('listbox') || screen.getByText(/no results/i)).toBeTruthy();
    });
  });

  test('shows loading state while fetching', async () => {
    render(<App />);
    const input = screen.getByRole('combobox');
    
    fireEvent.change(input, { target: { value: 'apple' } });
    
    act(() => jest.advanceTimersByTime(300));
    
    await waitFor(() => {
      expect(screen.getByLabelText('Loading')).toBeInTheDocument();
    });
  });

  test('shows "no results" message for empty results', async () => {
    render(<App />);
    const input = screen.getByRole('combobox');
    
    fireEvent.change(input, { target: { value: 'zzzzzzzzz' } });
    
    act(() => jest.advanceTimersByTime(800));
    
    await waitFor(() => {
      expect(screen.getByText(/no results found/i)).toBeInTheDocument();
    });
  });

  test('highlights matching text in suggestions', async () => {
    render(<App />);
    const input = screen.getByRole('combobox');
    
    fireEvent.change(input, { target: { value: 'app' } });
    
    act(() => jest.advanceTimersByTime(800));
    
    await waitFor(() => {
      const suggestion = screen.getByText('Apple', { selector: 'li' });
      // Check if matching text is highlighted with <mark>
      expect(suggestion.innerHTML.toLowerCase()).toContain('app');
    });
  });

  test('keyboard navigation - ArrowDown moves focus', async () => {
    const user = userEvent.setup({ delay: null });
    render(<App />);
    const input = screen.getByRole('combobox');
    
    fireEvent.change(input, { target: { value: 'app' } });
    act(() => jest.advanceTimersByTime(800));
    
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
    
    const suggestions = screen.getAllByRole('option');
    
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(suggestions[0]).toHaveClass('focused');
    
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(suggestions[1]).toHaveClass('focused');
  });

  test('keyboard navigation - ArrowUp moves focus up', async () => {
    render(<App />);
    const input = screen.getByRole('combobox');
    
    fireEvent.change(input, { target: { value: 'app' } });
    act(() => jest.advanceTimersByTime(800));
    
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
    
    const suggestions = screen.getAllByRole('option');
    
    // Navigate down twice, then up once
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    
    expect(suggestions[0]).toHaveClass('focused');
  });

  test('keyboard navigation - Enter selects suggestion', async () => {
    render(<App />);
    const input = screen.getByRole('combobox');
    
    fireEvent.change(input, { target: { value: 'app' } });
    act(() => jest.advanceTimersByTime(800));
    
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
    
    const suggestions = screen.getAllByRole('option');
    
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    expect(input.value).toBe(suggestions[0].textContent);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  test('keyboard navigation - Escape closes suggestions', async () => {
    render(<App />);
    const input = screen.getByRole('combobox');
    
    fireEvent.change(input, { target: { value: 'app' } });
    act(() => jest.advanceTimersByTime(800));
    
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
    
    fireEvent.keyDown(input, { key: 'Escape' });
    
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  test('click on suggestion selects it', async () => {
    const user = userEvent.setup({ delay: null });
    render(<App />);
    const input = screen.getByRole('combobox');
    
    fireEvent.change(input, { target: { value: 'app' } });
    act(() => jest.advanceTimersByTime(800));
    
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
    
    const firstSuggestion = screen.getAllByRole('option')[0];
    await user.click(firstSuggestion);
    
    expect(input.value).toBe(firstSuggestion.textContent);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  test('aria-expanded updates when suggestions appear', async () => {
    render(<App />);
    const input = screen.getByRole('combobox');
    
    expect(input).toHaveAttribute('aria-expanded', 'false');
    
    fireEvent.change(input, { target: { value: 'app' } });
    fireEvent.focus(input);
    act(() => jest.advanceTimersByTime(800));
    
    await waitFor(() => {
      expect(input).toHaveAttribute('aria-expanded', 'true');
    });
  });

  test('aria-activedescendant updates during keyboard navigation', async () => {
    render(<App />);
    const input = screen.getByRole('combobox');
    
    fireEvent.change(input, { target: { value: 'app' } });
    act(() => jest.advanceTimersByTime(800));
    
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
    
    const suggestions = screen.getAllByRole('option');
    
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    
    const activeId = input.getAttribute('aria-activedescendant');
    expect(activeId).toBe(suggestions[0].id);
  });
});