import { Outlet, Navigate } from "react-router-dom";
import { useAuthContext } from "../authContext";

export default function ProtectedRoute() {
    const { authenticated } = useAuthContext();

    if (authenticated) {
        return <Navigate to={"/"} />;
    }

    return (
        <div>
            <Outlet />
        </div>
    );
}