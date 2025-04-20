import {
  createContext,
  ReactNode,
  useRef,
  useContext,
  useEffect,
  useState,
  useCallback,
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

  // Memoize the sort function to avoid unnecessary re-sorts
  const sortConversations = useCallback((convs: ConversationType[]) => {
    return [...convs].sort((a, b) => {
      if (!a.lastMessageTime) return 1;
      if (!b.lastMessageTime) return -1;
      return (
        new Date(b.lastMessageTime).getTime() -
        new Date(a.lastMessageTime).getTime()
      );
    });
  }, []);

  // Memoize the setConversations handler to avoid unnecessary re-renders
  const handleSetConversations = useCallback(
    (convs: ConversationType[]) => {
      setConversations(sortConversations(convs));
    },
    [sortConversations]
  );

  useEffect(() => {
    // Only connect socket if user is authenticated and not in loading state
    if (authUser && !isLoading) {
      // Prevent multiple socket connections
      if (socketRef.current) {
        socketRef.current.close();
      }

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
          const otherUserId =
            newMessage.senderId === authUser.id
              ? newMessage.receiverId
              : newMessage.senderId;

          const conversationExists = prevConversations.find(
            (conv) => conv.id === otherUserId
          );

          if (conversationExists) {
            // Update existing conversation
            const updatedConversations = prevConversations.map((conv) => {
              if (conv.id === otherUserId) {
                return {
                  ...conv,
                  lastMessage: newMessage.body,
                  lastMessageTime:
                    newMessage.createdAt || new Date().toISOString(),
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
        socket.off("newMessage");
        socket.off("getOnlineUsers");
        socket.close();
        socketRef.current = null;
      };
    } else if (!authUser && !isLoading) {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    }
  }, [authUser, isLoading, sortConversations]);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        onlineUsers,
        conversations,
        setConversations: handleSetConversations,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;
