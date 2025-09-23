import { WebSocketServer, WebSocket } from "ws";
const wss = new WebSocketServer({ port: 8080 });
import jwt, { JwtPayload } from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/config.ts"
import { prismaClient } from "@repo/db/client";
function checkUser(token: string): string | null {
    try {
        const decoded: JwtPayload = jwt.verify(token, JWT_SECRET) as JwtPayload;
        console.log(decoded);
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
    userId: string,
    rooms: string[],
    ws: WebSocket,
}
interface Data {
    type: string,
    roomId: string,
    message?: string
}
const users: User[] = [];
wss.on('connection', (ws, request) => {
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
        userId,
        ws,
        rooms: []
    })
    ws.on("message", async (data) => {
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
                await prismaClient.chat.create({
                    data: {
                        roomId,
                        message,
                        userId
                    }
                })
                users.forEach(user => {

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
                console.log(err.message)
            }

        }
        console.log(users);

    })
})
// join message 
// {
//     type:"join-room",
//     roomId:"string",
// }