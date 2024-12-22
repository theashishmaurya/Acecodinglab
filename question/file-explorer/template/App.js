import React from 'react';
import './styles.css';

const INITIAL_FILES = {
  id: 'root',
  name: 'Root',
  type: 'folder',
  children: [
    {
      id: '1',
      name: 'Documents',
      type: 'folder',
      children: [
        {
          id: '2',
          name: 'document1.txt',
          type: 'file',
        },
        {
          id: '3',
          name: 'document2.txt',
          type: 'file',
        },
      ],
    },
    {
      id: '4',
      name: 'Images',
      type: 'folder',
      children: [
        {
          id: '5',
          name: 'image1.png',
          type: 'file',
        },
      ],
    },
    {
      id: '6',
      name: 'config.json',
      type: 'file',
    },
  ],
};

const App = () => {
  // TODO: Implement state management for:
  // - File tree structure
  // - Selected items
  // - Expanded folders
  // - Context menu

  return (
    <div className="file-explorer" data-testid="file-explorer">
      <div className="explorer-header" data-testid="explorer-header">
        <h2>File Explorer</h2>
        <div className="actions">
          <button data-testid="new-folder-btn">New Folder</button>
          <button data-testid="new-file-btn">New File</button>
        </div>
      </div>

      <div className="explorer-tree" data-testid="explorer-tree">
        {/* TODO: Implement file tree */}
      </div>

      <div className="context-menu" data-testid="context-menu">
        {/* TODO: Implement context menu */}
      </div>
    </div>
  );
};

export default App;
