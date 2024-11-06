import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, onPageChange, totalPages, className = "" }) => {
  const handlePageClick = (page) => onPageChange(page);

  const createPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <nav className={`flex justify-center items-center ${className}`}>
      <ul className="flex items-center gap-2">
        {/* Previous Button */}
        <li>
          <button
            onClick={() => handlePageClick(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-2 py-1 rounded-lg ${
              currentPage === 1
                ? 'text-gray-900 cursor-not-allowed'
                : 'text-gray-800 hover:bg-blue-800 hover:text-white'
            }`}
          >
            <ChevronLeft />
          </button>
        </li>

        {/* Page Number Buttons */}
        {createPageNumbers().map((number) => (
          <li key={number}>
            <button
              onClick={() => handlePageClick(number)}
              className={`px-4 py-1 rounded-lg ${
                number === currentPage
                  ? 'text-orange-500 cursor-text'
                  : ' text-gray-800 hover:bg-blue-800 hover:text-white'
              }`}
            >
              {number}
            </button>
          </li>
        ))}

        {/* Next Button */}
        <li>
          <button
            onClick={() => handlePageClick(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-2 py-1 rounded-lg ${
              currentPage === totalPages
                ? 'text-gray-500 cursor-not-allowed'
                : 'text-gray-800 hover:bg-blue-800 hover:text-white'
            }`}
          >
            <ChevronRight />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
