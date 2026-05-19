// AdminLogin.jsx
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Admincontext } from "../context/admincontext";
import axios from "axios";
import { toast } from "react-toastify";
import { Doctorcontext } from "../context/doctorcontext";

const AdminLogin = () => {
  const [state, setState] = useState("Admin"); // "Admin" or "Doctor"
  const { setAtoken, backendurl } = useContext(Admincontext);
  const { setDtoken, dtoken } = useContext(Doctorcontext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (state === "Admin") {
        const url = backendurl + "/api/admin/login";
        const { data } = await axios.post(url, { email, password });
        if (data.success) {
          localStorage.setItem("atoken", data.token);
          localStorage.removeItem("dtoken");
          setAtoken(data.token);
          setDtoken("");
          toast.success("Login successful!");
          navigate("/dashboard");
        } else {
          toast.error(data.message || "Login failed");
        }
      } else {
        const { data } = await axios.post(backendurl + '/api/doctor/login', { email, password });
        if (data.success) {
          localStorage.setItem("dtoken", data.token);
          localStorage.removeItem("atoken");
          setDtoken(data.token);
          setAtoken("");
          toast.success("Login successful!");
          navigate("/docdashboard");
        } 
      }
    } catch (err) {
      console.error("Axios error:", err.message);
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    if (state === "Admin") {
      setEmail("at8984316@gmail.com");
      setPassword("This#ismy2025app");
      toast.info("Guest Admin credentials loaded! Click 'Login' to log in.");
    } else {
      setEmail("doctor_guest@medibook.com");
      setPassword("guestpassword123");
      toast.info("Guest Doctor credentials loaded! Click 'Login' to log in.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50">
      <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">
          {state === "Admin" ? "Admin Login" : "Doctor Login"}
        </h2>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-semibold text-blue-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              disabled={loading}
              className="w-full px-4 py-2 text-sm border rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
                         border-gray-300 disabled:opacity-50"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-semibold text-blue-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              disabled={loading}
              className="w-full px-4 py-2 text-sm border rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
                         border-gray-300 disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 font-semibold text-white 
                       bg-blue-600 rounded-lg hover:bg-blue-700 
                       transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={handleGuestLogin}
            className="w-full py-2 font-semibold text-blue-600 border border-blue-600 
                       bg-white rounded-lg hover:bg-blue-50 
                       transition-colors cursor-pointer disabled:opacity-50 mt-2"
          >
            {state === "Admin" ? "Sign In as Guest Admin" : "Sign In as Guest Doctor"}
          </button>
        </form>

        {/* Guest Credentials Helper Card */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100 text-xs text-left">
          <p className="font-bold text-blue-700 mb-1">💡 Guest {state} Login:</p>
          <p className="text-gray-600"><span className="font-semibold">Email:</span> {state === "Admin" ? "at8984316@gmail.com" : "doctor_guest@medibook.com"}</p>
          <p className="text-gray-600"><span className="font-semibold">Password:</span> {state === "Admin" ? "This#ismy2025app" : "guestpassword123"}</p>
          <p className="text-gray-500 mt-2 italic">Tip: Click the Guest button to auto-fill, then click "Login"!</p>
        </div>

        {/* Toggle Admin/Doctor */}
        {state === "Admin" ? (
          <p className="mt-4 text-sm text-gray-600 text-center">
            Doctor's Login{" "}
            <span
              onClick={() => setState("Doctor")}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              Click here
            </span>
          </p>
        ) : (
          <p className="mt-4 text-sm text-gray-600 text-center">
            Admin Login{" "}
            <span
              onClick={() => setState("Admin")}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
