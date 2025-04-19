import express, { Request, Response, RequestHandler } from 'express';
import { login, logout, signup, getMe } from "../controllers/auth.controller.js";
import protectRoute from '../middleware/protectRoute.js';

const router = express.Router();

router.get("/me", protectRoute as RequestHandler, getMe as RequestHandler);
router.post("/signup", signup as RequestHandler);
router.post("/login", login as RequestHandler);
router.post("/logout", logout as RequestHandler);

export default router;