import { Link } from "react-router-dom";

const Login = () => {
	return (
		<div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
			<div className='w-full p-6 h-full  bg-white-500 rounded-md bg-clip-padding backdrop-filter backdrop-blur-2xl bg-opacity-20 border border-gray-300'>
				<h1 className='text-3xl font-semibold text-center text-gray-500 tracking-wide'>
					Login
					<span className='text-cyan-400 font-bold'> ChatApp</span>
				</h1>

				<form>
					<div className='p-2'>
						<label className='label p-2'>
							<span className='text-base label-text'>Username</span>
						</label>
						<input
							type='text'
							placeholder='👤 alicebob'
							className='w-full px-4 py-2 bg-[#112030] text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400'
						/>
					</div>

					<div className='p-2'>
						<label className='label p-2'>
							<span className='text-base label-text'>Password</span>
						</label>
						<input
							type='password'
							placeholder='🔒 Enter Password'
							className='w-full px-4 py-2 bg-[#112030] text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400'
						/>
					</div>

					<Link
						to='/signup'
						className='text-sm hover:underline text-white hover:text-blue-600 mt-2 inline-block px-2'
					>
						Don't have an account?
					</Link>

					<div>
						<button className='w-full mt-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-md transition duration-200'>
							Login
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Login;
