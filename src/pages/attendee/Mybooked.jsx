import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "flowbite-react";
import { fetchmyBooked } from "../../api/book";
import { imageUrl } from "../../api/image";
import { Loader, MapPinIcon } from "lucide-react";

const Mybooked = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

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
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };
    getEvents();
  }, []);

  if (loading) return <div><Loader/></div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="h-full">
      <h1 className="text-xl font-bold text-center p-6">My Tickets</h1>
      <div className="flex space-x-4 flex-wrap justify-center">
        {events.length > 0 ? (
          events.map((booking) => (
            <Link key={booking.id} to={`/events/${booking.event_id}`}>
              <Card
                className="max-w-sm w-80 shadow-xl mb-5"
                renderImage={() => (
                  <img
                    className="w-full h-60"
                    src={`${imageUrl}/${booking?.event?.image}`}
                    alt="Event"
                  />
                )}
              >
                <div className="flex space-x-4">
                  <span className="bg-gray-100 text-green-500 p-1 px-3 rounded">
                    ${booking.event.ticket_price || "Price not available"}
                  </span>
                </div>
                <h1 className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">
                  {capitalizeFirstLetter(
                    booking?.event?.title?.split(" ").slice(0, 3).join(" ") +
                      (booking?.event?.title?.split(" ").length > 3
                        ? "..."
                        : "")
                  )}
                </h1>
                <div className="flex space-x-3 items-center">
                <MapPinIcon className="h-5 w-6" />
                <span>
                  {booking.event.location
                    ? booking.event.location.split(" ").slice(0, 2).join(" ") +
                      (booking.event.location.split(" ").length > 2
                        ? "..."
                        : "")
                    : "Location"}
                </span>
                </div>
              </Card>
            </Link>
          ))
        ) : (
          <span>No events found.</span>
        )}
      </div>
    </div>
  );
};

export default Mybooked;
