import React from "react";
import { NavLink } from "react-router-dom";

// Inline SVG Icons
const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AppointmentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
    <path d="M16 2V6M8 2V6M3 10H21" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const PeopleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AddIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const Sidebar = ({ isOpen, onClose }) => {
  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
      isActive
        ? "bg-blue-600 text-white shadow-md"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:shadow-none ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      aria-label="Admin sidebar navigation"
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-700">Admin Panel</h1>
        <button
          className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-100"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex flex-col gap-2 p-4 overflow-y-auto h-[calc(100vh-80px)] lg:h-auto">
        <NavLink to="/dashboard" className={linkClasses}>
          <HomeIcon />
          Dashboard
        </NavLink>

        <NavLink to="/all-appointments" className={linkClasses}>
          <AppointmentIcon />
          All Appointments
        </NavLink>

        <NavLink to="/doctor-list" className={linkClasses}>
          <PeopleIcon />
          Doctors List
        </NavLink>

        <NavLink to="/add-doctor" className={linkClasses}>
          <AddIcon />
          Add Doctor
        </NavLink>
      </nav>
    </aside>
  );
};

Sidebar.defaultProps = {
  isOpen: false,
  onClose: () => {},
};

export default Sidebar;
