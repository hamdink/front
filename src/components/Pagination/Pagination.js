import React from 'react';
import './Pagination.css';

const Pagination = ({ currentPage, setCurrentPage, totalPages }) => {
  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="pagination-container">
      <button 
        className="pagination-button"
        onClick={() => setCurrentPage(currentPage - 1)} 
        disabled={currentPage === 1}>
        &lt; Previous
      </button>
      {[...Array(totalPages)].map((_, index) => {
        const page = index + 1;
        return (
          <button
            key={page}
            className={`pagination-page ${currentPage === page ? 'active' : ''}`}
            onClick={() => handlePageClick(page)}>
            {page}
          </button>
        );
      })}
      <button 
        className="pagination-button"
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}>
        Next &gt;
      </button>
    </div>
  );
};

export default Pagination;
