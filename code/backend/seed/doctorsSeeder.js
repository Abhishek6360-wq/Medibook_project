import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcrypt";
import fs from "fs";
import docmodel from "../models/docmodel.js";

// ✅ Ensure .env is loaded correctly from backend directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Find .env in the backend directory (one level above "seed")
const envPath = path.resolve(__dirname, "../.env");
dotenv.config({ path: envPath });

// Debug line — see what’s actually loaded
console.log("✅ .env file loaded from:", envPath);
console.log("🔍 MONGODB_URI:", process.env.MONGODB_URI);

// ✅ Cloudinary config (matches your variable names)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});


// ================= IMAGE DIRECTORY =================
const imagesFolder = path.resolve("uploads");

// ================= DOCTOR INFO TEMPLATE =================
const doctorsInfo = [
  { name: "Dr. Richard James", speciality: "General physician", degree: "MBBS", experience: "4 Years", fees: 500, address: { line1: "17th Cross, Richmond", line2: "Circle, Ring Road, London" } },
  { name: "Dr. Emily Larson", speciality: "Gynecologist", degree: "MBBS", experience: "3 Years", fees: 60, address: { line1: "27th Cross, Richmond", line2: "Circle, Ring Road, London" } },
  { name: "Dr. Sarah Patel", speciality: "Dermatologist", degree: "MBBS", experience: "1 Years", fees: 30, address: { line1: "37th Cross, Richmond", line2: "Circle, Ring Road, London" } },
  { name: "Dr. Christopher Lee", speciality: "Pediatricians", degree: "MBBS", experience: "2 Years", fees: 40, address: { line1: "47th Cross, Richmond", line2: "Circle, Ring Road, London" } },
  { name: "Dr. Jennifer Garcia", speciality: "Neurologist", degree: "MBBS", experience: "4 Years", fees: 50, address: { line1: "57th Cross, Richmond", line2: "Circle, Ring Road, London" } },
  { name: "Dr. Andrew Williams", speciality: "Neurologist", degree: "MBBS", experience: "4 Years", fees: 50, address: { line1: "57th Cross, Richmond", line2: "Circle, Ring Road, London" } },
  { name: "Dr. Christopher Davis", speciality: "General physician", degree: "MBBS", experience: "4 Years", fees: 50, address: { line1: "17th Cross, Richmond", line2: "Circle, Ring Road, London" } },
  { name: "Dr. Timothy White", speciality: "Gynecologist", degree: "MBBS", experience: "3 Years", fees: 60, address: { line1: "27th Cross, Richmond", line2: "Circle, Ring Road, London" } },
  { name: "Dr. Ava Mitchell", speciality: "Dermatologist", degree: "MBBS", experience: "1 Years", fees: 30, address: { line1: "37th Cross, Richmond", line2: "Circle, Ring Road, London" } },
  { name: "Dr. Jeffrey King", speciality: "Pediatricians", degree: "MBBS", experience: "2 Years", fees: 40, address: { line1: "47th Cross, Richmond", line2: "Circle, Ring Road, London" } },
  { name: "Dr. Zoe Kelly", speciality: "Neurologist", degree: "MBBS", experience: "4 Years", fees: 50, address: { line1: "57th Cross, Richmond", line2: "Circle, Ring Road, London" } },
  { name: "Dr. Patrick Harris", speciality: "Neurologist", degree: "MBBS", experience: "4 Years", fees: 50, address: { line1: "57th Cross, Richmond", line2: "Circle, Ring Road, London" } },
  { name: "Dr. Chloe Evans", speciality: "General physician", degree: "MBBS", experience: "4 Years", fees: 50, address: { line1: "17th Cross, Richmond", line2: "Circle, Ring Road, London" } },
  { name: "Dr. Ryan Martinez", speciality: "Gynecologist", degree: "MBBS", experience: "3 Years", fees: 60, address: { line1: "27th Cross, Richmond", line2: "Circle, Ring Road, London" } },
  { name: "Dr. Amelia Hill", speciality: "Dermatologist", degree: "MBBS", experience: "1 Years", fees: 30, address: { line1: "37th Cross, Richmond", line2: "Circle, Ring Road, London" } },
];

const aboutText =
  "Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.";

// ================= UPLOAD FUNCTION =================
const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "image",
      folder: "doctors",
    });
    return result.secure_url;
  } catch (err) {
    console.error("❌ Cloudinary upload failed:", err.message);
    return null;
  }
};

// ================= MAIN SEED FUNCTION =================
const seedDoctors = async () => {
  try {
    // connect using your MONGODB_URI
    await mongoose.connect(`${process.env.MONGODB_URI}/Medibook`);

    console.log("✅ MongoDB connected");

    await docmodel.deleteMany();
    console.log("🧹 Old doctors cleared");

    const files = fs.readdirSync(imagesFolder).filter((f) => f.endsWith(".png"));
    const finalDoctors = [];

    for (let i = 0; i < files.length; i++) {
      const imagePath = path.join(imagesFolder, files[i]);
      const cloudUrl = await uploadToCloudinary(imagePath);
      if (!cloudUrl) continue;

      const info = doctorsInfo[i];
      const hashedPassword = await bcrypt.hash("12345678", 10);

      finalDoctors.push({
        name: info.name,
        email: `${info.name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
        password: hashedPassword,
        speciality: info.speciality,
        degree: info.degree,
        experience: info.experience,
        about: aboutText,
        fees: info.fees,
        phnum: `98765${10000 + i}`,
        address: info.address,
        image: cloudUrl,
        available: true,
        date: Date.now(),
      });

      console.log(`✅ Uploaded ${info.name} (${files[i]})`);
    }

    await docmodel.insertMany(finalDoctors);
    console.log(`🎉 ${finalDoctors.length} doctors seeded successfully!`);
    process.exit();
  } catch (err) {
    console.error("❌ Error during seeding:", err.message);
    process.exit(1);
  }
};

seedDoctors();
