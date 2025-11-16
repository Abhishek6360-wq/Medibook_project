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
    <div className=" flex flex-col items-center gap-4 py-16 text-grey-800"   id="#speciality-menu">

        <h1 classname="text-3xl font-medium">Find by Speciality</h1>
        <p className="sm:w-1/3 text-center text-sm">Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.</p>
        <div className='flex sm:justify-center gap-4 pt-5 w-full overflow-scroll'>
            {
                specialityData.map((s)=>(
                    <Link className="flex flex-col item-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500" onClick={()=>scrollTo(0,0)} key={s.speciality} to={`/doctors/${s.speciality}`}>
                    <div className="w-16 sm:w-24 h-16 sm:h-24 mb-2 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-xs">{s.speciality.charAt(0)}</span>
                    </div>
                    <p>{s.speciality}</p>
                    </Link>                    
                ))
            }
        </div>

    </div>
  )
}

export default Specialitymenu