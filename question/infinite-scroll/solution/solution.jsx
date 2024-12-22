import React, { useState, useEffect, useCallback, useRef } from 'react';

const ITEMS_PER_PAGE = 10;

const App = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef(null);

  // Virtual scrolling state
  const [visibleItems, setVisibleItems] = useState([]);
  const containerRef = useRef(null);

  const lastItemRef = useCallback(
    node => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prevPage => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://api.example.com/feed?page=${page}&limit=${ITEMS_PER_PAGE}`,
      );

      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();

      setItems(prev => [...prev, ...data.items]);
      setHasMore(data.hasMore);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [page]);

  // Virtual scrolling implementation
  useEffect(() => {
    const updateVisibleItems = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const scrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const itemHeight = 100; // Approximate height of each item

      const startIndex = Math.floor(scrollTop / itemHeight);
      const endIndex = Math.min(
        startIndex + Math.ceil(containerHeight / itemHeight) + 1,
        items.length,
      );

      setVisibleItems(items.slice(Math.max(0, startIndex - 5), endIndex + 5));
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', updateVisibleItems);
      updateVisibleItems();
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', updateVisibleItems);
      }
    };
  }, [items]);

  return (
    <div
      className="feed-container"
      data-testid="feed-container"
      ref={containerRef}
    >
      <div className="feed-list" data-testid="feed-list">
        {visibleItems.map((item, index) => (
          <div
            key={item.id}
            ref={index === visibleItems.length - 1 ? lastItemRef : null}
            className="feed-item"
            data-testid={`feed-item-${item.id}`}
          >
            <h3>{item.title}</h3>
            <p>{item.content}</p>
            <small>{item.timestamp}</small>
          </div>
        ))}
      </div>

      {loading && (
        <div className="loader" data-testid="feed-loader">
          Loading...
        </div>
      )}

      {error && (
        <div className="error" data-testid="feed-error">
          {error}
          <button onClick={() => setPage(prev => prev)}>Retry</button>
        </div>
      )}
    </div>
  );
};

export default App;
