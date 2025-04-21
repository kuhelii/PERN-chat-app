import express from 'express';
import protectRoute from '../middleware/protectRoute.js';
import { sendMessage, getMessages, getUserForSidebar } from '../controllers/message.controller.js'; // Import sendMessage
const router = express.Router();
router.get("/conversations", protectRoute, getUserForSidebar);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);
export default router;
