"use client";
import { Link } from "react-router-dom";

const Home = () => {
  return (
      <section className="bg-gradient-to-r from-blue-900 to-gray-800 text-white py-20 w-full">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to Our Events</h1>
        <p className="text-xl mb-8">
          Discover, book, and manage your events with ease. Join us today!
        </p>
        <Link
          to="/public"
          className="bg-white text-purple-500 hover:bg-gray-200 font-semibold py-2 px-4 rounded transition duration-300"
        >
          Explore Events
        </Link>
      </div>
    </section>
  );
};

export default Home;
