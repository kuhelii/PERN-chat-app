import {Server} from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const server = http.createServer(app);

// Configure Socket.IO based on environment
const allowedOrigins = process.env.NODE_ENV === "production"
    ? [process.env.CLIENT_URL || "https://your-app-name.onrender.com"]
    : ["http://localhost:5173"];

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true
    },
    // Add configuration to handle potential connection issues
    pingTimeout: 60000,
    path: "/socket.io/"
});

export const getReciverSocketId = (reciverId: string) => {
    return userSocketMap[reciverId];
}

const userSocketMap: {[key: string]: string} = {};

io.on("connection", (socket) => {
    console.log("a user connected ", socket.id);
    const userId = socket.handshake.query.userId as string;

    if (userId) {
        userSocketMap[userId] = socket.id;
        console.log(`User ${userId} connected with socket ID ${socket.id}`);
        
        // Emit to all clients that a new user is online
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }

    socket.on("disconnect", () => {
        console.log("user disconnected ", socket.id);
        if (userId) {
            delete userSocketMap[userId];
            console.log(`User ${userId} disconnected and removed from online users.`);
            // Emit updated online users list after disconnect
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        }
    });

    // Handle connection errors
    socket.on("error", (error) => {
        console.error("Socket error:", error);
    });
});

export {app, io, server};

