import React from 'react';
import './styles.css';

function App() {
  // TODO: Implement the like/dislike functionality here

  return (
    <div className="button-container">
      <button className="button like-button">
        Like
      </button>
      <span className="count" data-testid="like-count">0</span>
      <button className="button dislike-button">
        Dislike
      </button>
      <span className="count" data-testid="dislike-count">0</span>
    </div>
  );
}

export default App;