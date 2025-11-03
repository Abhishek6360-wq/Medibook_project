import docmodel from "../models/docmodel.js"
import appointmentmodel from "../models/appointmentmodel.js"
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from "cloudinary";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";


// api to change availabillity of doctor
const changeavailabillity = async (req, res) => {
    try {
        const { docId } = req.body
        const docdata = await docmodel.findById(docId);
        await docmodel.findByIdAndUpdate(docId, { available: !docdata.available });
        res.json({ success: true, message: "Availabillity changed" })
    } catch (err) {
        res.json({ success: false, message: err.message })
    }
}

// api to get a list of all doctors
const doctorlist = async (req, res) => {
    try {
        const doctors = await docmodel.find({}).select(['-password', '-email']);
        res.json({ success: true, doctors });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// api for login of doctor
const doclogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const doc = await docmodel.findOne({ email });

        if (!doc) {
            return res.json({ success: false, message: "doctor not registered in the directory" });
        }
        const Ismatch = await bcrypt.compare(password, doc.password);
        if (Ismatch) {
            const token = jwt.sign({ id: doc._id }, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            return res.json({ success: false, message: "invalid password" })
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// api to get all doctor appointments for specific doctor
const docappointments = async (req, res) => {
    try {
        const { docid } = req.doc;
        const appointments = await appointmentmodel.find({ DocId: docid });
        res.json({ success: true, appointments });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// api to mark an appointment complete 
const completecheck = async (req, res) => {
    try {
        const { docid } = req.doc;
        const { appointmentid } = req.body;
        const appointmentdata = await appointmentmodel.findById(appointmentid);
        if (appointmentdata && appointmentdata.DocId === docid) {
            await appointmentmodel.findByIdAndUpdate(appointmentid, { isComplete: true })
            return res.json({ success: true, message: "appointment completed" });
        }
        else {
            return res.json({ success: false, message: "appointment already completed or invalid docid" });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// api to cancel an appointment
const cancelappointment = async (req, res) => {
    try {
        const { docid } = req.doc;
        const { appointmentid } = req.body;
        const appointmentdata = await appointmentmodel.findById(appointmentid);
        if (appointmentdata && appointmentdata.DocId === docid) {
            await appointmentmodel.findByIdAndUpdate(appointmentid, { cancelled: true })
            return res.json({ success: true, message: "appointment cancelled" });
        }
        else {
            return res.json({ success: false, message: "appointment already cancelled or invalid docid" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// api to get doctor's profile data
const getdocdata = async (req, res) => {
    try {
        const { docid } = req.doc;
        const profiledata = await docmodel.findById(docid).select('-password');
        res.json({ success: true, profiledata });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// api to update doctor's profile data
const updatedocprofile = async (req, res) => {
    try {
        const { docid } = req.doc;

        // Extract incoming data
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

        // REQUIRED FIELDS
        const requiredFields = {
            name,
            email,
            speciality,
            degree,
            phnum,
            fees,
            experience,
        };

        // Find missing fields
        const missing = Object.entries(requiredFields)
            .filter(([key, value]) => !value || value.trim() === "")
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

        //image change
        if (req.file) {
            const uploaded = await uploadToCloudinary(
                req.file.buffer,
                "Medibook_project/doctors",
                docid // image name should be unique 
            );
            updateFields.image = uploaded.secure_url;
        }


        // saving in database
        await docmodel.findByIdAndUpdate(docid, updateFields);
        const updatedDoc = await docmodel.findById(docid).select("-password");

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


export { changeavailabillity, doctorlist, doclogin, docappointments, cancelappointment, completecheck, updatedocprofile, getdocdata };