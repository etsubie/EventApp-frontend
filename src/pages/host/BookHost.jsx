import React, { useEffect, useState } from "react";
import { fetchBooked } from "../../api/book";
import { Loader } from "lucide-react";
import cart from "../../images/cart.jpg";
import Pagination from "../../components/common/Pagination";

const BookHost = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(5); 

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const data = await fetchBooked();

        if (!data || data.length === 0) {
          setError("No events found.");
        } else {
          // Group events by event ID
          const groupedEvents = data.reduce((acc, booked) => {
            const eventId = booked.id;
            if (!acc[eventId]) {
              // Initialize new event grouping
              acc[eventId] = {
                ...booked,
                bookings_count: booked.bookings_count,
                remaining_capacity: booked.remaining_capacity,
                totalBookings: booked.bookings_count,
              };
            }
            return acc;
          }, {});

          setEvents(Object.values(groupedEvents));
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("An error occurred while fetching events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(events.length / eventsPerPage);
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-8 flex flex-col space-y-4 justify-center items-center">
      <h1 className="text-2xl font-bold mb-6">My Events Booking Progress</h1>
      <div className="flex gap-5 flex-wrap">
        {currentEvents.length > 0 ? (
          currentEvents.map((event) => (
            <div key={event.id} className="grid grid-cols-2 shadow-xl p-3 gap-2">
              <img
                src={cart}
                alt="Event"
                className="rounded-lg w-80"
              />
              <div className="space-y-2 pl-4">
                <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                <p className=" font-semibold">Capacity: {event.capacity}</p>
                <p className=" font-semibold">Booked Tickets: {event.totalBookings}</p>
                <p className=" font-semibold">Remaining Tickets: {event.remaining_capacity}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No events found.</p>
        )}
      </div>
      {totalPages > 1 && (
        <Pagination
          className="mt-4"
          currentPage={currentPage}
          onPageChange={handlePageChange}
          showIcons={true}
          totalPages={totalPages}
        />
      )}
    </div>
  );
};

export default BookHost;
