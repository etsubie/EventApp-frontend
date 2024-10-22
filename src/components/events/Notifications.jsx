import { BellIcon } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Notifications = ({ isDropdownOpen, setDropdownOpen }) => {
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setNotifications(response.data || []);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
      setNotifications([]); 
    }
  };

  const handleDropdownToggle = () => {
    if (!isDropdownOpen) {
      fetchNotifications(); 
    }
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="relative">
      <button
        className="relative focus:outline-none"
        onClick={handleDropdownToggle}
      >
        {/* Notification Bell Icon */}
            <div className='bg-gray-100 w-10 h-9 text-blue-600 flex justify-center items-center rounded-full'>
                <BellIcon className='w-full h-7'/>
            </div>
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-10">
          <div className="p-4">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
          </div>
          <ul className="divide-y divide-gray-200">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <li key={notification.id} className="p-4 hover:bg-gray-100">
                  <Link to={`/events/${notification.data.event_id}`} className="block text-gray-700">
                    {notification.data.message}
                  </Link>
                </li>
              ))
            ) : (
              <li className="p-4 text-center text-gray-600">No notifications</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Notifications;
