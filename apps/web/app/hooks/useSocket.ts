import { useEffect, useRef } from "react";
import { TOKEN, WS_URL } from "../config";

export default function useSocket() {
    const wsReff = useRef<WebSocket | null>(null);
    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=${TOKEN}`);
        ws.onopen = () => {
            wsReff.current = ws;
        }
    }, [])
    return { wsReff };
}