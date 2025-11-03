import React from 'react';

// --- About Us Component ---
const AboutUs = () => (
  <section className="p-4 md:p-8 space-y-12">
    {/* Header */}
    <div className="text-center">
      <h1 className="text-4xl font-extrabold text-sky-700 mb-4">About MediBook</h1>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        Making healthcare simple, transparent, and accessible—one appointment at a time.
      </p>
    </div>

    {/* Mission Card */}
    <div className="bg-white p-6 md:p-10 rounded-xl shadow-lg border-t-4 border-sky-500">
      <div className="text-3xl font-light text-sky-500 mb-4">"</div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-3">Our Mission</h2>
      <p className="text-gray-600 leading-relaxed">
        At MediBook, our mission is to bridge the gap between patients and healthcare professionals through 
        technology that empowers both. We aim to make quality medical care easier to find, faster to access, 
        and simpler to manage—because good health starts with timely care.
      </p>
    </div>

    {/* Key Pillars Section */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300">
        <h3 className="text-xl font-bold text-sky-600 mb-2">Trust & Security</h3>
        <p className="text-sm text-gray-600">
          Your privacy is our top priority. MediBook uses secure data encryption and verified doctor listings 
          to ensure every consultation and record remains safe and confidential.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300">
        <h3 className="text-xl font-bold text-sky-600 mb-2">Simplicity & Speed</h3>
        <p className="text-sm text-gray-600">
          From discovering doctors to booking an appointment, every step takes just a few clicks. 
          Our clean and intuitive design makes healthcare more approachable for everyone—young or old.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300">
        <h3 className="text-xl font-bold text-sky-600 mb-2">Accessibility for All</h3>
        <p className="text-sm text-gray-600">
          Whether you live in a metro city or a small town, MediBook connects you to a wide range of 
          specialists and general physicians, ensuring quality healthcare is never out of reach.
        </p>
      </div>
    </div>
    
    {/* Meet the Founder Section */}
    <div className="p-6 md:p-10 rounded-xl bg-white shadow-xl flex justify-center">
      <div className="text-center p-8 max-w-sm bg-sky-50 rounded-xl shadow-lg border-t-4 border-sky-500">
        <h2 className="text-3xl font-bold text-sky-700 text-center mb-6">Meet the Founder</h2>
        <img
          src="https://res.cloudinary.com/dzyuyrctv/image/upload/v1762180016/IMG-20250908-WA0000_lkmsye.jpg"
          alt="Founder of MediBook"
          className="w-48 h-48 rounded-full mx-auto mb-6 object-cover border-4 border-sky-300 shadow-md"
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="https://placehold.co/192x192/e0f2fe/075985?text=Founder"; }}
        />
        <h3 className="text-2xl font-bold text-gray-800">Christopher</h3>
        <p className="text-sky-600 font-medium mb-4">Founder & Visionary Behind MediBook</p>
        <p className="text-md text-gray-600">
          Christopher founded MediBook to address a simple but crucial challenge—making healthcare appointments 
          less stressful and more reliable. His vision is to build a digital ecosystem where patients, doctors, 
          and clinics can collaborate effortlessly to create a smarter, healthier future.
        </p>
      </div>
    </div>

    {/* Closing Section */}
    <div className="text-center max-w-2xl mx-auto">
      <p className="text-gray-600 text-md">
        MediBook continues to evolve with the belief that healthcare should be human, accessible, and empowering. 
        We’re not just building software—we’re building connections that matter.
      </p>
    </div>
  </section>
);

export default AboutUs;
