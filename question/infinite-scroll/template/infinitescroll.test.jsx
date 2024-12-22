import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import App from './App';

// Mock fetch
global.fetch = jest.fn();

describe('Infinite Scroll Feed', () => {
  beforeEach(() => {
    // Mock Intersection Observer
    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    });
    window.IntersectionObserver = mockIntersectionObserver;

    // Reset fetch mock
    fetch.mockReset();
  });

  const mockFeedResponse = page => ({
    items: Array.from({ length: 10 }, (_, i) => ({
      id: page * 10 + i,
      title: `Item ${page * 10 + i}`,
      content: `Content ${page * 10 + i}`,
      timestamp: new Date().toISOString(),
    })),
    hasMore: page < 5,
    nextPage: page + 1,
  });

  test('renders initial feed items', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockFeedResponse(0)),
      }),
    );

    render(<App />);

    await waitFor(() => {
      const items = screen.getAllByTestId(/feed-item-/);
      expect(items).toHaveLength(10);
    });
  });

  test('shows loader while fetching', async () => {
    fetch.mockImplementationOnce(
      () => new Promise(resolve => setTimeout(resolve, 100)),
    );

    render(<App />);

    expect(screen.getByTestId('feed-loader')).toBeInTheDocument();
  });

  test('handles error state', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.reject(new Error('Failed to fetch')),
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('feed-error')).toBeInTheDocument();
    });
  });

  test('loads more items on scroll', async () => {
    fetch
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockFeedResponse(0)),
        }),
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockFeedResponse(1)),
        }),
      );

    render(<App />);

    await waitFor(() => {
      expect(screen.getAllByTestId(/feed-item-/)).toHaveLength(10);
    });

    // Simulate scroll to bottom
    await act(async () => {
      fireEvent.scroll(window, { target: { scrollY: 1000 } });
    });

    await waitFor(() => {
      expect(screen.getAllByTestId(/feed-item-/)).toHaveLength(20);
    });
  });
});
