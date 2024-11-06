import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchmyBooked } from "../../api/book";
import { imageUrl } from "../../api/image";
import { Loader, MapPinIcon } from "lucide-react";
import Pagination from "../../components/common/Pagination";

const Mybooked = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const itemsPerPage = 8;
  const totalPages = Math.ceil(events.length / itemsPerPage);
  const displayedEvents = events.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const getEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchmyBooked();
        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          throw new Error("Unexpected data format from server.");
        }
      } catch (error) {
        setError(error.message);
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    getEvents();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-full">
        <Loader className="animate-spin" />
      </div>
    );
  if (error)
    return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="h-full">
      <h1 className="text-xl font-bold text-center p-6">My Tickets</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full">
       {displayedEvents.length > 0 ? (
         displayedEvents.map((booking) => (
          <div
            key={booking.id}
            className="rounded-xl p-5 shadow-xl w-auto lg:w-72 relative"
          >
            <div className="rounded-xl overflow-hidden h-60 relative group">
              <img
                src={`${imageUrl}/${booking.event.image}`}
                alt={`Image for ${booking.event.title}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Link
                  to={`/events/${booking.event.id}`}
                  className="text-white text-lg"
                >
                  Details
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-3">
              <h5 className="text-xl font-medium">
                {booking.event.title
                  ? capitalizeFirstLetter(
                      booking.event.title.split(" ").slice(0, 2).join(" ") +
                        (booking.event.title.split(" ").length > 2 ? "..." : "")
                    )
                  : "Title"}
              </h5>
              <div className="flex gap-2 items-center">
                <MapPinIcon className="h-5 w-6" />
                <span>
                  {booking.event.location
                    ? capitalizeFirstLetter(
                        booking.event.location
                          .split(" ")
                          .slice(0, 2)
                          .join(" ") +
                          (booking.event.location.split(" ").length > 2
                            ? "..."
                            : "")
                      )
                    : "Location"}
                </span>
              </div>
            </div>
          </div>
        ))
       ): (
        <div className="textxl font-semibold text-gray-800">You don't book any event</div>
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

export default Mybooked;
