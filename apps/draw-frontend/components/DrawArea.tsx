"use client"
import initDraw from "@/draw";
import useWebSocket from "@/hooks/usewebsocket";
import { useEffect, useRef } from "react";
export default function DrawArea({roomId}:{
    roomId:string
})
{
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
            const token =localStorage.getItem("token");
            const canvas = canvasRef.current;
            let listners:any;
            if(canvas)
            {
                listners = initDraw(canvas, wsRef,roomId,token);
            }
            return () => {
          canvas?.removeEventListener("mousemove", listners?.handleMove);
          canvas?.removeEventListener("mousedown", listners?.handleDown);
          canvas?.removeEventListener("mouseup", listners?.handleUp);
        };            
        },[loading])
        if(loading)
        {
            return(<div>
                Connecting to server..
            </div>)
        }
        return(
            <div className="overflow-hidden">
                <canvas
                ref={canvasRef} width={2000} height={2000} style={{ border: "2px solid red" }} ></canvas>
            </div>
        )
}