import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import sharp from "sharp";
import convert from "heic-convert";
import { fileTypeFromBuffer } from "file-type";
import streamifier from "streamifier";

import authRoutes from "./routes/auth.js";
import teamsRoutes from "./routes/teams.js";
import matchesRoutes from "./routes/matches.js";
import playerRoutes from "./routes/player.js";
import trackingRoutes from "./routes/tracking.js";

dotenv.config();
const app = express();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Multer storage and file filter
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const isHeicExt = /\.(heic|heif)$/i.test(file.originalname);
  const isImageMime = file.mimetype.startsWith("image/");

  if (
    isImageMime ||
    isHeicExt ||
    file.mimetype === "application/octet-stream"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (JPG, PNG, HEIC) are allowed"));
  }
};

// Allow up to 15MB uploads (we'll resize down to 5MB internally)
const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB
  fileFilter,
});

// Middleware
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
const allowedOrigins = process.env.ORIGIN?.split(",") || [];
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,POST,PATCH,DELETE",
  credentials: true,
};
app.use(cors(corsOptions));

// Routes
app.use("/user", authRoutes);
app.use("/player", playerRoutes);
app.use("/my-teams", teamsRoutes);
app.use("/tracking", trackingRoutes);
app.use("/", matchesRoutes);

// Image upload endpoint
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    let buffer = req.file.buffer;
    const info = await fileTypeFromBuffer(buffer);

    // Convert HEIC/HEIF to JPEG if needed
    if (info?.mime === "image/heic" || info?.mime === "image/heif") {
      buffer = await convert({
        buffer,
        format: "JPEG",
        quality: 0.8,
      });
    }

    // Resize if still too large
    if (buffer.length > 5 * 1024 * 1024) {
      buffer = await sharp(buffer)
        .resize({ width: 1920 })
        .jpeg({ quality: 80 })
        .toBuffer();
    }

    // Upload to Cloudinary via upload_stream
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "user_avatars" },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      streamifier.createReadStream(buffer).pipe(uploadStream);
    });

    // Return the secure URL
    res.json({ url: uploadResult.secure_url });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});

// Basic test route
app.get("/", (req, res) => {
  res.send("Accessing TennisTrack API");
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.CONNECTION_URL)
  .then(() =>
    app.listen(PORT, "0.0.0.0", () =>
      console.log(`Server running on port ${PORT}`)
    )
  )
  .catch((error) => console.error(error));
