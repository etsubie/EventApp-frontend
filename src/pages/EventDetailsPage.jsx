"use client";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "flowbite-react";
import { AuthContext } from "../Context/AuthContext";
import { ArrowBigLeft, CalendarIcon, MapPinIcon, Loader, ArrowLeft } from "lucide-react";
import { fetchEventapi } from "../api/events";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useToast } from "../Context/TostContext";
import { Approveapi, rejectapi } from "../api/approve";
import { imageUrl } from "../api/image";

const EventDetailsPage = () => {
  const [event, setEvent] = useState({});
  const [error, setError] = useState(null);
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const addToast = useToast();
  const { id } = useParams();
  const [hasApproved, setHasApproved] = useState(false);
  const [hasRejected, setHasRejected] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); 

  useEffect(() => {
    const getEvent = async () => {
      setError(null);
      try {
        const data = await fetchEventapi(id);
        setEvent(data);

        if (data.approvedUsers && data.approvedUsers.includes(user?.id)) {
          setHasApproved(true);
        }
        if (data.rejectedUsers && data.rejectedUsers.includes(user?.id)) {
          setHasRejected(true);
        }
      } catch (error) {
        setError(error.message);
        console.log(error.message);
      }
    };
    getEvent();
  }, [id, user]);

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader /></div>;
  }

  const handleApprove = async (id) => {
    if (hasApproved) {
      addToast("You have already approved this event.", "info");
      return;
    }

    try {
      await Approveapi(id);
      setHasApproved(true);
      addToast("Approved successfully!", "success");
    } catch (error) {
      console.error("Update error:", error);
      addToast(error.message, "error");
    }
  };

  const handleReject = async (id) => {
    if (hasRejected) {
      addToast("You have already rejected this event.", "info");
      return;
    }
    try {
      const response = await rejectapi(id);
      setHasRejected(true);
      addToast(response.data.message, "success");
    } catch (error) {
      console.error("Update error:", error);
      addToast("Update failed: " + error.message, "error");
    }
  };

  const handleBook = () => {
    navigate(`/payment/${event.id}`);
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex flex-col lg:flex-row rounded-lg w-full gap-6 p-4 shadow-xl">
        <img
          src={`${imageUrl}/${event.image}`}
          alt=' Image'
          className="h-[400px] w-96 rounded-lg object-cover shadow-md"
        />
        <div className="w-full h-full flex flex-col justify-between">
          <div className="flex flex-col gap-4 w-full">
            <ArrowLeft onClick={() => navigate(-1)} className="bg-gray-100 cursor-pointer p-2 rounded h-9 w-20 hover:bg-gray-200 transition duration-300" />
            <h1 className="font-bold text-2xl text-gray-800">{event.title || "Event Title"}</h1>
            <div className="flex flex-col">
              <span className="text-blue-800 font-bold text-lg">
                Price: ${event.ticket_price || "Price not available"}
              </span>
              <span className="font-semibold text-gray-700">
                Category: {event.category ? event.category.name : "No category"}
              </span>
            </div>
            {user?.role !== "host" && (
              <span className="font-thin text-gray-600">
                Created by {event.user?.name || "Unknown"}
              </span>
            )}
            <div className="flex items-center space-x-3">
              <CalendarIcon className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700">
                {new Date(event.start_date).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }) + " - " + new Date(event.end_date).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }) || "Date"}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPinIcon className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700">{event.location || "Location"}</span>
            </div>
          </div>

          {/* Action Buttons */}
          {user?.role === "admin" ? (
            <div className="flex space-x-4 mt-4">
              <Button
                className={`bg-blue-800 border-none ${hasApproved ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => handleApprove(event.id)}
                disabled={hasApproved}
              >
                {loading ? "Approving..." : "Approve"}
              </Button>
              <Button
                className={`bg-red-600 border-none ${hasRejected ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => handleReject(event.id)}
                disabled={hasRejected}
              >
                {loading ? "Rejecting..." : "Reject"}
              </Button>
            </div>
          ) : user?.role === "host" ? null :
            user?.role === "attendee" ? (
              event.remaining_capacity > 0 && new Date(event.end_date) > new Date() ? (
                <Button className="bg-blue-800 border-none w-28 mt-4" onClick={handleBook}>
                  Buy Ticket
                </Button>
              ) : (
                <span className="text-red-600 font-bold mt-4">
                  Tickets are not available
                </span>
              )
            ) : !user ? (
              event.remaining_capacity > 0 && new Date(event.end_date) > new Date() ? (
                <Link
                  to="/login"
                  className="bg-blue-600 border-none w-28 text-white p-2 rounded text-center mt-4 inline-block"
                >
                  Get Tickets
                </Link>
              ) : (
                <span className="text-red-600 font-bold mt-4">
                  Tickets are not available
                </span>
              )
            ) : null}

          {/* Button to show description in a modal */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 bg-gray-300 text-black px-4 py-2 rounded transition duration-300 hover:bg-gray-400"
          >
            About Event
          </button>
        </div>
      </div>

      {/* Modal for Event Description */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setIsModalOpen(false)} />
          <div className="bg-white rounded-lg shadow-lg p-6 z-10 w-11/12 md:w-1/2">
            <h2 className="text-xl font-bold mb-4">{event.title || "Event Title"}</h2>
            <p>{event.description || "No description available"}</p>
            <button
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded transition duration-300 hover:bg-blue-700"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetailsPage;
