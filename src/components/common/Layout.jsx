import React, { useContext } from 'react';
import { Navigation } from './Navigation';
import Sidebar from './Sidebar';
import { AuthContext } from '../../Context/AuthContext';

const Layout = ({ children }) => {
    const { user } = useContext(AuthContext);

  return (
    <div className="flex flex-col h-screen">
        {user?.role === "attendee" &&(
          <div className=''>
          <Navigation/>
          </div>
        )}
        {!user &&(
           <div className=''>
           <Navigation/>
           </div>
        )}
      <div className="flex flex-1">
        <aside className=" bg-gray-800 text-white">
        {user && (user.role === "admin" || user.role === "host") && <Sidebar />}
        </aside>
        <main className="flex-1 overflow-auto p-6 text-black">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
