import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/appcontext";
import { IoIosArrowDown } from "react-icons/io";

const navLinks = [
  { label: "Home", to: "/", exact: true },
  { label: "Doctors", to: "/doctors/All" },
  { label: "About Us", to: "/about" },
  { label: "Contact", to: "/contacts" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { token, setToken, userData } = useContext(AppContext);

  const logout = () => {
    setToken(false);
    localStorage.removeItem("token");
    setProfileMenuOpen(false);
    setMobileNavOpen(false);
  };

  useEffect(() => {
    if (mobileNavOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [mobileNavOpen]);

  const renderNavLinks = (onClick = () => {}) => (
    <ul className="flex flex-col gap-2 md:flex-row md:items-center md:gap-6 text-base font-medium">
      {navLinks.map((link) => (
        <li key={link.to}>
          <NavLink
            to={link.to}
            end={link.exact}
            onClick={onClick}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md transition-colors ${
                isActive
                  ? "text-blue-700 font-semibold"
                  : "text-gray-900 hover:text-blue-600"
              }`
            }
          >
            {link.label}
          </NavLink>
        </li>
      ))}
    </ul>
  );

  return (
    <nav className="bg-white fixed w-full z-30 top-0 border-b border-gray-200 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden p-2 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open navigation menu"
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

          <NavLink to="/" className="flex items-center gap-2">
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="h-8 w-8"
              alt="Logo"
              loading="lazy"
              width="32"
              height="32"
            />
            <span className="text-xl font-semibold text-gray-900">MediBook</span>
          </NavLink>
        </div>

        <div className="hidden md:flex flex-1 justify-center">{renderNavLinks()}</div>

        <div className="flex items-center gap-3">
          {token ? (
            <div className="relative">
              <button
                className="flex items-center gap-2 rounded-full border border-gray-200 px-2 py-1"
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                aria-label="Open profile menu"
              >
                {userData ? (
                  <img
                    src={userData.image || "https://via.placeholder.com/32"}
                    alt="User avatar"
                    className="w-8 h-8 rounded-full object-cover"
                    loading="lazy"
                    width="32"
                    height="32"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                )}
                <IoIosArrowDown className="text-gray-600 w-4 h-4" />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-lg z-40">
                  <div className="flex flex-col gap-2 p-4 text-sm text-gray-600">
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setProfileMenuOpen(false);
                      }}
                      className="text-left hover:text-blue-700"
                    >
                      My Profile
                    </button>
                    <button
                      onClick={() => {
                        navigate("/myappointments");
                        setProfileMenuOpen(false);
                      }}
                      className="text-left hover:text-blue-700"
                    >
                      My Appointments
                    </button>
                    <button onClick={logout} className="text-left hover:text-blue-700">
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Create Account
            </button>
          )}
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setMobileNavOpen(false)}
          aria-label="Close navigation menu"
        />
      )}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-30 transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <span className="text-lg font-semibold text-gray-900">Menu</span>
          <button
            className="p-2 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            onClick={() => setMobileNavOpen(false)}
            aria-label="Close navigation"
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
        <div className="p-4 overflow-y-auto">
          {renderNavLinks(() => setMobileNavOpen(false))}
          <div className="mt-6 border-t border-gray-100 pt-4">
            {token ? (
              <button
                onClick={logout}
                className="w-full bg-red-100 text-red-600 py-2 rounded-lg font-medium"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  navigate("/login");
                  setMobileNavOpen(false);
                }}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium"
              >
                Create Account
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
