import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Loader, MapPinIcon } from "lucide-react";
import { imageUrl } from "../../api/image";
import Pagination from "./Pagination";

const EventList = ({ fetchEvents, searchTerm = "", searchType = "" }) => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchEvents();
        setEvents(data);
        setFilteredEvents(data); // Initially, display all events
      } catch (err) {
        setError(err.message || "Failed to load events.");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [fetchEvents]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const type = queryParams.get("type");
    const category = queryParams.get("category");
    let filtered = [...events];

    // Filter based on the query parameters
    if (type === "upcoming") {
      filtered = filtered.filter(
        (event) => new Date(event.end_date) >= new Date()
      );
    } else if (type === "category" && category) {
      filtered = filtered.filter((event) => event.category.name === category);
    }

    // Implementing the search logic
    const matchesSearchTerm = (event) => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      return (
        searchTerm === "" ||
        (searchType === "title" &&
          event.title.toLowerCase().includes(lowerSearchTerm)) ||
        (searchType === "location" &&
          event.location.toLowerCase().includes(lowerSearchTerm)) ||
        (searchType === "category" &&
          event.category?.name.toLowerCase().includes(lowerSearchTerm)) ||
        (searchType === "date" && event.start_date.startsWith(searchTerm))
      );
    };

    setFilteredEvents(filtered.filter(matchesSearchTerm));
  }, [events, location.search, searchTerm, searchType]);

  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const displayedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
  if (loading)
    return (
      <div className="flex justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto min-h-screen flex flex-col">
      <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 w-full gap-4 grid-wrap">
        {displayedEvents.length > 0 ? (
          displayedEvents.map((event) => (
            <div
              key={event.id}
              className="rounded-xl p-5 shadow-xl w-auto lg:w-72 relative"
            >
              <div className="rounded-xl overflow-hidden h-60 relative group">
                <img
                  src={`${imageUrl}/${event.image}`}
                  alt="event"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Link
                    to={`/events/${event.id}`}
                    className="text-white text-lg"
                    onClick={() => navigate(event.id)}
                  >
                    Details
                  </Link>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-3">
                <h5 className="text-xl font-medium">
                  {event.title
                    ? capitalizeFirstLetter(
                        event.title.split(" ").slice(0, 2).join(" ") +
                          (event.title.split(" ").length > 2 ? "..." : "")
                      )
                    : "Title"}
                </h5>
                <div className="flex gap-2 items-center">
                  <MapPinIcon className="h-5 w-6" />
                  <span>
                    {event.location
                      ? capitalizeFirstLetter(
                          event.location.split(" ").slice(0, 2).join(" ") +
                            (event.location.split(" ").length > 2 ? "..." : "")
                        )
                      : "Location"}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <span className="text-center col-span-full text-xl text-gray-800 font-semibold">No events found.</span>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination
          className="mt-4"
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
        />
      )}
    </div>
  );
};

export default EventList;
