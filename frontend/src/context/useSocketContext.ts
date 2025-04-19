import { useContext } from "react";
import { SocketContext, SocketContextType } from "./SocketContextType";

export const useSocketContext = (): SocketContextType => {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error("useSocketContext must be used within a SocketContextProvider");
    }
    return context;
};