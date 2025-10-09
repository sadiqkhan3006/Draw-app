"use client"
import UserProvider from "./UserContext"

const Provider = ({children}:{children:React.ReactNode})=>{
    return(
        <UserProvider>
            {children}
        </UserProvider>
    )
}
export default Provider;
