"use client"
import { useEffect, useState } from "react";
import { getRooms } from "../operations/auth";

export default function Dashboard(){
    const [loading ,setLoading]=useState<boolean>(false);
    const [rooms,setRooms]=useState<any>([]);
    useEffect(()=>{
        setLoading(true);
        const token = localStorage.getItem("token");
        if(!token)
        {
            setLoading(false);
            return;
        }
        getRooms(token).then((res)=>{
            setLoading(false);
            let isodate = res[0].createdAt;
            const date = new Date(isodate);
            console.log(date.toLocaleDateString());
            console.log(res);
        }).catch((err)=>{
            console.log(err);
            setLoading(false);
        })
        

    },[])
    return(
        <div className="bg-black h-screen w-screen text-white flex items-center justify-center  flex-col gap-3 ">
           <div className="flex flex-row gap-x-2 items-center justify-center">
             <h1 className="text-3xl ">No Rooms Available !!! </h1>
            
           </div>
            <div className="flex flex-row gap-x-3">
                <button className="bg-gray-400 p-2 text-black rounded-md cursor-pointer hover:bg-gray-300 transition-colors delay-100 ">Create Room</button>
                <button className="bg-gray-400 p-2 text-black rounded-md cursor-pointer hover:bg-gray-300 transition-colors delay-100  ">Join Room</button>
            </div>
        </div>
    )
}