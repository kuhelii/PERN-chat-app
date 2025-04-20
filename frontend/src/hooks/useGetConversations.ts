import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSocketContext } from "../context/SocketContext";

// API URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const useGetConversations = () => {
  const [loading, setLoading] = useState(false);
  const { conversations, setConversations } = useSocketContext();
  const [fetchedInitialData, setFetchedInitialData] = useState(false);

  useEffect(() => {
    // Only fetch conversations if we haven't done it already
    if (!fetchedInitialData) {
      const getConversations = async () => {
        setLoading(true);
        try {
          const res = await fetch(`${API_BASE_URL}/api/messages/conversations`, {
            credentials: 'include',
          });
          const data = await res.json();
          if (data.error) {
            throw new Error(data.error);
          }
          setConversations(data);
          setFetchedInitialData(true);
        } catch (error: any) {
          toast.error(error.message);
        } finally {
          setLoading(false);
        }
      }
      getConversations();
    }
  }, [setConversations, fetchedInitialData]);

  return { loading, conversations };
};

export default useGetConversations
