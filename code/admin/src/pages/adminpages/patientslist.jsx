import React, { useContext, useEffect, useState } from 'react';
import { Admincontext } from '../../context/admincontext';
import axios from 'axios';
import { toast } from 'react-toastify';

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className="text-gray-600 text-lg">Loading patients...</p>
    </div>
  </div>
);

const PatientsList = () => {
  const { atoken, backendurl } = useContext(Admincontext);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (atoken) {
      fetchPatients();
    }
  }, [atoken]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        backendurl + '/api/admin/all-patients',
        { headers: { admintoken: atoken } }
      );
      if (data.success) {
        setPatients(data.patients);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  };

  if (!atoken) {
    return (
      <div className="p-8 text-center text-xl text-red-600 bg-red-50 rounded-lg m-4">
        Access Denied. Please log in as an Admin.
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto min-h-screen bg-gray-50 font-sans">
      <h1 className="text-3xl font-extrabold mb-8 border-b pb-4 text-black-800">
        👥 All Patients
      </h1>

      <div className="bg-white shadow-2xl rounded-xl overflow-hidden border border-blue-100">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-5 gap-4 px-6 py-3 font-bold text-sm uppercase tracking-wider text-white bg-blue-600">
          <div className="col-span-1">S.No.</div>
          <div className="col-span-1">Name</div>
          <div className="col-span-1">Email</div>
          <div className="col-span-1">Phone</div>
          <div className="col-span-1">Date Joined</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-blue-50">
          {patients.length > 0 ? (
            patients.map((patient, index) => (
              <div
                key={patient._id}
                className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 md:px-6 md:py-4 items-center hover:bg-blue-50 transition-colors"
              >
                <div className="text-sm font-medium text-gray-900">
                  <span className="md:hidden font-bold text-blue-500 mr-2">#</span>
                  {index + 1}
                </div>
                <div className="text-sm text-gray-700 font-semibold">
                  <span className="md:hidden font-bold text-gray-500 mr-2">Name:</span>
                  {patient.name || 'N/A'}
                </div>
                <div className="text-sm text-gray-700">
                  <span className="md:hidden font-bold text-gray-500 mr-2">Email:</span>
                  {patient.email || 'N/A'}
                </div>
                <div className="text-sm text-gray-700">
                  <span className="md:hidden font-bold text-gray-500 mr-2">Phone:</span>
                  {patient.phnum || 'N/A'}
                </div>
                <div className="text-sm text-gray-500">
                  <span className="md:hidden font-bold text-gray-500 mr-2">Joined:</span>
                  {patient.date ? new Date(patient.date).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No patients found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientsList;

