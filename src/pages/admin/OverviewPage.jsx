import { ShoppingBag, User, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import Header from "../../components/common/Header";
import StatCard from "../../components/common/StatCard";
import { fetchEventsapi } from "../../api/events";
import { fetchUsers } from "../../api/users";
import { useToast } from "../../Context/TostContext";

const OverviewPage = () => {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [books, setBooked] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
const {addToast} = useToast

  useEffect(() => {
    const getEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchEventsapi();
        if (Array.isArray(data)) {
          setEvents(data);
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
    const getUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchUsers(); 
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          throw new Error("Unexpected data format from server.");
        }
      } catch (error) {
        addToast("Failed to fetch users. Please try again later.", "error");
      } finally {
        setLoading(false);
      }
    };

    getUsers(); 
  }, [addToast]);
  useEffect(() => {
    const fetchBookedEvents = async () => {
        try {
            const response = await fetch('/api/booked-events',{
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
            ); 
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setBooked(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    fetchBookedEvents();
}, []);
  

  // Calculate statistics
  const totalEvents = events.length;
  const totalUsers = users.length;
  const totalBookings = books.length;
  const totalSales = books.reduce((total, book) => total + book.event.ticket_price, 0);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Overview" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-2 gap-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Users"
            icon={User}
            value={totalUsers}
            color="#6366F1"
          />
          <StatCard
            name="Total Sales"
            icon={Zap}
            value={`$${totalSales}`}
            color="#6366F1"
          />
          <StatCard
            name="Total Events"
            icon={ShoppingBag}
            value={totalEvents}
            color="#8B55F6"
          />
          <StatCard
            name="Total Bookings"
            icon={ShoppingBag}
            value={totalBookings}
            color="#228822"
          />
        </motion.div>
      </main>
    </div>
  );
};

export default OverviewPage;
