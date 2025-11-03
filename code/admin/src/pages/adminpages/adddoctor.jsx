import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { Admincontext } from "../../context/admincontext";
import { toast } from "react-toastify";
import axios from "axios";

const Adddoctor = () => {
  const [img, setImg] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("1 year");
  const [fees, setFees] = useState("");
  const [speciality, setSpeciality] = useState("General physician");
  const [degree, setDegree] = useState("");
  const [about, setAbout] = useState("");
  const [phnum, setPhnum] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");

  const { backendurl, atoken } = useContext(Admincontext);

  const submithandler = async (e) => {
    e.preventDefault();

    try {
      if (!img) {
        return toast.error("Image not selected");
      }
      // console.log("atoken in Adddoctor:", atoken);

      const formData = new FormData();
      formData.append("image", img);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("phnum", phnum);
      formData.append("speciality", speciality);
      formData.append("about", about);
      formData.append("fees", Number(fees));
      formData.append("experience", experience);
      formData.append("degree", degree);
      formData.append(
        "address",
        JSON.stringify({ line1: address1, line2: address2 })
      );

      const { data } = await axios.post(
        backendurl + "/api/admin/add-doctor",
        formData,
        { headers: { admintoken: atoken } }
      );

      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      onSubmit={submithandler}
      className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-200 flex flex-col gap-6"
    >
      {/* Upload Image */}
      <div className="flex flex-col items-center gap-3">
        <label className="cursor-pointer">
          <img
            src={img ? URL.createObjectURL(img) : assets.upload_area}
            alt="Upload"
            className="h-24 w-24 object-cover rounded-full border border-gray-300 hover:opacity-80 transition"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImg(e.target.files[0])}
            className="hidden"
          />
        </label>
        <p className="text-gray-600 text-sm">Upload doctor picture</p>
      </div>

      {/* Grid Form */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="block mb-1 text-gray-600 font-medium">
              Your name
            </label>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600 font-medium">
              Your Email
            </label>
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600 font-medium">
              Your Password
            </label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600 font-medium">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="Enter phone number"
              value={phnum}
              onChange={(e) => setPhnum(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600 font-medium">
              Experience
            </label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              {Array.from({ length: 20 }, (_, i) => (
                <option key={i + 1} value={`${i + 1} years`}>
                  {i + 1} years
                </option>
              ))}
              <option value="20+ years">20+ years</option>
              <option value="25+ years">25+ years</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-gray-600 font-medium">Fees</label>
            <input
              type="number"
              placeholder="Your fees"
              value={fees}
              onChange={(e) => setFees(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="block mb-1 text-gray-600 font-medium">
              Speciality
            </label>
            <select
              value={speciality}
              onChange={(e) => setSpeciality(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="General physician">General physician</option>
              <option value="Gynecologist">Gynecologist</option>
              <option value="Dermatologist">Dermatologist</option>
              <option value="Pediatricians">Pediatricians</option>
              <option value="Neurologist">Neurologist</option>
              <option value="Gastroenterologist">Gastroenterologist</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-gray-600 font-medium">
              Education
            </label>
            <input
              type="text"
              placeholder="Education"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600 font-medium">
              Address
            </label>
            <input
              type="text"
              placeholder="Address 1"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Address 2"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* About */}
      <div>
        <label className="block mb-1 text-gray-600 font-medium">About me</label>
        <textarea
          rows={4}
          placeholder="Write about yourself"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
        ></textarea>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="self-start bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-sm"
      >
        Add Doctor
      </button>
    </form>
  );
};

export default Adddoctor;
