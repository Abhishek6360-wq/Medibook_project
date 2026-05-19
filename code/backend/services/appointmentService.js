import { User, Doctor, Appointment } from '../models/index.js';
import { runInTransaction } from '../utils/transactionHelper.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import 'dotenv/config';

/**
 * Books an appointment securely using a PostgreSQL FOR UPDATE row lock 
 * inside a database transaction to prevent double booking race conditions.
 */
export const bookAppointment = async (userId, docId, slotDate, slotTime) => {
  return await runInTransaction(async (transaction) => {
    // Acquire a row-level write lock ('FOR UPDATE') on the doctor record.
    // This blocks any other concurrent request from reading/writing this doctor's slots until this transaction commits.
    const doc = await Doctor.findByPk(docId, { 
      transaction,
      lock: transaction.LOCK.UPDATE 
    });
    
    if (!doc) throw new Error("Doctor not found");
    if (!doc.available) throw new Error("Doctor not available");

    let slots_booked = doc.slots_booked || {};

    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        throw new Error("slot not available at this time, try any other time");
      }
      slots_booked[slotDate] = [...slots_booked[slotDate], slotTime];
    } else {
      slots_booked[slotDate] = [slotTime];
    }

    const user = await User.findByPk(userId, { 
      attributes: { exclude: ['password'] },
      transaction 
    });
    if (!user) throw new Error("User not found");

    const appointment = await Appointment.create({
      UserId: userId,
      DocId: docId,
      userData: user.toJSON(),
      docData: doc.toJSON(),
      amount: doc.fees,
      slotTime,
      slotDate,
      date: Date.now()
    }, { transaction });

    // Update doctor's slots within the lock context
    await doc.update({ slots_booked }, { transaction });

    return appointment;
  });
};

export const listUserAppointments = async (userId) => {
  return await Appointment.findAll({ where: { UserId: userId } });
};

/**
 * Cancels an appointment securely using a transaction and locking to prevent race conditions.
 */
export const cancelAppointment = async (userId, appointmentId) => {
  return await runInTransaction(async (transaction) => {
    const appointment = await Appointment.findByPk(appointmentId, { transaction });
    if (!appointment) throw new Error("Appointment not found");
    if (appointment.UserId !== userId) throw new Error("Unauthorised action");

    await appointment.update({ cancelled: true }, { transaction });

    // Lock the doctor record before releasing the time slot
    const doc = await Doctor.findByPk(appointment.DocId, { 
      transaction,
      lock: transaction.LOCK.UPDATE 
    });
    
    if (doc) {
      let slots_booked = doc.slots_booked || {};
      if (slots_booked[appointment.slotDate]) {
        slots_booked[appointment.slotDate] = slots_booked[appointment.slotDate].filter(e => e !== appointment.slotTime);
        await doc.update({ slots_booked }, { transaction });
      }
    }
  });
};

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_TEST_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

export const createPayment = async (appointmentId) => {
  const appointment = await Appointment.findByPk(appointmentId);
  if (!appointment || appointment.cancelled) {
    throw new Error("Appointment cancelled or not found");
  }

  const options = {
    amount: appointment.amount * 100,
    currency: process.env.CURRENCY || 'INR',
    receipt: appointmentId.toString(),
  };

  return await razorpayInstance.orders.create(options);
};

export const verifyPayment = async (razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_SECRET)
    .update(razorpay_order_id + '|' + razorpay_payment_id)
    .digest('hex');

  if (generatedSignature !== razorpay_signature) {
    throw new Error("Signature verification failed");
  }

  const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
  if (orderInfo.status === 'paid') {
    await Appointment.update({ payment: true }, { where: { id: parseInt(orderInfo.receipt) } });
    return true;
  }
  
  throw new Error(`Payment failed. Order Status: ${orderInfo.status}`);
};
