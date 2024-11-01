import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader, MapPinIcon } from "lucide-react";
import { getEventsByCategory } from "../api/events"; 
import { imageUrl } from "../api/image"; 

const EvntsbyCategory = () => {
  const { category } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Capitalize the first letter of each word
  const capitalizeFirstLetter = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  useEffect(() => {
    if (category) {
      const fetchEvents = async () => {
        setLoading(true);
        try {
          const data = await getEventsByCategory(category);
          setEvents(data);
          setError("");
        } catch (error) {
          setError(error.message || "Failed to load events.");
        } finally {
          setLoading(false);
        }
      };
      fetchEvents();
    }
  }, [category]);

  if (loading)
    return (
      <div className="flex justify-center">
        <Loader className="animate-spin"/>
      </div>
    );

  if (error) return <div className="text-red-500">Error: {error}</div>;

  // Get the first event's image
  const firstEventImage = events.length > 0 ? `${imageUrl}/${events[0].image}` : eventsImage;

  return (
    <div className="flex flex-col gap-12">
      <div className="grid bg-gray-100 lg:grid-cols-2 sm:grid-cols-1 lg:h-60">
        <div className="lg:h-full p-2 sm:h-48"> 
          <h1 className="text-2xl font-bold text-orange-400">{category} Events</h1>
          <p>Discover the best events in your area</p>
        </div>
        <img src={firstEventImage} alt={`Events related to ${category}`} className="w-full h-60 object-cover" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full">
        {events.map((event) => (
          <div key={event.id} className="rounded-xl p-5 shadow-xl w-auto lg:w-72 relative">
            <div className="rounded-xl overflow-hidden h-60 relative group">
              <img
                src={`${imageUrl}/${event.image}`} 
                alt={`Image for ${event.title}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Link
                  to={`/events/${event.id}`}
                  className="text-white text-lg"
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
        ))}
      </div>
    </div>
  );
};

export default EvntsbyCategory;
