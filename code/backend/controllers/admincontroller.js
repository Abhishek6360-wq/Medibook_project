import validator from 'validator'
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import docmodel from '../models/docmodel.js'
import appointmentmodel from '../models/appointmentmodel.js'
import usermodel from '../models/usermodel.js'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js'

// API for adding doctors
const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, fees, about, address, phnum } = req.body
        const imagefile = req.file

        if (!name || !email || !password || !speciality || !degree || !experience || !fees || !about || !address || !phnum) {
            return res.json({ success: false, message: "missing data in field" })
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "invalid email" })
        }


        // validating password strength 
        if (password.length < 8 || password.length > 16) {
            return res.json({ success: false, message: "password must have atleast 8 and not more than 16 character" })
        }

        // validate phone number 
        if (!validator.isMobilePhone(phnum, 'any', { strictMode: false })) {
            return res.json({ success: false, message: "invalid phone number" })
        }

        // password encryption 
        const salt = await bcrypt.genSalt(10);
        const encryptpassword = await bcrypt.hash(password, salt);

        // uploading image to cloudinary
        const imageupload = await uploadToCloudinary(
            imagefile.buffer,
            "Medibook_project/doctors",
            name
        );
        const imageurl = imageupload.secure_url;


        const doctordata = {
            name,
            email,
            password: encryptpassword,
            speciality,
            degree,
            experience,
            fees,
            about,
            address: JSON.parse(address),
            date: Date.now(),
            phnum,
            image: imageurl,
        }

        const newdoctor = new docmodel(doctordata);
        await newdoctor.save();
        res.json({ success: true, message: "doctor added succesfully" });


    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}

// API for admin login
const loginadmin = async (req, res) => {
    try {
        const { email, password } = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "invalid credentials" })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}
// api to get all doctors 
const listofalldoctors = async (req, res) => {
    const doctor = await docmodel.find({}).select('-password')
    res.json({ success: true, doctor })
}

// api to get all appointment lists
const appointmentsadmin = async (req, res) => {
    try {
        const appointments = await appointmentmodel.find({});
        res.json({ success: true, appointments });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}

// api to cancel any appointment
const cancelanyappointment = async (req, res) => {
    try {
        const { appointmentid } = req.body;
        const appointmentdata = await appointmentmodel.findById(appointmentid)
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

// api to get dashboard data such as  number/types of doctors number of appointments etc
const getdashboarddata = async (req, res) => {
    try {
        const doctors = await docmodel.find({});
        const patients = await usermodel.find({});
        const appointments = await appointmentmodel.find({});

        const dashdata = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: patients.length,
            latest_appointments: appointments.reverse().slice(0, 5)
        }
        res.json({ success: true, dashdata });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
}

// api to send email if anyone wants to send some feedback
const contactForm = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // --- Basic validation ---
        if (!name || !email || !message) {
            return res.json({ success: false, message: "All fields are required." });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid email address." });
        }

        // --- Configure the mail transporter ---
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.APP_EMAIL,       // (admin/support email)
                pass: process.env.APP_EMAIL_PASS,  // app password
            },
        });

        // --- Mail sent to admin---
        const adminMail = {
            from: `"MediBook Contact" <${process.env.APP_EMAIL}>`,
            to: process.env.APP_EMAIL, // you'll receive user messages here
            subject: `📬 New message from ${name}`,
            text: `
You have received a new message from MediBook Contact Form.

Name: ${name}
Email: ${email}

Message:
${message}
      `,
        };

        // --- Auto-reply mail sent to the user ---
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

        // --- Send both emails ---
        await transporter.sendMail(adminMail);
        await transporter.sendMail(userMail);

        return res.json({ success: true, message: "Message sent successfully!" });
    } catch (error) {
        console.error("Error in contactForm:", error);
        return res.json({
            success: false,
            message: "Failed to send message. Please try again later.",
        });
    }
};

// api to delete a doctor
const deleteDoctor = async (req, res) => {
    try {
        const { docId } = req.body;
        
        if (!docId) {
            return res.json({ success: false, message: "Doctor ID is required" });
        }

        // Find the doctor to get their image URL
        const doctor = await docmodel.findById(docId);
        if (!doctor) {
            return res.json({ success: false, message: "Doctor not found" });
        }

        // Find all appointments for this doctor
        const appointments = await appointmentmodel.find({ DocId: docId });

        // Cancel all appointments and release slots
        for (const appointment of appointments) {
            if (!appointment.cancelled) {
                // Mark appointment as cancelled
                await appointmentmodel.findByIdAndUpdate(appointment._id, { cancelled: true });
                
                // Release the slot from doctor's slots_booked
                const { slotDate, slotTime } = appointment;
                const docdata = await docmodel.findById(docId);
                if (docdata && docdata.slots_booked && docdata.slots_booked[slotDate]) {
                    let slots_booked = docdata.slots_booked;
                    slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);
                    await docmodel.findByIdAndUpdate(docId, { slots_booked });
                }
            }
        }

        // Delete doctor's image from Cloudinary if it exists
        if (doctor.image) {
            try {
                // Extract public_id from Cloudinary URL
                const urlParts = doctor.image.split('/');
                const publicIdWithExt = urlParts.slice(-2).join('/').split('.')[0];
                const publicId = `Medibook_project/doctors/${publicIdWithExt}`;
                
                await cloudinary.uploader.destroy(publicId);
            } catch (cloudinaryError) {
                console.log("Error deleting image from Cloudinary:", cloudinaryError);
                // Continue with doctor deletion even if image deletion fails
            }
        }

        // Delete doctor from database
        await docmodel.findByIdAndDelete(docId);

        res.json({ 
            success: true, 
            message: "Doctor deleted successfully. All related appointments have been cancelled." 
        });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
}

// api to get all patients list
const allPatients = async (req, res) => {
    try {
        const patients = await usermodel.find({}).select('-password');
        res.json({ success: true, patients });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { addDoctor, loginadmin, listofalldoctors, appointmentsadmin, cancelanyappointment, getdashboarddata, contactForm, deleteDoctor, allPatients };