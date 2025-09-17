import { WebSocketServer } from "ws";
const wss = new WebSocketServer({ port: 8080 });
wss.on('connection', (ws, request) => {
    const url = request.url;
    if (!url) return;
    const queryParams = new URLSearchParams(url?.split("?")[1]);
    const token = queryParams.get("token");
    if (!token) {
        ws.send("INvalid token");
        ws.close();
    }
    ws.on("message", (data) => {

        console.log("received: ", JSON.stringify(data))
    })
})
