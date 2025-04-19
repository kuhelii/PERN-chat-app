import { ReactNode, useRef, useEffect, useState } from "react";

import { useAuthContext } from "./AuthContext";
import { SocketContext } from "./SocketContextType";

import { io, Socket } from "socket.io-client";

const socketURL =
  import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

const SocketContextProvider = ({ children }: { children: ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const { authUser, isLoading } = useAuthContext();

  useEffect(() => {
    if (authUser && !isLoading) {
      // Create socket connection
      const socket = io(socketURL, {
        query: {
          userId: authUser.id,
        },
      });

      socketRef.current = socket;

      // Listen for connected event
      socket.on("connect", () => {
        console.log("Socket connected successfully!");
      });

      // Listen for connection errors
      socket.on("connect_error", (err) => {
        console.error("Socket connection error:", err.message);
      });

      // Listen for online users
      socket.on("getOnlineUsers", (users: string[]) => {
        console.log("Online users received:", users);
        setOnlineUsers(users);
      });

      return () => {
        socket.close();
        socketRef.current = null;
      };
    } else if (!authUser && !isLoading) {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    }
  }, [authUser, isLoading]);

  return (
    <SocketContext.Provider
      value={{ socket: socketRef.current, onlineUsers, setOnlineUsers }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;
