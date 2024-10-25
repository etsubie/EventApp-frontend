import { Link, useNavigate } from "react-router-dom";
import { Navbar, Button, Modal } from "flowbite-react";
import logo from "../../images/d.jpg";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { logoutUser } from "../../api/auth";
import { Search } from "lucide-react";

export function Navigation() {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { token, user, setToken, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchUser = async () => {
    if (!token) {
      setUser(null); // User is logged out
      return;
    }

    try {
      const res = await fetch("/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setUser({
          ...data,
          role: data.roles.length > 0 ? data.roles[0] : null,
        });
      } else {
        console.error("Failed to fetch user data:", data);
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [token]);

  const handleLogout = async () => {
    try {
      const data = await logoutUser();
      if (data?.message) {
        localStorage.removeItem("token"); // Clear the token
        setToken(null); // Clear the token in context
        setUser(null); // Clear user data on logout
        navigate('/');
      } else {
        console.error('Logout error:', data);
      }
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Navbar fluid className="px-6 text-gray-100 bg-gray-800 bg-opacity-50">
      <Navbar.Brand as={Link} to="/">
        <img src={logo} className="mr-3 h-6 sm:h-9" alt="Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Events
        </span>
      </Navbar.Brand>
      <div className="flex space-x-4 items-center">
        {user?.role === 'attendee' && (
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
        )}
        {user ? (
          <>
            {user.role === 'host' && (
              <Link to='/events/create'>Create Events</Link>
            )}
            {user.role === 'attendee' && (
              <Link to='/my-tickets'>My Tickets</Link>
            )}
            <Button className="bg-red-800 border-none hover:border-none" onClick={handleLogout}>
              Logout
            </Button>
            <div className="flex flex-wrap gap-2">
              <div 
                className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold cursor-pointer"
                onClick={() => setShowModal(true)} 
              >
                {user.name?.charAt(0) || 'U'}
              </div>
            </div>
          </>
        ) : (
          <Link to="/login">
            <Button color="gray">Login</Button>
          </Link>
        )}
      </div>
      <Modal show={showModal} size="md" popup={true} onClose={() => setShowModal(false)} className="flex justify-end">
        <Modal.Header />
        <Modal.Body>
          {user ? (
            <div className="text-center">
              <Link to={`/profile/${user.id}`} className="text-blue-800" onClick={() => setShowModal(false)}>
                View Profile
              </Link>
            </div>
          ) : (
            <div className="text-center text-gray-500">No user data available</div>
          )}
        </Modal.Body>
      </Modal>
    </Navbar>
  );
}
