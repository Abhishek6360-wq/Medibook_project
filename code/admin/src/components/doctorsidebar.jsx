import React from "react";
import { NavLink } from "react-router-dom";

const DoctorSidebar = ({ isOpen, onClose }) => {
  const doctorLinks = [
    { to: "/docdashboard", label: "Dashboard" },
    { to: "/docappointments", label: "Appointments" },
    { to: "/docprofile", label: "Profile" },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 w-60 bg-white border-r border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      aria-label="Doctor sidebar navigation"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-blue-600">Doctor Menu</h3>
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

      <div className="flex flex-col justify-between h-[calc(100vh-80px)] p-4">
        <div className="space-y-2">
          {doctorLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `block rounded-xl px-4 py-3 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-blue-100 text-blue-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <p className="text-xs text-gray-400 text-center">v1.0.0</p>
      </div>
    </aside>
  );
};

DoctorSidebar.defaultProps = {
  isOpen: false,
  onClose: () => {},
};

export default DoctorSidebar;
