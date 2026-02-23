import React, { useState, useRef, useCallback } from 'react';
import './styles.css';

// Initial list items
const initialItems = [
  { id: '1', title: 'Design System', description: 'Create component library' },
  { id: '2', title: 'API Integration', description: 'Connect to backend services' },
  { id: '3', title: 'User Testing', description: 'Conduct usability tests' },
  { id: '4', title: 'Documentation', description: 'Write technical docs' },
  { id: '5', title: 'Performance', description: 'Optimize bundle size' },
  { id: '6', title: 'Accessibility', description: 'Ensure WCAG compliance' },
];

function DragDropList() {
  const [items, setItems] = useState(initialItems);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [dragStartIndex, setDragStartIndex] = useState(null);
  
  // TODO: Implement drag start
  const handleDragStart = (e, item, index) => {
    // Set dragged item
    // Set drag data
    // Add visual feedback
  };
  
  // TODO: Implement drag over
  const handleDragOver = (e, index) => {
    // Prevent default to allow drop
    // Calculate over position
    // Update visual feedback
  };
  
  // TODO: Implement drag leave
  const handleDragLeave = (e) => {
    // Clear drag over state
  };
  
  // TODO: Implement drop
  const handleDrop = (e, dropIndex) => {
    // Reorder items
    // Clear drag state
    // Callback with new order
  };
  
  // TODO: Implement drag end
  const handleDragEnd = (e) => {
    // Clean up visual state
    // Clear all drag state
  };
  
  // Keyboard support (bonus)
  const handleKeyDown = (e, item, index) => {
    // TODO: Implement keyboard reordering
    // Space/Enter to pick up
    // Arrows to move
    // Space/Enter to drop
    // Escape to cancel
  };

  return (
    <div className="drag-drop-container">
      <h2>Priority List</h2>
      <p className="subtitle">Drag items to reorder priority</p>
      
      <ul className="item-list" role="list" aria-label="Reorderable list">
        {items.map((item, index) => (
          <li
            key={item.id}
            className={`item ${draggedItem?.id === item.id ? 'dragging' : ''} ${
              dragOverIndex === index ? 'drag-over' : ''
            }`}
            draggable
            onDragStart={(e) => handleDragStart(e, item, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            onKeyDown={(e) => handleKeyDown(e, item, index)}
            role="listitem"
            aria-describedby={`item-${item.id}-description`}
          >
            <div 
              className="drag-handle"
              aria-label="Drag handle"
              aria-roledescription="Draggable item. Press Space to pick up"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <circle cx="9" cy="6" r="1.5" />
                <circle cx="15" cy="6" r="1.5" />
                <circle cx="9" cy="12" r="1.5" />
                <circle cx="15" cy="12" r="1.5" />
                <circle cx="9" cy="18" r="1.5" />
                <circle cx="15" cy="18" r="1.5" />
              </svg>
            </div>
            
            <div className="item-content">
              <span className="item-title">{item.title}</span>
              <span className="item-description" id={`item-${item.id}-description`}>
                {item.description}
              </span>
            </div>
            
            <span className="item-number">{index + 1}</span>
          </li>
        ))}
      </ul>
      
      <div className="output">
        <h3>Current Order:</h3>
        <pre>{JSON.stringify(items.map(i => i.title), null, 2)}</pre>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="app-container">
      <h1>Drag and Drop List</h1>
      <p>Implement a reorderable list with smooth animations.</p>
      
      <DragDropList />
    </div>
  );
}

export default App;