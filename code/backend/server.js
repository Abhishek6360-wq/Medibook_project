import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectdb from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminrouter from './routes/adminroute.js';
import docrouter from './routes/doctorroute.js';
import userrouter from './routes/userrooutes.js';
const app=express();
const port=process.env.PORT || 4000;

connectdb();
connectCloudinary();

// middlware to parse any request into json
app.use(express.json());
// midleware to connect backend with frontend 
app.use(cors());

// api endpoints

// this will go the following route localhost:port/api/admin/add-doctor and execute add doctor function 
app.use('/api/admin',adminrouter);
app.use('/api/doctor',docrouter);
app.use('/api/user',userrouter);

app.get('/',(req,res)=>{
    res.send("API is working nice");
})

app.listen(port,()=>{
    console.log("server started");
})
