"use client";
import { Button } from "flowbite-react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <p className="font-bold text-xl">welCome</p>
      <div className="flex flex-wrap gap-2">
        <Link to='/register'>
          {" "}
          <Button color="gray">Sign Up</Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
