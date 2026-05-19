import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logincard from '../components/logincard';
import Signupcard from '../components/signupcard';
import { useContext } from 'react';
import { AppContext } from '../context/appcontext';
import { ToastContainer, toast } from 'react-toastify';
import { registerUserApi, loginUserApi } from '../api/api';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [state, setState] = useState("Login");
  const [age, setAge] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token, setToken } = useContext(AppContext);

  const handlesubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (state === "Signup") {
        const userdata = { name, email, password, age, dob, phone, gender };
        const data = await registerUserApi(userdata);
        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
          toast.success("Signed up successfully!");
        } else {
          toast.error(data.message);
        }
      } else {
        const data = await loginUserApi(email, password);
        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
          toast.success("Signed in successfully!");
        } else {
          toast.error(data.message);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    setEmail('guest@medibook.com');
    setPassword('guestpassword123');
    toast.info("Guest credentials loaded! Click 'Sign In' to log in.");
  };

  const toggler = () => {
    if (state === "Login") setState("Signup");
    else setState("Login");
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  return (
    state === "Login" ? (
      <Logincard
        toggler={toggler}
        email={email}
        setemail={setEmail}
        password={password}
        setpassword={setPassword}
        handlesubmit={handlesubmit}
        handleGuestLogin={handleGuestLogin}
        loading={loading}
      />
    ) : (
      <Signupcard
        toggler={toggler}
        name={name}
        setname={setName}
        email={email}
        setemail={setEmail}
        password={password}
        setpassword={setPassword}
        age={age}
        setage={setAge}
        dob={dob}
        setdob={setDob}
        phone={phone}
        setphone={setPhone}
        gender={gender}
        setgender={setGender}
        handlesubmit={handlesubmit}
        loading={loading}
      />
    )
  );
};

export default Login;
