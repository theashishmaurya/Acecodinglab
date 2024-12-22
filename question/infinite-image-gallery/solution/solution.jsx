import React, { useState, useEffect, useCallback, useRef } from 'react';

const API_URL = 'https://api.unsplash.com/photos/random';
const API_KEY = 'YOUR_API_KEY';
const IMAGES_PER_PAGE = 10;

const InfiniteGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  
  const observerRef = useRef(null);
  const loadingRef = useRef(null);

  // Fetch images from API
  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `${API_URL}?count=${IMAGES_PER_PAGE}`,
        {
          headers: {
            Authorization: `Client-ID ${API_KEY}`
          }
        }
      );
      
      if (!response.ok) throw new Error('Failed to fetch images');
      
      const data = await response.json();
      setImages(prev => [...prev, ...data]);
      setPage(prev => prev + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize intersection observer
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          fetchImages();
        }
      },
      { threshold: 1.0 }
    );

    if (loadingRef.current) {
      observerRef.current.observe(loadingRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [fetchImages, loading]);

  // Calculate masonry layout
  const getMasonryStyle = (index) => {
    const columns = Math.floor(window.innerWidth / 300);
    return {
      gridRowEnd: `span ${Math.ceil(Math.random() * 2) + 1}`
    };
  };

  return (
    <div className="gallery-container" data-testid="gallery-container">
      <div className="gallery-header">
        <h1>Infinite Image Gallery</h1>
        <div className="gallery-stats" data-testid="gallery-stats">
          <span>{images.length} images loaded</span>
        </div>
      </div>

      <div className="masonry-grid" data-testid="masonry-grid">
        {images.map((image, index) => (
          <div
            key={image.id}
            className="image-card"
            style={getMasonryStyle(index)}
            data-testid={`image-card-${image.id}`}
            onClick={() => setSelectedImage(image)}
          >
            <img
              src={image.urls.small}
              alt={image.alt_description || 'Unsplash Image'}
              loading="lazy"
              onError={(e) => {
                e.target.src = 'placeholder.jpg';
                e.target.classList.add('error');
              }}
            />
            <div className="image-overlay">
              <p>{image.user.name}</p>
            </div>
          </div>
        ))}
      </div>

      {loading && (
        <div className="loading-state" data-testid="loading-state" ref={loadingRef}>
          <div className="loading-spinner"></div>
          <p>Loading more images...</p>
        </div>
      )}

      {error && (
        <div className="error-state" data-testid="error-state">
          <p>{error}</p>
          <button onClick={() => fetchImages()}>Retry</button>
        </div>
      )}

      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <span className="modal-close">&times;</span>
          <div className="modal-content">
            <img
              src={selectedImage.urls.regular}
              alt={selectedImage.alt_description || 'Unsplash Image'}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InfiniteGallery;
