import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext.jsx";

export default function ProtectedRoute() {
  const { authState } = useContext(AuthContext);
  const authToken = localStorage.getItem("authToken");

  if (!authState && !authToken) {
    
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
