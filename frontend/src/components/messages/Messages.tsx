
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import Message from "./Message";

const Messages = () => {
	const {loading,messages} = useGetMessages();
	return (
		<div className='px-4 flex-1 overflow-auto'>
			{loading && [...Array(3)].map((_ , idx) => <MessageSkeleton  key={idx}/>)}

			{!loading && messages.map((message) => (
				<Message key={message.id} message={message} />
			))}

			{!loading && messages.length === 0 && (
				<p className='text-center text-white'>send a message to start the useConversation</p>
			)}
		</div>
	);
};
export default Messages;
