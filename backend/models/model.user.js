import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    isVerified: { type: Boolean, default: false },
    isLogedIn: { type: Boolean, default: false },
    token: { type: String, default: null },
    otp: { type: String, default: null },
    otpExpire: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

const user = mongoose.model("User", userSchema);
export default user;
