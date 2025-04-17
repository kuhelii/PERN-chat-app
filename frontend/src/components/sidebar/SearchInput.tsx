import { Search } from "lucide-react";


const SearchInput = () => {
	return (
		<form className='flex items-center gap-2 w-full  mx-auto '>
			<div className='relative w-full'>
				<input
					type='text'
					placeholder='Search chats...'
					className='w-full pl-5 pr-4 py-2.5 bg-[#112030] text-white placeholder-gray-400 rounded-full border border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300'
				/>
				
			</div>

			<button type='submit' className='btn md:btn-md btn-sm btn-circle bg-sky-500 text-white  '>
				<Search className='w-4 h-4 md:w-6 md:h-6 outline-none' />
			</button>
		</form>
	);
};

export default SearchInput;

