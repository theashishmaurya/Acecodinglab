import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import App from './App';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('Infinite Image Gallery', () => {
  beforeEach(() => {
    render(<App />);
  });

  test('renders initial structure', () => {
    expect(screen.getByTestId('gallery-container')).toBeInTheDocument();
    expect(screen.getByTestId('masonry-grid')).toBeInTheDocument();
  });

  test('loads initial images', async () => {
    await waitFor(() => {
      const images = screen.getAllByTestId(/image-card-/);
      expect(images.length).toBeGreaterThan(0);
    });
  });

  test('shows loading state while fetching', () => {
    const loadingState = screen.getByTestId('loading-state');
    expect(loadingState).toBeInTheDocument();
  });

  test('loads more images on scroll', async () => {
    const initialImages = screen.getAllByTestId(/image-card-/);
    
    act(() => {
      fireEvent.scroll(window, { target: { scrollY: 2000 } });
    });

    await waitFor(() => {
      const newImages = screen.getAllByTestId(/image-card-/);
      expect(newImages.length).toBeGreaterThan(initialImages.length);
    });
  });

  test('handles image load errors', async () => {
    const errorImage = screen.getByTestId('image-card-error');
    const fallback = within(errorImage).getByTestId('error-fallback');
    expect(fallback).toBeInTheDocument();
  });

  test('updates gallery stats', async () => {
    const stats = screen.getByTestId('gallery-stats');
    await waitFor(() => {
      expect(stats.textContent).toMatch(/\d+ images loaded/);
    });
  });

  // Add more tests...
});
