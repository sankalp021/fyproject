import React from "react";
import Home from "../pages/Home";
import Services from "../pages/Services";
import Signup from "../pages/Signup";
import Symptomchk from "../pages/Symptomchk";
import Login from "../pages/Login";
import Contact from "../pages/Contact";
import Doctors from "../pages/Doctors/Doctors";
import DoctorDetails from "../pages/Doctors/DoctorDetails";
import { Routes, Route } from "react-router-dom";
import MyAccount from "../Dashboard/user-account/MyAccount";
import Dashboard from "../Dashboard/doctor-account/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import CheckoutSuccess from "../pages/CheckoutSuccess";
import { services } from "../assets/data/services.js";
import DiseasePage from "../components/Services/Disease/DiseasePage.jsx";
import ForgotPassword from "../pages/ForgotPassword.jsx";
import ResetPassword from "../pages/ResetPassword.jsx";

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/symptomchk" element={<Symptomchk />} />
      <Route path="/doctors" element={<Doctors />} />
      <Route path="/doctors/:id" element={<DoctorDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Signup />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:id/:token" element={<ResetPassword />} />


      <Route path="/services" element={<Services />} />
      <Route path="/checkout-success" element={<CheckoutSuccess />} />
      <Route path="/users/profile/me" element={<MyAccount />} />
      <Route path="/doctors/profile/me" element={<Dashboard />} />
      {/* Disease routes */}
      {/* Ensure this route comes after more specific routes */}
      <Route 
        path="/disease/:id" 
        element={
          <React.Suspense fallback={<div>Loading...</div>}>
            <DiseasePage />
          </React.Suspense>
        } 
      />
    </Routes>
  );
};

export default Routers;
