import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from '../assets/assets.js'

const Sidebar = () => {
  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
      isActive
        ? "bg-blue-600 text-white shadow-md"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 shadow-sm">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-700">Admin Panel</h1>
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex flex-col gap-2 p-4">
        <NavLink to="/dashboard" className={linkClasses}>
          <img src={assets.home_icon} alt="dashboard" className="w-5 h-5" />
          Dashboard
        </NavLink>

        <NavLink to="/all-appointments" className={linkClasses}>
          <img src={assets.appointment_icon} alt="appointments" className="w-5 h-5" />
          All Appointments
        </NavLink>

        <NavLink to="/doctor-list" className={linkClasses}>
          <img src={assets.people_icon} alt="doctors list" className="w-5 h-5" />
          Doctors List
        </NavLink>

        <NavLink to="/add-doctor" className={linkClasses}>
          <img src={assets.add_icon} alt="add doctor" className="w-5 h-5" />
          Add Doctor
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
