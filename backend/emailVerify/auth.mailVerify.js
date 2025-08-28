import nodemailer from "nodemailer";

const verifyMail = async (token, email) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailConfiguration = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email verification",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #4CAF50;">Verify Your Email Address</h2>
          <p>Hello,</p>
          <p>Thank you for signing up. Please click the button below to verify your email address:</p>
          <a href="${process.env.CLIENT_URL}/verify/${token}" 
             style="display: inline-block; padding: 10px 20px; 
                    background-color: #4CAF50; color: #fff; 
                    text-decoration: none; border-radius: 5px; 
                    margin-top: 10px;">
            Verify Email
          </a>
          <p>If the button above doesn’t work, copy and paste this link into your browser:</p>
          <p>${process.env.CLIENT_URL}/verify/${token}</p>
          <br>
          <p>Best Regards,<br>Your App Team</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailConfiguration);

    console.log("✅ Email sent successfully:", info.response);
    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    throw error;
  }
};

export default verifyMail;
