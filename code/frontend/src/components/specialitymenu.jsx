import React from 'react'
import { assets } from '../assets/assets'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'

const Specialitymenu = () => {
  return (
    <div className=" flex flex-col items-center gap-4 py-16 text-grey-800"   id="#speciality-menu">

        <h1 classname="text-3xl font-medium">Find by Speciality</h1>
        <p className="sm:w-1/3 text-center text-sm">Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.</p>
        <div className='flex sm:justify-center gap-4 pt-5 w-full overflow-scroll'>
            {
                specialityData.map((s,idx)=>(
                    <Link className="flex flex-col item-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500" onClick={()=>scrollTo(0,0)} key={idx} to={`/doctors/${s.speciality}`}>
                    <img className="w-16 sm:w-24 mb-2"src={s.image} alt="lol"/>
                    <p>{s.speciality}</p>
                    </Link>                    
                ))
            }
        </div>

    </div>
  )
}

export default Specialitymenu