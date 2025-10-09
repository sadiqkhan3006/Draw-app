import { WebSocketServer, WebSocket } from "ws";
const wss = new WebSocketServer({ port: 8080 });
import jwt, { JwtPayload } from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/config.ts"
import { prismaClient } from "@repo/db/client";
import { v4 as uuidv4 } from "uuid";
function checkUser(token: string): string | null {
    try {
        const decoded: JwtPayload = jwt.verify(token, JWT_SECRET) as JwtPayload;
        //console.log(decoded);
        if (!decoded || !decoded.userId)
            return null;
        return decoded.userId;
    }
    catch (err: any) {
        console.log(err.message);
        return null;
    }

}
//defining state //
interface User {
    wsId: string
    userId: string,
    rooms: string[],
    ws: WebSocket,
}
interface Data {
    type: string,
    roomId: string,
    message?: string
}
let users: User[] = [];
wss.on('connection', (ws, request) => {
    const id = uuidv4();
    const url = request.url;
    if (!url) return;
    const queryParams = new URLSearchParams(url?.split("?")[1]);
    const token = queryParams.get("token") || "";
    const userId = checkUser(token);
    if (!userId) {
        ws.close();
        return;
    }
    users.push({
        wsId: id,
        userId,
        ws,
        rooms: []
    })
    console.log(users.length);
    ws.on("message", async (data) => {
        //console.log(users);
        const str = data.toString();
        let parsed_data: Data = JSON.parse(str);
        if (parsed_data.type === "join_room") {
            try {
                let user = users.find(ele => ele.ws === ws);
                if (!user?.rooms.includes(parsed_data.roomId)) {
                    user?.rooms.push(parsed_data.roomId);
                    return ws.send(JSON.stringify({
                        type: "notification",
                        success: true,
                        payload: {
                            message: "Room joined successfully"
                        }
                    }))
                }
                else {
                    //already joined//
                    return ws.send(JSON.stringify({
                        type: "notification",
                        success: false,
                        payload: {
                            message: "Room already exists!!"
                        }
                    }))
                }
            }
            catch (err: any) {
                console.log(err.message);
            }
        }
        if (parsed_data.type === "leave_room") {
            let user = users.find(ele => ele.ws === ws);
            if (!user) return;
            user.rooms = user.rooms.filter(x => x !== parsed_data.roomId);
            console.log(user.rooms);
            return ws.send(JSON.stringify({
                type: "notification",
                success: true,
                payload: {
                    message: "Room Deleted!!"
                }
            }))
        }
        if (parsed_data.type === "chat") {
            const roomId = parsed_data.roomId;
            const message = parsed_data.message;
            if (!message) return;

            try {
                console.log(roomId);
                await prismaClient.chat.create({
                    data: {
                        roomId,
                        message: JSON.stringify(message),
                        userId
                    }
                })
                users.forEach(user => {
                    console.log(message);
                    if (user.rooms.includes(roomId) && user.ws !== ws) {
                        user.ws.send(JSON.stringify({
                            type: "message",
                            message,
                            roomId,

                        }))
                    }
                })
            }
            catch (err: any) {
                console.log(err.message);
                return ws.send(JSON.stringify({
                    type: "room_delete",
                    message: "Room Deleted by Admin !!"

                }))
            }

        }
        if (parsed_data.type === "ongoing") {
            const message = parsed_data.message;
            const roomId = parsed_data.roomId;
            users.forEach(user => {
                console.log(message);
                if (user.rooms.includes(roomId) && user.ws !== ws) {
                    user.ws.send(JSON.stringify({
                        type: "onmessage",
                        message,
                        roomId,

                    }))
                }
            })
        }

    })
    ws.on("close", (code, reason) => {
        console.log(`❌ Connection closed. Code: ${code}, Reason: ${reason}`);
        users = users.filter((user) => user.ws !== ws)
        //console.log(users)
    });
})
// join message 
// {
//     type:"join-room",
//     roomId:"string",
// }