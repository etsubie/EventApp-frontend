import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Button, Modal } from "flowbite-react";
import logo from "../../images/d.jpg";
import { AuthContext } from "../../Context/AuthContext";
import { logoutUser } from "../../api/auth";

export function Navigation() {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("title");
  const { token, user, setToken, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchUser = async () => {
    if (!token) {
      setUser(null);
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
      await logoutUser(token);
      setToken(null);
      setUser(null);
      navigate('/')
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    navigate(`/attendee/events?${searchType}=${encodeURIComponent(term)}`);
  };

  return (
    <Navbar fluid className="px-6 text-gray-100 bg-gray-800 bg-opacity-50">
      {!user && (
        <Navbar.Brand as={Link} to="/">
          <img src={logo} className="mr-3 h-6 sm:h-9" alt="Logo" />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Events
          </span>
        </Navbar.Brand>
      )}
      {user?.role === "admin" && (
        <Navbar.Brand as={Link} to="/admin/overview">
          <img src={logo} className="mr-3 h-6 sm:h-9" alt="Logo" />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Events
          </span>
        </Navbar.Brand>
      )}
      {user?.role === "attendee" && (
        <Navbar.Brand as={Link} to="/attendee/events">
          <img src={logo} className="mr-3 h-6 sm:h-9" alt="Logo" />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Events
          </span>
        </Navbar.Brand>
      )}
      {user?.role === "host" && (
        <Navbar.Brand as={Link} to="/host/events">
          <img src={logo} className="mr-3 h-6 sm:h-9" alt="Logo" />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Events
          </span>
        </Navbar.Brand>
      )}
      <div className="flex flex-col md:flex-row items-center md:order-2 space-x-0 md:space-x-4 space-y-4 md:space-y-0">
        {user?.role === "attendee" && (
          <>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="bg-gray-700 text-white rounded-lg pl-2 pr-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="title">Title</option>
              <option value="location">Location</option>
              <option value="category">Category</option>
              <option value="date">Date</option>
            </select>

            <input
              type="text"
              placeholder={`Search by ${searchType}...`}
              className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && handleSearch(e.target.value)
              }
            />
          </>
        )}
        {user ? (
          <>
            {user.role === "attendee" && (
              <Link to="/my-tickets">
                <Button className="text-white bg-blue-600 hover:bg-blue-700">
                  My Tickets
                </Button>
              </Link>
            )}
            <Button
              className="bg-red-800 border-none hover:border-none"
              onClick={handleLogout}
            >
              Logout
            </Button>
            <div className="flex flex-wrap gap-2">
              <div
                className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold cursor-pointer"
                onClick={() => setShowModal(true)}
              >
                {user.name?.charAt(0) || "U"}
              </div>
            </div>
          </>
        ) : (
          <Link to="/login">
            <Button color="gray">Login</Button>
          </Link>
        )}
      </div>
      <Modal
        show={showModal}
        size="md"
        popup={true}
        onClose={() => setShowModal(false)}
        className="flex justify-end m-6 bg-blue-800"
      >
        <Modal.Header />
        <Modal.Body>
          {user ? (
            <div className="text-center">
              <Link
                to={`/profile/${user.id}`}
                className="text-blue-800"
                onClick={() => setShowModal(false)}
              >
                View Profile
              </Link>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              No user data available
            </div>
          )}
        </Modal.Body>
      </Modal>
    </Navbar>
  );
}
