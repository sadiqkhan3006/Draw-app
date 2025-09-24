"use client"
import { useState } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
export default function Home() {
  const [slug,slugId] = useState("");
  const router = useRouter();
  return (
    <div className={styles.page}>
     <input className="bg-[#fff] text-black p-2" type="text" value={slug} onChange={(e)=>{
      slugId(e.target.value)
     }}></input>
     <button className="" onClick={()=>{
      if(slug === ""){
        alert("Give a room name !!");
        return;
      }
      router.push(`/room/${slug}`)
     }}>Join room</button>
     
    </div>
  );
}
