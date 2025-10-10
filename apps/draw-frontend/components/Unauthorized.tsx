"use client"
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function Unauthorized() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white px-4">
      <div className="bg-neutral-900 shadow-2xl rounded-xl p-8 flex flex-col items-center gap-4 max-w-sm w-full border border-neutral-800">
        <Lock className="w-12 h-12 text-red-500" />
        <h1 className="text-2xl font-semibold">Unauthorized</h1>
        <p className="text-gray-400 text-center">
          You don’t have permission to access this page.  
          Please log in to continue.
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 w-full py-2 cursor-pointer rounded-md bg-red-600 text-white font-medium hover:bg-red-700 transition"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}
