import express from 'express'
import {cancelappointment, completecheck, docappointments, doclogin, doctorlist, getdocdata, updatedocprofile} from '../controllers/doctorcontroller.js'
import authdoc from '../middlewares/authdoc.js';
import upload from '../middlewares/multer.js';

const docrouter=express.Router();

docrouter.get('/list',doctorlist);
docrouter.post('/login',doclogin);
docrouter.get('/doc-appointments',authdoc,docappointments);
docrouter.post('/cancel-appointment',authdoc,cancelappointment);
docrouter.post('/complete-appointment',authdoc,completecheck);
docrouter.get('/profile',authdoc,getdocdata);
docrouter.post("/update-profile",upload.single("image"),authdoc, updatedocprofile);


export default docrouter;