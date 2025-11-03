import React from 'react';
import { NavLink } from 'react-router-dom';

const DoctorSidebar = () => {
  // Array of links for easier management
  const doctorLinks = [
    { to: "/docdashboard", label: "Dashboard" },
    { to: "/docappointments", label: "Appointments" },
    { to: "/docprofile", label: "Profile" },
  ];

  return (
    <div className="w-56 h-screen bg-white shadow-xl p-4 flex flex-col justify-between sticky top-0 border-r border-gray-200">
      <div className="space-y-2 pt-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">
          Doctor Menu
        </h3>

        {doctorLinks.map((link) => (
          <NavLink 
            key={link.to}
            to={link.to} 
            className={({ isActive }) => 
              `flex items-center p-3 rounded-xl text-base transition-all duration-150 ${
                isActive 
                  ? 'bg-blue-100 text-blue-700 font-bold shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
              }`
            }
          >

            {link.label}
          </NavLink>
        ))}
      </div>
      

      <p className="text-xs text-gray-400 p-2 text-center">
        v1.0.0
      </p>
    </div>
  );
};

export default DoctorSidebar;
