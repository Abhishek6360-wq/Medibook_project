import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorCard from './doctorcard';
import { AppContext } from '../context/appcontext';

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors, getdoctorsdata } = useContext(AppContext);

  // Optional safety: fetch doctors if context is empty (e.g. page refresh)
  useEffect(() => {
    if (!doctors || doctors.length === 0) {
      getdoctorsdata();
    }
  }, []);

  return (
    <div className="py-8 px-8">
      <h1 className="text-center text-3xl font-bold mb-10 text-gray-800">
        Top Doctors
      </h1>

      {/* Show loading state or doctors */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-10 justify-items-center">
        {doctors && doctors.length > 0 ? (
          doctors.slice(0, 10).map((doctor, idx) => (
            <DoctorCard
              key={doctor._id || idx}
              doctor={doctor}
              onclick={() => navigate(`/appointments/${doctor._id}`)}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">Loading doctors...</p>
        )}
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => navigate(`/doctors/All`)}
          className="
            bg-blue-600 
            text-white 
            px-12 
            py-2 
            rounded-full 
            mt-10 
            shadow-md 
            hover:bg-blue-400 
            transition 
            duration-150
            cursor-pointer"
        >
          More
        </button>
      </div>
    </div>
  );
};

export default TopDoctors;
