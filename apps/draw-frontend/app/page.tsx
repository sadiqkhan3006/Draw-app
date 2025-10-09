"use client"
import { UserContext } from "@/Context/UserContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext } from "react";


export default function Home() {
  const router = useRouter()
  const {user,setUser} = useContext(UserContext);
  return (
   <div className="bg-black text-2xl text-white h-screen w-screen overflow-hidden  " >
    <section className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Collaborate. Create. In Real Time.
        </h1>
        <p className="text-gray-400 text-lg md:text-xl mb-8">
          Draw together with your team on a seamless multiplayer canvas.
        </p>
        <div className="flex gap-4 justify-center">
          {
            user? <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 cursor-pointer bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition"
          >
            Dashboard
          </button>: <>
          <button
            onClick={() => router.push('/signup')}
            className="px-6 py-3 cursor-pointer bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition"
          >
            Sign Up
          </button>
          <button
            onClick={() => router.push('/signin')}
            className="px-6 py-3 cursor-pointer border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-black transition"
          >
            Sign In
          </button></>
          }
         
        </div>
      </div>
    </section>
   </div>
  );
}
