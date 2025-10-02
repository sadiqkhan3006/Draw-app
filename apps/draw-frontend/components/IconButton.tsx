import { LucideIcon } from "lucide-react"
import { SetStateAction } from "react"
import { Dispatch } from "react"
import { ReactNode } from "react"
import { Tool } from "./DrawArea"

export default function IconButton({Icon,selected,onClickFunction,shape}:{
    Icon:LucideIcon,
    selected:boolean,
    onClickFunction:Dispatch<SetStateAction<Tool>>,
    shape:Tool
})
{
    return (
        <button onClick={()=>{
            onClickFunction(shape)
        }} >
           <Icon className={`${selected?"text-red-500":""} cursor-pointer`}/>
        </button>
    )
}