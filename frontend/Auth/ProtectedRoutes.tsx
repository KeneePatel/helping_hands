"use client";

import { AuthContext } from "./AuthContext";
import { useRouter } from "next/navigation";
import {ReactNode, useContext, useEffect} from "react";

type ProtectRouteProps = {
    children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectRouteProps) => {
    const context = useContext(AuthContext);

    // @ts-ignore
    const { isAuthenticated, setIsAuthenticated } = context;

    const router = useRouter();

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            router.push("/");
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
