import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets'; 

const ActionBanner = () => {
    const navigate = useNavigate();
    const handleCreateAccountClick = () => {
        navigate('/login');
    };
    return (
        <div className="w-full max-w-5xl mx-auto my-12 p-0 rounded-xl shadow-2xl overflow-hidden bg-indigo-600 relative">
            <div className="flex items-center justify-between py-12 px-8 md:py-16 md:px-16 relative">
                <div className="max-w-xl text-white z-10 self-center">                     
                    <button
                        onClick={handleCreateAccountClick}
                        className="
                            bg-white 
                            text-indigo-700 
                            font-semibold 
                            py-3 
                            px-8 
                            rounded-full 
                            shadow-lg 
                            hover:bg-gray-100 
                            hover:shadow-xl 
                            transition 
                            duration-300
                        "
                    >
                        Create account
                    </button>
                </div>
                <div className="absolute right-0 top-0 bottom-0 hidden lg:block" style={{ width: '50%' }}>
                    <img
                        src={assets.appointment_img}
                        alt="Smiling female doctor pointing"
                        className="h-full w-full object-contain object-right-bottom rounded-tr-xl rounded-br-xl"
                        style={{     
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            right: 0,
                            bottom: 0,
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ActionBanner;
