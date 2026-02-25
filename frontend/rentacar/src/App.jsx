import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/login";
import Register from "./components/register";
import AdminDashboard from "./components/Admindashboard";
import Cars from "./components/cars";
import Bookings from "./components/Bookings";
import Reports from "./components/Reports";
import Users from "./components/users";
import Home from "./components/Home";
import Layout from "./components/Layout";


function App() {
  return (
    <Router>
   
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
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
