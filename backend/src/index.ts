import express from "express";
import cookieparser from "cookie-parser";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

import dotenv from "dotenv";
import { app, server } from "./socket/socket.js";
dotenv.config();

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// Apply middleware to the app imported from socket.js
app.use(cookieparser());
app.use(express.json());

// Configure CORS based on environment
const corsOrigin = process.env.NODE_ENV === "production" 
    ? process.env.CLIENT_URL || "https://your-production-url.com"
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
    // Serve static files
    app.use(express.static(path.join(__dirname, "frontend", "dist")));
    
    // Handle client-side routing
    app.get("/", (req, res) => {
        res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
    });
    
    // Catch-all route for client-side routing
    app.get("/*", (req, res) => {
        res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
    });
}

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});


