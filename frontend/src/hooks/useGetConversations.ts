import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSocketContext } from "../context/useSocketContext";

// API URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const useGetConversations = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const { socket } = useSocketContext();

  useEffect(() => {
    const getConversations = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/messages/conversations`, {
          credentials: 'include',
        });
        const data = await res.json();

        if (res.ok) {
          setConversations(data);
        } else {
          throw new Error(data.error);
        }
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }
    getConversations();
  }, []);

  // Listen for new messages that might affect conversation order
  useEffect(() => {
    if (!socket) return;

    // When a new message arrives, refresh the conversations list
    // to ensure they're sorted by most recent activity
    const handleNewMessage = () => {
      const fetchConversations = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/api/messages/conversations`, {
            credentials: 'include',
          });
          const data = await res.json();
          if (res.ok) {
            setConversations(data);
          }
        } catch (error) {
          console.error("Error refreshing conversations:", error);
        }
      };
      fetchConversations();
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket]);

  return { conversations, loading };
}

export default useGetConversations;
