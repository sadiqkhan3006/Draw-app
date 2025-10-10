"use client"
import initDraw from "@/draw";
import useWebSocket from "@/hooks/usewebsocket";
import { Circle,Pencil,RectangleHorizontal } from 'lucide-react';
import { useContext, useEffect, useRef } from "react";
import IconButton from "./IconButton";
import { useState } from "react";
import { Dispatch } from "react";
import { SetStateAction } from "react";
export type Tool = "Ellipse"|"Rectangle"|"Pencil";
export default function DrawArea({roomId}:{
    roomId:string
})
{
    const [selectedTool,setselectedTool]=useState<Tool>("Rectangle");
    const {loading,wsRef}=useWebSocket(roomId);
    const canvasRef = useRef<HTMLCanvasElement|null>(null);
    useEffect(()=>{
        if(!wsRef.current) return;
        wsRef.current.onmessage=(e)=>{
            let data = JSON.parse(e.data);
            if(data.type === 'notification')
            {
                console.log(data.payload.message);
            }
        }
    },[wsRef])
        useEffect(()=>{
            const canvas = canvasRef.current;
    const token = localStorage.getItem("token");
    let listners:any=null;

    if (!canvas) return;

    let isMounted = true;

    (async () => {
        listners = await initDraw(canvas, wsRef, roomId, token, selectedTool);
        if (!isMounted && listners) {
            // in case unmounted before initDraw finished
            canvas.removeEventListener("mousemove", listners.handleMove);
            canvas.removeEventListener("mousedown", listners.handleDown);
            canvas.removeEventListener("mouseup", listners.handleUp);
        }
    })();

    return () => {
        isMounted = false;
        if (listners) {
            canvas.removeEventListener("mousemove", listners.handleMove);
            canvas.removeEventListener("mousedown", listners.handleDown);
            canvas.removeEventListener("mouseup", listners.handleUp);
        }
    };           
        },[loading,selectedTool])
        if(loading)
        {
            return(<div className="flex h-screen w-screen items-center justify-center text-white bg-black font-bold text-3xl">
                Connecting to server..
            </div>)
        }
        return(
            <div className="overflow-hidden">
                <canvas
                ref={canvasRef} width={window.innerWidth} height={window.innerHeight} style={{ border: "1px solid red" }} ></canvas>
                <TopBar selectedTool={selectedTool} setselectedTool={setselectedTool}/>
            </div>
        )
}
function TopBar({selectedTool,setselectedTool}:{selectedTool:Tool,setselectedTool:Dispatch<SetStateAction<Tool>>})
{
    return(
        <div className="absolute top-[2px] p-3  left-[2px] bg-gray-400 text-white flex flex-row gap-x-4">
            <IconButton Icon={Circle} selected={"Ellipse"===selectedTool} onClickFunction={setselectedTool} shape={'Ellipse'}/>
            <IconButton Icon={Pencil} selected={"Pencil"===selectedTool} onClickFunction={setselectedTool} shape={'Pencil'}/>
            <IconButton Icon={RectangleHorizontal} selected={"Rectangle"===selectedTool} onClickFunction={setselectedTool} shape={'Rectangle'}/>
        </div>
    )
}