import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import './styles.css';

// TODO: Implement a complete toast notification system

// Toast Context for programmatic access
const ToastContext = createContext(null);

// Unique ID generator
let toastId = 0;
const generateId = () => {
  toastId += 1;
  return `toast-${toastId}`;
};

// Toast types and their default styles
const toastTypes = {
  success: { icon: '✓', className: 'toast-success' },
  error: { icon: '✕', className: 'toast-error' },
  warning: { icon: '⚠', className: 'toast-warning' },
  info: { icon: 'ℹ', className: 'toast-info' },
};

function Toast({ toast, onDismiss }) {
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(100);
  const startTimeRef = useRef(Date.now());
  const remainingTimeRef = useRef(toast.duration);

  // TODO: Implement auto-dismiss with progress bar
  // TODO: Implement pause on hover
  // TODO: Implement entry/exit animations
  
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, remainingTimeRef.current - elapsed);
      setProgress((remaining / toast.duration) * 100);
      
      if (remaining <= 0) {
        onDismiss(toast.id);
      }
    }, 50);
    
    return () => clearInterval(interval);
  }, [isPaused, toast.duration, toast.id, onDismiss]);

  const handleMouseEnter = () => {
    setIsPaused(true);
    remainingTimeRef.current -= Date.now() - startTimeRef.current;
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    startTimeRef.current = Date.now();
  };

  const typeConfig = toastTypes[toast.type] || toastTypes.info;

  return (
    <div
      className={`toast ${typeConfig.className} ${toast.isExiting ? 'toast-exiting' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="alert"
      aria-live="polite"
    >
      <span className="toast-icon">{typeConfig.icon}</span>
      <div className="toast-content">
        {toast.title && <div className="toast-title">{toast.title}</div>}
        <div className="toast-message">{toast.message}</div>
      </div>
      <button
        className="toast-close"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss"
      >
        ×
      </button>
      <div 
        className="toast-progress"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

function ToastContainer({ toasts, position, onDismiss }) {
  // TODO: Render toasts in correct position
  // TODO: Handle toast stacking
  
  return (
    <div className={`toast-container toast-${position}`}>
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastProvider({ children, position = 'top-right' }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', options = {}) => {
    const id = options.id || generateId();
    const toast = {
      id,
      message,
      type,
      title: options.title,
      duration: options.duration || 5000,
      isExiting: false,
    };
    
    setToasts(prev => [...prev, toast]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    // Animate out first, then remove
    setToasts(prev => 
      prev.map(t => t.id === id ? { ...t, isExiting: true } : t)
    );
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 300);
  }, []);

  const removeAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const toast = {
    success: (message, options) => addToast(message, 'success', options),
    error: (message, options) => addToast(message, 'error', options),
    warning: (message, options) => addToast(message, 'warning', options),
    info: (message, options) => addToast(message, 'info', options),
    dismiss: removeToast,
    dismissAll: removeAllToasts,
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer 
        toasts={toasts} 
        position={position} 
        onDismiss={removeToast} 
      />
    </ToastContext.Provider>
  );
}

function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// Demo App
function App() {
  const [position, setPosition] = useState('top-right');
  
  return (
    <ToastProvider position={position}>
      <div className="app-container">
        <h1>Toast Notification System</h1>
        <p>Click the buttons to see different toast types.</p>
        
        <div className="demo-controls">
          <select 
            value={position} 
            onChange={(e) => setPosition(e.target.value)}
            className="position-select"
          >
            <option value="top-right">Top Right</option>
            <option value="top-left">Top Left</option>
            <option value="bottom-right">Bottom Right</option>
            <option value="bottom-left">Bottom Left</option>
          </select>
        </div>
        
        <DemoButtons />
      </div>
    </ToastProvider>
  );
}

function DemoButtons() {
  const toast = useToast();
  
  return (
    <div className="button-group">
      <button 
        className="btn btn-success"
        onClick={() => toast.success('Operation completed successfully!')}
      >
        Success Toast
      </button>
      <button 
        className="btn btn-error"
        onClick={() => toast.error('Something went wrong!', { duration: 8000 })}
      >
        Error Toast (8s)
      </button>
      <button 
        className="btn btn-warning"
        onClick={() => toast.warning('Please review your input', { title: 'Warning' })}
      >
        Warning Toast
      </button>
      <button 
        className="btn btn-info"
        onClick={() => toast.info('Here is some useful information.')}
      >
        Info Toast
      </button>
      <button 
        className="btn btn-secondary"
        onClick={() => {
          toast.success('First toast');
          setTimeout(() => toast.info('Second toast'), 200);
          setTimeout(() => toast.warning('Third toast'), 400);
        }}
      >
        Multiple Toasts
      </button>
      <button 
        className="btn btn-secondary"
        onClick={() => toast.dismissAll()}
      >
        Dismiss All
      </button>
    </div>
  );
}

export default App;
export { ToastProvider, useToast };