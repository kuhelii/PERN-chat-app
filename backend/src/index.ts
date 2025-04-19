import express from "express";
import cookieparser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

import dotenv from "dotenv";
import { server } from "./socket/socket.js";
dotenv.config();

const PORT=process.env.PORT || 5001;

const app = express();

app.use(cookieparser());//for parsing cookies
app.use(express.json());// for parsing application/json
app.use(cors());

app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes)

server.listen(PORT, () => {
    console.log("Server is running on port "+ PORT);
});

//do later: add socket.io for real time messaging
//configure this server for the deployment


