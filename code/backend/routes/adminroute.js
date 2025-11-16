import express from 'express'
import { addDoctor, appointmentsadmin, cancelanyappointment, getdashboarddata, listofalldoctors, loginadmin, contactForm, deleteDoctor, allPatients } from '../controllers/admincontroller.js'
import upload from '../middlewares/multer.js'
import authadmin from '../middlewares/authadmin.js'
import {changeavailabillity} from '../controllers/doctorcontroller.js'
import authuser from '../middlewares/authuser.js'




const adminrouter=express.Router()

adminrouter.post('/add-doctor',upload.single('image'),authadmin,addDoctor)
adminrouter.post('/login',loginadmin)
adminrouter.post('/all-doctors',authadmin,listofalldoctors);
adminrouter.post('/change-availabillity',authadmin,changeavailabillity);
adminrouter.get('/allapointments',authadmin,appointmentsadmin);
adminrouter.post('/cancelanyappointment',authadmin,cancelanyappointment);
adminrouter.get('/dashboard-data',authadmin,getdashboarddata);
adminrouter.post("/contact",authuser,contactForm);
adminrouter.delete('/delete-doctor',authadmin,deleteDoctor);
adminrouter.get('/all-patients',authadmin,allPatients);


export default adminrouter;