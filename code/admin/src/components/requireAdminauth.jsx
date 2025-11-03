import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Admincontext } from "../context/admincontext";

export default function RequireAdminAuth() {
  const { atoken } = useContext(Admincontext);     // read your token from context
  const token = atoken || localStorage.getItem("atoken"); // fallback to localStorage if needed

  if (!token) return <Navigate to="/login" replace />;    // no token → go to login
  return <Outlet />;                                       // token ok → render child routes
}
