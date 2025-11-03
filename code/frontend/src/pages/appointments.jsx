import React, { useEffect, useState, useMemo, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/appcontext';
import axios from 'axios';
import { toast } from 'react-toastify';

// Verified Tick SVG Component
const VerifiedIcon = () => (
  <svg className="w-5 h-5 text-blue-500 fill-current" viewBox="0 0 20 20">
    <path d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm4.596 6.55L9.5 11.65l-3.096-3.096a1 1 0 00-1.414 1.414l3.5 3.5a1 1 0 001.414 0l5.5-5.5a1 1 0 00-1.414-1.414z" />
  </svg>
);

const Appointments = () => {
  const navigate = useNavigate();
  const { doctors, getdoctorsdata, backendurl, token } = useContext(AppContext);
  const { docid } = useParams();
  const [doctor, setDocinfo] = useState(null);
  const [docslots, setDocslots] = useState([]);
  const [slotidx, setSlotidx] = useState(0);
  const [selectedTime, setSelectedTime] = useState(null); 

  const daysofweek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat']; 

  const getavailableslot = async (docdata) => {
    const allSlots = []; 
    let today = new Date();

    const DAILY_END_HOUR = 21; // 9:00 PM
    const FUTURE_DAY_START_HOUR = 10; // 10:00 AM

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i); 

      let endTime = new Date(currentDate);
      endTime.setHours(DAILY_END_HOUR, 0, 0, 0);

      if (i === 0) {
        let now = new Date();
        if (now.getHours() < FUTURE_DAY_START_HOUR) {
          currentDate.setHours(FUTURE_DAY_START_HOUR, 0, 0, 0);
        } else {
          let minutes = now.getMinutes();
          let newMinutes = minutes < 30 ? 30 : 60; 
          currentDate = new Date(now); 
          if (newMinutes === 60) {
            currentDate.setHours(currentDate.getHours() + 1, 0, 0, 0); 
          } else {
            currentDate.setMinutes(newMinutes, 0, 0); 
          }
        }
      } else {
        currentDate.setHours(FUTURE_DAY_START_HOUR, 0, 0, 0);
      }

      let timeslots = [];
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: true 
        });

        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();

        const slot_date = day + "/" + month + "/" + year;
        const slot_time = formattedTime;

        const isslotavailable = docdata.slots_booked[slot_date] && docdata.slots_booked[slot_date].includes(slot_time)
          ? false : true;

        if (isslotavailable) {
          timeslots.push({
            datetime: new Date(currentDate),
            time: formattedTime 
          });
        }
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      if (timeslots.length > 0) {
        allSlots.push(timeslots);
      }
    }
    setDocslots(allSlots);
  };

  const BookAppointment = async () => {
    if (!token) {
      toast.warn("Login to book appointment");
      return navigate('/login');
    }
    try {
      const date = docslots[slotidx][0].datetime;
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      let slotdate = day + "/" + month + "/" + year;

      const { data } = await axios.post(
        backendurl + '/api/user/user-appointment',
        { docId: docid, slotDate: slotdate, slotTime: selectedTime.time },
        { headers: { usertoken: token } }
      );

      if (data.success) {
        toast.success(data.message);
        navigate(`/myappointments`);
        getdoctorsdata();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  const fetchdoc = async () => {
    const docinfo = doctors.find(doc => doc._id === docid);
    setDocinfo(docinfo);
    if (docinfo) {
      getavailableslot(docinfo);
    }
  };

  useEffect(() => {
    fetchdoc();
  }, [docid, doctors]); 

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
  }, [docslots, slotidx]);

  if (!doctor) {
    return <div className="p-8 text-center text-xl text-gray-600">Loading Doctor Information...</div>;
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
            Appointment fee: <span className="text-blue-600">${doctor.fees}</span>
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
                key={idx}
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
                {docslots[slotidx].map((slot, timeIdx) => (
                  <button
                    key={timeIdx}
                    onClick={() => setSelectedTime(slot)}
                    className={`py-3 px-2 rounded-xl text-base font-medium transition duration-200 border-2
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
                  disabled={!selectedTime}
                  className={`w-full py-4 rounded-xl text-xl font-extrabold tracking-wider transition-all duration-300 
                    ${selectedTime
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-2xl shadow-blue-300/50 transform hover:scale-[1.005]'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-inner'
                    }`}
                >
                  {selectedTime ? `Confirm Booking for ${selectedTime.time}` : 'Select a Time to Book'}
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
