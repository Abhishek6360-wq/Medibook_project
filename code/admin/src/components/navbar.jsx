import React, { useContext } from "react";
import { Admincontext } from "../context/admincontext";
import { Doctorcontext } from "../context/doctorcontext";
import { useNavigate } from "react-router-dom";

const Navbar = ({ onMenuClick = () => {} }) => {
  const { atoken, setAtoken } = useContext(Admincontext);
  const { dtoken, setDtoken } = useContext(Doctorcontext);
  const navigate = useNavigate();

  const handlelogout = () => {
    navigate("/login");
    if (atoken) {
      setAtoken("");
      localStorage.removeItem("atoken");
    } else if (dtoken) {
      setDtoken("");
      localStorage.removeItem("dtoken");
    }
  };

  const currentRole = atoken ? "Admin" : dtoken ? "Doctor" : "Guest";

  return (
    <nav className="w-full bg-white shadow-md py-3 px-4 sm:px-6 flex items-center justify-between gap-3 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden p-2 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={onMenuClick}
          aria-label="Open sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        <img
          src="https://flowbite.com/docs/images/logo.svg"
          alt="Medibook logo"
          className="h-9 w-auto object-contain"
        />
        <div>
          <p className="text-base sm:text-lg font-semibold text-gray-800 leading-tight">
            {currentRole} Dashboard
          </p>
          <p className="text-xs text-gray-500 hidden sm:block">Manage your workspace on the go</p>
        </div>
      </div>

      <button
        onClick={handlelogout}
        className="shrink-0 bg-red-500 text-white px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium hover:bg-red-600 transition-all duration-200 shadow-md"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
