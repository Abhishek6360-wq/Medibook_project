import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import * as doctorService from '../services/doctorService.js';

export const changeavailabillity = async (req, res) => {
  try {
    const { docId } = req.body;
    await doctorService.changeAvailability(docId);
    res.json({ success: true, message: "Availabillity changed" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const doctorlist = async (req, res) => {
  try {
    const doctors = await doctorService.getDoctorList();
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const doclogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await doctorService.loginDoctor(email, password);
    res.json({ success: true, token: result.token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const docappointments = async (req, res) => {
  try {
    const { docid } = req.doc;
    const appointments = await doctorService.getDoctorAppointments(docid);
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const completecheck = async (req, res) => {
  try {
    const { docid } = req.doc;
    const { appointmentid } = req.body;
    await doctorService.completeAppointment(docid, appointmentid);
    res.json({ success: true, message: "appointment completed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const cancelappointment = async (req, res) => {
  try {
    const { docid } = req.doc;
    const { appointmentid } = req.body;
    await doctorService.cancelAppointment(docid, appointmentid);
    res.json({ success: true, message: "appointment cancelled" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const getdocdata = async (req, res) => {
  try {
    const { docid } = req.doc;
    const profiledata = await doctorService.getDoctorProfile(docid);
    res.json({ success: true, profiledata });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const updatedocprofile = async (req, res) => {
  try {
    const { docid } = req.doc;
    const {
      name,
      email,
      speciality,
      degree,
      phnum,
      fees,
      experience,
      about,
      address,
    } = req.body;

    const requiredFields = { name, email, speciality, degree, phnum, fees, experience };
    const missing = Object.entries(requiredFields)
      .filter(([key, value]) => !value || value.toString().trim() === "")
      .map(([key]) => key);

    if (missing.length > 0) {
      return res.json({
        success: false,
        message: `Missing required fields: ${missing.join(", ")}`,
      });
    }

    const updateFields = {
      name: name.trim(),
      email: email.trim(),
      speciality: speciality.trim(),
      degree: degree.trim(),
      phnum: phnum.trim(),
      fees: Number(fees),
      experience: experience.trim(),
      about: about ? about.trim() : "",
      address: address ? JSON.parse(address) : {},
    };

    if (req.file) {
      const uploaded = await uploadToCloudinary(
        req.file.buffer,
        "Medibook_project/doctors",
        docid.toString()
      );
      updateFields.image = uploaded.secure_url;
    }

    const updatedDoc = await doctorService.updateDoctorProfile(docid, updateFields);
    res.json({
      success: true,
      message: "Profile updated successfully",
      updatedDoc,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.json({ success: false, message: error.message });
  }
};