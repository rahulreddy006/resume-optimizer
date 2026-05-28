import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import authRoutes from "./routes/auth.routes.js";
import resumeRoutes from "./routes/resume.routes.js";
import analysisRoutes from "./routes/analysis.routes.js";
import { initSocket } from './utils/socket.js';



const app = express();

app.use(cors());
app.use(express.json());
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

const server = http.createServer(app);

// 2. Attach Socket.io to that HTTP server
initSocket(server);


const PORT = process.env.PORT || 4000;

server.listen(PORT,()=>{
    console.log(`Server is listening to port ${PORT}`)
})