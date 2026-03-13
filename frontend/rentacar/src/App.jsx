import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/register";
import Home from "./components/Home";

/* ADMIN */
import Layout from "./components/Layout";
import AdminDashboard from "./components/Admindashboard";
import Cars from "./components/Cars";
import Bookings from "./components/Bookings";
import Reports from "./components/Reports";
import Users from "./components/users";

/* USER */
import Userlayout from "./components/Userlayout";
import Userdashboard from "./components/Userdashboard";
import BookingPage from "./components/Bookingpage";
import MyProfile from "./components/Myprofile";

/* OWNER */
import Ownerlayout from "./components/Ownerlayout";
import Ownerdashboard from "./components/Ownerdashboard";
import AddCar from "./components/Addcar";
import Ownercars from "./components/ownercars";
import Acceptingrequest from "./components/Acceptingrequest";

function App() {
  return (
    <Router>

      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/booking" element={<BookingPage />} />

        {/* USER ROUTES */}
        <Route element={<Userlayout />}>
          <Route path="/userdashboard" element={<Userdashboard />} />
          <Route path="/myprofile" element={<MyProfile />} />
        </Route>

        {/* ADMIN ROUTES */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/users" element={<Users />} />
          <Route path="/bookings" element={<Bookings />} />
        </Route>

        {/* OWNER ROUTES */}
        <Route element={<Ownerlayout />}>
         
          <Route path="/addcar" element={<AddCar />} />
          <Route path="/ownercars" element={<Ownercars />} />
         
          <Route path="/acceptingrequest" element={<Acceptingrequest />} />
        </Route>
        <Route><Route path="/ownerdashboard" element={<Ownerdashboard />} /></Route>
      </Routes>

    </Router>
  );
}

export default App;