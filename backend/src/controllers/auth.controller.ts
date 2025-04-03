import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import generateToken from '../utils/generateToken.js';

const prisma = new PrismaClient();

export const signup =async(req:Request,res:Response)=>{
    try{
        const {fullname,username,password,confirmPassword,gender} = req.body;

        if(!fullname || !username || !password || !confirmPassword || !gender){
            return res.status(400).json({error:"Please fill all the fields"})
        }

        if(password !== confirmPassword){
            return res.status(400).json({error:"Password and confirm password do not match"})
        }

        const user=await prisma.user.findUnique({
            where:{username}
        })

        if(user){
            return res.status(400).json({error:"Username already exists"})
        }  
        
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const boyProfilePic="https://avatar.iran.liara.run/public/boy?username=[value]";

        const girlProfilePic='https://avatar.iran.liara.run/public/girl?username=[value]';

        const newUser = await prisma.user.create({
            data:{
                fullname,
                username,
                password:hashedPassword,
                gender,
                profilePic:gender === "male" ? boyProfilePic : girlProfilePic,
            }
        });

        if(newUser){
            //generate token in a second
            generateToken(newUser.id,res);
         res.status(201).json({
            id: newUser.id,
            fullname: newUser.fullname,
            username: newUser.username, 
            profilePic: newUser.profilePic,
         })
       }else{
            res.status(400).json({error:"invalid user data"})
        }
}catch(error: any){
        console.log("Error in signup controller",error.message);
        res.status(500).json({error:"Internal server error"})
    }
} 



export const login=async(req:Request,res:Response)=>{
    try {
        // your login logic
        const { username, password } = req.body;
        const user = await prisma.user.findUnique({
            where: { username }})

        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" }); }

        const isPasswordCorrect = await bcryptjs.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        generateToken(user.id, res); 

        res.status(200).json({
            id: user.id,
            fullname: user.fullname,
            username: user.username,
            profilePic: user.profilePic,
        });

    } catch (error: any) {
        console.error("Error in login controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}



export const logout=async(req:Request,res:Response)=>{ try {
        // logout logic
        res.cookie("jwt", "", {
            maxAge: 0})
        res.status(200).json({ message: "Logout successfully" });
    } catch (error: any) {
        console.error("Error in logout controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }}




    export const getMe=async(req:Request,res:Response)=>{
        try {
            const user = await prisma.user.findUnique({
                where: { id: req.user.id }
            });

            if(!user){
               return res.status(200).json({error:"user not found"});
            }

            res.status(200).json({
                id:user.id,
                fullname:user.fullname,
                username:user.username,
                profilePic:user.profilePic,
            });

            
        } catch (error: any) {
            console.error("Error in getMe controller:", error.message);
            res.status(500).json({ error: "Internal server error" });
        }
    }