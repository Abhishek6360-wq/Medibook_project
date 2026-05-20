import { User, Doctor, Appointment } from '../models/index.js';
import { runInTransaction } from '../utils/transactionHelper.js';
import { sendRefundEmail } from '../utils/emailHelper.js';
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

    if (slots_booked[slotDate] && slots_booked[slotDate].includes(slotTime)) {
      throw new Error("slot not available at this time, try any other time");
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

    // Lock the doctor record and release the slot only if the appointment was paid and locked
    if (appointment.payment) {
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
    const appointmentId = parseInt(orderInfo.receipt);

    // Securely lock the records and save the booked slot inside a transaction on payment success
    const result = await runInTransaction(async (transaction) => {
      const appointment = await Appointment.findByPk(appointmentId, { 
        transaction,
        lock: transaction.LOCK.UPDATE 
      });
      
      if (!appointment) throw new Error("Appointment not found");
      if (appointment.cancelled) throw new Error("Appointment already cancelled");
      if (appointment.payment) return { status: 'already_paid' }; // Already processed

      // Lock Doctor record to modify slots_booked safely
      const doc = await Doctor.findByPk(appointment.DocId, { 
        transaction,
        lock: transaction.LOCK.UPDATE 
      });
      if (!doc) throw new Error("Doctor not found");

      let slots_booked = doc.slots_booked || {};
      if (slots_booked[appointment.slotDate] && slots_booked[appointment.slotDate].includes(appointment.slotTime)) {
        // Concurrency Block: Double booking detected. Mark as cancelled in database and flag for auto-refund
        await appointment.update({ cancelled: true }, { transaction });
        return { status: 'refund_needed', appointment: appointment.toJSON(), docName: doc.name };
      }

      if (slots_booked[appointment.slotDate]) {
        slots_booked[appointment.slotDate] = [...slots_booked[appointment.slotDate], appointment.slotTime];
      } else {
        slots_booked[appointment.slotDate] = [appointment.slotTime];
      }

      // Commit the updates under transaction locks
      await doc.update({ slots_booked }, { transaction });
      await appointment.update({ payment: true }, { transaction });
      
      return { status: 'success' };
    });

    if (result && result.status === 'refund_needed') {
      console.warn(`⚠️ Slot already booked by another user. Initiating automatic Razorpay refund for payment: ${razorpay_payment_id}`);
      try {
        const refund = await razorpayInstance.payments.refund(razorpay_payment_id, {
          notes: {
            reason: "Automatic refund: Slot already booked (concurrency conflict)",
            appointmentId: appointmentId.toString(),
            slot: `${result.appointment.slotDate} ${result.appointment.slotTime}`
          }
        });

        console.log(`✅ Razorpay Refund initiated successfully. Refund ID: ${refund.id}`);

        // Retrieve patient email/name from appointment details to send custom notification
        const userData = result.appointment.userData || {};
        if (userData.email) {
          sendRefundEmail(
            userData.email,
            userData.name || 'Patient',
            result.docName || 'Doctor',
            result.appointment.slotDate,
            result.appointment.slotTime,
            result.appointment.amount,
            refund.id
          ).catch(err => console.error("Error sending refund email:", err));
        }

        return {
          status: 'refunded',
          message: 'This slot was already booked by another patient at the exact same moment. A full refund has been automatically initiated.'
        };
      } catch (refundError) {
        console.error("❌ Critical: Failed to initiate Razorpay refund:", refundError);
        throw new Error(`Refund initiation failed: ${refundError.message}`);
      }
    }

    return true;
  }
  
  throw new Error(`Payment failed. Order Status: ${orderInfo.status}`);
};
