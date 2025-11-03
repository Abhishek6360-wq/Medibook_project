import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logincard from '../components/logincard';
import Signupcard from '../components/signupcard';
import { useContext } from 'react';
import { AppContext } from '../context/appcontext';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios'


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [state, setState] = useState("Login");
  const [age, setAge] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const navigate = useNavigate();
  const {token,setToken,backendurl}=useContext(AppContext);

  const handlesubmit = async (event) => {
    event.preventDefault();
    try{
      if(state==="Signup"){
        
        const userdata={
          name,email,password,age,dob,phone,gender
        }
        console.log("Backend URL:", backendurl);
        const {data}=await axios.post(backendurl+'/api/user/register',userdata);
        if(data.success){
          console.log("user registeration succesfull")
          localStorage.setItem('token',data.token)
          setToken(data.token);
        }else{
          console.log(data.message)
          toast.error(data.message);
        }
      }else{
        const {data}=await axios.post(backendurl+'/api/user/login',{email,password});
        if(data.success){
          localStorage.setItem('token',data.token)
          setToken(data.token);
        }else{
          toast.error(data.message);
        }        
      }
    }catch(err){
      toast.error(err.message);
    }
  };

  const toggler = () => {
    if (state === "Login") setState("Signup");
    else setState("Login");
  };
  

  useEffect(()=>{
    if(token){
      navigate('/')
    }},[token])
    
  return (
    state === "Login" ? (
      <Logincard
        toggler={toggler}
        email={email}
        setemail={setEmail}
        password={password}
        setpassword={setPassword}
        handlesubmit={handlesubmit}
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
      />
    )
  );
};

export default Login;
