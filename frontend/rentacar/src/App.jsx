import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/register";
import AdminDashboard from "./components/Admindashboard";
import Cars from "./components/Cars";
import Bookings from "./components/Bookings";
import Reports from "./components/Reports";
import Users from "./components/users";
import Home from "./components/Home";
import Layout from "./components/Layout";
import Userdashboard from "./components/Userdashboard";
import Userlayout from "./components/Userlayout";
import BookingPage from "./components/Bookingpage";
import MyBookings from "./components/MyBookings";
import Myprofile from "./components/Myprofile"; 
function App() {
  return (
    <Router>
   
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/mybookings" element={<MyBookings />} />
        <Route path="/myprofile" element={<MyProfile />} />
        <Route element={<Userlayout/>}>
        <Route path="/Userdashboard" element={<Userdashboard />} />
        
        </Route>
        
        <Route element={<Layout/>}>
         <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/cars" element={<Cars/>} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/users" element={<Users />} />
        <Route path="/bookings" element={<Bookings />} />
        </Route>
         

        
      </Routes>
    </Router>
  );
}

export default App;
