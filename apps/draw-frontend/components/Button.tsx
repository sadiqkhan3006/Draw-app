"use client"
import { useRouter } from "next/navigation"

export default function Button()
{
    const router = useRouter();
    return(
        <>
            <button
                onClick={(e)=>{
                    router.push('/dashboard');
                }}
                className="bg-gray-400 p-2 text-lg font-md text-black rounded-md cursor-pointer hover:bg-gray-300 transition-colors delay-100  ">Dashboard</button>
        </>
    )
}