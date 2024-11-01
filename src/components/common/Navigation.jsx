import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../images/logo2.jpg";
import { AuthContext } from "../../Context/AuthContext";
import { logoutUser } from "../../api/auth";
import { SearchIcon } from "lucide-react";

export function Navigation() {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("title");
  const { token, user, setToken, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const modalRef = useRef(null);

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
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    navigate(`/events?${searchType}=${encodeURIComponent(term)}`);
  };
  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setShowModal(false);
    }
  };

  useEffect(() => {
    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  return (
    <div className="border-b p-2 border-r-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-2 sm:mb-0">
          <img src={logo} className="h-10 rounded-full" alt="" />
          <Link to="/">
            <span className="self-center whitespace-nowrap text-2xl font-bold text-orange-500 dark:text-white">
              Events
            </span>
          </Link>
        </div>
        {/* Search Container */}
        <div className="flex sm:flex-row mt-2 items-center border w-1/2 rounded-full border-gray-500">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="outline-none border-none rounded-l-full text-gray-500"
          >
            <option value="title">Title</option>
            <option value="location">Location</option>
            <option value="category">Category</option>
            <option value="date">Date</option>
          </select>

          <div className="flex items-center w-full text-gray-500">
            <SearchIcon />
            <input
              type="text"
              placeholder={`Search by ${searchType}...`}
              className="placeholder-gray-500 w-full outline-none rounded-r-full border-none"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && handleSearch(e.target.value)
              }
            />
          </div>
        </div>
        <div className="flex items-center">
          {user ? (
            <>
              {user.role === "attendee" && (
                <Link to="/my-tickets" className="mr-2">
                  My Tickets
                </Link>
              )}
              <div
                className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white cursor-pointer"
                onClick={() => setShowModal(true)}
              >
                {user.name?.charAt(0) || "U"}
              </div>
            </>
          ) : (
            <Link to="/login">
              <button className="text-gray-700 bg-gray-200 px-4 py-2 rounded-md">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
      {showModal && (
        <div
          ref={modalRef}
          className="justify-end mr-4 bg-white rounded-lg shadow-lg p-4 w-48"
        >
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-600 hover:text-gray-900 text-xl font-bold float-right"
          >
            &times;
          </button>
          <div className="text-center">
            {user ? (
              <>
                <Link
                  to={`/profile/${user.id}`}
                  className="text-blue-800 block mb-2"
                  onClick={() => setShowModal(false)}
                >
                  View Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-800 hover:text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <p className="text-gray-500">No user data available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
