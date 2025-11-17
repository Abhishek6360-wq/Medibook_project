import React from "react";

const Header = () => {
  const placeholderImages = {
    doctorMain: "https://images.pexels.com/photos/5327653/pexels-photo-5327653.jpeg",
    doctor1: "https://randomuser.me/api/portraits/men/32.jpg",
    doctor2: "https://randomuser.me/api/portraits/women/44.jpg",
    doctor3: "https://randomuser.me/api/portraits/men/12.jpg",
    doctor4: "https://randomuser.me/api/portraits/women/65.jpg",
  };

  return (
    <section className="px-4 pt-6 lg:pt-10">
      <div className="max-w-6xl mx-auto bg-gradient-to-r from-blue-600 to-blue-500 rounded-[32px] shadow-2xl overflow-hidden">
        <div className="flex flex-col-reverse lg:flex-row items-center">
          <div className="w-full lg:w-1/2 text-white px-6 sm:px-10 py-10 lg:py-14 text-center lg:text-left">
            <p className="text-sm uppercase tracking-[0.3em] text-blue-100 mb-4">
              Trusted tele-health platform
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-5">
              Book appointments with experienced doctors anytime
            </h1>
            <p className="text-base sm:text-lg text-blue-50 max-w-xl mx-auto lg:mx-0">
              Browse our curated list of specialists, read patient reviews, and confirm a visit in
              minutes—no phone calls or waiting rooms required.
            </p>

            <div className="flex flex-col sm:flex-row items-center lg:items-start mt-8 gap-6">
              <div className="flex -space-x-4">
                {[placeholderImages.doctor1, placeholderImages.doctor2, placeholderImages.doctor3, placeholderImages.doctor4].map(
                  (src, idx) => (
                    <img
                      key={src}
                      className="w-12 h-12 rounded-full border-2 border-white object-cover"
                      src={src}
                      alt={`Doctor ${idx + 1}`}
                      loading="lazy"
                      width="48"
                      height="48"
                    />
                  )
                )}
              </div>

              <div className="text-sm text-blue-50">
                <p className="font-semibold">40,000+ happy patients</p>
                <p className="opacity-80">Consult top-rated doctors around the world.</p>
              </div>
            </div>

            <button className="mt-8 inline-flex items-center justify-center gap-2 bg-white text-blue-700 font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-blue-50 transition-colors">
              Book Appointment
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </button>
          </div>

          <div className="w-full lg:w-1/2 h-72 sm:h-96 lg:h-full relative">
            <img
              src={placeholderImages.doctorMain}
              alt="Trusted Doctors"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              width="800"
              height="500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;