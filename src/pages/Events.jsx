import React, { useState, useEffect } from "react";
import R from "../images/R.jpg";
import { Link } from "react-router-dom";
import { fetchEventsapi } from "../api/public";
import { Card } from "flowbite-react";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchEventsapi();
        setEvents(data);
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
    <div className="p-6 w-full bg-white h-full">
     <h1 className="text-xl font-bold text-center mb-6">Events</h1>
      <div className="flex space-x-4 flex-wrap space-y-5 justify-center mb-6">
        {events.length > 0 ? (
          events.map((event) => (
            <Link key={event.id} to={`/events/${event.id}`}>
              <Card
                className="max-w-sm w-80 shadow-xl"
                renderImage={() => (
                  <img
                  width={400}
                  height={400}
                  src={R}
                  alt="image 1"
                />
                )}
              >
               <div className="flex space-x-4">
               <span className="bg-gray-100 text-green-500 p-1 px-3 rounded">
                      ${event.ticket_price || "Price not available"}
                    </span>
                    <span className="bg-gray-100 text-blue-500 p-1 px-3 rounded">
                      {event.category ? event.category.name : "No category"}
                    </span>
               </div>
                    <h1 className=" font-bold text-xl tracking-tight text-gray-900 dark:text-white">
                    {event.title.split(" ").slice(0, 3).join(" ") +
                      (event.title.split(" ").length > 3 ? "..." : "")}
                  </h1>
                  <span className="text-blue-800">
                    {" "}
                    {event.location
                      ? event.location.split(" ").slice(0, 3).join(" ") +
                        (event.location.split(" ").length > 3 ? "..." : "")
                      : "Location"}
                  </span>
              </Card>
            </Link>
          ))
        ) : (
          <span> No events found.</span>
        )}
      </div>
    </div>
  );
};

export default Events;