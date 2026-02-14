'use client';

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useSocketLogic } from '@/hooks/useSocketLogic'; // Make sure this path is correct

type WebSocketContextType = {
  sendMessage: (type: string, data: any) => void;
  isConnected: boolean;
};

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export function WebSocketProvider({ children, roomCode }: { children: React.ReactNode, roomCode: string }) {
  const socket = useRef<WebSocket | null>(null);
  const messageQueue = useRef<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // 1. Get the business logic
  const { handleMessage } = useSocketLogic();

  // 2. Store logic in Ref to avoid reconnect loops
  const handlerRef = useRef(handleMessage);
  useEffect(() => { handlerRef.current = handleMessage; }, [handleMessage]);

  const connect = useCallback(() => {
    if (!roomCode) return;

    let backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "localhost:8080";
    backendUrl = backendUrl.replace(/^https?:\/\//, '');
    const protocol = backendUrl.includes("localhost") ? "ws" : "wss";
    const wsUrl = `${protocol}://${backendUrl}/ws?room=${roomCode}`;

    console.log(`🔌 Connecting to Room [${roomCode}]: ${wsUrl}`);

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("✅ Connected!");
      setIsConnected(true);
      while (messageQueue.current.length > 0) {
        const msg = messageQueue.current.shift();
        if (msg) ws.send(msg);
      }
    };

    ws.onclose = () => {
      console.log("❌ Disconnected. Retrying in 3s...");
      setIsConnected(false);
      setTimeout(connect, 3000);
    };

    ws.onerror = (err) => {
      console.error("⚠️ Error:", err);
      ws.close();
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        handlerRef.current(msg);
      } catch (e) {
        console.error("WS Parse Error", e);
      }
    };

    socket.current = ws;
  }, [roomCode]); 

  // Initial Connection
  useEffect(() => {
    connect();
    return () => {
      socket.current?.close();
    };
  }, [connect]);

  const sendMessage = (type: string, data: any) => {
    const payload = JSON.stringify({ type, data, room: roomCode });
    if (socket.current?.readyState === WebSocket.OPEN) {
      socket.current.send(payload);
    } else {
      console.warn(`⏳ Queuing message: ${type}`);
      messageQueue.current.push(payload);
    }
  };

  return (
    <WebSocketContext.Provider value={{ sendMessage, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) throw new Error("useWebSocket must be used within a WebSocketProvider");
  return context;
}