import React, { useState, useContext } from "react";
import { AppContext } from "../context/appcontext";
import { ToastContainer } from "react-toastify";

const Contact = () => {
  const { sendContactMessage } = useContext(AppContext);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const success = await sendContactMessage(formData);
      if (success) {
        setFormData({ name: "", email: "", message: "" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-sky-50 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-sky-600 text-white text-center py-8 px-6">
          <h1 className="text-4xl font-extrabold mb-2">Contact MediBook</h1>
          <p className="text-lg text-sky-100">
            We’re here to help you with appointments, support, or inquiries.
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-sky-700">Get in Touch</h2>
            <p className="text-gray-600 leading-relaxed">
              Have questions or feedback? Reach out to us and we’ll get back to you as soon as possible.
            </p>
            <div className="space-y-4">
              <p><span className="font-semibold text-sky-600">Email:</span> at8984316@gmail.com</p>
              <p><span className="font-semibold text-sky-600">Phone:</span> +91 98765 43210</p>
              <p><span className="font-semibold text-sky-600">Address:</span> MediBook HQ, Bengaluru, India</p>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="bg-sky-50 rounded-xl p-6 shadow-md space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
                disabled={loading}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                disabled={loading}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Message</label>
              <textarea
                rows="4"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message here..."
                required
                disabled={loading}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-600 text-white font-semibold py-3 rounded-lg hover:bg-sky-700 transition duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                'Send Message'
              )}
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
};

export default Contact;
