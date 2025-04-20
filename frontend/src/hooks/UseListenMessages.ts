import { useEffect } from 'react';

import { useSocketContext } from '../context/SocketContext';
import useConversation from '../zustand/useConversation';
import notificationSound from "../assets/sounds/notification.mp3";

const UseListenMessages = () => {
    const { socket } = useSocketContext();
    const { setMessages } = useConversation();

    useEffect(() => {
        socket?.on("newMessage", (newMessage) => {
            newMessage.shouldShake = true;
            const sound = new Audio(notificationSound);
            sound.play();
            // Use functional update pattern to avoid dependency on messages
            setMessages(prevMessages => {
                // Check if this message belongs to the current selected conversation
                const selectedConversation = useConversation.getState().selectedConversation;
                if (selectedConversation && newMessage.senderId === selectedConversation.id) {
                    return [...prevMessages, newMessage];
                }
                return prevMessages;
            });
        })

        return () => {
            socket?.off("newMessage");
        };
    }, [socket, setMessages]);
};

export default UseListenMessages

