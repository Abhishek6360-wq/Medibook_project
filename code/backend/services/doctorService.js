import { Doctor, Appointment } from '../models/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const changeAvailability = async (docId) => {
  const doc = await Doctor.findByPk(docId);
  if (!doc) throw new Error("Doctor not found");
  await Doctor.update({ available: !doc.available }, { where: { id: docId } });
};

export const getDoctorList = async () => {
  return await Doctor.findAll({ attributes: { exclude: ['password', 'email'] } });
};

export const loginDoctor = async (email, password) => {
  const doc = await Doctor.findOne({ where: { email } });
  if (!doc) throw new Error("doctor not registered in the directory");

  const isMatch = await bcrypt.compare(password, doc.password);
  if (!isMatch) throw new Error("invalid password");

  const token = jwt.sign({ id: doc.id }, process.env.JWT_SECRET);
  return { token };
};

export const getDoctorAppointments = async (docId) => {
  return await Appointment.findAll({ where: { DocId: docId } });
};

export const completeAppointment = async (docId, appointmentId) => {
  const appointment = await Appointment.findByPk(appointmentId);
  if (appointment && appointment.DocId === docId) {
    await Appointment.update({ isComplete: true }, { where: { id: appointmentId } });
    return true;
  }
  throw new Error("appointment already completed or invalid docid");
};

export const cancelAppointment = async (docId, appointmentId) => {
  const appointment = await Appointment.findByPk(appointmentId);
  if (appointment && appointment.DocId === docId) {
    await Appointment.update({ cancelled: true }, { where: { id: appointmentId } });
    return true;
  }
  throw new Error("appointment already cancelled or invalid docid");
};

export const getDoctorProfile = async (docId) => {
  return await Doctor.findByPk(docId, { attributes: { exclude: ['password'] } });
};

export const updateDoctorProfile = async (docId, updateData, imageUrl) => {
  if (imageUrl) {
    updateData.image = imageUrl;
  }
  await Doctor.update(updateData, { where: { id: docId } });
  return await Doctor.findByPk(docId, { attributes: { exclude: ['password'] } });
};
