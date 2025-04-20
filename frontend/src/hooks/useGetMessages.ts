import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

// API URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const useGetMessages = () => {
    const [loading, setLoading] = useState(false);
    const { selectedConversation, messages, setMessages, lastMessagesFetched, setLastMessagesFetched } = useConversation();

    useEffect(() => {
        // Reset the messages state and lastMessagesFetched flag when conversation changes
        if (selectedConversation) {
            setMessages([]);
            setLastMessagesFetched(false);
        }
    }, [selectedConversation?.id, setMessages, setLastMessagesFetched]);

    useEffect(() => {
        // Only fetch messages if we have a selected conversation and haven't fetched messages yet
        if (selectedConversation && !lastMessagesFetched) {
            const getMessages = async () => {
                setLoading(true);
                try {
                    const res = await fetch(`${API_BASE_URL}/api/messages/${selectedConversation.id}`, {
                        credentials: 'include',
                    });
                    const data = await res.json();
                    if (data.error) {
                        throw new Error(data.error);
                    }
                    setMessages(data);
                    setLastMessagesFetched(true);
                } catch (error: any) {
                    toast.error(error.message);
                } finally {
                    setLoading(false);
                }
            };

            getMessages();
        }
    }, [selectedConversation, lastMessagesFetched, setMessages, setLastMessagesFetched]);

    return { loading, messages };
};

export default useGetMessages;
