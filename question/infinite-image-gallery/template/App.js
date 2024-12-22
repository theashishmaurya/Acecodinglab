import React from 'react';
import './styles.css';

// Sample API endpoint (replace with actual API in production)
const API_URL = 'https://api.unsplash.com/photos/random';
const API_KEY = 'YOUR_API_KEY'; // Replace with actual API key

const App = () => {
  // TODO: Implement state management for:
  // - Image collection
  // - Loading states
  // - Error handling
  // - Infinite scroll
  // - Masonry layout

  return (
    <div className="gallery-container" data-testid="gallery-container">
      <div className="gallery-header">
        <h1>Infinite Image Gallery</h1>
        <div className="gallery-stats" data-testid="gallery-stats">
          <span>0 images loaded</span>
        </div>
      </div>

      <div className="masonry-grid" data-testid="masonry-grid">
        {/* TODO: Implement masonry grid with images */}
      </div>

      <div className="loading-state" data-testid="loading-state">
        <div className="loading-spinner"></div>
        <p>Loading more images...</p>
      </div>

      <div
        className="error-state"
        data-testid="error-state"
        style={{ display: 'none' }}
      >
        <p>Error loading images. Please try again.</p>
        <button>Retry</button>
      </div>
    </div>
  );
};

export default App;
