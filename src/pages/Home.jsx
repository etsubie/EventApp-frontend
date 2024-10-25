"use client";
import { Link } from "react-router-dom";
import  hero  from "../images/events.jpg";
import { Button } from "flowbite-react";

const Home = () => {
  return (
    <section className="flex space-x-2 h-full">
     
      <div className="container mx-auto px-4 flex flex-col justify-center items-center text-center w-1/2">
        <h1 className="text-5xl font-bold mb-4">Welcome to Our Events</h1>
        <p className="text-xl mb-8">
          Discover, book, and manage your events with ease. Join us today!
        </p>
        <Button className="bg-blue-950 hover:bg-blue-800"><Link
          to="/public"
          className=" text-gray-100  font-semibold py-2 px-4 rounded transition duration-300"
        >
          Explore Events
        </Link></Button>
      </div>
      <div className="h-full w-1/2 flex justify-center items-center ">
        <img src={hero} alt="" className="w-full rounded-t-full"/>
      </div>
    </section>
  );
};

export default Home;
