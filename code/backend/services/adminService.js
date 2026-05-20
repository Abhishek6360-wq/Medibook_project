import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { v2 as cloudinary } from 'cloudinary';
import { User, Doctor, Appointment } from '../models/index.js';
import 'dotenv/config';

export const addDoctor = async (data, imageUrl) => {
  const { name, email, password, speciality, degree, experience, fees, about, address, phnum } = data;

  if (!name || !email || !password || !speciality || !degree || !experience || !fees || !about || !address || !phnum) {
    throw new Error("missing data in field");
  }

  if (!validator.isEmail(email)) {
    throw new Error("invalid email");
  }

  if (password.length < 8 || password.length > 16) {
    throw new Error("password must have atleast 8 and not more than 16 character");
  }

  if (!validator.isMobilePhone(phnum, 'any', { strictMode: false })) {
    throw new Error("invalid phone number");
  }

  const salt = await bcrypt.genSalt(10);
  const encryptpassword = await bcrypt.hash(password, salt);

  return await Doctor.create({
    name,
    email,
    password: encryptpassword,
    speciality,
    degree,
    experience,
    fees: Number(fees),
    about,
    address: JSON.parse(address),
    phnum,
    image: imageUrl,
  });
};

export const loginAdmin = async (email, password) => {
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign(email + password, process.env.JWT_SECRET);
    return { token };
  }
  throw new Error("invalid credentials");
};

export const getAllDoctors = async () => {
  return await Doctor.findAll({ attributes: { exclude: ['password'] } });
};

export const getAllAppointments = async () => {
  return await Appointment.findAll();
};

export const cancelAppointmentAdmin = async (appointmentId) => {
  const appointment = await Appointment.findByPk(appointmentId);
  if (!appointment) throw new Error("Appointment not found");

  await Appointment.update({ cancelled: true }, { where: { id: appointmentId } });

  if (appointment.payment) {
    const doc = await Doctor.findByPk(appointment.DocId);
    if (doc) {
      let slots_booked = doc.slots_booked || {};
      if (slots_booked[appointment.slotDate]) {
        slots_booked[appointment.slotDate] = slots_booked[appointment.slotDate].filter(e => e !== appointment.slotTime);
        await Doctor.update({ slots_booked }, { where: { id: appointment.DocId } });
      }
    }
  }
};

export const getDashboardData = async () => {
  const doctors = await Doctor.findAll();
  const patients = await User.findAll();
  const appointments = await Appointment.findAll();

  const sortedAppointments = [...appointments].reverse();

  return {
    doctors: doctors.length,
    appointments: appointments.length,
    patients: patients.length,
    latest_appointments: sortedAppointments.slice(0, 5)
  };
};

export const sendContactEmail = async (name, email, message) => {
  if (!name || !email || !message) {
    throw new Error("All fields are required.");
  }
  if (!validator.isEmail(email)) {
    throw new Error("Invalid email address.");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.APP_EMAIL,
      pass: process.env.APP_EMAIL_PASS,
    },
  });

  const adminMail = {
    from: `"MediBook Contact" <${process.env.APP_EMAIL}>`,
    to: process.env.APP_EMAIL,
    subject: `📬 New message from ${name}`,
    text: `
You have received a new message from MediBook Contact Form.

Name: ${name}
Email: ${email}

Message:
${message}
    `,
  };

  const userMail = {
    from: `"MediBook Support" <${process.env.APP_EMAIL}>`,
    to: email,
    subject: "Thank you for contacting MediBook!",
    text: `Hi ${name},

Thank you for reaching out to MediBook! We've received your message and our team will get back to you shortly.

Warm regards,
MediBook Team
`,
  };

  await transporter.sendMail(adminMail);
  await transporter.sendMail(userMail);
};

export const deleteDoctor = async (docId) => {
  const doctor = await Doctor.findByPk(docId);
  if (!doctor) throw new Error("Doctor not found");

  const appointments = await Appointment.findAll({ where: { DocId: docId } });

  for (const appointment of appointments) {
    if (!appointment.cancelled) {
      await Appointment.update({ cancelled: true }, { where: { id: appointment.id } });
      
      const docdata = await Doctor.findByPk(docId);
      if (docdata && docdata.slots_booked && docdata.slots_booked[appointment.slotDate]) {
        let slots_booked = docdata.slots_booked;
        slots_booked[appointment.slotDate] = slots_booked[appointment.slotDate].filter(e => e !== appointment.slotTime);
        await Doctor.update({ slots_booked }, { where: { id: docId } });
      }
    }
  }

  if (doctor.image) {
    try {
      const urlParts = doctor.image.split('/');
      const publicIdWithExt = urlParts.slice(-2).join('/').split('.')[0];
      const publicId = `Medibook_project/doctors/${publicIdWithExt}`;
      await cloudinary.uploader.destroy(publicId);
    } catch (cloudinaryError) {
      console.log("Error deleting image from Cloudinary:", cloudinaryError);
    }
  }

  await Doctor.destroy({ where: { id: docId } });
};

export const getAllPatients = async () => {
  return await User.findAll({ attributes: { exclude: ['password'] } });
};
