import nodemailer from 'nodemailer';
import 'dotenv/config';

// Create a single reusable transporter using environment credentials
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.APP_EMAIL,
    pass: process.env.APP_EMAIL_PASS,
  },
});

/**
 * Sends a beautiful HTML refund notification email to the patient.
 * 
 * @param {string} toEmail - Patient's email address
 * @param {string} patientName - Patient's name
 * @param {string} doctorName - Doctor's name
 * @param {string} slotDate - Slot date (DD/MM/YYYY)
 * @param {string} slotTime - Slot time (e.g. 10:30 AM)
 * @param {number} amount - Paid amount in INR
 * @param {string} refundId - Razorpay refund reference ID
 */
export const sendRefundEmail = async (toEmail, patientName, doctorName, slotDate, slotTime, amount, refundId) => {
  const mailOptions = {
    from: `"MediBook Care" <${process.env.APP_EMAIL}>`,
    to: toEmail,
    subject: "⚠️ Refund Initiated - MediBook Appointment Double Booking",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; padding: 24px; color: #333;">
        <div style="text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 16px;">
          <h1 style="color: #3b82f6; margin: 0; font-size: 24px;">MediBook Auto-Refund</h1>
        </div>
        
        <div style="padding: 20px 0;">
          <p style="font-size: 16px; line-height: 1.5; color: #4b5563;">
            Dear <strong>${patientName}</strong>,
          </p>
          <p style="font-size: 15px; line-height: 1.6; color: #4b5563;">
            We regret to inform you that your appointment request with <strong>${doctorName}</strong> on <strong>${slotDate}</strong> at <strong>${slotTime}</strong> could not be completed.
          </p>
          
          <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 4px; padding: 12px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #991b1b; font-weight: bold;">
              Reason for Refund:
            </p>
            <p style="margin: 4px 0 0 0; font-size: 14px; color: #7f1d1d;">
              Another patient secured the final slot at the exact same millisecond. To maintain database consistency and fairness, your payment was automatically stopped.
            </p>
          </div>

          <h3 style="color: #1e3a8a; margin-top: 24px; border-bottom: 1px dashed #cbd5e1; padding-bottom: 8px;">Refund Details</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-size: 14px;">Refunded Amount:</td>
              <td style="padding: 6px 0; color: #111827; font-size: 14px; font-weight: bold; text-align: right;">₹${amount}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-size: 14px;">Refund Transaction ID:</td>
              <td style="padding: 6px 0; color: #111827; font-size: 14px; font-family: monospace; text-align: right;">${refundId}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-size: 14px;">Status:</td>
              <td style="padding: 6px 0; color: #15803d; font-size: 14px; font-weight: bold; text-align: right;">Processed Successfully</td>
            </tr>
          </table>

          <p style="font-size: 14px; color: #6b7280; margin-top: 24px; line-height: 1.5;">
            *Note: The refunded amount should reflect in your original payment method (bank account, card, or wallet) within 5-7 business days, depending on your bank's policies.
          </p>
        </div>

        <div style="text-align: center; border-top: 1px solid #e5e7eb; padding-top: 16px; margin-top: 20px;">
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">
            This is an automated notification from the MediBook Clinic Management System. Please do not reply directly to this email.
          </p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ Automated refund email sent to ${toEmail}. Message ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ Failed to send refund email to ${toEmail}:`, error);
  }
};
