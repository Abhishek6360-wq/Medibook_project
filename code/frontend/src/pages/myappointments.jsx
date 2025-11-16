import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/appcontext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import {useNavigate} from 'react-router-dom'
const Myappointments = () => {
  const { backendurl, token, getdoctorsdata } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate=useNavigate();

  // function to get user appointments
  const getuserappointments = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        backendurl + "/api/user/user-appointment-list",
        { headers: { usertoken: token } }
      );
      if (data.success) {
        setAppointments(data.appointments.reverse());
      } else {
        toast.error(data.message || "Failed to fetch appointments.");
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while fetching appointments."
      );
    } finally {
      setLoading(false);
    }
  };

  // function to cancel an appointment
  const cancelappointment = async (appointmentid) => {
    try {
      const { data } = await axios.post(
        backendurl + "/api/user/cancel-appointment",
        { appointmentid },
        { headers: { usertoken: token } }
      );

      if (data.success) {
        toast.success(data.message);
        setAppointments(prevAppointments => 
          prevAppointments.map(app => 
            app._id === appointmentid 
              ? { ...app, cancelled: true }
              : app
          )
        );
        getdoctorsdata();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // function to make payments
  const initpay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount, 
      currency: order.currency,
      name:"Appointment=payment",
      description: "Test Transaction",
      order_id:order.id,
      receipt:order.receipt,
      handler:async(response)=>{
        try{
          const {data}=await axios.post(backendurl+'/api/user/verify-payment',{response},{headers:{usertoken:token}});
          if(data.success){
            getuserappointments();
            navigate('/myappointments');
          }
        }catch(error){
          toast.error(error.message);
        }
      },
      theme: {
        color: "#3399cc",
      },
    }
    const rzp=new window.Razorpay(options)
    rzp.open();
  }


  const payment = async (appointmentid) => {
    try {
      const { data } = await axios.post(
        backendurl + "/api/user/payment",
        { appointmentid },
        { headers: { usertoken: token } }
      );
      if (data.success) {
        initpay(data.order);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      getuserappointments();
    }
  }, [token]);

  const formatAddress = (address) => {
    if (!address) return { line1: "N/A", line2: "" };
    const line1 = address.line1 || "";
    const line2 = address.line2 || "";
    return { line1, line2 };
  };

  if (!token) {
    return (
      <div className="p-8 text-center text-xl text-gray-600">
        Please log in to view your appointments.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-xl text-gray-600">
        Loading your appointments...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto min-h-screen font-sans">
      <ToastContainer position="top-center" autoClose={3000} />
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-4">
        My Appointments
      </h1>

      {appointments.length === 0 ? (
        <div className="text-center text-lg text-gray-600 p-10 bg-white shadow-md rounded-xl">
          You have no upcoming appointments.
        </div>
      ) : (
        <div className="space-y-6">
          {appointments.map((appointment, index) => {
            const doc = appointment.docData;
            const addressLines = doc
              ? formatAddress(doc.address)
              : { line1: "N/A", line2: "" };
            const isCancelled = appointment.cancelled;
            const isPaid = appointment.payment;
            const doctorImage = doc?.image || "https://via.placeholder.com/100";

            return (
              <div
                key={appointment._id || index}
                className={`flex flex-col md:flex-row bg-white rounded-xl shadow-lg border-l-4 overflow-hidden 
                  ${
                    isCancelled
                      ? "border-red-400 opacity-60"
                      : "border-blue-500"
                  }`}
              >
                {/* Doctor & Appointment Details Section */}
                <div className="flex flex-grow p-4 sm:p-6 gap-4 sm:gap-6 items-center">
                  <img
                    src={doctorImage}
                    alt={`Dr. ${doc?.name || "Doctor"}`}
                    className="flex-shrink-0 w-20 h-20 object-cover rounded-full border-2 border-gray-100"
                  />

                  <div className="flex-grow min-w-0">
                    <h2 className="text-xl font-bold text-gray-900 truncate">
                      Dr. {doc?.name || "Name Missing"}
                      {isCancelled && (
                        <span className="ml-3 text-sm font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                          Cancelled
                        </span>
                      )}
                    </h2>
                    <p className="text-gray-600 text-base">
                      {doc?.speciality || "Speciality Missing"}
                    </p>

                    <div className="mt-2 text-sm text-gray-700">
                      <p className="font-semibold">Address:</p>
                      <p className="text-gray-500">{addressLines.line1}</p>
                      <p className="text-gray-500">{addressLines.line2}</p>
                    </div>

                    <p className="mt-2 text-base font-semibold text-blue-600">
                      Date & Time:{" "}
                      <span className="text-gray-800 font-normal">
                        {appointment.slotDate} | {appointment.slotTime}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Buttons and Status Section */}
                <div className="w-full md:w-auto p-4 sm:p-6 md:border-l border-gray-100 flex flex-col justify-center items-end space-y-3">
                  {!isCancelled && (
                    <>
                      <p className="text-lg font-bold text-green-600">
                        Fee: ${appointment.amount}
                      </p>

                      <button
                        onClick={() => payment(appointment._id)}
                        className={`w-full md:w-40 py-2 rounded-lg text-sm font-semibold transition duration-200 
                          ${
                            isPaid
                              ? "bg-green-100 text-green-700 cursor-default"
                              : "bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105 shadow-md"
                          }`}
                        disabled={isPaid}
                      >
                        {isPaid ? "Payment Received" : "Pay Online"}
                      </button>

                      <button
                        onClick={() => cancelappointment(appointment._id)}
                        className="w-full md:w-40 py-2 rounded-lg text-sm font-semibold text-red-600 bg-white border border-red-300 transition duration-200 hover:bg-red-100 hover:text-red-700"
                        disabled={isCancelled}
                      >
                        Cancel Appointment
                      </button>
                    </>
                  )}

                  {isCancelled && (
                    <p className="text-lg font-semibold text-red-500 w-full md:w-40 text-center">
                      Appointment Cancelled
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Myappointments;
