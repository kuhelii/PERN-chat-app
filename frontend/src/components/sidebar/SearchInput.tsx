import { Search } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import useConversation from "../../zustand/useConversation";
import useGetConversations from "../../hooks/useGetConversations";

const SearchInput = () => {
    const [search, setSearch] = useState("");
    const { setSelectedConversation } = useConversation();
    const { conversations } = useGetConversations();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!search) return;
        if (search.length < 3) {
            return toast.error("Search term must be at least 3 characters long");
        }

        // Ensure conversations is an array and has the fullname property
        const conversation = conversations?.find((c: any) =>
            c.fullname?.toLowerCase().includes(search.toLowerCase())
        );

        if (conversation) {
            setSelectedConversation(conversation);
            setSearch("");
        } else {
            toast.error("No such user found");
        }
    };

    return (
        <form className="flex items-center gap-2 w-full mx-auto" onSubmit={handleSubmit}>
            <div className="relative w-full">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search chats..."
                    className="w-full pl-5 pr-4 py-2.5 bg-[#112030] text-white placeholder-gray-400 rounded-full border border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300"
                />
            </div>

            <button type="submit" className="btn md:btn-md btn-sm btn-circle bg-sky-500 text-white">
                <Search className="w-4 h-4 md:w-6 md:h-6 outline-none" />
            </button>
        </form>
    );
};

export default SearchInput;

