import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom' 
import { doctors } from '../assets/assets';
import DoctorCard from './doctorcard';


const Related = ({ docid, speciality }) => {
    const [reldoc,setReldoc]=useState([]);
    const navigate=useNavigate();

useEffect(()=>{
  if(doctors.length > 0 && speciality && docid){
    const doctordata=doctors.filter(
       (doc => doc.speciality === speciality && doc._id !== docid)
      );
            setReldoc(doctordata);
        }
    },[speciality, docid]) 

    if (reldoc.length === 0) {
        return <div className="p-4 mt-8 bg-white rounded-xl shadow-lg"><p className="text-gray-500">No other related doctors found in this specialty.</p></div>;
    }
    
  return (
    <div className="p-4 bg-white rounded-xl shadow-lg mt-8">
        <h3 className='text-2xl font-bold text-gray-800 mb-6 border-b pb-3'>Related Doctors in {speciality}</h3>
        
       
        <div className="flex flex-nowrap overflow-x-scroll pb-4 space-x-4 scrollbar-hide"> 
        {
        reldoc.slice(0,5).map((doct) => (
          <div key={doct._id} className="flex-shrink-0 w-80"> 
            <DoctorCard 
               doctor={doct}
               onclick={()=>{
                    navigate(`/appointments/${doct._id}`);
                    window.scrollTo(0, 0); 
                }} 
            />
            </div>
        ))
        }
        </div>
    </div>
  )
}

export default Related