import express from "express";
import cookieparser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

import dotenv from "dotenv";
import { app, server } from "./socket/socket.js";
dotenv.config();

const PORT = process.env.PORT || 5001;

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Apply middleware
app.use(express.json());
app.use(cookieparser());

// Configure CORS
const corsOrigin = process.env.NODE_ENV === "production" 
    ? process.env.CLIENT_URL || "https://your-app-name.onrender.com"
    : "http://localhost:5173";

app.use(cors({
    origin: corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Serve static files in production
if (process.env.NODE_ENV === "production") {
    const frontendDist = path.join(__dirname, "..", "..", "frontend", "dist");
    
    // Serve static files
    app.use(express.static(frontendDist));
    
    // Simple route to serve the index.html
    app.get("/", (req, res) => {
        res.sendFile(path.join(frontendDist, "index.html"));
    });

    // Serve index.html for all other routes (client-side routing)
    app.get(/.*/, (req, res) => {
        res.sendFile(path.join(frontendDist, "index.html"));
    });
}

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});


