import express from 'express'
import { registeruser, userlogin,getprofile, updateprofile, bookappointment, listappointments, cancelappointment, payment, verifypayment } from '../controllers/usercontroller.js'
import authuser from '../middlewares/authuser.js';
import upload from '../middlewares/multer.js';

const userrouter=express.Router();

userrouter.post('/register',registeruser);
userrouter.post('/login',userlogin);
userrouter.get('/user-data',authuser,getprofile);
userrouter.post('/user-update-profile',upload.single('image'),authuser,updateprofile);
userrouter.post('/user-appointment',authuser,bookappointment);
userrouter.get('/user-appointment-list',authuser,listappointments);
userrouter.post('/cancel-appointment',authuser,cancelappointment);
userrouter.post('/payment',authuser,payment);
userrouter.post('/verify-payment',authuser,verifypayment);

export default userrouter