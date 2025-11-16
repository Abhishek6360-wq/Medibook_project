import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/appcontext";
import { IoIosArrowDown } from "react-icons/io";

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const { token, setToken, userData } = useContext(AppContext);

  const logout = () => {
    setToken(false);
    localStorage.removeItem("token");
    setShowMenu(false);
  };

  return (
    <nav className="bg-white fixed w-full z-20 top-0 start-0 border-b border-gray-200">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* ================= LOGO / BRAND ================= */}
        <NavLink to="/" className="flex items-center space-x-3">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="Logo"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-gray-900">
            MediBook
          </span>
        </NavLink>

        {/* ================= RIGHT-SIDE BUTTON ================= */}
        <div className="flex md:order-2">
          {token ? (
            <div
              className="flex items-center gap-2 cursor-pointer relative"
              onClick={() => setShowMenu((prev) => !prev)}
            >
              {/* Profile Image */}
              {userData ? (
                <img
                  src={userData.image || "https://via.placeholder.com/32"}
                  className="w-8 h-8 rounded-full object-cover border border-gray-300"
                  alt="User"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
              )}

              <IoIosArrowDown className="text-gray-600 w-4 h-4" />

              {/* Dropdown Menu */}
              {showMenu && (
                <div
                  className="absolute right-0 top-10 w-44 bg-white shadow-md rounded-md 
                             text-base font-medium text-gray-600 z-20"
                >
                  <div className="bg-stone-100 rounded flex flex-col gap-4 p-4">
                    <p
                      onClick={() => {
                        navigate("/profile");
                        setShowMenu(false);
                      }}
                      className="hover:text-black cursor-pointer"
                    >
                      My Profile
                    </p>
                    <p
                      onClick={() => {
                        navigate("/myappointments");
                        setShowMenu(false);
                      }}
                      className="hover:text-black cursor-pointer"
                    >
                      My Appointments
                    </p>
                    <p
                      onClick={logout}
                      className="hover:text-black cursor-pointer"
                    >
                      Logout
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                navigate("/login");
              }}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 
                         focus:outline-none focus:ring-blue-300 font-medium rounded-lg 
                         text-sm px-4 py-2 text-center"
            >
              Create Account
            </button>
          )}
        </div>

        {/* ================= NAVIGATION LINKS ================= */}
        <div
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="navbar-sticky"
        >
          <ul
            className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 
                       rounded-lg bg-gray-50 md:space-x-8 md:flex-row md:mt-0 md:border-0 md:bg-white"
          >
            {/* --------- Home --------- */}
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `block py-2 px-3 ${
                    isActive
                      ? "text-black font-semibold underline"
                      : "text-gray-900 hover:text-blue-700"
                  }`
                }
              >
                Home
              </NavLink>
            </li>

            {/* --------- Doctors --------- */}
            <li>
              <NavLink
                to="/doctors/All"
                className={({ isActive }) =>
                  `block py-2 px-3 ${
                    isActive
                      ? "text-black font-semibold underline"
                      : "text-gray-900 hover:text-blue-700"
                  }`
                }
              >
                Doctors
              </NavLink>
            </li>

            {/* --------- About Us --------- */}
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `block py-2 px-3 ${
                    isActive
                      ? "text-black font-semibold underline"
                      : "text-gray-900 hover:text-blue-700"
                  }`
                }
              >
                About Us
              </NavLink>
            </li>

            {/* --------- Contact --------- */}
            <li>
              <NavLink
                to="/contacts"
                className={({ isActive }) =>
                  `block py-2 px-3 ${
                    isActive
                      ? "text-black font-semibold underline"
                      : "text-gray-900 hover:text-blue-700"
                  }`
                }
              >
                Contact
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
