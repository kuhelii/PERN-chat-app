import { Link } from "react-router-dom";
import GenderCheckbox from "../components/GenderCheckbox";
import { useState } from "react";
import useSignup from "../hooks/useSignup";


const SignUp = () => {

	const [inputs,setInputs]=useState({
		fullname:"",
		username:"",
		password:"",
		confirmPassword:"",
		gender:"",
		id: "",
		email: "",
		profilePic: ""
	});

	const {loading,signup}=useSignup();

	const handleCheckboxChange=(gender:"male"| "female")=>
{
	setInputs({...inputs,gender});
};

const handleSubmitForm=(e:React.FormEvent)=>{
	e.preventDefault();
	signup(inputs);
}

	return (
		<div className='flex flex-col items-center justify-center min-w-96 mx-auto '>
			<div className='w-full p-6 h-full  bg-white-00 rounded-md bg-clip-padding backdrop-filter backdrop-blur-2xl bg-opacity-20 border border-gray-300'>
				<h1 className='text-3xl font-semibold text-center text-gray-500 tracking-wide'>
					Sign Up <span className='text-cyan-400 font-bold'> ChatApp</span>
				</h1>

				<form onSubmit={(handleSubmitForm)}>
					<div className='p-2'>
						<label className='label p-2'>
							<span className='text-base label-text'>Full Name</span>
						</label>
						<input type='text' placeholder='👤 Alice Bob' className='w-full px-4 py-2 bg-[#112030] text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400'
						value={inputs.fullname}
						onChange={(e)=> setInputs({...inputs,fullname:e.target.value})}
						/>
					</div>

					<div>
						<label className='label p-2 '>
							<span className='text-base label-text'>Username</span>
						</label>
						<input type='text' placeholder='alicebob' className='w-full px-4 py-2 bg-[#112030] text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400'
						value={inputs.username}
						onChange={(e)=> setInputs({...inputs,username:e.target.value})}
						/>
					</div>

					<div >
						<label className='label p-2'>
							<span className='text-base label-text'>Password</span>
						</label>
						<input
							type='password'
							placeholder='Enter Password'
							className='w-full px-4 py-2 bg-[#112030] text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400'
							value={inputs.password}
						onChange={(e)=> setInputs({...inputs,password:e.target.value})}
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
							value={inputs.confirmPassword}
						onChange={(e)=> setInputs({...inputs,confirmPassword:e.target.value})}
						/>
					</div>

					<GenderCheckbox 
					selectedGender={inputs.gender}
					onCheckboxChange={handleCheckboxChange}
					/>

					<Link
						to={"/login"}
						className='text-sm hover:underline hover:text-blue-600 mt-2 inline-block text-white'
					>
						Already have an account?
					</Link>

					<div>
						<button className='w-full mt-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-md transition duration-200' disabled ={loading}>
							{loading ? "Loading...":"Sign up"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
export default SignUp;
