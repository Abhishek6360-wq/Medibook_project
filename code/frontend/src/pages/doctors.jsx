import React, { useContext, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DoctorCard from "../components/doctorcard";
import { AppContext } from "../context/appcontext";

const specialities = [
  "General physician",
  "Gynecologist",
  "Dermatologist",
  "Pediatricians",
  "Neurologist",
  "Gastroenterologist",
];

const Doctors = () => {
  const { doctors, loadingDoctors } = useContext(AppContext);
  const { speciality } = useParams();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);

  const filteredDoctors = useMemo(() => {
    if (speciality === "All" || !speciality) {
      return doctors;
    }
    return doctors.filter((doc) => doc.speciality === speciality);
  }, [speciality, doctors]);

  if (loadingDoctors) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <svg
            className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-gray-600 text-lg">Loading doctors...</p>
        </div>
      </div>
    );
  }

  const renderFilters = () => (
    <ul className="space-y-3 bg-gray-50 p-4 rounded-xl shadow-sm">
      <li
        className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${
          !speciality || speciality === "All"
            ? "bg-blue-100 text-blue-700 font-semibold"
            : "text-gray-700 hover:bg-gray-100"
        }`}
        onClick={() => navigate("/doctors/All")}
      >
        All Doctors
      </li>
      {specialities.map((spec) => (
        <li
          key={spec}
          className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${
            speciality === spec
              ? "bg-blue-100 text-blue-700 font-semibold"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => navigate(`/doctors/${spec}`)}
        >
          {spec}
        </li>
      ))}
    </ul>
  );

  return (
    <section className="px-4 py-10 lg:py-12">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        <div className="lg:w-64 flex-shrink-0">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <p className="text-gray-900 font-semibold text-lg">
              Browse by speciality
            </p>
            <button
              className="lg:hidden text-sm text-blue-600 font-medium"
              onClick={() => setShowFilters((prev) => !prev)}
            >
              {showFilters ? "Hide" : "Filters"}
            </button>
          </div>
          <div className="hidden lg:block">{renderFilters()}</div>
          {showFilters && <div className="lg:hidden">{renderFilters()}</div>}
        </div>

        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <DoctorCard
                key={doctor._id}
                doctor={doctor}
                onclick={() => navigate(`/appointments/${doctor._id}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Doctors;
