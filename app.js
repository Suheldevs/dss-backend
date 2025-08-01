import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import apiRoute from "./routers/modules.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import dbConnection from "./config/dbConnection.js";
import cors from "cors";
import cookieParser from 'cookie-parser';
import cloudinary from "cloudinary";


cloudinary.v2.config({
   cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
   api_key:process.env.CLOUDINARY_API_KEY,
   api_secret:process.env.CLOUDINARY_API_SECRET
})

dotenv.config();
const port = process.env.PORT || 8000;
  
const app = express();
app.use(morgan("dev"));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser()); // ✅ VERY IMPORTANT

app.use(cors({
  origin: ['http://localhost:3000', 'https://yourdomain.com',"http://localhost:5173",
    "https://dss-crm.netlify.app","https://dss-crm.netlify.app","https://512e89c94599.ngrok-free.app",
    "https://9tcwr6rk-5173.inc1.devtunnels.ms"
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use("/api/v1", apiRoute);


app.get("/", (req, res) => {
  res.status(200).json("Server started successfully!");
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  
  });
});

app.use(errorMiddleware);


// ✅ Start Server
app.listen(port, async () => {
  await dbConnection();
  console.log(`🚀 Server running on http://localhost:${port}`);
});
