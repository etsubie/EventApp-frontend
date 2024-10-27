import React, { useState } from 'react';
import Collection from '../../components/events/Collection';
import UpcomingEvents from '../../components/events/UpcomingEvents';

const Eventspage = () => {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className='h-full w-full flex flex-col items-center gap-4 '>
      <div className='flex justify-center gap-10 p-8'>
        <button
          className={` ${activeTab === 'all' ? 'border-b-4 border-blue-500' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Events
        </button>
        <button
          className={`${activeTab === 'upcoming' ? 'border-b-4 border-blue-500' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming Events
        </button>
      </div>
      {activeTab === 'all' && <Collection />}
      {activeTab === 'upcoming' && <UpcomingEvents />}
    </div>
  );
};

export default Eventspage;
