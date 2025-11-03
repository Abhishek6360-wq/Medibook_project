import React, { useContext, useEffect, useState } from "react";
import { Doctorcontext } from "../../context/doctorcontext";


const DoctorProfile = () => {
  const { Profiledata, getdocprofile, updatedocprofile } = useContext(Doctorcontext);

  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState({});
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    getdocprofile();
  }, []);

  useEffect(() => {
    if (Profiledata) {
      setForm(Profiledata);
      setPreview(Profiledata.image);
    }
  }, [Profiledata]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const img = e.target.files[0];
    if (img) {
      setFile(img);
      setPreview(URL.createObjectURL(img));
    }
  };

  const handleEditToggle = (e) => {
    e.preventDefault();
    setIsEdit((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (key === "address") formData.append("address", JSON.stringify(form[key]));
      else formData.append(key, form[key]);
    });
    if (file) formData.append("image", file);
    await updatedocprofile(formData);
    setIsEdit(false);
    setFile(null);
  };

  if (!form.name)
    return (
      <div className="flex items-center justify-center h-screen text-blue-600 text-lg font-semibold">
        Loading Profile...
      </div>
    );

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-blue-200 py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-3xl border border-blue-200"
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6 relative">
          <label htmlFor="imageUpload" className="cursor-pointer relative">
            <img
              src={preview || "/placeholder.jpg"}
              alt="Doctor"
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
              onChange={handleFileChange}
            />
          )}

          {isEdit ? (
            <input
              name="name"
              value={form.name || ""}
              onChange={handleChange}
              className="text-xl font-semibold border border-blue-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          ) : (
            <p className="text-2xl font-semibold text-blue-700">{form.name}</p>
          )}
          <p className="text-gray-500">{form.speciality}</p>
        </div>

        <hr className="border-blue-200 mb-6" />

        {/* Contact Info */}
        <section className="mb-6">
          <p className="text-lg font-semibold text-blue-800 mb-2 border-b pb-1 border-blue-300">
            Contact Info
          </p>

          <div className="space-y-3 text-gray-700">
            <div>
              <p className="font-medium text-blue-600">Email</p>
              <p>{form.email}</p>
            </div>

            <div>
              <p className="font-medium text-blue-600">Phone</p>
              {isEdit ? (
                <input
                  name="phnum"
                  value={form.phnum || ""}
                  onChange={handleChange}
                  className="border border-blue-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-blue-400 w-full"
                />
              ) : (
                <p>{form.phnum}</p>
              )}
            </div>

            <div>
              <p className="font-medium text-blue-600">Fees</p>
              {isEdit ? (
                <input
                  name="fees"
                  type="number"
                  value={form.fees || ""}
                  onChange={handleChange}
                  className="border border-blue-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-blue-400 w-full"
                />
              ) : (
                <p>₹{form.fees}</p>
              )}
            </div>
          </div>
        </section>

        {/* Professional Info */}
        <section className="mb-6">
          <p className="text-lg font-semibold text-blue-800 mb-2 border-b pb-1 border-blue-300">
            Professional Details
          </p>
          <div className="space-y-3 text-gray-700">
            <div>
              <p className="font-medium text-blue-600">Degree</p>
              {isEdit ? (
                <input
                  name="degree"
                  value={form.degree || ""}
                  onChange={handleChange}
                  className="border border-blue-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-blue-400 w-full"
                />
              ) : (
                <p>{form.degree}</p>
              )}
            </div>

            <div>
              <p className="font-medium text-blue-600">Experience</p>
              {isEdit ? (
                <input
                  name="experience"
                  value={form.experience || ""}
                  onChange={handleChange}
                  className="border border-blue-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-blue-400 w-full"
                />
              ) : (
                <p>{form.experience}</p>
              )}
            </div>

            <div>
              <p className="font-medium text-blue-600">About</p>
              {isEdit ? (
                <textarea
                  name="about"
                  value={form.about || ""}
                  onChange={handleChange}
                  rows="3"
                  className="w-full border border-blue-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-blue-400"
                />
              ) : (
                <p className="whitespace-pre-wrap">{form.about}</p>
              )}
            </div>
          </div>
        </section>

        {/* Buttons */}
        <div className="flex justify-center">
          {isEdit ? (
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md shadow-md transition-transform hover:scale-105"
            >
              SAVE CHANGES
            </button>
          ) : (
            <button
              onClick={handleEditToggle}
              className="border border-blue-500 text-blue-600 px-6 py-2 rounded-md shadow-md hover:bg-blue-50 transition-transform hover:scale-105"
            >
              EDIT PROFILE
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default DoctorProfile;