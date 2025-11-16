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

// CORS configuration - explicitly allow your frontend origins
const corsOptions = {
  origin: [
    'https://medibook-frontend-oo5c.onrender.com',  // Frontend URL
    'http://localhost:5173',  // Local development frontend
    'http://localhost:5174',  // Local development admin (if different port)
    'http://localhost:3000'   // Alternative local port
  ],
  credentials: true,  // Allow cookies/auth headers if needed
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'admintoken', 'doctortoken', 'usertoken']
};

// middlware to parse any request into json
app.use(express.json());
// midleware to connect backend with frontend 
app.use(cors(corsOptions));

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
