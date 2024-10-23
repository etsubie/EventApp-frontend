import React, { useEffect, useState } from "react";
import { fetchBooked } from "../../api/book";

const BookHost = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true); 
      const data = await fetchBooked(); 
      
      if (data.length === 0) {
        setError("No events found."); 
      } else {
        setEvents(data);
      }
      
      setLoading(false); 
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-8 flex flex-col space-y-4">
      <h1 className="text-2xl font-bold">My Events Booking Progress</h1>
      {events.length > 0 ? (
        events.map(event => (
          <div key={event.id} className="border p-4">
            <h2 className="text-xl font-semibold">{event.title}</h2>
            <p>Capacity: {event.capacity}</p>
            <p>Booked Tickets: {event.bookings_count}</p>
            <p>Remaining Tickets: {event.remaining_capacity}</p>
          </div>
        ))
      ) : (
        <p>No events found.</p>
      )}
    </div>
  );
};

export default BookHost;
