import axios from "axios";
import { BACKEND_URL } from "../config";
import ChatRoomClient from "./ChatRoomClient";

async function getChats(id:string)
{
    const res = await axios.get(`${BACKEND_URL}/chats/${id}`);
    return res.data.messages;
}
export default async function ChatRoom({id}:{id:string})
{
    console.log(id);
    let messages = await getChats(id);
    console.log(messages);
    return(
        <>
            <div>Chats</div>
            <ChatRoomClient id={id} messages={messages}/>
        </>
    )
}