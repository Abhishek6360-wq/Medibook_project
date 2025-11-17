import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorCard from './doctorcard';
import { AppContext } from '../context/appcontext';

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors, loadingDoctors } = useContext(AppContext);

  return (
    <section className="py-12 px-4 sm:px-8">
      <h1 className="text-center text-2xl sm:text-3xl font-bold mb-8 text-gray-800">
        Top Doctors
      </h1>

      {/* Show loading state or doctors */}
      {loadingDoctors ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-500 text-lg">Loading doctors...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
          {doctors && doctors.length > 0 ? (
            doctors.slice(0, 10).map((doctor) => (
              <DoctorCard
                key={doctor._id}
                doctor={doctor}
                onclick={() => navigate(`/appointments/${doctor._id}`)}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-full">No doctors available</p>
          )}
        </div>
      )}

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
