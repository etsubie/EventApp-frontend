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

function App() {
  return (
    <BrowserRouter>
    <Navigation/>
      <div className="flex  bg-gray-900 text-gray-100 h-screen overflow-hidden">
        <Sidebar />
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
  );
}

export default App;
