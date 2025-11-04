import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from "./pages/home";
import About from "./pages/about";
import Contacts from "./pages/contacts";
import Doctors from "./pages/doctors";
import Login from "./pages/login";
import Myappointments from "./pages/myappointments";
import Profile from "./pages/profile";
import Appointments from "./pages/appointments";
import Layout from "./components/layout"; 
// test frontend auto deploy
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> }, 
        { path: "about", element: <About /> },
        { path: "contacts", element: <Contacts /> },
        { path: "doctors/:speciality", element: <Doctors /> },
        { path: "login", element: <Login /> },
        { path: "profile", element: <Profile /> },
        { path: "myappointments", element: <Myappointments /> },
        { path: "appointments/:docid", element: <Appointments /> }
      ]
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;
