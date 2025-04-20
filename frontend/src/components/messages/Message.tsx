import { useAuthContext } from "../../context/AuthContext";
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";

const Message = ({ message }: { message: MessageType }) => {
	const {authUser} = useAuthContext();
	const {selectedConversation}=useConversation();

	const fromMe = message?.senderId===authUser?.id;
	const chatClass = fromMe ? "chat-end" : "chat-start";

	
	const img = fromMe
		? authUser?.profilePic 
		: selectedConversation?.profilePic;


	const bubbleBase =
		"text-white text-sm md:text-md px-4 py-2 rounded-2xl max-w-xs md:max-w-md relative";

	const bubbleStyles = fromMe
		? "bg-gradient-to-br from-cyan-500 to-blue-600 before:bg-blue-600"
		: "bg-[#1f2a32] border border-gray-600 before:bg-[#1f2a38]";

		const shakeClass=message.shouldShake? "shake" : "";

	return (
		<div className={`chat ${chatClass}`}>
			<div className='hidden md:block chat-image avatar'>
				<div className='w-6 md:w-10 rounded-full'>
					<img alt='User avatar' src={img} />
				</div>
			</div>

			<div className={`chat-bubble ${bubbleBase} ${bubbleStyles} ${shakeClass}`}>
				{message.body}
			</div>

			<span className='chat-footer opacity-50 text-[10px] md:text-xs flex gap-1 items-center text-white px-1'>
				{extractTime(message.createAt)}
			</span>
		</div>
	);
};

export default Message;
