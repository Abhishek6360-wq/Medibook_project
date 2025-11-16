import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Layout from "./components/layout"; 

// Code splitting - lazy load pages for better performance
const Home = lazy(() => import("./pages/home"));
const About = lazy(() => import("./pages/about"));
const Contacts = lazy(() => import("./pages/contacts"));
const Doctors = lazy(() => import("./pages/doctors"));
const Login = lazy(() => import("./pages/login"));
const Myappointments = lazy(() => import("./pages/myappointments"));
const Profile = lazy(() => import("./pages/profile"));
const Appointments = lazy(() => import("./pages/appointments"));

// Loading component for Suspense
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className="text-gray-600 text-lg">Loading...</p>
    </div>
  </div>
);

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { 
          index: true, 
          element: (
            <Suspense fallback={<PageLoader />}>
              <Home />
            </Suspense>
          )
        }, 
        { 
          path: "about", 
          element: (
            <Suspense fallback={<PageLoader />}>
              <About />
            </Suspense>
          )
        },
        { 
          path: "contacts", 
          element: (
            <Suspense fallback={<PageLoader />}>
              <Contacts />
            </Suspense>
          )
        },
        { 
          path: "doctors/:speciality", 
          element: (
            <Suspense fallback={<PageLoader />}>
              <Doctors />
            </Suspense>
          )
        },
        { 
          path: "login", 
          element: (
            <Suspense fallback={<PageLoader />}>
              <Login />
            </Suspense>
          )
        },
        { 
          path: "profile", 
          element: (
            <Suspense fallback={<PageLoader />}>
              <Profile />
            </Suspense>
          )
        },
        { 
          path: "myappointments", 
          element: (
            <Suspense fallback={<PageLoader />}>
              <Myappointments />
            </Suspense>
          )
        },
        { 
          path: "appointments/:docid", 
          element: (
            <Suspense fallback={<PageLoader />}>
              <Appointments />
            </Suspense>
          )
        }
      ]
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;
