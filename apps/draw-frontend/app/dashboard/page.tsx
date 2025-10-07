"use client"
import { useEffect, useState } from "react";
import { getRooms } from "../operations/auth";
import {Trash2} from "lucide-react"
import Modal from "@/components/Modal";
interface Room {
    id:string,
    adminId:string,
    createdAt:string,
    slug:string

}

export default function Dashboard(){
    const [loading ,setLoading]=useState<boolean>(false);
    const [rooms,setRooms]=useState<Room[]>([]);
    const [modal,setmodal]= useState(false);
    function fetchDate(s:string)
    {
        const date = new Date(s);
        return date.toLocaleDateString();
    }
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
            setRooms(res);
        }).catch((err)=>{
            console.log(err);
            setLoading(false);
        })
        

    },[])
    if(loading)
    {
        return(
            <div>Loading..</div>
        )
    }
    return(
        <>
        {
            rooms.length == 0 && 
            <div className="bg-black h-screen w-screen text-white flex items-center justify-center  flex-col gap-3 ">
           <div className="flex flex-row gap-x-2 items-center justify-center">
             <h1 className="text-3xl ">No Rooms Available !!! </h1>
            
           </div>
            <div className="flex flex-row gap-x-3">
                <button className="bg-gray-400 p-2 text-black rounded-md cursor-pointer hover:bg-gray-300 transition-colors delay-100 ">Create Room</button>
                <button className="bg-gray-400 p-2 text-black rounded-md cursor-pointer hover:bg-gray-300 transition-colors delay-100  ">Join Room</button>
            </div>
        </div>
        }
       {
        rooms.length !=0 && 
         <div className="bg-black pt-2">
            <div className="flex flex-row-reverse gap-x-2 p-2">
                 <button 
                 onClick={(e)=>{
                    setmodal(true)
                 }}
                 className="bg-gray-400 p-2 text-black rounded-md cursor-pointer hover:bg-gray-300 transition-colors delay-100 ">Create Room</button>
                <button className="bg-gray-400 p-2 text-black rounded-md cursor-pointer hover:bg-gray-300 transition-colors delay-100  ">Join Room</button>
            </div>
            <div className="bg-black h-screen w-screen text-white flex  flex-col gap-3 ">
           {
            rooms.map((room,index)=>(
                <div className="bg-gray-300 text-2xl cursor-pointer hover:bg-gray-100  text-black p-4 flex flex-row justify-between items-center m-6 rounded-md 
                transition-all delay-100 hover:scale-[102%] " key={index}>
                   <div>
                     <div> <span className="font-bold">Room Name: </span>{room.slug}</div>
                    <div><span className="font-bold">Created On : </span>{fetchDate(room.createdAt)}</div>
                   </div>
                   <div className="text-red-500 cursor-pointer">
                    <Trash2/>
                   </div>
                </div>
            ))
           }
        </div>
         </div>
       }
      {modal &&  <Modal setmodal={setmodal}/>}
        </>
    )
}