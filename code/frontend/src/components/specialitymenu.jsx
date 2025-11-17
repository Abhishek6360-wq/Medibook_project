import React from 'react'
import { Link } from 'react-router-dom'

const specialityData = [
    { speciality: 'General physician' },
    { speciality: 'Gynecologist' },
    { speciality: 'Dermatologist' },
    { speciality: 'Pediatricians' },
    { speciality: 'Neurologist' },
    { speciality: 'Gastroenterologist' },
];

const Specialitymenu = () => {
  return (
    <section className="px-4 py-12 text-gray-800" id="speciality-menu">
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-4">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center">
          Find Doctors by Speciality
        </h2>
        <p className="text-center text-sm sm:text-base text-gray-600 max-w-2xl">
          Quickly browse our speciality categories and jump straight to doctors who treat the condition you need support with.
        </p>

        <div className="w-full flex gap-4 pt-6 overflow-x-auto pb-2">
          {specialityData.map((s) => (
            <Link
              key={s.speciality}
              to={`/doctors/${s.speciality}`}
              onClick={() => scrollTo(0, 0)}
              className="flex flex-col items-center text-xs sm:text-sm cursor-pointer flex-shrink-0 min-w-[90px] sm:min-w-[120px] hover:-translate-y-1 transition-transform duration-200"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 mb-2 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center">
                <span className="text-blue-700 font-semibold text-center px-2 text-sm">
                  {s.speciality.split(" ")[0]}
                </span>
              </div>
              <p className="text-center font-medium text-gray-700">{s.speciality}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Specialitymenu;