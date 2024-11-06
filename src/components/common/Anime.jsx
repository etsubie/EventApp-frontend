import React, { useState, useEffect } from "react";
import { imageUrl } from "../../api/image";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import { Link } from "react-router-dom"; 
import { useEventContext } from "../../Context/EventContext";

const Anime = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { events, loading, error, fetchEvents } = useEventContext(); 

  useEffect(() => {
    const getEvents = async () => {
      try {
        await fetchEvents; // Fetch events from context
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };
    getEvents();
  }, [fetchEvents]);

  useEffect(() => {
    const interval = setInterval(() => {
      nextImage();
    }, 3000);

    return () => clearInterval(interval);
  }, [events.length]);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? events.length - 1 : prevIndex - 1
    );
  };

  if (loading) return <div className="flex justify-center"><Loader className='animate-spin'/></div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  
  return (
    <div className="w-full lg:h-80 md:h-48 p-0 relative">
      <div className="flex w-full h-full justify-center items-center overflow-hidden">
        <ChevronLeft
          onClick={prevImage}
          className="absolute left-0 z-10 bg-gray-100 h-8 w-8 rounded cursor-pointer"
        />
        <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {events.map((event, index) => (
            <Link
              key={event.id} // Use event.id instead of index for key
              to={`/events/${event.id}`} 
              className="flex-shrink-0 w-full" 
            >
              <img
                src={`${imageUrl}/${event?.image}`}
                alt={`Event ${index + 1}`}
                className="w-full h-full rounded object-cover"
                style={{ minWidth: "100%" }} 
              />
            </Link>
          ))}
        </div>
        <ChevronRight
          onClick={nextImage}
          className="absolute right-0 z-10 bg-gray-100 h-8 w-8 rounded cursor-pointer"
        />
      </div>
      <div className="flex justify-center mt-4">
        {events.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 mx-1 rounded-full ${index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Anime;