import React, { useState, useEffect } from "react";
import R from "../../images/R.jpg";
import { Link, useLocation } from "react-router-dom";
import { fetchEventsapi } from "../../api/events";
import { Card } from "flowbite-react";
import { Loader, MapPinIcon } from "lucide-react";
import { imageUrl } from "../../api/image";

const Collection = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchTerm = searchParams.get("title") || searchParams.get("location") || searchParams.get("category") || searchParams.get("date") || '';
    const searchType = searchParams.has("title") ? "title" : searchParams.has("location") ? "location" : searchParams.has("category") ? "category" : "date";

    const capitalizeFirstLetter = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    useEffect(() => {
        const getEvents = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchEventsapi();
                if (Array.isArray(data)) {
                    setEvents(data);
                    setFilteredEvents(data); 
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

    useEffect(() => {
        const filterEvents = () => {
            const filtered = events.filter(event => {
                const matchesTerm = searchTerm === '' ||
                    (searchType === 'title' && event.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (searchType === 'location' && event.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (searchType === 'category' && event.category && event.category.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (searchType === 'date' && event.start_date.startsWith(searchTerm));

                return matchesTerm;
            });
            setFilteredEvents(filtered);
        };

        filterEvents();
    }, [searchTerm, searchType, events]);

    if (loading) return <div><Loader/></div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1 className="text-xl font-bold text-center mb-6">Events</h1>
            <div className="flex space-x-4 flex-wrap justify-center">
                {filteredEvents.length > 0 ? (
                    filteredEvents.map((event, index) => (
                        <Link key={`${event.id}-${index}`} to={`/events/${event.id}`}>
                            <Card
                                className="max-w-sm w-80 shadow-xl mb-6"
                                renderImage={() => (
                                    <img
                                        className="w-full h-60"
                                        src={`${imageUrl}/${event.image}`}
                                        alt="event"
                                    />
                                )}
                            >
                                <div className="flex justify-between">
                                    <span className="bg-gray-100 text-blue-800 font-bold p-1 px-3 rounded">
                                        ${event.ticket_price || "Price not available"}
                                    </span>
                                    <span className="bg-gray-100 p-1 px-3 rounded">
                                        {event.category
                                            ? capitalizeFirstLetter(event.category.name)
                                            : "No category"}
                                    </span>
                                </div>

                                <h1 className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">
                                    {capitalizeFirstLetter(
                                        event.title.split(" ").slice(0, 3).join(" ") +
                                        (event.title.split(" ").length > 3 ? "..." : "")
                                    )}
                                </h1>

                                <div className="flex space-x-3 items-center">
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
                            </Card>
                        </Link>
                    ))
                ) : (
                    <span className="text-center">No events found.</span>
                )}
            </div>
        </div>
    );
};

export default Collection;
