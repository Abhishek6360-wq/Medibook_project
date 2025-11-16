// DoctorCard.jsx
import React, { useMemo } from "react";

const DoctorCard = React.memo(({ doctor, onclick }) => {
  const { name, speciality, image, available } = doctor;

  // Dynamic status based on backend data - memoized
  const statusConfig = useMemo(() => ({
    statusColor: available ? "text-green-600" : "text-red-600",
    dotColor: available ? "bg-green-600" : "bg-red-600",
    statusText: available ? "Available" : "Unavailable",
  }), [available]);

  return (
    <div
      className="
        w-48 
        bg-white 
        rounded-lg 
        shadow-md 
        overflow-hidden 
        cursor-pointer 
        transition 
        duration-300 
        ease-in-out 
        transform 
        hover:scale-[0.98]
        hover:shadow-xl
      "
      onClick={onclick}
    >
      {/* Image Section */}
      <div className="h-56 bg-blue-50 flex justify-center items-end p-0">
        <img
          className="w-full h-full object-cover object-bottom"
          src={image}
          alt={`Dr. ${name}`}
          loading="lazy"
          width="192"
          height="224"
        />
      </div>

      {/* Content Section */}
      <div className="p-3">
        {/* Availability */}
        <div className="flex items-center mb-1">
          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusConfig.dotColor}`}></span>
          <span className={`font-semibold text-xs ${statusConfig.statusColor}`}>
            {statusConfig.statusText}
          </span>
        </div>

        {/* Name */}
        <h3 className="text-base font-bold text-gray-800 leading-snug">
          {`Dr. ${name}`}
        </h3>

        {/* Specialty */}
        <p className="text-gray-600 text-sm mt-0.5">
          {speciality}
        </p>
      </div>
    </div>
  );
});

DoctorCard.displayName = 'DoctorCard';

export default DoctorCard;
