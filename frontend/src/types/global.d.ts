// global.d.ts is a special file. This file contains global types for the application without importing them in every file.

// Define global types here

declare global {
    interface ConversationType {
        id: string;
        fullname: string;
        profilePic: string;
        lastMessage?: string;
        lastMessageTime?: string | null;
    }

    interface MessageType {
        id: string;
        body: string;
        senderId: string;
        receiverId?: string;
        createAt?: string;
        shouldShake?: boolean;
    }
}

export { };