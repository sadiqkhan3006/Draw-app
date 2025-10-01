"use client";
import Eye from "../icons/Eye"
import { signin, signup } from "../app/operations/auth";
import { useState } from "react";
import EyeClosed from "../icons/EyeClosed";
import { useRouter } from "next/navigation";

export default function Auth({ isSignup = false }) {
  const router = useRouter(); 
const [loading, setLoading] = useState<boolean>(false);
const [showpass,setshowpass]=useState(false);
const [showcpass,setshowcpass]=useState(false);//coonfirm passs variable 
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const handleChange = (e:any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
   function isValid():boolean{
    if(isSignup)
    {
        if(form.name !== "" && form.email !=="" && form.password !== "" && form.confirmpassword !==""
            && form.password === form.confirmpassword
        )
        {
            return true;
        }
        else{
            return false;
        }
    }
    if(form.email !== "" && form.password !=="" ) return true;
    return false;
  }
  const handleSubmit = async (e:any) => {
    e.preventDefault();
    if(!isValid())
    {
        alert("Enter missing fields");
        return;
    }
    if (isSignup) {
        setLoading(true);
        const res = await signup(form);
        setLoading(false);
        if(res)
        {
            router.push('/signin');
        }
        console.log(res);
      console.log("Signup Data:", form);
    } else {
        setLoading(true);
        const res = await signin(form);
        setLoading(false);
        if(res)
        {
            router.push('/dashboard');
        }
        console.log(res);
      console.log("Signin Data:", form);
    }
    setForm({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
  });
  setshowpass(false);
  setshowcpass(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black ">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isSignup ? "Create an Account" : "Sign In"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your name"
              />
            </div>
          )}

          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your email"
            />
          </div>

          <div className="relative">
            <label className="block text-gray-700">Password</label>
            <input
              type={showpass?"text":"password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your password"
            />
            <div onClick={()=>{
                setshowpass(prev=>!prev)
            }} className="cursor-pointer absolute right-[3%] top-[50%]  ">
                {
                    showpass?<EyeClosed/>:<Eye/>
                }
            </div>
          </div>

          {isSignup && (
            <div className="relative">
              <label className="block text-gray-700">Confirm Password</label>
              <input
                type={showcpass?"text":"password"}
                name="confirmpassword"
                value={form.confirmpassword}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Re-enter your password"
                
              />
              <div onClick={()=>{
                setshowcpass(prev=>!prev)
            }} className="cursor-pointer absolute right-[3%] top-[50%]  ">
                {
                    showcpass?<EyeClosed/>:<Eye/>
                }
            </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition cursor-pointer"
            disabled={loading?true:false}
          >
            {loading?"Loading..":(isSignup ? "Sign Up" : "Sign In")}
          </button>
        </form>
      </div>
    </div>
  );
}
