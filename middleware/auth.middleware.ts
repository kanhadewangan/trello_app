
import prisma from "../prisma/prisma";

import { type NextFunction, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();


export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
        const user = await prisma.users.findFirst({ where: { id: decoded.userId } });
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        (req as any).user = user;
        next();
    } catch (error) {
        
        return res.status(401).json({ message: "Unauthorized" });
    }
}