import { Route, Routes } from "react-router-dom";

import Sidebar from "./components/common/Sidebar";

import OverviewPage from "./pages/admin/OverviewPage";
import ProductsPage from "./pages/admin/ProductsPage";
import UsersPage from "./pages/admin/UsersPage";
import SalesPage from "./pages/admin/SalesPage";
import OrdersPage from "./pages/admin/OrdersPage";
import SettingsPage from "./pages/admin/SettingsPage";
import { Navigation } from "./components/common/Navigation";
import Create from "./components/Post";
import Home from "./pages/Home";
import { Register } from "./pages/Auth/Register";
import { Login } from "./pages/Auth/Login";

function App() {
  return (
    <>
      <Navigation />
      <div className="flex  bg-gray-900 text-gray-100 h-screen overflow-hidden">
        {/* BG */}
        {/* <div className='fixed inset-0 z-0'>
				<div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80' />
				<div className='absolute inset-0 backdrop-blur-sm' />
			</div> */}
        <Sidebar />
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/admin/events" element={<ProductsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
		{/* host routes */}
		<Routes>
			<Route path="/events"  element={<Create/>}/>
		</Routes>
      </div>
    </>
  );
}

export default App;