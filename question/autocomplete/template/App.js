import React, { useState, useRef, useEffect, useCallback } from 'react';
import './styles.css';

// Mock API - simulates fetching suggestions with a delay
const mockSuggestions = [
  'Apple', 'Banana', 'Cherry', 'Date', 'Elderberry',
  'Fig', 'Grape', 'Honeydew', 'Kiwi', 'Lemon',
  'Mango', 'Nectarine', 'Orange', 'Papaya', 'Quince',
  'Raspberry', 'Strawberry', 'Tomato', 'Ugli fruit', 'Watermelon',
  'Apple Pie', 'Apple Juice', 'Apple Cider', 'Banana Bread', 'Banana Split',
  'Cherry Pie', 'Cherry Tomato', 'Grape Juice', 'Grapefruit', 'Lemonade',
  'Mango Smoothie', 'Orange Juice', 'Papaya Salad', 'Strawberry Shortcake'
];

const fetchSuggestions = async (query) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (!query.trim()) return [];
  
  const filtered = mockSuggestions.filter(item =>
    item.toLowerCase().includes(query.toLowerCase())
  );
  
  return filtered.slice(0, 8); // Return max 8 suggestions
};

function App() {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  
  // TODO: Implement debounced fetch
  // TODO: Handle keyboard navigation
  // TODO: Handle click outside to close
  // TODO: Implement proper ARIA attributes
  // TODO: Highlight matching text in suggestions
  
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    // TODO: Debounce and fetch suggestions
  };
  
  const handleSelect = (suggestion) => {
    setInputValue(suggestion);
    setSuggestions([]);
    setIsOpen(false);
    setFocusedIndex(-1);
  };
  
  const handleKeyDown = (e) => {
    // TODO: Implement keyboard navigation
    // Arrow Down, Arrow Up, Enter, Escape
  };
  
  return (
    <div className="app-container">
      <h1>Autocomplete/Typeahead Challenge</h1>
      <p>Type to search for fruits and fruit products.</p>
      
      <div className="autocomplete-container">
        <div className="input-wrapper">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
            placeholder="Type to search..."
            className="autocomplete-input"
            aria-label="Search fruits"
            aria-autocomplete="list"
            aria-expanded={isOpen}
            aria-controls="suggestions-list"
            role="combobox"
          />
          {loading && (
            <span className="loading-spinner" aria-label="Loading">
              ⟳
            </span>
          )}
        </div>
        
        {isOpen && suggestions.length > 0 && (
          <ul
            ref={listRef}
            id="suggestions-list"
            className="suggestions-list"
            role="listbox"
          >
            {suggestions.map((suggestion, index) => (
              <li
                key={suggestion}
                className={`suggestion-item ${index === focusedIndex ? 'focused' : ''}`}
                role="option"
                aria-selected={index === focusedIndex}
                onClick={() => handleSelect(suggestion)}
              >
                {/* TODO: Highlight matching text */}
                {suggestion}
              </li>
            ))}
          </ul>
        )}
        
        {isOpen && !loading && inputValue && suggestions.length === 0 && (
          <div className="no-results">
            No results found for "{inputValue}"
          </div>
        )}
      </div>
    </div>
  );
}

export default App;