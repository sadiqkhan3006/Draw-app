"use client"
import initDraw from "@/draw";
import useWebSocket from "@/hooks/usewebsocket";
import { Circle,Pencil,RectangleHorizontal,Minus,MoveUpRight } from 'lucide-react';
import { useContext, useEffect, useRef } from "react";
import IconButton from "./IconButton";
import { useState } from "react";
import { Dispatch } from "react";
import { SetStateAction } from "react";
import { deleteChats } from "@/app/operations/auth";
export type Tool = "Ellipse"|"Rectangle"|"Pencil"|"Line"|"Arrow";
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
                <TopBar selectedTool={selectedTool} setselectedTool={setselectedTool} roomId={roomId}/>
            </div>
        )
}
function TopBar({selectedTool,setselectedTool,roomId}:{selectedTool:Tool,setselectedTool:Dispatch<SetStateAction<Tool>>,roomId:string})
{
    return(
        <div className="absolute top-[2px] left-[2px] w-full text-white flex flex-row justify-between items-center ">
           <div className="bg-gray-400 p-3 flex flex-row gap-x-4 ">
             <IconButton Icon={Circle} selected={"Ellipse"===selectedTool} onClickFunction={setselectedTool} shape={'Ellipse'}/>
            <IconButton Icon={Pencil} selected={"Pencil"===selectedTool} onClickFunction={setselectedTool} shape={'Pencil'}/>
            <IconButton Icon={RectangleHorizontal} selected={"Rectangle"===selectedTool} onClickFunction={setselectedTool} shape={'Rectangle'}/>
            <IconButton Icon={Minus} selected={"Line"===selectedTool} onClickFunction={setselectedTool} shape={'Line'}/>
            <IconButton Icon={MoveUpRight} selected={"Arrow"===selectedTool} onClickFunction={setselectedTool} shape={'Arrow'}/>
           </div>
           
            <button
            onClick={async (e)=>{
                await deleteChats(roomId);
                setselectedTool(selectedTool=="Rectangle"?"Pencil":"Rectangle");
            }}
              className="bg-white cursor-pointer text-black px-4 py-2 rounded-lg font-medium hover:scale-105 hover:bg-gray-200 transition-all mr-3"
            >
              Delete Shapes
            </button>
           
        </div>
    )
}