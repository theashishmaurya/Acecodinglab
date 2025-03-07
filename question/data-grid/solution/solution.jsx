import React, { useState, useEffect, useMemo } from "react";
import "./styles.css";

const INITIAL_DATA = [
  { id: 1, name: "John Doe", age: 25, city: "New York", role: "Developer" },
  {
    id: 2,
    name: "Jane Smith",
    age: 32,
    city: "San Francisco",
    role: "Designer",
  },
  { id: 3, name: "Bob Johnson", age: 45, city: "Chicago", role: "Manager" },
  {
    id: 4,
    name: "Alice Brown",
    age: 29,
    city: "Los Angeles",
    role: "Product Manager",
  },
  {
    id: 5,
    name: "Charlie Wilson",
    age: 38,
    city: "Seattle",
    role: "Data Scientist",
  },
  { id: 6, name: "David Martinez", age: 41, city: "Boston", role: "CTO" },
  { id: 7, name: "Eve Adams", age: 27, city: "Austin", role: "UX Designer" },
  { id: 8, name: "Frank Clark", age: 50, city: "Denver", role: "CEO" },
  {
    id: 9,
    name: "Grace Hall",
    age: 35,
    city: "Miami",
    role: "Marketing Director",
  },
  {
    id: 10,
    name: "Hank White",
    age: 30,
    city: "Houston",
    role: "Backend Engineer",
  },
  {
    id: 11,
    name: "Ivy Green",
    age: 28,
    city: "San Diego",
    role: "Frontend Engineer",
  },
  {
    id: 12,
    name: "Jack King",
    age: 47,
    city: "Philadelphia",
    role: "HR Manager",
  },
  {
    id: 13,
    name: "Kara Scott",
    age: 33,
    city: "Portland",
    role: "DevOps Engineer",
  },
  {
    id: 14,
    name: "Leo Turner",
    age: 26,
    city: "Atlanta",
    role: "Cybersecurity Analyst",
  },
  {
    id: 15,
    name: "Mia Lopez",
    age: 36,
    city: "Las Vegas",
    role: "Project Manager",
  },
  {
    id: 16,
    name: "Mias Lopez",
    age: 36,
    city: "Las Vegas",
    role: "Project Manager",
  },
];

const getData = (skip, limit) => {
  return INITIAL_DATA.slice(skip, skip + limit);
};

const App = () => {
  const [sortConfig, setSortConfig] = useState({}); // Stores sort state for each column

  const [paginationConfig, setPaginationConfig] = useState({
    rowsPerPage: 5,
    totalRows: INITIAL_DATA.length,
    limit: 5,
    skip: 0,
  });
  const [data, setData] = useState(
    getData(paginationConfig.skip, paginationConfig.limit)
  );

  const sortColumn = (columnName) => {
    const currentOrder = sortConfig[columnName] || "unsorted";

    // Determine the next order state
    const nextOrder =
      currentOrder === "unsorted"
        ? "asc"
        : currentOrder === "asc"
        ? "dsc"
        : "unsorted";

    let sortedData;

    if (nextOrder === "asc") {
      sortedData = [...data].sort((a, b) =>
        a[columnName] > b[columnName] ? 1 : -1
      );
    } else if (nextOrder === "dsc") {
      sortedData = [...data].sort((a, b) =>
        a[columnName] < b[columnName] ? 1 : -1
      );
    } else {
      sortedData = [...INITIAL_DATA]; // Reset to initial data
    }

    // Update state
    setData(sortedData);
    setSortConfig({ ...sortConfig, [columnName]: nextOrder });
  };

  const onSearch = (e) => {
    const searchQuery = e.target.value.toLowerCase();

    let arr = Object.keys(INITIAL_DATA[0]);
    // Removing the id
    arr = arr.slice(1, arr.length);

    const newData = [...INITIAL_DATA].filter((row) => {
      for (let i = 0; i < arr.length; i++) {
        if (
          String(row[arr[i]] ?? "")
            .toLowerCase()
            .includes(searchQuery)
        ) {
          return true;
        }
      }
    });
    setData(newData);
  };

  handlePageChange = (type) => {
    const currentSkip = paginationConfig.skip;
    const currentLimit = paginationConfig.limit;

    if (type === "next") {
      const newSkip = currentSkip + currentLimit;
      const newData = getData(newSkip, currentLimit);
      setData(newData);
      const newPaginationConfig = {
        rowsPerPage: 5,
        totalRows: INITIAL_DATA.length,
        limit: 5,
        skip: newSkip,
      };
      setPaginationConfig(newPaginationConfig);
    }
    if (type === "prev") {
      const newSkip = currentSkip - currentLimit;
      const newData = getData(newSkip, currentLimit);
      setData(newData);
      const newPaginationConfig = {
        rowsPerPage: 5,
        totalRows: INITIAL_DATA.length,
        limit: 5,
        skip: newSkip,
      };
      setPaginationConfig(newPaginationConfig);
    }
  };

  const CalculateIfNextIsDisabled = () => {
    const currentPage = paginationConfig.skip / paginationConfig.rowsPerPage;
    const totalPages =
      paginationConfig.totalRows / paginationConfig.rowsPerPage;

    return currentPage + 1 >= totalPages;
  };
  return (
    <div className="data-grid-container" data-testid="data-grid-container">
      <div className="grid-header" data-testid="grid-header">
        <div className="grid-title">Data Grid</div>
        <div className="grid-actions">
          <input
            onChange={onSearch}
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
              {Object.keys(INITIAL_DATA[0])
                .splice(1, Object.keys(INITIAL_DATA[0]).length)
                .map((col) => (
                  <th
                    key={col}
                    onClick={() => sortColumn(col)}
                    data-testid={`column-${col}`}
                  >
                    {col.charAt(0).toUpperCase() + col.slice(1)}{" "}
                    {sortConfig[col] === "asc"
                      ? "▲"
                      : sortConfig[col] === "dsc"
                      ? "▼"
                      : "⏺"}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => {
              return (
                <tr key={row.id} data-testid={`row-${row.id}`}>
                  <td data-testid={`cell-name-${row.id}`}>{row.name}</td>
                  <td data-testid={`cell-age-${row.id}`}>{row.age}</td>
                  <td data-testid={`cell-city-${row.id}`}>{row.city}</td>
                  <td data-testid={`cell-role-${row.id}`}>{row.role}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid-pagination" data-testid="grid-pagination">
        {/* TODO: Implement pagination */}
        <div className="pagination-info" data-testid="page-info">
          Page{" "}
          {Math.floor(paginationConfig.skip / paginationConfig.rowsPerPage) + 1}
        </div>
        <div className="pagination-controls">
          <button
            className="active"
            onClick={() => {
              handlePageChange("prev");
            }}
            data-testid="prev-page"
            disabled={paginationConfig.skip == 0}
          >
            Prev
          </button>
          <button
            className="active"
            onClick={() => {
              handlePageChange("next");
            }}
            data-testid="next-page"
            disabled={CalculateIfNextIsDisabled()}
          >
            Next{" "}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
