import { Dispatch, RefObject, SetStateAction, useState } from "react";
import { CircleX } from "lucide-react";
import { createRoom } from "@/app/operations/auth";
import { useRouter } from "next/navigation";

export default function Modal({
  setmodal,
  isJoin,
}: {
  setmodal: Dispatch<SetStateAction<boolean>>;
  isJoin: RefObject<boolean>;
}) {
  const [slug, setslug] = useState("");
  const router = useRouter();

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setmodal(false)}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20"
      ></div>

      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center z-30">
        <div className="relative w-[90%] max-w-sm bg-white rounded-xl shadow-xl p-6 flex flex-col gap-4">
          {/* Close Button */}
          <button
            onClick={() => setmodal(false)}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition"
          >
            <CircleX className="w-6 h-6" />
          </button>

          {/* Title */}
          <h2 className="text-2xl font-semibold text-gray-800 text-center">
            {isJoin.current ? "Join a Room" : "Create a Room"}
          </h2>

          {/* Input */}
          <div className="flex flex-col gap-2">
            <label htmlFor="room" className="text-gray-700 font-medium">
              Room Name
            </label>
            <input
              id="room"
              value={slug}
              onChange={(e) => setslug(e.target.value)}
              placeholder="Enter room name"
              className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Action Button */}
          {isJoin.current ? (
            <button
              onClick={() => router.push(`/canvas/${slug}`)}
              className="w-full py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
            >
              Join Room
            </button>
          ) : (
            <button
              onClick={async () => {
                await createRoom(slug);
                setTimeout(() => {
                  window.location.reload();
                }, 500);
              }}
              className="w-full py-2 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 transition"
            >
              Create Room
            </button>
          )}
        </div>
      </div>
    </>
  );
}
