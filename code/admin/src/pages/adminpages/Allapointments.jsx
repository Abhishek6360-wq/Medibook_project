import React, { useContext, useEffect } from 'react';
import { Admincontext } from '../../context/admincontext';
import { toast, ToastContainer } from 'react-toastify';

// function to calculate age using DOB
const calculateAge = (dobString) => {
  if (!dobString || dobString.toLowerCase() === 'not selected') return 'N/A';
  
  try {
    const dob = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDifference = today.getMonth() - dob.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  } catch (e) {
    return 'N/A'; // Handle invalid date strings gracefully
  }
};

const Allappointments = () => {
  const { atoken, Allappointments, getallapointments,cancelanyappointment } = useContext(Admincontext);

  useEffect(() => {
    if (atoken) {
      getallapointments();
    }
    // Dependency array includes atoken, so it runs when the admin logs in
  }, [atoken]);

  const handleCancelClick = (id) => {
    // Placeholder for future cancel functionality
    toast.info(`Preparing to cancel appointment ID: ${id}`);
    // Future: Call a new Admincontext function like cancelAppointment(id);
  };

  // Fallback UI for loading and security
  if (!atoken) {
    return (
      <div className="p-8 text-center text-xl text-red-600 bg-red-50 rounded-lg m-4">
        Access Denied. Please log in as an Admin.
      </div>
    );
  }

  if (Allappointments.length === 0) {
    return (
      <div className="p-8 text-center text-xl text-blue-600 bg-blue-50 rounded-lg m-4">
        Loading appointments or no appointments found...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto min-h-screen bg-gray-50 font-sans">
      <ToastContainer position="top-center" autoClose={3000} />

<h1 className="text-3xl font-extrabold mb-8 border-b pb-4 text-black-800">
  🗓️ All Scheduled Appointments
</h1>

      {/* Appointment Table (List) */}
      <div className="bg-white shadow-2xl rounded-xl overflow-hidden border border-blue-100">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-8 gap-4 px-6 py-3 font-bold text-sm uppercase tracking-wider text-white bg-blue-600">
          <div className="col-span-1">S.No.</div>
          <div className="col-span-1">Patient</div>
          <div className="col-span-1">Age</div>
          <div className="col-span-2">Doctor | Speciality</div>
          <div className="col-span-1">Date</div>
          <div className="col-span-1">Time</div>
          <div className="col-span-1">Action</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-blue-50">
          {Allappointments.map((appointment, index) => {
            const patientName = appointment.userData?.name || 'Unknown Patient';
            const doctorName = appointment.docData?.name || 'Unknown Doctor';
            const doctorSpeciality = appointment.docData?.speciality || 'N/A';
            const patientAge = calculateAge(appointment.userData?.dob);
            const isCancelled = appointment.cancelled;
            
            return (
              // Responsive grid/list item
              <div 
                key={appointment._id} 
                className={`grid grid-cols-2 md:grid-cols-8 gap-4 p-4 md:px-6 md:py-4 items-center transition-colors 
                  ${isCancelled ? 'bg-red-50 hover:bg-red-100 opacity-75' : 'hover:bg-blue-50'}`}
              >
                
                {/* S.No. & Patient (Mobile Top Row) */}
                <div className="col-span-1 text-sm font-medium text-gray-900 md:col-span-1">
                  <span className="md:hidden font-bold text-blue-500 mr-2">#</span>{index + 1}
                </div>
                <div className="col-span-1 text-sm text-gray-700 font-semibold md:col-span-1 truncate">
                  <span className="md:hidden font-bold text-gray-500 mr-2">Patient:</span>{patientName}
                </div>
                
                {/* Age & Doctor */}
                <div className="col-span-1 text-sm text-gray-500 md:col-span-1">
                  <span className="md:hidden font-bold text-gray-500 mr-2">Age:</span>{patientAge}
                </div>
                <div className="col-span-2 text-sm text-blue-700 md:col-span-2 font-medium">
                  <span className="md:hidden font-bold text-gray-500 mr-2">Doctor:</span>
                  Dr. {doctorName} <br className='md:hidden'/>
                  <span className='text-gray-500 text-xs md:text-sm'>({doctorSpeciality})</span>
                </div>

                {/* Date & Time */}
                <div className="col-span-1 text-sm text-gray-700 md:col-span-1">
                  <span className="md:hidden font-bold text-gray-500 mr-2">Date:</span>{appointment.slotDate}
                </div>
                <div className="col-span-1 text-sm font-semibold text-gray-900 md:col-span-1">
                  <span className="md:hidden font-bold text-gray-500 mr-2">Time:</span>{appointment.slotTime}
                </div>

                {/* Action Button */}
                <div className="col-span-2 md:col-span-1 flex justify-center md:justify-start">
                  {isCancelled ? (
                    <span className="text-xs font-bold text-red-700 bg-red-200 px-3 py-1 rounded-full">CANCELLED</span>
                  ) : (
                    <button
                      onClick={() => cancelanyappointment(appointment._id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-3 rounded-lg text-sm transition-colors shadow-sm"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Allappointments;