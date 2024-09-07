import { Outlet, Navigate } from "react-router-dom";
import { useAuthContext } from "../useAuthContext";

export default function PrivateRoute() {
  const { authenticated } = useAuthContext();
  const role = localStorage.getItem("role");

  if (!authenticated || (role !== "admin" && role !== "customer")) {
    return <Navigate to={"/"} />;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
}