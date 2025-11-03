import React from 'react';

const Signupcard = ({
  toggler,
  name, setname,
  email, setemail,
  password, setpassword,
  age, setage,
  dob, setdob,
  phone, setphone,
  gender, setgender,handlesubmit
}) => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 md:p-10 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400 mb-6">
          Create MediBook Account
        </h2>

        <form onSubmit={handlesubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setname(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 
                        focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 
                        focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
          </div>

          {/* Age */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Age
            </label>
            <input
              type="number"
              id="age"
              placeholder="Enter your age"
              value={age}
              onChange={(e) => setage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 
                        focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Date of Birth
            </label>
            <input
              type="date"
              id="dob"
              value={dob}
              onChange={(e) => setdob(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 
                        focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              placeholder="+91 9876543210"
              value={phone}
              onChange={(e) => setphone(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 
                        focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Gender
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setgender(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 
                        focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 
                        focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            
            className="w-full py-3 mt-2 text-white font-semibold bg-blue-600 hover:bg-blue-700 
                      rounded-lg shadow-md transition duration-300"
          >
            Create Account
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-6">
          Already have an account?{' '}
          <button
            onClick={toggler}
            className="text-blue-600 font-semibold hover:underline cursor-pointer dark:text-blue-400"
          >
            Log in
          </button>
        </p>
      </div>
    </section>
  );
};

export default Signupcard;
