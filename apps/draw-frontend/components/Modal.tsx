import { Dispatch, SetStateAction, useState } from "react"
import {CircleX} from "lucide-react"
import { createRoom } from "@/app/operations/auth"
import { useRouter } from "next/navigation";
export default function Modal({setmodal}:{
    setmodal: Dispatch<SetStateAction<boolean>>
})
{
    const [slug,setslug]= useState('');
    const router = useRouter();
        return(
        <>
         <div  className="bg-black opacity-60 backdrop-blur-sm absolute h-screen w-screen top-0 right-0  z-20
        flex items-center justify-center
        "> </div>
        <div className="absolute h-screen w-screen top-0 right-0 flex justify-center items-center z-30">
            <div className="bg-gray-300 p-4 rounded-md text-xl flex flex-col gap-3">
                <div 
                onClick={(e)=>{
                    setmodal(false)
                }}
                className="flex flex-row-reverse cursor-pointer
                
                "><CircleX/></div>
                <div>
                    <div>Room Name:</div>
                    <input value={slug}
                    onChange={(e)=>{setslug(e.target.value)}}
                    className="p-2 bg-white mt-2  "/>
                </div>
                <button onClick={async (e)=>{
                    const room = await createRoom(slug);
                    window.location.reload();
                }} className=" cursor-pointer w-full">Create Room</button>
            </div>
        </div>
        </>
       
    )
}