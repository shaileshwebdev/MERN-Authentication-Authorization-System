import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import router from "./routes/auth.routes.js";
import cors from "cors";
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;
app.use(express.json());
const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://mern-authentication-authorization-s.vercel.app/", // vercel frontend
];
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true, // if using cookies/auth headers
  })
);

connectDB();

// http://localhost:3000/auth/user/register
app.use("/auth/user", router);

app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
