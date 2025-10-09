import { getRoomId } from "@/app/operations/auth";
import Button from "@/components/Button";
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
            <div className="h-screen w-screen bg-black text-white font-bold text-3xl flex flex-col gap-3 items-center justify-center ">
                <div>Room doesnt exist !!</div>
                <Button/>
            </div>
        )
    }
    return(
        <div>
            <DrawArea roomId={roomId}/>
        </div>
    )
}