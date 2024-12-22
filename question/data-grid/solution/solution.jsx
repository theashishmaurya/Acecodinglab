import React, { useState, useEffect, useCallback } from 'react';

const ITEMS_PER_PAGE = 10;

const DataGrid = ({ initialData }) => {
  const [data, setData] = useState(initialData);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [columnWidths, setColumnWidths] = useState({
    name: 200,
    age: 100,
    city: 150,
    role: 150
  });

  // Sorting Logic
  const sortData = useCallback((items, sortConfig) => {
    if (!sortConfig.key) return items;

    return [...items].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, []);

  // Filtering Logic
  const filterData = useCallback((items, searchTerm) => {
    if (!searchTerm) return items;

    return items.filter(item =>
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, []);

  // Column Resizing Logic
  const handleColumnResize = (column, width) => {
    setColumnWidths(prev => ({
      ...prev,
      [column]: width
    }));
  };

  // Request Sort
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Pagination Logic
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const paginatedData = data.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Process Data
  useEffect(() => {
    let processedData = [...initialData];
    processedData = filterData(processedData, searchTerm);
    processedData = sortData(processedData, sortConfig);
    setData(processedData);
  }, [initialData, searchTerm, sortConfig, filterData, sortData]);

  return (
    <div className="data-grid-container" data-testid="data-grid-container">
      <div className="grid-header" data-testid="grid-header">
        <div className="grid-title">Data Grid</div>
        <div className="grid-actions">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            data-testid="search-input"
          />
        </div>
      </div>

      <div className="grid-table" data-testid="grid-table">
        <table>
          <thead>
            <tr>
              {Object.keys(columnWidths).map(column => (
                <th
                  key={column}
                  onClick={() => requestSort(column)}
                  className={
                    sortConfig.key === column
                      ? `sorted-${sortConfig.direction}`
                      : ''
                  }
                  style={{ width: `${columnWidths[column]}px` }}
                  data-testid={`column-${column}`}
                >
                  {column.charAt(0).toUpperCase() + column.slice(1)}
                  <div
                    className="resizer"
                    data-testid={`resizer-${column}`}
                    onMouseDown={e => {
                      const startX = e.pageX;
                      const startWidth = columnWidths[column];

                      const handleMouseMove = (e) => {
                        const width = startWidth + (e.pageX - startX);
                        handleColumnResize(column, Math.max(50, width));
                      };

                      const handleMouseUp = () => {
                        document.removeEventListener('mousemove', handleMouseMove);
                        document.removeEventListener('mouseup', handleMouseUp);
                      };

                      document.addEventListener('mousemove', handleMouseMove);
                      document.addEventListener('mouseup', handleMouseUp);
                    }}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr key={item.id} data-testid={`row-${item.id}`}>
                {Object.keys(columnWidths).map(column => (
                  <td
                    key={`${item.id}-${column}`}
                    data-testid={`cell-${column}-${item.id}`}
                  >
                    {item[column]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid-pagination" data-testid="grid-pagination">
        <div className="pagination-info" data-testid="page-info">
          Page {currentPage} of {totalPages}
        </div>
        <div className="pagination-controls">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            data-testid="first-page"
          >
            First
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            data-testid="prev-page"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            data-testid="next-page"
          >
            Next
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            data-testid="last-page"
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataGrid;
