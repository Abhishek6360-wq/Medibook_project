import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import * as userService from '../services/userService.js';
import * as appointmentService from '../services/appointmentService.js';

export const registeruser = async (req, res) => {
  try {
    const result = await userService.registerUser(req.body);
    res.json({ success: true, token: result.token });
  } catch (error) {
    console.log(error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.json({ success: false, message: "Email already registered" });
    }
    res.json({ success: false, message: error.message });
  }
};

export const userlogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await userService.loginUser(email, password);
    res.json({ success: true, token: result.token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const getprofile = async (req, res) => {
  try {
    const { userid } = req.user;
    const user = await userService.getProfile(userid);
    res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const updateprofile = async (req, res) => {
  try {
    const { name, phone, Address, dob, gender, email } = req.body;
    const { userid } = req.user;
    const imageFile = req.file;

    if (!email || !name || !phone || !Address || !dob || !gender) {
      return res.json({ success: false, message: "Kindly fill all the required fields" });
    }

    let imageUrl = null;
    if (imageFile) {
      const imageupload = await uploadToCloudinary(
        imageFile.buffer,
        "Medibook_project/users",
        userid.toString()
      );
      imageUrl = imageupload.secure_url;
    }

    const user = await userService.updateProfile(
      userid,
      { email, name, phno: phone, Address: JSON.parse(Address), dob, gender },
      imageUrl
    );

    res.json({ success: true, message: "Profile updated successfully", user });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const bookappointment = async (req, res) => {
  try {
    const { userid } = req.user;
    const { docId, slotDate, slotTime } = req.body;
    await appointmentService.bookAppointment(userid, docId, slotDate, slotTime);
    res.json({ success: true, message: "appointment booked" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const listappointments = async (req, res) => {
  try {
    const { userid } = req.user;
    const appointments = await appointmentService.listUserAppointments(userid);
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const cancelappointment = async (req, res) => {
  try {
    const { userid } = req.user;
    const { appointmentid } = req.body;
    await appointmentService.cancelAppointment(userid, appointmentid);
    res.json({ success: true, message: "appointment cancelled" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const payment = async (req, res) => {
  try {
    const { appointmentid } = req.body;
    const order = await appointmentService.createPayment(appointmentid);
    res.json({ success: true, order });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const verifypayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body.response;
    await appointmentService.verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    res.json({ success: true, message: "Payment succesfull" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};