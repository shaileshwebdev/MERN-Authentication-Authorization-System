import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
export const sendOtpMail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const mailOption = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email for password reset otp",
    html: `<p>Your otp for password reset is:<b>${otp}.</b></p>`,
  };
  await transporter.sendMail(mailOption);
};
