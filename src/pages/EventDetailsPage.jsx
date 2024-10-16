"use client";
import React, { useEffect, useState } from "react";
import { Button } from "flowbite-react";

import R from "../images/R.jpg";
import { CalendarIcon } from "lucide-react";
import { MapPinIcon } from "lucide-react"; 
import { fetchEventapi } from "../api/events";
import { useParams } from "react-router-dom";

const EventDetailsPage = () => {
  const [event, setEvent] = useState({});
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const getEvent = async () => {
      setError(null);
      try {
        const data = await fetchEventapi(id);
        setEvent(data);
      } catch (error) {
        setError(error.message);
        console.log(error.message);
      }
    };
    getEvent();
  }, []);

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div className="p-4 px-8 flex flex-col space-y-4">
      <div className="w-full p-0 md:h-64">
        <img src={R} alt="img" className="w-full h-full" />
      </div>
      <h1 className="font-bold text-xl">{event.title || "Event Title"}</h1>
      <div className="flex space-x-20">
        <span className="bg-gray-800 text-green-400 p-1 px-3 rounded">
         ${event.ticket_price || "Price not available"}
        </span>
        <span className="bg-gray-800 text-gray-300 p-1 px-3 rounded">
        {event.category ? event.category.name : "No category"}
        </span>
      </div>
      <span className="font-thin">Created by {event.user?.name || "Unknown"}</span>
      <div className="flex space-x-3">
        <CalendarIcon className="h-5 w-6 text-red-500" />
        <span> {new Date(event.start_date).toLocaleDateString() +" - "+ new Date(event.start_date).toLocaleDateString() || "Date"}</span>
      </div>
      <div className="flex space-x-3">
        <MapPinIcon className="h-6 w-6 text-red-500" />
        <span>{event.location || "Location"}</span>
      </div>
      <div className="flex space-x-4">
        <Button className="bg-green-600 border-none">Approve</Button>
        <Button className="bg-red-600 border-none">Reject</Button>
      </div>
      <div className="flex flex-col space-y-2">
        <h1 className="font-semibold">Description</h1>
        <p>{event.description || "No description available"}</p>
      </div>
    </div>
  );
};

export default EventDetailsPage;
