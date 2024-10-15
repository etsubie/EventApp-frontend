import { BrowserRouter, Route, Routes } from "react-router-dom";
import Sidebar from "./components/common/Sidebar";
import OverviewPage from "./pages/admin/OverviewPage";
import ProductsPage from "./pages/admin/ProductsPage";
import UsersPage from "./pages/admin/UsersPage";
import Home from "./pages/Home";
import { Register } from "./pages/Auth/Register";
import { Login } from "./pages/Auth/Login";
import PrivateRoute from "./Context/PrivateRoute/PrivateRoute";
import { Navigation } from "./components/common/Navigation";
import { UserForm } from "./pages/UserFrom";
import { useContext } from "react";
import { AuthContext } from "./Context/AuthContext";
import { ToastProvider } from "./Context/TostContext";

function App() {
  const { user } = useContext(AuthContext);
  return (
    <ToastProvider>
      <BrowserRouter>
      <Navigation />
      <div className="flex  bg-gray-900 text-gray-100 h-screen overflow-hidden">
      {user && user.role === "admin" && <Sidebar />}
      <Routes>
          {/* routes for all */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

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

          {/* host routes */}
          <Route
            path="/host/events"
            element={
              <PrivateRoute role="host">
                <ProductsPage />
              </PrivateRoute>
            }
          />

          {/* attendee routes */}
          <Route
            path="/attendee/events"
            element={
              <PrivateRoute role="attendee">
                <ProductsPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
