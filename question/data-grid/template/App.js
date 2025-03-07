import React, { useState } from 'react';
import './styles.css';

// Sample data for the grid
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
  {
    id: 4,
    name: 'Alice Brown',
    age: 29,
    city: 'Los Angeles',
    role: 'Product Manager',
  },
  {
    id: 5,
    name: 'Charlie Wilson',
    age: 38,
    city: 'Seattle',
    role: 'Data Scientist',
  },
  { id: 6, name: 'David Martinez', age: 41, city: 'Boston', role: 'CTO' },
  { id: 7, name: 'Eve Adams', age: 27, city: 'Austin', role: 'UX Designer' },
  { id: 8, name: 'Frank Clark', age: 50, city: 'Denver', role: 'CEO' },
  {
    id: 9,
    name: 'Grace Hall',
    age: 35,
    city: 'Miami',
    role: 'Marketing Director',
  },
  {
    id: 10,
    name: 'Hank White',
    age: 30,
    city: 'Houston',
    role: 'Backend Engineer',
  },
  {
    id: 11,
    name: 'Ivy Green',
    age: 28,
    city: 'San Diego',
    role: 'Frontend Engineer',
  },
  {
    id: 12,
    name: 'Jack King',
    age: 47,
    city: 'Philadelphia',
    role: 'HR Manager',
  },
  {
    id: 13,
    name: 'Kara Scott',
    age: 33,
    city: 'Portland',
    role: 'DevOps Engineer',
  },
  {
    id: 14,
    name: 'Leo Turner',
    age: 26,
    city: 'Atlanta',
    role: 'Cybersecurity Analyst',
  },
  {
    id: 15,
    name: 'Mia Lopez',
    age: 36,
    city: 'Las Vegas',
    role: 'Project Manager',
  },
  {
    id: 16,
    name: 'Mias Lopez',
    age: 36,
    city: 'Las Vegas',
    role: 'Project Manager',
  },
];

const App = () => {
  // TODO: Implement state management for data, sorting, pagination, etc.

  // TODO: Implement function to get data based on pagination parameters

  // TODO: Implement column sorting functionality

  // TODO: Implement search functionality

  // TODO: Implement pagination functionality

  return (
    <div className="data-grid-container" data-testid="data-grid-container">
      <div className="grid-header" data-testid="grid-header">
        <div className="grid-title">Data Grid</div>
        <div className="grid-actions">
          <input
            type="text"
            placeholder="Search..."
            data-testid="search-input"
            // TODO: Implement search functionality
          />
        </div>
      </div>

      <div className="grid-table" data-testid="grid-table">
        <table>
          <thead>
            <tr>
              {/* TODO: Implement dynamic table headers with sorting functionality */}
              {/* 
                Example structure:
                <th data-testid="column-name">Name</th>
                <th data-testid="column-age">Age</th>
                <th data-testid="column-city">City</th>
                <th data-testid="column-role">Role</th>
              */}
            </tr>
          </thead>
          <tbody>
            {/* TODO: Implement dynamic table rows */}
            {/* 
              Example structure:
              <tr data-testid="row-1">
                <td data-testid="cell-name-1">John Doe</td>
                <td data-testid="cell-age-1">25</td>
                <td data-testid="cell-city-1">New York</td>
                <td data-testid="cell-role-1">Developer</td>
              </tr>
            */}
          </tbody>
        </table>
      </div>

      <div className="grid-pagination" data-testid="grid-pagination">
        <div className="pagination-info" data-testid="page-info">
          {/* TODO: Implement page number display */}
          Page 1
        </div>
        <div className="pagination-controls">
          <button
            data-testid="prev-page"
            // TODO: Implement previous page functionality and disabled state
          >
            Prev
          </button>
          <button
            data-testid="next-page"
            // TODO: Implement next page functionality and disabled state
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
