import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit, Loader, Search, Trash2 } from "lucide-react";
import { useToast } from "../../Context/TostContext";
import { deletEventapi, fetchEventsapi } from "../../api/events";
import { Link, useNavigate } from "react-router-dom";
import { Modal, Button } from "flowbite-react";

const EventsTable = () => {
  const [originalEvents, setOriginalEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); 
  const [selectedEvent, setSelectedEvent] = useState(null); 

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

  const handleDelete = async (eventId) => {
    try {
      await deletEventapi(eventId);
      setEvents((prev) => prev.filter((event) => event.id !== eventId));
      addToast("Event deleted successfully!", "success");
      setShowModal(false); // Close the modal after deletion
    } catch (error) {
      addToast("Failed to delete event. Please try again.", "error");
    }
  };

  const openDeleteModal = (event) => {
    setSelectedEvent(event); // Store the selected event to be deleted
    setShowModal(true); // Open the modal
  };

  if (loading) return <div><Loader/></div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <motion.div
      className="bg-white backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-400 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search events..."
            className="placeholder-gray-600 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSearch}
            value={searchTerm}
          />
          <Search className="absolute left-3 top-2.5" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                Capacity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-300">
            {events.length > 0 ? (
              events.map((event) => (
                <motion.tr
                  key={event.id}
                  onClick={() => handleRowClick(event.id)}
                  className="hover:bg-gray-100 cursor-pointer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-950">
                    {event.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {event.category ? event.category.name : "No category"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${event.ticket_price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {event.capacity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {event.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex">
                    <Link
                      to={`/events/edit/${event.id}`}
                      className="text-indigo-400 hover:text-indigo-300 mr-2"
                      onClick={(e) => e.stopPropagation()} // Prevent row click
                    >
                      <Edit size={18} />
                    </Link>
                    <button
                      className="text-red-400 hover:text-red-300"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click
                        openDeleteModal(event); // Open delete modal with event details
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No events found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Modal show={showModal} size="md" popup={true} onClose={() => setShowModal(false)}>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <Trash2 className="mx-auto mb-4 h-14 w-14 text-red-500" />
            <h3 className="mb-5 text-lg font-normal text-gray-500">
              Are you sure you want to delete{" "}
              <span className="text-blue-700">{selectedEvent?.title}</span>? This action cannot be undone.
            </h3>
            <div className="flex justify-center gap-4">
              <Button className="text-blue-800" onClick={() => handleDelete(selectedEvent?.id)}>
                Yes, I'm sure
              </Button>
              <Button className="text-red-800" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </motion.div>
  );
};

export default EventsTable;
