import React, { useContext, useEffect } from "react";
import { Doctorcontext } from "../../context/doctorcontext";

const DoctorAppointments = () => {
  const { Appointments, getappointments, markcomplete, markcancel } = useContext(Doctorcontext);

  useEffect(() => {
    getappointments();
  }, [getappointments]);

  const getAppointmentStatus = (a) => {
    if (a.cancelled) return "Cancelled";
    if (a.isComplete) return "Completed";
    if (!a.payment) return "Payment Pending";
    return "Paid";
  };

  const getStatusBadge = (s) => {
    switch (s) {
      case "Completed": return "bg-green-100 text-green-800 border border-green-300";
      case "Cancelled": return "bg-red-100 text-red-800 border border-red-300";
      case "Payment Pending": return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      case "Paid": return "bg-blue-100 text-blue-800 border border-blue-300";
      default: return "bg-gray-100 text-gray-800 border border-gray-300";
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-inter">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-4 border-blue-500 pb-3">
        Appointments Booked For You
      </h1>

      <div className="overflow-x-auto shadow-2xl rounded-xl bg-white transition duration-300">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-700 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase">Patient Name</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase">Doctor / Speciality</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase">Date / Time</th>
              <th className="px-6 py-3 text-center text-xs font-bold uppercase">Status</th>
              <th className="px-6 py-3 text-center text-xs font-bold uppercase">Action</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100">
            {Appointments?.length ? (
              Appointments.map((a) => {
                const status = getAppointmentStatus(a);
                const showActions = !a.cancelled && !a.isComplete;
                return (
                  <tr key={a.id} className="hover:bg-blue-50 transition duration-150">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {a.userData?.name || "Unknown Patient"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <span className="font-medium">{a.docData?.name || "Dr. N/A"}</span>
                      <br />
                      <span className="text-xs text-gray-500 italic">
                        {a.docData?.speciality || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="font-mono text-xs">{a.slotDate}</div>
                      <div className="font-bold text-gray-800">{a.slotTime}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${getStatusBadge(status)}`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-center">
                      {showActions ? (
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => markcomplete(a.id)}
                            className="px-3 py-1 text-xs font-medium rounded-lg text-white bg-green-500 hover:bg-green-600 shadow-sm transition hover:scale-105 cursor-pointer"
                            title="Mark as completed"
                          >
                            ✓ Complete
                          </button>
                          <button
                            onClick={() => markcancel(a.id)}
                            className="px-3 py-1 text-xs font-medium rounded-lg text-white bg-red-500 hover:bg-red-600 shadow-sm transition hover:scale-105 cursor-pointer"
                            title="Cancel appointment"
                          >
                            ✕ Cancel
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic text-xs">Action Unavailable</span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-6 text-center text-lg font-medium text-gray-500 bg-gray-50">
                  No appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorAppointments;
