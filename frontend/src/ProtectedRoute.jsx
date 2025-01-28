import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext.jsx";

/**
 * A component that wraps protected routes and checks for authentication.
 * If the user is not authenticated (i.e., no auth state or token),
 * they are redirected to the login page.
 *
 * @returns {JSX.Element} The route outlet for authenticated users, or a redirect to the login page for unauthenticated users.
 */
export default function ProtectedRoute() {
  // Extract authState from context (to check if the user is logged in)
  const { authState } = useContext(AuthContext);

  // Check for a token in local storage (as an additional check)
  const authToken = localStorage.getItem("authToken");

  // If the user is not authenticated (no authState and no authToken), redirect to login
  if (!authState && !authToken) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the child routes (Outlet)
  return <Outlet />;
}
