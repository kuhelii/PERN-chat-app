import prisma from "../db/prisma.js";
import { getReciverSocketId, io } from "../socket/socket.js";
export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user.id;
        let conversation = await prisma.conversation.findFirst({
            where: {
                participantIds: {
                    hasEvery: [senderId, receiverId],
                }
            }
        });
        //the very first message is being sent,thats why we need a new conversation
        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    participantIds: {
                        set: [senderId, receiverId]
                    }
                }
            });
        }
        const newMessage = await prisma.message.create({
            data: {
                senderId,
                body: message,
                conversationId: conversation.id
            }
        });
        if (newMessage) {
            conversation = await prisma.conversation.update({
                where: {
                    id: conversation.id
                },
                data: {
                    messages: {
                        connect: {
                            id: newMessage.id,
                        },
                    },
                },
            });
        }
        // Enhance the message with additional data for the frontend
        const messageForClient = {
            ...newMessage,
            receiverId // Add receiverId to help the frontend identify the conversation
        };
        // socket io will be used to send the message to the reciver...make all the message in realtime
        const receiverSocketId = getReciverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", messageForClient);
        }
        // Also send the message to the sender's socket for updating their conversation list
        const senderSocketId = getReciverSocketId(senderId);
        if (senderSocketId) {
            io.to(senderSocketId).emit("newMessage", messageForClient);
        }
        res.status(201).json(newMessage);
    }
    catch (error) {
        console.error("Error in sendMessage:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user.id;
        const conversation = await prisma.conversation.findFirst({
            where: {
                participantIds: {
                    hasEvery: [senderId, userToChatId],
                }
            },
            include: {
                messages: {
                    orderBy: {
                        createAt: "asc"
                    }
                }
            }
        });
        if (!conversation) {
            return res.status(200).json([]);
        }
        res.status(200).json(conversation.messages);
    }
    catch (error) {
        console.error("Error in getMessages:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
export const getUserForSidebar = async (req, res) => {
    try {
        const authUserId = req.user.id;
        const users = await prisma.user.findMany({
            where: {
                id: {
                    not: authUserId,
                }
            },
            select: {
                id: true,
                fullname: true,
                profilePic: true,
            }
        });
        // Get latest messages for each user
        const usersWithMessages = await Promise.all(users.map(async (user) => {
            const conversation = await prisma.conversation.findFirst({
                where: {
                    participantIds: {
                        hasEvery: [authUserId, user.id],
                    }
                },
                include: {
                    messages: {
                        orderBy: {
                            createAt: "desc"
                        },
                        take: 1,
                    }
                }
            });
            return {
                ...user,
                lastMessage: conversation?.messages[0]?.body || "",
                lastMessageTime: conversation?.messages[0]?.createAt || null
            };
        }));
        const sortedUsers = usersWithMessages.sort((a, b) => {
            if (!a.lastMessageTime)
                return 1;
            if (!b.lastMessageTime)
                return -1;
            return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
        });
        res.status(200).json(sortedUsers);
    }
    catch (error) {
        console.error("Error in getMessages:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
