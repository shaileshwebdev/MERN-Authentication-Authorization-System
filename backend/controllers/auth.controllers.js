import User from "../models/model.user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import verifyMail from "../emailVerify/auth.mailVerify.js";
import Session from "../models/model.session.js";
import mongoose from "mongoose";
import { sendOtpMail } from "../emailVerify/auth.sendOtpMail.js";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. Validate input
    if (!email || !username || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 2. Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already registered",
      });
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create new user (without token first)
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // 5. Generate token using newUser._id
    const generatedToken = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    // 6. Save token in DB
    newUser.token = generatedToken;
    await newUser.save();

    // 7. Send verification email
    await verifyMail(generatedToken, email);

    // 8. Send success response
    return res.status(201).json({
      success: true,
      message:
        "User created successfully. Please check your email for verification.",
      token: generatedToken, 
    });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({
      success: false,
      message: "Registration failed. Please try again.",
      error: error.message,
    });
  }
};

export const verification = async (req, res) => {
  const authHeader = req.headers["authorization"];
  try {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is missing or invalid",
      });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(400).json({
          success: false,
          message: "registration token has expired",
        });
      }
      return res.status(400).json({
        success: false,
        message: "token verification is failed",
      });
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }
    user.token = null;
    (user.isVerified = true), await user.save();
    return res.status(201).json({
      success: true,
      message: "Email is verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(402).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ Password check with await
    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
      return res.status(403).json({
        success: false,
        message: "Password is incorrect",
      });
    }

    // Check if user is verified
    if (user.isVerified !== true) {
      return res.status(403).json({
        success: false,
        message: "Verify your account before login",
      });
    }

    // Remove old session if exists
    const existingSession = await Session.findOne({ userId: user._id });
    if (existingSession) {
      await Session.deleteOne({ userId: user._id });
    }

    await Session.create({ userId: user._id });

    // Generate tokens
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10d",
    });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    user.isLogedIn = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User is logged in",
      accessToken,
      refreshToken,
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const userLogout = async (req, res) => {
  try {
    const userId = req.userId;
    await Session.deleteMany({ userId: new mongoose.Types.ObjectId(userId) });
    await User.findByIdAndUpdate(userId, { isLogedIn: false });
    return res.status(200).json({
      success: true,
      message: "Logout successfully",
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email",
      });
    }
    const otp = Math.floor(100000 + Math.random() * 90000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpire = expiry;
    await user.save();
    await sendOtpMail(email, otp);

    return res.status(200).json({
      success: true,
      message: "otp send to mail",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyOtp = async (req, res) => {
  const { otp } = req.body;
  const email = req.params.email;

  if (!otp) {
    return res.status(401).json({
      success: false,
      message: "Otp is required",
    });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.otp || !user.otpExpire) {
      return res.status(401).json({
        success: false,
        message: "Otp is not generated or already verified",
      });
    }

    if (user.otpExpire < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Your otp is expire",
      });
    }
    if (otp !== user.otp) {
      return res.status(401).json({
        success: false,
        message: "invalid otp",
      });
    }
    user.otp = null;
    user.otpExpire = null;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "your otp is verified",
    });
  } catch (error) {}
};

export const changePassword = async (req, res) => {
  const { newPassword, confirmPassword } = req.body;
  const email = req.params.email;
  if (!newPassword || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "both fields are required",
    });
  }
  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Password not match",
    });
  }
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Your password is change",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};
