import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from "react";
import toast from "react-hot-toast";

// Type for authenticated user
type AuthUserType = {
	id: string;
	fullname: string;
	email: string;
	profilePic: string;
	gender: string;
};

// Type for context value
type AuthContextType = {
	authUser: AuthUserType | null;
	setAuthUser: Dispatch<SetStateAction<AuthUserType | null>>;
	isLoading: boolean;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
	authUser: null,
	setAuthUser: () => {
		throw new Error("setAuthUser called outside of AuthContextProvider");
	},
	isLoading: true,
});

// Hook to consume context
export const useAuthContext = () => {
	return useContext(AuthContext);
};

// Context Provider
export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
	const [authUser, setAuthUser] = useState<AuthUserType | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchAuthUser = async () => {
			try {
				const res = await fetch("/api/auth/me");
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error );
				}

				setAuthUser(data);
			} catch (error:any) {
				console.log( error);
                toast.error(error.message);
			} finally {
				setIsLoading(false);
			}
		};

		fetchAuthUser();
	}, []);

	return (
		<AuthContext.Provider 
        value={{ authUser, isLoading, setAuthUser }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContext;
