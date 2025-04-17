// global.d.ts is a special file. This file contains global types for the application without importing them in every file.

type ConversationType = {
    id:string;
    fullname:string;
    profilePic:string;
}

type MessageType={
    id:string;
    body:string;
    senderId:string;
    createAt:string;
}