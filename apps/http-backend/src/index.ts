import express, { Request, Response } from "express";
import jwt from "jsonwebtoken"
import { prismaClient } from "@repo/db/client"
import { JWT_SECRET } from "@repo/backend-common/config.ts";
import bcrypt from "bcrypt"
import { protect } from "./middleware";
import cookieParser from 'cookie-parser'
import cors from "cors";
const app = express();

app.use(cookieParser());
app.use(
    cors(
        {
            origin: 'http://localhost:3001', // Your frontend URL - be specific!
            credentials: true, // This is crucial
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }
    )
)
app.use(express.json());
app.post("/signup", async (req: Request, res: Response) => {
    const { email, password, name, confirmpassword } = req.body;
    if (!email || !password || !name || !confirmpassword) {
        return res.status(400).json({
            success: false,
            message: "Fields missing !!"
        })
    }
    if (password != confirmpassword) {
        return res.status(400).json({
            success: false,
            message: "pls check the password fields",
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
            message: "user added",
            success: true
        })
    }
    catch (err: any) {
        //console.log("erro: ", err.message);
        return res.status(400).json({
            error: err.message || "Server error",
            message: "User failed to be added",
            success: false

        })
    }


})
app.post("/signin", async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Fields missing !!"
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
        // const options = {
        //     expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        //     httpOnly: true,       // inaccessible to JS
        //     secure: false,        // localhost HTTP
        //     sameSite: "none",     // allow cross-site requests
        //     path: "/",            // cookie available on all routes
        // };
        return res.cookie('token', token,
            {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now,
                httpOnly: true,
                secure: false,
            }
        ).status(200).json({
            message: "user Signed in Successfully",
            success: true,
            token
        })
    }
    catch (err: any) {
        return res.status(400).json({
            error: err.message || "Server error",
            message: "User failed to be added",
            success: false

        })
    }

})
app.get("/me", protect, async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const user = await prismaClient.user.findFirst({
            where: {
                id: userId
            }
        })
        res.status(200).json({
            message: "user Found",
            success: true,
            user
        })

    }
    catch (err: any) {
        return res.status(400).json({
            error: err.message || "Server error",
            message: "User Not found",
            success: false

        })
    }
})
app.post('/logout', async (req: Request, res: Response) => {
    try {
        res.cookie('token', "***",
            {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now,
                httpOnly: true,
                secure: false,
            }
        ).status(200).json({
            message: "User Logout !!",
            success: true,
        })
    }
    catch (err: any) {
        return res.status(400).json({
            error: err.message || "Server error",
            message: "User failed to be added",
            success: false

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
        const existingRoom = await prismaClient.room.findFirst({
            where: {
                slug
            }
        })
        if (existingRoom) {
            return res.status(200).json({
                message: "Room already exists",
                success: false,
                room: existingRoom
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
            room: newRoom
        })
    }
    catch (err: any) {
        return res.status(400).json({
            error: err.message || "Server error",
            message: "User failed to be added"

        })
    }
})
app.delete("/deleteroom/:roomId", protect, async (req: Request, res: Response) => {
    try {
        const roomId = req.params.roomId;
        const userId = req.userId;
        await prismaClient.chat.deleteMany({
            where: {
                roomId: roomId
            }
        });// manual cascade deletion
        const deletedRoom = await prismaClient.room.delete({
            where: {
                id: roomId,
                adminId: userId
            }
        })
        return res.status(200).json({
            message: "Room Deleted",
            success: true,
            room: deletedRoom
        })
    }
    catch (err: any) {
        return res.status(400).json({
            error: err.message || "Server error",
            message: "Room deletion Failed"

        })
    }
})
app.get("/chats/:roomId", async (req, res) => {
    try {
        const roomId = req.params.roomId;
        console.log(req.params.roomId);
        const resp = await prismaClient.chat.findMany({
            where: {
                roomId: roomId
            },
            orderBy: {
                id: "desc"
            },
            take: 1000,
            select: {
                message: true
            }
        });
        const messages: any = [];
        resp.forEach((ele) => {
            messages.push(JSON.parse(ele.message));
        })
        return res.status(200).json({
            messages
        })
    } catch (e) {
        console.log(e);
        return res.json({
            messages: []
        })
    }

})
app.get("/room/:slug", async (req, res) => {
    try {
        const slug = req.params.slug;
        const room = await prismaClient.room.findFirst({
            where: {
                slug
            }
        });

        return res.status(200).json({
            success: true,
            roomId: room?.id,
            message: "Room Found"
        })
    }
    catch (err: any) {
        return res.status(400).json({
            success: false,
            message: err.message || "Internal server error"
        })
    }

})
app.get("/rooms", protect, async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        //console.log("hitt");
        if (!userId) {
            return res.status(400).json({
                message: "UserId missing",
                success: false
            })
        }
        const existingRooms = await prismaClient.room.findMany({
            where: {
                adminId: userId
            }
        })
        if (!existingRooms) {
            return res.status(400).json({
                message: "No Rooms Found !!",
                success: false,
            })
        }
        return res.status(200).json({
            message: "Rooms Fetched SuccessFully !!",
            success: true,
            rooms: existingRooms
        })
    }
    catch (err: any) {
        return res.status(400).json({
            error: err.message || "Server error",
            message: "Error while fetching Rooms"

        })
    }
})
app.listen("3030", () => {
    console.log("server started");
})