import axios, { Axios, AxiosError } from "axios";
import { BACKEND_URL } from "../config"
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Router, RouterEvent } from "next/router";

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
        const res = await axios.post(`${BACKEND_URL}/signin`, body, {
            withCredentials: true
        });
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
export async function getUser() {
    try {
        const res = await axios.get(`${BACKEND_URL}/me`, {
            withCredentials: true,
        })
        console.log("/me: ", res.data?.user);
        return res.data?.user;
    }
    catch (err: any) {
        console.log(err.message);
        return null;
    }
}
export async function getRoomId(slug: string) {
    try {
        const res = await axios.get(`${BACKEND_URL}/room/${slug}`);
        return res.data.roomId;
    }
    catch (err: any) {
        console.log(err.response.data.message);
        return null;
    }
}
export async function getRooms(token: string) {
    const toastID = toast.loading("Fetching Rooms !!")
    try {
        //console.log(token);
        const res = await axios.get(`${BACKEND_URL}/rooms`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        toast.success("Rooms Fetched !!", { id: toastID });
        setTimeout(() => {
            toast.dismiss(toastID);
        }, 2000);

        return res.data.rooms;
    }
    catch (err: any) {
        console.log(err.response.data.message);
        toast.error(err.response.data.message, { id: toastID })
        setTimeout(() => {
            toast.dismiss(toastID);
        }, 2000);
        return null;
    }
}
export async function createRoom(slug: string) {
    const toastID = toast.loading("Creating new Room !!");

    try {
        //console.log(token);
        //const router = useRouter();
        const res = await axios.post(`${BACKEND_URL}/createroom`, {
            slug
        }, {
            withCredentials: true
        });
        toast.success(res.data?.message, { id: toastID });
        setTimeout(() => {
            toast.dismiss(toastID);
        }, 2000);
        console.log(res.data.room);
        return res.data.room;
    }
    catch (err: any) {
        console.log(err.response.data.message);
        toast.error(err.response.data.message, { id: toastID })
        setTimeout(() => {
            toast.dismiss(toastID);
        }, 2000);
        return null;
    }
}
export async function deleteRoom(roomId: string) {
    const toastID = toast.loading("Deleting..");
    try {
        const res = await axios.delete(`${BACKEND_URL}/deleteroom/${roomId}`, {
            withCredentials: true
        });
        toast.success(res.data?.message, { id: toastID });
        setTimeout(() => {
            toast.dismiss(toastID);
        }, 2000);
        console.log(res.data);
        return res.data?.success;
    }
    catch (err: any) {
        console.log(err.response.data.message);
        toast.error(err.response.data.message, { id: toastID })
        setTimeout(() => {
            toast.dismiss(toastID);
        }, 2000);
        return false;
    }
}
