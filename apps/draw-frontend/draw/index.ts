import { RefObject } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/app/config";
type Shapes = {
    type: "rect"
    x: number,
    y: number,
    width: number,
    height: number
}
export default async function initDraw(canvas: HTMLCanvasElement, wsRef: RefObject<WebSocket | null>, roomId: string, token: string | null) {
    const res = await axios.get(`${BACKEND_URL}/chats/${roomId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    console.log("existing shapes: ", res.data.messages);
    const existingShapes: Shapes[] = res.data.messages;

    let clicked: boolean = false;
    let startX = 0, startY = 0;
    let height = 0, width = 0;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    clearCanvas(ctx, canvas, existingShapes);
    if (wsRef.current) {
        wsRef.current.onmessage = (e) => {
            const data = JSON.parse(e.data);
            console.log(data.message);
            if (data.type === "message") {

                existingShapes.push(data.message);
                clearCanvas(ctx, canvas, existingShapes);
            }
            if (data.type === "onmessage") {


                clearCanvas(ctx, canvas, existingShapes);
                ctx.strokeStyle = "#FFFFFF";
                ctx?.strokeRect(data.message.x, data.message.y, data.message.width, data.message.height);
            }
        }
    }
    const handleMove = (e: MouseEvent) => {
        if (clicked) {
            width = (e.clientX - startX);
            height = (e.clientY - startY);
            clearCanvas(ctx, canvas, existingShapes);
            ctx.strokeStyle = "#FFFFFF";
            ctx?.strokeRect(startX, startY, width, height);
            let currShape: Shapes = { type: "rect", x: startX, y: startY, width, height }
            wsRef.current?.send(JSON.stringify({
                type: "ongoing",
                message: currShape,
                roomId
            }))

        }
    };
    const handleDown = (e: MouseEvent) => {
        clicked = true;
        if (clicked === true) {
            startX = e.clientX;
            startY = e.clientY;
        }


    };
    const handleUp = (e: MouseEvent) => {
        // clicked = !clicked;
        clicked = false;
        if (!clicked && width !== 0 && height !== 0) {
            let currShape: Shapes = { type: "rect", x: startX, y: startY, width, height };
            existingShapes.push(currShape);
            wsRef.current?.send(JSON.stringify({
                type: "chat",
                message: currShape,
                roomId
            }))
            console.log(existingShapes);
            width = 0;
            height = 0;
        }
        console.log("Mouseup:", e.clientX, e.clientY);
    };

    canvas.addEventListener("mousemove", handleMove);
    canvas.addEventListener("mousedown", handleDown);
    canvas.addEventListener("mouseup", handleUp);
    return {
        handleDown, handleMove, handleUp
    }
}
function clearCanvas(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, existingShapes: Shapes[]) {
    ctx?.clearRect(0, 0, canvas.width, canvas.height);//doesnt work for -ve
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    existingShapes.forEach(ele => {
        ctx.strokeStyle = "#FFFFFF";
        ctx?.strokeRect(ele.x, ele.y, ele.width, ele.height);
    });
}