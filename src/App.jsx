import { BrowserRouter, Route, Routes } from "react-router-dom";
import OverviewPage from "./pages/admin/OverviewPage";
import UsersPage from "./pages/admin/UsersPage";
import Home from "./pages/Home";
import { Register } from "./pages/Auth/Register";
import { Login } from "./pages/Auth/Login";
import PrivateRoute from "./Context/PrivateRoute/PrivateRoute";
import { UserForm } from "./pages/UserFrom";
import { ToastProvider } from "./Context/TostContext";
import EventsPage from "./pages/EventsPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import { EventForm } from "./pages/EventForm";
import { CategoryDropdown } from "./components/events/CategoreyDropdown";
import StripePaymentForm from "./components/Payment";
import Events from "./pages/Events";
import Eventspage from "./pages/attendee/Eventspage";
import PageNotFound from "./pages/PageNotFound";
import BookHost from "./pages/host/BookHost";
import Mybooked from "./pages/attendee/Mybooked";
import Layout from "./components/common/Layout";
import SettingsPage from "./pages/admin/SettingsPage";
import { Profiledata } from "./pages/Profiledata";
import { ChangPass } from "./pages/PasswordChange";
import { useContext } from "react";
import { AuthContext } from "./Context/AuthContext";

function App() {
  const { user } = useContext(AuthContext);
  return (
    <ToastProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* routes for all */}
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/events/:id" element={<EventDetailsPage />} />
            <Route path="/events/edit/:id" element={<EventForm />} />
            <Route path="/public" element={<Events />} />

            <Route path="*" element={<PageNotFound />} />

            {user && (
              <>
                <Route path="/profile/:id" element={<SettingsPage />} />
                <Route path="/profile/edit/:id" element={<Profiledata />} />
                <Route path="/change-password/:id" element={<ChangPass />} />
              </>
            )}

            {/* admin routes */}
            <Route
              path="/admin/overview"
              element={
                <PrivateRoute role="admin">
                  <OverviewPage />
                </PrivateRoute>
              }
            />
            <Route
              path="admin/users"
              element={
                <PrivateRoute role="admin">
                  <UsersPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/users/:id"
              element={
                <PrivateRoute role="admin">
                  <UserForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/events"
              element={
                <PrivateRoute role="admin">
                  <EventsPage />
                </PrivateRoute>
              }
            />
            {/* host routes */}
            <Route
              path="/host/events"
              element={
                <PrivateRoute role="host">
                  <EventsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/events/create"
              element={
                <PrivateRoute role="host">
                  <EventForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/booked"
              element={
                <PrivateRoute role="host">
                  <BookHost />
                </PrivateRoute>
              }
            />
            <Route
              path="/categories/create"
              element={
                <PrivateRoute role="host">
                  <CategoryDropdown />
                </PrivateRoute>
              }
            />
            <Route
              path="/categories"
              element={
                <PrivateRoute role="host">
                  <CategoryDropdown />
                </PrivateRoute>
              }
            />
            {/* attendee routes */}
            <Route
              path="/attendee/events"
              element={
                <PrivateRoute role="attendee">
                  <Eventspage />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-tickets"
              element={
                <PrivateRoute role="attendee">
                  <Mybooked />
                </PrivateRoute>
              }
            />
            <Route
              path="/payment/:id"
              element={
                <PrivateRoute role="attendee">
                  <StripePaymentForm />
                </PrivateRoute>
              }
            />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
