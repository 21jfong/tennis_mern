import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cloudinary from "cloudinary";
import multer from "multer";

import authRoutes from "./routes/auth.js";
import teamsRoutes from "./routes/teams.js";
import matchesRoutes from "./routes/matches.js";
import playerRoutes from "./routes/player.js";

dotenv.config();
const app = express();

// Cloudinary setup
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME, // Replace with your Cloudinary cloud name
  api_key: process.env.CLOUD_API_KEY, // Replace with your Cloudinary API key
  api_secret: process.env.CLOUD_API_SECRET, // Replace with your Cloudinary API secret
});

// Set up Multer for file handling (only allowing images)
const storage = multer.memoryStorage(); // Store images in memory for easy upload to Cloudinary
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("File is not an image"), false);
    }
  },
});

// Middleware for body parsing
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

const corsOptions = {
  origin: process.env.ORIGIN, // Allow requests only from your frontend
  methods: "GET,POST,PATCH,DELETE",
  credentials: true,
};
app.use(cors(corsOptions));

// Routes
app.use("/user", authRoutes);
app.use("/player", playerRoutes);
app.use("/my-teams", teamsRoutes);
app.use("/", matchesRoutes);

// Image upload endpoint
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // Upload the image to Cloudinary
  cloudinary.v2.uploader
    .upload_stream({ resource_type: "auto" }, (error, result) => {
      if (error) {
        return res.status(500).json({ message: "Upload failed", error });
      }

      // Return the secure URL of the uploaded image
      res.status(200).json({ url: result.secure_url });
    })
    .end(req.file.buffer);
});

// Basic route
app.get("/", (req, res) => {
  res.send("Accessing TennisTrack API");
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.CONNECTION_URL, {})
  .then(() =>
    app.listen(PORT, "0.0.0.0", () =>
      console.log(`Server running on port ${PORT}`)
    )
  )
  .catch((error) => console.log(error.message));
