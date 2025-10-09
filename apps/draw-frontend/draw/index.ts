import { RefObject } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/app/config";
import { Tool } from "@/components/DrawArea";
import toast from "react-hot-toast";
interface Points {
    x: number,
    y: number,
}
type Shapes = {
    type: "Rectangle"
    x: number,
    y: number,
    width: number,
    height: number
} | {
    type: "Ellipse",
    x: number,
    y: number,
    radiusX: number,
    radiusY: number,
    rotation: number,
    startAngle: number,
    endAngle: number
} | {
    type: "Pencil",
    points: Points[]
}
export default async function initDraw(canvas: HTMLCanvasElement, wsRef: RefObject<WebSocket | null>, roomId: string, token: string | null, selectedTool: Tool) {
    const res = await axios.get(`${BACKEND_URL}/chats/${roomId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    //console.log("existing shapes: ", res.data.messages);
    const existingShapes: Shapes[] = res.data.messages;

    let clicked: boolean = false;
    let startX = 0, startY = 0;
    let height = 0, width = 0;
    let points: Points[] = []
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
                if (data.message.type === "Rectangle") {
                    clearCanvas(ctx, canvas, existingShapes);
                    ctx.strokeStyle = "#FFFFFF";
                    ctx?.strokeRect(data.message.x, data.message.y, data.message.width, data.message.height);
                }
                else if (data.message.type === "Ellipse") {
                    clearCanvas(ctx, canvas, existingShapes);
                    ctx.strokeStyle = "#FFFFFF";
                    ctx.beginPath();
                    ctx.ellipse(data.message.x, data.message.y, data.message.radiusX, data.message.radiusY, data.message.rotation, data.message.startAngle, data.message.endAngle);
                    ctx.stroke();
                }
                else if (data.message.type === "Pencil") {

                    ctx.beginPath();
                    ctx.moveTo(data.message.points[0].x, data.message.points[0].y);
                    //@ts-ignore
                    data.message.points.forEach(point => {
                        ctx.strokeStyle = "#FFFFFF";
                        ctx.lineTo(point.x, point.y);

                    });
                    ctx.stroke();
                }

            }
            if (data.type === "room_delete") {
                toast.error(data.message);
                window.location.reload();
            }
        }
    }
    const handleMove = (e: MouseEvent) => {
        if (clicked) {
            if (selectedTool === "Rectangle") {
                //console.log("REcttt");
                console.log("Current Tool", selectedTool);
                width = (e.clientX - startX);
                height = (e.clientY - startY);
                clearCanvas(ctx, canvas, existingShapes);
                ctx.strokeStyle = "#FFFFFF";
                ctx?.strokeRect(startX, startY, width, height);
                let currShape: Shapes = { type: "Rectangle", x: startX, y: startY, width, height }
                wsRef.current?.send(JSON.stringify({
                    type: "ongoing",
                    message: currShape,
                    roomId
                }))
            }
            else if (selectedTool === "Ellipse") {
                //console.log("Ellipse");
                console.log("Current Tool", selectedTool);
                width = e.clientX - startX;
                height = e.clientY - startY;
                clearCanvas(ctx, canvas, existingShapes);
                ctx.strokeStyle = "#FFFFFF";
                ctx.beginPath();
                ctx.ellipse(startX + (width / 2), startY + (height / 2), Math.abs(width / 2), Math.abs(height / 2), 0, 0, 2 * Math.PI);
                ctx.stroke();
                let currShape: Shapes = { type: "Ellipse", x: startX + (width / 2), y: startY + (height / 2), radiusX: Math.abs(width / 2), radiusY: Math.abs(height / 2), rotation: 0, startAngle: 0, endAngle: 2 * Math.PI };
                wsRef.current?.send(JSON.stringify({
                    type: "ongoing",
                    message: currShape,
                    roomId
                }))
            }
            else if (selectedTool == "Pencil") {

                ctx.strokeStyle = "#FFFFFF";
                points.push({ x: e.clientX, y: e.clientY });
                let currShape: Shapes = { "type": "Pencil", points };
                ctx.lineTo(e.clientX, e.clientY);
                ctx.stroke()
                wsRef.current?.send(JSON.stringify({
                    type: "ongoing",
                    message: currShape,
                    roomId
                }))
                //console.log("points", points)
            }


        }
    };
    const handleDown = (e: MouseEvent) => {
        clicked = true;
        if (clicked === true) {
            startX = e.clientX;
            startY = e.clientY;
            if (selectedTool == "Pencil") {
                ctx.beginPath();
                ctx.moveTo(startX, startY);
            }
        }


    };
    const handleUp = (e: MouseEvent) => {
        // clicked = !clicked;
        clicked = false;
        if (!clicked) {
            if (width !== 0 && height !== 0 && selectedTool === "Rectangle") {
                let currShape: Shapes = { type: "Rectangle", x: startX, y: startY, width, height };
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
            else if (width !== 0 && height !== 0 && selectedTool === "Ellipse") {
                let currShape: Shapes = { type: "Ellipse", x: startX + (width / 2), y: startY + (height / 2), radiusX: Math.abs(width / 2), radiusY: Math.abs(height / 2), rotation: 0, startAngle: 0, endAngle: 2 * Math.PI };
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
            else if (selectedTool === "Pencil") {
                console.log("heyyyy");
                let currShape: Shapes = { type: "Pencil", points };
                existingShapes.push(currShape);
                wsRef.current?.send(JSON.stringify({
                    type: "chat",
                    message: currShape,
                    roomId
                }))
                points = [];
                console.log(existingShapes);
            }

        }
        //console.log("Mouseup:", e.clientX, e.clientY);
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
    //console.log("Exxisting shape : ", existingShapes);
    existingShapes.forEach(ele => {
        if (ele.type === "Rectangle") {
            ctx.strokeStyle = "#FFFFFF";
            ctx?.strokeRect(ele.x, ele.y, ele.width, ele.height);
        }
        else if (ele.type === "Ellipse") {
            ctx.strokeStyle = "#FFFFFF";
            ctx.beginPath();
            ctx.ellipse(ele.x, ele.y, ele.radiusX, ele.radiusY, ele.rotation, ele.startAngle, ele.endAngle);
            ctx.stroke();
        }
        else if (ele.type === "Pencil") {
            ctx.beginPath();
            //console.log("pp:", ele.points);
            if (ele.points.length === 0) return;
            ctx.moveTo(ele.points[0].x, ele.points[0].y);
            ele.points.forEach(point => {
                ctx.strokeStyle = "#FFFFFF";
                ctx.lineTo(point.x, point.y);

            });
            ctx.stroke();
        }

    });
}