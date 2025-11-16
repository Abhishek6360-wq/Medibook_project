import { useContext, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { Admincontext } from "./context/admincontext";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/navbar";
import AdminLogin from "./pages/login";
import RequireAdminAuth from "./components/requireAdminauth";
import RequireDoctorAuth from "./components/requiredocauth";
import DocDashboard from "./pages/doctorpages/docdashboard";
import AdminLayout from "./components/adminlayout";
import Dashboard from "./pages/adminpages/dashboard";
import Allapointments from "./pages/adminpages/Allapointments";
import Adddoctor from "./pages/adminpages/adddoctor";
import Doctorlist from "./pages/adminpages/doctorslist";
import PatientsList from "./pages/adminpages/patientslist";
import DoctorLayout from "./components/doclayout";
import Docappointments from "./pages/doctorpages/myappointments";
import DoctorProfile from "./pages/doctorpages/docprofile";

function App() {
  const router = createBrowserRouter([
    {
      path: "/login", // Shared Login page
      element: <AdminLogin />,
    },
    // ADMIN ROUTES (Protected by atoken)
    {
      element: <RequireAdminAuth />,
      children: [
        {
          element: <AdminLayout />,
          children: [
            { index: true, element: <Navigate to="/dashboard" replace /> },
            { path: "/dashboard", element: <Dashboard /> },
            { path: "/all-appointments", element: <Allapointments /> },
            { path: "/add-doctor", element: <Adddoctor /> },
            { path: "/doctor-list", element: <Doctorlist /> },
            { path: "/patients-list", element: <PatientsList /> },
          ],
        },
      ],
    },
    // DOCTOR ROUTES
    {
      element: <RequireDoctorAuth />,
      children: [
        {
          element: <DoctorLayout />,
          children: [
            { index: true, element: <Navigate to="/docdashboard" replace /> },
            { path: "/docdashboard", element: <DocDashboard /> },
            { path: "/docappointments", element: <Docappointments /> },
            { path: "/docprofile", element: <DoctorProfile /> },
          ],
        },
      ],
    },
  ]);
  return (
    <>
            <RouterProvider router={router} />
            <ToastContainer />   {" "}
    </>
  );
}
export default App;
