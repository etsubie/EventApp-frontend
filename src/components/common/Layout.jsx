import React, { useContext } from 'react';
import { Navigation } from './Navigation';
import Sidebar from './Sidebar';
import { AuthContext } from '../../Context/AuthContext';

const Layout = ({ children }) => {
    const { user } = useContext(AuthContext);

  return (
    <div className="flex flex-col h-screen">
        <div className='bg-blue-950'>
        <Navigation/>
        </div>
      <div className="flex flex-1">
        <aside className="bg-blue-950 text-white">
        {user && (user.role === "admin" || user.role === "host") && <Sidebar />}
        </aside>
        <main className="flex-1 overflow-auto p-4 bg-gray-200 text-black">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
