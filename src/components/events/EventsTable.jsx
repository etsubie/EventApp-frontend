import { motion } from "framer-motion";
import { Edit, Search, Trash2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useToast } from "../../Context/TostContext";
import { fetchEventsapi } from "../../api/events";
import { Link, useNavigate } from "react-router-dom"; 

const EventsTable = () => {
  const [originalEvents, setOriginalEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const addToast = useToast();
  const navigate = useNavigate(); 

  useEffect(() => {
    const getEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchEventsapi();
        if (Array.isArray(data)) {
          setEvents(data);
          setOriginalEvents(data);
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
  }, [addToast]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = originalEvents.filter(
      (event) =>
        event.title.toLowerCase().includes(term) ||
        (event.category && event.category.name.toLowerCase().includes(term))
    );
    setEvents(filtered);
  };

  const handleRowClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Event List</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search events..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSearch}
            value={searchTerm}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Capacity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {events.length > 0 ? (
              events.map((event) => (
                <motion.tr
                key={event.id}
                onClick={() => handleRowClick(event.id)}
                className="hover:bg-gray-900 cursor-pointer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                  {event.title}
                </td>
              
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {event.category ? event.category.name : "No category"}
                </td>
              
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  ${event.ticket_price}
                </td>
              
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {event.capacity}
                </td>
              
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {event.location}
                </td>
              
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 flex">
                  {/* Edit Link */}
                  <Link
                    to={`/events/edit/${event.id}`}
                    className="text-indigo-400 hover:text-indigo-300 mr-2"
                    onClick={(e) => e.stopPropagation()} // Prevent row click
                  >
                    <Edit size={18} />
                  </Link>
              
                  {/* Delete Button */}
                  <button
                    className="text-red-400 hover:text-red-300"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click
                      handleDelete(event.id); 
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </motion.tr>
              
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-gray-300">
                  No events found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default EventsTable;
