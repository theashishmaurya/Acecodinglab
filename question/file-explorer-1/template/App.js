import React, { useState } from 'react';
import './styles.css';

/**
 * Folder open Icon : &#128194;
 * Folder close Icon : &#128193;
 */

export const INITIAL_FILES = {
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
  // - Open/Close folder

  return (
    <div className="file-explorer" data-testid="file-explorer">
      <div className="explorer-header" data-testid="explorer-header">
        <h2>File Explorer</h2>
      </div>
      <div className="explorer-tree" data-testid="explorer-tree">
        {/* Todo: Implement the file explorer tree */}
      </div>
    </div>
  );
};

export default App;
