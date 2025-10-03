import { getRoomId } from "@/app/operations/auth";
import DrawArea from "@/components/DrawArea";
export default async function Canvas({params}:{
    params:{
        roomId:string
    }
}){
    const slug:string = (await params).roomId;
   const roomId:string|null = await getRoomId(slug);
   console.log(roomId);
    if(!roomId)
    {
        return(
            <div>
                Room doesnt exist;
            </div>
        )
    }
    return(
        <div>
            <DrawArea roomId={roomId}/>
        </div>
    )
}