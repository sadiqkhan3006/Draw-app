import axios, { Axios, AxiosError } from "axios";
import { BACKEND_URL } from "../config"
import toast from "react-hot-toast";
interface Body {
    name?: String,
    email?: String,
    password: String,
    confirmPassword?: String,
}
export async function signup(body: Body) {
    const toastID = toast.loading("Loading..");
    try {
        const res = await axios.post(`${BACKEND_URL}/signup`, body);
        toast.success("User Created", { id: toastID });
        setTimeout(() => {
            toast.dismiss(toastID);
        }, 2000);
        return res.data;
    }
    catch (err: any) {
        console.log(err.response.data.message);
        toast.error(err.response.data.message, { id: toastID })
        setTimeout(() => {
            toast.dismiss(toastID);
        }, 2000);
        return;
    }
}
export async function signin(body: Body) {
    const toastID = toast.loading("Loading..")
    try {
        const res = await axios.post(`${BACKEND_URL}/signin`, body);
        localStorage.setItem("token", res.data.token);
        toast.success("Signed in Successfull", { id: toastID });
        setTimeout(() => {
            toast.dismiss(toastID);
        }, 2000);
        return res.data;
    }
    catch (err: any) {
        console.log(err.response.data.message);
        toast.error(err.response.data.message, { id: toastID })
        setTimeout(() => {
            toast.dismiss(toastID);
        }, 2000);
        return;
    }
}
