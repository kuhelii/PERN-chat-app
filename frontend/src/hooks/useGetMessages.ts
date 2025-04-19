import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

// API URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const useGetMessages = () => {
    const [loading, setLoading] = useState(false);
    const { messages, setMessages, selectedConversation } = useConversation();

    useEffect(() => {
        const getMessages = async () => {

            if (!selectedConversation) return;

            setLoading(true);
            setMessages([]);
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
    }, [selectedConversation, setMessages])

    return { messages, loading };

}

export default useGetMessages
