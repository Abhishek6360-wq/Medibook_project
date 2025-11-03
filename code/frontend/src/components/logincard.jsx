import React from 'react'

const Logincard = ({toggler,email,password,setpassword,setemail,handlesubmit}) => {
  return (
     <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 md:p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400 mb-6">
          MediBook Login
        </h2>

        <form  onSubmit={handlesubmit} className="space-y-5">
           {/* email  */}
          <div>
            <label
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
            Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e)=>setemail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
          </div>

          {/* Password */}
          <div>
            <label
            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e)=>setpassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            
            className="w-full py-3 mt-2 text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition duration-300"
          >
            Sign In
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-6">
          Don’t have an account?{' '}
          <button
            onClick={toggler}
            className="text-blue-600 font-semibold hover:underline cursor-pointer dark:text-blue-400"
          >
            Sign up
          </button>
        </p>
      </div>
    </section>
  )
}

export default Logincard