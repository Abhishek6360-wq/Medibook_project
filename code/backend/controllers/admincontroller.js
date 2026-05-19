import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';
import * as adminService from '../services/adminService.js';

export const addDoctor = async (req, res) => {
  try {
    const imagefile = req.file;
    let imageUrl = null;

    if (imagefile) {
      const imageupload = await uploadToCloudinary(
        imagefile.buffer,
        "Medibook_project/doctors",
        req.body.name
      );
      imageUrl = imageupload.secure_url;
    }

    await adminService.addDoctor(req.body, imageUrl);
    res.json({ success: true, message: "doctor added succesfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const loginadmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await adminService.loginAdmin(email, password);
    res.json({ success: true, token: result.token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const listofalldoctors = async (req, res) => {
  try {
    const doctor = await adminService.getAllDoctors();
    res.json({ success: true, doctor });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const appointmentsadmin = async (req, res) => {
  try {
    const appointments = await adminService.getAllAppointments();
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const cancelanyappointment = async (req, res) => {
  try {
    const { appointmentid } = req.body;
    await adminService.cancelAppointmentAdmin(appointmentid);
    res.json({ success: true, message: "appointment cancelled" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const getdashboarddata = async (req, res) => {
  try {
    const dashdata = await adminService.getDashboardData();
    res.json({ success: true, dashdata });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const contactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    await adminService.sendContactEmail(name, email, message);
    res.json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error in contactForm:", error);
    res.json({ success: false, message: error.message });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const { docId } = req.body;
    await adminService.deleteDoctor(docId);
    res.json({ success: true, message: "Doctor deleted successfully. All related appointments have been cancelled." });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const allPatients = async (req, res) => {
  try {
    const patients = await adminService.getAllPatients();
    res.json({ success: true, patients });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};