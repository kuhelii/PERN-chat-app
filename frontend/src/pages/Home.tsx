import MessageContainer from "../components/messages/MessageContainer";
import Sidebar from "../components/sidebar/Sidebar";

const Home = () => {
	return (
		<div className='flex h-[80vh] w-full md:max-w-screen-md md:h-[550px] p-6   bg-white-500 rounded-md bg-clip-padding backdrop-filter backdrop-blur-2xl bg-opacity-20 border border-gray-300'>
			<Sidebar />
			<MessageContainer />
		</div>
	);
};
export default Home;
