import express, { Request, Response } from "express";
import jwt from "jsonwebtoken"
import { prismaClient } from "@repo/db/client"
import { JWT_SECRET } from "@repo/backend-common/config.ts";
import bcrypt from "bcrypt"
import { protect } from "./middleware";
const app = express();

app.use(express.json());
app.post("/signup", async (req: Request, res: Response) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
        return res.status(400).json({
            message: "Fields missing !!"
        })
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prismaClient.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                photo: "..."//temp 
            }
        })
        console.log("USer: ", newUser);
        return res.status(200).json({
            newUser,
            message: "user added"
        })
    }
    catch (err: any) {
        //console.log("erro: ", err.message);
        return res.status(400).json({
            error: err.message || "Server error",
            message: "User failed to be added"

        })
    }


})
app.post("/signin", async (req: Request, res: Response) => {
    const { email, password, confirmpassword } = req.body;
    if (!email || !password || !confirmpassword) {
        return res.status(400).json({
            message: "Fields missing !!"
        })
    }
    if (password != confirmpassword) {
        return res.status(400).json({
            message: "pls check the password fields",
        })
    }
    try {
        const user = await prismaClient.user.findFirst({
            where: {
                email,
            },

        })
        if (!user) {
            return res.status(400).json({
                message: "user doesnt exist",
                success: false
            })
        }
        //use bcrypt afte
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({
                message: "Password Incorrect!!",
                success: false
            })
        }
        const payload = {
            userId: user?.id
        }
        const token = jwt.sign(payload, JWT_SECRET);
        return res.status(200).json({
            message: "user Signed in Successfully",
            success: true,
            token
        })
    }
    catch (err: any) {
        return res.status(400).json({
            error: err.message || "Server error",
            message: "User failed to be added"

        })
    }

})
app.post("/createroom", protect, async (req: Request, res: Response) => {
    try {
        const { slug } = req.body;
        const userId = req.userId;
        if (!slug || !userId) {
            return res.status(400).json({
                message: "Provide room details",
                success: false
            })
        }
        const newRoom = await prismaClient.room.create({
            data: {
                slug,
                adminId: userId,
            },
            include: {
                admin: true
            }
        })
        return res.status(200).json({
            message: "Room created",
            success: true,
            roomDetails: newRoom
        })
    }
    catch (err: any) {
        return res.status(400).json({
            error: err.message || "Server error",
            message: "User failed to be added"

        })
    }
})

app.listen("3030", () => {
    console.log("server started");
})