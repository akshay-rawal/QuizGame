import express from "express";
import login from "./routes/authRoutes/login.js";
import signup from "./routes/authRoutes/signup.js";
import logout from "./routes/authRoutes/logout.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import home from "./routes/home.js";
import answer from "./routes/question-answer/answer.js";
import userScore from "./routes/userScore.js";
import questionRoutes from "./routes/question/questionRoutes.js";
import submitAnswerRoutes from "./routes/submitAnswerRoutes.js";
import sessionRoutes from "./routes/authRoutes/sessionRoutes.js";
import bodyParser from "body-parser";
import getLeaderboard from "./routes/question-answer/leaderboard.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

// CORS Configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Local development frontend URL
      "http://localhost:3000", // Optional for React dev server
      
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
const mongoDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed", error);
    process.exit(1); // Exit the process if MongoDB fails to connect
  }
};
mongoDb();

// Middleware to log requests
app.use((req, res, next) => {
  req.url = req.url.trim();
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Use routes
app.use("/api/auth", login);
app.use("/api/auth", signup);
app.use("/api/auth", home);
app.use("/api", sessionRoutes);
app.use("/api/auth", logout);
app.use("/api", answer);
app.use("/api", questionRoutes);
app.use("/api", userScore);
app.use("/api", submitAnswerRoutes);
app.use("/api", getLeaderboard);

// Serve React Frontend Static Build
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log('Frontend index.html path:', path.resolve(__dirname, "../frontend/dist/index.html"));

// Serve React build folder from frontend
app.use(express.static(path.join(__dirname, "../frontend/dist"))); // Ensure path to the frontend build folder is correct

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/dist", "index.html"));
});

// Port and Host Configuration
const port = process.env.PORT || 5000;
const host = process.env.HOST || "0.0.0.0";

// Start the server
app.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
