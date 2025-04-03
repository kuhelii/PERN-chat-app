import  Jwt  from "jsonwebtoken";

import { NextFunction, Request, Response } from "express";
import prisma from "../db/prisma.js";

interface DecodedToken extends Jwt.JwtPayload {
    userId: string; }

declare global{
    namespace Express{
        export interface Request{
            user:{
                id:string;
            }
        }
    }
}    
const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ error: "Unauthorized - no token provided" });
        }

        const decoded = Jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

        if (!decoded) { 
            return res.status(401).json({ error: "Unauthorized - invalid token" });
        }

        const user=await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, fullname: true, username: true, profilePic: true }})

            if (!user) {
                return res.status(401).json({ error: " user not found" });
            }

        req.user=user;

        next();

    }catch(error:any) {
        console.log("error in protectRoute middleware",error.message);
        return res.status(401).json({ error: "Internal server errior" });
    }
}

export default protectRoute;