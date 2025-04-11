import { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import toast from "react-hot-toast";


type signupInputs = {
    id: string; 
    fullname: string;
    email: string;
    profilePic: string;    
    gender: string;
};


const useSignup = () => {
    const [loading, setLoading] = useState(false);
    const {setAuthUser} = useAuthContext();

    const signup =async(inputs:signupInputs) => {
        try{
            setLoading(true);
            const res=await fetch("/api/auth/signup", {
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify(inputs),
            });
            const data=await res.json();
            if(!res.ok){
                throw new Error(data.error || "Failed to signup");
            }
            setAuthUser(data);

        }catch(error:any){
            console.error(error.message);
            toast.error(error.message);
            
    }finally{
            setLoading(false);
        }
    }
    return { loading,signup };
}

export default useSignup;
