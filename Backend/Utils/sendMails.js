import nodemailer from 'nodemailer';
import { config } from 'dotenv';

config();

export const sendEmail = async (to, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.sendMailEmail,
        pass: process.env.sendMailPassword,
      },
    });

    await transporter.sendMail({
      from: process.env.sendMailEmail,
      to,
      subject,
      text: message,
    });
  } catch (error) {
    console.log('Something Went Wrong While Sending Email', error.message);
  }
};

export default { sendEmail };
