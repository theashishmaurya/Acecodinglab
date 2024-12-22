import React, { useState, useEffect } from 'react';

const RichTextEditor = () => {
  const [charCount, setCharCount] = useState(0);
  const [commandStack, setCommandStack] = useState([]);
  const [stackPointer, setStackPointer] = useState(-1);

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    saveState();
  };

  const handleKeyboardShortcuts = (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          execCommand('underline');
          break;
        case 'z':
          e.preventDefault();
          if (e.shiftKey) {
            redo();
          } else {
            undo();
          }
          break;
      }
    }
  };

  const saveState = () => {
    const content = document.querySelector('[data-testid="editor-content"]').innerHTML;
    setCommandStack(prev => [...prev.slice(0, stackPointer + 1), content]);
    setStackPointer(prev => prev + 1);
  };

  const undo = () => {
    if (stackPointer > 0) {
      setStackPointer(prev => prev - 1);
      document.querySelector('[data-testid="editor-content"]').innerHTML = 
        commandStack[stackPointer - 1];
    }
  };

  const redo = () => {
    if (stackPointer < commandStack.length - 1) {
      setStackPointer(prev => prev + 1);
      document.querySelector('[data-testid="editor-content"]').innerHTML = 
        commandStack[stackPointer + 1];
    }
  };

  const updateCharCount = () => {
    const content = document.querySelector('[data-testid="editor-content"]');
    setCharCount(content.textContent.length);
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  useEffect(() => {
    const content = document.querySelector('[data-testid="editor-content"]');
    content.addEventListener('input', updateCharCount);
    content.addEventListener('keydown', handleKeyboardShortcuts);

    return () => {
      content.removeEventListener('input', updateCharCount);
      content.removeEventListener('keydown', handleKeyboardShortcuts);
    };
  }, []);

  return (
    <div className="editor-container" data-testid="editor-container">
      <div className="toolbar" data-testid="editor-toolbar">
        <button 
          data-testid="bold-button"
          onClick={() => execCommand('bold')}
        >B</button>
        <button 
          data-testid="italic-button"
          onClick={() => execCommand('italic')}
        >I</button>
        <button 
          data-testid="underline-button"
          onClick={() => execCommand('underline')}
        >U</button>
        <button 
          data-testid="heading-button"
          onClick={() => execCommand('formatBlock', '<h2>')}
        >H</button>
        <button 
          data-testid="link-button"
          onClick={insertLink}
        >Link</button>
      </div>
      
      <div 
        className="editor-content" 
        data-testid="editor-content"
        contentEditable={true}
      ></div>
      
      <div className="editor-footer" data-testid="editor-footer">
        <span data-testid="char-count">{charCount} characters</span>
      </div>
    </div>
  );
};

export default RichTextEditor; 