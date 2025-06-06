import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

// API URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();
  const sendMessage = async (message: string) => {
    if (!selectedConversation) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/messages/send/${selectedConversation.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
          credentials: "include",
        }
      );
      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setMessages([...messages, data]);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return { sendMessage, loading };
};

export default useSendMessage;
