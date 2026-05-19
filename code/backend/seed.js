import 'dotenv/config';
import sequelize from './config/database.js';
import { User, Doctor } from './models/index.js';
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const seedDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected for seeding...');

    // 1. Clean slate: Truncate existing tables to avoid duplicate key issues or conflicts
    console.log('Clearing existing data from database for a fresh seed...');
    await sequelize.query('TRUNCATE TABLE "Appointments", "Doctors", "Users" RESTART IDENTITY CASCADE;');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('guestpassword123', salt);

    // Helper function to upload local assets to the user's Cloudinary account
    const uploadAsset = async (filename, folder, publicId) => {
      const filePath = path.join(__dirname, '../frontend/src/assets', filename);
      try {
        console.log(`Uploading ${filename} to Cloudinary...`);
        const res = await cloudinary.uploader.upload(filePath, {
          folder,
          public_id: publicId,
          resource_type: 'image'
        });
        return res.secure_url;
      } catch (err) {
        console.warn(`⚠️ Cloudinary upload failed for ${filename}: ${err.message}. Using fallback URL.`);
        // Graceful fallback URL pointing to the user's namespace
        return `https://res.cloudinary.com/${process.env.CLOUDINARY_NAME || 'dzyuyrctv'}/image/upload/v1700000000/Medibook_project/${folder}/${publicId}.png`;
      }
    };

    // 2. Upload avatar and create Guest User
    const guestUserImage = await uploadAsset('profile_pic.png', 'users', 'guest_patient');
    const guestUser = await User.create({
      name: 'Guest Patient',
      email: 'guest@medibook.com',
      password: hashedPassword,
      phno: '1234567890',
      dob: '1995-01-01',
      age: 31,
      gender: 'Male',
      Address: { line1: 'Guest Street', line2: 'Guest City' },
      image: guestUserImage
    });
    console.log('✅ Guest Patient seeded successfully!');

    // 3. Upload avatar and create Guest Doctor
    const guestDocImage = await uploadAsset('doc1.png', 'doctors', 'guest_doctor');
    const guestDoc = await Doctor.create({
      name: 'Dr. Guest Doctor',
      email: 'doctor_guest@medibook.com',
      password: hashedPassword,
      speciality: 'General physician',
      degree: 'MBBS',
      experience: '5 Years',
      fees: 200,
      about: 'This is a guest doctor profile for testing the interviewer login.',
      address: { line1: '123 Health Ave', line2: 'Medical District' },
      phnum: '9876543210',
      image: guestDocImage,
      available: true,
      slots_booked: {}
    });
    console.log('✅ Guest Doctor seeded successfully!');

    // 4. Complete List of 15 Doctors to seed
    const doctorsList = [
      {
        name: 'Dr. Richard James',
        email: 'richard@medibook.com',
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        fees: 500,
        about: 'Dr. James has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        address: { line1: '17th Cross, Richmond', line2: 'Circle, Ring Road, London' },
        phnum: '1111111111',
        assetFile: 'doc1.png',
        publicId: 'doc1'
      },
      {
        name: 'Dr. Emily Larson',
        email: 'emily@medibook.com',
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        fees: 600,
        about: 'Dr. Larson is specialized in women health and gynecological care, offering comprehensive support, maternity planning, and state-of-the-art diagnostic services.',
        address: { line1: '27th Cross, Richmond', line2: 'Circle, Ring Road, London' },
        phnum: '2222222222',
        assetFile: 'doc2.png',
        publicId: 'doc2'
      },
      {
        name: 'Dr. Sarah Patel',
        email: 'sarah@medibook.com',
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Year',
        fees: 300,
        about: 'Dr. Patel focuses on clinical and cosmetic dermatology, providing personalized treatments for skin conditions, allergy management, and facial aesthetics.',
        address: { line1: '37th Cross, Richmond', line2: 'Circle, Ring Road, London' },
        phnum: '3333333333',
        assetFile: 'doc3.png',
        publicId: 'doc3'
      },
      {
        name: 'Dr. Christopher Lee',
        email: 'christopher@medibook.com',
        speciality: 'Pediatricians',
        degree: 'MBBS',
        experience: '2 Years',
        fees: 400,
        about: 'Dr. Lee offers comprehensive healthcare for infants, children, and adolescents, specialized in developmental checkups and preventative health guidance.',
        address: { line1: '47th Cross, Richmond', line2: 'Circle, Ring Road, London' },
        phnum: '4444444444',
        assetFile: 'doc4.png',
        publicId: 'doc4'
      },
      {
        name: 'Dr. Jennifer Garcia',
        email: 'jennifer@medibook.com',
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        fees: 500,
        about: 'Dr. Garcia is specialized in treating complex neurological conditions, brain health, cognitive disorders, and neuropathy management.',
        address: { line1: '57th Cross, Richmond', line2: 'Circle, Ring Road, London' },
        phnum: '5555555555',
        assetFile: 'doc5.png',
        publicId: 'doc5'
      },
      {
        name: 'Dr. Andrew Williams',
        email: 'andrew@medibook.com',
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        fees: 500,
        about: 'Dr. Williams is dedicated to neuro-diagnostics and neuromuscular rehabilitation, providing premium care with state-of-the-art therapeutics.',
        address: { line1: '57th Cross, Richmond', line2: 'Circle, Ring Road, London' },
        phnum: '6666666666',
        assetFile: 'doc6.png',
        publicId: 'doc6'
      },
      {
        name: 'Dr. Christopher Davis',
        email: 'davis@medibook.com',
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        fees: 500,
        about: 'Dr. Davis has an extensive background in family medicine, wellness consultations, and general medical care for all age groups.',
        address: { line1: '17th Cross, Richmond', line2: 'Circle, Ring Road, London' },
        phnum: '7777777777',
        assetFile: 'doc7.png',
        publicId: 'doc7'
      },
      {
        name: 'Dr. Timothy White',
        email: 'timothy@medibook.com',
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        fees: 600,
        about: 'Dr. White is passionate about prenatal care and reproductive health, bringing over three years of dedicated surgical and clinical experience.',
        address: { line1: '27th Cross, Richmond', line2: 'Circle, Ring Road, London' },
        phnum: '8888888888',
        assetFile: 'doc8.png',
        publicId: 'doc8'
      },
      {
        name: 'Dr. Ava Mitchell',
        email: 'ava@medibook.com',
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Year',
        fees: 300,
        about: 'Dr. Mitchell is an expert in modern skincare, acne treatment, and dermatology therapeutics designed to restore long-term skin health.',
        address: { line1: '37th Cross, Richmond', line2: 'Circle, Ring Road, London' },
        phnum: '9999999999',
        assetFile: 'doc9.png',
        publicId: 'doc9'
      },
      {
        name: 'Dr. Jeffrey King',
        email: 'jeffrey@medibook.com',
        speciality: 'Pediatricians',
        degree: 'MBBS',
        experience: '2 Years',
        fees: 400,
        about: 'Dr. King specializes in pediatric wellness, early childhood development, vaccines, and adolescent healthcare management.',
        address: { line1: '47th Cross, Richmond', line2: 'Circle, Ring Road, London' },
        phnum: '1010101010',
        assetFile: 'doc10.png',
        publicId: 'doc10'
      },
      {
        name: 'Dr. Zoe Kelly',
        email: 'zoe@medibook.com',
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        fees: 500,
        about: 'Dr. Kelly is a clinical researcher and specialist in central nervous system disorders, migraines, and cognitive therapies.',
        address: { line1: '57th Cross, Richmond', line2: 'Circle, Ring Road, London' },
        phnum: '1212121212',
        assetFile: 'doc11.png',
        publicId: 'doc11'
      },
      {
        name: 'Dr. Patrick Harris',
        email: 'patrick@medibook.com',
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        fees: 500,
        about: 'Dr. Harris provides state-of-the-art intervention and therapeutic guidance for sleep disorders, nerve injuries, and headache syndromes.',
        address: { line1: '57th Cross, Richmond', line2: 'Circle, Ring Road, London' },
        phnum: '1313131313',
        assetFile: 'doc12.png',
        publicId: 'doc12'
      },
      {
        name: 'Dr. Chloe Evans',
        email: 'chloe@medibook.com',
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        fees: 500,
        about: 'Dr. Evans focuses on family practice and continuous care plans, specialized in diabetic care and hypertension management.',
        address: { line1: '17th Cross, Richmond', line2: 'Circle, Ring Road, London' },
        phnum: '1414141414',
        assetFile: 'doc13.png',
        publicId: 'doc13'
      },
      {
        name: 'Dr. Ryan Martinez',
        email: 'ryan@medibook.com',
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        fees: 600,
        about: 'Dr. Martinez specializes in complex maternal care, laparoscopy, and preventative reproductive screenings.',
        address: { line1: '27th Cross, Richmond', line2: 'Circle, Ring Road, London' },
        phnum: '1515151515',
        assetFile: 'doc14.png',
        publicId: 'doc14'
      },
      {
        name: 'Dr. Amelia Hill',
        email: 'amelia@medibook.com',
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Year',
        fees: 300,
        about: 'Dr. Hill specializes in treating chronic skin conditions, sun damage restoration, and advanced laser dermatological procedures.',
        address: { line1: '37th Cross, Richmond', line2: 'Circle, Ring Road, London' },
        phnum: '1616161616',
        assetFile: 'doc15.png',
        publicId: 'doc15'
      }
    ];

    // 5. Seed the 15 Doctors with real-time Cloudinary asset uploading
    console.log('Seeding doctors database...');
    for (const docData of doctorsList) {
      const imageUrl = await uploadAsset(docData.assetFile, 'doctors', docData.publicId);
      
      await Doctor.create({
        name: docData.name,
        email: docData.email,
        password: hashedPassword,
        speciality: docData.speciality,
        degree: docData.degree,
        experience: docData.experience,
        fees: docData.fees,
        about: docData.about,
        address: docData.address,
        phnum: docData.phnum,
        image: imageUrl,
        available: true,
        slots_booked: {}
      });
      console.log(`✅ Seeded Doctor: ${docData.name} (${docData.speciality})`);
    }

    console.log('🎉 Database seeding completed successfully with all 15 doctors and custom Cloudinary assets!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
