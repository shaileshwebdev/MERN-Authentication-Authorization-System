import express from "express";
import {
  changePassword,
  forgotPassword,
  registerUser,
  userLogin,
  userLogout,
  verification,
  verifyOtp,
} from "../controllers/auth.controllers.js";
import { isAuthenticated } from "../middleware/middleware.isAuthenticated.js";
import { userSchema, validateUser } from "../validators/userValidate.js";

const router = express.Router();

router.post("/register", validateUser(userSchema), registerUser);
router.post("/verify", verification);
router.post("/login", userLogin);
router.post("/logout", isAuthenticated, userLogout);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp/:email", verifyOtp);
router.post("/change-password/:email", changePassword);

export default router;
