import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import router from "./routes/auth.routes.js";
import cors from "cors";
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

connectDB();

// http://localhost:3000/auth/user/register
app.use("/auth/user", router);

app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
