import MessageContainer from "../components/messages/MessageContainer";
import Sidebar from "../components/sidebar/Sidebar";
import { useSocketContext } from "../context/useSocketContext";
import { useEffect } from "react";
import useConversation from "../zustand/useConversation";

const Home = () => {
  const { socket } = useSocketContext();
  const { selectedConversation, messages, setMessages } = useConversation();

  // Listen for new messages at the app level to ensure proper refresh
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage: MessageType) => {
      // Only update if it belongs to the current conversation
      if (
        selectedConversation &&
        newMessage.conversationId === selectedConversation.id
      ) {
        setMessages([...messages, newMessage]);
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedConversation, messages, setMessages]);

  return (
    <div className="flex h-[80vh] w-full md:max-w-screen-md md:h-[550px] p-6 bg-white-500 rounded-md bg-clip-padding backdrop-filter backdrop-blur-2xl bg-opacity-20 border border-gray-300">
      <Sidebar />
      <MessageContainer />
    </div>
  );
};
export default Home;
