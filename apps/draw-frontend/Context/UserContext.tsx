"use client"
import React, {createContext, useEffect, useState} from "react";
type ContextType = {
    user:any,
    setUser:any,
}
 export const UserContext = createContext<ContextType>(
    {
        user:null,
        setUser:()=>{}
    }
 );
 import { getUser } from "@/app/operations/auth";

const UserProvider = ({children}:{children:React.ReactNode})=>{
    const [user,setUser]=useState<any>(null);
    useEffect(()=>{
        getUser().then((data)=>{
            setUser(data);
            console.log("Provider : ", data);
        }).catch((e)=>{
            console.log(e);
        })
    },[]);
    return(
        <UserContext.Provider value={{user,setUser}}>
            {children}
        </UserContext.Provider>
    )
}
export default UserProvider;
