import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Make sure you have lucide-react installed

const Pagination = ({ currentPage, onPageChange, totalPages, className }) => {
  const handlePageClick = (page) => {
    onPageChange(page);
  };

  const createPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <nav className={`flex justify-center items-center ${className}`}>
      <ul className="flex items-center space-x-2">
        {/* Previous Button */}
        <li>
          <button
            onClick={() => handlePageClick(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-2 py-1 rounded-lg ${
              currentPage === 1
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-200 text-gray-800 hover:bg-blue-500 hover:text-white'
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
              className={`px-4 py-2 rounded-lg ${
                number === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-blue-500 hover:text-white'
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
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-200 text-gray-800 hover:bg-blue-500 hover:text-white'
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
