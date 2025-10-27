import axios from "axios";
import {BACKEND_URL, TOKEN} from "../../config"
import ChatRoom   from "../../components/ChatRoom";
type Params = Promise<{ slug: string}>
export default async function Chat(props:{
    params:Params
})
{
    let roomId="";
    try{
        const { slug } =  await props.params;
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