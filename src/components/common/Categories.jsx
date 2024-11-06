import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import { useEventContext } from "../../Context/EventContext";

const Categories = () => {
  const { events, loading, error } = useEventContext();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  if (loading)
    return (
      <div className="flex justify-center">
        <Loader />
      </div>
    );
  if (error) return <div className="text-red-500">Error: {error}</div>;

  // Get unique categories with one representative event for each
  const uniqueCategories = Array.from(
    events
      .reduce((map, event) => map.set(event?.category?.name, event), new Map())
      .values()
  );

  // Calculate total pages
  const totalPages = Math.ceil(uniqueCategories.length / itemsPerPage);

  // Get items for the current page
  const currentCategories = uniqueCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers for navigation
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="flex border border-gray-300 rounded justify-between items-center">
      <ChevronLeft
        onClick={handlePreviousPage}
        className={`bg-gray-100 h-8 w-8 rounded cursor-pointer ${
          currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
        }`}
      />
      <div className="flex gap-5 items-center justify-center flex-wrap p-3">
        <div className="flex gap-5">
          <Link
            className="border text-blue-900 font-semibold rounded-lg flex justify-center items-center p-3 px-6"
            to={`/events?type=all`}
          >
            All Events
          </Link>
          <Link
            className="border text-blue-900 font-semibold rounded-lg flex justify-center items-center p-3 px-6"
            to={`/events?type=upcoming`}
          >
            Upcoming Events
          </Link>
        </div>
        {currentCategories.map((event) => (
          <Link
            key={event.id}
            className="border text-blue-900 font-semibold rounded-lg flex justify-center items-center p-3 px-6"
            to={`/events/category/${event?.category?.name}`}
          >
            {event?.category?.name}
          </Link>
        ))}
      </div>
      <ChevronRight
        onClick={handleNextPage}
        className={`bg-gray-100 h-8 w-8 rounded cursor-pointer ${
          currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
        }`}
      />
    </div>
  );
};

export default Categories;
