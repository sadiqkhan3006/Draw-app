import { getRoomId } from "@/app/operations/auth";
import Button from "@/components/Button";
import DrawArea from "@/components/DrawArea";
import Unauthorized from "@/components/Unauthorized";
import { cookies } from "next/headers";

type Params = Promise<{ slug: string}>

export default async function Canvas(props: {
    params: Params
}) {
  // Await params and use the correct parameter name
  
  const { slug } =  await props.params;
  
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value ?? null;
  
  if (!token) {
    return (
      <div>
        <Unauthorized />
      </div>
    );
  }

  const roomId: string | null = await getRoomId(slug, token);
  console.log(roomId);

  if (!roomId) {
    return (
      <div className="h-screen w-screen bg-black text-white font-bold text-3xl flex flex-col gap-3 items-center justify-center">
        <div>Room doesn't exist !!</div>
        <Button />
      </div>
    );
  }

  return (
    <div>
      <DrawArea roomId={roomId} />
    </div>
  );
}