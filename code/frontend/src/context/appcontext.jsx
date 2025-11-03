import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [doctors, setDoctors] = useState(
    localStorage.getItem("doctors")
      ? JSON.parse(localStorage.getItem("doctors"))
      : []
  );
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : false
  );
  const [userData, setUserData] = useState(
    localStorage.getItem("userData")
      ? JSON.parse(localStorage.getItem("userData"))
      : null
  );
  const backendurl = import.meta.env.VITE_BACKEND_URL;

  // ============= GET DOCTORS LIST =============
  const getdoctorsdata = async () => {
    try {
      const { data } = await axios.get(backendurl + "/api/doctor/list");
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  // ============= GET USER PROFILE DATA =============
  const getuserprofiledata = async () => {
    try {
      const { data } = await axios.get(backendurl + "/api/user/user-data", {
        headers: { usertoken: token },
      });
      if (data.success) {
        setUserData(data.user);
        localStorage.setItem("userData", JSON.stringify(data.user)); // <-- cache it
      } else {
        console.log("api call failed");
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  // ============= SEND CONTACT FORM =============
  const sendContactMessage = async (formData) => {
    try {
      const { data } = await axios.post(
        backendurl + "/api/admin/contact",
        formData,
        { headers: { usertoken: token } }
      );

      if (data.success) {
        toast.success("Message sent successfully!");
        return true;
      } else {
        toast.error(data.message || "Failed to send message");
        return false;
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while sending message");
      return false;
    }
  };

  // ============= CONTEXT VALUE =============
  const value = {
    doctors,
    token,
    setToken,
    backendurl,
    userData,
    setUserData,
    getuserprofiledata,
    getdoctorsdata,
    sendContactMessage,
  };

  // ============= EFFECTS =============
  useEffect(() => {
    getdoctorsdata();
  }, []);

  useEffect(() => {
    if (token) {
      getuserprofiledata();
    } else {
      setUserData(null);
      localStorage.removeItem("userData"); // clear on logout
    }
  }, [token]);

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
