import Header from "../components/common/Header";
import EventsTable from "../components/events/EventsTable";

const EventsPage = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Events" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <EventsTable />
      </main>
    </div>
  );
};
export default EventsPage;
