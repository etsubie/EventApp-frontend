import React, { useState, useEffect } from "react";
import R from "../../images/R.jpg";
import { Link } from "react-router-dom";
import { Card } from "flowbite-react";
import { fetchmyBooked } from "../../api/book";

const Mybooked = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="h-full">
      <h1 className="text-xl font-bold text-center mt-6">Events</h1>
      <div className="flex space-x-4 flex-wrap space-y-5 justify-center">
        {events.length > 0 ? (
          events.map((booking) => (
            <Link key={booking.event_id} to={`/events/${booking.event_id}`}>
              <Card
                className="max-w-sm w-80 shadow-xl"
                renderImage={() => (
                  <img width={400} height={400} src={R} alt="Event" />
                )}
              >
                <div className="flex space-x-4">
                  <span className="bg-gray-100 text-green-500 p-1 px-3 rounded">
                    ${booking.event.ticket_price || "Price not available"}
                  </span>
                </div>
                <h1 className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">
                  {booking.event.title.split(" ").slice(0, 3).join(" ") +
                    (booking.event.title.split(" ").length > 3 ? "..." : "")}
                </h1>
                <span className="text-blue-800">
                  {booking.event.location
                    ? booking.event.location.split(" ").slice(0, 3).join(" ") +
                      (booking.event.location.split(" ").length > 3 ? "..." : "")
                    : "Location"}
                </span>
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
