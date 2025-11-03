import React from 'react';

const Footer = () => {   
    return (
        <footer className="bg-white border-t border-gray-100 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">

                    {/* Column 1: Logo and Description */}
                    <div className="col-span-2 md:col-span-1 space-y-4">
                        <div className="flex items-center space-x-2">       
                            <span className="text-2xl font-bold text-indigo-600">MediBook</span> 
                        </div>
                        <p className="text-sm text-gray-500 max-w-xs">
                            MediBook is your trusted platform to find verified doctors, schedule appointments, and manage your healthcare needs—all from the comfort of your home. 
                            Our goal is to make healthcare more accessible, transparent, and convenient for everyone.
                        </p>
                    </div>

                    {/* Column 2: Company Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 uppercase tracking-wider">
                            Company
                        </h3>
                        <div className="space-y-3 text-sm text-gray-600">
                            <p>Home</p>
                            <p>About Us</p>
                            <p>Our Services</p>
                            <p>Privacy Policy</p>
                        </div>
                    </div>

                    {/* Column 3: Get In Touch */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 uppercase tracking-wider">
                            Get In Touch
                        </h3>
                        <div className="space-y-3 text-sm text-gray-600">
                            <p>+91-6360827715</p>
                            <p>at8984316@gmail.com</p>
                            <p>Mon - Sat: 9:00 AM - 8:00 PM</p>
                        </div>
                    </div>

                    {/* Column 4: Social */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 uppercase tracking-wider">
                            Follow Us
                        </h3>
                        <div className="space-y-2 text-sm text-gray-600">
                            <p>Facebook</p>
                            <p>Twitter</p>
                            <p>Instagram</p>
                            <p>LinkedIn</p>
                        </div>
                    </div>
                </div>

                {/* Separator Line */}
                <hr className="my-8 border-gray-200" />

                {/* Copyright Section */}
                <div className="text-center text-sm text-gray-500">
                    <p>
                        © {new Date().getFullYear()} MediBook. All rights reserved.  
                        Designed to simplify doctor appointments and empower patient care.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
