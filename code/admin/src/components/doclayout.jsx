import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/navbar";
import DoctorSidebar from "./doctorsidebar";

const DoctorLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => document.body.classList.remove("overflow-hidden");
  }, [isSidebarOpen]);

  return (
    <div className="bg-[#F8F9FD] min-h-screen flex flex-col">
      <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
      <div className="flex flex-1">
        <DoctorSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/50 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DoctorLayout;
