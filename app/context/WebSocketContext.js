'use client';
import { createContext, useEffect, useState } from 'react';

export const WebSocketContext = createContext();

export function WebSocketProvider({ children }) {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:5000');

        ws.onopen = () => {
            console.log('Connected to WebSocket server');
            setSocket(ws);
        };

        ws.onclose = () => {
            console.log('Disconnected from WebSocket server');
            setSocket(null);
        };

        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, []);

    return (
        <WebSocketContext.Provider value={socket}>
            {children}
        </WebSocketContext.Provider>
    );
}