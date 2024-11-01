import React from "react";
import { Link } from "react-router-dom";
import { Loader } from "lucide-react";
import { useEventContext } from "../../Context/EventContext";

const Categories = () => {
  const { events, loading, error } = useEventContext();

  if (loading) return <div className="flex justify-center"><Loader /></div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  // Create a map to store unique categories with one representative event for each
  const uniqueCategories = Array.from(
    events.reduce((map, event) => map.set(event?.category?.name, event), new Map()).values()
  );

  return (
    <div className="flex gap-5 items-center justify-center">
      <div className='flex gap-5'>
        <Link
          className="border text-orange-500 font-semibold rounded-lg flex justify-center items-center p-3 px-6 shadow-xl"
          to={`/events?type=all`}
        >
          All Events
        </Link>
        <Link
          className="border text-orange-500 font-semibold rounded-lg flex justify-center items-center p-3 px-6 shadow-xl"
          to={`/events?type=upcoming`}
        >
          Upcoming Events
        </Link>
      </div>
      {uniqueCategories.map((event) => (
  <Link
    key={event.id}
    className="border text-orange-500 font-semibold rounded-lg flex justify-center items-center p-3 px-6 shadow-xl"
    to={`/events/category/${event?.category?.name}`}
  >
    {event?.category?.name}
  </Link>
))}

    </div>
  );
};

export default Categories;
