import React from 'react';

const Header = () => {
  const placeholderImages = {
    // FIX: Using your Pexels image link
    doctorMain: 'https://images.pexels.com/photos/5327653/pexels-photo-5327653.jpeg',
    
    // Avatar images
    doctor1: 'https://randomuser.me/api/portraits/men/32.jpg',
    doctor2: 'https://randomuser.me/api/portraits/women/44.jpg',
    doctor3: 'https://randomuser.me/api/portraits/men/12.jpg',
    doctor4: 'https://randomuser.me/api/portraits/women/65.jpg',
  };

  return (
    <div className="relative bg-blue-500 rounded-lg shadow-xl overflow-hidden min-h-[480px] w-full max-w-5xl mx-auto my-8">
      <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between h-full">
        
        {/* Left Section - Text Content */}
        {/* FIX: Increased right padding (pr-8 instead of pr-16, combined with md:w-1/2 for explicit width) */}
        <div className="flex-1 text-white text-center md:text-left mb-8 md:mb-0 max-w-xl md:max-w-[calc(50%-2rem)] pr-0 md:pr-8 z-10"> {/* Adjusted max-w for better space distribution */}
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Book Appointment <br /> With Trusted Doctors
          </h1>
          
          <div className="flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start mb-6">
            <div className="flex -space-x-4 mb-4 md:mb-0 md:mr-4 flex-shrink-0"> 
              <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src={placeholderImages.doctor1} alt="Doctor 1" />
              <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src={placeholderImages.doctor2} alt="Doctor 2" />
              <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src={placeholderImages.doctor3} alt="Doctor 3" />
              <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src={placeholderImages.doctor4} alt="Doctor 4" />
            </div>
            <p className="text-lg text-center md:text-left flex-grow">
              Simply browse through our extensive list of trusted doctors,
              schedule your appointment hassle-free.
            </p>
          </div>

          <button 
           className="bg-white text-blue-700 font-medium py-3 px-6 rounded-full flex items-center justify-center md:justify-start mx-auto md:mx-0 shadow-lg hover:bg-gray-100 transition-colors mt-6">
            Book appointment
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </button>
        </div>

        {/* Right Section - Image */}
        {/* FIX: Changed object-position to 'right' to prioritize the right side of the image */}
        <div className="flex-shrink-0 w-full md:w-1/2 absolute bottom-0 right-0 h-full max-h-[500px] md:max-h-full">
          <img
            src={placeholderImages.doctorMain}
            alt="Trusted Doctors"
            className="h-full w-full object-cover rounded-tr-lg rounded-br-lg" // Changed w-auto to w-full
            style={{ objectPosition: 'right' }} // FIX: Changed to 'right'
          />
        </div>
      </div>
    </div>
  );
};

export default Header;