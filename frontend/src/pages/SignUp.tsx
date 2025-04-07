import { Link } from "react-router-dom";
import GenderCheckbox from "../components/GenderCheckbox";


const SignUp = () => {
	return (
		<div className='flex flex-col items-center justify-center min-w-96 mx-auto '>
			<div className='w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
				<h1 className='text-3xl font-semibold text-center text-gray-500 tracking-wide'>
					Sign Up <span className='text-cyan-400 font-bold'> ChatApp</span>
				</h1>

				<form>
					<div className='p-2'>
						<label className='label p-2'>
							<span className='text-base label-text'>Full Name</span>
						</label>
						<input type='text' placeholder='👤 Alice Bob' className='w-full px-4 py-2 bg-[#112030] text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400' />
					</div>

					<div>
						<label className='label p-2 '>
							<span className='text-base label-text'>Username</span>
						</label>
						<input type='text' placeholder='alicebob' className='w-full px-4 py-2 bg-[#112030] text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400' />
					</div>

					<div >
						<label className='label p-2'>
							<span className='text-base label-text'>Password</span>
						</label>
						<input
							type='password'
							placeholder='Enter Password'
							className='w-full px-4 py-2 bg-[#112030] text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400'
						/>
					</div>

					<div >
						<label className='label p-2'>
							<span className='text-base label-text'>Confirm Password</span>
						</label>
						<input
							type='password'
							placeholder='Confirm Password'
							className='w-full px-4 py-2 bg-[#112030] text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400'
						/>
					</div>

					<GenderCheckbox />

					<Link
						to={"/login"}
						className='text-sm hover:underline hover:text-blue-600 mt-2 inline-block text-white'
					>
						Already have an account?
					</Link>

					<div>
						<button className='w-full mt-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-md transition duration-200'>Sign Up</button>
					</div>
				</form>
			</div>
		</div>
	);
};
export default SignUp;
