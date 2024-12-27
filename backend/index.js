  import express from "express";
 import login from './routes/authRoutes/login.js'
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
  import sessionRoutes from './routes/authRoutes/sessionRoutes.js'
  import bodyParser from "body-parser";
  import getLeaderboard from "./routes/question-answer/leaderboard.js";
  import cookieParser from 'cookie-parser';
  import refreshRoutes from './routes/authRoutes/refreshRoutes.js'
  import deleteQuestion from './routes/question/deleteQuestion.js'
   import themeRoutes from './routes/themeContext.js'
  dotenv.config();
  const app = express();

  // CORS Configuration
  app.use(
    cors({
      origin: [

        "http://localhost:4001", // Optional for React dev server
        "http://localhost:5173",
        
        
      ],
      allowedHeaders: ["Authorization", "Content-Type"], // Add Authorization
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Specify allowed methods
      credentials: true,
     
    })
  );
  app.use((req, res, next) => {
  
    next();
  });
  
  app.use(cookieParser());
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // MongoDB Connection
  const mongoDb = async () => {
    console.log("MONGO_URL:", process.env.MONGO_URL);
    try {
      await mongoose.connect(process.env.MONGO_URL);
      console.log("MongoDB connected successfully")
    } catch (error) {
      
      process.exit(1); // Exit the process if MongoDB fails to connect
    }
  };
  mongoDb();

 

  // Use routes
  app.use("/api/auth", login);
  app.use("/api/auth", signup);
  app.use("/api/auth", home);
  app.use("/api/auth", sessionRoutes);
  app.use('/api/auth',refreshRoutes)
  app.use("/api/auth", logout);
  app.use("/api", answer);
  app.use("/api", questionRoutes);
  app.use("/api", userScore);
  app.use("/api", submitAnswerRoutes);
  app.use("/api", getLeaderboard);
  app.use('/api',deleteQuestion);
  app.use('/api',themeRoutes);


  // Serve React Frontend Static Build
  

  // Serve React build folder from frontend
  

  // Port and Host Configuration
  const port = process.env.PORT || 4001;
  //const host = process.env.HOST || "0.0.0.0";

  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on http://${port}`);
  });
