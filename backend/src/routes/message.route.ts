import express, { Request, Response, RequestHandler } from 'express';
import protectRoute from '../middleware/protectRoute.js';
import { sendMessage,getMessages,getUserForSidebar } from '../controllers/message.controller.js'; // Import sendMessage

const router = express.Router();

router.get("/conversations", protectRoute as RequestHandler, getUserForSidebar as RequestHandler);
router.get("/:id", protectRoute as RequestHandler, getMessages as RequestHandler);

router.post("/send/:id", protectRoute as RequestHandler, sendMessage);

export default router;



