import {Server} from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

// Configure Socket.IO based on environment
const allowedOrigins = process.env.NODE_ENV === "production"
    ? [process.env.CLIENT_URL || "https://your-production-url.com"]
    : ["http://localhost:5173"];

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true
    },
    pingTimeout: 60000
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
    }

    // Emit the updated list of online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("user disconnected ", socket.id);
        if (userId) {
            delete userSocketMap[userId];
            console.log(`User ${userId} disconnected and removed from online users.`);
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export {app, io, server};

