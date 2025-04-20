import { useSocketContext } from "../../context/SocketContext";
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";

const Conversation = ({
  conversation,
//   emoji,
}: {
  conversation: ConversationType;
//   emoji: string;
}) => {
  const { setSelectedConversation, selectedConversation } = useConversation();
  const isSelected = selectedConversation?.id === conversation.id;

  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(conversation.id);

  // Function to truncate message if it's too long
  const truncateMessage = (message: string, maxLength = 25) => {
    if (!message) return "";
    return message.length > maxLength
      ? `${message.substring(0, maxLength)}...`
      : message;
  };

  return (
    <>
      <div
        className={`flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer ${
          isSelected ? "bg-sky-500" : ""
        }`}
        onClick={() => setSelectedConversation(conversation)}
      >
        <div className="relative">
          <div className="avatar">
            <div className="w-8 md:w-12 rounded-full">
              <img src={conversation.profilePic} alt="user avatar" />
            </div>
          </div>
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          )}
        </div>

        <div className="flex flex-col flex-1">
          <div className="flex gap-3 justify-between">
            <p className="font-bold text-gray-200 text-sm md:text-md">
              {conversation.fullname}
            </p>
            {/* <span className="text-xl hidden md:inline-block">{emoji}</span> */}
          </div>
          {conversation.lastMessage && (
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-300">
                {truncateMessage(conversation.lastMessage)}
              </p>
              {conversation.lastMessageTime && (
                <span className="text-xs text-gray-400">
                  {extractTime(conversation.lastMessageTime)}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="divider my-0 py-0 h-1" />
    </>
  );
};
export default Conversation;
