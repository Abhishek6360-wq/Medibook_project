import React from "react";
import Navbar from "../components/navbar"; // Use the universal Navbar
// 💡 Assuming you'll create a DoctorSidebar component
import DoctorSidebar from "./doctorsidebar"; 
import { Outlet } from "react-router-dom";

export default function DoctorLayout() {
  return (
    <div className="bg-[#F8F9FD] min-h-screen">
      <Navbar />                         {/* Universal Navbar */}
      <div className="flex items-start">
        <DoctorSidebar />                {/* Doctor-specific sidebar */}
        <div className="flex-1 p-4">
          <Outlet />                     {/* DocDashboard renders here */}
        </div>
      </div>
    </div>
  );
}
