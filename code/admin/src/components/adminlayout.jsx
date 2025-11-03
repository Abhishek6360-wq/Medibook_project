import React from "react";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="bg-[#F8F9FD] min-h-screen">
      <Navbar />                         {/* always visible when logged in */}
      <div className="flex items-start">
        <Sidebar />                      {/* always visible when logged in */}
        <div className="flex-1 p-4">
          <Outlet />                     {/* CURRENT PAGE renders here */}
        </div>
      </div>
    </div>
  );
}
