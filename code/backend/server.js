import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { connectDB } from './config/database.js';
import connectCloudinary from './config/cloudinary.js';
import adminrouter from './routes/adminroute.js';
import docrouter from './routes/doctorroute.js';
import userrouter from './routes/userrooutes.js';
const app=express();
const port=process.env.PORT || 4000;

await connectDB();
connectCloudinary();

// CORS FIX - Function-based origin handler for Render and Local compatibility
const allowedOrigins = [
  'https://medibook-frontend-oo5c.onrender.com',  // Frontend URL
  'https://medibook-admin-7jp7.onrender.com',     // Admin frontend URL
  'http://localhost:5173',                         // Local Patient Frontend
  'http://localhost:5174',                         // Local Admin Panel
  'http://localhost:5175',                         // Fallback Vite port
  'http://localhost:3000'                          // Traditional fallback
];

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl, same-origin)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.log(`CORS blocked origin: ${origin}`);
      return callback(new Error(`Not allowed by CORS: ${origin}`), false);
    }
  },
  credentials: true,  // Allow cookies/auth headers if needed
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: ['Content-Type', 'Authorization', 'admintoken', 'doctortoken', 'usertoken']
};

// MUST COME FIRST - CORS handles preflight (OPTIONS) before JSON parsing
app.use(cors(corsOptions));
// middlware to parse any request into json
app.use(express.json());

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
