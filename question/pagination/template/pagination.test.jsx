import React from 'react';
import { render, fireEvent,waitFor } from '@testing-library/react';
import "@testing-library/jest-dom";
import App from './App';




describe('Pagination', () => {
  it('should fetch and render product cards', async () => {
    const { getByText, getByTestId } = render(<App />);
    const loadingDiv = getByText('');
  // Check loading state
  expect(screen.getByTestId("loading")).toBeInTheDocument();

  // Wait for products to load
  await waitFor(() => {
    expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
  }, { timeout: 5000 }); // Increased timeout for actual API call

  // Check if product cards are rendered
  const productCards = await screen.findAllByTestId(/product-/);
  expect(productCards)
  });

  it('should Render only 10 Product Cards per page', async () => {
    const { getByText, getByTestId } = render(<App />);
    const loadingDiv = getByText('');
  // Check loading state
  expect(screen.getByTestId("loading")).toBeInTheDocument();

  // Wait for products to load
  await waitFor(() => {
    expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
  }, { timeout: 5000 }); // Increased timeout for actual API call

  // Check if product cards are rendered
  const productCards = await screen.findAllByTestId(/product-/);
  expect(productCards).toHaveLength(10);
  });

});