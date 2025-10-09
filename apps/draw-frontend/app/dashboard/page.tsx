"use client";
import { useEffect, useRef, useState } from "react";
import { deleteRoom, getRooms } from "../operations/auth";
import { Trash2, SquarePen, FolderOpen, Home } from "lucide-react";
import Modal from "@/components/Modal";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Room {
  id: string;
  adminId: string;
  createdAt: string;
  slug: string;
}

export default function Dashboard() {
  const [loading, setLoading] = useState<boolean>(false);
  const isJoin = useRef<boolean>(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [modal, setmodal] = useState(false);
  const router = useRouter();

  function fetchDate(s: string) {
    const date = new Date(s);
    return date.toLocaleDateString();
  }

  function createRoom(e: any) {
    e.preventDefault();
    isJoin.current = false;
    setmodal(true);
  }

  function joinRoom(e: any) {
    e.preventDefault();
    isJoin.current = true;
    setmodal(true);
  }

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    getRooms(token)
      .then((res) => {
        setRooms(res);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen bg-black text-white flex items-center justify-center">
        <div className="text-lg animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {/* Empty State */}
      {rooms.length === 0 && (
        <div className="bg-black h-screen w-screen text-white flex flex-col items-center justify-center gap-4 px-4">
          {/* Top bar with Home icon */}
          <div className="absolute top-4 left-4 flex items-center gap-2 text-white font-semibold cursor-pointer hover:text-blue-400 transition-colors"
               onClick={() => router.push("/")}>
            <Home className="w-5 h-5" />
            <span>Home</span>
          </div>

          <FolderOpen className="w-16 h-16 text-gray-500 mb-2" />
          <h1 className="text-3xl font-semibold text-center">
            No Rooms Available
          </h1>
          <p className="text-gray-400 text-center max-w-md">
            Create a new room or join an existing one to start collaborating.
          </p>
          <div className="flex flex-row gap-3 mt-4">
            <button
              onClick={createRoom}
              className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:scale-105 hover:bg-gray-200 transition-all"
            >
              Create Room
            </button>
            <button
              onClick={joinRoom}
              className="bg-gray-800 border border-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 hover:scale-105 transition-all"
            >
              Join Room
            </button>
          </div>
        </div>
      )}

      {/* Rooms List */}
      {rooms.length !== 0 && (
        <div className="min-h-screen bg-black text-white px-6 py-8">
          {/* Top bar */}
          <div className="flex justify-between items-center mb-8 px-2">
            {/* Home Icon + Text */}
            <div
              onClick={() => router.push("/")}
              className="flex items-center gap-2 text-white font-semibold cursor-pointer hover:text-blue-400 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={createRoom}
                className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:scale-105 hover:bg-gray-200 transition-all"
              >
                Create Room
              </button>
              <button
                onClick={joinRoom}
                className="bg-gray-800 border border-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 hover:scale-105 transition-all"
              >
                Join Room
              </button>
            </div>
          </div>

          {/* Rooms Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 flex flex-col justify-between hover:scale-[1.02] transition-transform shadow-lg"
              >
                <div>
                  <h2 className="text-xl font-semibold mb-1">{room.slug}</h2>
                  <p className="text-sm text-gray-400">
                    Created on {fetchDate(room.createdAt)}
                  </p>
                </div>
                <div className="flex justify-end gap-4 mt-4">
                  <SquarePen
                    onClick={() => {
                      const toastId = toast.loading("Opening...");
                      router.push(`/canvas/${room.slug}`);
                      toast.dismiss(toastId);
                    }}
                    className="cursor-pointer text-white hover:text-blue-400 transition-colors"
                  />
                  <Trash2
                    onClick={async () => {
                      await deleteRoom(room.id);
                      setTimeout(() => {
                        window.location.reload();
                      }, 1000);
                    }}
                    className="cursor-pointer text-red-500 hover:text-red-400 transition-colors"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {modal && <Modal isJoin={isJoin} setmodal={setmodal} />}
    </>
  );
}
