import React from 'react';
import './styles.css';

const INITIAL_DATA = [
  { id: 1, name: 'John Doe', age: 25, city: 'New York', role: 'Developer' },
  {
    id: 2,
    name: 'Jane Smith',
    age: 32,
    city: 'San Francisco',
    role: 'Designer',
  },
  { id: 3, name: 'Bob Johnson', age: 45, city: 'Chicago', role: 'Manager' },
  // ... more data
];

const App = () => {
  // TODO: Implement state management for:
  // - Sorting
  // - Filtering
  // - Pagination
  // - Column resizing

  return (
    <div className="data-grid-container" data-testid="data-grid-container">
      <div className="grid-header" data-testid="grid-header">
        <div className="grid-title">Data Grid</div>
        <div className="grid-actions">
          <input
            type="text"
            placeholder="Search..."
            data-testid="search-input"
          />
        </div>
      </div>

      <div className="grid-table" data-testid="grid-table">
        <table>
          <thead>
            <tr>
              <th data-testid="column-name">Name</th>
              <th data-testid="column-age">Age</th>
              <th data-testid="column-city">City</th>
              <th data-testid="column-role">Role</th>
            </tr>
          </thead>
          <tbody>{/* TODO: Implement table rows */}</tbody>
        </table>
      </div>

      <div className="grid-pagination" data-testid="grid-pagination">
        {/* TODO: Implement pagination */}
      </div>
    </div>
  );
};

export default App;
