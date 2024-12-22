import React from 'react';
import './styles.css';

const App = () => {
  // TODO: Implement rich text editor functionality

  return (
    <div className="editor-container" data-testid="editor-container">
      <div className="toolbar" data-testid="editor-toolbar">
        <button data-testid="bold-button">B</button>
        <button data-testid="italic-button">I</button>
        <button data-testid="underline-button">U</button>
        <button data-testid="heading-button">H</button>
        <button data-testid="link-button">Link</button>
      </div>

      <div
        className="editor-content"
        data-testid="editor-content"
        contentEditable={true}
      ></div>

      <div className="editor-footer" data-testid="editor-footer">
        <span data-testid="char-count">0 characters</span>
      </div>
    </div>
  );
};

export default App;
