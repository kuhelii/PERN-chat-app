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

// Get the root project directory (going up from backend/dist/src)
const rootDir = path.join(__dirname, '..', '..', '..');

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
    // Define the correct path to frontend dist
    const frontendDist = path.join(rootDir, "frontend", "dist");
    console.log('Serving static files from:', frontendDist);
    
    // Serve static files
    app.use(express.static(frontendDist));
    
    // Handle all routes
    app.get("*", (req, res) => {
        // Log the requested path and the file we're trying to send
        const indexHtml = path.join(frontendDist, "index.html");
        console.log('Request path:', req.path);
        console.log('Serving index.html from:', indexHtml);
        
        res.sendFile(indexHtml);
    });
}

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});


