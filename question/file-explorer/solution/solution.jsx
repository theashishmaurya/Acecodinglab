import React, { useState, useCallback, useEffect } from 'react';

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
          type: 'file'
        },
        {
          id: '3',
          name: 'document2.txt',
          type: 'file'
        }
      ]
    },
    {
      id: '4',
      name: 'Images',
      type: 'folder',
      children: [
        {
          id: '5',
          name: 'image1.png',
          type: 'file'
        }
      ]
    },
    {
      id: '6',
      name: 'config.json',
      type: 'file'
    }
  ]
};

const FileExplorer = () => {
  const [files, setFiles] = useState(INITIAL_FILES);
  const [expandedFolders, setExpandedFolders] = useState(new Set(['root']));
  const [selectedItem, setSelectedItem] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [renamingItem, setRenamingItem] = useState(null);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // File operations
  const createItem = (type, parentId = 'root') => {
    const newName = type === 'folder' ? 'New Folder' : 'New File';
    const newItem = {
      id: Date.now().toString(),
      name: newName,
      type,
      ...(type === 'folder' && { children: [] })
    };

    setFiles(prevFiles => {
      const updateChildren = (node) => {
        if (node.id === parentId) {
          return {
            ...node,
            children: [...(node.children || []), newItem]
          };
        }
        if (node.children) {
          return {
            ...node,
            children: node.children.map(updateChildren)
          };
        }
        return node;
      };
      
      return updateChildren(prevFiles);
    });

    setRenamingItem(newItem.id);
  };

  const deleteItem = (itemId) => {
    setFiles(prevFiles => {
      const deleteFromChildren = (node) => {
        if (node.children) {
          return {
            ...node,
            children: node.children
              .filter(child => child.id !== itemId)
              .map(deleteFromChildren)
          };
        }
        return node;
      };
      
      return deleteFromChildren(prevFiles);
    });
  };

  const renameItem = (itemId, newName) => {
    setFiles(prevFiles => {
      const updateName = (node) => {
        if (node.id === itemId) {
          return { ...node, name: newName };
        }
        if (node.children) {
          return {
            ...node,
            children: node.children.map(updateName)
          };
        }
        return node;
      };
      
      return updateName(prevFiles);
    });
    setRenamingItem(null);
  };

  // Event handlers
  const handleContextMenu = (e, item) => {
    e.preventDefault();
    setContextMenu({
      x: e.pageX,
      y: e.pageY,
      item
    });
    setSelectedItem(item.id);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item.id);
    if (item.type === 'folder') {
      setExpandedFolders(prev => {
        const next = new Set(prev);
        if (next.has(item.id)) {
          next.delete(item.id);
        } else {
          next.add(item.id);
        }
        return next;
      });
    }
  };

  // Recursive component for rendering file tree
  const renderItem = useCallback((item) => {
    const isExpanded = expandedFolders.has(item.id);
    const isSelected = selectedItem === item.id;
    const isRenaming = renamingItem === item.id;

    return (
      <div key={item.id} className="tree-item-container">
        <div
          className={`tree-item ${isSelected ? 'selected' : ''}`}
          onClick={() => handleItemClick(item)}
          onContextMenu={(e) => handleContextMenu(e, item)}
          data-testid={`tree-item-${item.id}`}
        >
          {item.type === 'folder' && (
            <span className="expand-icon">
              {isExpanded ? '▼' : '▶'}
            </span>
          )}
          <span className={`tree-item-icon ${item.type}-icon`}>
            {item.type === 'folder' ? '📁' : '📄'}
          </span>
          
          {isRenaming ? (
            <input
              className="rename-input"
              data-testid="rename-input"
              type="text"
              defaultValue={item.name}
              autoFocus
              onBlur={(e) => renameItem(item.id, e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  renameItem(item.id, e.target.value);
                }
              }}
            />
          ) : (
            <span className="tree-item-name">{item.name}</span>
          )}
        </div>
        
        {item.type === 'folder' && isExpanded && (
          <div className="tree-item-children">
            {item.children?.map(renderItem)}
          </div>
        )}
      </div>
    );
  }, [expandedFolders, selectedItem, renamingItem]);

  return (
    <div className="file-explorer" data-testid="file-explorer">
      <div className="explorer-header" data-testid="explorer-header">
        <h2>File Explorer</h2>
        <div className="actions">
          <button
            onClick={() => createItem('folder')}
            data-testid="new-folder-btn"
          >
            New Folder
          </button>
          <button
            onClick={() => createItem('file')}
            data-testid="new-file-btn"
          >
            New File
          </button>
        </div>
      </div>

      <div className="explorer-tree" data-testid="explorer-tree">
        {renderItem(files)}
      </div>

      {contextMenu && (
        <div
          className="context-menu"
          data-testid="context-menu"
          style={{
            top: contextMenu.y,
            left: contextMenu.x
          }}
        >
          <div
            className="context-menu-item"
            onClick={() => setRenamingItem(contextMenu.item.id)}
          >
            Rename
          </div>
          <div
            className="context-menu-item"
            onClick={() => deleteItem(contextMenu.item.id)}
          >
            Delete
          </div>
        </div>
      )}
    </div>
  );
};

export default FileExplorer;
