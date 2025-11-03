import React, { useContext, useEffect, useMemo } from "react";
import { Doctorcontext } from "../../context/doctorcontext";

// Format amount in Indian Rupees
const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount);

const DoctorDashboard = () => {
  const { Appointments, getappointments } = useContext(Doctorcontext);

  useEffect(() => {
    getappointments();
  }, [getappointments]);

  const dashboardData = useMemo(() => {
    if (!Appointments?.length)
      return {
        totalAppointments: 0,
        totalEarnings: 0,
        paidAppointmentsCount: 0,
        patientList: [],
      };

    let totalEarnings = 0;
    let paidAppointmentsCount = 0;
    const patientDataMap = new Map();

    Appointments.forEach((a) => {
      if (a.payment) {
        totalEarnings += a.amount || 0;
        paidAppointmentsCount++;
      }

      const userId = a.UserId;
      if (userId && !patientDataMap.has(userId))
        patientDataMap.set(userId, {
          name: a.userData?.name || "Unknown Patient",
          id: userId,
        });
    });

    return {
      totalAppointments: Appointments.length,
      totalEarnings,
      paidAppointmentsCount,
      patientList: Array.from(patientDataMap.values()),
    };
  }, [Appointments]);

  const {
    totalAppointments,
    totalEarnings,
    paidAppointmentsCount,
    patientList,
  } = dashboardData;

  if (!Appointments)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl font-medium text-blue-600">
          Loading Dashboard Data...
        </div>
      </div>
    );

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-inter">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8 border-b-4 border-blue-500 pb-3">
        Doctor Performance Dashboard
      </h1>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-green-500 hover:shadow-xl transition">
          <p className="text-sm font-medium text-gray-500 uppercase">
            Total Earnings
          </p>
          <p className="text-4xl font-bold text-gray-900 mt-1">
            {formatCurrency(totalEarnings)}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Based on {paidAppointmentsCount} paid appointments.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-blue-500 hover:shadow-xl transition">
          <p className="text-sm font-medium text-gray-500 uppercase">
            Total Appointments
          </p>
          <p className="text-4xl font-bold text-gray-900 mt-1">
            {totalAppointments}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            All bookings linked to your doctor ID.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-purple-500 hover:shadow-xl transition">
          <p className="text-sm font-medium text-gray-500 uppercase">
            Unique Patients Served
          </p>
          <p className="text-4xl font-bold text-gray-900 mt-1">
            {patientList.length}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Distinct patients you’ve served.
          </p>
        </div>
      </div>

      {/* Unique Patients List */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          List of Unique Patients
        </h2>
        <div className="overflow-y-auto max-h-96">
          {patientList.length ? (
            <ul className="divide-y divide-gray-200">
              {patientList.map((p, i) => (
                <li
                  key={p.id}
                  className="py-3 flex justify-between items-center hover:bg-gray-50 px-2 rounded-lg"
                >
                  <span className="font-medium text-gray-700">
                    {i + 1}. {p.name}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center py-8 text-gray-500 italic">
              No patients recorded yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
