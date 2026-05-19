import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Admincontext } from '../../context/admincontext';
import { ToastContainer } from 'react-toastify';

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className="text-gray-600 text-lg">Loading Dashboard Data...</p>
    </div>
  </div>
);

// Helper component for the Metric Cards
const DashboardCard = ({ title, count, icon, colorClass, onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white p-6 rounded-xl shadow-lg border border-gray-100 transition-transform duration-300 hover:scale-[1.02] ${onClick ? 'cursor-pointer' : ''}`}
  >
    <div className={`flex items-center justify-between p-4 rounded-xl ${colorClass}`}>
      <span className="text-3xl font-extrabold text-white">{icon}</span>
      <div className="text-right">
        <p className="text-sm font-semibold text-white uppercase tracking-wider">{title}</p>
        <p className="text-4xl font-black text-white">{count}</p>
      </div>
    </div>
  </div>
);

// Helper component for the Appointment List rows
const AppointmentRow = ({ appointment, index }) => {
  const patientName = appointment.userData?.name || 'N/A';
  const doctorName = appointment.docData?.name || 'N/A';
  const speciality = appointment.docData?.speciality || 'N/A';
  const status = appointment.cancelled ? 'Cancelled' : appointment.payment ? 'Confirmed (Paid)' : 'Pending Payment';
  
  // Determine status color
  let statusColor;
  if (appointment.cancelled) {
    statusColor = 'bg-red-500';
  } else if (appointment.payment) {
    statusColor = 'bg-green-500';
  } else {
    statusColor = 'bg-yellow-500';
  }

  return (
    <div className="grid grid-cols-6 gap-4 py-3 px-2 border-b border-gray-100 hover:bg-blue-50 transition-colors">
      <div className="text-sm font-medium text-gray-900 col-span-1">{index + 1}.</div>
      <div className="text-sm text-gray-700 col-span-1 truncate">{patientName}</div>
      <div className="text-sm text-blue-700 col-span-2">
        <span className="font-semibold">Dr. {doctorName}</span>
        <span className="text-xs text-gray-500 block">({speciality})</span>
      </div>
      <div className="text-sm text-gray-700 col-span-1">
        {appointment.slotDate} @ {appointment.slotTime}
      </div>
      <div className="text-sm col-span-1 flex justify-center">
        <span className={`text-xs font-semibold text-white px-3 py-1 rounded-full ${statusColor}`}>
          {status}
        </span>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { dashData, getdashboard, atoken, loadingDashboard } = useContext(Admincontext);
  const navigate = useNavigate();

  useEffect(() => {
    if (atoken) {
      getdashboard();
    }
  }, [atoken]);

  // Handle Loading State or Missing Data
  if (!atoken) {
    return (
      <div className="p-8 text-center text-xl text-red-600 bg-red-50 rounded-lg m-4">
        Access Denied. Please log in as an Admin.
      </div>
    );
  }

  if (loadingDashboard || !dashData) {
    return <LoadingSpinner />;
  }

  const { doctors, patients, appointments, latest_appointments } = dashData;

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto min-h-screen bg-gray-50 font-sans">
      <ToastContainer position="top-center" autoClose={3000} />

      <h1 className="text-3xl font-extrabold mb-8 border-b pb-4 text-black-800">
        🚀 Admin Dashboard Overview
      </h1>

      {/* --- 1. Metric Cards (KPIs) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        <DashboardCard 
          title="Total Doctors" 
          count={doctors} 
          icon="🧑‍⚕️"
          colorClass="bg-blue-400 shadow-blue-300/50"
          onClick={() => navigate('/doctor-list')}
        />
        
        <DashboardCard 
          title="Total Patients" 
          count={patients} 
          icon="👥" 
          colorClass="bg-green-400 shadow-green-300/50"
          onClick={() => navigate('/patients-list')}
        />

        <DashboardCard 
          title="Total Appointments" 
          count={appointments} 
          icon="📅" 
          colorClass="bg-[#EFA9AE] shadow-gray-400/50"
          onClick={() => navigate('/all-appointments')}
        />
      </div>

      {/* --- 2. Top 5 Appointments List --- */}
      <div className="bg-white p-6 rounded-xl shadow-2xl border border-blue-100">
        <h2 className="text-2xl font-bold text-black-300 mb-6 border-b pb-3 text-black-700">
          Recent Appointments (Top 5)
        </h2>

        {latest_appointments && latest_appointments.length > 0 ? (
          <>
            {/* List Header */}
            <div className="grid grid-cols-6 gap-4 px-2 py-3 font-bold text-xs uppercase tracking-wider text-white bg-blue-500 rounded-t-lg">
              <div className="col-span-1">S.No.</div>
              <div className="col-span-1">Patient</div>
              <div className="col-span-2">Doctor & Speciality</div>
              <div className="col-span-1">Date/Time</div>
              <div className="col-span-1 text-center">Status</div>
            </div>

            {/* List Rows */}
            <div className="divide-y divide-gray-100">
              {latest_appointments.map((appointment, index) => (
                <AppointmentRow key={appointment.id} appointment={appointment} index={index} />
              ))}
            </div>
          </>
        ) : (
          <p className="text-lg text-gray-500 p-4 text-center">
            No recent appointments to display.
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;