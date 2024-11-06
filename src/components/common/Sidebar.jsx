import {
  BarChart2,
  Menu,
  ShoppingBag,
  Users,
  User,
  ArrowBigDown,
  LogOutIcon,
} from "lucide-react";
import { useContext, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import logo from "../../images/logo2.jpg"; 
import { logoutUser } from "../../api/auth";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, setUser, setToken, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser(token); // Ensure token is passed correctly
      setToken(null);
      setUser(null);
      navigate("/"); // Redirect to the home page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const SIDEBAR_ITEMS =
    user?.role === "admin"
      ? [
          {
            name: "Overview",
            icon: BarChart2,
            color: "#6366f1",
            href: "/admin/overview",
          },
          {
            name: "Events",
            icon: ShoppingBag,
            color: "#8B5CF6",
            href: "/admin/events",
          },
          {
            name: "Users",
            icon: Users,
            color: "#EC4899",
            href: "/admin/users",
          },
          {
            name: "Profile",
            icon: User,
            color: "#6EE7B7",
            href: `/profile/${user.id}`,
          },
          {
            name: "Logout",
            icon: LogOutIcon,
            color: "#F87171",
            onClick: handleLogout,
          },
        ]
      : [
          {
            name: "Events",
            icon: ShoppingBag,
            color: "#8B5CF6",
            href: "/host/events",
          },
          {
            name: "Booked",
            icon: ShoppingBag,
            color: "#228822",
            href: "/booked",
          },
          {
            name: "Create",
            icon: ArrowBigDown,
            color: "#8B5CF6",
            href: "/events/create",
          },
          {
            name: "Profile",
            icon: User,
            color: "#6EE7B7",
            href: `/profile/${user.id}`,
          },
          {
            name: "Logout",
            icon: LogOutIcon,
            color: "#F87171",
            onClick: handleLogout,
          },
        ];

  return (
    <motion.div
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 h-full ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
    >
      <div className="h-full backdrop-blur-md p-4 flex flex-col border-r shadow border-gray-500">
       <div className="flex justify-center gap-4 items-center">
       <img
          src={logo}
          alt="Logo"
          className="h-10 w-auto mb-2 rounded-full" 
        />

        {/* Display Events text based on sidebar state */}
          {isSidebarOpen && (
            <span
              className="text-3xl font-bold mb-4 text-orange-500"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              Events
            </span>
          )}
       </div>
       <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-full hover:bg-gray-600 transition-colors max-w-fit"
        >
          <Menu size={24} />
        </motion.button>
        <nav className="mt-4 flex-grow">
          {SIDEBAR_ITEMS.map((item) =>
            item.onClick ? (
              <motion.div
                key={item.name}
                className="flex items-center p-4 text-sm font-medium rounded-lg cursor-pointer hover:bg-gray-600 transition-colors mb-2"
                onClick={item.onClick}
              >
                <item.icon
                  size={20}
                  style={{ color: item.color, minWidth: "20px" }}
                />
                <span className={`ml-4 ${isSidebarOpen ? 'block' : 'hidden'}`}>
                  {item.name}
                </span>
              </motion.div>
            ) : (
              <Link key={item.href} to={item.href}>
                <motion.div className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-600 transition-colors mb-2">
                  <item.icon
                    size={20}
                    style={{ color: item.color, minWidth: "20px" }}
                  />
                  <span className={`ml-4 ${isSidebarOpen ? 'block' : 'hidden'}`}>
                    {item.name}
                  </span>
                </motion.div>
              </Link>
            )
          )}
        </nav>
      </div>
    </motion.div>
  );
};

export default Sidebar;
