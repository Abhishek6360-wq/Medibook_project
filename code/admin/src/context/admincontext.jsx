import { createContext, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const Admincontext = createContext();

const Admincontextprovider = (props) => {
  const [atoken, setAtoken] = useState(
    localStorage.getItem("atoken") ? localStorage.getItem("atoken") : ""
  );
  const [doctors, setDoctors] = useState([]);
  const [Allappointments, setAllAppointments] = useState([]);
  const [dashData, setDashData] = useState(null);
  
  // Loading states
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingToggle, setLoadingToggle] = useState(false);
  
  const backendurl = import.meta.env.VITE_BACKEND_URL;

  // function to get list of all doctors  
  const alldoctors = async () => {
    setLoadingDoctors(true);
    try {
      const { data } = await axios.post(
        backendurl + "/api/admin/all-doctors",
        {},
        { headers: { admintoken: atoken } }
      );

      if (data.success) {
        setDoctors(data.doctor); 
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingDoctors(false);
    }
  };

  // function to change availlabillity of a doctor 
  const changeavailabillity = async (docId) => {
    setLoadingToggle(true);
    try {
      const { data } = await axios.post(
        backendurl + "/api/admin/change-availabillity",
        { docId },
        { headers: { admintoken: atoken } }
      );

      if (data.success) {
        toast.success(data.message);
        alldoctors(); // refresh list after toggle
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoadingToggle(false);
    }
  };

  // function to get all appointments;
  const getallapointments = async () => {
    setLoadingAppointments(true);
    try {
      const { data } = await axios.get(
        backendurl + '/api/admin/allapointments',
        { headers: { admintoken: atoken } }
      );
      if (data.success) {
        setAllAppointments(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoadingAppointments(false);
    }
  }

  // function to cancel an appointment directly by admin
  const cancelanyappointment = async (appointmentid) => {
    try {
      const { data } = await axios.post(
        backendurl + '/api/admin/cancelanyappointment',
        { appointmentid },
        { headers: { admintoken: atoken } }
      );
      if (data.success) {
        toast.success(data.message);
        getallapointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  // function to get dashboard data
  const getdashboard = async () => {
    setLoadingDashboard(true);
    try {
      const { data } = await axios.get(
        backendurl + '/api/admin/dashboard-data',
        { headers: { admintoken: atoken } }
      );
      if (data.success) {
        setDashData(data.dashdata);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoadingDashboard(false);
    }
  }

  // function to delete a doctor
  const deleteDoctor = async (docId) => {
    if (!window.confirm("Are you sure you want to delete this doctor? All related appointments will be cancelled.")) {
      return;
    }
    
    setLoadingDelete(true);
    try {
      const { data } = await axios.delete(
        backendurl + '/api/admin/delete-doctor',
        {
          data: { docId },
          headers: { admintoken: atoken }
        }
      );
      if (data.success) {
        toast.success(data.message);
        alldoctors(); // refresh doctors list
        getdashboard(); // refresh dashboard
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoadingDelete(false);
    }
  }

  const value = {
    atoken,
    setAtoken,
    backendurl,
    alldoctors,
    doctors,
    changeavailabillity,
    Allappointments,
    setAllAppointments,
    getallapointments,
    cancelanyappointment,
    dashData,
    setDashData,
    getdashboard,
    deleteDoctor,
    // Loading states
    loadingDoctors,
    loadingAppointments,
    loadingDashboard,
    loadingDelete,
    loadingToggle
  };

  return (
    <Admincontext.Provider value={value}>
      {props.children}
    </Admincontext.Provider>
  );
};

export default Admincontextprovider;
