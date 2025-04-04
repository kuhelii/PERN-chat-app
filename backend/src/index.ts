import express from "express";
import cookieparser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cookieparser());//for parsing cookies
app.use(express.json());// for parsing application/json

app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes)

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});

//do later: add socket.io for real time messaging
//configure this server for the deployment


