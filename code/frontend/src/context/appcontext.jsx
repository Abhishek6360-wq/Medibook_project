import { createContext, useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : false
  );
  const [userData, setUserData] = useState(
    localStorage.getItem("userData")
      ? JSON.parse(localStorage.getItem("userData"))
      : null
  );
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingUserData, setLoadingUserData] = useState(false);
  const backendurl = import.meta.env.VITE_BACKEND_URL;

  // ============= GET DOCTORS LIST =============
  const getdoctorsdata = useCallback(async () => {
    setLoadingDoctors(true);
    try {
      const { data } = await axios.get(backendurl + "/api/doctor/list");
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingDoctors(false);
    }
  }, [backendurl]);

  // ============= GET USER PROFILE DATA =============
  const getuserprofiledata = useCallback(async () => {
    if (!token) return;
    setLoadingUserData(true);
    try {
      const { data } = await axios.get(backendurl + "/api/user/user-data", {
        headers: { usertoken: token },
      });
      if (data.success) {
        setUserData(data.user);
        localStorage.setItem("userData", JSON.stringify(data.user));
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingUserData(false);
    }
  }, [token, backendurl]);

  // ============= SEND CONTACT FORM =============
  const sendContactMessage = useCallback(async (formData) => {
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
      toast.error("Something went wrong while sending message");
      return false;
    }
  }, [backendurl, token]);

  // ============= CONTEXT VALUE =============
  const value = useMemo(() => ({
    doctors,
    token,
    setToken,
    backendurl,
    userData,
    setUserData,
    getuserprofiledata,
    getdoctorsdata,
    sendContactMessage,
    loadingDoctors,
    loadingUserData,
  }), [doctors, token, backendurl, userData, getuserprofiledata, getdoctorsdata, sendContactMessage, loadingDoctors, loadingUserData]);

  // ============= EFFECTS =============
  useEffect(() => {
    getdoctorsdata();
  }, [getdoctorsdata]);

  useEffect(() => {
    if (token) {
      getuserprofiledata();
    } else {
      setUserData(null);
      localStorage.removeItem("userData");
    }
  }, [token, getuserprofiledata]);

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
