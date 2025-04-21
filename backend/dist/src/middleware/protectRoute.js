import Jwt from "jsonwebtoken";
import prisma from "../db/prisma.js";
const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized - no token provided" });
        }
        const decoded = Jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized - invalid token" });
        }
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, fullname: true, username: true, profilePic: true }
        });
        if (!user) {
            return res.status(401).json({ error: " user not found" });
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.log("error in protectRoute middleware", error.message);
        return res.status(401).json({ error: "Internal server errior" });
    }
};
export default protectRoute;
