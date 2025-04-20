import {
  createContext,
  ReactNode,
  useRef,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuthContext } from "./AuthContext";

import io, { Socket } from "socket.io-client";

interface ISocketContext {
  socket: Socket | null;
  onlineUsers: string[];
  conversations: ConversationType[];
  setConversations: (conversations: ConversationType[]) => void;
}

const SocketContext = createContext<ISocketContext | undefined>(undefined);

export const useSocketContext = (): ISocketContext => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error(
      "useSocketContext must be used within a SocketContextProvider"
    );
  }
  return context;
};

const socketURL =
  import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

const SocketContextProvider = ({ children }: { children: ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const { authUser, isLoading } = useAuthContext();

  // Sort conversations by last message time
  const sortConversations = (convs: ConversationType[]) => {
    return [...convs].sort((a, b) => {
      if (!a.lastMessageTime) return 1;
      if (!b.lastMessageTime) return -1;
      return (
        new Date(b.lastMessageTime).getTime() -
        new Date(a.lastMessageTime).getTime()
      );
    });
  };

  useEffect(() => {
    if (authUser && !isLoading) {
      const socket = io(socketURL, {
        query: {
          userId: authUser.id,
        },
      });
      socketRef.current = socket;

      socket.on("getOnlineUsers", (users: string[]) => {
        setOnlineUsers(users);
      });

      socket.on("newMessage", (newMessage) => {
        // Update the conversations when a new message is received
        setConversations((prevConversations) => {
          const conversationExists = prevConversations.find(
            (conv) =>
              conv.id === newMessage.senderId ||
              conv.id === newMessage.receiverId
          );

          if (conversationExists) {
            // Update existing conversation
            const updatedConversations = prevConversations.map((conv) => {
              if (
                conv.id === newMessage.senderId ||
                conv.id === newMessage.receiverId
              ) {
                return {
                  ...conv,
                  lastMessage: newMessage.body,
                  lastMessageTime:
                    newMessage.createAt || new Date().toISOString(),
                };
              }
              return conv;
            });
            return sortConversations(updatedConversations);
          }

          return prevConversations;
        });
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
      value={{
        socket: socketRef.current,
        onlineUsers,
        conversations,
        setConversations: (convs) => setConversations(sortConversations(convs)),
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;
