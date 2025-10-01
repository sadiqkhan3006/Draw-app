"use client"
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";


export default function Home() {
  const router = useRouter()
  return (
   <div className="bg-black text-2xl text-white h-screen w-screen overflow-hidden  " >
    <h1>Draw app</h1>
    <button onClick={
      ()=>{
        router.push('/signup')
      }
    }>Signup</button>
    <button onClick={
      ()=>{
        router.push('/signin')
      }
    }>Signin</button>
   </div>
  );
}
