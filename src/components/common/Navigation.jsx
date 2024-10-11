import { Link } from "react-router-dom";
import { Navbar } from "flowbite-react";
import { Avatar } from "flowbite-react";
import logo from "../../images/d.jpg";
import user from "../../images/user.jpg";

export function Navigation() {
  return (
    <Navbar fluid className=" px-4 text-gray-100 bg-gray-900"> 
      <Navbar.Brand as={Link} to="/">
        <img src={logo} className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Events
        </span>
      </Navbar.Brand>
      <div className="flex space-x-4">
        <div className="flex flex-wrap gap-2">
          <Avatar img={user} alt="avatar of user" rounded />
        </div>
    
      </div>
    </Navbar>
  );
}
