"use client"
import { useEffect, useState } from "react";
import useSocket from "../hooks/useSocket";

export default function ChatRoomClient({messages,id}:{
    messages:{message:string}[],
    id:string
})
{
    const [chats,setchats]=useState(messages);
    const [typedmessage,settypedmessage]=useState("");
    const {wsReff} = useSocket();
    useEffect(()=>{
        wsReff?.current?.send(JSON.stringify({
            type:"join_room",
            roomId:id,
        }));
        if(!wsReff.current) return;
        wsReff.current.onmessage = (e)=>{
            let data = JSON.parse(e.data);
            if(data.type==="chat")
            {
                setchats(prev=>[...prev,data.message]);

            }
        }

        ()=>{
            wsReff.current?.close()
        }
    },[wsReff,id]);
const handleSend = ()=>{
  if(typedmessage.length === 0)
  {
    alert("Type a message");
    return ;
  }
          wsReff.current?.send(JSON.stringify({
            type:"chat",
            message:typedmessage,
            roomId:id
          }))
          setchats(prev=>[...prev,{message:typedmessage}]);
          settypedmessage("");
          
        }
    return (
        <>
        <div className='bg-black h-screen w-screen flex flex-col'>
      <div className='bg-slate-400 min-h-[90%] flex flex-col gap-1.5  overflow-y-auto text-black'>
        {chats?.map((info,index)=>{
         return(
          <div key={index} className='w-full bg-amber-200 pl-1.5 text-2xl'>
            <div>{info.message}</div>
          </div>
         )
        })}
        {/* <div ref={messageend}></div> */}
      </div>
      <div className='flex flex-row h-full'>
        <input
         onKeyDown={(e)=>{
          if(e.key =="Enter")
          {
            e.preventDefault();
            handleSend();  
          }
         }}
      value={typedmessage}
        onChange={(e) => 
            settypedmessage(e.target.value)
        }
         className='bg-amber-100 w-[90%] h-[60%]
        pl-2 text-2xl text-black  '/>
        <button onClick={handleSend} className='bg-slate-200 h-[60%] w-[10%] cursor-pointer hover:bg-slate-300 text-black '>Send</button>
      </div>
      </div>
        </>
    )
}