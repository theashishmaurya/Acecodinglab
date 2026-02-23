import React, { useState, useRef, useEffect, useCallback } from 'react';
import './styles.css';

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);
  const modalRef = useRef(null);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = useCallback(() => {
    setIsOpen(false);
    // TODO: Return focus to the trigger button
  }, []);

  // TODO: Handle Escape key press
  // TODO: Handle backdrop click
  // TODO: Implement focus trap
  // TODO: Lock body scroll when modal is open
  // TODO: Restore focus to trigger when modal closes

  return (
    <div className="app-container">
      <h1>Modal/Dialog Challenge</h1>
      <p>Click the button below to open the modal.</p>
      
      <button 
        ref={triggerRef}
        className="trigger-button"
        onClick={openModal}
        aria-haspopup="dialog"
      >
        Open Modal
      </button>

      {/* TODO: Add proper ARIA attributes and functionality */}
      {isOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Modal Title</h2>
              <button 
                className="close-button"
                onClick={closeModal}
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p>
                This is the modal content. You can put any content here.
                Try pressing Escape to close, or click outside the modal.
              </p>
              <p>
                This modal should trap focus within it. Try pressing Tab
                to cycle through focusable elements.
              </p>
            </div>
            <div className="modal-footer">
              <button className="button secondary" onClick={closeModal}>
                Cancel
              </button>
              <button className="button primary" onClick={closeModal}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;