import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Doctorcontext } from "../context/doctorcontext"; 

export default function RequireDoctorAuth() {
  
    const { dtoken } = useContext(Doctorcontext); 
    const token = dtoken; 
    if (!token) return <Navigate to="/doctor-login" replace />; 
    return <Outlet />; 
}