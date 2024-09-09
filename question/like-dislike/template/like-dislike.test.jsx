import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import App from './App';

describe('LikeDislikeButton', () => {
  it('should increment like count and activate like button when clicked', () => {
    const { getByText, getByTestId } = render(<App />);
    const likeButton = getByText('Like');
    fireEvent.click(likeButton);
    expect(likeButton).toHaveClass('active');
    expect(getByTestId('like-count')).toHaveTextContent('1');
  });

  it('should increment dislike count and activate dislike button when clicked', () => {
    const { getByText, getByTestId } = render(<App />);
    const dislikeButton = getByText('Dislike');
    fireEvent.click(dislikeButton);
    expect(dislikeButton).toHaveClass('active');
    expect(getByTestId('dislike-count')).toHaveTextContent('1');
  });

  it('should decrement like count and increment dislike count when disliking a liked post', () => {
    const { getByText, getByTestId } = render(<App />);
    const likeButton = getByText('Like');
    const dislikeButton = getByText('Dislike');
    
    fireEvent.click(likeButton);
    fireEvent.click(dislikeButton);
    
    expect(likeButton).not.toHaveClass('active');
    expect(dislikeButton).toHaveClass('active');
    expect(getByTestId('like-count')).toHaveTextContent('0');
    expect(getByTestId('dislike-count')).toHaveTextContent('1');
  });

  it('should decrement dislike count and increment like count when liking a disliked post', () => {
    const { getByText, getByTestId } = render(<App />);
    const likeButton = getByText('Like');
    const dislikeButton = getByText('Dislike');
    
    fireEvent.click(dislikeButton);
    fireEvent.click(likeButton);
    
    expect(likeButton).toHaveClass('active');
    expect(dislikeButton).not.toHaveClass('active');
    expect(getByTestId('like-count')).toHaveTextContent('1');
    expect(getByTestId('dislike-count')).toHaveTextContent('0');
  });

  it('should deactivate and decrement count when clicking an active button', () => {
    const { getByText, getByTestId } = render(<App />);
    const likeButton = getByText('Like');
    
    fireEvent.click(likeButton);
    expect(getByTestId('like-count')).toHaveTextContent('1');
    
    fireEvent.click(likeButton);
    
    expect(likeButton).not.toHaveClass('active');
    expect(getByTestId('like-count')).toHaveTextContent('0');
  });
});