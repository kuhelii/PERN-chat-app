import { Request, Response } from "express";
import prisma from "../db/prisma.js";
import { getReciverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req: Request, res: Response) => {
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
        })

        //the very first message is being sent,thats why we need a new conversation
        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    participantIds: {
                        set: [senderId, receiverId]
                    }
                }
            })
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
                    // Update the conversation timestamp
                    updateAt: new Date()
                },
            });
        }

        // Socket.io functionality for real-time messaging
        const receiverSocketId = getReciverSocketId(receiverId);
        if (receiverSocketId) {
            // For real-time message update
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        // Also emit the message to the sender for real-time updates
        const senderSocketId = getReciverSocketId(senderId);
        if (senderSocketId) {
            io.to(senderSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage)


    } catch (error: any) {
        console.error("Error in sendMessage:", error.message);
        res.status(500).json({ error: "Internal server error" });

    }
}

export const getMessages = async (req: Request, res: Response) => {
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
        })

        if (!conversation) {
            return res.status(200).json([]);
        }

        res.status(200).json(conversation.messages);


    } catch (error: any) {
        console.error("Error in getMessages:", error.message);
        res.status(500).json({ error: "Internal server error" });

    }
}

export const getUserForSidebar = async (req: Request, res: Response) => {
    try {
        const authUserId = req.user.id;

        // Get all conversations involving the current user, ordered by most recent update
        const conversations = await prisma.conversation.findMany({
            where: {
                participantIds: {
                    has: authUserId
                }
            },
            orderBy: {
                updateAt: 'desc'
            },
            include: {
                messages: {
                    orderBy: {
                        createAt: 'desc'
                    },
                    take: 1
                }
            }
        });

        // Extract the other participants from each conversation
        const userIdsFromConversations = conversations.map(conversation => {
            return conversation.participantIds.find(id => id !== authUserId);
        }).filter(Boolean); // Filter out any undefined values

        // Get users that aren't in active conversations but still need to be displayed
        const otherUsers = await prisma.user.findMany({
            where: {
                id: {
                    not: authUserId,
                    notIn: userIdsFromConversations as string[]
                }
            },
            select: {
                id: true,
                fullname: true,
                profilePic: true
            }
        });

        // Get all users from the active conversations, preserving the order
        const usersFromConversations = await Promise.all(
            userIdsFromConversations.map(async (userId) => {
                const user = await prisma.user.findUnique({
                    where: { id: userId as string },
                    select: {
                        id: true,
                        fullname: true,
                        profilePic: true
                    }
                });
                return user;
            })
        );

        // Combine the sorted users with the rest of the users
        const allUsers = [...usersFromConversations.filter(Boolean), ...otherUsers];

        res.status(200).json(allUsers);
    } catch (error: any) {
        console.error("Error in getUserForSidebar:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}