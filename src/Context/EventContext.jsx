import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchEventpapi } from "../api/public";

const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("title"); // Default search type

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await fetchEventpapi();
      setEvents(data);
      setError("");
    } catch (error) {
      setError(error.message || "Failed to load events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter events based on the search term and type
  const filteredEvents = events.filter(event => {
    if (!searchTerm) return true; // If no search term, return all events
    const valueToCheck = event[searchType] ? event[searchType].toString().toLowerCase() : '';
    return valueToCheck.includes(searchTerm.toLowerCase());
  });

  return (
    <EventContext.Provider
      value={{
        events: filteredEvents, // Provide filtered events
        loading,
        error,
        fetchEvents,
        searchTerm,
        setSearchTerm,
        searchType,
        setSearchType,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEventContext = () => useContext(EventContext);
