import { JWT_SECRET } from "@repo/backend-common/config.ts";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
declare global {
    namespace Express {
        interface Request {
            userId?: string
        }
    }
}
export function protect(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.body?.token || req.header("Authorization")?.replace("Bearer ", "");
        console.log("tokennn", token);
        if (!token) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Token is missing"
                }
            )
        }
        const decode = jwt.verify(token, JWT_SECRET) as JwtPayload;
        req.userId = decode.userId;
        next();

    }
    catch (err: any) {
        return res.status(500).json({
            success: false,
            message: "Invaid token",
            error: err.message,
        })
    }
}