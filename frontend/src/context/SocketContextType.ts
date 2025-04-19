import { Socket } from "socket.io-client";
import { createContext } from "react";

export interface SocketContextType {
    socket: Socket | null;
    onlineUsers: string[];
    setOnlineUsers: (users: string[]) => void;
}

// Create and export the context with a more descriptive default value
export const SocketContext = createContext<SocketContextType>({
    socket: null,
    onlineUsers: [],
    setOnlineUsers: () => { }
});