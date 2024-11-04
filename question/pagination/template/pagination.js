const Pagination = () => {
  // Calculate total pages here

  return (
    <div>
      {/* Previous button */}
      <button data-testid="prev-button">←</button>

      {/* First page */}
      <button data-testid="page-1">1</button>

      {/* Page numbers */}
      {/* Add page numbers with data-testid={`page-${number}`} */}

      {/* Last page button */}
      <button data-testid="last-page-button">20</button>

      {/* Next button */}
      <button data-testid="next-button">→</button>

      {/* Current page indicator (hidden but necessary for testing) */}
      <span data-testid="current-page" style={{ display: 'none' }}>
        {currentPage}
      </span>
    </div>
  );
};

export default Pagination;
