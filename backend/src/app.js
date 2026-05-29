import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import resumeRoutes from "./routes/resume.routes.js";
import analysisRoutes from "./routes/analysis.routes.js";
import { initSocket } from './utils/socket.js';
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { globalErrorHandler } from "./middlewares/errorHandler.js";
import session from "express-session";
import passport from "./config/passport.js";



const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
  })
);


app.use(express.json());
app.use(cookieParser());
app.use(
  session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure:
      process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production"
        ? "none"
        : "lax",
  },
})
);

app.use(passport.initialize());
app.use("/api/auth",authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/analyses", analysisRoutes); 


app.get("/",(req,res)=>{
    res.send("SERVER IS WORKING");
})

app.get("/health",(req,res)=>{
    res.status(200).json({
        status:"OK"
    })
});
app.use(globalErrorHandler);
const server = http.createServer(app);

// 2. Attach Socket.io to that HTTP server
initSocket(server);


const PORT = process.env.PORT || 4000;

server.listen(PORT,()=>{
    console.log(`Server is listening to port ${PORT}`)
})