import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { useSocketContext } from "../context/useSocketContext";

// API URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const useGetMessages = () => {
    const [loading, setLoading] = useState(false);
    const { messages, setMessages, selectedConversation } = useConversation();
    const { socket } = useSocketContext();

    useEffect(() => {
        const getMessages = async () => {
            if (!selectedConversation) return;

            setLoading(true);
            try {
                const res = await fetch(`${API_BASE_URL}/api/messages/${selectedConversation.id}`, {
                    credentials: 'include',
                });
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error);
                }
                setMessages(data);
            } catch (error: any) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        }
        getMessages();
    }, [selectedConversation, setMessages]);

    // Listen for new messages from socket - this will update messages in real-time
    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (newMessage: MessageType) => {
            // Check if this message belongs to the current conversation
            if (selectedConversation && newMessage.conversationId === selectedConversation.id) {
                // Add the new message to the messages array
                setMessages([...messages, newMessage]);
            }
        };

        // Register the event listener
        socket.on("newMessage", handleNewMessage);

        // Clean up the event listener when component unmounts or dependencies change
        return () => {
            socket.off("newMessage", handleNewMessage);
        };
    }, [socket, selectedConversation, setMessages, messages]);

    return { messages, loading };
}

export default useGetMessages;
