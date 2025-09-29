"use client"
import initDraw from "@/draw";
import { useEffect, useRef } from "react"
export default function Canvas(){
    const canvasRef = useRef<HTMLCanvasElement|null>(null);
    useEffect(()=>{
        const canvas = canvasRef.current;
        let listners:any;
        if(canvas)
        {
            listners = initDraw(canvas);
        }
        return () => {
      canvas?.removeEventListener("mousemove", listners?.handleMove);
      canvas?.removeEventListener("mousedown", listners?.handleDown);
      canvas?.removeEventListener("mouseup", listners?.handleUp);
    };            
    },[canvasRef])
    return(
        <div>
            <canvas
            ref={canvasRef} width={2000} height={2000} style={{ border: "2px solid red" }} ></canvas>
        </div>
    )
}