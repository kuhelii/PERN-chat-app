import { create } from "zustand";

//this all types are write in my types folder global.d.ts file:

//  export type ConversationType = {
//     id:string;
//     fullname:string;
//     profilePic:string;
// }

// type MessageType={
//     id:string;
//     body:string;
//     senderId:string;
// }

interface ConversationState {
    selectedConversation: ConversationType | null;
    setSelectedConversation: (conversation: ConversationType | null) => void;
    messages: MessageType[];
    setMessages: (
        messages: MessageType[] | ((prevMessages: MessageType[]) => MessageType[])
    ) => void;
    lastMessagesFetched: boolean;
    setLastMessagesFetched: (status: boolean) => void;
}

const useConversation = create<ConversationState>((set) => ({
    selectedConversation: null,
    setSelectedConversation: (conversation) => set({ selectedConversation: conversation }),
    messages: [],
    setMessages: (messages) =>
        set((state) => ({
            messages: typeof messages === "function" ? messages(state.messages) : messages,
        })),
    lastMessagesFetched: false,
    setLastMessagesFetched: (status) => set({ lastMessagesFetched: status }),
}));

export default useConversation;