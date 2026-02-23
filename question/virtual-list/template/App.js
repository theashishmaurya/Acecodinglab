import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import './styles.css';

// Generate test data
const generateItems = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    text: `Item ${i + 1}`,
    subtitle: `This is the subtitle for item ${i + 1}`,
  }));
};

const ITEMS = generateItems(10000);
const ITEM_HEIGHT = 50;
const CONTAINER_HEIGHT = 400;

function VirtualList({
  items,
  itemHeight,
  height,
  overscan = 3,
  renderItem,
}) {
  const containerRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);

  // TODO: Calculate visible range
  // - startIndex: first visible item
  // - endIndex: last visible item
  // - Don't forget overscan!

  const totalHeight = items.length * itemHeight;

  // Calculate visible items
  const startIndex = 0; // TODO: Calculate based on scrollTop
  const endIndex = 0; // TODO: Calculate based on scrollTop and container height

  // TODO: Add overscan items before and after
  // const visibleStartIndex = Math.max(0, startIndex - overscan);
  // const visibleEndIndex = Math.min(items.length - 1, endIndex + overscan);

  // For now, render all items (to be replaced)
  const visibleItems = items.slice(0, 20);

  // TODO: Implement scroll handler
  const handleScroll = useCallback((e) => {
    // Update scrollTop state
    // Consider using requestAnimationFrame for performance
  }, []);

  return (
    <div
      ref={containerRef}
      className="virtual-list-container"
      style={{ height, overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div
        className="virtual-list-inner"
        style={{ height: totalHeight, position: 'relative' }}
      >
        {visibleItems.map((item, index) => (
          <div
            key={item.id}
            className="virtual-list-item"
            style={{
              position: 'absolute',
              top: index * itemHeight,
              height: itemHeight,
              width: '100%',
            }}
          >
            {renderItem({ item, index, style: {} })}
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [itemCount, setItemCount] = useState(10000);
  const [overscan, setOverscan] = useState(5);

  const items = useMemo(() => ITEMS.slice(0, itemCount), [itemCount]);

  const renderItem = useCallback(({ item, index }) => (
    <div className="item">
      <span className="item-index">#{index + 1}</span>
      <div className="item-content">
        <span className="item-title">{item.text}</span>
        <span className="item-subtitle">{item.subtitle}</span>
      </div>
    </div>
  ), []);

  return (
    <div className="app-container">
      <h1>Virtual List Challenge</h1>
      <p>Implement efficient rendering for 10,000+ items.</p>

      <div className="controls">
        <label>
          Item Count:
          <select 
            value={itemCount} 
            onChange={(e) => setItemCount(Number(e.target.value))}
          >
            <option value={100}>100</option>
            <option value={1000}>1,000</option>
            <option value={5000}>5,000</option>
            <option value={10000}>10,000</option>
            <option value={50000}>50,000</option>
          </select>
        </label>

        <label>
          Overscan:
          <input
            type="number"
            value={overscan}
            onChange={(e) => setOverscan(Number(e.target.value))}
            min={0}
            max={20}
          />
        </label>
      </div>

      <div className="stats">
        <div className="stat">
          <span className="stat-label">Total Items:</span>
          <span className="stat-value">{itemCount.toLocaleString()}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Item Height:</span>
          <span className="stat-value">{ITEM_HEIGHT}px</span>
        </div>
        <div className="stat">
          <span className="stat-label">Total Height:</span>
          <span className="stat-value">{(itemCount * ITEM_HEIGHT / 1000).toFixed(1)}k px</span>
        </div>
      </div>

      <div className="list-wrapper">
        <VirtualList
          items={items}
          itemHeight={ITEM_HEIGHT}
          height={CONTAINER_HEIGHT}
          overscan={overscan}
          renderItem={renderItem}
        />
      </div>

      <div className="instructions">
        <h3>Implementation Steps:</h3>
        <ol>
          <li>Calculate visible item range from scroll position</li>
          <li>Only render items in the visible range (plus overscan)</li>
          <li>Position items absolutely using transform or top</li>
          <li>Maintain correct total height for scrollbar accuracy</li>
        </ol>
      </div>
    </div>
  );
}

export default App;