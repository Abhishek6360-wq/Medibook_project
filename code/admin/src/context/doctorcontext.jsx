import { createContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useState } from "react";
import { useCallback } from "react";

export const Doctorcontext=createContext();

const Doctorcontextprovider=(props)=>{
    const backendurl = import.meta.env.VITE_BACKEND_URL;
    const[dtoken,setDtoken]=useState(localStorage.getItem("dtoken") ? localStorage.getItem("dtoken") : "");
    const[Appointments,setAppointments]=useState([]);
    const[Profiledata,setProfileData]=useState(null);

    // function to get all appointments
    const getappointments=useCallback(async()=>{
        try{
            const {data}=await axios.get(backendurl+'/api/doctor/doc-appointments',{headers:{doctoken:dtoken}});
            if(data.success){
                setAppointments(data.appointments);
            }else{
                toast.error(data.message);
            }
        }catch(error){
            console.log(error);
            toast.error(error.message);
        }
    },[dtoken,setAppointments])

    // function to mark an appointment as completed
    const markcomplete=async(appointmentid)=>{
        try{
            const {data}=await axios.post(backendurl+'/api/doctor/complete-appointment',{appointmentid},{headers:{doctoken:dtoken}});
            if(data.success){
                toast.success(data.message);
                getappointments();
            }else{
                toast.error(data.message);
            }
        }catch(error){
            console.log(error);
            toast.error(error.message); 
        }
    }

    // function to cancel an appointment as completed
    const markcancel=async(appointmentid)=>{
        try{
            const {data}=await axios.post(backendurl+'/api/doctor/cancel-appointment',{appointmentid},{headers:{doctoken:dtoken}});
            if(data.success){
                toast.success(data.message);
                getappointments();
            }else{
                toast.error(data.message);
            }
        }catch(error){
            console.log(error);
            toast.error(error.message); 
        }
    }

    // function to get doc profile
    const getdocprofile=async()=>{
        try{
            const {data}=await axios.get(backendurl+'/api/doctor/profile',{headers:{doctoken:dtoken}});
            if(data.success){
                setProfileData(data.profiledata);
            }
            else{
                toast.error(data.message);
            }
        }catch(error){
            console.log(error);
            toast.error(error.message); 
        }
    }

    // function to update doc profile 
const updatedocprofile = async (formData) => {
  try {
    const { data } = await axios.post(
      `${backendurl}/api/doctor/update-profile`,
      formData,
      {
        headers: {
          doctoken: dtoken,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (data.success) {
      toast.success(data.message);
      getdocprofile();
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
}

    const value={
        dtoken,
        setDtoken,
        backendurl,
        getappointments,
        Appointments,
        setAppointments,
        markcomplete,
        markcancel,
        getdocprofile,
        Profiledata,
        updatedocprofile
    }

    return(
        <Doctorcontext.Provider value={value}>
            {props.children}
        </Doctorcontext.Provider>
    )
}

export default Doctorcontextprovider