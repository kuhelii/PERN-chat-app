import { Send } from "lucide-react";

const MessageInput = () => {
	return (
		<form className='px-4 mb-3'>
			<div className='w-full relative'>
				<input
					type='text'
					className='border-2 text-sm rounded-lg block w-full p-2.5 bg-[#112030] border-gray-600 text-white transition-all duration-300 focus:border-cyan-400 hover:border-cyan-400 focus:outline-none'
					placeholder='Send a message'
				/>
				<button type='submit' className='absolute inset-y-0 end-0 flex items-center pe-3'>
					<Send className='w-6 h-6 text-white' />
				</button>
			</div>
		</form>
	);
};

export default MessageInput;
