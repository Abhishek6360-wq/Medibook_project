import React, { useContext, useEffect } from "react";
import { Admincontext } from "../../context/admincontext";

const Doctorlist = () => {
  const { alldoctors, doctors, atoken, changeavailabillity } =
    useContext(Admincontext);

  useEffect(() => {
    if (atoken) alldoctors();
  }, [atoken]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Doctor's List
      </h2>

      {/* Grid Layout */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {doctors.map((doc, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200 p-5 flex flex-col items-center text-center"
          >
            {/* Doctor Image */}
            <img
              src={doc.image}
              alt={doc.name}
              className="h-24 w-24 object-cover rounded-full mb-4 border border-gray-300"
            />

            {/* Doctor Info */}
            <div className="flex flex-col gap-1">
              <p className="text-lg font-semibold text-gray-800">{doc.name}</p>
              <p className="text-sm text-gray-500">{doc.speciality}</p>
            </div>

            {/* Availability Toggle */}
            <div className="mt-4 flex items-center justify-center gap-2">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={doc.available}
                  onChange={() => changeavailabillity(doc._id)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-400 rounded-full peer peer-checked:bg-blue-600 transition-all"></div>
              </label>
              <p
                className={`text-sm font-medium ${
                  doc.available ? "text-green-600" : "text-red-500"
                }`}
              >
                {doc.available ? "Available" : "Unavailable"}
              </p>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-gray-200 my-4"></div>

            {/* Fees & Experience */}
            <div className="flex flex-col gap-1 text-sm text-gray-600">
              <p>
                <span className="font-medium text-gray-700">Experience:</span>{" "}
                {doc.experience}
              </p>
              <p>
                <span className="font-medium text-gray-700">Fees:</span> ₹
                {doc.fees}
              </p>
            </div>
          </div>
        ))}
      </div>

      {doctors.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No doctors found. Please add some doctors.
        </p>
      )}
    </div>
  );
};

export default Doctorlist;
