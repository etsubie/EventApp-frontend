"use client";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "flowbite-react";
import { AuthContext } from "../Context/AuthContext";
import R from "../images/R.jpg";
import { ArrowUp, CalendarIcon, MapPinIcon } from "lucide-react";
import { fetchEventapi } from "../api/events";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useToast } from "../Context/TostContext";
import { Approveapi, rejectapi } from "../api/approve";

const EventDetailsPage = () => {
  const [event, setEvent] = useState({});
  const [error, setError] = useState(null);
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const addToast = useToast();
  const { id } = useParams();
  const [hasApproved, setHasApproved] = useState(false);
  const [hasRejected, setHasRejected] = useState(false);

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
  const handleApprove = async (id) => {
    // Check if event is already approved
    if (hasApproved) {
      addToast("You have already approved this event.", "info");
      return;
    }

    try {
      const response = await Approveapi(id);
      // Update state to reflect approval
      setHasApproved(true);

      addToast("Approved successfully!", "success");
    } catch (error) {
      console.error("Update error:", error);
      addToast("Update failed: An unexpected error occurred.", "error");
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
    <div className="p-8 flex flex-col h-full space-y-4 w-full bg-white text-black">
      <div className="w-full p-0 sm:h-72">
        <img src={R} alt="img" className="w-full h-full" />
      </div>
      <h1 className="font-bold text-xl">{event.title || "Event Title"}</h1>
      <div className="flex space-x-20">
        <span className="bg-gray-100 text-green-500 p-1 px-3 rounded">
          ${event.ticket_price || "Price not available"}
        </span>
        <span className="bg-gray-100 p-1 px-3 rounded ">
          {event.category ? event.category.name : "No category"}
        </span>
      </div>
      {user?.role !== "host" && (
        <span className="font-thin">
          Created by {event.user?.name || "Unknown"}{" "}
        </span>
      )}
      <div className="flex space-x-3">
        <CalendarIcon className="h-5 w-6" />
        <span>
          {new Date(event.start_date).toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          }) +
            " - " +
            new Date(event.end_date).toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            }) || "Date"}
        </span>
      </div>
      <div className="flex space-x-3">
        <MapPinIcon className="h-6 w-6" />
        <span>{event.location || "Location"}</span>
      </div>

      {user?.role === "admin" ? (
        <div className="flex space-x-4">
          <Button
            className="bg-blue-950 border-none"
            onClick={() => handleApprove(event.id)}
            disabled={hasApproved}
          >
           { loading? 'Approving' : 'Approve'}
          </Button>
          <Button
            className="bg-red-900 border-none"
            onClick={() => handleReject(event.id)}
            disabled={hasRejected}
          >
            {loading ? 'Rejecting' :'Reject'}
          </Button>
        </div>
      ) : user?.role === "host" ? (
        <></>
      ) : user?.role === "attendee" ? (
        event.remaining_capacity > 0 &&
        new Date(event.end_date) > new Date() ? (
          <Button className="bg-blue-950 border-none w-28" onClick={handleBook}>
            Buy
          </Button>
        ) : (
          <span className="text-red-600 font-bold">
            Tickets are not available
          </span>
        )
      ) : !user ? (
        event.remaining_capacity > 0 &&
        new Date(event.end_date) > new Date() ? (
          <Link
            to="/login"
            className="bg-blue-600 border-none w-28 text-white p-2 rounded text-center"
          >
            Get Tickets
          </Link>
        ) : (
          <span className="text-red-600 font-bold">
            Tickets are not available
          </span>
        )
      ) : null}

      <div className="flex flex-col space-y-2">
        <h1 className="font-semibold">Description</h1>
        <p>{event.description || "No description available"}</p>
      </div>
      <div className="flex justify-end"><Button
        className="bg-blue-950 border-none w-28 mb-10 flex"
        onClick={() => window.scrollTo(0, 0)}
      >
        <ArrowUp/>
      </Button></div>
    </div>
  );
};

export default EventDetailsPage;
