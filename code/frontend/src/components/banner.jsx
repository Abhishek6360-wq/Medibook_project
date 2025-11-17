import React from "react";
import { useNavigate } from "react-router-dom";

const ActionBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="px-4 py-12">
      <div className="max-w-5xl mx-auto bg-indigo-600 rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-1/2 px-8 sm:px-12 py-12 text-white text-center lg:text-left">
            <h2 className="text-3xl font-semibold leading-tight mb-4">
              Ready to take charge of your health?
            </h2>
            <p className="text-indigo-100 mb-8">
              Create an account to access your medical history, manage appointments, and receive reminders across all your devices.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-white text-indigo-700 font-semibold shadow-lg hover:bg-indigo-50 transition-colors"
            >
              Create account
            </button>
          </div>

          <div className="w-full lg:w-1/2 h-64 lg:h-full relative">
            <img
              src="https://images.pexels.com/photos/8460102/pexels-photo-8460102.jpeg"
              alt="Smiling doctor"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              width="400"
              height="400"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/60 to-transparent lg:hidden" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ActionBanner;
