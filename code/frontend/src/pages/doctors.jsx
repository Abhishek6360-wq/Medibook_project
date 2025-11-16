import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DoctorCard from '../components/doctorcard'
import { AppContext } from '../context/appcontext'

const Doctors = () => {
    const{doctors, loadingDoctors}=useContext(AppContext)
    const { speciality } = useParams();
    const [filterdoc, setFilterdoc] = useState([]);
    const navigate = useNavigate();

    const applyfilter = () => {
        if (speciality === 'All' || !speciality) {
            setFilterdoc(doctors);
        } else {
            setFilterdoc(doctors.filter(doc => doc.speciality === speciality));
        }
    };

    useEffect(() => {
        applyfilter();
    }, [speciality, doctors]);

    if (loadingDoctors) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-gray-600 text-lg">Loading doctors...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex gap-8">
            {/* Sidebar Menu */}
            <div className="w-64">
                {/* 1. Increased margin-bottom (mb-6) and changed color to near-black (text-gray-900) */}
                <p className="mb-6 text-gray-900 font-medium text-lg"> 
                    Browse through the doctors specialist.
                </p>
                {/* 2. Added padding (p-4), background (bg-gray-50), and rounded corners to the ul for better distancing/grouping */}
                <ul className="space-y-3 bg-gray-50 p-4 rounded-lg"> 
                    {/* ALL DOCTORS */}
                    <li
                        className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                            !speciality || speciality === 'All'
                                ? 'bg-blue-100 text-blue-700 font-medium' // Changed to blue-700 for better contrast
                                : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => navigate('/doctors/All')}
                    >
                        All Doctors
                    </li>

                    {/* Individual Specialities - Used a map to keep the code clean */}
                    {['General physician', 'Gynecologist', 'Dermatologist', 'Pediatricians', 'Neurologist', 'Gastroenterologist'].map(spec => (
                        <li
                            key={spec}
                            className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                                speciality === spec
                                    ? 'bg-blue-100 text-blue-700 font-medium'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            onClick={() => navigate(`/doctors/${spec}`)}
                        >
                            {spec}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Doctors Grid (No changes made here) */}
            <div className="flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {filterdoc.map((doct, idx) => (
                        <DoctorCard
                            key={idx}
                            doctor={doct}
                            onclick={() => navigate(`/appointments/${doct._id}`)}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Doctors