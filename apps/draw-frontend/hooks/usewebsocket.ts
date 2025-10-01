"use client"
import { WS_URL } from "../app/config"
import { useEffect, useRef, useState } from "react";
export default function useWebSocket(roomId: string
) {
    const [loading, setLoading] = useState<boolean>(true);
    const wsRef = useRef<WebSocket | null>(null)
    useEffect(() => {
        const token = localStorage.getItem('token');
        const ws = new WebSocket(`${WS_URL}?token=${token}`);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log("✅ WebSocket connected");
            wsRef.current?.send(JSON.stringify({
                type: 'join_room',
                roomId,
            }))
            setLoading(false);
        };

        ws.onclose = (event) => {
            console.warn(
                `❌ WebSocket closed (code: ${event.code}, reason: ${event.reason || "no reason"})`
            );
            setLoading(true);
        };

        // cleanup on unmount
        return () => {
            ws.close();
        };
    }, [])

    return {
        wsRef, loading
    }

}