import React, { useState } from 'react';
import { menuItems } from './data';

function App() {
  const [contextMenu, setContextMenu] = useState({
    show: false,
    x: 0,
    y: 0,
  });

  const handleContextMenu = event => {
    event.preventDefault();
    setContextMenu({
      show: true,
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handleClick = () => {
    setContextMenu({
      show: false,
      x: 0,
      y: 0,
    });
  };

  return (
    <div onClick={handleClick}>
      <h1>Context Menu Demo</h1>
      <div className="demo-area" onContextMenu={handleContextMenu}>
        Right click in this area to show context menu
      </div>

      {/* Your context menu implementation will go here */}
      {contextMenu.show && (
        <div
          className="context-menu"
          style={{
            left: `${contextMenu.x}px`,
            top: `${contextMenu.y}px`,
          }}
        >
          {menuItems.map(item => (
            <div key={item.id} className="menu-item" onClick={item.action}>
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
