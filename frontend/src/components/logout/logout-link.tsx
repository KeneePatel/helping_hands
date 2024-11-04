import { LogOutIcon } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../../../Auth/AuthContext";
import { useRouter } from "next/navigation";

export default function LogoutLink() {
    const context = useContext(AuthContext);
    const {signout} = context;
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await signout();
            router.push('/');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-transparent border-none cursor-pointer"
        >
            <LogOutIcon className="w-4 h-4" />
            Logout
        </button>
    );
}
