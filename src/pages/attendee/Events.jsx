import React from 'react';
import { useLocation } from 'react-router-dom';
import EventList from '../../components/common/EventList';
import { fetchEventpapi } from '../../api/public';

const Events = () => {
  const location = useLocation();
  
  // Get the query parameter type from the URL
  const queryParams = new URLSearchParams(location.search);
  const eventType = queryParams.get('type');

  // Function to determine which events to fetch
  const getEventsToFetch = () => {
    if (eventType === 'upcoming') {
      return fetchEventpapi({ upcoming: true });
    } else if (eventType === 'all') {
      return fetchEventpapi();
    } else {
      return fetchEventpapi(); // Default to all events if no type is specified
    }
  };

  // Determine the heading based on event type
  const heading = eventType === 'upcoming' ? 'Upcoming Events' : eventType === 'all' ? 'All Events' : 'Events';

  return (
    <div>
      <h1 className="text-center text-2xl font-bold mb-4">{heading}</h1>
      <EventList fetchEvents={getEventsToFetch} />
    </div>
  );
};

export default Events;
