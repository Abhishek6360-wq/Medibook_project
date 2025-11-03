import validator from 'validator';
import bcrypt from 'bcrypt'
import usermodel from '../models/usermodel.js';
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import docmodel from '../models/docmodel.js';
import appointmentmodel from '../models/appointmentmodel.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

// api to register user
const registeruser = async (req, res) => {
    try {
        const { name, email, password, phone, dob, age, gender } = req.body;
        if (!name || !email || !password || !phone) {
            return res.json({ success: false, message: "missing details" });
        }
        // validate email id
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "invalid email" })
        }
        // checking if email already exists
        const existinguser = await usermodel.findOne({ email });
        if (existinguser) {
            return res.json({ success: false, message: "User Already exists, go to login" })
        }
        // validate password strength
        if (password.length < 8 || password.length > 16) {
            return res.json({ success: false, message: "password must have atleast 8 and not more than 16 character" })
        }

        // validate phone number 
        if (!validator.isMobilePhone(phone, 'any', { strictMode: false })) {
            return res.json({ success: false, message: "invalid phone number" })
        }

        const salt = await bcrypt.genSalt(10);
        const encryptedpassword = await bcrypt.hash(password, salt);

        const userdata = {
            name,
            email,
            password: encryptedpassword,
            phno: phone,
            dob,
            age,
            gender
        }

        const newuser = new usermodel(userdata);
        const user = await newuser.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ success: true, token });

    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            return res.json({ success: false, message: "Email already registered" });
        }
        res.json({ success: false, message: error.message })
    }

}

// api for user login
const userlogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await usermodel.findOne({ email: email });

        if (!user) {
            return res.json({ success: false, message: "user does not exist" });
        }
        const Ismatch = await bcrypt.compare(password, user.password);
        if (Ismatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            return res.json({ success: false, message: "invalid password" })
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// api to get a user's info 

const getprofile = async (req, res) => {
    try {
        const { userid } = req.user;
        const user = await usermodel.findById(userid).select('-password');
        res.json({ success: true, user });
    } catch (err) {
        console.log(err);
        res.json({ success: false, message: "some error occured idk" });
    }
}

// api to update user's info 
const updateprofile = async (req, res) => {
    try {
        const { name, phone, Address, dob, gender, email } = req.body;
        const { userid } = req.user;
        const imageFile = req.file;

        if (!email || !name || !phone || !Address || !dob || !gender) {
            return res.json({ success: false, message: "Kindly fill all the required fields" });
        }

        // Base update
        let updateFields = { email, name, phno: phone, Address: JSON.parse(Address), dob, gender };
        if (imageFile) {
            const imageupload = await uploadToCloudinary(
                imageFile.buffer,
                "Medibook_project/users",
                userid // unique per user
            );
            updateFields.image = imageupload.secure_url;
        }
        const user = await usermodel.findByIdAndUpdate(
            userid,
            updateFields,
            { new: true } // { new: true } returns the updated document
        ).select('-password');

        res.json({ success: true, message: "Profile updated successfully", user });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "An error occurred during profile update" });
    }
}


// api to book appointments by the user
const bookappointment = async (req, res) => {
    try {
        const { userid } = req.user;
        const { docId, slotDate, slotTime } = req.body;


        // 1. Fetch and Check Doctor
        const doc = await docmodel.findById(docId).select('-password');
        if (!doc) {
            return res.json({ success: false, message: "Doctor not found" });
        }
        if (!doc.available) {
            return res.json({ success: false, message: "doctor not available" });
        }

        let slots_booked = JSON.parse(JSON.stringify(doc.slots_booked || {}));

        // 3. Checking if the slot is available (LOGIC REMAINS THE SAME)
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: "slot not available at this time, try any other time" })
            }
            slots_booked[slotDate].push(slotTime);
        } else {
            slots_booked[slotDate] = [];
            slots_booked[slotDate].push(slotTime);
        }


        const user = await usermodel.findById(userid).select('-password');
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const appointmentdata = {
            UserId: userid,
            DocId: docId,
            userData: user.toObject(), // Must convert to plain object
            docData: doc.toObject(),   // Must convert to plain object
            amount: doc.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }

        delete appointmentdata.docData.slots_booked;
        const newappointment = new appointmentmodel(appointmentdata);
        await newappointment.save();
        await docmodel.findByIdAndUpdate(docId, { slots_booked });

        res.json({ success: true, message: "appointment booked" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message || "An unknown server error occurred." });
    }
}

// api to get list of all user appointments
const listappointments = async (req, res) => {
    try {
        const { userid } = req.user;
        const appointments = await appointmentmodel.find({ UserId: userid }).select('-password');
        res.json({ success: true, appointments });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// api to cancel appointment
const cancelappointment = async (req, res) => {
    try {
        const { userid } = req.user;
        const { appointmentid } = req.body;
        const appointmentdata = await appointmentmodel.findById(appointmentid)
        if (appointmentdata.UserId !== userid) {
            return res.json({ success: false, message: "Unauthorised action" });
        }
        await appointmentmodel.findByIdAndUpdate(appointmentid, { cancelled: true });

        // releasing the doctor slot 
        const { DocId, slotDate, slotTime } = appointmentdata
        const docdata = await docmodel.findById(DocId);
        let slots_booked = docdata.slots_booked;
        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);
        await docmodel.findByIdAndUpdate(DocId, { slots_booked });
        res.json({ success: true, message: "appointment cancelled" });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
}

// razorpay instance
const razorpayinstance = new Razorpay({
    key_id: process.env.RAZORPAY_TEST_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
});


// api to make payment using razorpay
const payment = async (req, res) => {
    try {
        const { appointmentid } = req.body;
        const appointmentData = await appointmentmodel.findById(appointmentid);
        if (!appointmentData || appointmentData.cancelled === true) {
            return res.json({ success: false, message: "Appointment cancelled or not found" });
        }
        // creating options for payment
        const options = {
            amount: appointmentData.amount * 100,
            currency: process.env.CURRENCY,
            receipt: appointmentid,
        }
        // creation of an order
        const order = await razorpayinstance.orders.create(options);
        // console.log(order);
        res.json({ success: true, order });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
}

// api to verify payment of raorpay
const verifypayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body.response;
        // verifying signature
        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_SECRET)
            .update(razorpay_order_id + '|' + razorpay_payment_id)
            .digest('hex');

        if (generatedSignature !== razorpay_signature) {
            return res.json({ success: false, message: "Signature verification failed" });
        }
        const orderinfo = await razorpayinstance.orders.fetch(razorpay_order_id)
        // console.log(orderinfo);
        if (orderinfo.status === 'paid') {
            await appointmentmodel.findByIdAndUpdate(orderinfo.receipt, { payment: true });
            res.json({ success: true, message: "Payment succesfull" });
        }
        else {
            res.json({ success: false, message: `Payment failed. Order Status: ${orderinfo.status}` });
        }
    }
    catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
}


export { registeruser, userlogin, getprofile, updateprofile, bookappointment, listappointments, cancelappointment, payment, verifypayment };