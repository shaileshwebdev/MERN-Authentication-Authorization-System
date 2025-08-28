import jwt from "jsonwebtoken";
import User from "../models/model.user.js";

export const isAuthenticated = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  try {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    const token = authHeader.split(" ")[1];

    // JWT verify inside try/catch
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Access token expired, use refresh token to generate again",
        });
      }
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
      });
    }

    // User find
    const { id } = decoded;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.userId = user._id; // ✅ fix here
    req.user = user; // optional, आगे कहीं काम आए
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
