import React, { useState, useContext, useEffect, useRef } from 'react';
import { AppContext } from '../context/appcontext';
import { assets } from '../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const Profile = () => {
  const { userData, setUserData, token, backendurl, getuserprofiledata } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  
  
  const handleEditClick = (e) => {
    e.preventDefault();
    setIsEdit(true);    
  };

  const updateuserprofile = async (e) => {
    e.preventDefault();
    try {
      
      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('email', userData.email);
      formData.append('phone', userData.phno);
      formData.append('dob', userData.dob);
      formData.append('gender', userData.gender);
      formData.append('Address', JSON.stringify(userData.Address));
      if (selectedImage) formData.append('image', selectedImage);

      const { data } = await axios.post(
        `${backendurl}/api/user/user-update-profile`,
        formData,
        {
          headers: { usertoken: token },
        }
      );

      if (data.success) {
        toast.success(data.message);
        
        // 🌟 FIX APPLIED HERE: Directly update the global state with the new user object 
        // returned from the backend, which contains the new image URL.
        setUserData(data.user);
        
        // NOTE: getuserprofiledata() is commented/removed as it's no longer necessary 
        // and only caused a delay.
        // getuserprofiledata(); 
        
        setIsEdit(false);
        setSelectedImage(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };



  

  return userData &&  (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-blue-200 dark:from-gray-900 dark:to-gray-800 py-10">
      <form
        onSubmit={updateuserprofile}
        className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-3xl"
      >
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <label htmlFor="imageUpload" className="relative cursor-pointer">
            <img
              src={
                selectedImage
                  ? URL.createObjectURL(selectedImage)
                  : userData.image || assets.default_user
              }
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-blue-400 shadow-md mb-4 object-cover"
            />
            {isEdit && (
              <div className="absolute bottom-3 right-3 bg-blue-500 text-white text-xs px-2 py-1 rounded-md shadow-md">
                Change
              </div>
            )}
          </label>

          {isEdit && (
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setSelectedImage(e.target.files[0])}
            />
          )}

          {isEdit ? (
            <input
              type="text"
              value={userData.name || ''}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="text-xl font-semibold border border-blue-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter name"
            />
          ) : (
            <p className="text-2xl font-semibold text-blue-700">{userData.name}</p>
          )}
        </div>

        <hr className="border-blue-200 mb-6" />

        {/* Contact Info */}
        <div className="mb-6">
          <p className="text-lg font-semibold text-blue-800 mb-2 border-b pb-1 border-blue-300">
            Contact Info
          </p>

          <div className="space-y-3 text-gray-700">
            {/* Email */}
            <div>
              <p className="font-medium text-blue-600">Email</p>
              <p>{userData.email}</p>
            </div>

            {/* Phone */}
            <div>
              <p className="font-medium text-blue-600">Phone</p>
              {isEdit ? (
                <input
                  type="text"
                  value={userData.phno || ''}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, phno: e.target.value }))
                  }
                  className="border border-blue-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              ) : (
                <p>{userData.phno}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <p className="font-medium text-blue-600">Address</p>
              {isEdit ? (
                <>
                  <input
                    type="text"
                    value={userData.Address?.line1 || ''}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        Address: { ...prev.Address, line1: e.target.value },
                      }))
                    }
                    className="block w-full border border-blue-300 rounded-md px-3 py-1 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Address line 1"
                  />
                  <input
                    type="text"
                    value={userData.Address?.line2 || ''}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        Address: { ...prev.Address, line2: e.target.value },
                      }))
                    }
                    className="block w-full border border-blue-300 rounded-md px-3 py-1 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Address line 2"
                  />
                </>
              ) : (
                <div>
                  <p>{userData.Address?.line1}</p>
                  <p>{userData.Address?.line2}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="mb-6">
          <p className="text-lg font-semibold text-blue-800 mb-2 border-b pb-1 border-blue-300">
            Basic Info
          </p>
          <div className="space-y-3 text-gray-700">
            {/* DOB */}
            <div>
              <p className="font-medium text-blue-600">Date of Birth</p>
              {isEdit ? (
                <input
                  type="date"
                  value={userData.dob || ''}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      dob: e.target.value,
                    }))
                  }
                  className="border border-blue-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              ) : (
                <p>{userData.dob}</p>
              )}
            </div>

            {/* Gender */}
            <div>
              <p className="font-medium text-blue-600">Gender</p>
              {isEdit ? (
                <select
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      gender: e.target.value,
                    }))
                  }
                  value={userData.gender || ''}
                  className="border border-blue-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Trans">Trans</option>
                  <option value="NO">Prefer not to say</option>
                </select>
              ) : (
                <p>{userData.gender}</p>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center">
          {isEdit ? (
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md shadow-md transition-transform hover:scale-105"
            >
              SAVE INFORMATION
            </button>
          ) : (
            <button
              type="button"
              onClick={handleEditClick}
              className="border border-blue-500 text-blue-600 px-5 py-2 rounded-md shadow-sm hover:bg-blue-100 transition-transform hover:scale-105"
            >
              EDIT
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Profile;