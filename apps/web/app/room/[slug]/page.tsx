import axios from "axios";
import {BACKEND_URL, TOKEN} from "../../config"
import ChatRoom   from "../../components/ChatRoom";
export default async function Chat({params}:{
    params:{
        slug:string
    }
})
{
    let roomId="";
    try{
        const slug= (await params).slug;
        const res = await axios.post(`${BACKEND_URL}/createroom`,{
        slug,token:TOKEN});
        roomId  = res.data.room.id;
        //console.log("Room: ",roomId);
    }
    catch(err:any)
    {
        console.log(err.message);
    }
    
    return<>
    <ChatRoom id={roomId}/>
    </>
}