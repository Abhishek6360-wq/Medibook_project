import React, { useEffect, useState, useMemo, useContext, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/appcontext';
import { toast } from 'react-toastify';
import { bookAppointmentApi } from '../api/api';
import { calculateAvailableSlots } from '../utils/dateHelper';

// Verified Tick SVG Component
const VerifiedIcon = () => (
  <svg className="w-5 h-5 text-blue-500 fill-current" viewBox="0 0 20 20">
    <path d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm4.596 6.55L9.5 11.65l-3.096-3.096a1 1 0 00-1.414 1.414l3.5 3.5a1 1 0 001.414 0l5.5-5.5a1 1 0 00-1.414-1.414z" />
  </svg>
);

const Appointments = () => {
  const navigate = useNavigate();
  const { doctors, getdoctorsdata, token, loadingDoctors } = useContext(AppContext);
  const { docid } = useParams();
  const [doctor, setDocinfo] = useState(null);
  const [docslots, setDocslots] = useState([]);
  const [slotidx, setSlotidx] = useState(0);
  const [selectedTime, setSelectedTime] = useState(null);
  const [loadingBooking, setLoadingBooking] = useState(false); 

  const daysofweek = useMemo(() => ['Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat'], []);

  const BookAppointment = useCallback(async () => {
    if (!token) {
      toast.warn("Login to book appointment");
      return navigate('/login');
    }
    if (!selectedTime || !docslots[slotidx]?.[0]) {
      toast.error("Please select a time slot");
      return;
    }
    setLoadingBooking(true);
    try {
      const date = docslots[slotidx][0].datetime;
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      let slotdate = day + "/" + month + "/" + year;

      const data = await bookAppointmentApi(
        { docId: Number(docid), slotDate: slotdate, slotTime: selectedTime.time },
        token
      );

      if (data.success) {
        toast.success(data.message);
        navigate(`/myappointments`);
        getdoctorsdata();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoadingBooking(false);
    }
  }, [token, docslots, slotidx, selectedTime, docid, navigate, getdoctorsdata]);

  // Memoize doctor lookup
  const currentDoctor = useMemo(() => {
    return doctors.find(doc => doc.id.toString() === docid.toString());
  }, [doctors, docid]);

  // Centralized Slot Calculation Logic (Centralized for interview preparation & unit testing)
  const calculatedSlots = useMemo(() => {
    return calculateAvailableSlots(currentDoctor);
  }, [currentDoctor]);

  useEffect(() => {
    if (currentDoctor) {
      setDocinfo(currentDoctor);
      setDocslots(calculatedSlots);
    }
  }, [currentDoctor, calculatedSlots]); 

  const selectedDateFormatted = useMemo(() => {
    if (docslots.length > 0) {
      const date = docslots[slotidx]?.[0]?.datetime;
      if (date) {
        const dayIndex = date.getDay(); 
        const dayName = daysofweek[dayIndex];
        const dateString = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        return `${dayName}, ${dateString}`;
      }
    }
    return 'Select a Day';
  }, [docslots, slotidx, daysofweek]);

  if (loadingDoctors || !doctor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600 text-lg">Loading Doctor Information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen font-sans">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-10 border-b pb-4 border-gray-200">Book Appointment</h1>

      <div className="flex flex-col md:flex-row bg-white shadow-xl rounded-2xl overflow-hidden p-6 mb-10 items-center md:items-start gap-6 border border-gray-200">
        <div className="relative w-48 h-48 md:w-56 md:h-56 flex-shrink-0 bg-blue-100 rounded-2xl flex justify-center items-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-blue-700 rounded-2xl"></div>
          <img
            src={doctor.image}
            alt={doctor.name}
            className="relative w-40 h-40 md:w-48 md:h-48 object-cover rounded-full border-4 border-white shadow-lg z-10"
            loading="lazy"
            width="192"
            height="192"
          />
        </div>

        <div className="flex flex-col md:pl-4 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{doctor.name}</h2>
            <VerifiedIcon />
          </div>

          <p className="text-gray-600 mt-1 text-lg font-medium">
            {doctor.degree} — {doctor.speciality}
          </p>
          <p className="text-gray-500 text-sm">{doctor.experience}</p>

          <p className="mt-4 text-gray-700 leading-relaxed max-w-xl">
            {doctor.about}
          </p>

          <p className="mt-5 font-semibold text-gray-900">
            Appointment fee: <span className="text-blue-600">₹{doctor.fees}</span>
          </p>
        </div>
      </div>

      <div className='bg-white p-6 rounded-2xl shadow-2xl border border-gray-200'>
        <p className='text-2xl font-bold text-gray-800 mb-6 border-b pb-3'>Select Appointment Date & Time</p>

        <div className='flex gap-4 items-center w-full overflow-x-scroll pb-6 scrollbar-hide'>
          {docslots.length > 0 && docslots.map((item, idx) => {
            const dateObj = item[0]?.datetime;
            if (!dateObj) return null;
            const dayOfWeek = daysofweek[dateObj.getDay()]; 
            const dayOfMonth = dateObj.getDate();
            const dateKey = `${dateObj.getFullYear()}-${dateObj.getMonth()}-${dateObj.getDate()}-${idx}`;
            return (
              <div 
                onClick={() => {
                  setSlotidx(idx);
                  setSelectedTime(null);
                }} 
                className={`text-center py-4 px-7 min-w-[90px] rounded-xl transition-all duration-300 ease-in-out border-2 cursor-pointer 
                  ${slotidx === idx 
                    ? 'bg-blue-600 text-white border-blue-700 shadow-lg shadow-blue-200/50 transform scale-[1.03]' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300'
                  }`} 
                key={dateKey}
              >
                <p className='font-semibold text-base'>{dayOfWeek}</p>
                <p className='font-extrabold text-2xl'>{dayOfMonth}</p>
              </div>
            );
          })}
        </div>

        <div className='mt-8 pt-4 border-t border-gray-100'>
          <h3 className='text-xl font-semibold mb-6 text-gray-700'>
            Available Slots for <span className='text-blue-600'>{selectedDateFormatted}</span>
          </h3>
          
          {docslots[slotidx] && docslots[slotidx].length > 0 ? (
            <>
              <div className='grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4'>
                {docslots[slotidx].map((slot) => (
                  <button
                    key={`${slot.datetime.getTime()}-${slot.time}`}
                    onClick={() => setSelectedTime(slot)}
                    className={`py-3 px-2 rounded-xl text-base font-medium transition duration-200 border-2 cursor-pointer
                      ${selectedTime?.time === slot.time
                        ? 'bg-green-600 text-white border-green-700 shadow-md shadow-green-200/50'
                        : 'bg-gray-50 text-gray-800 hover:bg-blue-50 border-gray-300'
                      }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>

              <div className='mt-10'>
                <button
                  onClick={BookAppointment}
                  disabled={!selectedTime || loadingBooking}
                  className={`w-full py-4 rounded-xl text-xl font-extrabold tracking-wider transition-all duration-300 flex items-center justify-center cursor-pointer
                    ${selectedTime && !loadingBooking
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-2xl shadow-blue-300/50 transform hover:scale-[1.005]'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-inner'
                    }`}
                >
                  {loadingBooking ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Booking Appointment...
                    </>
                  ) : selectedTime ? (
                    `Confirm Booking for ${selectedTime.time}`
                  ) : (
                    'Select a Time to Book'
                  )}
                </button>
              </div>
            </>
          ) : (
            <p className="text-red-500 text-lg p-4 bg-red-50 rounded-lg border border-red-200">
              No available slots for this day. Please select another day.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Appointments;
