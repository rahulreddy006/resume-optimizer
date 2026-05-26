import express from "express";
import "dotenv/config";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import resumeRoutes from "./routes/resume.routes.js";
import analysisRoutes from "./routes/analysis.routes.js";


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


const PORT = process.env.PORT || 4000;

app.listen(PORT,()=>{
    console.log(`Server is listening to port ${PORT}`)
})