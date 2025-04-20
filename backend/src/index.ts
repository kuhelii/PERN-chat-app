import express from "express";
import cookieparser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

import dotenv from "dotenv";
import { app, server } from "./socket/socket.js";
dotenv.config();

const PORT = process.env.PORT || 5001;

// Apply middleware to the app imported from socket.js
app.use(cookieparser());//for parsing cookies
app.use(express.json());// for parsing application/json


app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true, // This allows cookies to be sent with cross-origin requests
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)

server.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});

//do later: configure this server for the deployment


