import React, { useContext } from "react";
import { Navigation } from "./Navigation";
import Sidebar from "./Sidebar";
import { AuthContext } from "../../Context/AuthContext";

const Layout = ({ children }) => {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex flex-col h-screen">
      {user?.role === "attendee" && (
        <div className="mb-14">
          <Navigation />
        </div>
      )}
      {!user && (
        <div className="mb-14">
          <Navigation />
        </div>
      )}
      <div className="flex flex-1">
        <aside className=" bg-gray-800 text-white h-full">
          {user && (user.role === "admin" || user.role === "host") && (
            <Sidebar />
          )}
        </aside>
        <main className="flex-1 p-6 text-black relative z-10 lg:mt-0 sm:mt-20">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
