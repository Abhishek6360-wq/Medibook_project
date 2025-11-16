import React, { useContext } from "react";
import { Admincontext } from "../context/admincontext";
import { Doctorcontext } from "../context/doctorcontext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { atoken, setAtoken } = useContext(Admincontext);
  const { dtoken, setDtoken } = useContext(Doctorcontext);
  const navigate = useNavigate();

  const handlelogout = () => {
    navigate("/login");
    // Check if the user is an Admin
    if (atoken) {
      setAtoken("");
      localStorage.removeItem("atoken");
      console.log("Admin logged out.");
    } 
    // Check if the user is a Doctor
    else if (dtoken) { 
        setDtoken("");
        localStorage.removeItem("dtoken");
        console.log("Doctor logged out.");
    }
  };
  
  // Determine the current role based on which token is present
  const currentRole = atoken ? "Admin" : (dtoken ? "Doctor" : "Guest");

  return (
    <nav className="w-full bg-white shadow-md py-3 px-6 flex items-center justify-between">
      {/* Left side - logo and title */}
      <div className="flex items-center gap-3">
        <img
          src="https://flowbite.com/docs/images/logo.svg"
          alt={`${currentRole} Logo`}
          className="h-10 w-auto object-contain"
        />
        <p className="text-lg font-semibold text-gray-800">
          {currentRole} Dashboard
        </p>
      </div>

      {/* Right side - logout button */}
      <button
        onClick={handlelogout}
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-200 shadow-md"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
